import React, { useState, useEffect, useRef } from "react";
import { HazardReport, UserRole } from "../types";
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  Volume2, 
  VolumeX, 
  Terminal, 
  AlertTriangle, 
  Compass, 
  MapPin, 
  Check, 
  X, 
  Send, 
  Sparkles, 
  Activity, 
  ShieldAlert,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TelemetryConsoleProps {
  reports: HazardReport[];
  onAddReport: (report: HazardReport) => void;
  onUpdateReportStatus: (id: string, status: "Verified" | "Pending" | "Unverified") => void;
  selectedReportId: string | null;
  onSelectReportId: (id: string | null) => void;
  onNavigateTab: (tab: string) => void;
}

// Preset critical hazards representing incoming simulated satellite or emergency fleet reports
const SIMULATED_CRITICAL_PRESETS = [
  {
    title: "Major Oil Carrier Breach - Sector Delta-1",
    category: "oil_spill" as const,
    description: "A commercial chemical carrier has reported hull leakage of synthetic heavy lubricants. Sighted oil slick expanding over 3.5 square kilometers tracking toward Bataan seagrass coordinates.",
    latitude: 14.61,
    longitude: 120.18,
    locationName: "Sector Delta-1, Shoreward Trench Line",
    reportedBy: "SST Sentinel Satellite-7",
    reporterRole: "Authority" as UserRole,
    aiSummary: "Active chemical cargo oil slick expanding, speed 1.8 knots. High impact risk to local marine nature park."
  },
  {
    title: "Extreme Coral Bleaching Spreading Surge - Grid Echo",
    category: "coral_bleaching" as const,
    description: "Thermal drone flight records complete Acropora bleaching over 85% coverage area down to 12 meters. Local hydrothermal heat dome sustains extreme 32.1°C surface water anomaly.",
    latitude: 14.51,
    longitude: 120.32,
    locationName: "Zone Echo-9, South Pinnacle Flats",
    reportedBy: "M/V Hydrology Explorer",
    reporterRole: "Researcher" as UserRole,
    aiSummary: "Extreme 85% bleaching rate triggered by anomalous localized shallow sea surface hydrothermal thermal hotspot."
  },
  {
    title: "Illegal Industrial Ship Bottom-Trawling Detected - NW Marine Shelf",
    category: "illegal_fishing" as const,
    description: "Commercial pair-trawler group with deactivated maritime transponders logged dragging destructive weighted nets on critical sea turtle spawning beds inside the active marine sanctuary zone.",
    latitude: 14.75,
    longitude: 120.08,
    locationName: "Sector Alpha-4, Protected Spawning Grounds",
    reportedBy: "Guard Vessel Shield-12",
    reporterRole: "Authority" as UserRole,
    aiSummary: "Deactivated transponder commercial drag fleet. Actionable maritime intervention recommended."
  },
  {
    title: "Hazardous Toxic Red Algae Expansion Sighted",
    category: "toxic_algae" as const,
    description: "Sub-surface drone probes measure high Pyrodinium bahamense cell volume. Severe toxin levels logged near aquaculture oyster frameworks. Extreme toxicity hazard advisory requested.",
    latitude: 14.68,
    longitude: 120.28,
    locationName: "Sector Delta-9, Coastal Bay Fisheries",
    reportedBy: "Dr. Marj Navasca",
    reporterRole: "Researcher" as UserRole,
    aiSummary: "Critical toxicity values logged. Shellfish harvesting and swimming prohibition advisories triggered."
  }
];

