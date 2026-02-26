// src/frontend/ContractorDashboard.jsx

import React, { useState } from "react";

// ── MOCK DATA ──────────────────────────────────────────────
const contractor = {
  name: "Sunil Mehta",
  company: "Mehta Constructions Pvt Ltd",
  ekycKey: "SG-C7K9M-3381",
  rating: 4.7,
  score: 92,
  since: "2018",
  photo: "🏢",
};

const projects = [
  { id:1, name:"NH-48 Highway Expansion", client:"NHAI", status:"In Progress", deadline:"Mar 2025", value:"₹45L", progress:65, workers:24, location:"Pune" },
  { id:2, name:"Residential Complex Block-B", client:"Lodha Group", status:"In Progress", deadline:"Jun 2025", value:"₹28L", progress:40, workers:18, location:"Mumbai" },
  { id:3, name:"Metro Station Renovation", client:"MMRC", status:"On Hold", deadline:"Aug 2025", value:"₹62L", progress:20, workers:0, location:"Mumbai" },
  { id:4, name:"Factory Shed Construction", client:"Tata Motors", status:"Completed", deadline:"Jan 2025", value:"₹15L", progress:100, workers:12, location:"Nashik" },
  { id:5, name:"School Building Phase-1", client:"Govt of MH", status:"Completed", deadline:"Dec 2024", value:"₹22L", progress:100, workers:15, location:"Aurangabad" },
  { id:6, name:"IT Park Interiors", client:"Infosys", status:"Pending Approval", deadline:"Apr 2025", value:"₹18L", progress:0, workers:0, location:"Pune" },
];

const workers = [
  { name:"Ramesh Kumar", role:"Mason", attendance:92, task:"Foundation Work", progress:80, phone:"98XX XXXX 01" },
  { name:"Suresh Yadav", role:"Carpenter", attendance:85, task:"Shuttering", progress:60, phone:"98XX XXXX 02" },
  { name:"Mohan Lal", role:"Helper", attendance:78, task:"Material Loading", progress:45, phone:"98XX XXXX 03" },
  { name:"Dinesh Patel", role:"Electrician", attendance:95, task:"Wiring Phase-1", progress:90, phone:"98XX XXXX 04" },
  { name:"Anil Singh", role:"Plumber", attendance:88, task:"Drainage Layout", progress:70, phone:"98XX XXXX 05" },
];


const proposals = [
  { project:"Airport Terminal B", client:"AAI", value:"₹1.2Cr", status:"Accepted", date:"10 Jan 2025" },
  { project:"Smart City Roads", client:"PMC", value:"₹85L", status:"Rejected", date:"05 Jan 2025" },
  { project:"Hospital Extension", client:"HCL Trust", value:"₹45L", status:"Sent", date:"20 Jan 2025" },
  { project:"Warehouse Complex", client:"Amazon IN", value:"₹2.1Cr", status:"Sent", date:"22 Jan 2025" },
];

const meetings = [
  { title:"Site Visit — NH-48", date:"28 Feb", time:"9:00 AM", type:"Site Visit", icon:"🚧" },
  { title:"Client Review — Lodha", date:"01 Mar", time:"11:00 AM", type:"Meeting", icon:"👥" },
  { title:"Deadline — IT Park Approval", date:"05 Mar", time:"EOD", type:"Deadline", icon:"⏰" },
  { title:"Worker Safety Audit", date:"10 Mar", time:"10:00 AM", type:"Audit", icon:"🔍" },
];

const documents = [
  { name:"NH-48 Contract Agreement", type:"PDF", size:"2.4 MB", date:"Jan 2025", icon:"📄" },
  { name:"Lodha Blueprint v2", type:"DWG", size:"8.1 MB", date:"Feb 2025", icon:"📐" },
  { name:"Work Report - Jan 2025", type:"PDF", size:"1.2 MB", date:"Jan 2025", icon:"📊" },
  { name:"Safety Compliance Cert", type:"PDF", size:"0.8 MB", date:"Dec 2024", icon:"🛡️" },
  { name:"Tax Invoice Bundle", type:"ZIP", size:"4.5 MB", date:"Feb 2025", icon:"🗜️" },
];

const feedback = [
  { client:"NHAI", project:"NH-48", rating:5, comment:"Excellent quality work, on-time delivery", date:"Feb 2025" },
  { client:"Tata Motors", project:"Factory Shed", rating:4, comment:"Good work, minor delays but resolved quickly", date:"Jan 2025" },
  { client:"Govt of MH", project:"School Building", rating:5, comment:"Outstanding! Highly recommended", date:"Dec 2024" },
];

