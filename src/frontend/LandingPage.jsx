// src/frontend/LandingPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Animated Counter Hook ────────────────────────────────────────
function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

// ─── Floating Particle Background ─────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 220, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 220, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

// ─── CSS Keyframes (injected once) ────────────────────────────────
const styleId = "sg-landing-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    @keyframes sg-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes sg-pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(99,220,255,0.15)} 50%{box-shadow:0 0 40px rgba(99,220,255,0.3)} }
    @keyframes sg-slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes sg-slide-left { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
    @keyframes sg-fade-in { from{opacity:0} to{opacity:1} }
    @keyframes sg-gradient-shift {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    @keyframes sg-shimmer {
      0%{background-position:-200% 0}
      100%{background-position:200% 0}
    }
    @keyframes sg-badge-pulse {
      0%,100%{transform:scale(1)} 50%{transform:scale(1.05)}
    }

    .sg-card-hover { transition: all 0.35s cubic-bezier(0.4,0,0.2,1) !important; }
    .sg-card-hover:hover {
      transform: translateY(-8px) !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(99,220,255,0.1) !important;
    }
    .sg-btn-primary {
      transition: all 0.3s ease !important;
      position: relative;
      overflow: hidden;
    }
    .sg-btn-primary::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      width: 0; height: 0;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      transition: all 0.5s ease;
      transform: translate(-50%,-50%);
    }
    .sg-btn-primary:hover::after { width: 400px; height: 400px; }
    .sg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,220,255,0.3) !important; }

    .sg-nav-link { transition: color 0.2s ease !important; }
    .sg-nav-link:hover { color: #63dcff !important; }

    .sg-section-reveal {
      opacity: 0; transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.4,0,0.2,1);
    }
    .sg-section-visible { opacity: 1; transform: translateY(0); }

    .sg-tech-icon { transition: all 0.3s ease !important; }
    .sg-tech-icon:hover { transform: scale(1.1) translateY(-4px) !important; }

    @media (max-width: 768px) {
      .sg-hero-title { font-size: 32px !important; }
      .sg-hero-sub { font-size: 16px !important; }
      .sg-grid-3 { grid-template-columns: 1fr !important; }
      .sg-grid-2 { grid-template-columns: 1fr !important; }
      .sg-nav-links { display: none !important; }
      .sg-hero-btns { flex-direction: column !important; }
      .sg-stats-grid { grid-template-columns: 1fr 1fr !important; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sg-section-visible");
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ═══════════════════════════════════════════════════════════════════
// LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal refs for each section
  const featRef = useReveal();
  const howRef = useReveal();
  const secRef = useReveal();
  const techRef = useReveal();
  const statsRef = useReveal();
  const ctaRef = useReveal();

  // Animated counters
  const stat1 = useCountUp(60, 2200);
  const stat2 = useCountUp(25, 1800);
  const stat3 = useCountUp(5, 1400);
  const stat4 = useCountUp(120, 2000);

  const features = [
    { icon: "🛡️", title: "Benefit Discovery Engine", desc: "Workers instantly see which state-specific BOCW schemes they qualify for — housing loans, accident insurance, pensions, education grants — based on their seniority and registered state.", color: "#16A34A" },
    { icon: "📊", title: "Seniority Tracking", desc: "Automatic seniority calculation from attendance logs. Every 90 logged work-days equals 1 BOCW year. Workers unlock new benefit tiers as their seniority grows.", color: "#2563EB" },
    { icon: "🏛️", title: "Union & Board History", desc: "Complete timeline of labour union memberships and labour board registrations across states. Track contributions, registration numbers, and certificate validity in one place.", color: "#8B5CF6" },
    { icon: "📱", title: "Aadhaar e-KYC Integration", desc: "Secure offline Aadhaar verification using UIDAI's ZIP-based XML format. No OTP needed — works completely offline with share-code encrypted identity verification.", color: "#F59E0B" },
    { icon: "👷", title: "Multi-Role Dashboards", desc: "Dedicated interfaces for Workers, Contractors, and Supervisors. Each role sees exactly what they need — from personal benefits to jobsite attendance management.", color: "#EF4444" },
    { icon: "⚡", title: "Daily Attendance Pulse", desc: "Automated CRON-based attendance system marks all active workers as present daily. Contractors only need to mark absences — saving time across hundreds of workers.", color: "#06B6D4" },
  ];

  const howItWorks = [
    { step: "01", title: "Register with Aadhaar", desc: "Upload your Aadhaar offline e-KYC ZIP file. Your identity is verified locally — no data leaves the system.", icon: "🔐" },
    { step: "02", title: "Get Linked to Jobsite", desc: "Your contractor adds you to their active jobsite. Attendance starts tracking automatically from day one.", icon: "🏗️" },
    { step: "03", title: "Build Seniority", desc: "Every work-day is logged. 90 days = 1 BOCW year. Your seniority unlocks increasingly valuable government benefits.", icon: "📈" },
    { step: "04", title: "Discover Your Benefits", desc: "See exactly which state schemes you're eligible for — insurance, housing, education, pension — with conditions explained in simple language.", icon: "🎯" },
  ];

  const securityFeatures = [
    { icon: "🔒", title: "Offline-First Identity", desc: "Aadhaar verification happens locally using UIDAI's signed XML format. Zero network calls for identity verification." },
    { icon: "🔑", title: "Bcrypt + JWT Auth", desc: "Passwords are salted and hashed with bcrypt (12 rounds). Sessions use signed JWT tokens with 24-hour expiry." },
    { icon: "🏰", title: "Isolated Database Architecture", desc: "Three separate MySQL instances ensure domain isolation. User data, contractor data, and labour records are physically separated." },
    { icon: "🛡️", title: "Gateway Pattern", desc: "FastAPI gateway validates and sanitizes all input before forwarding to the Go engine. No direct database access from the frontend." },
  ];

  const techStack = [
    { name: "React 19", category: "Frontend", color: "#61DAFB", emoji: "⚛️" },
    { name: "Vite 7", category: "Build", color: "#646CFF", emoji: "⚡" },
    { name: "FastAPI", category: "Gateway", color: "#009688", emoji: "🐍" },
    { name: "Go + Gin", category: "Engine", color: "#00ADD8", emoji: "🔷" },
    { name: "MySQL × 3", category: "Database", color: "#4479A1", emoji: "🗄️" },
    { name: "Docker", category: "Infra", color: "#2496ED", emoji: "🐳" },
    { name: "JWT + bcrypt", category: "Auth", color: "#D63AFF", emoji: "🔐" },
    { name: "Aadhaar e-KYC", category: "Identity", color: "#FF6B35", emoji: "🇮🇳" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#0A0E17", color: "white", minHeight: "100vh", overflowX: "hidden" }}>
      <ParticleField />

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px", height: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,14,23,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "linear-gradient(135deg, #16A34A, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: "800", color: "white",
          }}>S</div>
          <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.5px" }}>Suraksha Grid</span>
        </div>

        <div className="sg-nav-links" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Features", "How It Works", "Security", "Tech Stack"].map(item => (
            <a key={item} className="sg-nav-link" href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{item}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "9px 20px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent", color: "white", fontSize: "14px", fontWeight: "500", cursor: "pointer",
            transition: "all 0.2s",
          }}>Login</button>
          <button className="sg-btn-primary" onClick={() => navigate("/register")} style={{
            padding: "9px 20px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #16A34A, #06B6D4)",
            color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer",
          }}>Get Started</button>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 24px 80px", position: "relative", zIndex: 1,
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 16px 6px 8px", borderRadius: "100px",
          background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)",
          marginBottom: "28px", animation: "sg-badge-pulse 3s ease infinite, sg-fade-in 0.8s ease",
        }}>
          <span style={{ background: "#16A34A", width: "8px", height: "8px", borderRadius: "50%", display: "inline-block" }}></span>
          <span style={{ fontSize: "13px", color: "#4ADE80", fontWeight: "500" }}>Empowering 60M+ Unorganized Workers</span>
        </div>

        {/* Title */}
        <h1 className="sg-hero-title" style={{
          fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: "900", lineHeight: "1.08",
          letterSpacing: "-2px", maxWidth: "900px",
          background: "linear-gradient(135deg, #ffffff 0%, #63dcff 40%, #4ADE80 70%, #ffffff 100%)",
          backgroundSize: "200% 200%",
          animation: "sg-gradient-shift 6s ease infinite, sg-slide-up 1s ease",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "24px",
        }}>
          Suraksha Grid
        </h1>

        <p style={{
          fontSize: "15px", fontWeight: "500", letterSpacing: "3px", textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)", marginBottom: "16px",
          animation: "sg-slide-up 1s ease 0.15s both",
        }}>सुरक्षा ग्रिड</p>

        <p className="sg-hero-sub" style={{
          fontSize: "clamp(16px, 2vw, 21px)", color: "rgba(255,255,255,0.55)",
          maxWidth: "640px", lineHeight: "1.65", fontWeight: "400",
          animation: "sg-slide-up 1s ease 0.3s both",
        }}>
          India's first portable social security platform for unorganized sector workers. 
          Track your labour union memberships, discover BOCW benefits you're eligible for, 
          and build your seniority — all verified through Aadhaar e-KYC.
        </p>

        {/* CTA Buttons */}
        <div className="sg-hero-btns" style={{ display: "flex", gap: "16px", marginTop: "40px", animation: "sg-slide-up 1s ease 0.5s both" }}>
          <button className="sg-btn-primary" onClick={() => navigate("/register")} style={{
            padding: "16px 36px", borderRadius: "14px", border: "none",
            background: "linear-gradient(135deg, #16A34A, #06B6D4)",
            color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(22,163,74,0.3)",
          }}>
            Register as Worker →
          </button>
          <button onClick={() => { const el = document.getElementById("features"); el?.scrollIntoView({ behavior: "smooth" }); }} style={{
            padding: "16px 36px", borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.04)", color: "white",
            fontSize: "16px", fontWeight: "600", cursor: "pointer",
            transition: "all 0.3s",
          }}>
            Explore Features
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "40px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          animation: "sg-float 3s ease infinite",
        }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>SCROLL</span>
          <div style={{ width: "1px", height: "30px", background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}></div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ───────────────────────────────── */}
      <section id="features" ref={featRef} className="sg-section-reveal" style={{
        padding: "100px 24px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "3px", color: "#4ADE80", textTransform: "uppercase" }}>PLATFORM FEATURES</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", marginTop: "12px", letterSpacing: "-1px" }}>
            Everything a Worker Needs,<br />
            <span style={{ color: "rgba(255,255,255,0.4)" }}>In One Secure Platform</span>
          </h2>
        </div>

        <div className="sg-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {features.map((f, i) => (
            <div key={i} className="sg-card-hover" style={{
              padding: "32px", borderRadius: "20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              animation: `sg-slide-up 0.6s ease ${0.1 * i}s both`,
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", marginBottom: "20px",
              }}>{f.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how-it-works" ref={howRef} className="sg-section-reveal" style={{
        padding: "100px 24px", position: "relative", zIndex: 1,
        background: "linear-gradient(180deg, transparent 0%, rgba(22,163,74,0.03) 50%, transparent 100%)",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "3px", color: "#63dcff", textTransform: "uppercase" }}>JOURNEY</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", marginTop: "12px", letterSpacing: "-1px" }}>
              From Registration to Benefits<br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>In 4 Simple Steps</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0px", position: "relative" }}>
            {/* Vertical connector line */}
            <div style={{
              position: "absolute", left: "39px", top: "60px", bottom: "60px",
              width: "2px", background: "linear-gradient(to bottom, #16A34A, #06B6D4, #8B5CF6, #F59E0B)",
              borderRadius: "2px", opacity: 0.3,
            }}></div>

            {howItWorks.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: "32px", alignItems: "center", padding: "28px 0",
                animation: `sg-slide-left 0.6s ease ${0.15 * i}s both`,
              }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "20px", flexShrink: 0,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "32px", position: "relative", zIndex: 2,
                }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", color: "#4ADE80", marginBottom: "6px" }}>STEP {item.step}</div>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", maxWidth: "500px" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECURITY SECTION ───────────────────────────────── */}
      <section id="security" ref={secRef} className="sg-section-reveal" style={{
        padding: "100px 24px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "3px", color: "#F59E0B", textTransform: "uppercase" }}>SECURITY</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", marginTop: "12px", letterSpacing: "-1px" }}>
            Built for India's Most<br />
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Vulnerable Workforce</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: "540px", margin: "16px auto 0", lineHeight: "1.7", fontSize: "15px" }}>
            Enterprise-grade security architecture protecting the digital identity and work records of unorganized sector workers.
          </p>
        </div>

        <div className="sg-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {securityFeatures.map((s, i) => (
            <div key={i} className="sg-card-hover" style={{
              padding: "28px", borderRadius: "18px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", gap: "20px", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>{s.icon}</span>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH STACK ─────────────────────────────────────── */}
      <section id="tech-stack" ref={techRef} className="sg-section-reveal" style={{
        padding: "100px 24px", position: "relative", zIndex: 1,
        background: "linear-gradient(180deg, transparent 0%, rgba(99,220,255,0.02) 50%, transparent 100%)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "3px", color: "#8B5CF6", textTransform: "uppercase" }}>BUILT WITH</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", marginTop: "12px", letterSpacing: "-1px", marginBottom: "56px" }}>
            Modern, Production-Grade<br />
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Technology Stack</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }} className="sg-stats-grid">
            {techStack.map((t, i) => (
              <div key={i} className="sg-tech-icon" style={{
                padding: "24px 16px", borderRadius: "16px",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                textAlign: "center", cursor: "default",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>{t.emoji}</div>
                <div style={{ fontSize: "15px", fontWeight: "700" }}>{t.name}</div>
                <div style={{ fontSize: "11px", color: t.color, fontWeight: "600", marginTop: "4px", letterSpacing: "1px", textTransform: "uppercase" }}>{t.category}</div>
              </div>
            ))}
          </div>

          {/* Architecture Diagram */}
          <div style={{
            marginTop: "56px", padding: "32px", borderRadius: "20px",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>SYSTEM ARCHITECTURE</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              {[
                { label: "React Frontend", color: "#61DAFB" },
                { label: "→" },
                { label: "FastAPI Gateway", color: "#009688" },
                { label: "→" },
                { label: "Go Gin Engine", color: "#00ADD8" },
                { label: "→" },
                { label: "3× MySQL DBs", color: "#4479A1" },
              ].map((item, i) =>
                item.color ? (
                  <div key={i} style={{
                    padding: "10px 20px", borderRadius: "10px",
                    background: `${item.color}15`, border: `1px solid ${item.color}30`,
                    fontSize: "13px", fontWeight: "600", color: item.color,
                  }}>{item.label}</div>
                ) : (
                  <span key={i} style={{ color: "rgba(255,255,255,0.2)", fontSize: "18px", fontWeight: "300" }}>{item.label}</span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ──────────────────────────────────── */}
      <section ref={statsRef} className="sg-section-reveal" style={{
        padding: "80px 24px", maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1,
      }}>
        <div className="sg-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[
            { value: stat1, suffix: "M+", label: "Target Workers", icon: "👷" },
            { value: stat2, suffix: "+", label: "State Benefits Mapped", icon: "🏛️" },
            { value: stat3, suffix: "", label: "States Covered", icon: "🗺️" },
            { value: stat4, suffix: "+", label: "Days Attendance Logged", icon: "📊" },
          ].map((s, i) => (
            <div key={i} ref={s.value.ref} style={{
              textAlign: "center", padding: "28px", borderRadius: "20px",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{
                fontSize: "36px", fontWeight: "900", letterSpacing: "-1px",
                background: "linear-gradient(135deg, #4ADE80, #63dcff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{s.value.count}{s.suffix}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: "500", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA SECTION ────────────────────────────────────── */}
      <section ref={ctaRef} className="sg-section-reveal" style={{
        padding: "100px 24px", position: "relative", zIndex: 1,
      }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto", textAlign: "center",
          padding: "64px 40px", borderRadius: "28px",
          background: "linear-gradient(135deg, rgba(22,163,74,0.1) 0%, rgba(6,182,212,0.1) 100%)",
          border: "1px solid rgba(22,163,74,0.15)",
          animation: "sg-pulse-glow 4s ease infinite",
        }}>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: "800", lineHeight: "1.2", marginBottom: "16px", letterSpacing: "-1px" }}>
            Ready to Secure Your<br />Work Rights?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: "460px", margin: "0 auto 32px", lineHeight: "1.7", fontSize: "15px" }}>
            Join Suraksha Grid today. Discover the government benefits you've been working for — and start building your portable social security record.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button className="sg-btn-primary" onClick={() => navigate("/register")} style={{
              padding: "16px 40px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg, #16A34A, #06B6D4)",
              color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer",
              boxShadow: "0 8px 32px rgba(22,163,74,0.3)",
            }}>Create Free Account</button>
            <button onClick={() => navigate("/login")} style={{
              padding: "16px 40px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.04)", color: "white",
              fontSize: "16px", fontWeight: "600", cursor: "pointer",
              transition: "all 0.3s",
            }}>Login to Dashboard</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer style={{
        padding: "48px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "40px", marginBottom: "40px" }}>
            <div style={{ maxWidth: "320px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #16A34A, #06B6D4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: "800",
                }}>S</div>
                <span style={{ fontSize: "16px", fontWeight: "700" }}>Suraksha Grid</span>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: "1.7" }}>
                A portable social security platform built for India's 60 million+ unorganized sector workers. Track benefits, build seniority, secure your rights.
              </p>
            </div>

            <div style={{ display: "flex", gap: "56px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>PLATFORM</p>
                {["Worker Dashboard", "Contractor Panel", "Supervisor Admin", "e-KYC Registration"].map(link => (
                  <p key={link} style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "10px", cursor: "pointer" }}>{link}</p>
                ))}
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>COVERAGE</p>
                {["Maharashtra", "Uttar Pradesh", "Delhi NCR", "Karnataka", "Tamil Nadu"].map(state => (
                  <p key={state} style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "10px" }}>{state}</p>
                ))}
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>RESOURCES</p>
                {["BOCW Act 1996", "ISMW Act 1979", "UIDAI e-KYC Docs", "GitHub Repository"].map(res => (
                  <p key={res} style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "10px", cursor: "pointer" }}>{res}</p>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px",
          }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>© 2026 Suraksha Grid. Built for India's Unorganized Workforce.</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>Made with 🇮🇳 in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