export default function TelemetryConsole({
  reports,
  onAddReport,
  onUpdateReportStatus,
  selectedReportId,
  onSelectReportId,
  onNavigateTab
}: TelemetryConsoleProps) {
  // Transceiver state
  const [isOpen, setIsOpen] = useState(false);
  const [streamMode, setStreamMode] = useState<"socket" | "polling" | "static">("socket");
  const [isSimulatingFeed, setIsSimulatingFeed] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pollingRateSeconds, setPollingRateSeconds] = useState(12);
  const [lastCheckTime, setLastCheckTime] = useState<string>("SYSTEM START");
  const [connectionLatency, setConnectionLatency] = useState<number>(34);
  const [systemLogs, setSystemLogs] = useState<Array<{ time: string; source: string; text: string; type: "info" | "success" | "warning" | "error" }>>([
    { time: new Date().toLocaleTimeString(), source: "CONX", text: "OceanShield Security Port 3000 initialization complete.", type: "info" },
    { time: new Date().toLocaleTimeString(), source: "CONX", text: "Establishing secure multi-operator handshake protocol...", type: "info" },
    { time: new Date().toLocaleTimeString(), source: "WS", text: "WebSocket tunnel established securely with AIS Central (WSS://oceanshield.gov/telemetry_stream). Status: READY.", type: "success" }
  ]);

  // Toast notification state
  const [toasts, setToasts] = useState<Array<{ id: string; report: HazardReport; provider: "WebSocket" | "Polling Poll"; soundPlayed: boolean }>>([]);

  // Watcher ref to prevent double toast alerts for the same ID
  const toastedIdsRef = useRef<Set<string>>(new Set());
  const prevReportsLengthRef = useRef<number>(reports.length);

  // Play a sweet, harmonious dual-bell chime using native HTML5 Audio Synthesis
  const playWarningSynth = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq: number, delay: number, duration: number, maxGain: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(maxGain, ctx.currentTime + delay + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration - 0.01);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      // Play a beautiful, sweet "ding-dong" chime using harmonious frequencies (E5 and G#5)
      // First high sweet bell
      playTone(659.25, 0, 0.65, 0.06);     // E5 note
      // Second bell, slightly delayed, playing a sweet perfect third interval
      playTone(830.61, 0.12, 0.75, 0.05);  // G#5 note
      // A soft warm sub-octave tone for rich fidelity
      playTone(329.63, 0, 0.85, 0.03);     // E4 note
    } catch (err) {
      console.warn("Audio Context blocked or unsupported before user gesture:", err);
    }
  };

  const addLog = (source: string, text: string, type: "info" | "success" | "warning" | "error") => {
    setSystemLogs(prev => [
      { time: new Date().toLocaleTimeString(), source, text, type },
      ...prev.slice(0, 39) // limit to latest 40 messages to maintain clean virtual screen
    ]);
  };

  // Automated live simulation loop
  useEffect(() => {
    if (!isSimulatingFeed) return;

    let timerId: any = null;

    const runAutomatedTelemetryTick = () => {
      // Create random latency fluctuations for realism
      setConnectionLatency(prev => {
        const diff = Math.floor(Math.random() * 9) - 4;
        const next = prev + diff;
        return next < 15 ? 15 : (next > 120 ? 120 : next);
      });

      const randomChance = Math.random();
      
      if (streamMode === "socket") {
        // High frequency micro-updates
        const packetId = `0x${Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, "0")}`;
        
        if (randomChance < 0.22) {
          // Trigger a random simulated critical event as a live inbound socket packet!
          const preset = SIMULATED_CRITICAL_PRESETS[Math.floor(Math.random() * SIMULATED_CRITICAL_PRESETS.length)];
          const newId = `rep-sim-${Date.now().toString().substring(10)}`;
          
          const simReport: HazardReport = {
            id: newId,
            title: `[LIVE TELETECTOR] ${preset.title}`,
            category: preset.category,
            description: preset.description,
            latitude: Number((preset.latitude + (Math.random() * 0.04 - 0.02)).toFixed(4)),
            longitude: Number((preset.longitude + (Math.random() * 0.04 - 0.02)).toFixed(4)),
            locationName: preset.locationName,
            reportedBy: preset.reportedBy,
            reporterRole: preset.reporterRole,
            reportedAt: new Date().toISOString(),
            severity: "Critical",
            status: "Pending",
            confidence: Math.floor(65 + Math.random() * 30),
            images: [],
            aiSummary: preset.aiSummary,
            riskTrend: "Increasing"
          };

          addLog("WS", `⚡ RECEIVED packet ${packetId}: Critical telemetry trigger "${simReport.title}"!`, "warning");
          onAddReport(simReport);
        } else {
          // General heartbeat log
          addLog("WS", `✔ Connection heartbeat verified. Packet ${packetId} processed (0.00kb payload drop).`, "info");
        }
      } else if (streamMode === "polling") {
        // Polling loop
        const apiPath = `/api/telemetry/reports?severity=Critical&ts=${Date.now().toString().substring(8)}`;
        setLastCheckTime(new Date().toLocaleTimeString());

        if (randomChance < 0.28) {
          const preset = SIMULATED_CRITICAL_PRESETS[Math.floor(Math.random() * SIMULATED_CRITICAL_PRESETS.length)];
          const newId = `rep-sim-${Date.now().toString().substring(10)}`;
          
          const simReport: HazardReport = {
            id: newId,
            title: `[POLL DETECTED] ${preset.title}`,
            category: preset.category,
            description: preset.description,
            latitude: Number((preset.latitude + (Math.random() * 0.04 - 0.02)).toFixed(4)),
            longitude: Number((preset.longitude + (Math.random() * 0.04 - 0.02)).toFixed(4)),
            locationName: preset.locationName,
            reportedBy: preset.reportedBy,
            reporterRole: preset.reporterRole,
            reportedAt: new Date().toISOString(),
            severity: "Critical",
            status: "Pending",
            confidence: Math.floor(65 + Math.random() * 30),
            images: [],
            aiSummary: preset.aiSummary,
            riskTrend: "Increasing"
          };

          addLog("POLL", `✔ GET ${apiPath} 200 OK. Found 1 critical record!`, "success");
          onAddReport(simReport);
        } else {
          addLog("POLL", `✔ GET ${apiPath} 200 OK (0 cumulative changes detected).`, "info");
        }
      }

      // Re-schedule based on selected speed
      const nextDelay = streamMode === "socket" 
        ? (22000 + Math.random() * 15000) // socket updates every ~22-37s
        : (pollingRateSeconds * 1000); // Polling rate from input settings
        
      timerId = setTimeout(runAutomatedTelemetryTick, nextDelay);
    };

    // First trigger
    timerId = setTimeout(runAutomatedTelemetryTick, streamMode === "socket" ? 18000 : 8000);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isSimulatingFeed, streamMode, pollingRateSeconds]);

  // SYSTEM CENTRALIZED MONITOR: Watches BOTH real and simulated added reports for 'Critical' severity
  useEffect(() => {
    // If reports array grows or changes
    if (reports.length > 0) {
      // Find all Critical reports that haven't been toasted yet
      const unToastedCriticals = reports.filter(
        r => r.severity === "Critical" && !toastedIdsRef.current.has(r.id)
      );

      if (unToastedCriticals.length > 0) {
        // We have newly created critical records! Create beautiful toasts for them
        const newToastsToAdd = unToastedCriticals.map(report => {
          // Add to our globally tracked Set to prevent duplicate rendering
          toastedIdsRef.current.add(report.id);
          
          let providerLogo: "WebSocket" | "Polling Poll" = "WebSocket";
          if (streamMode === "polling" && report.title.includes("[POLL")) {
            providerLogo = "Polling Poll";
          } else if (report.id.startsWith("rep-sim-") && streamMode === "socket") {
            providerLogo = "WebSocket";
          } else {
            providerLogo = "WebSocket"; // Default or citizen logs as instant websocket
          }

          return {
            id: `toast-${report.id}-${Date.now()}`,
            report,
            provider: providerLogo,
            soundPlayed: false
          };
        });

        // Add them to our active toasts queue so they overlay on screen
        setToasts(prev => [...prev, ...newToastsToAdd]);

        // Synthesise the hazard warning tone!
        playWarningSynth();

        // Print to log screen
        unToastedCriticals.forEach(cf => {
          addLog("OVERWATCH", `🚨 EMERGENCY THREAT BROADCAST: "${cf.title}" is now active in active coordinates!`, "error");
        });
      }
    }
    prevReportsLengthRef.current = reports.length;
  }, [reports, streamMode]);

  // Mode changer logging
  useEffect(() => {
    addLog("SYS", `Uplink stream mode toggled to: ${streamMode.toUpperCase()}`, "info");
    if (streamMode === "static") {
      addLog("CONX", "Network standby. Simulated live data stream is on pause.", "warning");
    } else if (streamMode === "socket") {
      addLog("WS", "Reconnected live socket client to server port 3000 broadcast channel.", "success");
    } else {
      addLog("POLL", "Constructed immediate HTTP recurring short-polling loop.", "success");
    }
  }, [streamMode]);

  // Dismiss a specific toast notification
  const handleDismissToast = (toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  // Inspect sighting and refocus digital GIS map
  const handleInspectSighting = (reportId: string) => {
    onSelectReportId(reportId);
    onNavigateTab("map");
    // Pulse details or focus element
    addLog("USER", `Refocused satellite array coordinates to target report [${reportId}]`, "success");
  };

  // Immediate event generator for quick testing & evaluation
  const handleManualTriggerSimulated = (severity: "Critical" | "High") => {
    const preset = SIMULATED_CRITICAL_PRESETS[Math.floor(Math.random() * SIMULATED_CRITICAL_PRESETS.length)];
    const newId = `rep-sim-manual-${Date.now()}`;
    
    const manualReport: HazardReport = {
      id: newId,
      title: `[MANUAL EVENT FORCE] ${preset.title}`,
      category: preset.category,
      description: preset.description,
      latitude: Number((preset.latitude + (Math.random() * 0.03 - 0.015)).toFixed(4)),
      longitude: Number((preset.longitude + (Math.random() * 0.03 - 0.015)).toFixed(4)),
      locationName: preset.locationName,
      reportedBy: "COASTAL ENFORCEMENT TEAM",
      reporterRole: "Authority",
      reportedAt: new Date().toISOString(),
      severity: severity,
      status: "Pending",
      confidence: 100, // Manual force ensures high confidence
      images: [],
      aiSummary: "Incident forced by active operator. Authorized telemetry response dispatcher.",
      riskTrend: "Increasing"
    };

    addLog("CONSOLE", `🔥 FORCED telemetry packet injected (Severity: ${severity.toUpperCase()})`, "warning");
    onAddReport(manualReport);
  };

  return (
    <>
      {/* ================= TOAST NOTIFICATION STACK OVERLAY (MAX-INDEX TOP RIGHT) ================= */}
      <div 
        className="fixed top-20 right-4 z-[9999] flex flex-col gap-3.5 w-[380px] max-w-[calc(100vw-2rem)] select-none pointer-events-none"
        id="critical-toasts-viewport"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const r = toast.report;
            const categoryLabel = r.category.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 120, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95, y: -15 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="bg-slate-930/98 backdrop-blur-md rounded-2xl border border-red-500/30 dark:border-red-500/45 shadow-2xl overflow-hidden text-left flex flex-col pointer-events-auto h-auto relative"
              >
                {/* Visual red hazard banner */}
                <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 h-1.5 w-full shrink-0 relative">
                  <span className="absolute inset-0 bg-red-500 animate-pulse" />
                </div>

                <div className="p-4 space-y-3">
                  {/* Headline Info */}
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-black text-red-400 leading-none tracking-wider uppercase">
                          🚨 LIVE {r.severity.toUpperCase()} HAZARD LOGGED
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 leading-none mt-0.5">
                          via {toast.provider} Stream • {new Date(r.reportedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDismissToast(toast.id)}
                      className="p-1 text-slate-550 hover:text-slate-350 hover:bg-slate-850/50 rounded-lg transition-colors cursor-pointer"
                      title="Mute Alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-1.5 text-left">
                    <h4 className="text-[12.5px] font-extrabold text-slate-100 tracking-tight leading-snug">
                      {r.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-h-16 overflow-y-auto pr-1">
                      {r.description}
                    </p>
                  </div>

                  {/* Grid geographical coordinate tag / category */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-300 font-mono font-bold text-[9px] rounded uppercase">
                      {categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-450 font-mono text-[9px] rounded flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{r.latitude.toFixed(3)}, {r.longitude.toFixed(3)}</span>
                    </span>
                    <span className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/10 text-cyan-400 font-mono text-[9px] rounded uppercase">
                      CONF: {r.confidence}%
                    </span>
                  </div>

                  {/* Action Button Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-850">
                    <button
                      onClick={() => handleInspectSighting(r.id)}
                      className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg font-bold text-[10.5px] tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Compass className="w-3 h-3 text-cyan-400" />
                      <span>Inspect Map</span>
                    </button>

                    <button
                      onClick={() => {
                        onUpdateReportStatus(r.id, "Verified");
                        handleDismissToast(toast.id);
                        addLog("HQ", `Sighting ${r.id} instantly verified via active telemetry toast control.`, "success");
                      }}
                      className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg font-bold text-[10.5px] tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>HQ Verify</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ================= FLOATING LAUNCH CAPSULE (BOTTOM RIGHT CORNER) ================= */}
      <div 
        className="fixed bottom-4 right-4 z-[9990] flex flex-col items-end"
        id="telemetry-console-wrapper"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-950/98 backdrop-blur-md rounded-[2rem] border border-slate-850 shadow-2xl w-96 max-w-[calc(100vw-2rem)] flex flex-col overflow-hidden mb-3 relative text-left"
            >
              {/* Header block with network grid backdrops */}
              <div className="p-4 bg-slate-900 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${streamMode === "static" ? "bg-amber-500" : "bg-emerald-400 animate-ping mr-1"} shrink-0`} />
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                      <span>Telemetry Tele-Receiver</span>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-1 border border-cyan-900/40 rounded uppercase font-normal">
                        v2.4
                      </span>
                    </h3>
                    <p className="text-[9.5px] text-slate-500 leading-none">
                      {streamMode === "socket" ? `WebSocket secure broadcast (Active: ${connectionLatency}ms)` : `Short polling stream • Int: ${pollingRateSeconds}s`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Sound on/off button */}
                  <button
                    onClick={() => setSoundEnabled(prev => !prev)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${soundEnabled ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20" : "bg-slate-900 text-slate-500 hover:text-slate-400"}`}
                    title={soundEnabled ? "Mute alert sounds" : "Enable alert sounds"}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Console Workspace Content */}
              <div className="p-4.5 space-y-4 max-h-[380px] overflow-y-auto scrollbar-thin">
                
                {/* Mode Selector Strip */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-mono font-bold text-slate-550 uppercase">STREAM TUNNEL SELECT:</span>
                    <span className="text-[9.5px] font-mono text-[#ff7a70]">{streamMode === "socket" ? "⚡ WEBSOCKET ACTIVE" : streamMode === "polling" ? "⚡ HTTP SHORT-POLL" : "☕ STATION STATIC"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-slate-940 p-1.0 rounded-xl border border-slate-900">
                    <button
                      onClick={() => setStreamMode("socket")}
                      className={`py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${streamMode === "socket" ? "bg-cyan-500/10 border border-cyan-500/35 text-cyan-400" : "text-slate-500 hover:text-slate-350"}`}
                    >
                      Sockets
                    </button>
                    <button
                      onClick={() => setStreamMode("polling")}
                      className={`py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${streamMode === "polling" ? "bg-amber-500/10 border border-amber-500/35 text-amber-400" : "text-slate-500 hover:text-slate-355"}`}
                    >
                      Polling
                    </button>
                    <button
                      onClick={() => setStreamMode("static")}
                      className={`py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${streamMode === "static" ? "bg-slate-800 border border-slate-700 text-slate-300" : "text-slate-500 hover:text-slate-355"}`}
                    >
                      Standby
                    </button>
                  </div>
                </div>

                {/* Polling custom settings display */}
                {streamMode === "polling" && (
                  <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-450">Short-Polling Frequency:</span>
                      <span className="font-mono text-cyan-405 font-bold">{pollingRateSeconds} seconds</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={45}
                      value={pollingRateSeconds}
                      onChange={(e) => setPollingRateSeconds(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1 rounded"
                    />
                    <div className="flex justify-between text-[8.5px] text-slate-500 font-mono">
                      <span>5s (FAST)</span>
                      <span>LAST CHECK: {lastCheckTime}</span>
                      <span>45s (SLOW)</span>
                    </div>
                  </div>
                )}

                {/* Automation trigger switches */}
                <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-xl">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-200 block leading-none">Automate Virtual Operators</span>
                    <span className="text-[8.5px] text-slate-500 mt-0.5 block leading-none">Simulates coastal reports periodically</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsSimulatingFeed(prev => !prev);
                      addLog("SYS", `Automatic simulation stream toggled ${!isSimulatingFeed ? "ON" : "OFF"}`, "info");
                    }}
                    className={`px-2.5 py-1 rounded text-[9.5px] font-mono tracking-wider font-bold tracking-widest uppercase transition cursor-pointer ${isSimulatingFeed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-slate-950 text-slate-500 border border-slate-850"}`}
                  >
                    {isSimulatingFeed ? "ONLINE" : "OFFLINE"}
                  </button>
                </div>

                {/* INSTANT EVALUATION ACTION BOX (Perfect for testing!) */}
                <div className="space-y-1.5">
                  <span className="text-[9.5px] font-mono font-bold text-slate-550 uppercase">FORCE EVENT INJECTION (TEST HARNESS):</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleManualTriggerSimulated("Critical")}
                      className="py-2 px-3 bg-[#ff7a70]/10 hover:bg-[#ff7a70]/20 text-[#ff7a70] border border-[#ff7a70]/25 rounded-xl font-bold text-[10px] tracking-wide uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
                      title="Simulates a foreign carrier or satellite finding a Critical hazard"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                      <span>Trigger Critical</span>
                    </button>

                    <button
                      onClick={() => handleManualTriggerSimulated("High")}
                      className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 rounded-xl font-bold text-[10px] tracking-wide uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
                      title="Simulates a High severity event"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Trigger High</span>
                    </button>
                  </div>
                </div>

                {/* Live Real-time Terminal Log Screen */}
                <div className="space-y-1.5 flex flex-col items-stretch">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-mono font-bold text-slate-550 uppercase flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>LIVE TERMINAL BROADCAST FEED</span>
                    </span>
                    <button
                      onClick={() => setSystemLogs([])}
                      className="text-[8.5px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
                    >
                      Clear Screen
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-2xl border border-slate-900 p-2.5 h-36 overflow-y-auto font-mono text-[9px] text-left leading-relaxed space-y-1.5 select-text selection:bg-slate-800">
                    {systemLogs.length === 0 ? (
                      <div className="text-slate-600 italic text-center py-10 text-[9.5px]">No telemetry logged. Trigger simulation on top or wait.</div>
                    ) : (
                      systemLogs.map((log, i) => {
                        let col = "text-slate-400";
                        if (log.type === "success") col = "text-emerald-400";
                        else if (log.type === "warning") col = "text-[#ff7a70] font-bold";
                        else if (log.type === "error") col = "text-red-405 font-bold animate-pulse";
                        
                        return (
                          <div key={i} className="border-b border-slate-900 pb-1 last:border-0">
                            <span className="text-slate-600 mr-1.5">[{log.time}]</span>
                            <span className="text-cyan-450 mr-1.5 font-bold">[{log.source}]</span>
                            <span className={col}>{log.text}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small floating button pill */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`px-5 py-3 rounded-full bg-slate-900 border ${toasts.length > 0 ? "border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse" : "border-slate-800 text-slate-100 hover:text-cyan-400 shadow-xl"} font-extrabold text-[11px] tracking-wider uppercase transition active:scale-95 cursor-pointer flex items-center justify-center gap-2`}
        >
          {toasts.length > 0 ? (
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
          ) : (
            <div className={`w-1.5 h-1.5 rounded-full ${streamMode === "static" ? "bg-amber-500" : "bg-emerald-400 animate-pulse"}`} />
          )}
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: isOpen ? "12s" : "3s" }} />
          <span>Telemetry Stream ({streamMode.toUpperCase()})</span>
          {toasts.length > 0 && (
            <span className="px-1.5 py-0.2 bg-red-650 text-white rounded-full text-[8.5px] font-mono leading-none font-black animate-bounce shrink-0">
              {toasts.length}
            </span>
          )}
          {isOpen ? <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" /> : <ChevronUp className="w-3 h-3 text-slate-500 shrink-0" />}
        </button>
      </div>
    </>
  );
}
