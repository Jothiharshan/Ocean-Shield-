import React, { useState, useEffect } from "react";
import { User, HazardReport, ActiveAlert, VerificationStatus, HazardCategory, UserRole } from "./types";
import { INITIAL_HAZARD_REPORTS, INITIAL_ALERTS, MOCK_SOCIAL_TRENDS, MAP_GRID_CELLS } from "./mockData";
import AuthScreen from "./components/AuthScreen";
import MarineGISMap from "./components/MarineGISMap";
import ReportingForm from "./components/ReportingForm";
import SocialAnalytics from "./components/SocialAnalytics";
import ChatAssistant from "./components/ChatAssistant";
import AdminPanel from "./components/AdminPanel";
import ReportDetails from "./components/ReportDetails";
import ImpactPage from "./components/ImpactPage";
import IntegratedWorkspaces from "./components/workspaces/IntegratedWorkspaces";
import {
  CitizenDashboard,
  FishermanDashboard,
  ResearcherDashboard,
  AuthorityDashboard,
  AdminDashboard,
  UsersAdminPanel,
  AIConfigPanel,
  SafeZonesPanel,
  ExportDataPanel,
  InsightsPanel,
  SettingsPanel,
  MonitoringPanel
} from "./components/RoleDashboards";
import {
  Compass,
  AlertTriangle,
  FileText,
  Activity,
  Heart,
  UserCheck,
  Bot,
  Layers,
  ChevronRight,
  LogOut,
  Map,
  MapPin,
  Calendar,
  Sparkles,
  Lock,
  Database,
  ShieldCheck,
  Sun,
  Moon,
  Home,
  MessageSquare,
  TrendingUp,
  BarChart2,
  PieChart,
  Grid,
  Menu,
  Cpu,
  X,
  Trash,
  Check
} from "lucide-react";

