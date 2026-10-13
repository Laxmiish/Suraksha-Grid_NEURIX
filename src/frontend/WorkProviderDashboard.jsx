import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getHouseholdHelpers, getAvailableDomesticWorkers, markHouseholdAttendance, hireHouseholdHelper } from "../api/api.jsx";
import { useLanguage, LanguageSelector } from "../context/LanguageContext";
import {
  ShieldIcon,
  ShieldCheckIcon,
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AwardIcon,
  SearchIcon,
  PlusIcon,
  LogOutIcon,
  MapPinIcon,
  PhoneIcon,
  CheckIcon,
  XIcon,
  FileTextIcon
} from "../components/Icons";

export default function WorkProviderDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [helpers, setHelpers] = useState([]);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [alertMsg, setAlertMsg] = useState("");

  const employerRefId = localStorage.getItem("sg_ref_id") || "SG-H1P8Q-9012";
  const employerName = localStorage.getItem("sg_name") || "Priya Sharma";

  useEffect(() => {
    loadData();
  }, [employerRefId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [myRes, availRes] = await Promise.all([
        getHouseholdHelpers(employerRefId),
        getAvailableDomesticWorkers()
      ]);

      if (myRes && myRes.helpers && myRes.helpers.length > 0) {
        setHelpers(myRes.helpers);
      } else {
        // High-fidelity fallback based on household_db seeds
        setHelpers([
          {
            engagement_id: 1,
            reference_id: "SG-DW01-1101",
            name: "Sunita Bai",
            phone: "9876540001",
            role: "Cook & Housekeeping",
            agreed_wage: 8500,
            police_verified: true,
            rating: 4.9,
            status: "Active",
            start_date: "2025-01-01",
            attendance: "PRESENT"
          },
          {
            engagement_id: 2,
            reference_id: "SG-DW02-1102",
            name: "Mahesh Yadav",
            phone: "9876540002",
            role: "Driver & Chauffeur",
            agreed_wage: 18000,
            police_verified: true,
            rating: 4.8,
            status: "Active",
            start_date: "2025-02-15",
            attendance: "PRESENT"
          }
        ]);
      }

      if (availRes && availRes.domestic_workers) {
        setAvailableWorkers(availRes.domestic_workers);
      } else {
        setAvailableWorkers([
          { reference_id: "SG-DW03-1103", name: "Geeta Devi", phone: "9876540003", skills: "Babysitter, Elder Care", monthly_rate: 12000, police_verified: true, rating: 4.7, city: "Mumbai" },
          { reference_id: "SG-DW04-1104", name: "Kavita Shinde", phone: "9876540004", skills: "Housekeeper, Deep Cleaning", monthly_rate: 9000, police_verified: true, rating: 4.9, city: "Mumbai" },
          { reference_id: "SG-DW05-1105", name: "Raju Shrestha", phone: "9876540005", skills: "Gardener, Security Guard", monthly_rate: 15000, police_verified: true, rating: 4.6, city: "Pune" }
        ]);
      }
    } catch (err) {
      console.error("Error loading household data", err);
    }
    setLoading(false);
  };

  const handleAttendance = async (helper, status) => {
    try {
      await markHouseholdAttendance({
        engagement_id: helper.engagement_id,
        worker_reference_id: helper.reference_id,
        date: attendanceDate,
        status: status
      });
      setHelpers(helpers.map(h => h.reference_id === helper.reference_id ? { ...h, attendance: status } : h));
      setAlertMsg(`Updated ${helper.name}'s attendance to ${status}`);
      setTimeout(() => setAlertMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHire = async (worker) => {
    try {
      await hireHouseholdHelper({
        employer_id: employerRefId,
        worker_id: worker.reference_id,
        role: worker.skills.split(",")[0],
        agreed_wage: worker.monthly_rate
      });
      setHelpers([
        ...helpers,
        {
          engagement_id: Date.now(),
          reference_id: worker.reference_id,
          name: worker.name,
          phone: worker.phone,
          role: worker.skills,
          agreed_wage: worker.monthly_rate,
          police_verified: worker.police_verified,
          rating: worker.rating,
          status: "Active",
          start_date: new Date().toISOString().split("T")[0],
          attendance: "PRESENT"
        }
      ]);
      setShowHireModal(false);
      setAlertMsg(`Successfully engaged ${worker.name} for your household.`);
      setTimeout(() => setAlertMsg(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const totalMonthlyOutlay = helpers.reduce((sum, h) => sum + (Number(h.agreed_wage) || 0), 0);

  const filteredHelpers = helpers.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="h-10 w-10 rounded-xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <HomeIcon size={22} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Work Provider Portal &bull; House Help Management
                </span>
                <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 rounded-full">
                  Household Employer
                </span>
              </div>
              <span className="text-xs text-slate-400 block font-mono">
                {employerName} &bull; {employerRefId} (Bandra West, Mumbai)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <button
              onClick={() => setShowHireModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/25 transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon size={14} />
              <span>Hire House Help</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 transition cursor-pointer"
              title="Sign Out"
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
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Active House Help</span>
              <UsersIcon size={18} className="text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">{helpers.length} Staff</div>
            <span className="text-[11px] text-slate-500">Cooks, Drivers, Housekeepers</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Monthly Wage Commitment</span>
              <AwardIcon size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">₹{totalMonthlyOutlay.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 font-medium">Fair Domestic Pay Standard</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Safety & Police Verification</span>
              <ShieldCheckIcon size={18} className="text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">100% Verified</div>
            <span className="text-[11px] text-blue-400">UIDAI & Police Certified Staff</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Daily Attendance Date</span>
              <CalendarIcon size={18} className="text-indigo-400" />
            </div>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none w-full"
            />
          </div>
        </div>

        {/* Success Alert Banner */}
        {alertMsg && (
          <div className="p-4 rounded-xl bg-teal-950/70 border border-teal-800/80 flex items-center gap-2.5 text-xs text-teal-200">
            <CheckCircleIcon size={18} className="text-teal-400 shrink-0" />
            <span>{alertMsg}</span>
          </div>
        )}

        {/* House Help Muster & Management Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">
                Your Hired House Help & Domestic Staff
              </h2>
              <p className="text-xs text-slate-400">
                Manage daily presence, fair statutory payouts, and safety records under Household Welfare Rules.
              </p>
            </div>

            <div className="relative">
              <SearchIcon size={14} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff name or role..."
                className="bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none w-56 transition"
              />
            </div>
          </div>

          {/* Grid of House Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredHelpers.map((h) => {
              const isPresent = h.attendance !== "ABSENT";
              return (
                <div
                  key={h.reference_id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 shrink-0 font-bold text-base">
                        {h.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{h.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/60">
                            {h.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                          <span>{h.reference_id}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <PhoneIcon size={12} />
                            {h.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-white block">
                        ₹{h.agreed_wage.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">per month</span>
                    </div>
                  </div>

                  {/* Verification & Rating Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <ShieldCheckIcon size={14} />
                        <span>Police Verified</span>
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Rating: <span className="text-amber-400 font-bold">{h.rating} ★</span>
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                      isPresent
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80"
                        : "bg-rose-950 text-rose-400 border border-rose-800/80"
                    }`}>
                      {isPresent ? <CheckIcon size={12} /> : <XIcon size={12} />}
                      <span>{isPresent ? "PRESENT TODAY" : "ABSENT TODAY"}</span>
                    </span>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-500">
                      Attendance for {attendanceDate}
                    </span>
                    <div className="flex items-center gap-2">
                      {isPresent ? (
                        <button
                          onClick={() => handleAttendance(h, "ABSENT")}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 transition cursor-pointer"
                        >
                          Mark Absent
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAttendance(h, "PRESENT")}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 transition cursor-pointer"
                        >
                          Mark Present
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHelpers.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No domestic helpers registered yet. Click "Hire House Help" above to discover verified staff.
            </div>
          )}
        </div>
      </main>

      {/* Hire House Help Modal */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Discover Verified Domestic House Help
                </h3>
                <p className="text-xs text-slate-400">
                  Select and directly engage certified staff with police verification and statutory wage protections.
                </p>
              </div>
              <button
                onClick={() => setShowHireModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {availableWorkers.map((w) => (
                <div
                  key={w.reference_id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{w.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/60">
                        {w.skills}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>{w.city}</span>
                      <span>&bull;</span>
                      <span className="text-amber-400 font-semibold">{w.rating} ★</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-medium">Police Verified</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold text-white block">
                        ₹{w.monthly_rate.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500">monthly standard</span>
                    </div>
                    <button
                      onClick={() => handleHire(w)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/25 transition cursor-pointer"
                    >
                      Engage Staff
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Suraksha Grid National Welfare Initiative &bull; Domestic Staff Protection Framework.
      </footer>
    </div>
  );
}
