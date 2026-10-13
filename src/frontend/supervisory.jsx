import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage, LanguageSelector } from "../context/LanguageContext";
import {
  ShieldIcon,
  SupervisorIcon,
  WorkProviderIcon,
  BuildingIcon,
  UsersIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  AwardIcon,
  SearchIcon,
  LogOutIcon,
  MapPinIcon,
  PhoneIcon,
  CheckIcon,
  XIcon
} from "../components/Icons";

export default function SupervisoryDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSiteId, setSelectedSiteId] = useState(1);
  const [searchWorker, setSearchWorker] = useState("");

  const supervisor = {
    name: localStorage.getItem("sg_name") || "Rajesh Sharma",
    assignedBy: "Mehta Infrastructure Solutions (Work Provider)",
    refId: localStorage.getItem("sg_ref_id") || "SG-S4R7N-2291",
    rating: 4.8,
    score: 88,
    role: "Compliance & Safety Officer"
  };

  const assignedProjects = [
    { id: 1, name: "NH-48 Highway Expansion", provider: "Mehta Infrastructure Solutions", status: "Active", deadline: "Dec 2026", progress: 65, workers: 24, location: "Pune, Bypass Road" },
    { id: 2, name: "Residential Complex Block-B", provider: "Mehta Infrastructure Solutions", status: "Active", deadline: "Mar 2027", progress: 40, workers: 18, location: "Mumbai, Andheri East" }
  ];

  const workers = [
    { id: 1, name: "Ramesh Kumar", ekycKey: "SG-A3F2B-4521", role: "Mason", attendance: 95, dailyWage: 600, status: "PRESENT", siteId: 1 },
    { id: 2, name: "Suresh Yadav", ekycKey: "SG-W2C3D-2345", role: "Carpenter", attendance: 88, dailyWage: 650, status: "PRESENT", siteId: 1 },
    { id: 3, name: "Mohan Lal", ekycKey: "SG-W3E4F-3456", role: "Helper", attendance: 80, dailyWage: 550, status: "PRESENT", siteId: 1 },
    { id: 4, name: "Dinesh Patel", ekycKey: "SG-W4G5H-4567", role: "Electrician", attendance: 92, dailyWage: 700, status: "PRESENT", siteId: 2 },
    { id: 5, name: "Anil Singh", ekycKey: "SG-W5I6J-5678", role: "Plumber", attendance: 85, dailyWage: 680, status: "PRESENT", siteId: 2 }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredWorkers = workers.filter(
    (w) =>
      w.siteId === selectedSiteId &&
      (w.name.toLowerCase().includes(searchWorker.toLowerCase()) ||
        w.ekycKey.toLowerCase().includes(searchWorker.toLowerCase()) ||
        w.role.toLowerCase().includes(searchWorker.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="h-9 w-9 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <SupervisorIcon size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  {t("supervisorPortal")}
                </span>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-full">
                  Supervisory Authority
                </span>
              </div>
              <span className="text-xs text-slate-400 block font-mono">
                {supervisor.name} &bull; {supervisor.refId}
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

      {/* Main Workspace */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Supervised Projects</span>
              <BuildingIcon size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{assignedProjects.length}</div>
            <span className="text-[11px] text-slate-500">Under Work Provider Oversight</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Inspected Laborers</span>
              <UsersIcon size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{workers.length}</div>
            <span className="text-[11px] text-slate-500">Verified Identity & Attendance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Safety Compliance</span>
              <CheckCircleIcon size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">100%</div>
            <span className="text-[11px] text-emerald-400">Zero Unresolved Violations</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Supervisory Trust Score</span>
              <AwardIcon size={16} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{supervisor.score} / 100</div>
            <span className="text-[11px] text-slate-400">Certified Site Inspector</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assigned Sites List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Assigned Construction Sites
            </h2>
            <div className="space-y-3">
              {assignedProjects.map((proj) => {
                const isSelected = selectedSiteId === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedSiteId(proj.id)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      isSelected
                        ? "bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-950/40"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-sm text-white block">
                        {proj.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <MapPinIcon size={13} className="text-slate-500" />
                      <span>{proj.location}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Work Provider</span>
                      <span className="text-slate-200 font-medium">{proj.provider}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Site Inspection & Worker Verification */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Site Muster Inspection & Verification
                  </h2>
                  <span className="text-xs text-slate-400">
                    BOCW Welfare Seniority Certification Authority
                  </span>
                </div>

                <div className="relative">
                  <SearchIcon size={14} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchWorker}
                    onChange={(e) => setSearchWorker(e.target.value)}
                    placeholder="Search laborer..."
                    className="bg-slate-950 border border-slate-700/80 focus:border-amber-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none w-48 transition"
                  />
                </div>
              </div>

              {/* Workers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">Worker / Identity</th>
                      <th className="py-2.5 px-3">Trade Role</th>
                      <th className="py-2.5 px-3">Wage Compliance</th>
                      <th className="py-2.5 px-3">Audit Attendance</th>
                      <th className="py-2.5 px-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredWorkers.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-3">
                          <span className="font-semibold text-white block">{w.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{w.ekycKey}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                            {w.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          ₹{w.dailyWage} / day
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                            <CheckIcon size={12} />
                            <span>{w.attendance}% Verified</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-emerald-400 font-semibold inline-flex items-center gap-1 text-[11px]">
                            <CheckCircleIcon size={14} />
                            <span>Audit Passed</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredWorkers.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No laborers found on selected site.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}