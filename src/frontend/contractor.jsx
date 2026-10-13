import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getJobsites, getJobsiteWorkers, markAttendance } from "../api/api.jsx";
import { useLanguage, LanguageSelector } from "../context/LanguageContext";
import {
  ShieldIcon,
  WorkProviderIcon,
  BuildingIcon,
  UsersIcon,
  HardHatIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AwardIcon,
  FileTextIcon,
  SearchIcon,
  PlusIcon,
  LogOutIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon
} from "../components/Icons";

export default function WorkProviderDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobsites");
  const [jobsites, setJobsites] = useState([]);
  const [selectedJobsite, setSelectedJobsite] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchWorker, setSearchWorker] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [successMessage, setSuccessMessage] = useState("");

  const workProvider = {
    name: localStorage.getItem("sg_name") || "Sunil Mehta",
    company: "Mehta Infrastructure Solutions",
    refId: localStorage.getItem("sg_ref_id") || "SG-C7K9M-3381",
    score: 92,
    activeSites: 2,
    totalWorkers: 42
  };

  useEffect(() => {
    fetchJobsites();
  }, []);

  const fetchJobsites = async () => {
    setLoading(true);
    try {
      const res = await getJobsites();
      if (res && res.jobsites && res.jobsites.length > 0) {
        setJobsites(res.jobsites);
        setSelectedJobsite(res.jobsites[0]);
        fetchWorkersForSite(res.jobsites[0].id);
      } else {
        // Fallback default sites
        const fallbackSites = [
          { id: 1, name: "NH-48 Highway Expansion", location: "Pune, Bypass Road", state: "Maharashtra", status: "Active", worker_count: 24 },
          { id: 2, name: "Residential Complex Block-B", location: "Mumbai, Andheri East", state: "Maharashtra", status: "Active", worker_count: 18 }
        ];
        setJobsites(fallbackSites);
        setSelectedJobsite(fallbackSites[0]);
        fetchWorkersForSite(1);
      }
    } catch (err) {
      console.error("Error fetching jobsites:", err);
    }
    setLoading(false);
  };

  const fetchWorkersForSite = async (siteId) => {
    try {
      const res = await getJobsiteWorkers(siteId);
      if (res && res.workers) {
        setWorkers(res.workers);
      } else {
        setWorkers([
          { reference_id: "SG-A3F2B-4521", name: "Ramesh Kumar", phone: "9876543210", role: "Mason", daily_wage: 600, status: "PRESENT" },
          { reference_id: "SG-W2K1-8841", name: "Suresh Yadav", phone: "9876540012", role: "Carpenter", daily_wage: 650, status: "PRESENT" },
          { reference_id: "SG-W3L9-9921", name: "Dinesh Patel", phone: "9876540013", role: "Electrician", daily_wage: 700, status: "PRESENT" }
        ]);
      }
    } catch (err) {
      setWorkers([
        { reference_id: "SG-A3F2B-4521", name: "Ramesh Kumar", phone: "9876543210", role: "Mason", daily_wage: 600, status: "PRESENT" }
      ]);
    }
  };

  const handleJobsiteSelect = (site) => {
    setSelectedJobsite(site);
    fetchWorkersForSite(site.id);
  };

  const handleMarkAttendance = async (workerRefId, status) => {
    if (!selectedJobsite) return;
    try {
      const res = await markAttendance({
        jobsite_id: selectedJobsite.id,
        worker_reference_id: workerRefId,
        date: attendanceDate,
        status: status,
        payout_amount: 600.0
      });
      if (res && res.success) {
        setSuccessMessage(`Updated attendance for ${workerRefId} to ${status}`);
        setTimeout(() => setSuccessMessage(""), 3000);
        // Optimistic update
        setWorkers(workers.map(w => w.reference_id === workerRefId ? { ...w, status } : w));
      }
    } catch (err) {
      console.error("Failed to mark attendance", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(searchWorker.toLowerCase()) ||
    w.reference_id.toLowerCase().includes(searchWorker.toLowerCase()) ||
    w.role.toLowerCase().includes(searchWorker.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top App Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="h-9 w-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <WorkProviderIcon size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  {t("workProviderPortal")}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  Licensed Provider
                </span>
              </div>
              <span className="text-xs text-slate-400 block font-mono">
                {workProvider.company} &bull; {workProvider.refId}
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
              <span>Active Construction Sites</span>
              <BuildingIcon size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{jobsites.length}</div>
            <span className="text-[11px] text-slate-500">Fully compliant muster rolls</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Deployable Labor Force</span>
              <UsersIcon size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{workers.length}</div>
            <span className="text-[11px] text-slate-500">Linked with daily wage rates</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Compliance Trust Score</span>
              <AwardIcon size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{workProvider.score} / 100</div>
            <span className="text-[11px] text-emerald-400 font-medium">A+ Welfare Compliant</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Active Muster Date</span>
              <CalendarIcon size={16} className="text-indigo-400" />
            </div>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none w-full"
            />
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircleIcon size={16} className="text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Layout: Site Selector & Muster Roll */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Registered Jobsites */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {t("jobsites")}
              </h2>
              <span className="text-xs text-slate-400">Select active site</span>
            </div>

            <div className="space-y-3">
              {jobsites.map((site) => {
                const isSelected = selectedJobsite?.id === site.id;
                return (
                  <button
                    key={site.id}
                    onClick={() => handleJobsiteSelect(site)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      isSelected
                        ? "bg-slate-900 border-blue-500/80 shadow-lg shadow-blue-950/50"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="font-semibold text-sm text-white block">
                          {site.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPinIcon size={13} className="text-slate-500" />
                          <span>{site.location}, {site.state}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {site.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Muster Roll Strength</span>
                      <span className="font-semibold text-slate-200">{workers.length} Workers</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Muster Roll for Selected Site */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white">
                    {selectedJobsite ? selectedJobsite.name : "Select a Jobsite"}
                  </h2>
                  <span className="text-xs text-slate-400">
                    Daily Statutory Muster Roll & Wage Verification &bull; {attendanceDate}
                  </span>
                </div>

                <div className="relative">
                  <SearchIcon size={14} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchWorker}
                    onChange={(e) => setSearchWorker(e.target.value)}
                    placeholder="Search name or ID..."
                    className="bg-slate-950 border border-slate-700/80 focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none w-48 transition"
                  />
                </div>
              </div>

              {/* Workers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">Worker Details</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Daily Wage</th>
                      <th className="py-2.5 px-3">Attendance</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredWorkers.map((w) => {
                      const isPresent = w.status !== "ABSENT";
                      return (
                        <tr key={w.reference_id} className="hover:bg-slate-800/30 transition">
                          <td className="py-3 px-3">
                            <span className="font-semibold text-white block">{w.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{w.reference_id}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                              {w.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-200">
                            ₹{w.daily_wage || 600} / day
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                              isPresent
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80"
                                : "bg-rose-950 text-rose-400 border border-rose-800/80"
                            }`}>
                              {isPresent ? <CheckIcon size={12} /> : <XIcon size={12} />}
                              <span>{isPresent ? "PRESENT" : "ABSENT"}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            {isPresent ? (
                              <button
                                onClick={() => handleMarkAttendance(w.reference_id, "ABSENT")}
                                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 transition"
                              >
                                Mark Absent
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMarkAttendance(w.reference_id, "PRESENT")}
                                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 transition"
                              >
                                Mark Present
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredWorkers.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No workers found matching criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}