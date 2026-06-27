import React, { useState, useEffect } from "react";
import { HazardReport, User, UserRole, VerificationStatus } from "../types";
import { ShieldCheck, ShieldAlert, Sparkles, MapPin, Calendar, Check, MessageSquare, Send, Trash, Eye, ArrowLeft, Clock, Camera } from "lucide-react";
import { formatDateTimeUTC } from "../utils/translations";

interface Comment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

interface ReportDetailsProps {
  report: HazardReport;
  currentUser: User | null;
  onBack: () => void;
  onUpdateStatus: (id: string, status: VerificationStatus, confidenceBoost?: number) => void;
  onDeleteReport: (id: string) => void;
}

export default function ReportDetails({
  report,
  currentUser,
  onBack,
  onUpdateStatus,
  onDeleteReport,
}: ReportDetailsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [auditNote, setAuditNote] = useState("");
  const [auditLogs, setAuditLogs] = useState<{ time: string; text: string }[]>([]);

  // Load comments & audit logs for this specific report from localStorage
  useEffect(() => {
    const cachedComments = localStorage.getItem(`oceanshield_comments_${report.id}`);
    if (cachedComments) {
      try {
        setComments(JSON.parse(cachedComments));
      } catch (e) {
        setComments([]);
      }
    } else {
      // Seed default comments
      const seed: Comment[] = [
        {
          id: `c-1`,
          authorName: "Researcher Dr. Evelyn Chen",
          authorRole: "Researcher",
          text: "Thermal anomalies in Sector A-2 match our satellite sea-surface temperature spikes (+1.8°C above seasonal baseline). Corals are definitely stressed.",
          createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `c-2`,
          authorName: "Captain Marcus",
          authorRole: "Authority",
          text: "Coastal patrol vessel dispatched to measure fuel viscosity levels. Active boom containment kits prepared.",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      setComments(seed);
      localStorage.setItem(`oceanshield_comments_${report.id}`, JSON.stringify(seed));
    }

    const cachedAudits = localStorage.getItem(`oceanshield_audits_${report.id}`);
    if (cachedAudits) {
      try {
        setAuditLogs(JSON.parse(cachedAudits));
      } catch (e) {
        setAuditLogs([]);
      }
    } else {
      const seedAudits = [
        { time: new Date(report.reportedAt).toISOString(), text: `Incident logged into database by ${report.reportedBy}` },
        { time: new Date(new Date(report.reportedAt).getTime() + 60000).toISOString(), text: `AI telemetry scanner completed. Calculated confidence: ${report.confidence}%` }
      ];
      setAuditLogs(seedAudits);
      localStorage.setItem(`oceanshield_audits_${report.id}`, JSON.stringify(seedAudits));
    }
  }, [report.id, report.reportedAt, report.reportedBy, report.confidence]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: `comment-${Date.now()}`,
      authorName: currentUser ? currentUser.name : "Guest Sighting Observer",
      authorRole: currentUser ? currentUser.role : "Citizen",
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    const updated = [...comments, added];
    setComments(updated);
    localStorage.setItem(`oceanshield_comments_${report.id}`, JSON.stringify(updated));
    setNewComment("");
  };

  const handleUpdateStatusWithAudit = (newStatus: VerificationStatus) => {
    const noteText = auditNote.trim() ? ` - "${auditNote}"` : "";
    const logEntry = {
      time: new Date().toISOString(),
      text: `Status updated to [${newStatus}] by ${currentUser?.name || "Authority"}${noteText}`,
    };

    const updatedLogs = [logEntry, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem(`oceanshield_audits_${report.id}`, JSON.stringify(updatedLogs));

    // Boost confidence if verified
    const boost = newStatus === "Verified" ? 100 : newStatus === "Unverified" ? 25 : report.confidence;
    onUpdateStatus(report.id, newStatus, boost);
    setAuditNote("");
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "oil_spill": return "#ef4444";
      case "coral_bleaching": return "#f59e0b";
      case "illegal_fishing": return "#10b981";
      case "toxic_algae": return "#ec4899";
      case "severe_weather": return "#0284c7";
      case "marine_debris": return "#64748b";
      default: return "#38bdf8";
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "Critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/10";
    }
  };

  const hasCredentials = currentUser && (currentUser.role === "Admin" || currentUser.role === "Authority" || currentUser.role === "Researcher");

  return (
    <div className="space-y-6 text-left" id="incident-drilled-details">
      
      {/* Return Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-cyan-400 font-bold text-xs text-slate-350 rounded-xl transition cursor-pointer select-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Monitoring Control</span>
      </button>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Incident info, Evidence, Comments (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-slate-900 border border-slate-820 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: getCategoryColor(report.category) }} />
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-850">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-black text-slate-100" style={{ backgroundColor: `${getCategoryColor(report.category)}25`, color: getCategoryColor(report.category), border: `1px solid ${getCategoryColor(report.category)}35` }}>
                  {report.category.replace("_", " ").toUpperCase()}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${getSeverityBadge(report.severity)}`}>
                  {report.severity.toUpperCase()} THREAT
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  report.status === "Verified" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  report.status === "Unverified" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                  "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}>
                  {report.status.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDateTimeUTC(report.reportedAt)}
              </span>
            </div>

            <div className="space-y-4 mt-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-heading tracking-tight leading-tight">
                {report.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Sector: {report.locationName}
                </span>
                <span>•</span>
                <span>LAT/LNG: {report.latitude.toFixed(4)}°N, {report.longitude.toFixed(4)}°E</span>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-850">
                <span className="text-[10px] font-bold font-mono text-slate-500 block uppercase tracking-wider mb-2">
                  TACTICAL INCIDENT INTEL STATEMENT
                </span>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {report.description}
                </p>
              </div>
            </div>
            
            {/* Reporter bio metadata */}
            <div className="mt-5 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400 font-sans">
              <span>Report filed originally by: <strong className="text-slate-200">{report.reportedBy}</strong> ({report.reporterRole})</span>
              <span className="text-[10px] font-mono bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-cyan-400">CREDIBILITY SCORE: {report.confidence}%</span>
            </div>
          </div>

          {/* Evidence Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm font-heading uppercase tracking-wide flex items-center gap-2">
              <Camera className="w-4.5 h-4.5 text-cyan-400" />
              <span>GEOPHYSICAL EVIDENCE ATTACHMENTS</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Radar sketch plume canvas drawing */}
              <div className="space-y-2 bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <span className="text-[10px] font-bold font-mono text-slate-400 block uppercase">
                  RADAR VECTOR PLUME DRAWING
                </span>
                <div className="h-44 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center relative">
                  {report.images.length > 0 && report.images[0].startsWith("data:image") ? (
                    <img
                      src={report.images[0]}
                      alt="Radar contour drawing"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center font-mono opacity-40 text-[10px] text-slate-500 p-4">
                      No customized plume mapped on system coordinate grid during file dispatch
                    </div>
                  )}
                </div>
              </div>

              {/* Uploaded Field Photo mock */}
              <div className="space-y-2 bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <span className="text-[10px] font-bold font-mono text-slate-400 block uppercase">
                  CAPTURED LIVE FIELD EVIDENTIARY SATELLITE PHOTO
                </span>
                <div className="h-44 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center relative">
                  {report.images.length > 1 || (report.images.length === 1 && !report.images[0].startsWith("data:image")) ? (
                    <img
                      src={report.images[1] || report.images[0]}
                      alt="Local field sighting"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center w-full h-full flex flex-col items-center justify-center font-sans p-4 space-y-1.5">
                      {/* Show appropriate visual placeholders matching the category! */}
                      {report.category === "oil_spill" ? (
                        <div className="text-center space-y-2">
                          <span className="text-4xl">⚓</span>
                          <span className="text-slate-500 font-mono text-[9px] block uppercase">No field photo attached, showing incident radar mask</span>
                        </div>
                      ) : report.category === "coral_bleaching" ? (
                        <div className="text-center space-y-2">
                          <span className="text-4xl">🪸</span>
                          <span className="text-slate-500 font-mono text-[9px] block uppercase">No field photo attached, showing incident radar mask</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <span className="text-4xl">🌊</span>
                          <span className="text-slate-500 font-mono text-[9px] block uppercase font-mono">No field photo attached, showing incident radar mask</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Comments Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm font-heading uppercase tracking-wide flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
              <span>COASTAL CONVERSATION HUB ({comments.length} Logged)</span>
            </h3>

            {/* List existing comments */}
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {comments.map((comm) => (
                <div key={comm.id} className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div>
                      <strong className="text-slate-200">{comm.authorName}</strong>
                      <span className="text-[9px] px-1.5 py-0.2 ml-2 bg-slate-900 rounded text-sky-400 border border-slate-800 font-bold uppercase">
                        {comm.authorRole}
                      </span>
                    </div>
                    <span>{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">{comm.text}</p>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6 font-mono">
                  No active operator discussions logged. Formulate a post below.
                </p>
              )}
            </div>

            {/* Submition Form */}
            <form onSubmit={handleAddComment} className="flex gap-2.5">
              <input
                type="text"
                placeholder={currentUser ? "Identify threat patterns or request deployment crew..." : "Log in to join active discussions..."}
                disabled={!currentUser}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-cyan-500 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || !currentUser}
                className="bg-cyan-500 hover:bg-cyan-600 active:scale-95 disabled:opacity-45 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition cursor-pointer select-none flex items-center gap-1 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right column: AI Scanner review + Status Controls + Audit logs timeline (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Automated Review card */}
          <div className="bg-glass rounded-2xl p-5 border border-cyan-500/20 space-y-3.5 relative overflow-hidden">
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <h4 className="font-bold text-teal-400 text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI INTEGRITY DIAGNOSTICS</span>
            </h4>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1">
                <span className="text-[9px] text-slate-500 block font-mono">AUTONOMOUS RISK ASSESSMENT</span>
                <span className="text-xs font-bold text-slate-200">
                  {report.severity === "Critical" || report.severity === "High" ? "HIGH RISK HAZARD LEVEL DETECTED" : "ELEVATED CONGESTION THREAT"}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed italic">
                  "{report.aiSummary || "AI verified active marine plume matching regional distress standards."}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-[8px] text-slate-500 block uppercase">CONFIDENCE INDICATOR</span>
                  <strong className="text-emerald-400 font-black tracking-widest text-base">{report.confidence}%</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-[8px] text-slate-500 block uppercase">RISK TREND</span>
                  <strong className="text-cyan-400 font-black tracking-widest uppercase text-base">{report.riskTrend || "Increasing"}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Status Verification controls (RESTRICTED TO ADMIN/AUTHORITY/RESEARCHER) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-slate-100 text-xs font-mono tracking-wider uppercase">
              COAST GUARD AUTHORIZATION PLATFORM
            </h4>

            {hasCredentials ? (
              <div className="space-y-3.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatusWithAudit("Verified")}
                    className={`flex-1 py-2 rounded-xl font-bold text-[11px] border font-mono transition cursor-pointer select-none ${
                      report.status === "Verified"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-emerald-400"
                    }`}
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleUpdateStatusWithAudit("Pending")}
                    className={`flex-1 py-2 rounded-xl font-bold text-[11px] border font-mono transition cursor-pointer select-none ${
                      report.status === "Pending"
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-amber-500"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatusWithAudit("Unverified")}
                    className={`flex-1 py-2 rounded-xl font-bold text-[11px] border font-mono transition cursor-pointer select-none ${
                      report.status === "Unverified"
                        ? "bg-red-500/20 border-red-500/40 text-red-300"
                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-red-400"
                    }`}
                  >
                    Dismiss
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                    Add Verification Auditor Note *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Confirmed with coastal satellite photography..."
                    value={auditNote}
                    onChange={(e) => setAuditNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                  />
                  <p className="text-[9px] text-slate-500 leading-normal">
                    This message logs instantly into the un-alterable blockchain dispatch ledger visible below.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2">
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  🚨 Your operator profile is currently restricted from signing off verification. Elevate clearance to Authority or Admin to activate live overrides.
                </p>
              </div>
            )}
          </div>

          {/* Incident Timeline Ledger (Phase 7) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-slate-100 text-xs font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>INCIDENT HISTORY TIMELINE</span>
            </h4>

            <div className="relative pl-5 border-l border-slate-800 space-y-4 text-xs">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full border border-slate-950 bg-cyan-400" />
                  
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-500 block">
                      {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
                    </span>
                    <p className="text-slate-300 font-sans tracking-wide leading-relaxed font-medium">
                      {log.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
