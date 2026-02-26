// src/frontend/SupervisorDashboard.jsx
// KEY DIFFERENCE vs Contractor:
// - Supervisor can ADD existing worker accounts (by eKYC key) but CANNOT create new accounts
// - No Finance/Payments section
// - No Proposals section
// - Read-only view on projects (cannot edit/create)
// - Can manage workers, attendance, tasks under assigned projects only

import React, { useState } from "react";

// ── MOCK DATA ──────────────────────────────────────────────
const supervisor = {
  name: "Rajesh Sharma",
  assignedBy: "Mehta Constructions Pvt Ltd",
  ekycKey: "SG-S4R7N-2291",
  rating: 4.5,
  score: 88,
  since: "2021",
  role: "Site Supervisor",
};

const assignedProjects = [
  { id:1, name:"NH-48 Highway Expansion", contractor:"Mehta Constructions", status:"In Progress", deadline:"Mar 2025", progress:65, workers:24, location:"Pune" },
  { id:2, name:"Residential Complex Block-B", contractor:"Mehta Constructions", status:"In Progress", deadline:"Jun 2025", progress:40, workers:18, location:"Mumbai" },
  { id:3, name:"Metro Station Renovation", contractor:"Mehta Constructions", status:"On Hold", deadline:"Aug 2025", progress:20, workers:0, location:"Mumbai" },
];

const workers = [
  { id:1, name:"Ramesh Kumar", ekycKey:"SG-W1A2B-1234", role:"Mason", attendance:92, task:"Foundation Work", progress:80, phone:"98XX XXXX 01", status:"Active" },
  { id:2, name:"Suresh Yadav", ekycKey:"SG-W2C3D-2345", role:"Carpenter", attendance:85, task:"Shuttering", progress:60, phone:"98XX XXXX 02", status:"Active" },
  { id:3, name:"Mohan Lal", ekycKey:"SG-W3E4F-3456", role:"Helper", attendance:78, task:"Material Loading", progress:45, phone:"98XX XXXX 03", status:"Active" },
  { id:4, name:"Dinesh Patel", ekycKey:"SG-W4G5H-4567", role:"Electrician", attendance:95, task:"Wiring Phase-1", progress:90, phone:"98XX XXXX 04", status:"Active" },
  { id:5, name:"Anil Singh", ekycKey:"SG-W5I6J-5678", role:"Plumber", attendance:88, task:"Drainage Layout", progress:70, phone:"98XX XXXX 05", status:"Active" },
];

const meetings = [
  { title:"Site Visit — NH-48", date:"28 Feb", time:"9:00 AM", type:"Site Visit", icon:"🚧" },
  { title:"Daily Standup", date:"01 Mar", time:"8:00 AM", type:"Meeting", icon:"👥" },
  { title:"Safety Inspection", date:"05 Mar", time:"10:00 AM", type:"Audit", icon:"🔍" },
  { title:"Progress Review — Contractor", date:"10 Mar", time:"3:00 PM", type:"Review", icon:"📊" },
];

const documents = [
  { name:"NH-48 Blueprint v3", type:"DWG", size:"8.1 MB", date:"Feb 2025", icon:"📐", canDelete:false },
  { name:"Work Report - Jan 2025", type:"PDF", size:"1.2 MB", date:"Jan 2025", icon:"📊", canDelete:true },
  { name:"Safety Compliance Cert", type:"PDF", size:"0.8 MB", date:"Dec 2024", icon:"🛡️", canDelete:false },
  { name:"Daily Progress Log", type:"PDF", size:"0.5 MB", date:"Feb 2025", icon:"📋", canDelete:true },
];

const feedback = [
  { from:"Contractor", project:"NH-48", rating:5, comment:"Excellent supervision, workers well managed", date:"Feb 2025" },
  { from:"Contractor", project:"Residential Block-B", rating:4, comment:"Good coordination, minor communication gaps", date:"Jan 2025" },
];

const SIDEBAR_ITEMS = [
  { id:"overview",   icon:"📊", label:"Overview" },
  { id:"projects",   icon:"🏗️", label:"My Projects" },
  { id:"workers",    icon:"👷", label:"Workers" },
  { id:"schedule",   icon:"📅", label:"Schedule" },
  { id:"documents",  icon:"📁", label:"Documents" },
  { id:"feedback",   icon:"⭐", label:"Feedback" },
  { id:"settings",   icon:"⚙️", label:"Settings" },
];