const SIDEBAR_ITEMS = [
  { id:"overview", icon:"📊", label:"Overview" },
  { id:"projects", icon:"🏗️", label:"Projects" },
  { id:"workers", icon:"👷", label:"Workers" },

  { id:"proposals", icon:"📋", label:"Proposals" },
  { id:"schedule", icon:"📅", label:"Schedule" },
  { id:"documents", icon:"📁", label:"Documents" },
  { id:"feedback", icon:"⭐", label:"Feedback" },
  { id:"settings", icon:"⚙️", label:"Settings" },
];

const STATUS_STYLE = {
  "In Progress":     { bg:"rgba(37,99,235,0.2)",  color:"#93c5fd",  border:"rgba(37,99,235,0.4)" },
  "Completed":       { bg:"rgba(22,163,74,0.2)",  color:"#86efac",  border:"rgba(22,163,74,0.4)" },
  "On Hold":         { bg:"rgba(245,158,11,0.2)", color:"#fde68a",  border:"rgba(245,158,11,0.4)" },
  "Pending Approval":{ bg:"rgba(249,115,22,0.2)", color:"#fdba74",  border:"rgba(249,115,22,0.4)" },
  "Received":        { bg:"rgba(22,163,74,0.2)",  color:"#86efac",  border:"rgba(22,163,74,0.4)" },
  "Pending":         { bg:"rgba(245,158,11,0.2)", color:"#fde68a",  border:"rgba(245,158,11,0.4)" },
  "Overdue":         { bg:"rgba(220,38,38,0.2)",  color:"#fca5a5",  border:"rgba(220,38,38,0.4)" },
  "Accepted":        { bg:"rgba(22,163,74,0.2)",  color:"#86efac",  border:"rgba(22,163,74,0.4)" },
  "Rejected":        { bg:"rgba(220,38,38,0.2)",  color:"#fca5a5",  border:"rgba(220,38,38,0.4)" },
  "Sent":            { bg:"rgba(139,92,246,0.2)", color:"#c4b5fd",  border:"rgba(139,92,246,0.4)" },
};

