import React, { useState, useRef, useEffect } from "react";
import { HazardReport, HazardCategory } from "../types";
import { MAP_GRID_CELLS } from "../mockData";
import { Ship, ShieldAlert, Compass, Eye, Filter, Wind, Navigation2, Check } from "lucide-react";

interface MarineGISMapProps {
  reports: HazardReport[];
  selectedReportId: string | null;
  onSelectReport: (id: string | null) => void;
  onSelectCoordinates: (lat: number, lng: number, locationName: string) => void;
}

export default function MarineGISMap({
  reports,
  selectedReportId,
  onSelectReport,
  onSelectCoordinates,
}: MarineGISMapProps) {
  // Map dimensions relative to our coordinate system (represented as 0 to 600 width, 0 to 450 height)
  // Grid coordinates map from latitude (14.45N to 14.75N) and longitude (120.05E to 120.50E)
  const latMin = 14.45;
  const latMax = 14.75;
  const lngMin = 120.05;
  const lngMax = 120.50;

  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeLayerCurrents, setActiveLayerCurrents] = useState<boolean>(true);
  const [activeLayerGrid, setActiveLayerGrid] = useState<boolean>(true);
  const [activeLayerRadar, setActiveLayerRadar] = useState<boolean>(true);
  const [selectedGridCell, setSelectedGridCell] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Translate lat/lng into SVG coordinates (cx, cy)
  const getSvgCoordinates = (lat: number, lng: number) => {
    // Width = 600, Height = 450
    const pctX = (lng - lngMin) / (lngMax - lngMin);
    // Y-axis is inverted in SVG, so higher latitude (north) is lower Y
    const pctY = 1 - (lat - latMin) / (latMax - latMin);
    return {
      x: pctX * 600,
      y: pctY * 450,
    };
  };

  // Translate SVG coordinate back into Lat/Lng
  const getLatFromY = (y: number) => {
    const pctY = 1 - y / 450;
    return latMin + pctY * (latMax - latMin);
  };

  const getLngFromX = (x: number) => {
    const pctX = x / 600;
    return lngMin + pctX * (lngMax - lngMin);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapContainerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 450;

    const lat = getLatFromY(y);
    const lng = getLngFromX(x);
    setHoverCoords({ lat, lng });
  };

  const handleMouseLeave = () => {
    setHoverCoords(null);
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapContainerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 600;
    const y = ((e.clientY - rect.top) / rect.height) * 450;

    const lat = Number(getLatFromY(y).toFixed(4));
    const lng = Number(getLngFromX(x).toFixed(4));

    // Determine grid segment label
    const gridRow = y < 150 ? "Alpha" : y < 300 ? "Bravo" : "Delta";
    const gridCol = x < 200 ? "1" : x < 400 ? "2" : "3";
    const locationName = `Sub-Sector ${gridRow}-${gridCol} Coastal Waters`;

    onSelectCoordinates(lat, lng, locationName);
  };

  const getCategoryColor = (category: HazardCategory) => {
    switch (category) {
      case "oil_spill":
        return "#ef4444"; // Red
      case "coral_bleaching":
        return "#f59e0b"; // Amber/Yellow
      case "illegal_fishing":
        return "#10b981"; // Green
      case "toxic_algae":
        return "#ec4899"; // Pink
      case "severe_weather":
        return "#0284c7"; // Blue
      case "marine_debris":
        return "#64748b"; // Slate
      default:
        return "#3b82f6";
    }
  };

  const getCategoryLabel = (category: HazardCategory) => {
    return category.replace("_", " ").toUpperCase();
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchCat = filterCategory === "all" || report.category === filterCategory;
    const matchSev = filterSeverity === "all" || report.severity === filterSeverity;
    return matchCat && matchSev;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Map Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-400 animate-spin" style={{ animationDuration: "14s" }} />
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight font-sans">
              ACTIVE MARINE GIS OVERLAY
            </h3>
            <p className="text-xs text-slate-400">
              {hoverCoords ? (
                <span className="font-mono text-cyan-400 font-medium">
                  LAT: {hoverCoords.lat.toFixed(4)}°N | LNG: {hoverCoords.lng.toFixed(4)}°E
                </span>
              ) : (
                "Hover cursor for telemetry"
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-slate-200 outline-none border-none pr-1 cursor-pointer font-sans"
              id="map-filter-category"
            >
              <option value="all">All Incidents</option>
              <option value="oil_spill">Oil Spills</option>
              <option value="coral_bleaching">Coral Bleaching</option>
              <option value="illegal_fishing">Illegal Fishing</option>
              <option value="severe_weather">Severe Weather</option>
              <option value="toxic_algae">Algal Bloom</option>
              <option value="marine_debris">Marine Debris</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-slate-200 outline-none border-none pr-1 cursor-pointer font-sans"
              id="map-filter-severity"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>

          {/* Quick layers toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveLayerCurrents(!activeLayerCurrents)}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                activeLayerCurrents ? "bg-cyan-500/20 text-cyan-300" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Toggle Ocean Currents"
            >
              <Wind className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveLayerGrid(!activeLayerGrid)}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                activeLayerGrid ? "bg-blue-500/20 text-blue-300" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Toggle Quad Grid"
            >
              <span className="font-mono text-xs font-bold font-sans">GRID</span>
            </button>
            <button
              onClick={() => setActiveLayerRadar(!activeLayerRadar)}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                activeLayerRadar ? "bg-emerald-500/20 text-emerald-300" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Toggle Surveillance Sweep"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas SVG Layer */}
      <div
        ref={mapContainerRef}
        className="relative flex-1 bg-slate-950 cursor-crosshair min-h-[350px] overflow-hidden"
      >
        <svg
          viewBox="0 0 600 450"
          className="w-full h-full select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleMapClick}
        >
          {/* Gradients */}
          <defs>
            <radialGradient id="deepOcean" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#081426" />
              <stop offset="60%" stopColor="#030b18" />
              <stop offset="100%" stopColor="#02050b" />
            </radialGradient>
            <linearGradient id="shallowCoast" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e2340" />
              <stop offset="100%" stopColor="#0b416e" />
            </linearGradient>
            <linearGradient id="sandSpit" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.4" />
            </linearGradient>
            {/* Marine Grid Pattern */}
            <pattern id="marineGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Deep Ocean base */}
          <rect width="600" height="450" fill="url(#deepOcean)" />

          {/* Depth Contours (Representing underwater reefs & trench zones) */}
          {/* Medium Depth Reef Contour */}
          <path
            d="M 50,100 Q 150,50 320,120 T 550,220 L 600,450 L 0,450 Z"
            fill="url(#shallowCoast)"
            opacity="0.25"
          />
          {/* Shallow Coral Bed Boundary */}
          <path
            d="M 120,450 Q 280,280 440,320 T 600,100 L 600,450 Z"
            fill="#134e4a"
            opacity="0.3"
          />

          {/* Landmass/Coast outlines representing Islands & Sandy Spit */}
          {/* Coral Garden Sandbar Islet */}
          <path
            d="M 450,220 Q 480,180 520,200 T 480,260 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
            className="hover:fill-slate-700 transition"
          />
          <path
            d="M 450,220 Q 480,180 520,200 T 480,260 Z"
            fill="url(#sandSpit)"
          />

          {/* Coastal Mainland Ridge (Left Boundary) */}
          <path
            d="M 0,0 L 40,0 Q 80,110 30,220 T 15,450 L 0,450 Z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Coastal Harbor lines */}
          <circle cx="20" cy="120" r="15" fill="none" stroke="#10b981" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
          <text x="35" y="125" fill="#10b981" fontSize="9" opacity="0.6" fontFamily="monospace">ANCHORAGE CONTROL</text>

          {/* Marine Sanctuary Overlay Polygon */}
          <polygon
            points="300,50 550,40 540,280 320,320"
            fill="rgba(16, 185, 129, 0.05)"
            stroke="#10b981"
            strokeWidth="1.2"
            strokeDasharray="4,4"
            opacity="0.6"
          />
          <text x="360" y="80" fill="#10b981" fontSize="10" opacity="0.6" letterSpacing="1" fontFamily="sans-serif">
            PROTECTED LAGOON SANCTUARY (NO TAKE)
          </text>

          {/* Ocean Currents Drift (Dynamic arrows) */}
          {activeLayerCurrents && (
            <g stroke="#06b6d4" strokeOpacity="0.25" strokeWidth="1.5" fill="none">
              {/* Dynamic current drifts */}
              <path d="M 120,80 L 140,85 M 140,85 L 134,80 M 140,85 L 135,90" className="animate-pulse" />
              <path d="M 220,120 L 250,130 M 250,130 L 243,123 M 250,130 L 243,135" />
              <path d="M 320,180 L 300,195 M 300,195 L 307,196 M 300,195 L 302,188" />
              <path d="M 460,350 L 430,370 M 430,370 L 438,371 M 430,370 L 433,362" />
              <path d="M 280,380 L 250,400 M 250,400 L 258,401 M 250,400 L 253,392" />
              <path d="M 520,140 L 550,145 M 550,145 L 544,140 M 550,145 L 544,150" />
              <circle cx="210" cy="180" r="30" stroke="#0ea5e9" strokeOpacity="0.08" strokeDasharray="3 3" />
              <text x="180" y="183" fill="#0ea5e9" fontSize="8" opacity="0.25" fontFamily="monospace">CYCLONIC SHELF GYRE</text>
            </g>
          )}

          {/* Quad Grid lines */}
          {activeLayerGrid && (
            <g>
              <rect width="600" height="450" fill="url(#marineGrid)" pointerEvents="none" />
              {/* Sector Labels */}
              <text x="80" y="30" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR A-1</text>
              <text x="280" y="30" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR A-2</text>
              <text x="480" y="30" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR A-3</text>
              <text x="80" y="230" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR B-1</text>
              <text x="280" y="230" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR B-2</text>
              <text x="480" y="230" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR B-3</text>
              <text x="80" y="420" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR C-1</text>
              <text x="280" y="420" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR C-2</text>
              <text x="480" y="420" fill="#ffffff" opacity="0.15" fontSize="12" fontWeight="bold" fontFamily="monospace">SECTOR C-3</text>
            </g>
          )}

          {/* Active surveillance radar sweeping overlay line */}
          {activeLayerRadar && (
            <g opacity="0.1">
              <circle cx="300" cy="225" r="240" fill="none" stroke="#10b981" strokeWidth="1" />
              <circle cx="300" cy="225" r="160" fill="none" stroke="#10b981" strokeWidth="0.5" />
              <circle cx="300" cy="225" r="80" fill="none" stroke="#10b981" strokeWidth="0.5" />
              {/* Animated rotating radial hand sweep */}
              <line
                x1="300"
                y1="225"
                x2="540"
                y2="225"
                stroke="#10b981"
                strokeWidth="1.5"
                transform="rotate(0, 300, 225)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 300 225"
                  to="360 300 225"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          )}

          {/* Interactive Hazard report markers (pins) */}
          {filteredReports.map((report) => {
            const coords = getSvgCoordinates(report.latitude, report.longitude);
            const markerColor = getCategoryColor(report.category);
            const isSelected = selectedReportId === report.id;

            return (
              <g
                key={report.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering coordinates selector
                  onSelectReport(isSelected ? null : report.id);
                }}
              >
                {/* Pulse wave behind selected or extreme hazards */}
                {(isSelected || report.severity === "Critical") && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 16 : 10}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="1.5"
                  >
                    <animate
                      attributeName="r"
                      values="6;22"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Main anchor marker pin dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? 8 : 6}
                  fill={markerColor}
                  className="transition-all duration-300 group-hover:scale-125"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  id={`map-pin-${report.id}`}
                />

                {/* Status banner indicator label */}
                <text
                  x={coords.x}
                  y={coords.y - 12}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  className="pointer-events-none opacity-0 group-hover:opacity-100 transition duration-200 bg-slate-900 border"
                >
                  {report.title.substring(0, 25)}...
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Incident Hover Card Overlay */}
        {selectedReportId && (
          (() => {
            const report = reports.find((r) => r.id === selectedReportId);
            if (!report) return null;
            const markerColor = getCategoryColor(report.category);

            return (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="p-1.5 rounded-lg text-slate-150 text-xs font-semibold shrink-0"
                      style={{ backgroundColor: `${markerColor}20`, border: `1px solid ${markerColor}40` }}
                    >
                      <ShieldAlert className="w-4 h-4" style={{ color: markerColor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-semibold font-mono" style={{ color: markerColor }}>
                          {getCategoryLabel(report.category)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded text-slate-300 border border-slate-700">
                          Confidence: {report.confidence}%
                        </span>
                        <span
                          className={`text-[9px] px-1.5 rounded font-mono font-bold ${
                            report.severity === "Critical"
                              ? "bg-red-500/20 text-red-300"
                              : report.severity === "High"
                              ? "bg-orange-500/20 text-orange-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {report.severity.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-slate-100 font-medium text-sm mt-1">{report.title}</h4>
                      <p className="text-xs text-slate-350 line-clamp-2 mt-1">{report.description}</p>
                      <div className="flex gap-4 text-[10px] text-slate-450 mt-2 font-mono">
                        <span>LAT/LNG: {report.latitude.toFixed(3)}°N, {report.longitude.toFixed(3)}°E</span>
                        <span>BY: {report.reportedBy} ({report.reporterRole})</span>
                        <span>STATUS: <span className="font-semibold text-emerald-400">{report.status}</span></span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectReport(null)}
                    className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })()
        )}

        {/* Floating Instruction overlay */}
        <div className="absolute top-2 right-2 bg-slate-900/75 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 pointer-events-none">
          <p className="text-[10px] text-slate-400 text-right">
            🖱️ <span className="text-slate-300">Click empty grid</span> to auto-capture reporting coordinates
          </p>
        </div>
      </div>

      {/* Grid cells detail legend table */}
      <div className="bg-slate-950 p-3 border-t border-slate-850 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {MAP_GRID_CELLS.map((cell) => (
          <div
            key={cell.id}
            onClick={() => setSelectedGridCell(selectedGridCell === cell.id ? null : cell.id)}
            className={`p-2 rounded-lg border transition cursor-pointer ${
              selectedGridCell === cell.id
                ? "bg-slate-800 border-slate-600 text-slate-200"
                : "bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-cyan-400 text-[10px]">{cell.id}</span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cell.color.replace("0.1", "0.8") }}
              />
            </div>
            <p className="font-semibold text-slate-300 mt-0.5 pointer-events-none truncate">{cell.label}</p>
            {selectedGridCell === cell.id && (
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 transition animate-in fade-in duration-200">
                {cell.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
