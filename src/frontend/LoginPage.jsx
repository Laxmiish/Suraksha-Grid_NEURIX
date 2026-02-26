import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  primary: "#2563EB",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  background: "#F9FAFB",
};

export default function LoginPage() {
  const [role, setRole] = useState(null);
  const [aadhaar, setAadhaar] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpTimer, setOtpTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const startTimer = () => {
    setTimerActive(true);
    setOtpTimer(30);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setTimerActive(false); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = () => {
    if (aadhaar.length !== 12) { setError("12-digit Aadhaar number daalo"); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setOtpSent(true); startTimer(); }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) { setError("6-digit OTP daalo"); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); alert("Login Successful ✅"); }, 1500);
  };

  const currentStep = !role ? 1 : !otpSent ? 2 : 3;

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

      {/* Animated blob background */}
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,10px) scale(0.97)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,20px) scale(1.04)} 66%{transform:translate(20px,-15px) scale(0.98)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(15px,25px) scale(1.03)} 66%{transform:translate(-10px,-20px) scale(0.96)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(37,99,235,0.4)} 70%{box-shadow:0 0 0 10px rgba(37,99,235,0)} 100%{box-shadow:0 0 0 0 rgba(37,99,235,0)} }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
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
        .input-field::placeholder { color: rgba(255,255,255,0.5); letter-spacing: 0.5px; }
        .input-field:focus { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.18); }
        .input-field.error { border-color: #DC2626; }
        .input-field.success { border-color: #16A34A; }
        .btn-primary {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: white;
          color: #1a3a8f;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 1px;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-outline {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.4);
          background: transparent;
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: white; transform: translateY(-1px); }
        .btn-outline:active { transform: translateY(0); }
        .role-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(6px);
        }
        .role-btn:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.5); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .role-btn:active { transform: translateY(0); }
        .step-dot { width:8px; height:8px; border-radius:50%; transition: all 0.3s; }
        .back-btn { background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; padding:0; margin-bottom:16px; transition: color 0.2s; }
        .back-btn:hover { color:white; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Background Blobs */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-10%", left:"-5%", width:"50%", height:"60%", borderRadius:"50%", background:"rgba(100,130,255,0.35)", animation:"blob1 8s ease-in-out infinite", filter:"blur(2px)" }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"55%", height:"55%", borderRadius:"50%", background:"rgba(80,110,255,0.3)", animation:"blob2 10s ease-in-out infinite", filter:"blur(2px)" }} />
        <div style={{ position:"absolute", top:"30%", right:"10%", width:"35%", height:"40%", borderRadius:"50%", background:"rgba(120,150,255,0.2)", animation:"blob3 12s ease-in-out infinite", filter:"blur(4px)" }} />
        <div style={{ position:"absolute", bottom:"20%", left:"5%", width:"30%", height:"35%", borderRadius:"50%", background:"rgba(60,100,220,0.25)", animation:"blob1 9s ease-in-out infinite reverse", filter:"blur(3px)" }} />
      </div>

      {/* Card */}
      <div
        className="fade-up"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "420px",
          margin: "20px",
          background: "rgba(30,60,160,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          border: "1.5px solid rgba(255,255,255,0.2)",
          padding: "40px 36px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 16px",
          }}>
            🛡️
          </div>
          <h1 style={{ color:"white", fontSize:"22px", fontWeight:"800", margin:0, letterSpacing:"0.5px" }}>
            Suraksha Grid
          </h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"13px", margin:"6px 0 0" }}>
            Portable Social Security Portal
          </p>
        </div>

        {/* Step Dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"28px" }}>
          {[1,2,3].map(s => (
            <div key={s} className="step-dot" style={{
              background: s <= currentStep ? "white" : "rgba(255,255,255,0.25)",
              width: s === currentStep ? "24px" : "8px",
              borderRadius: "4px",
            }} />
          ))}
        </div>

        {/* ── STEP 1: Role ── */}
        {!role && (
          <div className="fade-up">
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", textAlign:"center", marginBottom:"20px", letterSpacing:"0.3px" }}>
              APNA ROLE CHUNEIN
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              <button className="role-btn" onClick={() => { setRole("worker"); setError(""); }}>
                <span style={{ fontSize:"24px" }}>👷</span>
                <div>
                  <div style={{ fontSize:"15px" }}>Main ek Worker hoon</div>
                  <div style={{ fontSize:"12px", opacity:0.6, fontWeight:400, marginTop:"2px" }}>Benefits & history dekho</div>
                </div>
              </button>
              <button className="role-btn" onClick={() => { setRole("contractor"); setError(""); }}>
                <span style={{ fontSize:"24px" }}>🏢</span>
                <div>
                  <div style={{ fontSize:"15px" }}>Main Contractor / Admin hoon</div>
                  <div style={{ fontSize:"12px", opacity:0.6, fontWeight:400, marginTop:"2px" }}>Workers manage karo</div>
                </div>
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"4px 0" }}>
                <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.15)" }} />
                <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>ya phir</span>
                <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.15)" }} />
              </div>
              <button className="btn-outline" onClick={() => navigate("/register")}>
                ✨ Naya Registration Karo
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Aadhaar ── */}
        {role && !otpSent && (
          <div className="fade-up">
            <button className="back-btn" onClick={() => { setRole(null); setAadhaar(""); setError(""); }}>
              ← Back
            </button>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", textAlign:"center", marginBottom:"20px", letterSpacing:"0.3px" }}>
              {role === "worker" ? "👷 WORKER LOGIN" : "🏢 CONTRACTOR LOGIN"}
            </p>

            {/* Aadhaar Input */}
            <div style={{ position:"relative", marginBottom:"8px" }}>
              <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"18px", opacity:0.7 }}>🪪</span>
              <input
                className={`input-field ${error ? "error" : aadhaar.length === 12 ? "success" : ""}`}
                type="text"
                maxLength="12"
                value={aadhaar}
                onChange={(e) => { setAadhaar(e.target.value.replace(/\D/g,"")); setError(""); }}
                placeholder="12-digit Aadhaar Number"
              />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
              <span style={{ fontSize:"12px", color: error ? "#fca5a5" : "rgba(255,255,255,0.4)" }}>
                {error || "Sirf numbers daalo"}
              </span>
              <span style={{ fontSize:"12px", color: aadhaar.length===12 ? "#86efac" : "rgba(255,255,255,0.4)" }}>
                {aadhaar.length}/12
              </span>
            </div>

            <button className="btn-primary" onClick={handleSendOtp} disabled={loading}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#1a3a8f" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#1a3a8f" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Bhej rahe hain...
                </span>
              ) : "OTP BHEJO →"}
            </button>
          </div>
        )}

        {/* ── STEP 3: OTP ── */}
        {otpSent && (
          <div className="fade-up">
            <button className="back-btn" onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}>
              ← Aadhaar Badlo
            </button>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", textAlign:"center", marginBottom:"4px", letterSpacing:"0.3px" }}>
              OTP VERIFY KARO
            </p>
            <p style={{ color:"#86efac", fontSize:"12px", textAlign:"center", marginBottom:"20px" }}>
              ✅ Bheja gaya: {aadhaar.slice(0,4)} XXXX XXXX
            </p>

            <div style={{ position:"relative", marginBottom:"8px" }}>
              <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"18px", opacity:0.7 }}>🔑</span>
              <input
                className={`input-field ${error ? "error" : otp.length===6 ? "success" : ""}`}
                style={{ textAlign:"center", letterSpacing:"0.8em", fontSize:"20px", paddingLeft:"16px" }}
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g,"")); setError(""); }}
                placeholder="● ● ● ● ● ●"
              />
            </div>

            {error && <p style={{ fontSize:"12px", color:"#fca5a5", marginBottom:"8px" }}>{error}</p>}

            <div style={{ textAlign:"center", marginBottom:"20px", marginTop:"8px" }}>
              {timerActive ? (
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)" }}>
                  Expire hoga:{" "}
                  <span style={{ fontWeight:"bold", color: otpTimer < 10 ? "#fca5a5" : "#fde68a" }}>
                    00:{String(otpTimer).padStart(2,"0")}
                  </span>
                </p>
              ) : (
                <button onClick={() => { setOtp(""); startTimer(); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"13px", textDecoration:"underline" }}>
                  OTP Dobara Bhejo
                </button>
              )}
            </div>

            <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#1a3a8f" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#1a3a8f" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Verify ho raha hai...
                </span>
              ) : "VERIFY & LOGIN ✅"}
            </button>
          </div>
        )}

        {/* Footer */}
        <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"28px" }}>
          🔒 Secured by Aadhaar OTP • Suraksha Grid © 2024
        </p>
      </div>
    </div>
  );
}