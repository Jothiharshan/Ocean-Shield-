import React, { useState } from "react";
import { User, HazardReport, ActiveAlert, HazardCategory, VerificationStatus, UserRole, SeverityLevel } from "../types";
import { getTranslation, formatDateUTC } from "../utils/translations";
import {
  Grid,
  FileText,
  AlertTriangle,
  Bot,
  UserCheck,
  Heart,
  Compass,
  Layers,
  Activity,
  Database,
  Sparkles,
  BarChart2,
  ShieldCheck,
  Lock,
  TrendingUp,
  Plus,
  Trash,
  Check,
  X,
  ChevronRight,
  MapPin,
  Calendar,
  Download,
  Sliders,
  Cpu,
  Clock,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

// ==========================================
// 1. CITIZEN DASHBOARD WIDGETS
// ==========================================
interface CitizenDashboardProps {
  reports: HazardReport[];
  alerts: ActiveAlert[];
  currentUser: User;
  onNavigate: (tab: string) => void;
  onDeleteReport?: (id: string) => void;
  globalLang?: string;
}

export function CitizenDashboard({ reports, alerts, currentUser, onNavigate, onDeleteReport, globalLang }: CitizenDashboardProps) {
  const lang = globalLang || "English";
  // Filter reports submitted by this citizen
  const citizenReports = reports.filter(r => r.reportedBy === currentUser.name || r.reportedBy === currentUser.id || r.reportedBy.toLowerCase().includes("jothi"));
  
  return (
    <div className="space-y-6">
      {/* Citizen Welcome Card */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/20 border border-cyan-500/20 p-6 rounded-3xl text-left relative overflow-hidden shadow-lg animate-fade-in">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <UserCheck className="w-32 h-32 text-cyan-400" />
        </div>
        <div className="space-y-2 max-w-2xl">
          <span className="text-[10px] text-cyan-405 font-mono font-bold tracking-widest uppercase">Verified Sighting Observer</span>
          <h2 className="text-2xl font-black font-heading text-slate-100">{getTranslation(lang, "welcome_citizen", `Welcome back, ${currentUser.name}!`)}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {getTranslation(lang, "desc_citizen", "Monitor local coastal conditions, receive dynamic weather signals, check satellite imagery alerts, and file hazard observations directly to safety networks.")}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[10px] bg-cyan-950/65 border border-cyan-850 text-cyan-400 px-3 py-1 pb-1.5 rounded-full font-mono font-bold uppercase">
              Role: Citizen Tracker
            </span>
            <span className="text-[10px] bg-slate-950 border border-slate-850 text-slate-400 px-3 py-1 pb-1.5 rounded-full font-mono">
              Organization: {currentUser.organization || "Independent Watch"}
            </span>
            <span className="text-[10px] bg-slate-950 border border-slate-850 text-slate-400 px-3 py-1 pb-1.5 rounded-full font-mono">
              Observer Key: OS-CIT-2026
            </span>
          </div>
        </div>
      </div>

      {/* Citizen Grid widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: My reports (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{getTranslation(lang, "my_sighting_reports", "My Sighting Reports")} ({citizenReports.length})</span>
            </h3>
            <button 
              onClick={() => onNavigate("report")}
              className="text-[10px] font-mono font-black text-cyan-405 uppercase hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{getTranslation(lang, "file_new_report", "+ FILE NEW REPORT")}</span>
            </button>
          </div>

          {citizenReports.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-mono space-y-3">
              <p>{getTranslation(lang, "no_reports_yet", "You haven't dispatched any ocean hazard reports yet.")}</p>
              <button 
                onClick={() => onNavigate("report")}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 font-bold text-xs text-slate-950 rounded-xl transition cursor-pointer"
              >
                {getTranslation(lang, "launch_scribe", "Launch Sighting Scribe")}
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {citizenReports.map(report => (
                <div key={report.id} className="bg-slate-955 p-3.5 rounded-xl border border-slate-850 hover:border-slate-800 transition text-left flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] px-1.5 py-0.2 uppercase rounded font-bold font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/10">
                        {report.category.replace("_", " ")}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-slate-900 border border-slate-800 text-slate-400">
                        Confidence: {report.confidence}%
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        report.status === "Verified" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : report.status === "Pending"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 truncate">{report.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{report.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-500/60" /> {report.locationName}
                      </span>
                      <span>•</span>
                      <span>{formatDateUTC(report.reportedAt)}</span>
                    </div>
                  </div>
                  {onDeleteReport && (
                    <button 
                      onClick={() => onDeleteReport(report.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/5 transition cursor-pointer select-none shrink-0"
                      title="Retract filing"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Alerts & AI Bulletin (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          
          {/* Sighting form quick promotion panel */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{getTranslation(lang, "copilot_dispatch", "CO-PILOT CONVERSATIONAL DISPATCH")}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {getTranslation(lang, "copilot_desc", "Have questions about ocean toxic blooms, local marine wind currents, beach erosion, or need to draft rapid response steps? Just ask OceanShield AI below:")}
            </p>
            <button
              onClick={() => onNavigate("assistant")}
              className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs text-slate-350 hover:text-slate-100 transition cursor-pointer shadow-inner"
            >
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>{getTranslation(lang, "ask_ai_placeholder", 'Ask: "How do I deal with oil slicks on coast?"')}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-500" />
            </button>
          </div>

          {/* Active alerts panel */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl flex-1 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span>{getTranslation(lang, "broadcasting_advisories", "Broadcasting advisories")} ({alerts.length})</span>
              </h3>
              
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {alerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="bg-slate-955 p-3 rounded-xl border border-red-500/10 hover:border-red-500/20 transition text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-mono text-red-400 uppercase font-bold tracking-wider">
                        {alert.severity} Hazard Alert
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        By {alert.verifiedBy.split(" ")[0]}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 truncate">{alert.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onNavigate("alerts")}
              className="w-full bg-cyan-550/10 hover:bg-cyan-550/20 text-cyan-405 font-mono text-xs font-bold py-2 rounded-xl border border-cyan-800/10 transition cursor-pointer"
            >
              {getTranslation(lang, "view_all_dispatches", "VIEW ALL DISPATCHES ➔")}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}


// ==========================================
// 2. FISHERMAN DASHBOARD WIDGETS
// ==========================================
interface FishermanDashboardProps {
  reports: HazardReport[];
  alerts: ActiveAlert[];
  onNavigate: (tab: string) => void;
  globalLang?: string;
}

export function FishermanDashboard({ reports, alerts, onNavigate, globalLang }: FishermanDashboardProps) {
  const lang = globalLang || "English";
  // Safe zone voyage router state
  const [origin, setOrigin] = useState("Sanctuary Zone A-1");
  const [destination, setDestination] = useState("Delta Sector Cod Grounds");
  const [isComputingRoute, setIsComputingRoute] = useState(false);
  const [routeResult, setRouteResult] = useState<{
    safetyRating: string;
    riskScore: number;
    nearbyThreats: number;
    recommendedCourse: string;
  } | null>(null);

  const calculateRouteSafety = (e: React.FormEvent) => {
    e.preventDefault();
    setIsComputingRoute(true);
    setTimeout(() => {
      // Find reports based on search keywords
      const isSuspectLocation = origin.toLowerCase().includes("delta") || destination.toLowerCase().includes("delta") || origin.toLowerCase().includes("coral") || destination.toLowerCase().includes("coral");
      const threatCount = isSuspectLocation ? 2 : 0;
      const riskScore = isSuspectLocation ? 64 : 12;
      const safetyRating = riskScore > 50 ? "Caution: Active Fuel Slick Plume" : "Green: Optimal Sea Corridor Clearance";
      
      setRouteResult({
        safetyRating,
        riskScore,
        nearbyThreats: threatCount,
        recommendedCourse: riskScore > 50 
          ? "Alter course to 14.5°N, 120.8°E bypassing the Delta spill plume grid sector to fish safe waters." 
          : "Maintain current heading. Dynamic wind vectors indicate optimal barometric tracking."
      });
      setIsComputingRoute(false);
    }, 1000);
  };

  // Find nearest risk
  const nearbyRisks = reports.filter(r => r.severity === "Critical" || r.severity === "High");

  return (
    <div className="space-y-6 text-left">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/20 border border-teal-500/20 p-6 rounded-3xl text-left relative overflow-hidden shadow-lg animate-fade-in">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Compass className="w-32 h-32 text-emerald-400 rotate-12" />
        </div>
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] text-teal-400 font-mono font-bold tracking-widest uppercase">Safe Maritime Passage System</span>
          <h2 className="text-2xl font-black font-heading text-slate-100">{getTranslation(lang, "welcome_fisherman", "Welcome, Crew Fisherman!")}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {getTranslation(lang, "desc_fisherman", "Monitor real-time marine conditions, satellite weather advisories, coral reef barriers, and calculate voyage safety coefficients before casting your nets.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Route safety calculator (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-850">
            <h3 className="text-xs font-bold font-mono uppercase text-teal-400 tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>{getTranslation(lang, "route_safety_calc", "Route Safety & Risk Calculator")}</span>
            </h3>
          </div>

          <form onSubmit={calculateRouteSafety} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-450 uppercase font-bold">{getTranslation(lang, "planned_voyage_origin", "Planned Voyage Origin")}</label>
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs rounded-xl p-3 outline-none focus:border-teal-500 transition text-slate-100" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-450 uppercase font-bold">{getTranslation(lang, "destination_quadrant", "Destination Sighting Quadrant")}</label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs rounded-xl p-3 outline-none focus:border-teal-500 transition text-slate-100" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isComputingRoute}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 font-extrabold text-xs text-slate-950 rounded-xl transition cursor-pointer select-none font-heading uppercase tracking-wider"
            >
              {isComputingRoute ? getTranslation(lang, "synthesizing_vectors", "Synthesizing safe maritime vectors...") : getTranslation(lang, "run_diagnostics", "Run Corridor Safety Diagnostics")}
            </button>
          </form>

          {/* safety calculation results */}
          {routeResult && (
            <div className="bg-slate-955 border border-slate-850 rounded-xl p-4.5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{getTranslation(lang, "telemetry_risk_level", "TELEMETRY RISK LEVEL")}</span>
                  <p className={`text-xs font-black uppercase ${routeResult.riskScore > 35 ? "text-orange-400" : "text-emerald-400"}`}>
                    {routeResult.safetyRating}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{getTranslation(lang, "risk_index", "RISK INDEX")}</span>
                  <p className="text-lg font-mono font-black text-slate-100">{routeResult.riskScore}%</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-855 pt-3 leading-relaxed">
                <strong>{getTranslation(lang, "tactical_deviation", "TACTICAL DEVIATION WORKFLOW")}:</strong> <br />
                {routeResult.recommendedCourse}
              </div>
            </div>
          )}
        </div>

        {/* Nearby Risks and alerts Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl text-left space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <span>{getTranslation(lang, "nearby_hazards", "Nearby Sea Hazard Feeds")}</span>
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
              {nearbyRisks.map(risk => (
                <div key={risk.id} className="p-3 bg-slate-955 rounded-xl border border-red-500/10 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-red-400 uppercase font-black tracking-wider">{risk.category.replace("_", " ")}</span>
                    <span className="text-slate-500">{risk.locationName}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-200">{risk.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 3. RESEARCHER DASHBOARD WIDGETS
// ==========================================
interface ResearcherDashboardProps {
  reports: HazardReport[];
  alerts: ActiveAlert[];
  onNavigate: (tab: string) => void;
  globalLang?: string;
}

export function ResearcherDashboard({ reports, alerts, onNavigate, globalLang }: ResearcherDashboardProps) {
  const lang = globalLang || "English";
  const severeWeather = reports.filter(r => r.category === "severe_weather").length;
  const oilSpill = reports.filter(r => r.category === "oil_spill").length;
  const coralBleaching = reports.filter(r => r.category === "coral_bleaching").length;
  const illegalFishing = reports.filter(r => r.category === "illegal_fishing").length;

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-950/20 border border-violet-500/20 p-6 rounded-3xl text-left relative overflow-hidden shadow-lg animate-fade-in">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layers className="w-32 h-32 text-violet-400 rotate-45" />
        </div>
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] text-violet-400 font-mono font-bold tracking-widest uppercase">Marine Thermal Bio Diagnostic Console</span>
          <h2 className="text-2xl font-black font-heading text-slate-100">{getTranslation(lang, "welcome_researcher", "Welcome, Marine Researcher!")}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {getTranslation(lang, "desc_researcher", "Access ocean telemetry streams, analyse computed plumes, export multi-spectral database files, and run statistical algorithms on hazard vectors.")}
          </p>
        </div>
      </div>

      {/* Grid status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-violet-500/10">
          <span className="text-slate-500 text-[9px] uppercase font-mono tracking-wider block font-bold">Coral Bleaching Indices</span>
          <h3 className="text-2xl font-black text-violet-400 font-mono mt-1">{coralBleaching} anomalous sites</h3>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-violet-500/10">
          <span className="text-slate-500 text-[9px] uppercase font-mono tracking-wider block font-bold">Sanctuary Encroachments</span>
          <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">{illegalFishing} AIS alerts</h3>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-violet-500/10">
          <span className="text-slate-500 text-[9px] uppercase font-mono tracking-wider block font-bold">Severe Weather Sectors</span>
          <h3 className="text-2xl font-black text-cyan-400 font-mono mt-1">{severeWeather} tracking cells</h3>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-violet-500/10">
          <span className="text-slate-500 text-[9px] uppercase font-mono tracking-wider block font-bold">Slick Plume Drift Nodes</span>
          <h3 className="text-2xl font-black text-red-400 font-mono mt-1">{oilSpill} spill centroids</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Heatmap summary view (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850">
            <h3 className="text-xs font-bold font-mono uppercase text-violet-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Bio-Anomalies Density Heatmaps overview</span>
            </h3>
            <button 
              onClick={() => onNavigate("safezones")}
              className="text-[10px] font-mono text-cyan-405 font-bold hover:underline"
            >
              EXPAND VIEW
            </button>
          </div>

          <div className="bg-slate-955 p-4 rounded-xl border border-slate-855 space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Academic oceanography uses coordinate mapping grids as primary risk density matrices. Below is a simulated reef heat stress index:
            </p>

            <div className="grid grid-cols-6 h-12 gap-1">
              {[81, 92, 45, 62, 73, 91, 54, 32, 67, 85, 94, 21, 63, 74, 95, 88, 12, 43].slice(0, 12).map((val, idx) => {
                let col = "bg-violet-950/20 text-violet-500 border border-violet-900/30";
                if (val > 85) col = "bg-rose-500/20 text-rose-400 border border-rose-500/30";
                else if (val > 60) col = "bg-amber-500/20 text-amber-450 border border-amber-500/30";
                else if (val > 30) col = "bg-emerald-500/20 text-emerald-450 border border-emerald-500/30";
                return (
                  <div key={idx} className={`${col} rounded flex flex-col items-center justify-center font-mono text-[10px] font-bold p-1`}>
                    {val}°C
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-855 pt-2">
              <strong>ECOLOGICAL INSIGHTS:</strong> Sustained coral thermal anomalies documented over fragile reefs. Acidification indices indicate high risk for benthic bivalves.
            </div>
          </div>
        </div>

        {/* Export dataset quick access (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-200 tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Scientific Siphoning Tool</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review our entire crowdsourced hazard catalog and download verified datasets directly for GIS integration or scientific modeling.
            </p>
          </div>

          <button 
            onClick={() => onNavigate("export")}
            className="w-full bg-violet-605/10 hover:bg-violet-605/20 text-violet-400 font-mono text-xs font-black py-3 rounded-xl border border-violet-800/10 transition cursor-pointer text-center"
          >
            LAUNCH EXPORT MODULE ➔
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 4. AUTHORITY DASHBOARD WIDGETS
// ==========================================
interface AuthorityDashboardProps {
  reports: HazardReport[];
  alerts: ActiveAlert[];
  onNavigate: (tab: string) => void;
  onUpdateReportStatus: (id: string, status: VerificationStatus, confidenceBoost?: number) => void;
  globalLang?: string;
}

export function AuthorityDashboard({ reports, alerts, onNavigate, onUpdateReportStatus, globalLang }: AuthorityDashboardProps) {
  const lang = globalLang || "English";
  const pendingReports = reports.filter(r => r.status === "Pending");
  const verifiedReports = reports.filter(r => r.status === "Verified");
  const criticAlerts = alerts.filter(a => a.severity === "Critical");

  return (
    <div className="space-y-6 text-left">
      {/* Alert Ribbon */}
      {pendingReports.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-mono font-bold text-amber-400">
              URGENT AUDIT OVERWATCH: {pendingReports.length} CROWD INCIDENTS PENDING IN THE VALIDATION QUEUE.
            </span>
          </div>
          <button 
            onClick={() => onNavigate("verification")}
            className="text-[11px] font-mono font-black text-amber-400 underline hover:no-underline shrink-0"
          >
            RESOLVE NOW
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/20 border border-cyan-500/20 p-6 rounded-3xl text-left relative overflow-hidden shadow-lg animate-fade-in">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-32 h-32 text-teal-400 rotate-12" />
        </div>
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] text-teal-400 font-mono font-bold tracking-widest uppercase">Marine Dispatch Command Center</span>
          <h2 className="text-2xl font-black font-heading text-slate-100">{getTranslation(lang, "welcome_authority", "Welcome, Safety Dispatcher!")}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {getTranslation(lang, "desc_authority", "Review citizen hazard files, broadcast automated safety alerts, coordinate response teams, and dispatch real-time emergency notifications.")}
          </p>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rapid approve queue (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Incident Command validation console</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              Total logs: {reports.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {pendingReports.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 font-mono">
                Verification queue is fully caught up. All citizen reports verified or audited successfully.
              </div>
            ) : (
              pendingReports.slice(0, 3).map(report => (
                <div key={report.id} className="bg-slate-955 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.2 uppercase rounded border border-amber-500/10">
                        {report.category.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Confidence: {report.confidence}%
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-200 truncate">{report.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{report.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button 
                      onClick={() => onUpdateReportStatus(report.id, "Verified", 100)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold font-mono text-[10px] text-slate-950 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                      onClick={() => onUpdateReportStatus(report.id, "Unverified", 10)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-[10px] rounded-lg flex items-center gap-1 transition border border-red-500/15 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Broadcasting details (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold font-mono uppercase text-teal-400 tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>Broadcasting Alerts ({alerts.length})</span>
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Issue coastal alerts, red-tide suspensions, or chemical fuel containment warnings to vessel monitors instantly.
            </p>

            <div className="space-y-2 pt-1">
              <div className="bg-slate-955 p-3 rounded-lg border border-slate-850 text-xs font-mono text-slate-400">
                <span className="text-red-400 block font-bold">🚨 28 BROADCST SECTORS</span>
                Active sirens operating in Delta code boundaries.
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("alerts")}
            className="w-full bg-teal-505/10 hover:bg-teal-505/20 text-teal-405 font-mono text-xs font-black py-3 rounded-xl border border-teal-800/10 transition cursor-pointer text-center"
          >
            DISPATCH COAST WARNINGS ➔
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 5. ADMIN DASHBOARD COCKPIT
// ==========================================
interface AdminDashboardProps {
  reports: HazardReport[];
  alerts: ActiveAlert[];
  currentUser: User;
  onNavigate: (tab: string) => void;
  globalLang?: string;
}

export function AdminDashboard({ reports, alerts, currentUser, onNavigate, globalLang }: AdminDashboardProps) {
  const lang = globalLang || "English";
  return (
    <div className="space-y-6 text-left">
      {/* Welcome Board */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-2xl animate-fade-in">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sliders className="w-32 h-32 text-cyan-500 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] text-rose-500 font-mono font-bold tracking-widest uppercase flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>ROOT ADMINISTRATOR CLEARANCE ACCESS CODE ACTIVE</span>
          </span>
          <h2 className="text-2xl font-black font-heading text-slate-100">{getTranslation(lang, "welcome_admin", "Welcome, System Administrator!")}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {getTranslation(lang, "desc_admin", "Manage user accounts, adjust system configuration values, monitor dev server telemetry logs, and inspect deep database collections.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Users (Admin Users) */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[210px]">
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Observer Accounts</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify operator credentials, modify security scopes, promote citizen tracker nodes, or review authorization keys.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("users")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-mono font-bold text-xs py-2 rounded-xl transition cursor-pointer text-center"
          >
            Operator registry ➔
          </button>
        </div>

        {/* Column 2: Dataset DB Override */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[210px]">
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-violet-400" />
              <span>Database overrides</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Delete erroneous claims, force AI model confidence recheck logs, and override satellite category tagging coordinates.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("reports")}
            className="w-full bg-violet-600 hover:bg-violet-700 text-slate-100 font-mono text-xs py-2 rounded-xl transition cursor-pointer text-center"
          >
            Raw Databases catalog ➔
          </button>
        </div>

        {/* Column 3: AI Tuning config */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[210px]">
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-100 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Model Hyperparameters</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tuning parameters for the Gemini model instructions. Modify prompt context, confidence scoring threshold, and safety tiers.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("aiconfig")}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono font-bold text-xs py-2 rounded-xl transition cursor-pointer text-center"
          >
            Tuning dashboard ➔
          </button>
        </div>

      </div>
    </div>
  );
}


// ==========================================
// 6. EXTRA ACTIVE USERS ADMIN PANEL
// ==========================================
interface UsersGuestAdminProps {
  onUpdateRole: (role: UserRole) => void;
  currentRole: UserRole;
  lang?: string;
}

export function UsersAdminPanel({ onUpdateRole, currentRole, lang = "English" }: UsersGuestAdminProps) {
  const usersList = [
    { name: "Jothi Harshan D K (You)", email: "jothi@oceanshield.org", role: currentRole, key: "OS-SEC-944" },
    { name: "Prof. Clara Vane", email: "clara.v@coastal-lab.edu", role: "Researcher", key: "OS-ACAD-042" },
    { name: "Officer Vance Sterling", email: "sterling@coastguard.mil", role: "Authority", key: "OS-MIL-101" },
    { name: "Marcus 'Salty' Gable", email: "marcus.g@sea-trawler.net", role: "Fisherman", key: "OS-VOY-842" },
    { name: "Elena Rostova", email: "e.rostova@eco-save.org", role: "Citizen", key: "OS-CIT-331" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-850 pb-3">
        <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-405" />
          <span>{getTranslation(lang, "active_observer_registry_accounts", "Active Observer Registry Accounts")}</span>
        </h3>
        <p className="text-xs text-slate-400">{getTranslation(lang, "manage_digital_clearances", "Manage digital clearances and alter operational privileges for active crews on OceanShield.")}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-850">
        <table className="w-full border-collapse font-sans text-xs text-left">
          <thead>
            <tr className="bg-slate-950 font-mono text-[10px] text-slate-450 uppercase border-b border-slate-855">
              <th className="p-4">{getTranslation(lang, "table_header_name", "Name")}</th>
              <th className="p-4">{getTranslation(lang, "table_header_email", "Email Address")}</th>
              <th className="p-4">{getTranslation(lang, "table_header_auth_key", "Authorization Key")}</th>
              <th className="p-4">{getTranslation(lang, "table_header_assigned_clearance", "Assigned Clearance Scope")}</th>
              <th className="p-4 text-center">{getTranslation(lang, "table_header_modify_clearance", "Modify Clearance")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-855 text-slate-300">
            {usersList.map((usr, index) => (
              <tr key={index} className="hover:bg-slate-955 transition">
                <td className="p-4 font-bold text-slate-100">{usr.name}</td>
                <td className="p-4 font-mono text-slate-400">{usr.email}</td>
                <td className="p-4 font-mono text-slate-500">{usr.key}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                    usr.role === "Admin" ? "bg-red-500/10 text-red-400 border border-red-500/15" :
                    usr.role === "Authority" ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" :
                    usr.role === "Researcher" ? "bg-violet-500/10 text-violet-400 border border-violet-500/15" :
                    usr.role === "Fisherman" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" :
                    "bg-cyan-500/10 text-cyan-405 border border-cyan-500/15"
                  }`}>
                    {usr.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {usr.name.includes("You") ? (
                    <select 
                      value={currentRole}
                      onChange={(e) => onUpdateRole(e.target.value as any)}
                      className="bg-slate-950 text-cyan-400 font-mono font-bold text-[11px] p-2 outline-none border border-slate-800 rounded-lg cursor-pointer mx-auto block"
                    >
                      <option value="Citizen">Citizen</option>
                      <option value="Fisherman">Fisherman</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Authority">Authority</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    <div className="text-center font-mono text-[9px] text-slate-500">READ ONLY MODE</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ==========================================
// 7. EXTRA AI HYPERPARAMETERS CONFIG PANEL
// ==========================================
export function AIConfigPanel() {
  const [temp, setTemp] = useState(0.35);
  const [model, setModel] = useState("gemini-3.5-flash");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are OceanShield AI, an advanced, highly specialized maritime security, oceanography, and incident responder assistant. You assist fishermen, marine researchers, coastal communities, and coast guards. Provide precise, actionable coordinates, chemical dispersal guidelines, or emergency response workflows."
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-850 pb-3">
        <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
          <span>Gemini AI Hyperparameters Tuning Console</span>
        </h3>
        <p className="text-xs text-slate-400">Configure parameters, prompt weights, and system directives for the autonomous marine risk assistant.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-450 uppercase font-bold block">Assigned Model Target</label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 outline-none text-slate-305"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default Low-Latency)</option>
              <option value="gemini-3.5-pro">Gemini 3.5 Pro (Extreme Accuracy)</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-slate-450 uppercase font-bold">Model Temperature (Creativity): {temp}</label>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1.0" 
              step="0.05"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-450 uppercase font-bold block">System Directives prompt</label>
          <textarea 
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs font-sans rounded-xl p-3 outline-none text-slate-300 leading-relaxed focus:border-cyan-500/40 transition"
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-3 bg-teal-500 hover:bg-teal-600 font-extrabold text-xs text-slate-950 rounded-xl transition cursor-pointer select-none font-heading uppercase tracking-wider"
        >
          {saveSuccess ? "✓ Configurations synced with satellite uplink!" : "Synch LLM Parameters"}
        </button>
      </div>
    </div>
  );
}


// =====================// 8. EXTRA VOYAGER SAFE ZONES PANEL
// ==========================================
export function SafeZonesPanel({ reports, globalLang }: { reports: HazardReport[]; globalLang?: string }) {
  const lang = globalLang || "English";
  const customZones = [
    { name: getTranslation(lang, "zone_bravo", "Zone Bravo Anchorages"), risk: getTranslation(lang, "risk_low", "Low Risk"), status: getTranslation(lang, "status_cleansed", "Cleansed Corridor"), lat: 14.24, lng: 120.45 },
    { name: getTranslation(lang, "zone_echo7", "Echo-7 Fragile Reef Sanctuary"), risk: getTranslation(lang, "risk_elevated", "Elevated Sea Temp"), status: getTranslation(lang, "status_thermal", "Thermal Alert active"), lat: 14.54, lng: 121.12 },
    { name: getTranslation(lang, "zone_delta3", "Delta-3 Petroleum Sector"), risk: getTranslation(lang, "risk_spill", "Spill Slick tracking"), status: getTranslation(lang, "status_closed", "Closed for Fishing"), lat: 14.12, lng: 120.15 },
    { name: getTranslation(lang, "zone_foxtrot", "Sector Foxtrot Clam Nursery"), risk: getTranslation(lang, "risk_algae", "Harmful Algae susp"), status: getTranslation(lang, "status_suspended", "Harvest Suspended"), lat: 14.88, lng: 120.33 }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-850 pb-3">
        <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span>{getTranslation(lang, "title_safezones", "Ocean Sanctuary Zones & Voyager Corridors")}</span>
        </h3>
        <p className="text-xs text-slate-400">{getTranslation(lang, "desc_safezones", "Track biological stress levels, designated anchorages, and no-fishing conservation zones in Manila and Cavite sectors.")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {customZones.map((zone, idx) => {
          let badge = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15";
          if (zone.risk.includes("Spill") || zone.risk.includes("Closed")) badge = "bg-red-500/10 text-red-405 border border-red-505/15";
          else if (zone.risk.includes("Elevated") || zone.risk.includes("Algae")) badge = "bg-amber-500/10 text-amber-400 border border-amber-500/15";

          return (
            <div key={idx} className="bg-slate-955 p-4 rounded-xl border border-slate-850 flex items-start justify-between gap-3 hover:border-slate-800 transition">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500">QUADRANT COORDINATE: N {zone.lat}° / E {zone.lng}°</span>
                <h4 className="text-sm font-bold text-slate-200">{zone.name}</h4>
                <p className="text-xs text-slate-400">{zone.status}</p>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-extrabold uppercase shrink-0 ${badge}`}>
                {zone.risk}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ==========================================
// 9. EXTRA RESEARCH DATASET EXPORT PANEL
// ==========================================
export function ExportDataPanel({ reports, globalLang }: { reports: HazardReport[]; globalLang?: string }) {
  const lang = globalLang || "English";
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const simulateDownload = (format: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);

      // Create fake downloadable structure
      const reportCSVContent = "data:text/csv;charset=utf-8," 
        + "ID,Title,Category,Status,Confidence,Latitude,Longitude,ReportedAt\n"
        + reports.map(r => `${r.id},"${r.title}",${r.category},${r.status},${r.confidence},${r.latitude},${r.longitude},${r.reportedAt}`).join("\n");
      const encodedUri = encodeURI(reportCSVContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `oceanshield_dataset_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-850 pb-3">
        <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
          <Database className="w-5 h-5 text-violet-405" />
          <span>{getTranslation(lang, "title_export", "Scientific Siphoning & Dataset Export Panel")}</span>
        </h3>
        <p className="text-xs text-slate-400">{getTranslation(lang, "desc_export", "Download formatted crowdsourced reports, thermal SST datasets, and verified drift parameters for scientific telemetry studies.")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            OceanShield operates symmetric, schema-validated JSON outputs conforming to public academic GIS grids. Export files contain coordinates, automated AI categorization scores, severity trends, and verification audit trails.
          </p>

          <div className="bg-slate-955 p-3 rounded-xl border border-slate-850 font-mono text-[10px] text-slate-500 overflow-x-auto max-h-[140px]">
            <pre>{JSON.stringify(reports.slice(0, 1), null, 2)}</pre>
          </div>
        </div>

        <div className="md:col-span-4 space-y-3 shrink-0">
          <button 
            disabled={downloading}
            onClick={() => simulateDownload("csv")}
            className="w-full py-3 bg-violet-600 hover:bg-violet-755 text-slate-100 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer select-none"
          >
            <Download className="w-4 h-4" /> 
            {downloading ? "Compiling CSV..." : getTranslation(lang, "btn_export_csv", "Export as CSV Dataset")}
          </button>
          <button 
            disabled={downloading}
            onClick={() => simulateDownload("json")}
            className="w-full py-3 bg-slate-950 hover:bg-slate-855 border border-slate-800 text-slate-300 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer select-none"
          >
            <Download className="w-4 h-4" /> 
            {downloading ? "Siphoning JSON..." : getTranslation(lang, "btn_export_json", "Export as Schema JSON")}
          </button>

          {downloadSuccess && (
            <p className="text-[10px] font-mono text-emerald-450 text-center animate-fade-in font-bold">
              ✓ Telemetry dataset download file initiated!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 10. EXTRA ACADEMIC INSIGHTS BULLETIN
// ==========================================
export function InsightsPanel({ globalLang }: { globalLang?: string }) {
  const lang = globalLang || "English";
  const bulletInsights = [
    {
      title: "Manila Bay Thermal Concentration Peak",
      text: "Reef thermal sensor feeds indicate a local SST spike of +1.8°C over Manila Bay shallow zones. Thermal stress indices predict coral fluorescence trends.",
      date: "2026-06-18"
    },
    {
      title: "Pyrodinium bloom Expansion Forecast",
      text: "Cell count mapping tracks toxic red-tide anomalies migrating southwest with current vectors. Shellfish suspension in Sector Foxtrot should remain enforced.",
      date: "2026-06-17"
    },
    {
      title: "Non-transponder AIS Sanctuary Intrusion Patterns",
      text: "Autonomous patrol drone telemetry logs indicate three suspected illegal fishing trawlers matching transponder blackouts near Cavite sanctuary bounds.",
      date: "2026-06-15"
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-850 pb-3">
        <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          <span>{getTranslation(lang, "title_insights", "Academic Sighting Insights & Core Analyses")}</span>
        </h3>
        <p className="text-xs text-slate-400">{getTranslation(lang, "desc_insights", "Autonomous scientific conclusions generated dynamically from marine hazard historical records.")}</p>
      </div>

      <div className="space-y-4">
        {bulletInsights.map((insight, idx) => (
          <div key={idx} className="bg-slate-955 p-4 rounded-xl border border-slate-850 text-left space-y-1 hover:border-slate-800 transition">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>ACADEMIC INSIGHT // OS-SCI-0{idx+1}</span>
              <span>{insight.date}</span>
            </div>
            <h4 className="text-sm font-black text-slate-200">{insight.title}</h4>
            <p className="text-xs text-slate-450 leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. EXTRA ADMIN SYSTEM CONFIGS & SERVER HEALTH DIAGNOSTICS
// ==========================================
export function SettingsPanel() {
  const [threshold, setThreshold] = useState(80);
  const [gpsOffset, setGpsOffset] = useState(0.005);
  const [syncDelay, setSyncDelay] = useState(5);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-850 pb-3">
        <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-500" />
          <span>Global System Configuration & Security Rules</span>
        </h3>
        <p className="text-xs text-slate-400">Configure core telemetry variables, GPS grid thresholds, and validation levels.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-450 uppercase font-bold block">Auto-Verify Confidence Bar (%): {threshold}</label>
            <input 
              type="range" 
              min="50" 
              max="95" 
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-450 uppercase font-bold block">GPS Jitter Threshold (Offset deg): {gpsOffset}</label>
            <input 
              type="text" 
              value={gpsOffset}
              onChange={(e) => setGpsOffset(parseFloat(e.target.value) || 0.005)}
              className="w-full bg-slate-955 p-2 rounded-xl outline-none focus:border-cyan-500 text-slate-200 font-mono text-xs border border-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-450 uppercase font-bold block">Express Node Sync Interval (sec): {syncDelay}</label>
            <input 
              type="number" 
              value={syncDelay}
              onChange={(e) => setSyncDelay(parseInt(e.target.value) || 5)}
              className="w-full bg-slate-955 p-2 rounded-xl outline-none focus:border-cyan-500 text-slate-200 font-mono text-xs border border-slate-800"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-slate-100 font-mono text-xs font-bold rounded-xl transition cursor-pointer select-none"
        >
          {success ? "✓ Security constraints locked in local storage!" : "Lock Security Constraints"}
        </button>
      </div>
    </div>
  );
}

export function MonitoringPanel() {
  const logEntries = [
    { epoch: "14:13:02", ip: "35.195.221.14", action: "POST /api/ai/dashboard-summary", code: "200 OK", size: "1.4kb" },
    { epoch: "14:12:45", ip: "35.195.221.14", action: "POST /api/ai/analyze-report", code: "201 Created", size: "840b" },
    { epoch: "14:10:12", ip: "109.22.45.166", action: "GET /api/health", code: "200 OK", size: "128b" },
    { epoch: "14:04:33", ip: "188.1.12.92", action: "POST /api/ai/translate", code: "200 OK", size: "620b" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-801 rounded-3xl p-6 shadow-2xl space-y-6 text-left">
      <div className="border-b border-slate-850 pb-3">
        <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span>Express Server API health & Diagnostics Logs</span>
        </h3>
        <p className="text-xs text-slate-400">Monitor live container latencies, active memory footprints, port 3000 ingress packets, and pipeline logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono text-xs text-slate-400">
        <div className="bg-slate-955 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[9px] text-slate-500 uppercase font-black">Express Node Port</span>
          <p className="text-lg font-black text-slate-100">3000 (Ingress)</p>
        </div>
        <div className="bg-slate-955 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[9px] text-slate-500 uppercase font-black">Memory Footprint</span>
          <p className="text-lg font-black text-emerald-400">54MB / 512MB</p>
        </div>
        <div className="bg-slate-955 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[9px] text-slate-500 uppercase font-black">Container CPU Load</span>
          <p className="text-lg font-black text-cyan-400">1.4% (Idle)</p>
        </div>
        <div className="bg-slate-955 p-3.5 border border-slate-850 rounded-xl space-y-1">
          <span className="text-[9px] text-slate-500 uppercase font-black">Network Latency</span>
          <p className="text-lg font-black text-slate-100">12ms (Direct)</p>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[9px] font-mono text-slate-450 uppercase font-bold block">Live Port 3000 Request Logs</span>
        <div className="overflow-x-auto rounded-xl border border-slate-850">
          <table className="w-full border-collapse font-mono text-[11px] text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-500 border-b border-slate-855 font-bold">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Source IP</th>
                <th className="p-3">Express Route Target</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payload Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-855 text-slate-400">
              {logEntries.map((log, index) => (
                <tr key={index} className="hover:bg-slate-955 transition">
                  <td className="p-3">{log.epoch}</td>
                  <td className="p-3 text-slate-500">{log.ip}</td>
                  <td className="p-3 text-cyan-400 font-bold">{log.action}</td>
                  <td className="p-3 text-emerald-450">{log.code}</td>
                  <td className="p-3 text-slate-500">{log.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