export default function App() {
  // Mobile responsive sidebar open/close state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Session Authentication status (Defaults to Jothi Harshan D K to show high-fidelity Landing/Authorize portal)
  const [sessionUser, setSessionUser] = useState<User | null>(() => {
    const cachedUser = localStorage.getItem("oceanshield_session_user");
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        // Fallback
      }
    }
    const defaultUser: User = {
      id: "usr-guest-2026",
      name: "Jothi Harshan D K",
      email: "jothi@oceanshield.org",
      role: "Citizen",
      organization: "Coastal Safeguard Guild"
    };
    return defaultUser;
  });

  // Active theme color mode (Ocean dark or Sunlight light)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const cachedTheme = localStorage.getItem("oceanshield_theme") as "dark" | "light" | null;
    return cachedTheme || "dark";
  });

  const getNavItems = () => {
    const role = sessionUser?.role || "Citizen";

    if (role === "Citizen") {
      return [
        { id: "dashboard", label: "Citizen Dashboard", icon: Grid },
        { id: "expert_gis", label: "Expert Workspaces", icon: Map },
        { id: "report", label: "Report Hazard", icon: FileText },
        { id: "profile", label: "My Reports & Profile", icon: UserCheck },
        { id: "alerts", label: "Alerts & Dispatches", icon: AlertTriangle },
        { id: "assistant", label: "AI Assistant", icon: Bot },
      ];
    }
    if (role === "Fisherman") {
      return [
        { id: "dashboard", label: "Fisherman Dashboard", icon: Grid },
        { id: "expert_gis", label: "Expert Workspaces", icon: Map },
        { id: "safezones", label: "Safe Zones", icon: Compass },
        { id: "map", label: "Ocean Map", icon: Layers },
        { id: "alerts", label: "Hazard Alerts", icon: AlertTriangle },
        { id: "report", label: "Report Hazard", icon: FileText },
        { id: "assistant", label: "AI Assistant", icon: Bot },
      ];
    }
    if (role === "Researcher") {
      return [
        { id: "dashboard", label: "Researcher Dashboard", icon: Grid },
        { id: "expert_gis", label: "Expert Workspaces", icon: Map },
        { id: "analytics", label: "Analytics Trends", icon: Activity },
        { id: "safezones", label: "Heatmaps Viewer", icon: Layers },
        { id: "export", label: "Export Raw Data", icon: Database },
        { id: "reports", label: "Logged Reports", icon: FileText },
        { id: "insights", label: "Science Insights", icon: Sparkles },
      ];
    }
    if (role === "Authority") {
      return [
        { id: "dashboard", label: "Authority Dashboard", icon: Grid },
        { id: "expert_gis", label: "Expert Workspaces", icon: Map },
        { id: "verification", label: "Verification Queue", icon: ShieldCheck },
        { id: "alerts", label: "Issue Advisories", icon: AlertTriangle },
        { id: "map", label: "GIS Patrol Map", icon: Layers },
        { id: "impact", label: "Impact Metrics", icon: Heart },
      ];
    }
    if (role === "Admin") {
      return [
        { id: "dashboard", label: "Root Cockpit", icon: Grid },
        { id: "expert_gis", label: "Expert Workspaces", icon: Map },
        { id: "users", label: "Operator Clearances", icon: UserCheck },
        { id: "reports", label: "Raw Databases", icon: Database },
        { id: "aiconfig", label: "AI Hyperparameters", icon: Sparkles },
        { id: "settings", label: "Security Settings", icon: Lock },
        { id: "monitoring", label: "Container Monitoring", icon: Cpu },
      ];
    }
    return [
      { id: "landing", label: "Home", icon: Home },
      { id: "dashboard", label: "Dashboard", icon: Grid },
      { id: "expert_gis", label: "Expert Workspaces", icon: Map },
    ];
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("oceanshield_theme", nextTheme);
  };

  // Active reports & alert broadcast state (hydrated from localStorage or seeded from initial datasets)
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [alerts, setAlerts] = useState<ActiveAlert[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  // Navigation tabs (landing page home tab is integrated)
  const [activeTab, setActiveTab] = useState<string>("landing");

  // Synchronize path and role routing!
  useEffect(() => {
    const handlePathRouting = () => {
      const path = window.location.pathname;
      let matchedRole: UserRole | null = null;

      if (path.startsWith("/citizen")) {
        matchedRole = "Citizen";
      } else if (path.startsWith("/fisherman")) {
        matchedRole = "Fisherman";
      } else if (path.startsWith("/research")) {
        matchedRole = "Researcher";
      } else if (path.startsWith("/authority")) {
        matchedRole = "Authority";
      } else if (path.startsWith("/admin")) {
        matchedRole = "Admin";
      }

      if (matchedRole) {
        // Find if user already cached or default
        const cachedUserStr = localStorage.getItem("oceanshield_session_user");
        let activeUserObj: User | null = null;
        if (cachedUserStr) {
          try {
            activeUserObj = JSON.parse(cachedUserStr);
          } catch(e) {}
        }
        
        if (!activeUserObj || activeUserObj.role !== matchedRole) {
          const updated = activeUserObj 
            ? { ...activeUserObj, role: matchedRole } 
            : { id: "usr-guest-2026", name: "Jothi Harshan D K", email: "jothi@oceanshield.org", role: matchedRole, organization: "Coastal Safeguard Guild" };
          setSessionUser(updated);
          localStorage.setItem("oceanshield_session_user", JSON.stringify(updated));
        }

        const segments = path.split("/");
        const tabPart = segments[2] || "dashboard";
        
        // Map specific slugs to activeTab
        if (tabPart === "report") setActiveTab("report");
        else if (tabPart === "alerts") setActiveTab("alerts");
        else if (tabPart === "assistant") setActiveTab("assistant");
        else if (tabPart === "profile") setActiveTab("profile");
        else if (tabPart === "map") setActiveTab("map");
        else if (tabPart === "safezones") setActiveTab("safezones");
        else if (tabPart === "analytics") setActiveTab("analytics");
        else if (tabPart === "verification") setActiveTab("verification");
        else if (tabPart === "users") setActiveTab("users");
        else if (tabPart === "reports") setActiveTab("reports");
        else if (tabPart === "aiconfig") setActiveTab("aiconfig");
        else if (tabPart === "settings") setActiveTab("settings");
        else if (tabPart === "monitoring") setActiveTab("monitoring");
        else if (tabPart === "insights") setActiveTab("insights");
        else if (tabPart === "export") setActiveTab("export");
        else if (tabPart === "details") setActiveTab("details");
        else if (tabPart === "impact") setActiveTab("impact");
        else if (tabPart === "expert_gis") setActiveTab("expert_gis");
        else if (tabPart === "landing") setActiveTab("landing");
        else setActiveTab("dashboard");
      }
    };

    handlePathRouting();
    window.addEventListener("popstate", handlePathRouting);
    return () => window.removeEventListener("popstate", handlePathRouting);
  }, []);

  // Update pathname reactively on role or tab changes
  useEffect(() => {
    if (!sessionUser) return;
    const roleSlug = sessionUser.role === "Researcher" ? "research" : sessionUser.role.toLowerCase();
    let tabSlug = "dashboard";
    
    if (activeTab === "report") tabSlug = "report";
    else if (activeTab === "alerts") tabSlug = "alerts";
    else if (activeTab === "assistant") tabSlug = "assistant";
    else if (activeTab === "profile") tabSlug = "profile";
    else if (activeTab === "map") tabSlug = "map";
    else if (activeTab === "safezones") tabSlug = "safezones";
    else if (activeTab === "analytics") tabSlug = "analytics";
    else if (activeTab === "verification") tabSlug = "verification";
    else if (activeTab === "users") tabSlug = "users";
    else if (activeTab === "reports") tabSlug = "reports";
    else if (activeTab === "aiconfig") tabSlug = "aiconfig";
    else if (activeTab === "settings") tabSlug = "settings";
    else if (activeTab === "monitoring") tabSlug = "monitoring";
    else if (activeTab === "insights") tabSlug = "insights";
    else if (activeTab === "export") tabSlug = "export";
    else if (activeTab === "details") tabSlug = "details";
    else if (activeTab === "impact") tabSlug = "impact";
    else if (activeTab === "expert_gis") tabSlug = "expert_gis";
    else if (activeTab === "landing") tabSlug = "landing";

    const target = `/${roleSlug}/${tabSlug}`;
    if (window.location.pathname !== target) {
      window.history.pushState(null, "", target);
    }
  }, [sessionUser?.role, activeTab]);

  // State to hold coordinates selected on the map
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number; locationName: string } | null>(null);

  // High-level AI Bulletin Summary generated on-the-fly from the backend API
  const [aiBulletin, setAiBulletin] = useState<string>("");
  const [isBulletinLoading, setIsBulletinLoading] = useState<boolean>(false);

  // Initialize data on load
  useEffect(() => {
    const cachedReports = localStorage.getItem("oceanshield_reports");
    if (cachedReports) {
      try {
        setReports(JSON.parse(cachedReports));
      } catch (e) {
        setReports(INITIAL_HAZARD_REPORTS);
      }
    } else {
      setReports(INITIAL_HAZARD_REPORTS);
      localStorage.setItem("oceanshield_reports", JSON.stringify(INITIAL_HAZARD_REPORTS));
    }

    const cachedAlerts = localStorage.getItem("oceanshield_alerts");
    if (cachedAlerts) {
      try {
        setAlerts(JSON.parse(cachedAlerts));
      } catch (e) {
        setAlerts(INITIAL_ALERTS);
      }
    } else {
      setAlerts(INITIAL_ALERTS);
      localStorage.setItem("oceanshield_alerts", JSON.stringify(INITIAL_ALERTS));
    }
  }, []);

  // Sync state helpers to persistent caches
  const handleLogin = (user: User) => {
    setSessionUser(user);
    localStorage.setItem("oceanshield_session_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setSessionUser(null);
    localStorage.removeItem("oceanshield_session_user");
    setActiveTab("landing");
  };

  // Auto-login Guest helper
  const handleGuestAutoLogin = (tabToOpen: string) => {
    const guestUser: User = {
      id: "usr-guest-2026",
      name: "Jothi Harshan D K",
      email: "jothi@oceanshield.org",
      role: "Citizen",
      organization: "Coastal Safeguard Guild"
    };
    handleLogin(guestUser);
    setActiveTab(tabToOpen);
  };

  // Compile AI Daily Dispatch bulletin from the actual server-side Gemini API
  useEffect(() => {
    if (reports.length === 0) return;

    const fetchBulletin = async () => {
      setIsBulletinLoading(true);
      try {
        const response = await fetch("/api/ai/dashboard-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reports }),
        });
        const data = await response.json();
        if (data.summary) {
          setAiBulletin(data.summary);
        }
      } catch (err) {
        console.error("Failed compiling daily AI summary:", err);
        setAiBulletin("Thermal stress bleaching high in shallow zone reefs coral gardens. Active fuel oil slick monitored near sector Delta-3 anchorage channel. Run containment protocol.");
      } finally {
        setIsBulletinLoading(false);
      }
    };

    fetchBulletin();
  }, [reports]);

  // Insert a newly crowdsourced hazard incident report
  const handleAddReport = (newReport: HazardReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem("oceanshield_reports", JSON.stringify(updated));

    // Force focus map to see newly added incident
    setSelectedReportId(newReport.id);
    setActiveTab("dashboard");
  };

  // Update verified/unverified statuses
  const handleUpdateReportStatus = (id: string, status: VerificationStatus, confidenceBoost?: number) => {
    const updated = reports.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          confidence: confidenceBoost !== undefined ? confidenceBoost : r.confidence,
        };
      }
      return r;
    });
    setReports(updated);
    localStorage.setItem("oceanshield_reports", JSON.stringify(updated));
  };

  // Delete a report
  const handleDeleteReport = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("oceanshield_reports", JSON.stringify(updated));
    if (selectedReportId === id) {
      setSelectedReportId(null);
    }
  };

  // Insert new active alert broadcasts
  const handleAddAlert = (newAlert: ActiveAlert) => {
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    localStorage.setItem("oceanshield_alerts", JSON.stringify(updated));
  };

  // Remove alert broadcasts
  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem("oceanshield_alerts", JSON.stringify(updated));
  };

  const handleSelectCoordinatesOnMap = (lat: number, lng: number, locationName: string) => {
    setSelectedCoords({ lat, lng, locationName });
    // Switch directly to split hazard reporter page
    setActiveTab("report");
  };

  const getCategoryTheme = (cat: HazardCategory) => {
    switch (cat) {
      case "oil_spill": return "text-red-400 border-red-500/20 bg-red-500/10";
      case "coral_bleaching": return "text-amber-400 border-amber-500/20 bg-amber-500/10";
      case "illegal_fishing": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
      case "toxic_algae": return "text-pink-400 border-pink-500/10 bg-pink-550/10";
      case "severe_weather": return "text-sky-400 border-sky-500/20 bg-sky-500/10";
      case "marine_debris": return "text-slate-400 border-slate-550/20 bg-slate-550/10";
    }
  };

  // Compute metrics dynamically
  const criticalReportsCount = reports.filter((r) => r.severity === "Critical").length;
  const verifiedPercentage = reports.length
    ? Math.round((reports.filter((r) => r.status === "Verified").length / reports.length) * 100)
    : 92;
  const averageConfidence = reports.length
    ? Math.round(reports.reduce((acc, curr) => acc + curr.confidence, 0) / reports.length)
    : 80;

  // Selected report details helper for dashboard map interaction
  const activeSelectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 ${theme === "light" ? "light-theme" : ""}`}>
      
      {/* GLOBAL PULSING BROADCAST MARQUEE */}
      {alerts.length > 0 && (
        <div className="bg-red-950 border-b border-red-900/60 text-red-200 py-1.5 px-4 text-xs font-mono font-medium overflow-hidden shadow-sm relative shrink-0">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
            {alerts.slice(0, 3).map((a) => (
              <span key={a.id} className="inline-flex items-center gap-2 mr-10">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <strong className="text-orange-400">[SEVERE RADIAL ALERT]</strong> {a.title} ({a.affectedCoordinates.radiusKm}km protection zone active). Issued by {a.verifiedBy}.
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CORE WEB CONSOLE HORIZONTAL HEADER */}
      <header className="bg-slate-900 border-b border-slate-850 p-4 shrink-0 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          
          {/* Logo Brand Sighting Block */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 relative shrink-0">
              <Compass className="w-5.5 h-5.5 animate-spin" style={{ animationDuration: "35s" }} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 border border-slate-900 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-heading">
                <span className="text-lg font-black tracking-wider text-slate-100 uppercase">
                  OceanShield
                </span>
                <span className="text-[9px] font-bold font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/10 shrink-0">
                  AI + CORE
                </span>
              </div>
              <p className="text-[11px] text-slate-450 font-semibold">NASA-vibe Ocean Hazard & Sighting Dispatch Monitor</p>
            </div>
          </div>

          {/* DYNAMIC NAVIGATION GRID (WELL ALIGNED IN VERTICAL & HORIZONTAL PLANES WITH MULTI-ROW SEGMENTS) */}
          <nav className="flex flex-col gap-2 p-2 bg-slate-950/20 dark:bg-slate-950/20 light:bg-[#f1f5f9]/50 border border-slate-850 dark:border-slate-850 light:border-slate-200/85 rounded-3xl shrink-0 min-w-[325px] sm:min-w-[420px] lg:min-w-[580px] max-w-full">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab("landing")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition select-none ${
                  activeTab === "landing"
                    ? "bg-white dark:bg-slate-900 text-cyan-500 dark:text-cyan-400 shadow-sm border border-slate-200/80 dark:border-slate-800 scale-103"
                    : "text-slate-650 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400"
                }`}
              >
                <Home className={`w-4 h-4 shrink-0 transition ${activeTab === "landing" ? "text-cyan-500" : "text-slate-400 dark:text-slate-500"}`} />
                <span>Landing</span>
              </button>

              {getNavItems().map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!sessionUser) handleGuestAutoLogin(item.id);
                      else setActiveTab(item.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition select-none ${
                      isSelected
                        ? "bg-white dark:bg-slate-900 text-cyan-500 dark:text-cyan-400 shadow-sm border border-slate-200/80 dark:border-slate-800 scale-103"
                        : "text-slate-650 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 transition ${isSelected ? "text-cyan-500" : "text-slate-400 dark:text-slate-500"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Theme, Demo Clearance & Auth Status Area */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto xl:ml-0 flex-wrap">
            
            {/* PERSISTENT DEMO SYSTEM ROLE SWITCHER */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-850 h-9 sm:h-10">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Demo Clearance:</span>
              <select
                value={sessionUser ? sessionUser.role : "Citizen"}
                onChange={(e) => {
                  const role = e.target.value as any;
                  if (!sessionUser) {
                    const newUser: User = {
                      id: "usr" + Date.now(),
                      name: `Jothi Harshan D K`,
                      role: role,
                      email: "jothi@oceanshield.org",
                      organization: "Coastal Safeguard Guild"
                    };
                    handleLogin(newUser);
                  } else {
                    const updatedUser = { ...sessionUser, role: role };
                    handleLogin(updatedUser);
                  }
                  setActiveTab("dashboard");
                }}
                className="bg-transparent text-cyan-405 font-mono font-bold text-[10px] outline-none border-none py-0 cursor-pointer select-none"
              >
                <option value="Citizen" className="bg-slate-900 text-slate-100">Citizen</option>
                <option value="Fisherman" className="bg-slate-900 text-slate-100">Fisherman</option>
                <option value="Researcher" className="bg-slate-900 text-slate-100">Researcher</option>
                <option value="Authority" className="bg-slate-900 text-slate-100">Authority</option>
                <option value="Admin" className="bg-slate-900 text-slate-100">Admin</option>
              </select>
            </div>

            {/* Theme Toggle option */}
            <button
               onClick={toggleTheme}
               className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl transition cursor-pointer select-none shrink-0"
               title="Toggle Day/Night sunlight visual themes"
               id="theme-toggle-btn"
            >
              {theme === "dark" ? (
                <Moon className="w-4.5 h-4.5 text-cyan-400" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              )}
            </button>

            {/* Auth Profile / Login action */}
            {sessionUser ? (
              <div className="flex items-center gap-3 bg-slate-955 dark:bg-slate-950 p-1.5 pr-3.5 rounded-2xl border border-slate-850 dark:border-slate-850 shadow-sm h-9 sm:h-10">
                <div className="w-6.5 h-6.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/10 flex items-center justify-center font-bold text-[11px] select-none">
                  JO
                </div>
                <div className="text-left select-none leading-none pr-1">
                  <h4 className="text-[11px] font-bold text-slate-100 tracking-wide leading-tight">{sessionUser.name}</h4>
                  <p className="text-[9px] text-slate-500 font-bold font-mono uppercase tracking-widest">{sessionUser.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 p-0.5 rounded transition cursor-pointer"
                  title="Disconnect telemetry link"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleGuestAutoLogin("dashboard")}
                className="bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow-md cursor-pointer font-heading"
              >
                Operator Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* RENDER ACTIVE SCREEN */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 overflow-y-auto">
        
        {/* =============== T1: THE MAIN LANDING PAGE =============== */}
        {activeTab === "landing" && (
          <div className="space-y-12 py-10" id="landing-page-root">
            
            {/* Center Hero structure split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left description text (7 columns) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-mono font-bold uppercase animate-float">
                  <Sparkles className="w-4 h-4" />
                  <span>PREMIUM ARTIFICIAL HYDROGRAPHIC INTEGRATION</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-none text-slate-100">
                  Monitor Ocean Hazards <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    with AI + Citizens
                  </span>
                </h1>

                <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl">
                  OceanShield is a high-performance crowdsourced surveillance system interfacing deep ocean social analytics with live satellite geospatial overlays. Report anomalies, sketch tactical plumes, and synchronize direct incidents in real-time.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (!sessionUser) handleGuestAutoLogin("report");
                      else setActiveTab("report");
                    }}
                    className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-slate-950 font-extrabold text-xs tracking-wider uppercase rounded-xl transition shadow-lg shadow-cyan-500/15 cursor-pointer font-heading"
                  >
                    Report Hazard Sighting
                  </button>

                  <button
                    onClick={() => {
                      if (!sessionUser) handleGuestAutoLogin("dashboard");
                      else setActiveTab("dashboard");
                    }}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 active:scale-95 text-cyan-400 font-bold text-xs tracking-wider uppercase rounded-xl border border-cyan-500/20 transition cursor-pointer font-heading"
                  >
                    Explore Dashboard Live
                  </button>
                </div>
              </div>

              {/* Right: Gorgeous Animated World Map / Ocean radar sweep (5 columns) */}
              <div className="lg:col-span-5 flex justify-center relative">
                
                {/* Background ambient glowing water circles */}
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="relative w-80 h-80 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden glow-cyan">
                  {/* Sweep grid lines overlay */}
                  <div className="absolute inset-4 border border-dashed border-cyan-500/10 rounded-full animate-sweep" />
                  <div className="absolute inset-16 border border-slate-850 rounded-full" />
                  <div className="absolute inset-28 border border-dashed border-cyan-500/5 rounded-full animate-spin" style={{ animationDuration: "20s" }} />

                  {/* Dynamic coordinate marker dots flashing */}
                  <span className="absolute top-24 left-24 w-3.5 h-3.5 bg-red-500 border-2 border-slate-950 rounded-full animate-ping" />
                  <span className="absolute top-24 left-24 w-2 h-2 bg-red-400 rounded-full" />

                  <span className="absolute bottom-28 right-24 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-bounce" />
                  <span className="absolute bottom-28 right-24 w-2 h-2 bg-emerald-450 rounded-full" />

                  <span className="absolute top-36 right-36 w-3 h-3 bg-amber-500 border border-slate-900 rounded-full animate-pulse" />

                  {/* Compass grid readouts */}
                  <div className="absolute bottom-4 text-center font-mono text-[9px] text-slate-500 tracking-widest font-black uppercase">
                    SYS RADAR OVERWATCH SENSING
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <Compass className="w-16 h-16 text-cyan-400/80 animate-spin" style={{ animationDuration: "40s" }} />
                    <span className="text-[10px] font-mono text-cyan-300 font-extrabold tracking-widest">N 14.542°</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Below: High tech counter summary cards */}
            <div className="border-t border-slate-850 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 text-left space-y-2 hover:border-slate-800 transition">
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider font-extrabold block">CROWD DISPATCH RECORDS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-heading text-slate-100">324+</span>
                    <span className="text-xs text-cyan-400 font-bold font-mono">Telemetry Nodes</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Visual anomalies logged securely dynamically spanning shipping lanes and fragile reef zones.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 text-left space-y-2 hover:border-slate-800 transition">
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider font-extrabold block">CRITICAL ACTIVE ALERTS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-heading text-orange-400">28</span>
                    <span className="text-xs text-orange-400 font-bold font-mono">Broadcasting Zones</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Emergency marine alerts monitored by authority operators to coordinate vessels safety protocol.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 text-left space-y-2 hover:border-slate-800 transition">
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider font-extrabold block">VERIFIED ACCURACY RATING</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-heading text-emerald-400">{verifiedPercentage}%</span>
                    <span className="text-xs text-emerald-400 font-bold font-mono">Expert Verification</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Reports verified by coast guard command and academic scientists to preserve marine biosafety.
                  </p>
                </div>

              </div>
            </div>

            {/* HOW IT WORKS PROCESS DIAGRAM FLOW */}
            <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden" id="how-it-works-diagram">
              <div className="space-y-1.5 max-w-2xl mx-auto">
                <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest uppercase block font-sans">Dynamic Ocean Telemetry Detection Pipeline</span>
                <h3 className="text-2xl font-black font-heading text-slate-100 uppercase">How OceanShield Works</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our platform integrates citizen reports, AI verification parameters, and live emergency radar dispatches to coordinate quick marine hazard containment.
                </p>
              </div>

              {/* Step cards with connector arrow line */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {/* Connecting arrow lines */}
                <div className="hidden md:block absolute top-[52px] left-[15%] w-[70%] h-0.5 border-t-2 border-dashed border-cyan-500/10 pointer-events-none z-0" />

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-2 z-10 text-left relative hover:border-cyan-500/30 transition">
                  <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold rounded-xl flex items-center justify-center font-mono text-sm shadow-md">
                    01
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Report Sighting</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                     Fishermen, citizen nodes or sea divers submit sighting forms with coordinates, images or sound bytes.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-2 z-10 text-left relative hover:border-emerald-500/30 transition">
                  <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl flex items-center justify-center font-mono text-sm shadow-md">
                    02
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">AI Verification</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                     Gemini processes records instantly, translating textual context, calculating confidence rating, and matching models.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-2 z-10 text-left relative hover:border-pink-500/30 transition">
                  <div className="w-8 h-8 bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold rounded-xl flex items-center justify-center font-mono text-sm shadow-md">
                    03
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Live Map overlays</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                     Approved contours are synced with real-time SVG layers, pinpointing locations immediately.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-2 z-10 text-left relative hover:border-amber-500/30 transition">
                  <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold rounded-xl flex items-center justify-center font-mono text-sm shadow-md">
                    04
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Risk calculated</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                     Formulary analytics combine visual density and SST temperature records to score localized threat levels.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-2 z-10 text-left relative hover:border-red-500/30 transition">
                  <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-405 font-bold rounded-xl flex items-center justify-center font-mono text-sm shadow-md">
                    05
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Alert Dispatch</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                     Coast Authorities verify claims, broadcast emergency notifications, push notifications & deploy warnings.
                  </p>
                </div>
              </div>
            </div>

            {/* LANDING FOOTER */}
            <footer className="border-t border-slate-850 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
              <div className="text-left">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider block">OCEANSHIELD DEFENSE CONSOLE</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Symmetric satellite crowdsourced hydrographic telemetry monitoring active.</p>
              </div>

              <span>© 2026 OceanShield Allied Intelligence. Earth Surface Overwatch.</span>
            </footer>

          </div>
        )}        {/* =============== T2: THE CORE DASHBOARD LAYOUT =============== */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 font-sans" id="dashboard-page-root">
            
            {/* REAL-TIME SYSTEM OVERWATCH STATUS BAR */}
            <div className="bg-slate-900/80 border border-slate-850 px-4 py-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2 shadow-inner">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-extrabold text-slate-200">DYNAMIC DEPLOYMENT OVERWATCH: {sessionUser ? sessionUser.role.toUpperCase() : "VISITOR"} CONSOLE ACTIVE</span>
                <span className="text-slate-705">|</span>
                <span className="text-emerald-400 font-bold">GRID SYNC SECURED</span>
              </div>
              <div className="flex items-center gap-2.5 text-[10.5px] text-slate-505 font-medium">
                <span>UPDATED: Just now</span>
                <span className="text-slate-800 font-bold">•</span>
                <span>PING LATENCY: 12ms</span>
              </div>
            </div>

            {/* Dynamic Rendering of Role-Based Dashboards */}
            {sessionUser?.role === "Citizen" && (
              <CitizenDashboard 
                reports={reports} 
                alerts={alerts} 
                currentUser={sessionUser} 
                onNavigate={setActiveTab}
                onDeleteReport={handleDeleteReport}
              />
            )}
            
            {sessionUser?.role === "Fisherman" && (
              <FishermanDashboard 
                reports={reports} 
                alerts={alerts} 
                onNavigate={setActiveTab}
              />
            )}

            {sessionUser?.role === "Researcher" && (
              <ResearcherDashboard 
                reports={reports} 
                alerts={alerts} 
                onNavigate={setActiveTab}
              />
            )}

            {sessionUser?.role === "Authority" && (
              <AuthorityDashboard 
                reports={reports} 
                alerts={alerts} 
                onNavigate={setActiveTab}
                onUpdateReportStatus={handleUpdateReportStatus}
              />
            )}

            {sessionUser?.role === "Admin" && (
              <AdminDashboard 
                reports={reports} 
                alerts={alerts} 
                currentUser={sessionUser} 
                onNavigate={setActiveTab}
              />
            )}

          </div>
        )}

        {/* =============== T10: CITIZEN REPORT HISTORY & SYSTEM PROFILE =============== */}
        {activeTab === "profile" && (
          <div className="space-y-4" id="profile-page-root">
            <UsersAdminPanel currentRole={sessionUser ? sessionUser.role : "Citizen"} onUpdateRole={(role) => {
              if (sessionUser) {
                const updated = { ...sessionUser, role };
                handleLogin(updated);
              }
            }} />
          </div>
        )}

        {/* =============== T11: ACTIVE ALERTS DISPATCH COARSE SYSTEM =============== */}
        {activeTab === "alerts" && (
          (() => {
            return (
              <div className="space-y-4" id="alerts-page-root">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left space-y-6">
                  <div className="border-b border-slate-850 pb-3 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                        <span>Active Coastal Siren Broadcasts</span>
                      </h3>
                      <p className="text-xs text-slate-405">Review certified hazards or draft official notifications to active seafaring vessel grids.</p>
                    </div>
                  </div>

                  {/* If user is Admin or Authority, show authority alert generator widget */}
                  {sessionUser && (sessionUser.role === "Admin" || sessionUser.role === "Authority") && (
                    <div className="bg-slate-955 p-4 rounded-xl border border-dashed border-slate-800 space-y-4">
                      <span className="text-[10px] font-mono text-cyan-405 uppercase font-bold tracking-wider block">Draft Official Siren Transmission</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input 
                          type="text" 
                          id="alert-title-input"
                          placeholder="Transmission Title (e.g., Extreme Tide Turbulence)" 
                          className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-100 outline-none"
                        />
                        <input 
                          type="text" 
                          id="alert-location-input"
                          placeholder="Affected Coordinate Quadrant/Centroid" 
                          className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-100 outline-none"
                        />
                        <button 
                          onClick={() => {
                            const titleEl = document.getElementById("alert-title-input") as HTMLInputElement;
                            const locEl = document.getElementById("alert-location-input") as HTMLInputElement;
                            if (titleEl && titleEl.value) {
                              const newAlert: ActiveAlert = {
                                id: `alert-${Date.now()}`,
                                title: `AUTHORITY TRANSMISSION: ${titleEl.value}`,
                                description: `Hazard warning active near ${locEl ? locEl.value : "Cavite Waters Grid sector 14"}. Extreme caution directed. Vessel anchorages restricted.`,
                                category: "severe_weather",
                                severity: "Critical",
                                issuedAt: new Date().toISOString(),
                                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                                affectedCoordinates: { lat: 14.28, lng: 120.35, radiusKm: 15 },
                                verifiedBy: "HQ Naval Port Operations"
                              };
                              handleAddAlert(newAlert);
                              titleEl.value = "";
                              if (locEl) locEl.value = "";
                            }
                          }}
                          className="bg-cyan-500 hover:bg-cyan-600 font-mono font-bold text-[10px] text-slate-950 rounded-lg p-2 transition cursor-pointer select-none"
                        >
                          BROADCAST TRANSMISSION
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Alerts dynamic listing display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alerts.map(a => (
                      <div key={a.id} className="bg-slate-955 p-4 rounded-xl border border-red-500/10 hover:border-red-500/20 transition space-y-2 relative">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-red-400 uppercase font-black">{a.severity} WARNING</span>
                          <span className="text-slate-500">{new Date(a.issuedAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{a.title}</h4>
                        <p className="text-xs text-slate-400">{a.description}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-855 pt-2">
                          <span>Verified: {a.verifiedBy}</span>
                          {sessionUser && (sessionUser.role === "Admin" || sessionUser.role === "Authority") && (
                            <button 
                              onClick={() => handleDeleteAlert(a.id)}
                              className="text-red-400 font-bold hover:underline"
                            >
                              SILENCE ALARM
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* =============== T12: VOYAGER SAFE ZONES CORRIDOR PANEL =============== */}
        {activeTab === "safezones" && (
          <div className="space-y-4" id="safezones-page-root">
            <SafeZonesPanel reports={reports} />
          </div>
        )}

        {/* =============== T13: RESEARCH CODES CATALOG OVERRIDES (REPORTS DATABASE) =============== */}
        {activeTab === "reports" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-left" id="reports-page-root">
            <div className="border-b border-slate-850 pb-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-405 animate-pulse" />
                  <span>Solenoid Raw Incident Catalog Databases</span>
                </h3>
                <p className="text-xs text-slate-450">Administrative view for scientific logs, raw datasets coordinates, and satellite confidence scoring.</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {reports.map((report) => (
                <div key={report.id} className="bg-slate-955 p-4 rounded-xl border border-slate-850 hover:border-slate-800 transition flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="space-y-1 text-left min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] px-1.5 py-0.2 uppercase rounded font-bold font-mono text-violet-400 bg-violet-950/30 border border-violet-800/10">
                        {report.category.replace("_", " ")}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-slate-900 border border-slate-800 text-slate-455">
                        LAT: {report.latitude.toFixed(3)} / LNG: {report.longitude.toFixed(3)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 truncate">{report.title}</h4>
                    <p className="text-[11px] text-slate-455 line-clamp-1">{report.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      report.status === "Verified" ? "bg-emerald-500/10 text-emerald-400" :
                      report.status === "Pending" ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      {report.status}
                    </span>
                    {sessionUser && sessionUser.role === "Admin" && (
                      <button 
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-slate-505 hover:text-red-400 p-1 rounded hover:bg-red-505/10 transition cursor-pointer"
                        title="Purge raw index"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =============== T14: SCIENTIFIC EXPORT TOOL =============== */}
        {activeTab === "export" && (
          <div className="space-y-4" id="export-page-root">
            <ExportDataPanel reports={reports} />
          </div>
        )}

        {/* =============== T15: ACADEMIC BULLET DIAGNOSTIC INSIGHTS =============== */}
        {activeTab === "insights" && (
          <div className="space-y-4" id="insights-page-root">
            <InsightsPanel />
          </div>
        )}

        {/* =============== T16: INCIDENT QUEUE FOR AUTHORITY VERIFICATIONS =============== */}
        {activeTab === "verification" && (
          <div className="space-y-4" id="verification-page-root">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left space-y-6">
              <div className="border-b border-slate-850 pb-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Maritime Security Sighting Verification Channel</span>
                  </h3>
                  <p className="text-xs text-slate-400">Validate, escalate, or reject pending user hazard reports.</p>
                </div>
              </div>

              <div className="space-y-3">
                {reports.filter(r => r.status === "Pending").length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500 font-mono">
                    All sightings are audited. Sighting pipelines are clear!
                  </div>
                ) : (
                  reports.filter(r => r.status === "Pending").map(report => (
                    <div key={report.id} className="bg-slate-955 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 text-left flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.2 uppercase rounded border border-amber-500/10">
                            {report.category.replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Confidence: {report.confidence}%
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-200 truncate">{report.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">{report.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button 
                          onClick={() => handleUpdateReportStatus(report.id, "Verified", 100)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold font-mono text-[10px] text-slate-950 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateReportStatus(report.id, "Unverified", 10)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-404 font-mono text-[10px] rounded-lg flex items-center gap-1 transition border border-red-505/10 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* =============== T17: USER IDENTITY DIRECT DIGITAL CLEARANCES =============== */}
        {activeTab === "users" && (
          <div className="space-y-4" id="users-page-root">
            <UsersAdminPanel currentRole={sessionUser ? sessionUser.role : "Citizen"} onUpdateRole={(role) => {
              if (sessionUser) {
                const updated = { ...sessionUser, role };
                handleLogin(updated);
              }
            }} />
          </div>
        )}

        {/* =============== T18: SECTOR CONFIGS FOR AI DIRECTIVE PARAMETERS =============== */}
        {activeTab === "aiconfig" && (
          <div className="space-y-4" id="aiconfig-page-root">
            <AIConfigPanel />
          </div>
        )}

        {/* =============== T19: SECURITY RULES & DRIFT SETTINGS =============== */}
        {activeTab === "settings" && (
          <div className="space-y-4" id="settings-page-root">
            <SettingsPanel />
          </div>
        )}

        {/* =============== T20: CONTAINER IP LOGS PORT 3000 LOGS =============== */}
        {activeTab === "monitoring" && (
          <div className="space-y-4" id="monitoring-page-root">
            <MonitoringPanel />
          </div>
        )}

        {/* =============== T3: REPORT HAZARD PAGE =============== */}
        {activeTab === "report" && (
          <div className="space-y-4" id="report-page-root">
            <ReportingForm
              currentUserRole={sessionUser ? sessionUser.role : "Citizen"}
              currentUserId={sessionUser ? sessionUser.id : "usr-guest"}
              currentUserName={sessionUser ? sessionUser.name : "Guest Sighting Citizen"}
              onAddReport={handleAddReport}
              selectedCoords={selectedCoords}
              onClearCoords={() => setSelectedCoords(null)}
            />
          </div>
        )}

        {/* =============== T4: FULL SCREEN OCEAN GIS MAP =============== */}
        {activeTab === "map" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4" id="fullscreen-map-root">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-850">
              <div>
                <h3 className="font-bold text-slate-100 font-heading text-lg uppercase flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: "35s" }} />
                  <span>INTEGRATED GEOSPATIAL OCEAN LAYER MAP</span>
                </h3>
                <p className="text-xs text-slate-400">Tactical GIS Coordinate Plotting & Incident Location Vector Sweep</p>
              </div>

              {/* Map instructions metadata */}
              <div className="bg-slate-950 px-4 py-2 border border-slate-800 text-[11px] font-mono rounded-xl text-slate-350">
                🔴 CRITICAL THREATS // 🟡 ELEVATED // 🟢 MUTED RISK // CODE RATINGS ON BOARD
              </div>
            </div>

            <div className="h-[520px] rounded-2xl border border-slate-800 overflow-hidden relative bg-slate-950">
              <MarineGISMap
                reports={reports}
                selectedReportId={selectedReportId}
                onSelectReport={setSelectedReportId}
                onSelectCoordinates={handleSelectCoordinatesOnMap}
              />

              {/* Dynamic GIS Map Legend Overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-slate-800 rounded-xl p-3.5 shadow-2xl z-10 max-w-[240px] backdrop-blur-md">
                <span className="text-[10px] font-mono text-cyan-400 font-extrabold tracking-widest block uppercase mb-2">
                  GIS LAYER LEGEND
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "oil_spill", label: "Oil Spill / Discharges", color: "bg-red-500", border: "border-red-400/50" },
                    { key: "coral_bleaching", label: "Coral Bleaching Hotspots", color: "bg-amber-500", border: "border-amber-400/50" },
                    { key: "illegal_fishing", label: "Illegal Fishery Incidents", color: "bg-emerald-500", border: "border-emerald-400/50" },
                    { key: "toxic_algae", label: "Harmful Algae Blooms", color: "bg-pink-500", border: "border-pink-400/50" },
                    { key: "severe_weather", label: "Severe Marine Weather", color: "bg-sky-500", border: "border-sky-400/50" },
                    { key: "marine_debris", label: "Debris & Trash Clusters", color: "bg-slate-500", border: "border-slate-400/50" }
                  ].map(item => {
                    const count = reports.filter(r => r.category === item.key).length;
                    return (
                      <div key={item.key} className="flex items-center justify-between gap-3 text-[10.5px] font-mono leading-none">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color} border ${item.border} shadow-sm shrink-0`} />
                          <span className="text-slate-300 font-sans font-medium">{item.label}</span>
                        </div>
                        <span className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 font-bold text-slate-400 leading-none">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============== T5: EXPERT METRICS & ANALYTICS =============== */}
        {activeTab === "analytics" && (
          <div className="space-y-6" id="analytics-page-root">
            
            {/* Embedded Real-time Social scraping component */}
            <SocialAnalytics socialTrends={MOCK_SOCIAL_TRENDS} />
            
            {/* Expanded custom high precision analytical graphs with glass effect */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-glass rounded-2xl p-6 border border-cyan-500/15 space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-slate-100 font-heading text-sm">REGIONAL RISK LEVEL INDEX</h4>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  Composite severity vector calculated symmetrically from logged citizen coordinates, marine heatwaves anomalies, storm currents, and official satellite dispatches:
                </p>

                {/* Custom SVG gauge layout visualization */}
                <div className="relative flex justify-center py-4">
                  <svg width="220" height="120" viewBox="0 0 220 120">
                    {/* Semi-circular gauge background track */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 200 100"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Active radial indicator slice */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 155 45"
                      fill="none"
                      stroke="url(#cyanGrad)"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    
                    <defs>
                      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00b4d8" />
                        <stop offset="100%" stopColor="#4cc9f0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-2 text-center font-mono">
                    <span className="text-2xl font-black text-slate-100 block">72.4%</span>
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-none">MODERATE TO ELEVATED</span>
                  </div>
                </div>
              </div>

              <div className="bg-glass rounded-2xl p-6 border border-cyan-500/15 space-y-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-slate-100 font-heading text-sm">SECTOR COVERAGE DISTRIBUTION</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Incidents tracking density recorded over primary designated maritime sanctuary coordinates and outer anchorage lanes:
                </p>

                <div className="space-y-3 pt-2 text-left">
                  {MAP_GRID_CELLS.map((cell, idx) => {
                    const sectorReports = reports.filter(r => r.locationName.includes(cell.id)).length;
                    const tot = Math.max(reports.length, 1);
                    const percent = Math.round((sectorReports / tot) * 100);
                    
                    return (
                      <div key={cell.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-300 font-bold block truncate max-w-[280px]">{cell.label}</span>
                          <span className="text-cyan-400">{percent}% ({sectorReports} records)</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                          <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${percent}%`, opacity: 0.15 + (idx * 0.15) }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =============== T6: CO-PILOT AI DIALOG BOARD =============== */}
        {activeTab === "assistant" && (
          <div className="h-[520px] max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-800 shadow-2xl" id="assistant-page-root">
            <ChatAssistant currentUserRole={sessionUser ? sessionUser.role : "Citizen"} />
          </div>
        )}

        {/* =============== T7: COMMAND CONTROL PANEL =============== */}
        {activeTab === "admin" && (
          (() => {
            const hasClearence = sessionUser && (sessionUser.role === "Admin" || sessionUser.role === "Authority");

            if (!hasClearence) {
              return (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto py-12">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-100 font-bold text-lg font-heading uppercase tracking-wide">
                    COAST OPERATOR ACCESS RESTRICTED
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mx-auto">
                    Your current clearance role is set to <strong>{sessionUser ? sessionUser.role : "Guest"}</strong>. Only registered Coast Guard <strong>Admin</strong> or expert <strong>Authority</strong> personnel can verify claims of raw files, delete incorrect logs, and broadcast active emergency advisories.
                  </p>
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl text-[10px] text-cyan-400 font-mono text-center max-w-sm">
                    💡 Register credentials inside the custom login system selecting "Authority" or "Admin" clearance to unlock command dashboard verifying.
                  </div>
                </div>
              );
            }

            return (
              <AdminPanel
                reports={reports}
                alerts={alerts}
                onUpdateReportStatus={handleUpdateReportStatus}
                onDeleteReport={handleDeleteReport}
                onAddAlert={handleAddAlert}
                onDeleteAlert={handleDeleteAlert}
              />
            );
          })()
        )}

        {/* =============== T8: DETAILED REPORT VIEW =============== */}
        {activeTab === "details" && (
          <div id="report-details-root">
            {activeSelectedReport ? (
              <ReportDetails
                report={activeSelectedReport}
                currentUser={sessionUser}
                onBack={() => setActiveTab("dashboard")}
                onUpdateStatus={handleUpdateReportStatus}
                onDeleteReport={(id) => {
                  handleDeleteReport(id);
                  setActiveTab("dashboard");
                }}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
                <p>No active report has been selected for inspection.</p>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer hover:bg-cyan-600 transition"
                >
                  Return to Main Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* =============== T9: IMPACT METRICS PAGE =============== */}
        {activeTab === "impact" && (
          <div id="impact-page-root">
            <ImpactPage />
          </div>
        )}

        {/* =============== EXPERT INTERCONNECTED MULTI-CORE WORKSPACES (FROM USER IMAGES) =============== */}
        {activeTab === "expert_gis" && (
          <div id="expert-gis-root" className="animate-fadeIn">
            <IntegratedWorkspaces />
          </div>
        )}

      </main>

    </div>
  );
}
