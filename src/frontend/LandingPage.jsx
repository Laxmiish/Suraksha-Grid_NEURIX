import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage, LanguageSelector } from "../context/LanguageContext";
import {
  ShieldIcon,
  ShieldCheckIcon,
  UserIcon,
  WorkProviderIcon,
  SupervisorIcon,
  BuildingIcon,
  CheckCircleIcon,
  CalendarIcon,
  AwardIcon,
  ArrowRightIcon,
  FileTextIcon,
  LockIcon,
  LayersIcon,
  GlobeIcon
} from "../components/Icons";

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

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featRef = useReveal();
  const howRef = useReveal();
  const secRef = useReveal();
  const statsRef = useReveal();

  const stat1 = useCountUp(60, 2200);
  const stat2 = useCountUp(25, 1800);
  const stat3 = useCountUp(5, 1400);
  const stat4 = useCountUp(120, 2000);

  const features = [
    {
      icon: AwardIcon,
      title: "Benefit Discovery Engine",
      desc: "Workers instantly discover which state-specific BOCW schemes they qualify for — housing subsidies, accident insurance, pensions, and educational aid — based on validated seniority.",
      tag: "Statutory"
    },
    {
      icon: CalendarIcon,
      title: "Seniority Tracking System",
      desc: "Automatic statutory seniority calculation from verified attendance logs. 90 logged work-days equal 1 BOCW statutory year, unlocking progressive welfare tiers.",
      tag: "Automated"
    },
    {
      icon: BuildingIcon,
      title: "Union & Labour Board Records",
      desc: "Unified timeline of verified labour union memberships (AITUC, INTUC, HMS) and state welfare board registrations with digital contribution tracking across borders.",
      tag: "Interstate"
    },
    {
      icon: ShieldCheckIcon,
      title: "Aadhaar Offline e-KYC",
      desc: "Tamper-proof identity verification using UIDAI's offline ZIP XML standard with 4-digit share code decryption. Zero network dependencies for authentication.",
      tag: "Tamper-Proof"
    },
    {
      icon: WorkProviderIcon,
      title: "Work Provider & Site Muster",
      desc: "Dedicated operations dashboard for Work Providers and site supervisors to manage jobsites, link unorganized laborers, and record verified daily wages.",
      tag: "Work Provider"
    },
    {
      icon: LayersIcon,
      title: "Multi-Database Tenant Isolation",
      desc: "Dedicated database stores separating worker welfare records, household domestic employment, and Work Provider operational jobsites for strict privacy.",
      tag: "Enterprise"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Aadhaar e-KYC Verification",
      desc: "Upload encrypted UIDAI offline e-KYC XML package. Identity is verified cryptographically without external data leaks.",
      icon: LockIcon
    },
    {
      step: "02",
      title: "Jobsite Deployment",
      desc: "A licensed Work Provider assigns the worker to an active site muster roll. Wage agreements and role classifications are bound digitally.",
      icon: WorkProviderIcon
    },
    {
      step: "03",
      title: "Seniority Accumulation",
      desc: "Every logged work-day is counted. Completing 90 certified days accrues 1 statutory BOCW year regardless of interstate migration.",
      icon: CalendarIcon
    },
    {
      step: "04",
      title: "Direct Benefit Claiming",
      desc: "Eligible statutory schemes across 5 participating states are matched automatically, ready for one-click compliance application.",
      icon: AwardIcon
    }
  ];

  const securityPoints = [
    {
      title: "Offline-First Identity",
      desc: "UIDAI XML parsed locally via tamper-evident AES decryption. Zero raw Aadhaar numbers stored on servers.",
      icon: ShieldIcon
    },
    {
      title: "Bcrypt & Signed JWT Sessions",
      desc: "Stateless HMAC-SHA256 tokens with salted bcrypt key derivation (cost factor 12) protecting all API routes.",
      icon: LockIcon
    },
    {
      title: "Three Dedicated Databases",
      desc: "Physical domain isolation between worker welfare data, household private employers, and Work Provider sites.",
      icon: LayersIcon
    },
    {
      title: "Statutory BOCW Compliance",
      desc: "Calculations strictly aligned with Building and Other Construction Workers (BOCW) Act, 1996 welfare rules.",
      icon: FileTextIcon
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldIcon size={20} />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">
                {t("brandName")}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                National Social Security Grid
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              to="/login"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
            >
              <span>{t("signIn")}</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(37,99,235,0.22),transparent)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/80 text-blue-300 border border-blue-800/60 shadow-inner">
            <ShieldCheckIcon size={14} className="text-blue-400" />
            <span>BOCW Act 1996 &bull; National Portable Worker Identity</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Portable Social Security & Seniority for India's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
              60M+ Unorganized Workers
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t("subTagline")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition flex items-center gap-2"
            >
              <span>Access Secure Portal</span>
              <ArrowRightIcon size={16} />
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition"
            >
              Register with e-KYC
            </Link>
          </div>

          {/* Role Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition">
              <div className="h-9 w-9 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-3">
                <UserIcon size={18} />
              </div>
              <h2 className="font-semibold text-sm text-white">{t("worker")}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Track cumulative work days, verify statutory BOCW years, and claim state welfare schemes.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/50 transition">
              <div className="h-9 w-9 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-3">
                <WorkProviderIcon size={18} />
              </div>
              <h2 className="font-semibold text-sm text-white">{t("workProvider")}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Register construction projects, link laborers with daily wage agreements, and manage digital muster rolls.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-amber-500/50 transition">
              <div className="h-9 w-9 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-3">
                <SupervisorIcon size={18} />
              </div>
              <h2 className="font-semibold text-sm text-white">{t("supervisor")}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Site-level compliance inspection, daily attendance verification, and labor board certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section
        ref={statsRef}
        className="py-16 bg-slate-900/40 border-y border-slate-800/80 px-6 transition-all duration-700 opacity-0 translate-y-8"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">
              {stat1.count}M+
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Unorganized Workers Covered
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
              {stat2.count}
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Statutory State Schemes
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
              {stat3.count}
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Participating States
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              {stat4.count}
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Validated Attendance Days
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section
        ref={featRef}
        className="py-20 px-6 max-w-6xl mx-auto transition-all duration-700 opacity-0 translate-y-8"
      >
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Architecture Highlights
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            Comprehensive Statutory Welfare Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Engineered to eliminate administrative friction and provide guaranteed portability across state lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const FeatIcon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                      <FeatIcon size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        ref={howRef}
        className="py-20 px-6 bg-slate-900/30 border-y border-slate-800/80 transition-all duration-700 opacity-0 translate-y-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Verification Lifecycle
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              From Attendance to Guaranteed Seniority
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-700 font-mono">
                        {item.step}
                      </span>
                      <div className="h-8 w-8 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
                        <StepIcon size={16} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section
        ref={secRef}
        className="py-20 px-6 max-w-6xl mx-auto transition-all duration-700 opacity-0 translate-y-8"
      >
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Security & Compliance
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            Enterprise Security Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {securityPoints.map((sec, idx) => {
            const SecIcon = sec.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <SecIcon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white mb-1">{sec.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{sec.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-gradient-to-b from-transparent to-slate-900/60 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Experience the Unified Social Security Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Log in using demo credentials or upload your verified Aadhaar offline e-KYC archive.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition flex items-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Suraksha Grid National Welfare Initiative &bull; BOCW Act, 1996 Portable Welfare Framework.
      </footer>
    </div>
  );
}
