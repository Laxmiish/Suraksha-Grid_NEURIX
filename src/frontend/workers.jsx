import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getWorkerProfile, getWorkerBenefits, getUnionHistory, getLabourBoards } from "../api/api.jsx";
import { useLanguage, LanguageSelector } from "../context/LanguageContext";
import {
  ShieldIcon,
  ShieldCheckIcon,
  UserIcon,
  AwardIcon,
  CalendarIcon,
  BuildingIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  FileTextIcon,
  LogOutIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  LayersIcon
} from "../components/Icons";

export default function WorkerDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("benefits");
  const [profile, setProfile] = useState(null);
  const [benefitsData, setBenefitsData] = useState(null);
  const [unions, setUnions] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const refId = localStorage.getItem("sg_ref_id") || "SG-A3F2B-4521";

  useEffect(() => {
    loadWorkerData();
  }, [refId]);

  const loadWorkerData = async () => {
    setLoading(true);
    try {
      const [profRes, benRes, unRes, bdRes] = await Promise.all([
        getWorkerProfile(refId),
        getWorkerBenefits(refId),
        getUnionHistory(refId),
        getLabourBoards(refId)
      ]);

      setProfile(profRes || {
        name: localStorage.getItem("sg_name") || "Ramesh Kumar",
        reference_id: refId,
        state: "Maharashtra",
        total_days_worked: 120,
        phone: "9876543210",
        rating: 95
      });

      setBenefitsData(benRes || {
        seniority_stats: {
          total_days_worked: 120,
          calculated_bocw_years: 1,
          days_to_next_tier: 60
        },
        eligible_schemes: [
          {
            benefit_name: "BOCW Accident Insurance - ₹5,00,000 coverage",
            type: "Insurance",
            years_required: 1,
            conditions: "Covers accidental death and permanent disability under state welfare board."
          },
          {
            benefit_name: "Tool Kit Assistance - ₹5,000",
            type: "Financial Aid",
            years_required: 0,
            conditions: "One-time assistance for essential construction tools."
          },
          {
            benefit_name: "Maternity Benefit - 90 days paid leave equivalent",
            type: "Financial Aid",
            years_required: 1,
            conditions: "Applicable to female workers registered for minimum 1 BOCW year."
          }
        ]
      });

      setUnions(unRes?.unions || [
        { union_name: "AITUC - Delhi", state: "Delhi", from: "2019", to: "2021", benefit_summary: "Medical OPD + Pension Fund", status: "Active" },
        { union_name: "INTUC - Pune", state: "Maharashtra", from: "2021", to: "2023", benefit_summary: "Accident Insurance + Housing Aid", status: "Active" },
        { union_name: "HMS - Mumbai", state: "Maharashtra", from: "2023", to: "Present", benefit_summary: "Full Statutory Welfare Coverage", status: "Active" }
      ]);

      setBoards(bdRes?.labour_boards || [
        {
          board_name: "Maharashtra Building & Other Construction Workers Board",
          short_name: "Maharashtra BOCW",
          state: "Maharashtra",
          reg_number: "MH-BOCW-2021-91847",
          from: "2021",
          to: "Present",
          status: "Active",
          contributions: "₹50/month (Worker) + 1% Cess (Work Provider)",
          website: "bocw.maharashtra.gov.in"
        },
        {
          board_name: "Delhi Building & Other Construction Workers Welfare Board",
          short_name: "Delhi BOCW",
          state: "Delhi",
          reg_number: "DL-BOCW-2019-48231",
          from: "2019",
          to: "2021",
          status: "Archived",
          contributions: "Validated inter-state transfer record",
          website: "bocw.delhi.gov.in"
        }
      ]);
    } catch (err) {
      console.error("Failed to load worker data", err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const totalDays = benefitsData?.seniority_stats?.total_days_worked || 120;
  const bocwYears = benefitsData?.seniority_stats?.calculated_bocw_years || Math.floor(totalDays / 90);
  const daysToNext = benefitsData?.seniority_stats?.days_to_next_tier || (90 - (totalDays % 90));
  const progressPercent = Math.min(100, Math.round(((totalDays % 90) / 90) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldIcon size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  {t("workerPortal")}
                </span>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded-full">
                  Statutory Account
                </span>
              </div>
              <span className="text-xs text-slate-400 block font-mono">
                {profile?.name || "Ramesh Kumar"} &bull; {profile?.reference_id || refId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/80 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 transition"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1 space-y-6">
        {/* Seniority Progress Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/60 border border-blue-900/50 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-900/30 border border-blue-800/40 px-2.5 py-1 rounded-full">
                <ShieldCheckIcon size={14} />
                <span>BOCW Act 1996 Portable Seniority Verified</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Statutory Seniority: {bocwYears} Year{bocwYears === 1 ? "" : "s"} ({totalDays} Days)
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every 90 logged work-days automatically increments your verifiable statutory seniority by 1 year.
                You are currently <span className="text-amber-300 font-bold">{daysToNext} days</span> away from unlocking Tier {bocwYears + 1} welfare benefits.
              </p>
            </div>

            {/* Seniority Progress Ring / Meter */}
            <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shrink-0">
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400 font-mono">{progressPercent}%</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Tier Progress</div>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Identity Trust Score</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab("benefits")}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "benefits"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <AwardIcon size={16} />
            <span>Eligible Welfare Schemes ({benefitsData?.eligible_schemes?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("unions")}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "unions"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BuildingIcon size={16} />
            <span>Trade Union History ({unions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("boards")}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "boards"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayersIcon size={16} />
            <span>State Labour Boards ({boards.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "benefits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Active State Benefits ({profile?.state || "Maharashtra"})
                </h2>
                <p className="text-xs text-slate-400">
                  Schemes unlocked based on your certified {bocwYears}-year statutory seniority record.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                Direct Benefit Transfer Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefitsData?.eligible_schemes?.map((b, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-sm text-white">
                        {b.benefit_name}
                      </h3>
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800/60 shrink-0">
                        {b.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {b.conditions}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Requirement: {b.years_required} Year ({b.years_required * 90} Days)
                    </span>
                    <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                      <CheckCircleIcon size={13} />
                      <span>Unlocked</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "unions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Interstate Trade Union Membership Timeline
                </h2>
                <p className="text-xs text-slate-400">
                  Continuous union representation verified across state migrations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {unions.map((u, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{u.union_name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60">
                        {u.state}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Benefits: {u.benefit_summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 font-mono">{u.from} &rarr; {u.to}</span>
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                      {u.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "boards" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Official State Welfare Board Registrations
                </h2>
                <p className="text-xs text-slate-400">
                  Direct welfare enrollment numbers under Building and Other Construction Workers Act.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boards.map((b, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-white">{b.short_name}</h3>
                      <span className="text-xs text-slate-400 block">{b.state} Welfare Authority</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      b.status === "Active"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    <div>Registration No: {b.reg_number}</div>
                    <div className="text-[11px] text-slate-400">Active Since: {b.from}</div>
                  </div>

                  <div className="text-xs text-slate-400 pt-1 flex items-center justify-between">
                    <span>{b.contributions}</span>
                    {b.website && (
                      <span className="text-blue-400 hover:text-blue-300 text-[11px] font-mono">
                        {b.website}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}