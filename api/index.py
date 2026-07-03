import logging, jwt, httpx, zipfile, io, os
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional

# --- Base Models ---
class AddressDetails(BaseModel):
    care_of: Optional[str] = None
    house: Optional[str] = None
    street: Optional[str] = None
    locality: Optional[str] = None
    vtc: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class EKycResponse(BaseModel):
    reference_id: str
    name: str
    dob: str
    gender: str
    address: AddressDetails
    photo_base64: Optional[str] = None

class RegisterRequest(BaseModel):
    reference_id: str
    name: str
    dob: str
    gender: str
    state: str
    mobile: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    mobile: str
    password: str
    role: str

# --- App Setup ---
# On Vercel, the app is expected to be named `app`
app = FastAPI()

# Allow CORS for local dev and production
origins = ["*"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

secret_key = 'heK4w-rrU72qIuGNMerPm762yPayLkvRisjsU-R9ZTs'
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logging.basicConfig(level=logging.INFO)

def get_password_hash(password):
    return pwd_context.hash(password)

async def go_microservice_request(request: Request, method: str, endpoint: str, data: dict = None):
    # Construct the absolute URL using the incoming request's base URL
    # This works identically on Vercel and locally
    base_url = str(request.base_url).rstrip('/')
    url = f"{base_url}/api/go{endpoint}"
    
    async with httpx.AsyncClient() as client:
        try:
            if method == "POST":
                response = await client.post(url, json=data, timeout=10.0)
            elif method == "GET":
                response = await client.get(url, timeout=10.0)
                
            if response.status_code >= 400:
                logging.error(f"Go API Error ({response.status_code}): {response.text}")
                raise HTTPException(status_code=response.status_code, detail=response.json())
            return response.json()
        except httpx.RequestError as e:
            logging.error(f"Request error calling Go API at {url}: {e}")
            raise HTTPException(status_code=500, detail=f"Internal Server Error calling Go microservice: {str(e)}")

@app.post("/api/ekyc/upload", response_model=EKycResponse)
async def process_ekyc_zip(file: UploadFile = File(...), share_code: str = Form(...)):
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Must be a ZIP file")

    try:
        file_bytes = await file.read()
        zip_file = zipfile.ZipFile(io.BytesIO(file_bytes))
        password_bytes = share_code.encode('utf-8')
        
        xml_filename = zip_file.namelist()[0]
        with zip_file.open(xml_filename, pwd=password_bytes) as xml_file:
            xml_content = xml_file.read()
            
        root = ET.fromstring(xml_content)
        
        uid_data = None
        for child in root:
            if child.tag.endswith('UidData'):
                uid_data = child
                break
                
        if uid_data is None:
            raise ValueError("Invalid XML Structure: UidData missing")

        poi = uid_data.find('.//*[local-name()="Poi"]')
        poa = uid_data.find('.//*[local-name()="Poa"]')
        pht = uid_data.find('.//*[local-name()="Pht"]')

        address = AddressDetails(
            care_of=poa.attrib.get('co'), house=poa.attrib.get('house'),
            street=poa.attrib.get('street'), locality=poa.attrib.get('loc'),
            vtc=poa.attrib.get('vtc'), district=poa.attrib.get('dist'),
            state=poa.attrib.get('state'), pincode=poa.attrib.get('pc')
        )

        return EKycResponse(
            reference_id=root.attrib.get('referenceId', ''),
            name=poi.attrib.get('name', ''),
            dob=poi.attrib.get('dob', ''),
            gender=poi.attrib.get('gender', ''),
            address=address,
            photo_base64=pht.text if pht is not None else None
        )

    except RuntimeError as e:
        if 'Bad password' in str(e):
            raise HTTPException(status_code=401, detail="Invalid share code")
        raise HTTPException(status_code=400, detail="Failed to open ZIP file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/register")
async def register(request: Request, user_data: RegisterRequest):
    hashed_pwd = get_password_hash(user_data.password)
    payload = user_data.model_dump()
    payload['password'] = hashed_pwd 
    
    result = await go_microservice_request(request, "POST", "/register", payload)
    return {"success": True, "message": "Registration successful", "data": result}

@app.post("/api/login")
async def login(request: Request, credentials: LoginRequest):
    try:
        go_response = await go_microservice_request(request, "POST", "/login", credentials.model_dump())
        stored_hash = go_response.get("password_hash")
        
        if not stored_hash:
            return {"success": False, "message": "Invalid user credentials"}
        
        if not pwd_context.verify(credentials.password, stored_hash):
            return {"success": False, "message": "Invalid Password"}
            
        if go_response.get("role") != credentials.role:
            return {"success": False, "message": f"User is not registered as a {credentials.role}"}
            
        expire = datetime.now(timezone.utc) + timedelta(hours=24)
        token = jwt.encode({"ref": go_response["reference_id"], "role": go_response["role"], "exp": expire}, secret_key, algorithm='HS256')
        
        return {
            "success": True, "token": token, 
            "reference_id": go_response["reference_id"], "name": go_response["name"]
        }
    except HTTPException as e:
        if e.status_code == 404:
            return {"success": False, "message": "User not found"}
        return {"success": False, "message": f"Server Error: {e.detail}"}
    except Exception as e:
        return {"success": False, "message": f"Unknown Error: {str(e)}"}

@app.get("/api/worker/benefits/{reference_id}")
async def get_worker_benefits(request: Request, reference_id: str):
    return await go_microservice_request(request, "GET", f"/worker/benefits/{reference_id}")

@app.get("/api/worker/union-history/{reference_id}")
async def get_union_history(request: Request, reference_id: str):
    return await go_microservice_request(request, "GET", f"/worker/union-history/{reference_id}")

@app.get("/api/worker/labour-boards/{reference_id}")
async def get_labour_boards(request: Request, reference_id: str):
    return await go_microservice_request(request, "GET", f"/worker/labour-boards/{reference_id}")

@app.get("/api/worker/profile/{reference_id}")
async def get_worker_profile(request: Request, reference_id: str):
    return await go_microservice_request(request, "GET", f"/worker/profile/{reference_id}")