function Badge({ status }) {
  const s = STATUS_STYLE[status] || { bg:"rgba(255,255,255,0.1)", color:"white", border:"rgba(255,255,255,0.2)" };
  return (
    <span style={{
      display:"inline-block", padding:"3px 10px", borderRadius:"20px",
      fontSize:"11px", fontWeight:"700", letterSpacing:"0.4px",
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
    }}>{status}</span>
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

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function ContractorDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectFilter, setProjectFilter] = useState("All");
  const [notifications] = useState(3);

  const filteredProjects = projectFilter === "All"
    ? projects
    : projects.filter(p => p.status === projectFilter);

  return (
    <div style={{
      minHeight:"100vh", width:"100%", display:"flex",
      background:"#0f1f5c", fontFamily:"'Segoe UI', sans-serif",
      position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,-18px) scale(1.04)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,15px) scale(1.03)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .fade-up{animation:fadeUp 0.35s ease forwards}
        .card{
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:16px; padding:20px;
          transition:all 0.2s;
        }
        .card:hover{background:rgba(255,255,255,0.11);border-color:rgba(255,255,255,0.22)}
        .sidebar-btn{
          display:flex; align-items:center; gap:10px;
          padding:11px 14px; border-radius:12px; border:none;
          background:transparent; color:rgba(255,255,255,0.55);
          cursor:pointer; transition:all 0.2s; font-size:13px;
          font-weight:500; width:100%; text-align:left;
          white-space:nowrap; font-family:'Segoe UI',sans-serif;
        }
        .sidebar-btn:hover{background:rgba(255,255,255,0.08);color:white}
        .sidebar-btn.active{background:rgba(255,255,255,0.15);color:white;font-weight:700}
        .tab-pill{
          padding:8px 16px; border-radius:8px; border:none;
          font-size:12px; font-weight:600; cursor:pointer;
          transition:all 0.2s; font-family:'Segoe UI',sans-serif;
        }
        .input-field{
          background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.2);
          border-radius:10px; padding:12px 14px; color:white; font-size:14px;
          outline:none; transition:all 0.2s; width:100%; box-sizing:border-box;
          font-family:'Segoe UI',sans-serif;
        }
        .input-field::placeholder{color:rgba(255,255,255,0.35)}
        .input-field:focus{border-color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.15)}
        .btn-white{
          padding:11px 20px; background:white; color:#0f1f5c;
          border:none; border-radius:10px; font-weight:700;
          font-size:13px; cursor:pointer; transition:all 0.2s;
          font-family:'Segoe UI',sans-serif; letter-spacing:0.3px;
        }
        .btn-white:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,0.25)}
        .btn-outline{
          padding:11px 20px; background:transparent;
          border:1.5px solid rgba(255,255,255,0.35); border-radius:10px;
          color:white; font-weight:600; font-size:13px; cursor:pointer;
          transition:all 0.2s; font-family:'Segoe UI',sans-serif;
        }
        .btn-outline:hover{background:rgba(255,255,255,0.1);border-color:white}
        .table-row{
          display:grid; padding:13px 16px;
          border-bottom:1px solid rgba(255,255,255,0.07);
          transition:background 0.15s; align-items:center;
        }
        .table-row:hover{background:rgba(255,255,255,0.05)}
        .table-row:last-child{border-bottom:none}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:2px}
      `}</style>

      {/* BG Blobs */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",zIndex:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"45%",height:"60%",borderRadius:"50%",background:"rgba(37,99,235,0.25)",animation:"blob1 10s ease-in-out infinite",filter:"blur(5px)"}}/>
        <div style={{position:"absolute",bottom:"-15%",right:"-10%",width:"50%",height:"55%",borderRadius:"50%",background:"rgba(20,50,160,0.3)",animation:"blob2 12s ease-in-out infinite",filter:"blur(5px)"}}/>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{
        position:"fixed", left:0, top:0, bottom:0, zIndex:50,
        width: sidebarOpen ? "220px" : "64px",
        background:"rgba(10,20,80,0.85)", backdropFilter:"blur(20px)",
        borderRight:"1px solid rgba(255,255,255,0.1)",
        transition:"width 0.25s ease", overflow:"hidden",
        display:"flex", flexDirection:"column",
      }}>
        {/* Logo */}
        <div style={{padding:"20px 14px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"10px", flexShrink:0}}>
          <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>🛡️</div>
          {sidebarOpen && (
            <div style={{overflow:"hidden"}}>
              <p style={{color:"white",fontWeight:"800",fontSize:"14px",margin:0,whiteSpace:"nowrap"}}>Suraksha Grid</p>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:"10px",margin:0,whiteSpace:"nowrap"}}>Contractor Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{flex:1, padding:"10px 8px", overflowY:"auto"}}>
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-btn${activeSection===item.id?" active":""}`}
              onClick={() => setActiveSection(item.id)}
              title={!sidebarOpen ? item.label : ""}
            >
              <span style={{fontSize:"18px",flexShrink:0}}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse btn */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{margin:"10px 8px",padding:"10px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:"16px",transition:"all 0.2s",fontFamily:"'Segoe UI',sans-serif"}}
        >
          {sidebarOpen ? "◀ Collapse" : "▶"}
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        flex:1, marginLeft: sidebarOpen ? "220px" : "64px",
        transition:"margin-left 0.25s ease",
        position:"relative", zIndex:1,
        minHeight:"100vh", display:"flex", flexDirection:"column",
      }}>
        {/* Top Bar */}
        <div style={{
          position:"sticky",top:0,zIndex:40,
          background:"rgba(10,20,80,0.8)",backdropFilter:"blur(16px)",
          borderBottom:"1px solid rgba(255,255,255,0.08)",
          padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div>
            <h1 style={{color:"white",fontSize:"18px",fontWeight:"800",margin:0}}>
              {SIDEBAR_ITEMS.find(s=>s.id===activeSection)?.icon}{" "}
              {SIDEBAR_ITEMS.find(s=>s.id===activeSection)?.label}
            </h1>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"12px",margin:0}}>
              Suraksha Grid • Contractor Dashboard
            </p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            {/* Notifications */}
            <div style={{position:"relative",cursor:"pointer"}}>
              <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🔔</div>
              {notifications>0 && (
                <div style={{position:"absolute",top:"-2px",right:"-2px",width:"16px",height:"16px",borderRadius:"50%",background:"#DC2626",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"white",fontWeight:"700"}}>{notifications}</div>
              )}
            </div>
            {/* Profile pill */}
            <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"12px",padding:"6px 12px",cursor:"pointer"}}>
              <span style={{fontSize:"20px"}}>🏢</span>
              {sidebarOpen && <span style={{color:"white",fontSize:"13px",fontWeight:"600"}}>{contractor.name}</span>}
            </div>
            <a href="/" style={{padding:"8px 14px",background:"rgba(220,38,38,0.2)",border:"1px solid rgba(220,38,38,0.4)",borderRadius:"10px",color:"#fca5a5",fontSize:"12px",fontWeight:"600",textDecoration:"none"}}>Logout</a>
          </div>
        </div>

        {/* Page Content */}
        <div style={{padding:"24px", flex:1}}>

          {/* ════ OVERVIEW ════ */}
          {activeSection==="overview" && (
            <div className="fade-up">
              {/* Contractor Profile Banner */}
              <div style={{background:"rgba(37,99,235,0.25)",border:"1.5px solid rgba(255,255,255,0.18)",borderRadius:"20px",padding:"24px",marginBottom:"20px",display:"flex",gap:"20px",alignItems:"center",flexWrap:"wrap"}}>
                <div style={{width:"70px",height:"70px",borderRadius:"18px",background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px",flexShrink:0}}>🏢</div>
                <div style={{flex:1,minWidth:"200px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                    <h2 style={{color:"white",fontSize:"20px",fontWeight:"800",margin:0}}>{contractor.name}</h2>
                    <Badge status="Active"/>
                  </div>
                  <p style={{color:"rgba(255,255,255,0.55)",fontSize:"13px",margin:"4px 0"}}>🏗️ {contractor.company} &nbsp;•&nbsp; Since {contractor.since}</p>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <Stars rating={Math.floor(contractor.rating)}/>
                    <span style={{color:"#fbbf24",fontWeight:"700",fontSize:"13px"}}>{contractor.rating}</span>
                    <span style={{color:"rgba(255,255,255,0.4)",fontSize:"12px"}}>• Performance Score: </span>
                    <span style={{color:"#86efac",fontWeight:"700",fontSize:"13px"}}>{contractor.score}/100</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
                  {[{label:"Active Projects",val:"3"},{label:"Total Workers",val:"54"},{label:"This Month",val:"₹8.2L"}].map((s,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:"12px",padding:"14px 18px",textAlign:"center",minWidth:"100px"}}>
                      <p style={{color:"white",fontSize:"20px",fontWeight:"800",margin:0}}>{s.val}</p>
                      <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",margin:"3px 0 0"}}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI Row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"14px",marginBottom:"20px"}}>
                {[
                  {icon:"🏗️",label:"Active Projects",val:"3",color:"#93c5fd"},
                  {icon:"✅",label:"Completed",val:"2",color:"#86efac"},
                  {icon:"⏳",label:"Pending Approval",val:"1",color:"#fde68a"},
                  {icon:"👷",label:"Total Workers",val:"54",color:"#c4b5fd"},
                ].map((k,i)=>(
                  <div key={i} className="card" style={{textAlign:"center",cursor:"default"}}>
                    <div style={{fontSize:"28px",marginBottom:"8px"}}>{k.icon}</div>
                    <p style={{color:k.color,fontSize:"20px",fontWeight:"800",margin:0}}>{k.val}</p>
                    <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",margin:"4px 0 0"}}>{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Projects + Upcoming */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",flexWrap:"wrap"}}>
                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"14px"}}>RECENT PROJECTS</p>
                  {projects.slice(0,3).map((p,i)=>(
                    <div key={i} style={{marginBottom:"14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                        <p style={{color:"white",fontWeight:"600",fontSize:"13px",margin:0}}>{p.name}</p>
                        <Badge status={p.status}/>
                      </div>
                      <ProgressBar value={p.progress} color={p.status==="Completed"?"#16A34A":p.status==="On Hold"?"#F59E0B":"#2563EB"}/>
                      <p style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",margin:"4px 0 0"}}>{p.progress}% complete • Deadline: {p.deadline}</p>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"14px"}}>UPCOMING SCHEDULE</p>
                  {meetings.map((m,i)=>(
                    <div key={i} style={{display:"flex",gap:"12px",alignItems:"center",padding:"10px",background:"rgba(255,255,255,0.05)",borderRadius:"10px",marginBottom:"8px"}}>
                      <span style={{fontSize:"22px"}}>{m.icon}</span>
                      <div style={{flex:1}}>
                        <p style={{color:"white",fontSize:"13px",fontWeight:"600",margin:0}}>{m.title}</p>
                        <p style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",margin:"2px 0 0"}}>{m.date} • {m.time}</p>
                      </div>
                      <span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"6px",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",whiteSpace:"nowrap"}}>{m.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ PROJECTS ════ */}
          {activeSection==="projects" && (
            <div className="fade-up">
              {/* Filter Tabs */}
              <div style={{display:"flex",gap:"8px",marginBottom:"18px",flexWrap:"wrap"}}>
                {["All","In Progress","Completed","On Hold","Pending Approval"].map(f=>(
                  <button key={f} className="tab-pill"
                    onClick={()=>setProjectFilter(f)}
                    style={{background:projectFilter===f?"white":"rgba(255,255,255,0.1)",color:projectFilter===f?"#0f1f5c":"rgba(255,255,255,0.7)",border:projectFilter===f?"none":"1px solid rgba(255,255,255,0.15)"}}>
                    {f}
                  </button>
                ))}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {filteredProjects.map((p,i)=>(
                  <div key={i} className="card">
                    <div style={{display:"flex",gap:"16px",alignItems:"flex-start",flexWrap:"wrap"}}>
                      <div style={{width:"48px",height:"48px",borderRadius:"14px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>🏗️</div>
                      <div style={{flex:1,minWidth:"200px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px",marginBottom:"6px"}}>
                          <h3 style={{color:"white",fontSize:"15px",fontWeight:"700",margin:0}}>{p.name}</h3>
                          <Badge status={p.status}/>
                        </div>
                        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"0 0 10px"}}>
                          👤 {p.client} &nbsp;•&nbsp; 📍 {p.location} &nbsp;•&nbsp; 💰 {p.value} &nbsp;•&nbsp; 📅 {p.deadline} &nbsp;•&nbsp; 👷 {p.workers} workers
                        </p>
                        <ProgressBar value={p.progress} color={p.status==="Completed"?"#16A34A":p.status==="On Hold"?"#F59E0B":"#2563EB"}/>
                        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",margin:"5px 0 0"}}>{p.progress}% complete</p>
                      </div>
                      <div style={{display:"flex",gap:"8px",flexShrink:0}}>
                        <button className="btn-outline" style={{padding:"7px 14px",fontSize:"12px"}}>View</button>
                        {p.status!=="Completed" && <button className="btn-white" style={{padding:"7px 14px",fontSize:"12px"}}>Update</button>}
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
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px",flexWrap:"wrap",gap:"10px"}}>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:"13px",margin:0}}>Total: {workers.length} workers assigned</p>
                <button className="btn-white">+ Assign New Worker</button>
              </div>

              {/* Workers Table */}
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <div className="table-row" style={{gridTemplateColumns:"2fr 1fr 1fr 2fr 1fr",background:"rgba(255,255,255,0.05)"}}>
                  {["Worker","Role","Attendance","Current Task","Progress"].map(h=>(
                    <span key={h} style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",fontWeight:"700",letterSpacing:"0.8px"}}>{h.toUpperCase()}</span>
                  ))}
                </div>
                {workers.map((w,i)=>(
                  <div key={i} className="table-row" style={{gridTemplateColumns:"2fr 1fr 1fr 2fr 1fr"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"rgba(37,99,235,0.3)",border:"1px solid rgba(37,99,235,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>👷</div>
                      <div>
                        <p style={{color:"white",fontSize:"13px",fontWeight:"600",margin:0}}>{w.name}</p>
                        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",margin:0}}>{w.phone}</p>
                      </div>
                    </div>
                    <span style={{color:"rgba(255,255,255,0.7)",fontSize:"13px"}}>{w.role}</span>
                    <div>
                      <span style={{color: w.attendance>=90?"#86efac":w.attendance>=80?"#fde68a":"#fca5a5",fontSize:"13px",fontWeight:"700"}}>{w.attendance}%</span>
                    </div>
                    <span style={{color:"rgba(255,255,255,0.7)",fontSize:"12px"}}>{w.task}</span>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <ProgressBar value={w.progress}/>
                      <span style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",whiteSpace:"nowrap"}}>{w.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance Summary */}
              <div style={{marginTop:"16px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"12px"}}>
                {[{label:"Avg Attendance",val:"87.6%",color:"#86efac"},{label:"Present Today",val:"47/54",color:"#93c5fd"},{label:"On Leave",val:"4",color:"#fde68a"},{label:"Absent",val:"3",color:"#fca5a5"}].map((s,i)=>(
                  <div key={i} className="card" style={{textAlign:"center"}}>
                    <p style={{color:s.color,fontSize:"20px",fontWeight:"800",margin:0}}>{s.val}</p>
                    <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"4px 0 0"}}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ PROPOSALS ════ */}
          {activeSection==="proposals" && (
            <div className="fade-up">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px",flexWrap:"wrap",gap:"10px"}}>
                <div style={{display:"flex",gap:"8px"}}>
                  {[{label:"Total",val:proposals.length},{label:"Accepted",val:proposals.filter(p=>p.status==="Accepted").length},{label:"Rejected",val:proposals.filter(p=>p.status==="Rejected").length},{label:"Pending",val:proposals.filter(p=>p.status==="Sent").length}].map((s,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"10px",padding:"8px 14px",textAlign:"center"}}>
                      <p style={{color:"white",fontWeight:"700",fontSize:"16px",margin:0}}>{s.val}</p>
                      <p style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",margin:0}}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-white">+ New Proposal</button>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {proposals.map((p,i)=>(
                  <div key={i} className="card">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
                      <div style={{display:"flex",gap:"14px",alignItems:"center"}}>
                        <span style={{fontSize:"28px"}}>{p.status==="Accepted"?"🏆":p.status==="Rejected"?"❌":"📋"}</span>
                        <div>
                          <p style={{color:"white",fontWeight:"700",fontSize:"14px",margin:0}}>{p.project}</p>
                          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"3px 0 0"}}>👤 {p.client} &nbsp;•&nbsp; 💰 {p.value} &nbsp;•&nbsp; 📅 {p.date}</p>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                        <Badge status={p.status}/>
                        {p.status==="Sent" && <button className="btn-outline" style={{padding:"6px 12px",fontSize:"11px"}}>View</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Messages */}
              <div className="card" style={{marginTop:"16px"}}>
                <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"14px"}}>💬 CLIENT MESSAGES</p>
                {[
                  {client:"NHAI",msg:"Please share updated work report for NH-48",time:"2h ago",unread:true},
                  {client:"Lodha Group",msg:"Site visit confirmed for March 1st",time:"5h ago",unread:true},
                  {client:"AAI",msg:"Contract documents have been approved",time:"1d ago",unread:false},
                ].map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:"12px",alignItems:"center",padding:"12px",background:m.unread?"rgba(37,99,235,0.12)":"rgba(255,255,255,0.04)",borderRadius:"12px",marginBottom:"8px",border:m.unread?"1px solid rgba(37,99,235,0.3)":"1px solid transparent",cursor:"pointer"}}>
                    <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"rgba(37,99,235,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>💼</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p style={{color:"white",fontWeight:"700",fontSize:"13px",margin:0}}>{m.client}</p>
                        <span style={{color:"rgba(255,255,255,0.35)",fontSize:"11px"}}>{m.time}</span>
                      </div>
                      <p style={{color:"rgba(255,255,255,0.55)",fontSize:"12px",margin:"2px 0 0"}}>{m.msg}</p>
                    </div>
                    {m.unread && <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#2563EB",flexShrink:0}}/>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ SCHEDULE ════ */}
          {activeSection==="schedule" && (
            <div className="fade-up">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
                {/* Calendar-style upcoming */}
                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"14px"}}>📅 UPCOMING EVENTS</p>
                  {meetings.map((m,i)=>(
                    <div key={i} style={{display:"flex",gap:"12px",alignItems:"center",padding:"12px",background:"rgba(255,255,255,0.05)",borderRadius:"12px",marginBottom:"8px",border:"1px solid rgba(255,255,255,0.08)"}}>
                      <div style={{width:"44px",height:"44px",borderRadius:"12px",background:"rgba(37,99,235,0.25)",border:"1px solid rgba(37,99,235,0.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,flexDirection:"column"}}>
                        <span style={{fontSize:"18px"}}>{m.icon}</span>
                      </div>
                      <div style={{flex:1}}>
                        <p style={{color:"white",fontWeight:"600",fontSize:"13px",margin:0}}>{m.title}</p>
                        <p style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",margin:"3px 0 0"}}>📅 {m.date} &nbsp;•&nbsp; 🕐 {m.time}</p>
                      </div>
                      <span style={{fontSize:"10px",padding:"3px 8px",borderRadius:"6px",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",whiteSpace:"nowrap"}}>{m.type}</span>
                    </div>
                  ))}
                  <button className="btn-outline" style={{width:"100%",marginTop:"8px",fontSize:"12px",padding:"10px"}}>+ Add Event</button>
                </div>

                {/* Reminders */}
                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"14px"}}>🔔 REMINDERS</p>
                  {[
                    {text:"NH-48 Progress report submit karo",due:"Today",urgent:true},
                    {text:"IT Park invoice follow-up — overdue",due:"Tomorrow",urgent:true},
                    {text:"Worker safety audit preparation",due:"Mar 10",urgent:false},
                    {text:"PF deposit deadline",due:"Mar 15",urgent:false},
                    {text:"Renew contractor license",due:"Apr 01",urgent:false},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:r.urgent?"rgba(220,38,38,0.1)":"rgba(255,255,255,0.05)",borderRadius:"10px",marginBottom:"8px",border:r.urgent?"1px solid rgba(220,38,38,0.25)":"1px solid rgba(255,255,255,0.07)"}}>
                      <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                        <span style={{fontSize:"14px"}}>{r.urgent?"🚨":"📌"}</span>
                        <p style={{color:"white",fontSize:"12px",margin:0}}>{r.text}</p>
                      </div>
                      <span style={{color:r.urgent?"#fca5a5":"rgba(255,255,255,0.4)",fontSize:"11px",fontWeight:"600",whiteSpace:"nowrap",marginLeft:"8px"}}>{r.due}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Timeline */}
              <div className="card">
                <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"16px"}}>📊 PROJECT TIMELINE</p>
                <div style={{overflowX:"auto"}}>
                  {projects.filter(p=>p.status!=="Pending Approval").map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}>
                      <p style={{color:"white",fontSize:"12px",fontWeight:"600",margin:0,minWidth:"180px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</p>
                      <div style={{flex:1,minWidth:"200px"}}>
                        <ProgressBar value={p.progress} color={p.status==="Completed"?"#16A34A":p.status==="On Hold"?"#F59E0B":"#2563EB"}/>
                      </div>
                      <span style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",whiteSpace:"nowrap"}}>{p.progress}% • {p.deadline}</span>
                      <Badge status={p.status}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ DOCUMENTS ════ */}
          {activeSection==="documents" && (
            <div className="fade-up">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px",flexWrap:"wrap",gap:"10px"}}>
                <input className="input-field" placeholder="🔍 Search documents..." style={{maxWidth:"300px"}}/>
                <button className="btn-white">📤 Upload Document</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"14px"}}>
                {documents.map((d,i)=>(
                  <div key={i} className="card" style={{cursor:"pointer"}}>
                    <div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"12px"}}>
                      <div style={{width:"44px",height:"44px",borderRadius:"12px",background:"rgba(37,99,235,0.2)",border:"1px solid rgba(37,99,235,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>{d.icon}</div>
                      <div style={{flex:1,overflow:"hidden"}}>
                        <p style={{color:"white",fontWeight:"600",fontSize:"13px",margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.name}</p>
                        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",margin:"3px 0 0"}}>{d.type} • {d.size}</p>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"rgba(255,255,255,0.35)",fontSize:"11px"}}>{d.date}</span>
                      <div style={{display:"flex",gap:"6px"}}>
                        <button className="btn-outline" style={{padding:"4px 10px",fontSize:"11px"}}>View</button>
                        <button className="btn-outline" style={{padding:"4px 10px",fontSize:"11px"}}>📥</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upload placeholder */}
                <div style={{background:"rgba(255,255,255,0.04)",border:"2px dashed rgba(255,255,255,0.2)",borderRadius:"16px",padding:"20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s",minHeight:"130px",gap:"8px"}}>
                  <span style={{fontSize:"28px",opacity:0.5}}>📤</span>
                  <p style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",margin:0,textAlign:"center"}}>Upload New Document</p>
                  <p style={{color:"rgba(255,255,255,0.25)",fontSize:"11px",margin:0}}>PDF, DWG, ZIP supported</p>
                </div>
              </div>
            </div>
          )}

          {/* ════ FEEDBACK ════ */}
          {activeSection==="feedback" && (
            <div className="fade-up">
              {/* Score Banner */}
              <div style={{background:"rgba(37,99,235,0.2)",border:"1.5px solid rgba(37,99,235,0.35)",borderRadius:"20px",padding:"24px",marginBottom:"20px",display:"flex",gap:"24px",alignItems:"center",flexWrap:"wrap"}}>
                <div style={{textAlign:"center"}}>
                  <p style={{color:"white",fontSize:"48px",fontWeight:"800",margin:0,lineHeight:1}}>{contractor.rating}</p>
                  <Stars rating={Math.floor(contractor.rating)}/>
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"4px 0 0"}}>Overall Rating</p>
                </div>
                <div style={{width:"1px",height:"80px",background:"rgba(255,255,255,0.15)"}}/>
                <div>
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",margin:"0 0 6px"}}>PERFORMANCE SCORE</p>
                  <p style={{color:"#86efac",fontSize:"36px",fontWeight:"800",margin:0}}>{contractor.score}<span style={{fontSize:"16px",color:"rgba(255,255,255,0.5)"}}>/100</span></p>
                  <ProgressBar value={contractor.score} color="#16A34A"/>
                </div>
                <div style={{flex:1,minWidth:"200px"}}>
                  {[{label:"Quality",val:95},{label:"Timeliness",val:88},{label:"Communication",val:92},{label:"Safety",val:90}].map((r,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
                      <span style={{color:"rgba(255,255,255,0.6)",fontSize:"12px",minWidth:"100px"}}>{r.label}</span>
                      <div style={{flex:1}}><ProgressBar value={r.val} color="#2563EB"/></div>
                      <span style={{color:"white",fontSize:"12px",fontWeight:"600",minWidth:"30px"}}>{r.val}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Cards */}
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {feedback.map((f,i)=>(
                  <div key={i} className="card">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"10px",marginBottom:"10px"}}>
                      <div>
                        <p style={{color:"white",fontWeight:"700",fontSize:"14px",margin:0}}>{f.client}</p>
                        <p style={{color:"rgba(255,255,255,0.45)",fontSize:"12px",margin:"3px 0 0"}}>🏗️ {f.project} &nbsp;•&nbsp; 📅 {f.date}</p>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                        <Stars rating={f.rating}/>
                        <span style={{color:"#fbbf24",fontWeight:"700",fontSize:"14px"}}>{f.rating}.0</span>
                      </div>
                    </div>
                    <p style={{color:"rgba(255,255,255,0.7)",fontSize:"13px",margin:0,fontStyle:"italic",background:"rgba(255,255,255,0.05)",borderRadius:"10px",padding:"10px 14px"}}>
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
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:"16px"}}>
                {/* Personal Details */}
                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"16px"}}>👤 PERSONAL DETAILS</p>
                  <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                    {[{label:"Full Name",val:contractor.name},{label:"Company",val:contractor.company},{label:"eKYC Key",val:contractor.ekycKey},{label:"Phone",val:"+91 98XX XXXX 21"},{label:"Email",val:"sunil@mehtaconstructions.in"}].map((f,i)=>(
                      <div key={i}>
                        <label style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",letterSpacing:"0.5px",display:"block",marginBottom:"5px"}}>{f.label.toUpperCase()}</label>
                        <input className="input-field" defaultValue={f.val} style={{padding:"10px 14px"}}/>
                      </div>
                    ))}
                    <button className="btn-white" style={{marginTop:"4px"}}>Save Changes</button>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"16px"}}>🏦 BANK DETAILS</p>
                  <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                    {[{label:"Account Holder",val:"Sunil Mehta"},{label:"Bank Name",val:"HDFC Bank"},{label:"Account Number",val:"XXXX XXXX 4521"},{label:"IFSC Code",val:"HDFC0001234"},{label:"Branch",val:"Andheri West, Mumbai"}].map((f,i)=>(
                      <div key={i}>
                        <label style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",letterSpacing:"0.5px",display:"block",marginBottom:"5px"}}>{f.label.toUpperCase()}</label>
                        <input className="input-field" defaultValue={f.val} style={{padding:"10px 14px"}}/>
                      </div>
                    ))}
                    <button className="btn-white" style={{marginTop:"4px"}}>Update Bank Details</button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"16px"}}>🔔 NOTIFICATION SETTINGS</p>
                  <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                    {[
                      {label:"Payment Received",on:true},
                      {label:"Project Deadline Reminders",on:true},
                      {label:"Worker Attendance Alert",on:false},
                      {label:"New Client Messages",on:true},
                      {label:"Proposal Status Updates",on:true},
                      {label:"System Maintenance Alerts",on:false},
                    ].map((n,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(255,255,255,0.05)",borderRadius:"10px"}}>
                        <span style={{color:"white",fontSize:"13px"}}>{n.label}</span>
                        <div style={{width:"40px",height:"22px",borderRadius:"99px",background:n.on?"#16A34A":"rgba(255,255,255,0.15)",cursor:"pointer",position:"relative",border:`1px solid ${n.on?"#16A34A":"rgba(255,255,255,0.2)"}`}}>
                          <div style={{position:"absolute",top:"2px",left:n.on?"20px":"2px",width:"16px",height:"16px",borderRadius:"50%",background:"white",transition:"left 0.2s"}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div className="card">
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:"11px",letterSpacing:"1px",marginBottom:"16px"}}>🔒 SECURITY SETTINGS</p>
                  <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                    <div>
                      <label style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",letterSpacing:"0.5px",display:"block",marginBottom:"5px"}}>CURRENT PASSWORD</label>
                      <input type="password" className="input-field" placeholder="••••••••" style={{padding:"10px 14px"}}/>
                    </div>
                    <div>
                      <label style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",letterSpacing:"0.5px",display:"block",marginBottom:"5px"}}>NEW PASSWORD</label>
                      <input type="password" className="input-field" placeholder="••••••••" style={{padding:"10px 14px"}}/>
                    </div>
                    <div>
                      <label style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",letterSpacing:"0.5px",display:"block",marginBottom:"5px"}}>CONFIRM NEW PASSWORD</label>
                      <input type="password" className="input-field" placeholder="••••••••" style={{padding:"10px 14px"}}/>
                    </div>
                    <button className="btn-white">Update Password</button>
                    <div style={{background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:"12px",padding:"14px"}}>
                      <p style={{color:"#fca5a5",fontWeight:"700",fontSize:"13px",margin:"0 0 6px"}}>⚠️ Danger Zone</p>
                      <p style={{color:"rgba(255,255,255,0.5)",fontSize:"12px",margin:"0 0 10px"}}>Account deactivate karne se saari information hata di jayegi.</p>
                      <button style={{padding:"8px 16px",background:"rgba(220,38,38,0.25)",border:"1px solid rgba(220,38,38,0.5)",borderRadius:"8px",color:"#fca5a5",fontWeight:"600",fontSize:"12px",cursor:"pointer",fontFamily:"'Segoe UI',sans-serif"}}>
                        Deactivate Account
                      </button>
                    </div>
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