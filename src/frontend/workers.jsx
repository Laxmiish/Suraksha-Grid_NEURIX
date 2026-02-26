// src/frontend/WorkerDashboard.jsx

import React, { useState } from "react";

const mockWorker = {
  name: "Ramesh Kumar",
  aadhaar: "XXXX XXXX 4521",
  state: "Uttar Pradesh → Maharashtra",
  status: "Active",
  since: "2019",
  photo: "👷",
  ekycKey: "SG-A3F2B-4521",
};

const mockUnions = [
  { name: "AITUC - Delhi", from: "2019", to: "2021", state: "Delhi", benefit: "Medical + PF", icon: "🏛️" },
  { name: "INTUC - Pune", from: "2021", to: "2023", state: "Maharashtra", benefit: "Insurance + HRA", icon: "🏢" },
  { name: "HMS - Mumbai", from: "2023", to: "Present", state: "Maharashtra", benefit: "Full Benefits", icon: "⚖️" },
];

const mockHistory = [
  { company: "Tata Construction", role: "Site Worker", from: "Jan 2019", to: "Mar 2021", location: "Delhi", wage: "₹12,000/mo", icon: "🏗️" },
  { company: "Reliance Infra", role: "Helper", from: "Apr 2021", to: "Dec 2022", location: "Pune", wage: "₹14,500/mo", icon: "🔧" },
  { company: "L&T Projects", role: "Senior Worker", from: "Jan 2023", to: "Present", location: "Mumbai", wage: "₹18,000/mo", icon: "🏭" },
];

const mockBenefits = [
  { name: "Provident Fund (PF)", status: "Active", amount: "₹2,160/mo", icon: "💰", color: "#16A34A", desc: "12% of basic wage contributed" },
  { name: "ESIC Health Insurance", status: "Active", amount: "₹5L cover", icon: "🏥", color: "#2563EB", desc: "Family included, cashless treatment" },
  { name: "Pradhan Mantri Awas", status: "Eligible", amount: "₹1.5L subsidy", icon: "🏠", color: "#F59E0B", desc: "Apply karo — abhi available hai" },
  { name: "Maternity Benefit", status: "Eligible", amount: "₹26 weeks paid", icon: "👶", color: "#8B5CF6", desc: "Applicable for female workers" },
  { name: "Gratuity", status: "Pending", amount: "₹42,000", icon: "🎁", color: "#F97316", desc: "5 saal baad milega — 1 saal bacha" },
  { name: "Skill Development", status: "Available", amount: "Free Course", icon: "📚", color: "#06B6D4", desc: "PMKVY scheme — enroll karo" },
];

// ── LABOUR BOARD DATA ──────────────────────────────────────
const mockLabourBoards = [
  {
    name: "Delhi Building & Other Construction Workers Board",
    shortName: "Delhi BOCW Board",
    state: "Delhi",
    regNumber: "DL-BOCW-2019-48231",
    from: "Jan 2019",
    to: "Mar 2021",
    status: "Inactive",
    icon: "🏛️",
    color: "#6366F1",
    benefits: ["₹2L Accident Insurance", "Free Medical OPD", "Scholarship for 2 children", "Funeral Assistance ₹5,000"],
    contributions: "₹50/month (worker) + ₹250/month (employer)",
    contact: "011-2338-XXXX",
    website: "bocw.delhi.gov.in",
    certStatus: "Expired",
  },
  {
    name: "Maharashtra Building & Other Construction Workers Board",
    shortName: "Maharashtra BOCW Board",
    state: "Maharashtra",
    regNumber: "MH-BOCW-2021-91847",
    from: "Apr 2021",
    to: "Present",
    status: "Active",
    icon: "🏢",
    color: "#16A34A",
    benefits: ["₹5L Accident Insurance", "Pension Scheme", "Housing Loan Subsidy ₹1L", "Tool Kit Assistance ₹5,000", "Maternity Benefit 90 days"],
    contributions: "₹60/month (worker) + ₹300/month (employer)",
    contact: "022-2282-XXXX",
    website: "bocw.maharashtra.gov.in",
    certStatus: "Valid till Dec 2025",
  },
  {
    name: "Inter-State Migrant Workmen Board",
    shortName: "ISMW Board",
    state: "Central (Govt. of India)",
    regNumber: "ISMW-2020-CEN-77231",
    from: "Jan 2020",
    to: "Present",
    status: "Active",
    icon: "🇮🇳",
    color: "#F59E0B",
    benefits: ["Free Railway Pass (once/year)", "₹1L Accident Cover", "Emergency Medical Aid", "Displacement Allowance ₹500/month"],
    contributions: "Nil (fully government funded)",
    contact: "1800-XXX-XXXX (Toll Free)",
    website: "labour.gov.in/ismw",
    certStatus: "Valid",
  },
];

