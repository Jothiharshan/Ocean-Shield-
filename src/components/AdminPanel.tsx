import React, { useState } from "react";
import { HazardReport, ActiveAlert, HazardCategory, SeverityLevel, VerificationStatus } from "../types";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckSquare, Trash, Volume2, Plus, Info, Clock, Check, X } from "lucide-react";
import { formatDateTimeUTC } from "../utils/translations";

interface AdminPanelProps {
  reports: HazardReport[];
  alerts: ActiveAlert[];
  onUpdateReportStatus: (id: string, status: VerificationStatus, confidenceBoost?: number) => void;
  onDeleteReport: (id: string) => void;
  onAddAlert: (alert: ActiveAlert) => void;
  onDeleteAlert: (id: string) => void;
}

export default function AdminPanel({
  reports,
  alerts,
  onUpdateReportStatus,
  onDeleteReport,
  onAddAlert,
  onDeleteAlert,
}: AdminPanelProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [elevatedReportId, setElevatedReportId] = useState<string | null>(null);

  // Form states for creating a new Alert from a Report
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDesc, setAlertDesc] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<SeverityLevel>("High");
  const [alertRadius, setAlertRadius] = useState<number>(10);
  const [alertHours, setAlertHours] = useState<number>(48);

  const getCategoryLabel = (category: HazardCategory) => {
    return category.replace("_", " ").toUpperCase();
  };

  const getSeverityBgColor = (sev: SeverityLevel) => {
    switch (sev) {
      case "Critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Low": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const handleOpenElevate = (report: HazardReport) => {
    setElevatedReportId(report.id);
    setAlertTitle(`ALERT PROTOCOL: ${report.title}`);
    setAlertDesc(`Verified incident of ${report.category.replace("_", " ")} reported near ${report.locationName}. High hazard alert issued for all commercial vessels operating in this water grid sector.`);
    setAlertSeverity(report.severity);
  };

  const submitElevatedAlert = (e: React.FormEvent, report: HazardReport) => {
    e.preventDefault();

    const newAlert: ActiveAlert = {
      id: `alert-${Date.now()}`,
      title: alertTitle,
      description: alertDesc,
      category: report.category,
      severity: alertSeverity,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + alertHours * 60 * 60 * 1000).toISOString(),
      affectedCoordinates: {
        lat: report.latitude,
        lng: report.longitude,
        radiusKm: alertRadius,
      },
      verifiedBy: `Coast Guard HQ (Verified via Admin Command-Portal)`,
    };

    onAddAlert(newAlert);
    // Mark as verified on alert release
    onUpdateReportStatus(report.id, "Verified", 100);
    setElevatedReportId(null);
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      {/* Top dashboard summary header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400 uppercase tracking-widest font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OPERATIONAL SECURITY CONTROL PORTAL</span>
          </div>
          <h3 className="font-semibold text-slate-100 font-sans mt-0.5">MARITIME DISPATCH COMMAND</h3>
        </div>

        {/* Status filters */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
          {["all", "Pending", "Verified", "Unverified"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs rounded-lg transition font-sans cursor-pointer ${
                filterStatus === status
                  ? "bg-slate-800 text-slate-100 font-medium"
                  : "text-slate-500 hover:text-slate-350"
              }`}
            >
              {status === "all" ? "All Queue" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main content splitter (Active alerts list + Report queue router) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Verification Pipeline: 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          <span className="block text-xs font-semibold text-slate-400 uppercase font-mono">
            Citizen Sighting Pipeline ({filteredReports.length} in view)
          </span>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 relative group transition hover:border-slate-800"
              >
                {/* Header detail */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] px-2 py-0.2 uppercase rounded-md font-bold font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/20">
                        {getCategoryLabel(report.category)}
                      </span>
                      <span className={`text-[9px] px-2 py-0.2 rounded border font-mono font-bold ${getSeverityBgColor(report.severity)}`}>
                        {report.severity.toUpperCase()}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                        report.status === "Verified"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : report.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <h4 className="text-slate-200 font-medium text-sm mt-1.5">
                      {report.title}
                    </h4>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onDeleteReport(report.id)}
                      className="p-1.5 bg-slate-900 border border-slate-800 hover:border-red-950 text-slate-400 hover:text-red-400 rounded-lg transition cursor-pointer"
                      title="Purge faulty report"
                      id={`admin-btn-delete-${report.id}`}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {report.description}
                </p>

                {/* AI generated Summary block */}
                {report.aiSummary && (
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 text-[11px] text-slate-350 italic">
                    <span className="font-bold text-emerald-400 not-italic block font-mono text-[9px] mb-0.5">AI DISPATCH BRIEF:</span>
                    " {report.aiSummary} "
                  </div>
                )}

                {/* Sub row stats */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                  <div>
                    <span>REPORTER:</span> <span className="text-slate-300">{report.reportedBy} ({report.reporterRole})</span>
                  </div>
                  <div>
                    <span>COORDINATES:</span> <span className="text-slate-350 font-sans">{report.latitude.toFixed(4)}°N, {report.longitude.toFixed(4)}°E</span>
                  </div>
                  <div>
                    <span>CONFIDENCE:</span> <span className="text-cyan-400">{report.confidence}%</span>
                  </div>
                </div>

                {/* Operational control overlay */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-900">
                  <div className="flex items-center gap-1">
                    {report.status !== "Verified" && (
                      <button
                        onClick={() => onUpdateReportStatus(report.id, "Verified", 15)}
                        className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer"
                        id={`admin-btn-verify-${report.id}`}
                      >
                        <Check className="w-3 h-3" /> Approve Authenticity
                      </button>
                    )}
                    {report.status !== "Unverified" && (
                      <button
                        onClick={() => onUpdateReportStatus(report.id, "Unverified")}
                        className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer"
                        id={`admin-btn-reject-${report.id}`}
                      >
                        <X className="w-3 h-3" /> Dismiss Incident
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenElevate(report)}
                    className="flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer"
                    id={`admin-btn-broadcast-${report.id}`}
                  >
                    <Volume2 className="w-3 h-3" /> Elevate to Active Broadcast
                  </button>
                </div>

                {/* Sub drawer to elevate into public alert map broadcast */}
                {elevatedReportId === report.id && (
                  <form
                    onSubmit={(e) => submitElevatedAlert(e, report)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-3 space-y-3 animate-in slide-in-from-top-1.5 duration-200"
                  >
                    <span className="block text-[9px] font-black font-mono text-orange-400 uppercase tracking-widest">
                      BROADCAST BULLETIN PROTOCOL DEPLOYMENT
                    </span>

                    <div>
                      <label className="block text-[9px] text-slate-500 font-mono uppercase mb-0.5">Broadcast Subject</label>
                      <input
                        type="text"
                        required
                        value={alertTitle}
                        onChange={(e) => setAlertTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-500 font-mono uppercase mb-0.5">Instruction Brief</label>
                      <textarea
                        required
                        rows={2}
                        value={alertDesc}
                        onChange={(e) => setAlertDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 font-mono uppercase mb-0.5">Danger Radius (Km)</label>
                        <input
                          type="number"
                          value={alertRadius}
                          onChange={(e) => setAlertRadius(parseInt(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 font-mono uppercase mb-0.5">Hours Active</label>
                        <input
                          type="number"
                          value={alertHours}
                          onChange={(e) => setAlertHours(parseInt(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 font-mono uppercase mb-0.5">Severity</label>
                        <select
                          value={alertSeverity}
                          onChange={(e) => setAlertSeverity(e.target.value as SeverityLevel)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none cursor-pointer"
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setElevatedReportId(null)}
                        className="px-2.5 py-1 text-[10px] text-slate-400 bg-slate-950 border border-slate-850 rounded hover:text-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-[10px] text-white bg-orange-600 hover:bg-orange-700 font-bold rounded cursor-pointer transition flex items-center gap-1"
                        id="admin-btn-confirm-alert"
                      >
                        📢 DEPLOY GLOBAL broadcast
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}

            {filteredReports.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-10">
                No tickets matching status category "{filterStatus}" found in queue.
              </p>
            )}
          </div>
        </div>

        {/* Global Broadcast bulletins list: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <span className="block text-xs font-semibold text-slate-400 uppercase font-mono">
            Active Broadcasts Block ({alerts.length})
          </span>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950 border border-orange-950/30 rounded-xl p-3.5 space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-orange-400 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                    <span>EMERGENCY BEACON ACTIVATED</span>
                  </div>

                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-1 bg-slate-900 border border-slate-850 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition cursor-pointer"
                    id={`admin-btn-delete-alert-${alert.id}`}
                    title="Recall Broadcast Alert"
                  >
                    Recall
                  </button>
                </div>

                <h5 className="font-semibold text-slate-200 text-xs">{alert.title}</h5>
                <p className="text-[11px] text-slate-450 leading-relaxed">{alert.description}</p>

                <div className="pt-1.5 border-t border-slate-900 text-[9px] text-slate-500 font-mono space-y-0.5">
                  <div>RADIUS: <span className="text-slate-350">{alert.affectedCoordinates.radiusKm} KM</span></div>
                  <div>EXPIRES: <span className="text-slate-350">{formatDateTimeUTC(alert.expiresAt)}</span></div>
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <p className="text-xs text-slate-600 text-center py-10 bg-slate-950 rounded-xl border border-slate-850">
                No active public broadcasting signals online.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
