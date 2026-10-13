import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api.jsx";
import { useLanguage, LanguageSelector } from "../context/LanguageContext";
import {
  ShieldIcon,
  UserIcon,
  HomeIcon,
  WorkProviderIcon,
  SupervisorIcon,
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  AlertCircleIcon
} from "../components/Icons";

export default function LoginPage() {
  const { t } = useLanguage();
  const [role, setRole] = useState(null);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const roles = [
    {
      id: "employer", // Work Provider for Domestic / House Help
      title: "Work Provider (House Help)",
      subtitle: "Households & individuals hiring domestic staff, maids, cooks, and drivers",
      icon: HomeIcon,
      badge: "Household Staff",
      demo: { phone: "9876543220", pass: "demo1234" }
    },
    {
      id: "worker",
      title: "Worker",
      subtitle: "Unorganized & construction laborers tracking portable benefits & seniority",
      icon: UserIcon,
      badge: "Welfare Beneficiary",
      demo: { phone: "9876543210", pass: "demo1234" }
    },
    {
      id: "contractor",
      title: "Contractor",
      subtitle: "Licensed construction contractors managing commercial jobsites & muster rolls",
      icon: WorkProviderIcon,
      badge: "Commercial Sites",
      demo: { phone: "9876543211", pass: "demo1234" }
    },
    {
      id: "supervisor",
      title: "Supervisor",
      subtitle: "Site compliance and safety officers auditing labor muster rolls",
      icon: SupervisorIcon,
      badge: "Site Audit",
      demo: { phone: "9876543212", pass: "demo1234" }
    }
  ];

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (mobile.length !== 10) {
      setError(t("invalidMobile"));
      return;
    }
    if (password.length < 6) {
      setError(t("invalidPass"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await loginUser({ mobile, password, role });
      if (result.success) {
        localStorage.setItem("sg_token", result.token);
        localStorage.setItem("sg_ref_id", result.reference_id || "");
        localStorage.setItem("sg_name", result.name || "");
        localStorage.setItem("sg_role", role);
        localStorage.setItem("sg_mobile", mobile);

        if (role === "worker") {
          navigate("/dashboard");
        } else if (role === "employer" || role === "household") {
          navigate("/work-provider");
        } else if (role === "contractor") {
          navigate("/contractor");
        } else {
          navigate("/admin");
        }
      } else {
        setError(result.message || "Invalid mobile number or credentials.");
      }
    } catch (err) {
      setError(t("networkError"));
    }
    setLoading(false);
  };

  const fillDemo = (demoRole) => {
    setRole(demoRole.id);
    setMobile(demoRole.demo.phone);
    setPassword(demoRole.demo.pass);
    setError("");
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
              <ShieldIcon size={22} />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-white block">
                {t("brandName")}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                National Social Security Infrastructure
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link
              to="/register"
              className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition"
            >
              {t("register")}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Authentication Container - Dead Centered Vertically & Horizontally */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-10 w-full my-auto">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-7 sm:p-10 backdrop-blur-2xl">
          {!role ? (
            /* STEP 1: ROLE SELECTION */
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {t("selectRole")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Choose your verified portal account type to access welfare records or muster rolls
                </p>
              </div>

              {/* Role Cards with Generous Inner Padding */}
              <div className="space-y-3.5">
                {roles.map((r) => {
                  const RoleSvg = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className="w-full text-left p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800/60 hover:border-slate-700 transition group flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:border-blue-500/50 transition shrink-0 p-3">
                        <RoleSvg size={24} />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-white">
                            {r.title}
                          </span>
                          <ArrowRightIcon size={16} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition shrink-0" />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {r.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Instant Demo Access Chips */}
              <div className="pt-5 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
                  Instant One-Click Demo Access
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => fillDemo(r)}
                      className="text-xs py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-blue-900/30 border border-slate-700/80 hover:border-blue-500/50 text-slate-200 hover:text-blue-300 transition text-center font-medium truncate cursor-pointer"
                    >
                      {r.title.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: CREDENTIALS INPUT */
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Top Role Badge & Back Navigation */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => { setRole(null); setError(""); }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer py-1"
                >
                  <ArrowLeftIcon size={14} />
                  <span>{t("backToRole")}</span>
                </button>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/80">
                  {roles.find((r) => r.id === role)?.title}
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {t("signIn")}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Enter your verified registered mobile number and password
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800/90 flex items-start gap-3 text-rose-200 text-xs sm:text-sm leading-relaxed">
                  <AlertCircleIcon size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Mobile Number Input with generous padding */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t("mobileNumber")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <PhoneIcon size={18} />
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder={t("enterMobile")}
                      className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-12 pr-5 py-3.5 sm:py-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Password Input with generous padding */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t("password")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <LockIcon size={18} />
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("enterPassword")}
                      className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-12 pr-12 py-3.5 sm:py-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer mt-2"
              >
                {loading ? (
                  <span>{t("submitting")}</span>
                ) : (
                  <>
                    <span>{t("login")}</span>
                    <ArrowRightIcon size={18} />
                  </>
                )}
              </button>

              {/* Demo Pre-fill Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const activeRoleObj = roles.find((r) => r.id === role);
                    if (activeRoleObj) {
                      setMobile(activeRoleObj.demo.phone);
                      setPassword(activeRoleObj.demo.pass);
                      setError("");
                    }
                  }}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4 transition cursor-pointer"
                >
                  Click to pre-fill verified demo credentials
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Suraksha Grid National Welfare Initiative &bull; Section 8 Aadhaar Act & BOCW Central Welfare Rules.
      </footer>
    </div>
  );
}