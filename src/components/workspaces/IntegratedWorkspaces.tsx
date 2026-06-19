import React, { useState, useEffect, useRef } from "react";
import { 
  Compass, Map, Grid, Activity, Layers, Calendar, CloudLightning, 
  TrendingUp, Ship, ShieldAlert, Heart, HelpCircle, 
  Smartphone, Monitor, Filter, Plus, Clock, Search, ExternalLink,
  ChevronRight, AlertTriangle, Play, Pause, RefreshCw, BarChart2,
  FileText, Star, ArrowUpRight, CheckCircle2, ChevronDown, Check, Trash, ArrowLeft
} from "lucide-react";

// ======================== MOCK DATABASE FOR WORSPACES ========================

const CLEAR_SEAS_INCIDENTS = [
  { name: "ORSULA", event: "Grounding", region: "Newfoundland Bank", severity: "Severe", status: "Critical", date: "2026-06-18 21:23" },
  { name: "LASQUETI DAUGHTERS", event: "Sank", region: "Gulf of St. Lawrence", severity: "Severe", status: "Resolved", date: "2026-06-17 14:02" },
  { name: "SYRINGA", event: "Sank", region: "Cabot Strait", severity: "Severe", status: "Monitoring", date: "2026-06-16 09:12" },
  { name: "THE LOG BARON", event: "Sank", region: "Bay of Fundy", severity: "High", status: "Active", date: "2026-06-15 18:45" },
  { name: "F.W. WRIGHT", event: "Collision", region: "Grand Banks East", severity: "Moderate", status: "Monitoring", date: "2026-06-14 23:11" },
  { name: "EMPIRE 40", event: "Allision", region: "North Atlantic Outer", severity: "Low", status: "Resolved", date: "2026-06-14 02:30" },
  { name: "CAPE APRICOT", event: "Collision", region: "Newfoundland Bank", severity: "High", status: "Active", date: "2026-06-12 11:15" },
];

const SOFAR_BUOY_TEMPORALS = [
  { time: "12 AM", waveHeight: 0.72, period: 7.2, barometric: 1018.2, wind: 14.5 },
  { time: "4 AM", waveHeight: 0.82, period: 7.4, barometric: 1017.5, wind: 15.2 },
  { time: "8 AM", waveHeight: 0.65, period: 6.8, barometric: 1016.9, wind: 13.1 },
  { time: "12 PM", waveHeight: 0.78, period: 7.1, barometric: 1016.1, wind: 16.4 },
  { time: "4 PM", waveHeight: 0.88, period: 7.9, barometric: 1015.5, wind: 18.2 },
  { time: "8 PM", waveHeight: 0.81, period: 7.5, barometric: 1014.8, wind: 17.1 },
];

