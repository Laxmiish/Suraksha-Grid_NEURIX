// src/frontend/registrationPage.jsx

import React, { useState } from "react";
import { generateEKYCKey, registerUser } from "../api/api.jsx";

const Register = () => {
  const [step, setStep] = useState(1); // 1: Aadhaar, 2: eKYC Generated, 3: Success
  const [aadhaar, setAadhaar] = useState("");
  const [ekycKey, setEkycKey] = useState("");
  const [zip, setZip] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [copied, setCopied] = useState({ zip: false, pass: false });

  // Step 1: Aadhaar se eKYC generate karo — zip & password auto-generate hoga
  const handleGenerateKYC = async () => {
    if (aadhaar.length !== 12) {
      setMessage("12-digit Aadhaar number daalo");
      setMessageType("error");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const result = await generateEKYCKey(aadhaar);
      if (result.success) {
        setEkycKey(result.ekycKey);

        // Auto-generate ZIP from eKYC key (first 6 chars numeric hash)
        const autoZip = result.ekycKey
          .replace(/\D/g, "")
          .slice(0, 6)
          .padEnd(6, "0");

        // Auto-generate Password from eKYC key (strong format)
        const autoPass = "SG@" + result.ekycKey.slice(0, 5).toUpperCase() + aadhaar.slice(-4);

        setZip(autoZip);
        setPassword(autoPass);
        setStep(2);
        setMessage("eKYC Key generate ho gayi! Apni credentials save kar lo.");
        setMessageType("success");
      } else {
        setMessage("eKYC generate nahi hui, dobara try karo");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server error - eKYC generate nahi hui");
      setMessageType("error");
    }
    setLoading(false);
  };

  // Step 2: Register karo with auto-generated credentials
  const handleRegister = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await registerUser({ aadhaar, ekycKey, zip, password });
      if (result.success) {
        setStep(3);
        setMessage("Registration successful!");
        setMessageType("success");
      } else {
        setMessage("Registration fail ho gayi, dobara try karo");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server error during registration");
      setMessageType("error");
    }
    setLoading(false);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#1a3a8f",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,10px) scale(0.97)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,20px) scale(1.04)} 66%{transform:translate(20px,-15px) scale(0.98)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(15px,25px) scale(1.03)} 66%{transform:translate(-10px,-20px) scale(0.96)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .spin { animation: spin 1s linear infinite; }
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          padding: 14px 16px 14px 44px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          letter-spacing: 1px;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.45); }
        .input-field:focus { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.18); }
        .input-field.error-border { border-color: #DC2626; }
        .input-field.success-border { border-color: #16A34A; }
        .btn-primary {
          width: 100%; padding: 14px; border-radius: 12px; border: none;
          background: white; color: #1a3a8f; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.2s; letter-spacing: 1px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-success {
          width: 100%; padding: 14px; border-radius: 12px; border: none;
          background: #16A34A; color: white; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.2s; letter-spacing: 1px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-success:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        .btn-success:disabled { opacity: 0.6; cursor: not-allowed; }
        .copy-btn {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          color: white; border-radius: 8px; padding: 4px 10px; font-size: 12px;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .copy-btn:hover { background: rgba(255,255,255,0.25); }
        .credential-box {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
      `}</style>

      {/* Blobs */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-10%", left:"-5%", width:"50%", height:"60%", borderRadius:"50%", background:"rgba(100,130,255,0.35)", animation:"blob1 8s ease-in-out infinite", filter:"blur(2px)" }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"55%", height:"55%", borderRadius:"50%", background:"rgba(80,110,255,0.3)", animation:"blob2 10s ease-in-out infinite", filter:"blur(2px)" }} />
        <div style={{ position:"absolute", top:"30%", right:"10%", width:"35%", height:"40%", borderRadius:"50%", background:"rgba(120,150,255,0.2)", animation:"blob3 12s ease-in-out infinite", filter:"blur(4px)" }} />
      </div>

      {/* Card */}
      <div className="fade-up" style={{
        position:"relative", zIndex:10, width:"100%", maxWidth:"440px",
        margin:"20px", background:"rgba(30,60,160,0.55)", backdropFilter:"blur(24px)",
        WebkitBackdropFilter:"blur(24px)", borderRadius:"24px",
        border:"1.5px solid rgba(255,255,255,0.2)", padding:"40px 36px",
        boxShadow:"0 25px 60px rgba(0,0,0,0.3)",
      }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{
            width:"60px", height:"60px", borderRadius:"16px",
            background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"26px", margin:"0 auto 14px",
          }}>🛡️</div>
          <h1 style={{ color:"white", fontSize:"20px", fontWeight:"800", margin:0 }}>Suraksha Grid</h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"5px 0 0" }}>
            Worker Registration Portal
          </p>
        </div>

        {/* Step dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"24px" }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              height:"8px", borderRadius:"4px", transition:"all 0.3s",
              width: s === step ? "28px" : "8px",
              background: s < step ? "#16A34A" : s === step ? "white" : "rgba(255,255,255,0.25)",
            }} />
          ))}
        </div>

        {/* ── STEP 1: Aadhaar Enter Karo ── */}
        {step === 1 && (
          <div className="fade-up">
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"12px", textAlign:"center", marginBottom:"20px", letterSpacing:"1px" }}>
              STEP 1 — AADHAAR VERIFY KARO
            </p>

            <div style={{ position:"relative", marginBottom:"6px" }}>
              <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"18px", opacity:0.7 }}>🪪</span>
              <input
                className={`input-field ${message && messageType==="error" ? "error-border" : aadhaar.length===12 ? "success-border" : ""}`}
                type="text"
                maxLength="12"
                value={aadhaar}
                onChange={(e) => { setAadhaar(e.target.value.replace(/\D/g,"")); setMessage(""); }}
                placeholder="12-digit Aadhaar Number"
              />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
              <span style={{ fontSize:"12px", color: messageType==="error" ? "#fca5a5" : "rgba(255,255,255,0.4)" }}>
                {messageType==="error" ? message : "Sirf numbers daalo"}
              </span>
              <span style={{ fontSize:"12px", color: aadhaar.length===12 ? "#86efac" : "rgba(255,255,255,0.4)" }}>
                {aadhaar.length}/12
              </span>
            </div>

            <button className="btn-primary" onClick={handleGenerateKYC} disabled={loading || aadhaar.length !== 12}>
              {loading ? (
                <>
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#1a3a8f" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#1a3a8f" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Generate ho raha hai...
                </>
              ) : "eKYC Key Generate Karo 🔐"}
            </button>

            <p style={{ textAlign:"center", fontSize:"12px", color:"rgba(255,255,255,0.4)", marginTop:"16px" }}>
              Pehle se account hai?{" "}
              <a href="/" style={{ color:"rgba(255,255,255,0.8)", textDecoration:"underline", cursor:"pointer" }}>Login karo</a>
            </p>
          </div>
        )}

        {/* ── STEP 2: Credentials Show & Register ── */}
        {step === 2 && (
          <div className="fade-up">
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"12px", textAlign:"center", marginBottom:"16px", letterSpacing:"1px" }}>
              STEP 2 — APNI CREDENTIALS SAVE KARO
            </p>

            {/* Warning */}
            <div style={{
              background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.4)",
              borderRadius:"12px", padding:"12px 14px", marginBottom:"16px",
              display:"flex", gap:"10px", alignItems:"flex-start"
            }}>
              <span style={{ fontSize:"18px" }}>⚠️</span>
              <p style={{ color:"#fde68a", fontSize:"12px", margin:0, lineHeight:1.5 }}>
                Ye credentials sirf ek baar dikhenge! Inhe abhi save kar lo — login ke liye zaroori hain.
              </p>
            </div>

            {/* eKYC Key */}
            <div className="credential-box">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px" }}>eKYC KEY</span>
                <button className="copy-btn" onClick={() => copyToClipboard(ekycKey, "ekyc")}>
                  {copied.ekyc ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <p style={{ color:"#86efac", fontSize:"13px", fontFamily:"monospace", margin:0, wordBreak:"break-all", lineHeight:1.6 }}>
                {ekycKey}
              </p>
            </div>

            {/* ZIP */}
            <div className="credential-box">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px" }}>ZIP CODE</span>
                <button className="copy-btn" onClick={() => copyToClipboard(zip, "zip")}>
                  {copied.zip ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <p style={{ color:"white", fontSize:"18px", fontFamily:"monospace", fontWeight:"700", margin:0, letterSpacing:"4px" }}>
                {zip}
              </p>
            </div>

            {/* Password */}
            <div className="credential-box">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px" }}>PASSWORD</span>
                <button className="copy-btn" onClick={() => copyToClipboard(password, "pass")}>
                  {copied.pass ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <p style={{ color:"white", fontSize:"14px", fontFamily:"monospace", fontWeight:"600", margin:0, letterSpacing:"2px" }}>
                {password}
              </p>
            </div>

            {messageType === "error" && (
              <p style={{ color:"#fca5a5", fontSize:"12px", marginBottom:"12px", textAlign:"center" }}>{message}</p>
            )}

            <button className="btn-success" onClick={handleRegister} disabled={loading} style={{ marginTop:"4px" }}>
              {loading ? (
                <>
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Register ho raha hai...
                </>
              ) : "Register Karo ✅"}
            </button>

            <button onClick={() => { setStep(1); setMessage(""); setEkycKey(""); setZip(""); setPassword(""); }}
              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:"13px", width:"100%", marginTop:"12px", textAlign:"center" }}>
              ← Dobara try karo
            </button>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="fade-up" style={{ textAlign:"center" }}>
            <div style={{ fontSize:"60px", marginBottom:"16px", animation:"pulse 1s ease 3" }}>🎉</div>
            <h2 style={{ color:"white", fontSize:"20px", fontWeight:"800", margin:"0 0 8px" }}>
              Registration Successful!
            </h2>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", marginBottom:"28px", lineHeight:1.6 }}>
              Suraksha Grid mein aapka swagat hai!<br/>
              Ab apni eKYC Key se login kar sakte ho.
            </p>
            <div style={{
              background:"rgba(22,163,74,0.15)", border:"1px solid rgba(22,163,74,0.4)",
              borderRadius:"12px", padding:"14px", marginBottom:"24px"
            }}>
              <p style={{ color:"#86efac", fontSize:"12px", margin:0 }}>
                🔐 Login ke liye apni eKYC Key use karo:<br/>
                <span style={{ fontFamily:"monospace", fontSize:"11px", opacity:0.8, wordBreak:"break-all" }}>{ekycKey}</span>
              </p>
            </div>
            <a href="/" style={{
              display:"block", width:"100%", padding:"14px", borderRadius:"12px",
              background:"white", color:"#1a3a8f", fontWeight:"700", fontSize:"15px",
              textDecoration:"none", boxSizing:"border-box", transition:"all 0.2s",
              letterSpacing:"1px",
            }}>
              Login Karo →
            </a>
          </div>
        )}

        <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(255,255,255,0.25)", marginTop:"24px" }}>
          🔒 Secured by Aadhaar eKYC • Suraksha Grid © 2024
        </p>
      </div>
    </div>
  );
};

export default Register;