const STATUS_STYLE = {
  "In Progress":     { bg:"rgba(37,99,235,0.2)",  color:"#93c5fd",  border:"rgba(37,99,235,0.4)" },
  "Completed":       { bg:"rgba(22,163,74,0.2)",  color:"#86efac",  border:"rgba(22,163,74,0.4)" },
  "On Hold":         { bg:"rgba(245,158,11,0.2)", color:"#fde68a",  border:"rgba(245,158,11,0.4)" },
  "Active":          { bg:"rgba(22,163,74,0.2)",  color:"#86efac",  border:"rgba(22,163,74,0.4)" },
  "Added":           { bg:"rgba(139,92,246,0.2)", color:"#c4b5fd",  border:"rgba(139,92,246,0.4)" },
};

function Badge({ status }) {
  const s = STATUS_STYLE[status] || { bg:"rgba(255,255,255,0.1)", color:"white", border:"rgba(255,255,255,0.2)" };
  return (
    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"700", letterSpacing:"0.4px", background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
      {status}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i<=rating ? "#fbbf24" : "rgba(255,255,255,0.2)", fontSize:"14px" }}>★</span>
      ))}
    </span>
  );
}

function ProgressBar({ value, color="#2563EB" }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:"99px", height:"6px", overflow:"hidden" }}>
      <div style={{ width:`${value}%`, height:"100%", borderRadius:"99px", background:color, transition:"width 0.5s ease" }} />
    </div>
  );
}