const tabs = ["Overview", "Work History", "Union History", "Labour Board", "Benefits"];

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [expandedBoard, setExpandedBoard] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#1a3a8f",
      fontFamily: "'Segoe UI', sans-serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-15px) scale(1.04)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,15px) scale(1.03)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .tab-btn {
          padding: 10px 20px; border: none; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; white-space: nowrap; letter-spacing: 0.3px;
        }
        .card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 14px;
          backdrop-filter: blur(10px);
          transition: all 0.2s;
        }
        .card:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); }
        .stat-card {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 14px;
          padding: 16px;
          flex: 1;
          min-width: 120px;
          text-align: center;
        }
        .badge {
          display: inline-block; padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
        }
        .benefit-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 16px;
          transition: all 0.25s;
          cursor: default;
        }
        .benefit-card:hover {
          background: rgba(255,255,255,0.13);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .board-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          margin-bottom: 14px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .board-card:hover { border-color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
      `}</style>

      {/* Background Blobs */}
      <div style={{ position:"fixed", inset:0, overflow:"hidden", zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-15%", left:"-10%", width:"50%", height:"60%", borderRadius:"50%", background:"rgba(100,130,255,0.3)", animation:"blob1 9s ease-in-out infinite", filter:"blur(4px)" }} />
        <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"55%", height:"55%", borderRadius:"50%", background:"rgba(80,110,255,0.25)", animation:"blob2 11s ease-in-out infinite", filter:"blur(4px)" }} />
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:"860px", margin:"0 auto", padding:"24px 20px" }}>

        {/* ── TOP NAV ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>🛡️</div>
            <div>
              <p style={{ color:"white", fontWeight:"800", fontSize:"15px", margin:0 }}>Suraksha Grid</p>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", margin:0 }}>Worker Portal</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", cursor:"pointer" }}>🔔</div>
            <a href="/" style={{ padding:"8px 16px", background:"rgba(220,38,38,0.2)", border:"1px solid rgba(220,38,38,0.4)", borderRadius:"10px", color:"#fca5a5", fontSize:"13px", fontWeight:"600", textDecoration:"none" }}>Logout</a>
          </div>
        </div>

        {/* ── WORKER PROFILE CARD ── */}
        <div className="fade-up" style={{
          background:"rgba(37,99,235,0.3)", border:"1.5px solid rgba(255,255,255,0.2)",
          borderRadius:"20px", padding:"24px", marginBottom:"20px",
          backdropFilter:"blur(16px)", display:"flex", gap:"20px",
          alignItems:"center", flexWrap:"wrap",
        }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"18px", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"36px", flexShrink:0 }}>
            {mockWorker.photo}
          </div>
          <div style={{ flex:1, minWidth:"200px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
              <h2 style={{ color:"white", fontSize:"20px", fontWeight:"800", margin:0 }}>{mockWorker.name}</h2>
              <span className="badge" style={{ background:"rgba(22,163,74,0.25)", color:"#86efac", border:"1px solid rgba(22,163,74,0.4)" }}>
                ✅ {mockWorker.status}
              </span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"13px", margin:"4px 0 0" }}>
              🪪 {mockWorker.aadhaar} &nbsp;•&nbsp; 📍 {mockWorker.state} &nbsp;•&nbsp; 🗓️ Worker since {mockWorker.since}
            </p>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", margin:"4px 0 0", fontFamily:"monospace" }}>
              eKYC: {mockWorker.ekycKey}
            </p>
          </div>
          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
            {[
              { label:"Work Years", val:"5+" },
              { label:"Unions", val:"3" },
              { label:"Labour Boards", val:"3" },
              { label:"Benefits", val:"6" },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <p style={{ color:"white", fontSize:"22px", fontWeight:"800", margin:0 }}>{s.val}</p>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", margin:"2px 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"20px", overflowX:"auto", paddingBottom:"4px" }}>
          {tabs.map(tab => (
            <button
              key={tab}
              className="tab-btn"
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab===tab ? "white" : "rgba(255,255,255,0.1)",
                color: activeTab===tab ? "#1a3a8f" : "rgba(255,255,255,0.7)",
                border: activeTab===tab ? "none" : "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {tab === "Overview" && "📊 "}
              {tab === "Work History" && "💼 "}
              {tab === "Union History" && "🏛️ "}
              {tab === "Labour Board" && "🏗️ "}
              {tab === "Benefits" && "🎁 "}
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "Overview" && (
          <div className="fade-up">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"14px", marginBottom:"16px" }}>
              {[
                { icon:"💰", label:"Total PF Saved", val:"₹1,55,520", color:"#86efac" },
                { icon:"🏥", label:"Health Cover", val:"₹5,00,000", color:"#93c5fd" },
                { icon:"📅", label:"Days Worked", val:"1,847", color:"#fde68a" },
                { icon:"🏆", label:"Current Union", val:"HMS Mumbai", color:"#c4b5fd" },
              ].map((s,i) => (
                <div key={i} className="card" style={{ textAlign:"center", marginBottom:0 }}>
                  <div style={{ fontSize:"28px", marginBottom:"8px" }}>{s.icon}</div>
                  <p style={{ color:s.color, fontSize:"18px", fontWeight:"800", margin:0 }}>{s.val}</p>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"4px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Current Job */}
            <div className="card">
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"12px" }}>CURRENT JOB</p>
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                <span style={{ fontSize:"32px" }}>🏭</span>
                <div>
                  <p style={{ color:"white", fontWeight:"700", fontSize:"16px", margin:0 }}>L&T Projects — Senior Worker</p>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px", margin:"4px 0 0" }}>📍 Mumbai &nbsp;•&nbsp; ₹18,000/mo &nbsp;•&nbsp; Jan 2023 – Present</p>
                </div>
                <span className="badge" style={{ marginLeft:"auto", background:"rgba(22,163,74,0.2)", color:"#86efac", border:"1px solid rgba(22,163,74,0.3)" }}>Active</span>
              </div>
            </div>

            {/* Active Labour Board */}
            <div className="card">
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"12px" }}>🏗️ ACTIVE LABOUR BOARD</p>
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"rgba(22,163,74,0.2)", border:"1px solid rgba(22,163,74,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🏢</div>
                <div style={{ flex:1 }}>
                  <p style={{ color:"white", fontWeight:"700", fontSize:"14px", margin:0 }}>Maharashtra BOCW Board</p>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"3px 0 0" }}>Reg: MH-BOCW-2021-91847 &nbsp;•&nbsp; Valid till Dec 2025</p>
                </div>
                <span className="badge" style={{ background:"rgba(22,163,74,0.2)", color:"#86efac", border:"1px solid rgba(22,163,74,0.3)" }}>Active</span>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="card">
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", letterSpacing:"1px", marginBottom:"12px" }}>⚠️ PENDING ACTIONS</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {[
                  { text:"Pradhan Mantri Awas ke liye apply karo", urgency:"High", color:"#FCA5A5" },
                  { text:"PMKVY Skill course enroll karo — free hai", urgency:"Medium", color:"#FDE68A" },
                  { text:"Delhi BOCW Board card renew karo", urgency:"Medium", color:"#FDE68A" },
                  { text:"Gratuity claim 1 saal mein eligible hogi", urgency:"Low", color:"#93C5FD" },
                ].map((a,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"rgba(255,255,255,0.06)", borderRadius:"10px", gap:"10px" }}>
                    <p style={{ color:"white", fontSize:"13px", margin:0 }}>{a.text}</p>
                    <span className="badge" style={{ background:"rgba(0,0,0,0.2)", color:a.color, border:`1px solid ${a.color}40`, flexShrink:0 }}>{a.urgency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WORK HISTORY TAB ── */}
        {activeTab === "Work History" && (
          <div className="fade-up">
            <div style={{ position:"relative", paddingLeft:"20px" }}>
              <div style={{ position:"absolute", left:"5px", top:0, bottom:0, width:"2px", background:"rgba(255,255,255,0.15)", borderRadius:"1px" }} />
              {mockHistory.map((job, i) => (
                <div key={i} style={{ position:"relative", marginBottom:"14px" }}>
                  <div style={{ position:"absolute", left:"-20px", top:"22px", width:"10px", height:"10px", borderRadius:"50%", background: i===mockHistory.length-1 ? "#86efac" : "rgba(255,255,255,0.5)", border:"2px solid rgba(255,255,255,0.3)" }} />
                  <div className="card" style={{ cursor:"pointer", marginBottom:0 }} onClick={() => setExpandedHistory(expandedHistory===i ? null : i)}>
                    <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                      <span style={{ fontSize:"28px" }}>{job.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
                          <p style={{ color:"white", fontWeight:"700", fontSize:"15px", margin:0 }}>{job.company}</p>
                          {i === mockHistory.length-1 && (
                            <span className="badge" style={{ background:"rgba(22,163,74,0.2)", color:"#86efac", border:"1px solid rgba(22,163,74,0.3)" }}>Current</span>
                          )}
                        </div>
                        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"13px", margin:"4px 0 0" }}>
                          {job.role} &nbsp;•&nbsp; 📍 {job.location}
                        </p>
                      </div>
                      <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"18px" }}>{expandedHistory===i ? "▲" : "▼"}</span>
                    </div>
                    {expandedHistory===i && (
                      <div style={{ marginTop:"14px", paddingTop:"14px", borderTop:"1px solid rgba(255,255,255,0.1)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                        {[
                          { label:"Duration", val:`${job.from} – ${job.to}` },
                          { label:"Monthly Wage", val:job.wage },
                          { label:"Location", val:job.location },
                          { label:"Role", val:job.role },
                        ].map((d,j) => (
                          <div key={j} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"10px", padding:"10px 12px" }}>
                            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", margin:0, letterSpacing:"0.5px" }}>{d.label.toUpperCase()}</p>
                            <p style={{ color:"white", fontSize:"14px", fontWeight:"600", margin:"4px 0 0" }}>{d.val}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UNION HISTORY TAB ── */}
        {activeTab === "Union History" && (
          <div className="fade-up">
            <div style={{ background:"rgba(37,99,235,0.15)", border:"1px solid rgba(37,99,235,0.3)", borderRadius:"14px", padding:"14px 16px", marginBottom:"16px" }}>
              <p style={{ color:"#93c5fd", fontSize:"13px", margin:0 }}>
                ℹ️ Aap 3 unions ke member rahe hain. Har union ne alag-alag benefits provide kiye hain.
              </p>
            </div>
            {mockUnions.map((union, i) => (
              <div key={i} className="card">
                <div style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>
                    {union.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
                      <p style={{ color:"white", fontWeight:"700", fontSize:"15px", margin:0 }}>{union.name}</p>
                      <span className="badge" style={{
                        background: union.to==="Present" ? "rgba(22,163,74,0.2)" : "rgba(255,255,255,0.1)",
                        color: union.to==="Present" ? "#86efac" : "rgba(255,255,255,0.6)",
                        border: union.to==="Present" ? "1px solid rgba(22,163,74,0.3)" : "1px solid rgba(255,255,255,0.2)",
                      }}>
                        {union.to==="Present" ? "✅ Current" : "Past"}
                      </span>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px", margin:"5px 0" }}>
                      📍 {union.state} &nbsp;•&nbsp; 🗓️ {union.from} – {union.to}
                    </p>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"8px" }}>
                      <span style={{ fontSize:"14px" }}>🎁</span>
                      <span style={{ color:"#fde68a", fontSize:"13px", fontWeight:"600" }}>{union.benefit}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LABOUR BOARD TAB ── */}
        {activeTab === "Labour Board" && (
          <div className="fade-up">

            {/* Info Banner */}
            <div style={{ background:"rgba(37,99,235,0.15)", border:"1px solid rgba(37,99,235,0.3)", borderRadius:"14px", padding:"14px 16px", marginBottom:"16px" }}>
              <p style={{ color:"#93c5fd", fontSize:"13px", margin:0 }}>
                ℹ️ Labour Boards government bodies hain jo construction workers ke welfare ke liye kaam karti hain. Aap jis bhi state mein kaam karte ho, wahan register hona zaroori hai.
              </p>
            </div>

            {/* Summary Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:"12px", marginBottom:"18px" }}>
              {[
                { icon:"🏛️", label:"Total Boards", val:"3", color:"#93c5fd" },
                { icon:"✅", label:"Active", val:"2", color:"#86efac" },
                { icon:"❌", label:"Inactive/Expired", val:"1", color:"#fca5a5" },
                { icon:"🛡️", label:"Total Coverage", val:"₹8L+", color:"#fde68a" },
              ].map((s,i) => (
                <div key={i} className="card" style={{ textAlign:"center", marginBottom:0 }}>
                  <div style={{ fontSize:"24px", marginBottom:"6px" }}>{s.icon}</div>
                  <p style={{ color:s.color, fontSize:"20px", fontWeight:"800", margin:0 }}>{s.val}</p>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", margin:"3px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Labour Board Cards */}
            {mockLabourBoards.map((board, i) => (
              <div key={i} className="board-card" style={{ borderLeft:`4px solid ${board.color}` }}>

                {/* Card Header — always visible */}
                <div
                  style={{ padding:"18px 20px", cursor:"pointer", display:"flex", gap:"16px", alignItems:"center" }}
                  onClick={() => setExpandedBoard(expandedBoard===i ? null : i)}
                >
                  <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:`${board.color}22`, border:`1px solid ${board.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px", flexShrink:0 }}>
                    {board.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px", marginBottom:"5px" }}>
                      <p style={{ color:"white", fontWeight:"700", fontSize:"15px", margin:0 }}>{board.shortName}</p>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                        <span className="badge" style={{
                          background: board.status==="Active" ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)",
                          color: board.status==="Active" ? "#86efac" : "#fca5a5",
                          border: board.status==="Active" ? "1px solid rgba(22,163,74,0.3)" : "1px solid rgba(220,38,38,0.3)",
                        }}>
                          {board.status==="Active" ? "✅ Active" : "❌ Inactive"}
                        </span>
                        <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"18px" }}>{expandedBoard===i ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:0 }}>
                      📍 {board.state} &nbsp;•&nbsp; 🗓️ {board.from} – {board.to} &nbsp;•&nbsp; 📋 {board.regNumber}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedBoard===i && (
                  <div style={{ padding:"0 20px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>

                    {/* Cert Status */}
                    <div style={{ marginTop:"14px", background: board.status==="Active" ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)", border:`1px solid ${board.status==="Active" ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`, borderRadius:"10px", padding:"10px 14px", marginBottom:"16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                        <span style={{ fontSize:"16px" }}>{board.status==="Active" ? "🛡️" : "⚠️"}</span>
                        <p style={{ color: board.status==="Active" ? "#86efac" : "#fca5a5", fontSize:"13px", fontWeight:"600", margin:0 }}>
                          Certificate: {board.certStatus}
                        </p>
                      </div>
                      {board.status!=="Active" && (
                        <button style={{ padding:"6px 14px", background:"white", color:"#1a3a8f", border:"none", borderRadius:"8px", fontWeight:"700", fontSize:"12px", cursor:"pointer" }}>
                          🔄 Renew Karo
                        </button>
                      )}
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>

                      {/* Benefits */}
                      <div>
                        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", letterSpacing:"1px", margin:"0 0 10px" }}>🎁 BENEFITS MILTE HAIN</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
                          {board.benefits.map((b,j) => (
                            <div key={j} style={{ display:"flex", gap:"8px", alignItems:"center", padding:"8px 12px", background:"rgba(255,255,255,0.05)", borderRadius:"8px" }}>
                              <span style={{ color:board.color, fontSize:"14px", flexShrink:0 }}>✓</span>
                              <span style={{ color:"rgba(255,255,255,0.8)", fontSize:"12px" }}>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", letterSpacing:"1px", margin:"0 0 10px" }}>📋 DETAILS</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                          {[
                            { label:"Registration No.", val:board.regNumber },
                            { label:"State", val:board.state },
                            { label:"Duration", val:`${board.from} – ${board.to}` },
                            { label:"Contribution", val:board.contributions },
                            { label:"Contact", val:board.contact },
                            { label:"Website", val:board.website },
                          ].map((d,j) => (
                            <div key={j} style={{ padding:"8px 12px", background:"rgba(255,255,255,0.05)", borderRadius:"8px" }}>
                              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px", letterSpacing:"0.5px", margin:0 }}>{d.label.toUpperCase()}</p>
                              <p style={{ color:"white", fontSize:"12px", fontWeight:"500", margin:"2px 0 0", fontFamily: d.label==="Registration No." ? "monospace" : "inherit" }}>{d.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Download Card Button */}
                    <button style={{ marginTop:"14px", width:"100%", padding:"11px", background:`${board.color}22`, border:`1.5px solid ${board.color}44`, borderRadius:"10px", color:"white", fontWeight:"600", fontSize:"13px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                      📄 Labour Board Card Download Karo
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Register New Board CTA */}
            <div style={{ marginTop:"6px", background:"rgba(255,255,255,0.04)", border:"2px dashed rgba(255,255,255,0.2)", borderRadius:"16px", padding:"20px", textAlign:"center" }}>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", margin:"0 0 10px" }}>🏗️ Nayi State mein kaam shuru kiya?</p>
              <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", margin:"0 0 14px" }}>Us state ke Labour Board mein register karo — benefits milenge</p>
              <button style={{ padding:"11px 24px", background:"white", color:"#1a3a8f", border:"none", borderRadius:"10px", fontWeight:"700", fontSize:"13px", cursor:"pointer" }}>
                + Nayi State mein Register Karo
              </button>
            </div>
          </div>
        )}

        {/* ── BENEFITS TAB ── */}
        {activeTab === "Benefits" && (
          <div className="fade-up">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"14px" }}>
              {mockBenefits.map((b, i) => (
                <div key={i} className="benefit-card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:`${b.color}22`, border:`1px solid ${b.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>
                      {b.icon}
                    </div>
                    <span className="badge" style={{
                      background: b.status==="Active" ? "rgba(22,163,74,0.2)" : b.status==="Eligible" ? "rgba(245,158,11,0.2)" : b.status==="Available" ? "rgba(37,99,235,0.2)" : "rgba(249,115,22,0.2)",
                      color: b.status==="Active" ? "#86efac" : b.status==="Eligible" ? "#fde68a" : b.status==="Available" ? "#93c5fd" : "#fdba74",
                      border: `1px solid ${b.status==="Active" ? "rgba(22,163,74,0.3)" : b.status==="Eligible" ? "rgba(245,158,11,0.3)" : b.status==="Available" ? "rgba(37,99,235,0.3)" : "rgba(249,115,22,0.3)"}`,
                    }}>
                      {b.status}
                    </span>
                  </div>
                  <p style={{ color:"white", fontWeight:"700", fontSize:"14px", margin:"0 0 4px" }}>{b.name}</p>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", margin:"0 0 10px", lineHeight:1.5 }}>{b.desc}</p>
                  <p style={{ color:b.color, fontWeight:"800", fontSize:"16px", margin:0 }}>{b.amount}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop:"16px", background:"rgba(37,99,235,0.2)", border:"1px solid rgba(37,99,235,0.4)", borderRadius:"16px", padding:"18px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"12px", margin:0, letterSpacing:"1px" }}>TOTAL ESTIMATED BENEFITS VALUE</p>
                <p style={{ color:"white", fontSize:"24px", fontWeight:"800", margin:"4px 0 0" }}>₹7,97,520 / year</p>
              </div>
              <button style={{ padding:"12px 20px", background:"white", color:"#1a3a8f", border:"none", borderRadius:"12px", fontWeight:"700", fontSize:"14px", cursor:"pointer" }}>
                📄 Report Download Karo
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(255,255,255,0.2)", marginTop:"28px", paddingBottom:"10px" }}>
          
        </p>
      </div>
    </div>
  );
}