const FLOOD_TAGS_SOCIAL = [
  { id: 1, place: "Kerpen, Rhine-Westphalia", count: 3, text: "Severe flooding caused major disruption on Friday in North Rhine-Westphalia #Germany. Rivers overflowed drowning streets.", image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80", time: "12:49, 18 Jul 2026" },
  { id: 2, place: "Erftstadt Region", count: 12, text: "Rescue boats deployed to evacuate citizens caught in historic landslide torrents following extreme cloudburst precipitation.", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80", time: "15:22, 18 Jul 2026" },
  { id: 3, place: "Euskirchen", count: 7, text: "Local dam structures at reservoir limits. Authorities issue immediate downstream flash torrent evacuation warnings.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80", time: "17:05, 18 Jul 2026" },
];

const QUAKEMAP_RELIEF_NEEDS = [
  { label: "Relief Needs", count: 24, active: true },
  { label: "Earthquake Damage", count: 18, active: true },
  { label: "URGENT HELP NEEDED", count: 322, active: true },
  { label: "Relief Distributed", count: 45, active: false },
  { label: "Testing First Task Name", count: 8, active: false },
  { label: "Unknown status", count: 2, active: false },
];

const METEO_HOUR_SERVICES = [
  { hour: "00:00", task: "Highway Fog Information", status: "completed", alert: "Low" },
  { hour: "04:00", task: "Southwest Electric Power Weather Alert", status: "completed", alert: "Moderate" },
  { hour: "08:00", task: "Coast Guard Wave Warning Report", status: "undone", alert: "High" },
  { hour: "12:00", task: "Meteorological Satellite Cloud Index", status: "completed", alert: "Low" },
  { hour: "16:00", task: "Qinghai-Tibet Railway Weather Warning", status: "completed", alert: "Critical" },
  { hour: "20:00", task: "Ocean Sentinel Wave Forecasting Module", status: "undone", alert: "High" },
  { hour: "23:00", task: "National Disaster Response Sighting Feed", status: "completed", alert: "Low" },
];

const METEO_STATIONS = [
  { name: "Visakhapatnam Port", region: "Bay of Bengal", tempC: 31, humidity: 82, pressure: 1008, wind: "SSW 18 kt", alert: "High Wave Advisory", sst: 29.5, lat: "17.68° N", lng: "83.21° E", climate: "Tropical Wet & Dry", anomaly: "+0.8°C" },
  { name: "Kakinada Coast", region: "Bay of Bengal", tempC: 30, humidity: 85, pressure: 1007, wind: "S 22 kt", alert: "Storm Surge Alert", sst: 29.8, lat: "16.98° N", lng: "82.24° E", climate: "Tropical Savanna", anomaly: "+1.2°C" },
  { name: "Chennai Harbour", region: "Indian Ocean", tempC: 33, humidity: 76, pressure: 1010, wind: "E 12 kt", alert: "Heatwave Alert", sst: 29.1, lat: "13.08° N", lng: "80.27° E", climate: "Tropical Semi-Arid", anomaly: "+0.4°C" },
  { name: "Mumbai Marine Drive", region: "Arabian Sea", tempC: 28, humidity: 91, pressure: 1005, wind: "WNW 26 kt", alert: "Gale Warning", sst: 28.3, lat: "18.93° N", lng: "72.82° E", climate: "Tropical Monsoon", anomaly: "+0.9°C" },
  { name: "Kathmandu Valley", region: "Himalayas", tempC: 24, humidity: 62, pressure: 1014, wind: "CALM", alert: "Landslide Warning", sst: 18.5, lat: "27.71° N", lng: "85.32° E", climate: "Subtropical Highland", anomaly: "-0.2°C" },
  { name: "Colombo Anchorage", region: "Laccadive Sea", tempC: 29, humidity: 88, pressure: 1009, wind: "SW 20 kt", alert: "Squalls Advisory", sst: 28.9, lat: "6.92° N", lng: "79.86° E", climate: "Tropical Rainforest", anomaly: "+0.5°C" },
  { name: "Port Blair", region: "Andaman Sea", tempC: 27, humidity: 90, pressure: 1006, wind: "WSW 24 kt", alert: "Monsoon Inundation", sst: 29.2, lat: "11.62° N", lng: "92.73° E", climate: "Tropical Monsoon", anomaly: "+1.1°C" },
];

const CLIMATE_ANOMALY_TRENDS: Record<string, number[]> = {
  "2023": [0.65, 0.72, 0.68, 0.82, 0.94, 0.91, 0.88, 0.85, 0.79, 0.83, 0.89, 0.92],
  "2024": [0.74, 0.81, 0.79, 0.91, 1.05, 1.02, 0.98, 0.95, 0.89, 0.92, 0.98, 1.04],
  "2025": [0.85, 0.89, 0.86, 0.98, 1.12, 1.09, 1.04, 1.01, 0.96, 0.99, 1.06, 1.15],
  "2026": [0.92, 0.97, 0.94, 1.06, 1.22, 1.18, 1.12, 1.09, 1.03, 1.07, 1.14, 1.25]
};

const DEEP_SEA_FLEET_DATA = [
  { name: "Amalia", fuel: [45, 52, 48, 61, 55, 72, 68], overconsumption: 28, status: "Active", mechanicalAlert: "Mild cavitation detected in starboard rudder assembly" },
  { name: "John", fuel: [38, 42, 41, 44, 43, 49, 45], overconsumption: 12, status: "Normal", mechanicalAlert: "None - all diagnostic parameters pristine" },
  { name: "Dimitris", fuel: [58, 63, 62, 70, 68, 81, 79], overconsumption: 39, status: "Critical", mechanicalAlert: "Hydraulic thermal coefficient exceeded main flange threshold" },
];

export default function IntegratedWorkspaces() {
  const [activeWorkspace, setActiveWorkspace] = useState<string>("clear_seas");
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  
  // States for Clear Seas (Workspace 2)
  const [showAccidentsOnly, setShowAccidentsOnly] = useState(false);
  const [showSeriousAccidentsOnly, setShowSeriousAccidentsOnly] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all");

  // States for Coastal Inundation (Workspace 3)
  const [activeCoastalLayer, setActiveCoastalLayer] = useState<string>("all");
  const [hoveredInundationZone, setHoveredInundationZone] = useState<string | null>(null);

  // States for SOFAR Buoy Timeline (Workspace 4)
  const [selectedSensorMetric, setSelectedSensorMetric] = useState<string>("waveHeight");

  // States for FloodTags Social Map (Workspace 5)
  const [floodTagsQuery, setFloodTagsQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number>(1);

  // States for Quakemap (Workspace 6)
  const [quakemapFilters, setQuakemapFilters] = useState<string[]>(["Relief Needs", "URGENT HELP NEEDED"]);

  // States for Meteorological Forecasting (Workspace 7)
  const [metSelectedDay, setMetSelectedDay] = useState<number>(18);
  const [selectedWeatherStation, setSelectedWeatherStation] = useState<string>("Visakhapatnam Port");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [meteorologicalSearchQuery, setMeteorologicalSearchQuery] = useState<string>("");
  const [isMeteoScanning, setIsMeteoScanning] = useState<boolean>(false);
  const [meteoScanProgress, setMeteoScanProgress] = useState<number>(0);
  const [climateTrendYear, setClimateTrendYear] = useState<string>("2026");
  const [scanMessage, setScanMessage] = useState<string>("STANDBY: Sensor Array Calibrated");

  // Timer Effect for meteorological radar weather scanning component
  useEffect(() => {
    let timer: any;
    if (isMeteoScanning) {
      timer = setInterval(() => {
        setMeteoScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsMeteoScanning(false);
            const alerts = [
              "SCAN SUCCESS: High pressure ridge validated over Bay of Bengal.",
              "SCAN SUCCESS: Heavy convective clouds detected; precipitation forecast raised.",
              "SCAN SUCCESS: Sea Surface Temp anomaly stable. Climate deviation +0.65°C.",
              "SCAN SUCCESS: Safe zones clearance green. Mild winds at 14 knots.",
              "SCAN SUCCESS: Extreme localized winds and gale warnings updated."
            ];
            setScanMessage(alerts[Math.floor(Math.random() * alerts.length)]);
            return 0;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isMeteoScanning]);

  // States for APSDMA Decision Support GIS (Workspace 8)
  const [activeDssLayers, setActiveDssLayers] = useState<string[]>(["Rainfall", "Cyclone Track", "Lightning"]);

  // States for Deep Sea Fleet Dashboard (Workspace 9)
  const [selectedFleetVessel, setSelectedFleetVessel] = useState<string>("Dimitris");

  // Render Sidebar Selector Cards with responsive thumbnails
  const workspacesList = [
    { id: "clear_seas", title: "Clear Seas Incident Center", icon: Ship, spec: "Image 1 & 6", desc: "Marine occurrence tracking, study areas & vessel breakdown pie visualizer." },
    { id: "coastal_inundation", title: "Coastal Inundation Watch", icon: WavesIcon, spec: "Image 2", desc: "Hurricane track cones of uncertainty, storm radii radar, and tidal hazard margins." },
    { id: "sofar_spotter", title: "SOFAR Spotlight - Buoy", icon: Activity, spec: "Image 3", desc: "High-density wave sensors, spectral directionality, and barometric indices." },
    { id: "flood_tags", title: "FloodTags Crowdsourced Map", icon: Layers, spec: "Image 4", desc: "Social monitoring clusters, localized overflow text feeds & photos log." },
    { id: "quake_map", title: "Quakemap Action Grid", icon: Map, spec: "Image 5", desc: "Himalayan seismic emergency relief hub, demand tracking and pin overlays." },
    { id: "met_disaster", title: "MetDisaster Radar Hub", icon: Calendar, spec: "Image 7", desc: "Weather forecasting schedule calendars, hourly service statuses & trendlines." },
    { id: "apsdma_gis", title: "APSDMA GIS Decision System", icon: CloudLightning, spec: "Image 9", desc: "Multi-layered live vectors including reservoirs, lightning and tropical cyclone paths." },
    { id: "deep_sea_fleet", title: "Deep Sea Fleet Cockpit", icon: TrendingUp, spec: "Image 10", desc: "Commercial yacht overconsumption analytics, smooth fuel curves and mechanical alerts." },
    { id: "ocean_saas", title: "Ocean Enterprise Portal", icon: ArrowUpRight, spec: "Image 8", desc: "State-of-the-art SaaS product showcase with live carousel mockup headers." },
  ];

  // Helper custom icon since lucide might not export WaverIcon
  function WavesIcon(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 3 0 3-2 5.5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1 3 0 3-2 5.5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 text-slate-100" id="integrated-workspaces">
      
      {/* HEADER SECTION METRICS */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-850 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/10">
              NASA-INTEGRATED MULTI-CORE WORKSPACE
            </span>
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight mt-1 text-slate-100">
            Expert Operational Intelligence Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interfacing real high-fidelity dummy data with professional marine and meteorology overlays mirroring visual presets.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode("desktop")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              viewMode === "desktop" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Monitor className="w-4.5 h-4.5" />
            <span>DESKTOP PREVIEW</span>
          </button>
          <button 
            onClick={() => setViewMode("mobile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              viewMode === "mobile" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4.5 h-4.5" />
            <span>MOBILE PREVIEW</span>
          </button>
        </div>
      </div>

      {/* CORE SPLIT SCREEN */}
      <div className={`grid grid-cols-1 ${viewMode === "desktop" ? "lg:grid-cols-12" : ""} gap-6`}>
        
        {/* SIDEBAR SELECTOR (4 COLS) */}
        <div className={`${viewMode === "desktop" ? "lg:col-span-4" : "w-full"} ${mobileShowDetail ? "hidden lg:block" : "block"} space-y-3 max-h-[850px] overflow-y-auto pr-1`}>
          <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase px-1">
            EXPLORE ACTIVE GIS LAYERS & SCHEMAS ({workspacesList.length})
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {workspacesList.map((workspace) => {
              const Icon = workspace.icon;
              const isActive = activeWorkspace === workspace.id;
              return (
                <button
                  key={workspace.id}
                  onClick={() => {
                    setActiveWorkspace(workspace.id);
                    setMobileShowDetail(true);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition duration-250 cursor-pointer flex gap-3.5 ${
                    isActive 
                      ? "bg-slate-900/90 border-cyan-500/80 shadow-md shadow-cyan-500/5 glow-cyan" 
                      : "bg-slate-950 border-slate-900 hover:border-slate-850 hover:bg-slate-900/40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400" : "bg-slate-900 border border-slate-850 text-slate-500"
                  }`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[12px] font-extrabold font-heading ${isActive ? "text-cyan-400" : "text-slate-200"}`}>
                        {workspace.title}
                      </span>
                      <span className="text-[8.5px] font-mono font-bold text-slate-500 bg-slate-900 px-1 py-0.2 rounded border border-slate-850">
                        {workspace.spec}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      {workspace.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PRIMARY VIEWBOARD (8 COLS) */}
        <div className={`${viewMode === "desktop" ? "lg:col-span-8 w-full" : "max-w-[420px] mx-auto w-full lg:col-span-12 ring-4 ring-slate-800 shadow-2xl"} ${!mobileShowDetail ? "hidden lg:flex" : "flex"} border border-slate-850 rounded-2xl bg-slate-900/30 overflow-hidden flex flex-col min-h-[640px] relative transition-all duration-300`}>
          
          {/* HEADER BAR FOR SELECTED WORKSPACE */}
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Back button shown on mobile/tablet, hidden on desktop */}
              <button
                onClick={() => setMobileShowDetail(false)}
                className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-mono font-black text-cyan-400 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO LIST</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="font-mono font-bold text-xs text-slate-300 hidden sm:inline">
                  ACTIVE COCKPIT VIEW:
                </span>
                <span className="font-sans font-black text-xs text-cyan-400 uppercase tracking-tight">
                  {workspacesList.find(w => w.id === activeWorkspace)?.title}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-500 select-none self-end sm:self-auto">
              SECURE DUMMY DATA SYNCED OK
            </span>
          </div>

          {/* DYNAMIC RENDERING PANEL */}
          <div className="flex-1 p-4 sm:p-5 overflow-auto">
            
            {/* WORKSPACE 1: NATIVE OCEANSHIELD AI LANDING */}
            {activeWorkspace === "native" && (
              <div className="space-y-6 text-left animate-fadeIn">
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <h5 className="font-black font-heading text-lg text-slate-100">OceanShield AI Landing Showcase</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This represents the beautiful high-performance landing experience. Users can toggled custom radar scopes, report sights, or trigger citizen warning signals in real time.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 bg-cyan-950/40 border border-cyan-800/10 text-cyan-400 rounded-lg text-[10.5px] font-mono">324+ Dispatches</span>
                      <span className="px-2.5 py-1 bg-amber-950/40 border border-amber-800/10 text-amber-400 rounded-lg text-[10.5px] font-mono">28 Air Sirens</span>
                    </div>
                  </div>
                  <div className="w-36 h-36 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-2 border border-dashed border-cyan-500/20 rounded-full animate-spin" />
                    <Compass className="w-10 h-10 text-cyan-400" />
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE 2: CLEAR SEAS INCIDENT CENTER */}
            {activeWorkspace === "clear_seas" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Visual Header Filters Control Bar */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">Show Only Accidents:</span>
                      <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                        <button 
                          onClick={() => setShowAccidentsOnly(true)}
                          className={`px-2.5 py-1 rounded text-[10.5px] font-bold ${showAccidentsOnly ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setShowAccidentsOnly(false)}
                          className={`px-2.5 py-1 rounded text-[10.5px] font-bold ${!showAccidentsOnly ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">Show Only Serious Accidents:</span>
                      <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                        <button 
                          onClick={() => setShowSeriousAccidentsOnly(true)}
                          className={`px-2.5 py-1 rounded text-[10.5px] font-bold ${showSeriousAccidentsOnly ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setShowSeriousAccidentsOnly(false)}
                          className={`px-2.5 py-1 rounded text-[10.5px] font-bold ${!showSeriousAccidentsOnly ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Regional Filtering */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">Region:</span>
                    <select 
                      value={selectedRegionFilter}
                      onChange={(e) => setSelectedRegionFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-200 p-1.5 rounded-lg text-[10.5px] font-mono outline-none"
                    >
                      <option value="all">No Filter</option>
                      <option value="Newfoundland Bank">Newfoundland Bank</option>
                      <option value="Gulf of St. Lawrence">Gulf of St. Lawrence</option>
                      <option value="Cabot Strait">Cabot Strait</option>
                    </select>
                  </div>
                </div>

                {/* Dashboard Metrics Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left segment map simulation (7 cols) */}
                  <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-[10px] font-mono font-black text-slate-500 uppercase">Subregion 2: Paracels Map Overlay</span>
                      <span className="text-[9.5px] font-mono text-cyan-400">Study Area Boundary: active</span>
                    </div>

                    <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-950/20 opacity-30 select-none pointer-events-none">
                        <svg className="w-full h-full" stroke="rgba(6,182,212,0.15)" strokeWidth="1">
                          <pattern id="clear-seas-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" />
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#clear-seas-grid)" />
                        </svg>
                      </div>

                      {/* Map outlines of Atlantic / Canada coastline shape */}
                      <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 200 150">
                        <path d="M10 20 Q 30 15, 60 40 T 120 80 T 180 120 L 200 150 L 0 150 Z" fill="#0c1d3a" stroke="#1e3a8a" strokeWidth="1.5" />
                        
                        {/* Interactive Markers based on Clear Seas data */}
                        <circle cx="50" cy="35" r="4" fill="#ef4444" className="animate-pulse" />
                        <circle cx="85" cy="55" r="4" fill="#ef4444" />
                        <circle cx="110" cy="75" r="4" fill="#3b82f6" />
                        <circle cx="145" cy="110" r="4" fill="#10b981" />
                        <circle cx="160" cy="95" r="4" fill="#ef4444" />
                      </svg>

                      {/* Map legend tooltip box */}
                      <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-800 p-2 rounded text-[9.5px] font-mono font-bold max-w-[170px] space-y-0.5">
                        <div className="text-cyan-400 uppercase tracking-widest font-black">LEGEND LAYER</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Grounding (Severe)</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Collision (High)</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Sank (Resolved)</div>
                      </div>

                      {/* Zoom utilities */}
                      <div className="absolute right-2 top-2 bg-slate-950/80 border border-slate-800 p-1 rounded flex flex-col gap-1">
                        <button className="w-5 h-5 bg-slate-900 hover:bg-slate-850 rounded text-center font-bold text-xs">+</button>
                        <button className="w-5 h-5 bg-slate-900 hover:bg-slate-850 rounded text-center font-bold text-xs">-</button>
                      </div>
                    </div>

                    {/* Miniature chart layout at map footer representing occurrences over calendar years */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">China-Argentine Waves occurrences trend 1970-2026</span>
                      <div className="flex items-end gap-1.5 h-10 bg-slate-950 p-2 rounded-lg">
                        <div className="flex-1 bg-red-500/85 hover:bg-red-400 h-[60%] rounded transition" title="1970: 45 events" />
                        <div className="flex-1 bg-amber-500/85 hover:bg-amber-400 h-[45%] rounded transition" />
                        <div className="flex-1 bg-cyan-500/85 hover:bg-cyan-400 h-[85%] rounded transition" />
                        <div className="flex-1 bg-emerald-500/85 hover:bg-emerald-400 h-[92%] rounded transition" />
                        <div className="flex-1 bg-blue-500/85 hover:bg-blue-400 h-[70%] rounded transition" />
                      </div>
                    </div>
                  </div>

                  {/* Right pie segment & summary (5 cols) */}
                  <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
                    
                    {/* Big metric widget replica */}
                    <div className="bg-gradient-to-br from-blue-900/40 to-slate-950 p-5 rounded-xl border border-blue-800/25 flex items-center justify-between">
                      <div className="space-y-1">
                        <Ship className="w-8 h-8 text-cyan-400" />
                        <span className="text-slate-400 text-[10.5px] uppercase font-mono block">Marine Incidents</span>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black font-heading text-cyan-300">5,220</div>
                        <span className="text-[10px] uppercase font-mono text-cyan-400/80 block">vessels involved</span>
                      </div>
                    </div>

                    {/* Occurrence by Vehicle Type pie chart */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                      <span className="text-[10.5px] font-mono font-black text-slate-400 uppercase tracking-wide block">Marine Occurrences by Vessel Type</span>
                      
                      <div className="flex items-center gap-4">
                        {/* Pure CSS/SVG Pie Donut Chart replicating the percentages perfectly */}
                        <div className="w-24 h-24 relative shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="0" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ea580c" strokeWidth="4.2" strokeDasharray="16 84" strokeDashoffset="-20" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#16a34a" strokeWidth="4.2" strokeDasharray="9 91" strokeDashoffset="-36" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#db2777" strokeWidth="4.2" strokeDasharray="11 89" strokeDashoffset="-45" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="4.2" strokeDasharray="44 56" strokeDashoffset="-56" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-center">
                            <span className="text-[10px] font-mono font-bold text-slate-400">9 TYPES</span>
                          </div>
                        </div>

                        {/* Pie Chart Legend */}
                        <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[9px] font-mono text-slate-405">
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" />Tug 16%</div>
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-600" />Barge 9%</div>
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600" />Cargo 20%</div>
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-600" />Tanker 7%</div>
                          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" />Other 31%</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Serious Marine Accident Lists (reproducing the exact rows) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <span className="text-[10.5px] font-mono font-black text-red-400 uppercase tracking-wider block">Serious Marine Accidents Record Feed</span>
                    <span className="text-[10px] font-mono text-slate-500">Filtered region: {selectedRegionFilter}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {CLEAR_SEAS_INCIDENTS
                      .filter(inc => {
                        if (selectedRegionFilter !== "all" && inc.region !== selectedRegionFilter) return false;
                        if (showAccidentsOnly && inc.event !== "Grounding") return false;
                        if (showSeriousAccidentsOnly && inc.severity !== "Severe") return false;
                        return true;
                      })
                      .map((inc, index) => (
                        <div key={index} className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-850 flex items-center justify-between hover:border-slate-800 transition text-[11px]">
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-cyan-400 font-heading shrink-0">✦ {inc.name}</span>
                            <span className="text-slate-550 font-mono text-[10px]">({inc.event})</span>
                          </div>
                          <div className="flex items-center gap-3.5">
                            <span className="text-slate-400 text-[10px]">{inc.region}</span>
                            <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              inc.status === "Critical" ? "bg-red-500/20 text-red-400 border border-red-500/20" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {inc.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Footer and clear seas branding (similar to screenshot) */}
                <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono border-t border-slate-850/60">
                  <span>CLEAR SEAS CENTRE FOR RESPONSIBLE SHIPPING</span>
                  <a href="https://clearseas.org" target="_blank" rel="noreferrer" className="text-cyan-400 flex items-center gap-1 hover:underline">
                    <span>clearseas.org</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            )}

            {/* WORKSPACE 3: COASTAL INUNDATION WATCH */}
            {activeWorkspace === "coastal_inundation" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Coastal Header Controls */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-cyan-400 font-mono">Hurricane Tracker Radar / Storm Surge Zone</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Simulated real-time track prediction layers displaying risks buffers</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["all", "hurricane", "warning", "advisory"].map((lay) => (
                      <button
                        key={lay}
                        onClick={() => setActiveCoastalLayer(lay)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition border ${
                          activeCoastalLayer === lay 
                            ? "bg-amber-500/20 border-amber-500 text-amber-400" 
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {lay} Layers
                      </button>
                    ))}
                  </div>
                </div>

                {/* Atlantic Track Map */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Sat Map Frame Overlay */}
                  <div className="md:col-span-8 bg-slate-950 p-4.5 rounded-xl border border-slate-850 relative">
                    <span className="text-[9.5px] font-mono text-slate-550 absolute top-2 left-3">IMAGE LAYER COGNITIVE OVERLAY - NOAA AT-12</span>
                    
                    <div className="h-80 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-950/20 opacity-30 select-none pointer-events-none">
                        <svg className="w-full h-full" stroke="rgba(245,158,11,0.06)" strokeWidth="1">
                          <pattern id="coastal-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" />
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#coastal-grid)" />
                        </svg>
                      </div>

                      {/* Map outlines of Florida / Gulf Coast */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                        {/* Mainland Outer Contour Line */}
                        <path d="M10 20 Q 80 5 C 130 50, 160 90 L 190 120 L 210 160 Q 230 180, 200 190 L 140 160 Q 120 180, 80 190 Z" fill="#0c1220" stroke="#475569" strokeWidth="1" />
                        
                        {/* Coastal Risk Highlight Rings (Green/Yellow/Red highlights on coast) */}
                        {activeCoastalLayer !== "hurricane" && (
                          <>
                            {/* Coast Warnings */}
                            <path d="M10 20 Q 80 5 C 130 50, 160 90" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                            <path d="M160 90 L 190 120 L 210 160" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                            <path d="M210 160 Q 230 180, 200 190" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                          </>
                        )}

                        {/* Hurricane Forecast Track Cone of Uncertainty */}
                        {activeCoastalLayer !== "advisory" && (
                          <>
                            {/* Cone shape */}
                            <path d="M 120 130 L 190 80 Q 220 50, 260 40 L 250 80 L 170 140 Z" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
                            
                            {/* Storm sequence of points showing future projection path */}
                            <line x1="120" y1="130" x2="260" y2="40" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" />
                            
                            {/* Eye position circles */}
                            <circle cx="120" cy="130" r="12" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-spin" style={{ transformOrigin: '120px 130px', animationDuration: "3s" }} />
                            <circle cx="120" cy="130" r="3" fill="#ef4444" />

                            <circle cx="160" cy="100" r="6" fill="#f97316" />
                            <circle cx="210" cy="70" r="6" fill="#f59e0b" />
                            <circle cx="260" cy="40" r="6" fill="#eab308" />

                            {/* Wind Field Radius Vectors */}
                            <circle cx="120" cy="130" r="45" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1" />
                            <circle cx="120" cy="130" r="25" fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" />
                          </>
                        )}
                        
                        {/* Dynamic Spot Station node */}
                        <g 
                          className="cursor-pointer" 
                          onMouseEnter={() => setHoveredInundationZone("Fowey Rocks Radar")}
                          onMouseLeave={() => setHoveredInundationZone(null)}
                        >
                          <circle cx="215" cy="170" r="5" fill="#22d3ee" className="animate-pulse" />
                          <circle cx="215" cy="170" r="2" fill="#0891b2" />
                        </g>
                      </svg>

                      {/* Floating tooltip */}
                      {hoveredInundationZone && (
                        <div className="absolute top-24 right-5 bg-slate-950/95 border border-cyan-500/40 p-2.5 rounded-xl text-[10.5px] font-mono max-w-[190px] space-y-1">
                          <div className="text-cyan-400 font-bold uppercase">✦ {hoveredInundationZone}</div>
                          <div className="text-slate-300">Storm Surge Index: 2.82M</div>
                          <div className="text-amber-500 font-extrabold">Warning Level: CRITICAL WATCH</div>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 bg-slate-950/85 p-2 rounded text-[9.5px] font-mono space-y-0.5 border border-slate-800">
                        <div className="text-slate-400 font-black">STORM DISPLACEMENT</div>
                        <div>Current Lat: 26.11° N</div>
                        <div>Current Long: 80.12° W</div>
                        <div>Max Sustained: 145 Mph</div>
                      </div>
                    </div>
                  </div>

                  {/* Left legend sidebar replica */}
                  <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-wide block">Storm Inundation Legend</span>
                    
                    <div className="space-y-2 text-[10px] font-mono text-slate-350">
                      <div className="flex items-center gap-2"><span className="w-3 h-1 bg-red-600 rounded" /> Major Hurricane</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-1 bg-orange-500 rounded" /> Hurricane Category 1-4</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-1 bg-yellow-500 rounded" /> Tropical Storm</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-1 bg-blue-500 rounded" /> Tropical Depression</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-1 bg-emerald-500 rounded" strokeDasharray="2,2" /> Forecast Uncertainty Cone</div>
                      
                      <div className="h-px bg-slate-850 my-2" />
                      
                      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-red-500/20 border border-red-500 rounded" /> Coastal Warning Buffer</div>
                      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-yellow-500/20 border border-yellow-500 rounded" /> Coastal Watch Buffer</div>
                      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-green-500/20 border border-green-500 rounded" /> Advisory Pre-Warning Buffer</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* WORKSPACE 4: SOFAR SPOTLIGHT - BUOY SENSOR TELEMETRY */}
            {activeWorkspace === "sofar_spotter" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Buoy stats panels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[9.5px] font-mono text-slate-500 uppercase font-black">SPOT-30056D WAVE STAT</span>
                    <div className="text-2xl font-black font-heading text-cyan-400">0.82 Meters</div>
                    <span className="text-[10px] font-mono text-slate-400 block">Significant Wave Height Peak</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[9.5px] font-mono text-slate-500 uppercase font-black">SPECTRAL BEAM</span>
                    <div className="text-2xl font-black font-heading text-amber-400">22.4 Seconds</div>
                    <span className="text-[10px] font-mono text-slate-400 block">Peak Peak Wave Period</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
                    <span className="text-[9.5px] font-mono text-slate-500 uppercase font-black">LOCAL ATMOSPHERE</span>
                    <div className="text-2xl font-black font-heading text-emerald-400">1018.2 hPa</div>
                    <span className="text-[10px] font-mono text-slate-400 block">Barometric Station Pressure</span>
                  </div>
                </div>

                {/* Multi-Series Sensor area charts */}
                <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold text-slate-450 uppercase">Date Range Telemetry Stream (UTC)</span>
                    <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[10px] font-mono">
                      <button 
                        onClick={() => setSelectedSensorMetric("waveHeight")}
                        className={`px-2.5 py-1 rounded ${selectedSensorMetric === "waveHeight" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"}`}
                      >
                        Wave Height
                      </button>
                      <button 
                        onClick={() => setSelectedSensorMetric("wind")}
                        className={`px-2.5 py-1 rounded ${selectedSensorMetric === "wind" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"}`}
                      >
                        Wind Speed
                      </button>
                      <button 
                        onClick={() => setSelectedSensorMetric("barometric")}
                        className={`px-2.5 py-1 rounded ${selectedSensorMetric === "barometric" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"}`}
                      >
                        Barometer Pressure
                      </button>
                    </div>
                  </div>

                  {/* Responsive High Fidelity Chart rendering using SVG points */}
                  <div className="h-56 bg-slate-900 border border-slate-850 rounded-xl relative p-4 flex flex-col justify-between">
                    
                    {/* Y-Axes markers */}
                    <div className="absolute left-2.5 top-2.5 bottom-6 flex flex-col justify-between text-[9px] font-mono text-slate-600">
                      <span>Max limit</span>
                      <span>Mid range</span>
                      <span>Basal baseline</span>
                    </div>

                    {/* Chart Container Canvas */}
                    <div className="flex-1 ml-10 mb-2 relative">
                      <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                        
                        {/* Dynamic Polyline fill area based on selectedSensorMetric */}
                        {selectedSensorMetric === "waveHeight" && (
                          <>
                            <defs>
                              <linearGradient id="chartGrad-1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 60 Q 50 30, 100 20 T 200 70 T 300 30 L 300 100 L 0 100 Z" fill="url(#chartGrad-1)" />
                            <path d="M 0 60 Q 50 30, 100 20 T 200 70 T 300 30" fill="none" stroke="#22d3ee" strokeWidth="2" />
                            <circle cx="100" cy="20" r="4.5" fill="#22d3ee" stroke="#0f172a" strokeWidth="1.5" />
                          </>
                        )}

                        {selectedSensorMetric === "wind" && (
                          <>
                            <defs>
                              <linearGradient id="chartGrad-2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 70 Q 60 50, 120 15 T 240 50 T 300 45 L 300 100 L 0 100 Z" fill="url(#chartGrad-2)" />
                            <path d="M 0 70 Q 60 50, 120 15 T 240 50 T 300 45" fill="none" stroke="#fbbf24" strokeWidth="2" />
                            <circle cx="120" cy="15" r="4.5" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
                          </>
                        )}

                        {selectedSensorMetric === "barometric" && (
                          <>
                            <defs>
                              <linearGradient id="chartGrad-3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 30 Q 80 40, 150 78 T 250 15 T 300 20 L 300 100 L 0 100 Z" fill="url(#chartGrad-3)" />
                            <path d="M 0 30 Q 80 40, 150 78 T 250 15 T 300 20" fill="none" stroke="#34d399" strokeWidth="2" />
                            <circle cx="250" cy="15" r="4.5" fill="#34d399" stroke="#0f172a" strokeWidth="1.5" />
                          </>
                        )}

                      </svg>
                    </div>

                    {/* Timeline dynamic coordinate grid labels */}
                    <div className="flex justify-between ml-10 text-[9px] font-mono text-slate-500 border-t border-slate-800 pt-1.5">
                      {SOFAR_BUOY_TEMPORALS.map((bp, i) => (
                        <span key={i}>{bp.time}</span>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* WORKSPACE 5: FLOODTAGS SOCIAL MAP */}
            {activeWorkspace === "flood_tags" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Search query input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Filter post tags (e.g. disaster, flood, rain)..."
                      value={floodTagsQuery}
                      onChange={(e) => setFloodTagsQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Primary split grid (map + detail text side-by-side) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Bubble Map (7 cols) */}
                  <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <span className="text-[10px] font-mono font-black text-slate-550 uppercase">FLOOD CROWD MAP OVERLAY</span>
                    
                    <div className="h-64 bg-slate-900 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                      {/* Grid design */}
                      <div className="absolute inset-0 bg-blue-950/10 opacity-30 select-none pointer-events-none">
                        <svg className="w-full h-full" stroke="rgba(34,211,238,0.06)" strokeWidth="1">
                          <pattern id="flood-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" />
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#flood-grid)" />
                        </svg>
                      </div>

                      {/* Floating bubble clusters resembling screenshot map bubbles */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                        {/* Contours contours */}
                        <path d="M 20 50 Q 80 40, 120 90 T 220 120 T 290 80" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />
                        <path d="M 30 70 Q 90 60, 130 110 T 230 140 T 300 100" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />

                        {/* Blue clusters (circles with counts) */}
                        <g className="cursor-pointer" onClick={() => setSelectedPostId(1)}>
                          <circle cx="80" cy="80" r="16" fill="rgba(34,211,238,0.25)" stroke="#22d3ee" strokeWidth="1.5" />
                          <text x="80" y="84" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">261</text>
                        </g>

                        <g className="cursor-pointer" onClick={() => setSelectedPostId(2)}>
                          <circle cx="150" cy="120" r="12" fill="rgba(34,211,238,0.25)" stroke="#22d3ee" strokeWidth="1.5" />
                          <text x="150" y="124" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold">89</text>
                        </g>

                        <g className="cursor-pointer" onClick={() => setSelectedPostId(3)}>
                          <circle cx="210" cy="60" r="10" fill="rgba(34,211,238,0.25)" stroke="#22d3ee" strokeWidth="1.5" />
                          <text x="210" y="63" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold">7</text>
                        </g>

                        {/* Smaller auxiliary dots */}
                        <circle cx="50" cy="110" r="4" fill="#22d3ee" opacity="0.6" />
                        <circle cx="120" cy="40" r="5" fill="#22d3ee" opacity="0.6" />
                        <circle cx="250" cy="150" r="4" fill="#22d3ee" opacity="0.6" />
                      </svg>

                      {/* Mini popup window replicating the map speech alert box */}
                      <div className="absolute top-4 left-4 right-4 bg-slate-950/95 border border-cyan-500/30 p-2.5 rounded-xl text-[10px] font-mono shadow-xl max-w-[210px] space-y-1">
                        <div className="text-cyan-400 font-extrabold flex justify-between">
                          <span>LOCATION IDENTIFIED</span>
                          <span>ID #2912</span>
                        </div>
                        <p className="text-slate-300 leading-tight">Kerpen - 3. Severe flooding caused extreme cloudburst river flows overflow.</p>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Photos (5 cols) */}
                  <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-black text-slate-450 uppercase tracking-wide block">SOCIAL STREAMS PHOTOS LOG</span>
                    
                    {/* Post Detail Box based on selectedPostId */}
                    {(() => {
                      const post = FLOOD_TAGS_SOCIAL.find(p => p.id === selectedPostId) || FLOOD_TAGS_SOCIAL[0];
                      return (
                        <div className="space-y-3 flex-1 flex flex-col justify-between">
                          <div className="relative group overflow-hidden rounded-lg aspect-video border border-slate-800">
                            <img 
                              src={post.image} 
                              alt="disaster scene"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[8px] font-mono text-cyan-400 px-2 py-0.5 rounded">
                              SOURCE: TWITTER / TELEGRAM
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-100 font-sans block">{post.place}</span>
                            <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{post.text}</p>
                          </div>

                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                            <span>{post.time}</span>
                            <span className="text-cyan-400 uppercase font-black tracking-widest">{post.count} Reports Link</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            )}

            {/* WORKSPACE 6: QUAKEMAP ACTION GRID */}
            {activeWorkspace === "quake_map" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Active sidebar togglers */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left filters layout (4 cols) */}
                  <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5">
                    <span className="text-[10px] font-mono font-black text-slate-450 uppercase tracking-widest block">Quakemap Relief Action Filters</span>
                    
                    <div className="space-y-2">
                      {QUAKEMAP_RELIEF_NEEDS.map((filter, idx) => {
                        const isChecked = quakemapFilters.includes(filter.label);
                        return (
                          <div 
                            key={idx} 
                            onClick={() => {
                              if (isChecked) {
                                setQuakemapFilters(quakemapFilters.filter(f => f !== filter.label));
                              } else {
                                setQuakemapFilters([...quakemapFilters, filter.label]);
                              }
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg border text-[11px] cursor-pointer transition select-none ${
                              isChecked
                                ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 font-extrabold"
                                : "bg-slate-900 border-slate-850 text-slate-450 hover:bg-slate-850 hover:text-slate-200"
                            }`}
                          >
                            <span>{filter.label}</span>
                            <span className="font-mono text-[9px] bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                              {filter.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Centered Map view (8 cols) */}
                  <div className="md:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-black text-slate-500 uppercase">NEPAL HIMALAYAN SEISMIC ZONE VECTORS</span>
                      <button className="bg-amber-600 hover:bg-amber-500 select-none text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        <span>DEPLOY FIELD DISPATCH</span>
                      </button>
                    </div>

                    {/* Ground Map topography rendering */}
                    <div className="h-64 bg-slate-900 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full p-6" viewBox="0 0 200 120">
                        <path d="M10 50 Q 50 30, 90 70 T 170 80" fill="none" stroke="rgba(244, 63, 94, 0.1)" strokeWidth="3" />
                        
                        {/* Nepal region pin bubbles */}
                        {quakemapFilters.includes("URGENT HELP NEEDED") && (
                          <>
                            <circle cx="50" cy="40" r="5" fill="#f43f5e" className="animate-pulse" />
                            <circle cx="90" cy="60" r="5" fill="#f43f5e" />
                            <circle cx="120" cy="50" r="5" fill="#f43f5e" />
                          </>
                        )}

                        {quakemapFilters.includes("Relief Needs") && (
                          <>
                            <circle cx="70" cy="50" r="4" fill="#3b82f6" />
                            <circle cx="110" cy="40" r="4" fill="#3b82f6" className="animate-pulse" />
                            <circle cx="140" cy="70" r="4" fill="#3b82f6" />
                          </>
                        )}
                        
                        <text x="50" y="32" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontWeight="bold">Pokhara</text>
                        <text x="90" y="52" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontWeight="bold">Kathmandu</text>
                        <text x="140" y="62" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontWeight="bold">Birgunj</text>
                      </svg>

                      {/* Map overlay information summary */}
                      <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 border border-slate-800 p-2 rounded-xl text-[9.5px] font-mono max-w-[170px] space-y-0.5 text-right">
                        <div className="text-amber-500 font-extrabold uppercase">NEPAL ACTION REGISTER</div>
                        <div className="text-slate-400">Total Requests logged: 428</div>
                        <div className="text-emerald-400">Response coefficient: 84%</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* WORKSPACE 7: METDISASTER RADAR HUB */}
            {activeWorkspace === "met_disaster" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Meteorological Calendar Grid & service forecasting */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left Calendar Widget (7 cols) */}
                  <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider block">Disaster Meteorological Calendar Grid</span>
                    
                    <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <span key={day} className="text-slate-500 font-extrabold">{day}</span>
                      ))}

                      {Array.from({ length: 14 }, (_, i) => i + 10).map((day) => {
                        const isSelected = metSelectedDay === day;
                        return (
                          <button
                            key={day}
                            onClick={() => setMetSelectedDay(day)}
                            className={`p-2 rounded-lg font-bold border transition ${
                              isSelected 
                                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black" 
                                : "bg-slate-900 border-slate-850 text-slate-350 hover:bg-slate-850 hover:border-slate-800"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Meteorological Radar Map Simulation */}
                    <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 200 100">
                        {/* Dynamic colorful rainfall contour blobs replicating the radar image */}
                        <path d="M 60 20 Q 90 0, 110 50 T 160 30 L 150 90 Z" fill="rgba(34,211,238,0.25)" stroke="#22d3ee" strokeWidth="1" />
                        <path d="M 80 30 Q 100 15, 110 45 T 140 40 L 130 80 Z" fill="rgba(239,68,68,0.4)" stroke="#ef4444" strokeWidth="1" />
                        <path d="M 95 38 Q 105 28, 110 42 T 120 40 L 115 65 Z" fill="rgba(234,179,8,0.6)" stroke="#eab308" strokeWidth="1" />
                        
                        <text x="110" y="45" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Heavy Precipitation Nucleus</text>
                        {/* Interactive scan circle line */}
                        {isMeteoScanning && (
                          <line x1="0" y1={meteoScanProgress} x2="200" y2={meteoScanProgress} stroke="#22d3ee" strokeWidth="1.5" className="opacity-85" />
                        )}
                      </svg>
                      {/* Radar sweep flash overlay */}
                      {isMeteoScanning && (
                        <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Right Service check list (5 cols) */}
                  <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Met Service Schedule Log</span>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {METEO_HOUR_SERVICES.map((srv, idx) => (
                        <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between text-[10.5px]">
                          <div className="space-y-0.5">
                            <span className="text-[9.5px] font-mono text-slate-500 font-extrabold block">{srv.hour}</span>
                            <span className="text-slate-200 font-sans font-bold leading-tight block">{srv.task}</span>
                          </div>
                          <span className={`font-mono text-[8.5px] px-1.5 py-0.2 rounded font-black uppercase ${
                            srv.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/20 text-amber-500 border border-amber-500/20"
                          }`}>
                            {srv.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ================= NEW LIVE WEATHER CHECKER & MONITORING PANEL ================= */}
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-4.5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2">
                      <CloudLightning className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div>
                        <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight">Weather Checking & Climate Monitor</h3>
                        <p className="text-[10px] font-mono text-slate-400">Live multi-station query cockpit and historical sea temperature anomalies</p>
                      </div>
                    </div>

                    {/* Unit Switcher C / F */}
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                      <button 
                        onClick={() => setTempUnit("C")} 
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition ${tempUnit === "C" ? "bg-cyan-500 text-slate-950 font-black scale-100" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        °C
                      </button>
                      <button 
                        onClick={() => setTempUnit("F")} 
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition ${tempUnit === "F" ? "bg-cyan-500 text-slate-950 font-black scale-100" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        °F
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Left Column: Quick Stations Search list (5 cols) */}
                    <div className="md:col-span-5 space-y-3">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                        <input 
                          type="text" 
                          placeholder="Search station or region..." 
                          value={meteorologicalSearchQuery}
                          onChange={(e) => setMeteorologicalSearchQuery(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-550"
                        />
                      </div>

                      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {METEO_STATIONS.filter(st => {
                          const query = meteorologicalSearchQuery.toLowerCase();
                          return st.name.toLowerCase().includes(query) || st.region.toLowerCase().includes(query);
                        }).map((st) => {
                          const isSel = selectedWeatherStation === st.name;
                          const showTemp = tempUnit === "C" ? `${st.tempC}°C` : `${Math.round((st.tempC * 9/5) + 32)}°F`;
                          return (
                            <button
                              key={st.name}
                              onClick={() => setSelectedWeatherStation(st.name)}
                              className={`w-full text-left p-2.5 rounded-lg border transition ${
                                isSel 
                                  ? "bg-cyan-950/30 border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/45" 
                                  : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850 hover:border-slate-800"
                              } flex items-center justify-between text-xs font-sans`}
                            >
                              <div>
                                <span className="font-bold block text-[11.5px] leading-tight">{st.name}</span>
                                <span className="text-[9.5px] text-slate-500 font-mono italic block mt-0.5">{st.region}</span>
                              </div>
                              <div className="text-right flex items-center gap-1.5 font-mono">
                                <span className="font-black bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800 leading-none">{showTemp}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Selected Station Details (7 cols) */}
                    <div className="md:col-span-7 bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-4">
                      {(() => {
                        const currentStation = METEO_STATIONS.find(s => s.name === selectedWeatherStation) || METEO_STATIONS[0];
                        const displayTemp = tempUnit === "C" ? `${currentStation.tempC}°C` : `${Math.round((currentStation.tempC * 9/5) + 32)}°F`;
                        
                        return (
                          <>
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[9px] font-mono text-cyan-400 font-black tracking-widest block uppercase">STATION METADATA & TELEMETRY</span>
                                <h4 className="text-base font-black text-slate-100 font-sans tracking-tight mt-0.5">{currentStation.name}</h4>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded font-bold inline-block mt-1">
                                  GPS: {currentStation.lat}, {currentStation.lng}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-mono text-slate-500 font-extrabold uppercase block">Climate Zone</span>
                                <span className="text-xs font-bold text-teal-400 font-sans">{currentStation.climate}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-center">
                                <span className="text-[9px] font-mono text-slate-500 block">Temperature</span>
                                <span className="text-sm font-black text-slate-200 font-mono tracking-tight block mt-0.5">{displayTemp}</span>
                              </div>
                              <div className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-center">
                                <span className="text-[9px] font-mono text-slate-500 block">Humidity</span>
                                <span className="text-sm font-black text-slate-200 font-mono tracking-tight block mt-0.5">{currentStation.humidity}%</span>
                              </div>
                              <div className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-center">
                                <span className="text-[9px] font-mono text-slate-500 block">Pressure</span>
                                <span className="text-sm font-black text-slate-200 font-mono tracking-tight block mt-0.5">{currentStation.pressure} hPa</span>
                              </div>
                              <div className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-center">
                                <span className="text-[9px] font-mono text-slate-500 block">Wind Vector</span>
                                <span className="text-xs font-black text-cyan-400 font-mono tracking-tight block mt-1 leading-none">{currentStation.wind}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-lg text-xs font-mono">
                              <div className="flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="text-[11px] text-slate-400">Alert Advisory:</span>
                              </div>
                              <span className={`text-[10px] uppercase font-black px-1.5 py-0.2 rounded ${
                                currentStation.alert === "None" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                              }`}>
                                {currentStation.alert}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                  </div>

                  {/* ================= MONITORING HISTORICAL SST TRENDS ================= */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-mono text-cyan-400 font-black tracking-widest block uppercase">GLOBAL CLIMATE TREND MONITORING</span>
                        <h4 className="text-xs font-black text-slate-200 font-sans tracking-tight block mt-0.5">SST (Sea Surface Temperature) Monthly Anomaly Curves</h4>
                      </div>

                      {/* Year Selector buttons */}
                      <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg">
                        {["2023", "2024", "2025", "2026"].map((yr) => (
                          <button
                            key={yr}
                            onClick={() => setClimateTrendYear(yr)}
                            className={`px-2.5 py-1 text-[10.5px] font-mono font-black rounded-md transition ${
                              climateTrendYear === yr 
                                ? "bg-cyan-500 text-slate-950 font-black scale-100" 
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                            }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Container */}
                    <div className="space-y-2">
                      <div className="h-28 bg-slate-950 rounded-xl border border-slate-800/80 p-2 relative flex items-end justify-between overflow-hidden">
                        
                        {/* Render simple high-fidelity spline representation bar-lines */}
                        <div className="absolute inset-0 flex items-stretch justify-around px-4 pt-4 pb-2 z-0">
                          {(() => {
                            const data = CLIMATE_ANOMALY_TRENDS[climateTrendYear] || CLIMATE_ANOMALY_TRENDS["2026"];
                            return data.map((val, idx) => {
                              // range 0.5 to 1.5. Calculate height percentage
                              const percentage = Math.round(((val - 0.5) / 1.0) * 100);
                              const heightPx = Math.max(10, Math.min(percentage, 100));
                              // color ranges
                              let barColor = "bg-cyan-500/20 hover:bg-cyan-400 border-cyan-500/20";
                              if (val > 1.1) barColor = "bg-red-500/35 hover:bg-red-400 border-red-500/35";
                              else if (val > 0.9) barColor = "bg-orange-500/35 hover:bg-orange-400 border-orange-500/35";
                              else if (val > 0.7) barColor = "bg-yellow-500/35 hover:bg-yellow-400 border-yellow-500/35";

                              return (
                                <div key={idx} className="flex flex-col items-center justify-end flex-1 mx-1 group cursor-pointer">
                                  <span className="text-[8px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition duration-150 mb-0.5 font-bold">+{val}°C</span>
                                  <div className={`w-full rounded-md border ${barColor} transition-all duration-300`} style={{ height: `${heightPx}%` }} />
                                </div>
                              );
                            });
                          })()}
                        </div>

                      </div>

                      {/* X-axis months indicator */}
                      <div className="flex justify-between px-4 text-[9px] font-mono text-slate-500 font-extrabold select-none">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ================= RADAR WEATHER MONITOR SCANNING ACTION ================= */}
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className={`p-2 rounded-xl border ${isMeteoScanning ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400 animate-spin" : "bg-slate-950 border-slate-850 text-slate-400"}`}>
                        <RefreshCw className="w-5 h-5 shrink-0" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-500 block leading-none font-bold">ATMOSPHERIC RADAR PROBE</span>
                        <p className="text-[11.5px] font-mono text-slate-300 font-bold block">{scanMessage}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      {isMeteoScanning && (
                        <div className="w-24 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 shrink-0">
                          <div className="bg-cyan-500 h-full rounded-full transition-all duration-150" style={{ width: `${meteoScanProgress}%` }} />
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (isMeteoScanning) return;
                          setIsMeteoScanning(true);
                          setMeteoScanProgress(0);
                          setScanMessage("SCANNING: Initiating Multi-Orbit Spectral Sweep...");
                        }}
                        disabled={isMeteoScanning}
                        className={`px-4 py-2 text-xs font-mono font-black uppercase rounded-lg border transition cursor-pointer flex items-center gap-2 ${
                          isMeteoScanning 
                            ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-500 opacity-60 cursor-not-allowed" 
                            : "bg-cyan-500 text-slate-950 border-cyan-400 hover:bg-cyan-400 hover:scale-[1.02] shadow-sm active:scale-[0.98]"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 shrink-0" fill="currentColor" />
                        <span>{isMeteoScanning ? "Scanning..." : "Sync Radar"}</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* WORKSPACE 8: APSDMA GIS DECISION SUPPORT SYSTEM */}
            {activeWorkspace === "apsdma_gis" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Decision support multi-layer map */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Map overlay view (8 cols) */}
                  <div className="md:col-span-8 bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-mono font-black text-slate-500 uppercase tracking-widest">Decision Support System - GIS Spatial Cockpit</span>
                      <span className="text-[9.5px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/10">APSDMA | Real-time Sighting</span>
                    </div>

                    <div className="h-72 bg-[#050e21] rounded-xl border border-slate-850 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#0c1a30]/10 opacity-30 select-none pointer-events-none">
                        <svg className="w-full h-full" stroke="rgba(34,211,238,0.06)" strokeWidth="1">
                          <pattern id="apsdma-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                            <path d="M 25 0 L 0 0 0 25" fill="none" />
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#apsdma-grid)" />
                        </svg>
                      </div>

                      {/* Multilayer plotted vector points */}
                      <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 200 120">
                        {/* Cyclone track line */}
                        {activeDssLayers.includes("Cyclone Track") && (
                          <path d="M10 90 L 40 70 L 80 60 L 120 40 L 160 30" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,3" />
                        )}

                        {/* Reservoir Points (green check dots) */}
                        {activeDssLayers.includes("Reservoirs") && (
                          <>
                            <circle cx="80" cy="30" r="4.5" fill="#10b981" />
                            <circle cx="140" cy="80" r="4.5" fill="#10b981" />
                          </>
                        )}

                        {/* Lightning Points (orange spark dots) */}
                        {activeDssLayers.includes("Lightning") && (
                          <>
                            <circle cx="50" cy="50" r="3.5" fill="#f59e0b" />
                            <circle cx="110" cy="70" r="3.5" fill="#f59e0b" className="animate-ping" style={{ transformOrigin: '110px 70px' }} />
                            <circle cx="110" cy="70" r="2.5" fill="#eab308" />
                          </>
                        )}

                        {/* Rainfall contour area */}
                        {activeDssLayers.includes("Rainfall") && (
                          <path d="M 40 40 Q 80 15, 120 40 T 160 50 Z" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1" />
                        )}
                      </svg>

                      {/* Map legends at footer bottom */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-center bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[9px] font-mono">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Low</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" /> Critical</div>
                      </div>
                    </div>
                  </div>

                  {/* Right interactive layer switches (4 cols) */}
                  <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Interactive Layers Toggle</span>
                    
                    <div className="space-y-2 text-[10.5px] font-mono">
                      {["Rainfall", "Reservoirs", "Cyclone Track", "Flood Zones", "Lightning"].map((lay) => {
                        const isAdded = activeDssLayers.includes(lay);
                        return (
                          <div 
                            key={lay}
                            onClick={() => {
                              if (isAdded) {
                                setActiveDssLayers(activeDssLayers.filter(l => l !== lay));
                              } else {
                                setActiveDssLayers([...activeDssLayers, lay]);
                              }
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer select-none transition ${
                              isAdded 
                                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-400 font-extrabold" 
                                : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            <span>{lay}</span>
                            <span className="text-[9px]">{isAdded ? "ACTIVE LIVE" : "MUTED"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* WORKSPACE 9: DEEP SEA FLEET COCKPIT */}
            {activeWorkspace === "deep_sea_fleet" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Fleet toggle and fuel visualizer split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* High fidelity charts fuel curves (7 cols) */}
                  <div className="md:col-span-7 bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wide">YACHT FUEL CONSUMPTION CURVES (K/Gallons)</span>
                      
                      <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[9.5px] font-mono">
                        {DEEP_SEA_FLEET_DATA.map((vs) => (
                          <button
                            key={vs.name}
                            onClick={() => setSelectedFleetVessel(vs.name)}
                            className={`px-2 py-1 rounded ${selectedFleetVessel === vs.name ? "bg-cyan-500 text-slate-950 font-extrabold" : "text-slate-400"}`}
                          >
                            {vs.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Polyline Spline Chart */}
                    <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 p-3 relative flex flex-col justify-between">
                      <div className="flex-1 relative">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path 
                            d={(() => {
                              const points = DEEP_SEA_FLEET_DATA.find(v => v.name === selectedFleetVessel)?.fuel || [50, 50, 50];
                              // Scale mapping 
                              return `M 0 ${40 - points[0]/2} L 16 ${40 - points[1]/2} L 32 ${40 - points[2]/2} L 48 ${40 - points[3]/2} L 64 ${40 - points[4]/2} L 80 ${40 - points[5]/2} L 100 ${40 - points[6]/2}`;
                            })()} 
                            fill="none" 
                            stroke="#06b6d4" 
                            strokeWidth="2" 
                          />
                        </svg>

                        {/* Splines dots */}
                        {DEEP_SEA_FLEET_DATA.find(v => v.name === selectedFleetVessel)?.fuel.map((val, idx) => (
                          <span 
                            key={idx}
                            style={{ 
                              position: 'absolute', 
                              left: `${(idx / 6) * 90}%`, 
                              bottom: `${(val / 100) * 80}%`,
                              width: '6px',
                              height: '6px',
                              backgroundColor: '#fbbf24',
                              borderRadius: '50%'
                            }} 
                          />
                        ))}
                      </div>

                      <div className="flex justify-between text-[9px] font-mono text-slate-500 border-t border-slate-800 pt-1">
                        <span>1/6</span>
                        <span>2/6</span>
                        <span>3/6</span>
                        <span>4/6</span>
                        <span>5/6</span>
                        <span>6/6</span>
                        <span>7/6</span>
                      </div>
                    </div>

                    {/* Progress overconsumption bar representation */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-450 uppercase font-bold">OVERCONSUMPTION DUE TO MARINE FOULING (%)</span>
                        <span className="text-red-400 font-extrabold">{DEEP_SEA_FLEET_DATA.find(v => v.name === selectedFleetVessel)?.overconsumption}% overlimit</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
                        <div 
                          className="bg-red-500 h-full transition duration-300"
                          style={{ width: `${DEEP_SEA_FLEET_DATA.find(v => v.name === selectedFleetVessel)?.overconsumption}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mechanic alerts checklist list (5 cols) */}
                  <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Core Yacht Mechanic Dispatches</span>
                    
                    <div className="space-y-3 font-mono text-[10.5px]">
                      {DEEP_SEA_FLEET_DATA.map((vs, idx) => (
                        <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-400 font-extrabold font-heading">✦ Vessel {vs.name}</span>
                            <span className={`text-[8.5px] px-1 py-0.2 rounded font-bold uppercase ${
                              vs.status === "Critical" ? "bg-red-500/20 text-red-400 border border-red-500/10" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/10"
                            }`}>
                              {vs.status}
                            </span>
                          </div>
                          <p className="text-slate-400 leading-tight text-[10px]">{vs.mechanicalAlert}</p>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* WORKSPACE 10: OCEAN ENTERPRISE PORTAL */}
            {activeWorkspace === "ocean_saas" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Hero SaaS replication */}
                <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-indigo-950 p-8 rounded-3xl border border-blue-900/30 text-center space-y-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5 opacity-50 rounded-full blur-[80px]" />
                  
                  <div className="space-y-2 relative">
                    <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/10 inline-block">
                      Unleash the Full power of Saas with Ocean
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black font-heading text-slate-100 tracking-tight leading-none">
                      Integrated Web Solutions For Ocean Monitoring
                    </h4>
                    <p className="text-[11.5px] text-slate-400 max-w-xl mx-auto leading-relaxed">
                      Say goodbye to clunky static maps. Streamline your commercial fleet compliance checks and crowdsource hazard warnings seamlessly.
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 relative">
                    <button className="px-5 py-2.5 bg-white text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition select-none cursor-pointer">
                      Get Started Free
                    </button>
                    <button className="px-5 py-2.5 bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition select-none cursor-pointer">
                      Learn More
                    </button>
                  </div>

                  <div className="pt-6 relative">
                    <span className="text-[9px] font-mono text-slate-500 tracking-wider block mb-2.5 uppercase font-bold">TRUSTED BY THE WORLD'S LEADING CLOUD COMMERCE ORGANIZATIONS</span>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-slate-400/60 font-black tracking-widest">
                      <span>WEBFLOW</span>
                      <span>CLOUD_GIS</span>
                      <span>NASA_CORE</span>
                      <span>METEO_CENTRAL</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* PERSISTENT BAR EXPLAINING COMPILATION SUCCESS */}
          <div className="bg-slate-950 border-t border-slate-850 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tested Compilation Level: pristine clean standard React bundle</span>
            </span>
            <div className="flex items-center gap-3">
              <span>Active workspace: <strong className="text-cyan-400">{activeWorkspace}</strong></span>
              <span className="text-slate-700">|</span>
              <span>Coordinates: N 14°45' / E 120°05'</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