// ── ADD WORKER MODAL ───────────────────────────────────────
function AddWorkerModal({ onClose, onAdd }) {
  const [ekycInput, setEkycInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    // Mock: simulate finding a worker by eKYC key
    if (ekycInput.startsWith("SG-")) {
      setSearchResult({ name:"Vikram Tiwari", role:"Mason", aadhaar:"XXXX XXXX 7823", status:"Available" });
    } else {
      setSearchResult(null);
    }
    setSearched(true);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}>
      <div style={{ background:"#1a3a8f", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:"20px", padding:"28px", width:"100%", maxWidth:"420px", margin:"20px", boxShadow:"0 25px 60px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <div>
            <h3 style={{ color:"white", fontSize:"16px", fontWeight:"800", margin:0 }}>Worker Account Add Karo</h3>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", margin:"4px 0 0" }}>eKYC Key se existing worker dhundo</p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px", color:"white", width:"32px", height:"32px", cursor:"pointer", fontSize:"16px" }}>✕</button>
        </div>

        {/* Important Notice */}
        <div style={{ background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.35)", borderRadius:"12px", padding:"12px 14px", marginBottom:"18px", display:"flex", gap:"10px" }}>
          <span style={{ fontSize:"18px" }}>ℹ️</span>
          <p style={{ color:"#fde68a", fontSize:"12px", margin:0, lineHeight:1.5 }}>
            <strong>Supervisor Permission:</strong> Aap sirf existing worker accounts add kar sakte ho. Naye accounts banana contractor ka kaam hai.
          </p>
        </div>

        {/* eKYC Search */}
        <div style={{ marginBottom:"12px" }}>
          <label style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"0.5px", display:"block", marginBottom:"6px" }}>WORKER eKYC KEY DAALO</label>
          <div style={{ display:"flex", gap:"8px" }}>
            <input
              value={ekycInput}
              onChange={e => { setEkycInput(e.target.value); setSearched(false); setSearchResult(null); }}
              placeholder="SG-XXXXX-XXXX"
              style={{ flex:1, background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:"10px", padding:"11px 14px", color:"white", fontSize:"14px", outline:"none", fontFamily:"monospace" }}
            />
            <button
              onClick={handleSearch}
              disabled={ekycInput.length < 5}
              style={{ padding:"11px 16px", background:"white", color:"#1a3a8f", border:"none", borderRadius:"10px", fontWeight:"700", fontSize:"13px", cursor:"pointer", opacity:ekycInput.length<5?0.5:1 }}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Search Result */}
        {searched && !searchResult && (
          <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:"10px", padding:"12px", marginBottom:"14px" }}>
            <p style={{ color:"#fca5a5", fontSize:"13px", margin:0 }}>❌ Koi worker nahi mila is eKYC key se. Sahi key daalo.</p>
          </div>
        )}

        {searched && searchResult && (
          <div style={{ background:"rgba(22,163,74,0.1)", border:"1px solid rgba(22,163,74,0.3)", borderRadius:"12px", padding:"14px", marginBottom:"16px" }}>
            <p style={{ color:"#86efac", fontSize:"11px", letterSpacing:"0.5px", margin:"0 0 8px" }}>✅ WORKER MILA:</p>
            <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
              <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:"rgba(22,163,74,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>👷</div>
              <div>
                <p style={{ color:"white", fontWeight:"700", fontSize:"14px", margin:0 }}>{searchResult.name}</p>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"2px 0 0" }}>{searchResult.role} &nbsp;•&nbsp; Aadhaar: {searchResult.aadhaar}</p>
              </div>
              <Badge status={searchResult.status} />
            </div>
            <button
              onClick={() => { onAdd(searchResult); onClose(); }}
              style={{ width:"100%", marginTop:"12px", padding:"11px", background:"#16A34A", color:"white", border:"none", borderRadius:"10px", fontWeight:"700", fontSize:"13px", cursor:"pointer" }}
            >
              ✅ Is Worker Ko Add Karo
            </button>
          </div>
        )}

        <button onClick={onClose} style={{ width:"100%", padding:"11px", background:"transparent", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:"10px", color:"rgba(255,255,255,0.6)", fontWeight:"600", fontSize:"13px", cursor:"pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function SupervisorDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [workerList, setWorkerList] = useState(workers);
  const [notifications] = useState(2);

  const handleAddWorker = (newWorker) => {
    setWorkerList(prev => [...prev, {
      id: prev.length + 1,
      name: newWorker.name,
      ekycKey: "SG-W" + Math.random().toString(36).slice(2,6).toUpperCase() + "-XXXX",
      role: newWorker.role,
      attendance: 0,
      task: "Not Assigned",
      progress: 0,
      phone: "—",
      status: "Added",
    }]);
  };

  return (
    <div style={{ minHeight:"100vh", width:"100%", display:"flex", background:"#0f1f5c", fontFamily:"'Segoe UI', sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,-18px) scale(1.04)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,15px) scale(1.03)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.35s ease forwards}
        .card{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:20px;transition:all 0.2s;}
        .card:hover{background:rgba(255,255,255,0.11);border-color:rgba(255,255,255,0.22)}
        .sidebar-btn{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:12px;border:none;background:transparent;color:rgba(255,255,255,0.55);cursor:pointer;transition:all 0.2s;font-size:13px;font-weight:500;width:100%;text-align:left;white-space:nowrap;font-family:'Segoe UI',sans-serif;}
        .sidebar-btn:hover{background:rgba(255,255,255,0.08);color:white}
        .sidebar-btn.active{background:rgba(255,255,255,0.15);color:white;font-weight:700}
        .input-field{background:rgba(255,255,255,0.1);border:1.5px solid rgba(255,255,255,0.2);border-radius:10px;padding:12px 14px;color:white;font-size:14px;outline:none;transition:all 0.2s;width:100%;box-sizing:border-box;font-family:'Segoe UI',sans-serif;}
        .input-field::placeholder{color:rgba(255,255,255,0.35)}
        .input-field:focus{border-color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.15)}
        .btn-white{padding:11px 20px;background:white;color:#0f1f5c;border:none;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Segoe UI',sans-serif;letter-spacing:0.3px;}
        .btn-white:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,0.25)}
        .btn-outline{padding:11px 20px;background:transparent;border:1.5px solid rgba(255,255,255,0.35);border-radius:10px;color:white;font-weight:600;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Segoe UI',sans-serif;}
        .btn-outline:hover{background:rgba(255,255,255,0.1);border-color:white}
        .btn-disabled{padding:11px 20px;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;color:rgba(255,255,255,0.3);font-weight:600;font-size:13px;cursor:not-allowed;font-family:'Segoe UI',sans-serif;}
        .table-row{display:grid;padding:13px 16px;border-bottom:1px solid rgba(255,255,255,0.07);transition:background 0.15s;align-items:center;}
        .table-row:hover{background:rgba(255,255,255,0.05)}
        .table-row:last-child{border-bottom:none}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:2px}
      `}</style>

      {/* Add Worker Modal */}
      {showAddWorker && <AddWorkerModal onClose={() => setShowAddWorker(false)} onAdd={handleAddWorker} />}

      {/* BG Blobs */}
      <div style={{ position:"fixed", inset:0, overflow:"hidden", zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"45%", height:"60%", borderRadius:"50%", background:"rgba(37,99,235,0.25)", animation:"blob1 10s ease-in-out infinite", filter:"blur(5px)" }} />
        <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"50%", height:"55%", borderRadius:"50%", background:"rgba(20,50,160,0.3)", animation:"blob2 12s ease-in-out infinite", filter:"blur(5px)" }} />
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{ position:"fixed", left:0, top:0, bottom:0, zIndex:50, width:sidebarOpen?"220px":"64px", background:"rgba(10,20,80,0.85)", backdropFilter:"blur(20px)", borderRight:"1px solid rgba(255,255,255,0.1)", transition:"width 0.25s ease", overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"20px 14px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>🛡️</div>
          {sidebarOpen && (
            <div style={{ overflow:"hidden" }}>
              <p style={{ color:"white", fontWeight:"800", fontSize:"14px", margin:0, whiteSpace:"nowrap" }}>Suraksha Grid</p>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px", margin:0, whiteSpace:"nowrap" }}>Supervisor Portal</p>
            </div>
          )}
        </div>
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} className={`sidebar-btn${activeSection===item.id?" active":""}`} onClick={() => setActiveSection(item.id)} title={!sidebarOpen?item.label:""}>
              <span style={{ fontSize:"18px", flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ margin:"10px 8px", padding:"10px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:"16px", transition:"all 0.2s", fontFamily:"'Segoe UI',sans-serif" }}>
          {sidebarOpen ? "◀ Collapse" : "▶"}
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, marginLeft:sidebarOpen?"220px":"64px", transition:"margin-left 0.25s ease", position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

        {/* Top Bar */}
        <div style={{ position:"sticky", top:0, zIndex:40, background:"rgba(10,20,80,0.8)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h1 style={{ color:"white", fontSize:"18px", fontWeight:"800", margin:0 }}>
              {SIDEBAR_ITEMS.find(s=>s.id===activeSection)?.icon}{" "}
              {SIDEBAR_ITEMS.find(s=>s.id===activeSection)?.label}
            </h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", margin:0 }}>Suraksha Grid • Supervisor Portal</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ position:"relative", cursor:"pointer" }}>
              <div style={{ width:"38px", height:"38px", borderRadius:"50%", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>🔔</div>
              {notifications>0 && <div style={{ position:"absolute", top:"-2px", right:"-2px", width:"16px", height:"16px", borderRadius:"50%", background:"#DC2626", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:"white", fontWeight:"700" }}>{notifications}</div>}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"12px", padding:"6px 12px" }}>
              <span style={{ fontSize:"20px" }}>👷‍♂️</span>
              {sidebarOpen && <span style={{ color:"white", fontSize:"13px", fontWeight:"600" }}>{supervisor.name}</span>}
            </div>
            <a href="/" style={{ padding:"8px 14px", background:"rgba(220,38,38,0.2)", border:"1px solid rgba(220,38,38,0.4)", borderRadius:"10px", color:"#fca5a5", fontSize:"12px", fontWeight:"600", textDecoration:"none" }}>Logout</a>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding:"24px", flex:1 }}>

          {/* ════ OVERVIEW ════ */}
          {activeSection==="overview" && (
            <div className="fade-up">
              {/* Profile Banner */}
              <div style={{ background:"rgba(37,99,235,0.25)", border:"1.5px solid rgba(255,255,255,0.18)", borderRadius:"20px", padding:"24px", marginBottom:"20px", display:"flex", gap:"20px", alignItems:"center", flexWrap:"wrap" }}>
                <div style={{ width:"70px", height:"70px", borderRadius:"18px", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"36px", flexShrink:0 }}>👷‍♂️</div>
                <div style={{ flex:1, minWidth:"200px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                    <h2 style={{ color:"white", fontSize:"20px", fontWeight:"800", margin:0 }}>{supervisor.name}</h2>
                    <Badge status="Active" />
                    <span style={{ background:"rgba(139,92,246,0.2)", color:"#c4b5fd", border:"1px solid rgba(139,92,246,0.4)", padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"700" }}>Supervisor</span>
                  </div>
                  <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"13px", margin:"4px 0" }}>🏗️ {supervisor.role} &nbsp;•&nbsp; Assigned by: {supervisor.assignedBy}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <Stars rating={Math.floor(supervisor.rating)} />
                    <span style={{ color:"#fbbf24", fontWeight:"700", fontSize:"13px" }}>{supervisor.rating}</span>
                    <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>• Score: </span>
                    <span style={{ color:"#86efac", fontWeight:"700", fontSize:"13px" }}>{supervisor.score}/100</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                  {[{label:"Assigned Projects",val:"3"},{label:"Workers Under Me",val:workerList.length},{label:"Avg Attendance",val:"87%"}].map((s,i)=>(
                    <div key={i} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"12px", padding:"14px 18px", textAlign:"center", minWidth:"100px" }}>
                      <p style={{ color:"white", fontSize:"20px", fontWeight:"800", margin:0 }}>{s.val}</p>
                      <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", margin:"3px 0 0" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permission Notice */}
              <div style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:"14px", padding:"14px 18px", marginBottom:"20px", display:"flex", gap:"12px", alignItems:"center" }}>
                <span style={{ fontSize:"22px" }}>🔒</span>
                <div>
                  <p style={{ color:"#fde68a", fontWeight:"700", fontSize:"13px", margin:0 }}>Supervisor Permissions</p>
                  <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"12px", margin:"3px 0 0" }}>
                    Aap workers add kar sakte ho (eKYC se) • Attendance mark kar sakte ho • Tasks assign kar sakte ho •
                    <span style={{ color:"#fca5a5" }}> Naye accounts banana aur projects create karna allowed nahi hai</span>
                  </p>
                </div>
              </div>

              {/* KPI Row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"14px", marginBottom:"20px" }}>
                {[
                  {icon:"🏗️", label:"Active Projects", val:"2", color:"#93c5fd"},
                  {icon:"⏸️", label:"On Hold", val:"1", color:"#fde68a"},
                  {icon:"👷", label:"Workers", val:String(workerList.length), color:"#c4b5fd"},
                  {icon:"✅", label:"Avg Progress", val:"58%", color:"#86efac"},
                ].map((k,i)=>(
                  <div key={i} className="card" style={{ textAlign:"center", cursor:"default" }}>
                    <div style={{ fontSize:"28px", marginBottom:"8px" }}>{k.icon}</div>
                    <p style={{ color:k.color, fontSize:"20px", fontWeight:"800", margin:0 }}>{k.val}</p>
                    <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", margin:"4px 0 0" }}>{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Projects + Schedule */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", flexWrap:"wrap" }}>
                <div className="card">
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"14px" }}>ASSIGNED PROJECTS</p>
                  {assignedProjects.map((p,i)=>(
                    <div key={i} style={{ marginBottom:"14px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                        <p style={{ color:"white", fontWeight:"600", fontSize:"13px", margin:0 }}>{p.name}</p>
                        <Badge status={p.status} />
                      </div>
                      <ProgressBar value={p.progress} color={p.status==="On Hold"?"#F59E0B":"#2563EB"} />
                      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", margin:"4px 0 0" }}>{p.progress}% • Deadline: {p.deadline}</p>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"14px" }}>UPCOMING</p>
                  {meetings.map((m,i)=>(
                    <div key={i} style={{ display:"flex", gap:"12px", alignItems:"center", padding:"10px", background:"rgba(255,255,255,0.05)", borderRadius:"10px", marginBottom:"8px" }}>
                      <span style={{ fontSize:"22px" }}>{m.icon}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ color:"white", fontSize:"13px", fontWeight:"600", margin:0 }}>{m.title}</p>
                        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", margin:"2px 0 0" }}>{m.date} • {m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ PROJECTS ════ */}
          {activeSection==="projects" && (
            <div className="fade-up">
              {/* Read-only notice */}
              <div style={{ background:"rgba(37,99,235,0.1)", border:"1px solid rgba(37,99,235,0.3)", borderRadius:"12px", padding:"12px 16px", marginBottom:"16px", display:"flex", gap:"10px", alignItems:"center" }}>
                <span style={{ fontSize:"18px" }}>👁️</span>
                <p style={{ color:"#93c5fd", fontSize:"13px", margin:0 }}>
                  <strong>View Only:</strong> Projects contractor ne assign kiye hain. Aap progress update kar sakte ho lekin projects create/delete nahi kar sakte.
                </p>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {assignedProjects.map((p,i)=>(
                  <div key={i} className="card">
                    <div style={{ display:"flex", gap:"16px", alignItems:"flex-start", flexWrap:"wrap" }}>
                      <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🏗️</div>
                      <div style={{ flex:1, minWidth:"200px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px", marginBottom:"6px" }}>
                          <h3 style={{ color:"white", fontSize:"15px", fontWeight:"700", margin:0 }}>{p.name}</h3>
                          <Badge status={p.status} />
                        </div>
                        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"0 0 10px" }}>
                          🏢 {p.contractor} &nbsp;•&nbsp; 📍 {p.location} &nbsp;•&nbsp; 📅 {p.deadline} &nbsp;•&nbsp; 👷 {p.workers} workers
                        </p>
                        <ProgressBar value={p.progress} color={p.status==="On Hold"?"#F59E0B":"#2563EB"} />
                        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", margin:"5px 0 0" }}>{p.progress}% complete</p>
                      </div>
                      <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
                        <button className="btn-outline" style={{ padding:"7px 14px", fontSize:"12px" }}>View Details</button>
                        <button className="btn-white" style={{ padding:"7px 14px", fontSize:"12px" }}>Update Progress</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ WORKERS ════ */}
          {activeSection==="workers" && (
            <div className="fade-up">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
                <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", margin:0 }}>{workerList.length} workers assigned</p>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {/* Cannot Create — disabled button with tooltip */}
                  <div style={{ position:"relative" }}>
                    <button className="btn-disabled" title="Naye account banana allowed nahi — contractor se request karo">
                      🚫 Naya Account Banana
                    </button>
                  </div>
                  {/* Can Add existing worker */}
                  <button className="btn-white" onClick={() => setShowAddWorker(true)}>
                    ➕ Existing Worker Add Karo
                  </button>
                </div>
              </div>

              {/* Key Difference Notice */}
              <div style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:"12px", padding:"12px 16px", marginBottom:"16px", display:"flex", gap:"10px" }}>
                <span>⚠️</span>
                <p style={{ color:"#fde68a", fontSize:"12px", margin:0 }}>
                  <strong>Supervisor Rule:</strong> Naye worker accounts sirf contractor create kar sakta hai. Aap sirf existing workers ko eKYC key se apni team mein add kar sakte ho.
                </p>
              </div>

              {/* Workers Table */}
              <div className="card" style={{ padding:0, overflow:"hidden" }}>
                <div className="table-row" style={{ gridTemplateColumns:"2fr 1fr 1fr 2fr 1fr", background:"rgba(255,255,255,0.05)" }}>
                  {["Worker","Role","Attendance","Current Task","Progress"].map(h=>(
                    <span key={h} style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", fontWeight:"700", letterSpacing:"0.8px" }}>{h.toUpperCase()}</span>
                  ))}
                </div>
                {workerList.map((w,i)=>(
                  <div key={i} className="table-row" style={{ gridTemplateColumns:"2fr 1fr 1fr 2fr 1fr" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:"rgba(37,99,235,0.3)", border:"1px solid rgba(37,99,235,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>👷</div>
                      <div>
                        <p style={{ color:"white", fontSize:"13px", fontWeight:"600", margin:0 }}>{w.name}</p>
                        <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px", margin:0, fontFamily:"monospace" }}>{w.ekycKey}</p>
                      </div>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px" }}>{w.role}</span>
                    <span style={{ color:w.attendance>=90?"#86efac":w.attendance>=80?"#fde68a":w.attendance===0?"rgba(255,255,255,0.3)":"#fca5a5", fontSize:"13px", fontWeight:"700" }}>
                      {w.attendance===0 ? "—" : `${w.attendance}%`}
                    </span>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"12px" }}>{w.task}</span>
                      {w.status==="Added" && <Badge status="Added" />}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <ProgressBar value={w.progress} />
                      <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", whiteSpace:"nowrap" }}>{w.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance Summary */}
              <div style={{ marginTop:"16px", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"12px" }}>
                {[
                  {label:"Avg Attendance",val:"87.6%",color:"#86efac"},
                  {label:"Present Today",val:`${workerList.filter(w=>w.attendance>0).length}/${workerList.length}`,color:"#93c5fd"},
                  {label:"New Workers",val:String(workerList.filter(w=>w.status==="Added").length),color:"#c4b5fd"},
                  {label:"Absent",val:"3",color:"#fca5a5"},
                ].map((s,i)=>(
                  <div key={i} className="card" style={{ textAlign:"center" }}>
                    <p style={{ color:s.color, fontSize:"20px", fontWeight:"800", margin:0 }}>{s.val}</p>
                    <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"4px 0 0" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ SCHEDULE ════ */}
          {activeSection==="schedule" && (
            <div className="fade-up">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                <div className="card">
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"14px" }}>📅 UPCOMING EVENTS</p>
                  {meetings.map((m,i)=>(
                    <div key={i} style={{ display:"flex", gap:"12px", alignItems:"center", padding:"12px", background:"rgba(255,255,255,0.05)", borderRadius:"12px", marginBottom:"8px", border:"1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"rgba(37,99,235,0.25)", border:"1px solid rgba(37,99,235,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{m.icon}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ color:"white", fontWeight:"600", fontSize:"13px", margin:0 }}>{m.title}</p>
                        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", margin:"3px 0 0" }}>📅 {m.date} &nbsp;•&nbsp; 🕐 {m.time}</p>
                      </div>
                      <span style={{ fontSize:"10px", padding:"3px 8px", borderRadius:"6px", background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", whiteSpace:"nowrap" }}>{m.type}</span>
                    </div>
                  ))}
                  <button className="btn-outline" style={{ width:"100%", marginTop:"8px", fontSize:"12px", padding:"10px" }}>+ Add Event</button>
                </div>

                <div className="card">
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"14px" }}>🔔 REMINDERS</p>
                  {[
                    {text:"NH-48 daily progress log submit karo", due:"Today", urgent:true},
                    {text:"Worker attendance mark karo", due:"Today", urgent:true},
                    {text:"Safety audit preparation", due:"Mar 05", urgent:false},
                    {text:"Monthly progress report — contractor ko bhejo", due:"Mar 31", urgent:false},
                  ].map((r,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:r.urgent?"rgba(220,38,38,0.1)":"rgba(255,255,255,0.05)", borderRadius:"10px", marginBottom:"8px", border:r.urgent?"1px solid rgba(220,38,38,0.25)":"1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                        <span style={{ fontSize:"14px" }}>{r.urgent?"🚨":"📌"}</span>
                        <p style={{ color:"white", fontSize:"12px", margin:0 }}>{r.text}</p>
                      </div>
                      <span style={{ color:r.urgent?"#fca5a5":"rgba(255,255,255,0.4)", fontSize:"11px", fontWeight:"600", whiteSpace:"nowrap", marginLeft:"8px" }}>{r.due}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Timeline */}
              <div className="card">
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"16px" }}>📊 PROJECT TIMELINE</p>
                {assignedProjects.map((p,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"14px" }}>
                    <p style={{ color:"white", fontSize:"12px", fontWeight:"600", margin:0, minWidth:"180px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</p>
                    <div style={{ flex:1, minWidth:"200px" }}>
                      <ProgressBar value={p.progress} color={p.status==="On Hold"?"#F59E0B":"#2563EB"} />
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", whiteSpace:"nowrap" }}>{p.progress}% • {p.deadline}</span>
                    <Badge status={p.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ DOCUMENTS ════ */}
          {activeSection==="documents" && (
            <div className="fade-up">
              <div style={{ background:"rgba(37,99,235,0.1)", border:"1px solid rgba(37,99,235,0.3)", borderRadius:"12px", padding:"12px 16px", marginBottom:"16px", display:"flex", gap:"10px" }}>
                <span>ℹ️</span>
                <p style={{ color:"#93c5fd", fontSize:"13px", margin:0 }}>Contractor ke documents sirf read-only hain. Aap apni work reports upload kar sakte ho.</p>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"16px" }}>
                <button className="btn-white">📤 Work Report Upload Karo</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"14px" }}>
                {documents.map((d,i)=>(
                  <div key={i} className="card" style={{ cursor:"pointer" }}>
                    <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"12px" }}>
                      <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"rgba(37,99,235,0.2)", border:"1px solid rgba(37,99,235,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{d.icon}</div>
                      <div style={{ flex:1, overflow:"hidden" }}>
                        <p style={{ color:"white", fontWeight:"600", fontSize:"13px", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.name}</p>
                        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", margin:"3px 0 0" }}>{d.type} • {d.size}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px" }}>{d.date}</span>
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button className="btn-outline" style={{ padding:"4px 10px", fontSize:"11px" }}>View</button>
                        {d.canDelete
                          ? <button className="btn-outline" style={{ padding:"4px 10px", fontSize:"11px", borderColor:"rgba(220,38,38,0.5)", color:"#fca5a5" }}>🗑️</button>
                          : <button className="btn-disabled" style={{ padding:"4px 10px", fontSize:"11px" }} title="Contractor document — delete not allowed">🔒</button>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ FEEDBACK ════ */}
          {activeSection==="feedback" && (
            <div className="fade-up">
              <div style={{ background:"rgba(37,99,235,0.2)", border:"1.5px solid rgba(37,99,235,0.35)", borderRadius:"20px", padding:"24px", marginBottom:"20px", display:"flex", gap:"24px", alignItems:"center", flexWrap:"wrap" }}>
                <div style={{ textAlign:"center" }}>
                  <p style={{ color:"white", fontSize:"48px", fontWeight:"800", margin:0, lineHeight:1 }}>{supervisor.rating}</p>
                  <Stars rating={Math.floor(supervisor.rating)} />
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"4px 0 0" }}>Overall Rating</p>
                </div>
                <div style={{ width:"1px", height:"80px", background:"rgba(255,255,255,0.15)" }} />
                <div>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", margin:"0 0 6px" }}>PERFORMANCE SCORE</p>
                  <p style={{ color:"#86efac", fontSize:"36px", fontWeight:"800", margin:0 }}>{supervisor.score}<span style={{ fontSize:"16px", color:"rgba(255,255,255,0.5)" }}>/100</span></p>
                  <ProgressBar value={supervisor.score} color="#16A34A" />
                </div>
                <div style={{ flex:1, minWidth:"200px" }}>
                  {[{label:"Worker Management",val:90},{label:"Timeliness",val:85},{label:"Communication",val:88},{label:"Safety Compliance",val:92}].map((r,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                      <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"12px", minWidth:"150px" }}>{r.label}</span>
                      <div style={{ flex:1 }}><ProgressBar value={r.val} color="#2563EB" /></div>
                      <span style={{ color:"white", fontSize:"12px", fontWeight:"600", minWidth:"30px" }}>{r.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {feedback.map((f,i)=>(
                  <div key={i} className="card">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"10px", marginBottom:"10px" }}>
                      <div>
                        <p style={{ color:"white", fontWeight:"700", fontSize:"14px", margin:0 }}>From: {f.from}</p>
                        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", margin:"3px 0 0" }}>🏗️ {f.project} &nbsp;•&nbsp; 📅 {f.date}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                        <Stars rating={f.rating} />
                        <span style={{ color:"#fbbf24", fontWeight:"700", fontSize:"14px" }}>{f.rating}.0</span>
                      </div>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px", margin:0, fontStyle:"italic", background:"rgba(255,255,255,0.05)", borderRadius:"10px", padding:"10px 14px" }}>
                      "{f.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ SETTINGS ════ */}
          {activeSection==="settings" && (
            <div className="fade-up">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:"16px" }}>
                {/* Personal Details */}
                <div className="card">
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"16px" }}>👤 PERSONAL DETAILS</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                    {[{label:"Full Name",val:supervisor.name},{label:"Role",val:supervisor.role},{label:"eKYC Key",val:supervisor.ekycKey},{label:"Assigned By",val:supervisor.assignedBy},{label:"Phone",val:"+91 98XX XXXX 99"},{label:"Email",val:"rajesh.sharma@mehtaconstructions.in"}].map((f,i)=>(
                      <div key={i}>
                        <label style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", letterSpacing:"0.5px", display:"block", marginBottom:"5px" }}>{f.label.toUpperCase()}</label>
                        <input className="input-field" defaultValue={f.val} style={{ padding:"10px 14px" }} />
                      </div>
                    ))}
                    <button className="btn-white" style={{ marginTop:"4px" }}>Save Changes</button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="card">
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"16px" }}>🔔 NOTIFICATION SETTINGS</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                    {[
                      {label:"Worker Attendance Alerts", on:true},
                      {label:"Project Deadline Reminders", on:true},
                      {label:"New Task Assignments", on:true},
                      {label:"Contractor Messages", on:true},
                      {label:"Safety Audit Reminders", on:false},
                      {label:"System Alerts", on:false},
                    ].map((n,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"rgba(255,255,255,0.05)", borderRadius:"10px" }}>
                        <span style={{ color:"white", fontSize:"13px" }}>{n.label}</span>
                        <div style={{ width:"40px", height:"22px", borderRadius:"99px", background:n.on?"#16A34A":"rgba(255,255,255,0.15)", cursor:"pointer", position:"relative", border:`1px solid ${n.on?"#16A34A":"rgba(255,255,255,0.2)"}` }}>
                          <div style={{ position:"absolute", top:"2px", left:n.on?"20px":"2px", width:"16px", height:"16px", borderRadius:"50%", background:"white", transition:"left 0.2s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div className="card">
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"16px" }}>🔒 SECURITY</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                    {["CURRENT PASSWORD","NEW PASSWORD","CONFIRM NEW PASSWORD"].map((label,i)=>(
                      <div key={i}>
                        <label style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", letterSpacing:"0.5px", display:"block", marginBottom:"5px" }}>{label}</label>
                        <input type="password" className="input-field" placeholder="••••••••" style={{ padding:"10px 14px" }} />
                      </div>
                    ))}
                    <button className="btn-white">Update Password</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}