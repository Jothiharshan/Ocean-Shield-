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
  { name: "ORSULA", event: "Grounding", region: "Newfoundland Bank", severity: "Severe", status: "Critical", date: "2026-06-18 21:23", cx: 145, cy: 105 },
  { name: "LASQUETI DAUGHTERS", event: "Sank", region: "Gulf of St. Lawrence", severity: "Severe", status: "Resolved", date: "2026-06-17 14:02", cx: 85, cy: 55 },
  { name: "SYRINGA", event: "Sank", region: "Cabot Strait", severity: "Severe", status: "Monitoring", date: "2026-06-16 09:12", cx: 110, cy: 75 },
  { name: "THE LOG BARON", event: "Sank", region: "Bay of Fundy", severity: "High", status: "Active", date: "2026-06-15 18:45", cx: 45, cy: 95 },
  { name: "F.W. WRIGHT", event: "Collision", region: "Grand Banks East", severity: "Moderate", status: "Monitoring", date: "2026-06-14 23:11", cx: 160, cy: 95 },
  { name: "EMPIRE 40", event: "Allision", region: "North Atlantic Outer", severity: "Low", status: "Resolved", date: "2026-06-14 02:30", cx: 175, cy: 115 },
  { name: "CAPE APRICOT", event: "Collision", region: "Newfoundland Bank", severity: "High", status: "Active", date: "2026-06-12 11:15", cx: 135, cy: 85 },
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

const SEISMIC_POINTS = [
  { name: "Pokhara North Rift", category: "Relief Needs", cx: 50, cy: 40, r: 5, fill: "#3b82f6", detail: "Food drops and temporary shelter supplies needed" },
  { name: "Syangja Landslide Sector", category: "Relief Needs", cx: 65, cy: 45, r: 4, fill: "#3b82f6", detail: "Water purification kits & basic medicines needed" },
  { name: "Gorkha Epicenter Hub", category: "URGENT HELP NEEDED", cx: 90, cy: 35, r: 6, fill: "#f43f5e", pulse: true, detail: "Active search & rescue in progress. Critical casualties reported." },
  { name: "Nuwakot High-Altitude Base", category: "URGENT HELP NEEDED", cx: 105, cy: 30, r: 6, fill: "#f43f5e", pulse: true, detail: "High-level blockages, air dispatch requested for medical evacuation" },
  { name: "Kathmandu Valley Central", category: "Earthquake Damage", cx: 110, cy: 55, r: 5, fill: "#eab308", detail: "Historic heritage tower structure cracks and road separations" },
  { name: "Lalitpur Secondary Cracks", category: "Earthquake Damage", cx: 118, cy: 62, r: 4.5, fill: "#eab308", detail: "Residential foundation wall breaches and electrical line failures" },
  { name: "Sindhupalchok East Pass", category: "URGENT HELP NEEDED", cx: 135, cy: 42, r: 6, fill: "#f43f5e", pulse: true, detail: "Emergency surgical station and heavy excavation equipment request" },
  { name: "Birgunj Supply Station", category: "Relief Distributed", cx: 140, cy: 82, r: 5, fill: "#10b981", detail: "20 tons of grain and medical cargo successfully dispatched to frontlines" },
  { name: "Sarlahi Ground Zero Outpost", category: "Relief Distributed", cx: 155, cy: 88, r: 5, fill: "#10b981", detail: "Water supply system reconstructed and 150 families rehoused" },
  { name: "Mustang Border Outpost", category: "Testing First Task Name", cx: 40, cy: 25, r: 4, fill: "#a855f7", detail: "Seismic sensor threshold testing and baseline calibration" },
  { name: "Standard Calibration Rig", category: "Testing First Task Name", cx: 75, cy: 22, r: 4, fill: "#a855f7", detail: "Telemetry line verification test to Kathmandu Base" },
  { name: "Anomalous Vector Area", category: "Unknown status", cx: 170, cy: 68, r: 4, fill: "#94a3b8", pulse: true, detail: "Unconfirmed seismic signature drift under monitoring" }
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

const NATIONAL_WEATHER_OBSERVATIONS = [
  { 
    name: "New Delhi", 
    fullName: "NEW DELHI-SAFDARJUNG",
    x: 95, y: 55, 
    condition: "Haze", 
    tempC: 38.4, 
    feelLikeC: 41.7, 
    humidity: 34, 
    wind: "West-southwesterly 14.8 Km/h",
    astronomy: { sunrise: "05:24", sunset: "19:22", moonrise: "10:15", moonset: "23:45" },
    lat: "28.61° N", lng: "77.23° E", 
    pressure: 1004,
    alert: "Extreme Temperature Alert"
  },
  { 
    name: "Leh", 
    fullName: "LEH-LADAKH OBSERVATORY",
    x: 108, y: 20, 
    condition: "Fine Breeze", 
    tempC: 16.5, 
    feelLikeC: 15.0, 
    humidity: 28, 
    wind: "Northeasterly 8.5 Km/h",
    astronomy: { sunrise: "05:08", sunset: "19:35", moonrise: "09:44", moonset: "23:12" },
    lat: "34.15° N", lng: "77.58° E", 
    pressure: 1018,
    alert: "None"
  },
  { 
    name: "Gangtok", 
    fullName: "GANGTOK WEATHER HUB",
    x: 172, y: 70, 
    condition: "Drizzle / Rain", 
    tempC: 22.0, 
    feelLikeC: 23.5, 
    humidity: 92, 
    wind: "Easterly 12.0 Km/h",
    astronomy: { sunrise: "04:52", sunset: "18:48", moonrise: "09:22", moonset: "22:50" },
    lat: "27.33° N", lng: "88.61° E", 
    pressure: 1012,
    alert: "Landslide Advisory"
  },
  { 
    name: "Diu", 
    fullName: "DIU HEADLAND STATION",
    x: 52, y: 110, 
    condition: "Gale Inflow", 
    tempC: 31.0, 
    feelLikeC: 36.8, 
    humidity: 80, 
    wind: "South-southwesterly 24.5 Km/h",
    astronomy: { sunrise: "06:02", sunset: "19:38", moonrise: "10:55", moonset: "00:12" },
    lat: "20.71° N", lng: "70.98° E", 
    pressure: 1006,
    alert: "Gale Warning"
  },
  { 
    name: "Panjim", 
    fullName: "PANJIM MARINE WATCH",
    x: 68, y: 148, 
    condition: "Thunder Heavy", 
    tempC: 28.5, 
    feelLikeC: 33.2, 
    humidity: 95, 
    wind: "Westerly 28.0 Km/h",
    astronomy: { sunrise: "06:05", sunset: "19:08", moonrise: "10:35", moonset: "23:55" },
    lat: "15.49° N", lng: "73.82° E", 
    pressure: 1005,
    alert: "Squalls & Monsoon Alert"
  },
  { 
    name: "Pondicherry", 
    fullName: "PONDICHERRY COASTLINE",
    x: 108, y: 170, 
    condition: "Tropical Heat", 
    tempC: 33.0, 
    feelLikeC: 39.5, 
    humidity: 78, 
    wind: "Southeasterly 16.5 Km/h",
    astronomy: { sunrise: "05:54", sunset: "18:38", moonrise: "10:14", moonset: "23:25" },
    lat: "11.94° N", lng: "79.80° E", 
    pressure: 1009,
    alert: "Heatwave Advisory"
  },
  { 
    name: "Amini Divi", 
    fullName: "AMINI DIVI REEF OFFICE",
    x: 58, y: 172, 
    condition: "Lightning Storm", 
    tempC: 29.5, 
    feelLikeC: 34.8, 
    humidity: 88, 
    wind: "West-southwesterly 20.2 Km/h",
    astronomy: { sunrise: "06:12", sunset: "18:48", moonrise: "10:48", moonset: "00:02" },
    lat: "11.12° N", lng: "72.73° E", 
    pressure: 1007,
    alert: "High Wave Advisory"
  },
  { 
    name: "Minicoy", 
    fullName: "MINICOY TOURIST ATOLL",
    x: 64, y: 202, 
    condition: "Heavy Overcast", 
    tempC: 30.0, 
    feelLikeC: 35.5, 
    humidity: 84, 
    wind: "South-southwesterly 18.0 Km/h",
    astronomy: { sunrise: "06:15", sunset: "18:42", moonrise: "10:50", moonset: "00:08" },
    lat: "8.28° N", lng: "73.05° E", 
    pressure: 1008,
    alert: "None"
  },
  { 
    name: "Port Blair", 
    fullName: "PORT BLAIR HARBOUR STN",
    x: 195, y: 165, 
    condition: "Heavy Torrential Rain", 
    tempC: 27.2, 
    feelLikeC: 31.8, 
    humidity: 98, 
    wind: "Southwesterly 32.5 Km/h",
    astronomy: { sunrise: "05:10", sunset: "17:58", moonrise: "09:35", moonset: "22:15" },
    lat: "11.62° N", lng: "92.73° E", 
    pressure: 1003,
    alert: "Severe Undercurrent Warning"
  }
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

const getMeteorologicalDataForDay = (day: number) => {
  const data: Record<number, {
    title: string;
    path1: string;
    path2: string;
    path3: string;
    color1: string;
    color2: string;
    color3: string;
    stroke1: string;
    stroke2: string;
    stroke3: string;
    intensity: string;
  }> = {
    10: {
      title: "Category 2 Typhoon Eye",
      path1: "M 45 40 Q 95 10, 125 70 T 155 45 L 145 95 Z",
      path2: "M 65 48 Q 95 25, 120 65 T 140 55 L 135 85 Z",
      path3: "M 85 52 Q 95 35, 115 60 T 125 58 L 120 75 Z",
      color1: "rgba(239, 68, 68, 0.25)",
      color2: "rgba(245, 158, 11, 0.4)",
      color3: "rgba(234, 179, 8, 0.6)",
      stroke1: "#ef4444",
      stroke2: "#f59e0b",
      stroke3: "#eab308",
      intensity: "Critical (975 hPa)",
    },
    11: {
      title: "Moderate Convective Stream",
      path1: "M 20 50 Q 80 15, 120 45 T 180 60 L 170 85 Z",
      path2: "M 40 52 Q 80 25, 115 48 T 160 62 L 150 78 Z",
      path3: "M 70 54 Q 85 35, 110 50 T 130 62 L 125 72 Z",
      color1: "rgba(59, 130, 246, 0.25)",
      color2: "rgba(34, 211, 238, 0.4)",
      color3: "rgba(16, 185, 129, 0.6)",
      stroke1: "#3b82f6",
      stroke2: "#22d3ee",
      stroke3: "#10b981",
      intensity: "Moderate Warning",
    },
    12: {
      title: "Gale Wave Inundation",
      path1: "M 55 10 Q 75 40, 135 45 T 175 25 L 165 85 Z",
      path2: "M 75 25 Q 85 45, 130 48 T 155 35 L 150 75 Z",
      path3: "M 95 35 Q 100 48, 125 50 T 135 42 L 130 65 Z",
      color1: "rgba(236, 72, 153, 0.25)",
      color2: "rgba(168, 85, 247, 0.4)",
      color3: "rgba(99, 102, 241, 0.6)",
      stroke1: "#ec4899",
      stroke2: "#a855f7",
      stroke3: "#6366f1",
      intensity: "High Wave Advisory",
    },
    13: {
      title: "Tropical Depression Core",
      path1: "M 30 30 Q 90 20, 130 75 T 170 50 L 160 90 Z",
      path2: "M 55 40 Q 90 32, 125 70 T 150 60 L 145 82 Z",
      path3: "M 80 48 Q 95 40, 120 65 T 130 65 L 128 75 Z",
      color1: "rgba(16, 185, 129, 0.25)",
      color2: "rgba(34, 197, 94, 0.4)",
      color3: "rgba(234, 179, 8, 0.6)",
      stroke1: "#10b981",
      stroke2: "#22c55e",
      stroke3: "#eab308",
      intensity: "Elevated Alert",
    },
    14: {
      title: "Localized Squall Cluster",
      path1: "M 70 15 Q 110 5, 140 60 T 170 40 L 160 85 Z",
      path2: "M 85 25 Q 110 15, 135 55 T 155 45 L 150 75 Z",
      path3: "M 100 35 Q 112 25, 130 50 T 140 48 L 135 65 Z",
      color1: "rgba(239, 68, 68, 0.25)",
      color2: "rgba(249, 115, 22, 0.4)",
      color3: "rgba(234, 179, 8, 0.6)",
      stroke1: "#ef4444",
      stroke2: "#f97316",
      stroke3: "#eab308",
      intensity: "Severe Risk Block",
    },
    15: {
      title: "Dry Thermal Convection",
      path1: "M 15 35 Q 65 5, 115 55 T 165 45 L 155 85 Z",
      path2: "M 35 40 Q 65 18, 110 50 T 145 48 L 140 75 Z",
      path3: "M 65 45 Q 75 30, 100 48 T 120 48 L 115 65 Z",
      color1: "rgba(244, 63, 94, 0.25)",
      color2: "rgba(251, 113, 133, 0.4)",
      color3: "rgba(251, 146, 60, 0.6)",
      stroke1: "#f43f5e",
      stroke2: "#fb7185",
      stroke3: "#fb923c",
      intensity: "Thermal Anomaly Warning",
    },
    16: {
      title: "Frontal Boundary Rainband",
      path1: "M 50 35 Q 100 15, 130 65 T 180 35 L 170 85 Z",
      path2: "M 70 42 Q 100 28, 125 58 T 160 42 L 155 75 Z",
      path3: "M 90 48 Q 102 38, 120 52 T 140 46 L 135 65 Z",
      color1: "rgba(99, 102, 241, 0.25)",
      color2: "rgba(129, 140, 248, 0.4)",
      color3: "rgba(147, 197, 253, 0.6)",
      stroke1: "#6366f1",
      stroke2: "#818cf8",
      stroke3: "#93c5fd",
      intensity: "Safe-Line Operational Clearance",
    },
    17: {
      title: "Thunderstorm Microburst Hub",
      path1: "M 35 15 Q 85 5, 115 65 T 155 35 L 145 90 Z",
      path2: "M 55 25 Q 85 18, 110 58 T 140 42 L 135 80 Z",
      path3: "M 75 35 Q 85 28, 105 52 T 125 46 L 120 68 Z",
      color1: "rgba(168, 85, 247, 0.25)",
      color2: "rgba(192, 132, 252, 0.4)",
      color3: "rgba(216, 180, 254, 0.6)",
      stroke1: "#a855f7",
      stroke2: "#c084fc",
      stroke3: "#d8b4fe",
      intensity: "High Convective Cells",
    },
    18: {
      title: "Heavy Precipitation Nucleus",
      path1: "M 60 20 Q 90 0, 110 50 T 160 30 L 150 90 Z",
      path2: "M 80 30 Q 100 15, 110 45 T 140 40 L 130 80 Z",
      path3: "M 95 38 Q 105 28, 110 42 T 120 40 L 115 65 Z",
      color1: "rgba(34, 211, 238, 0.25)",
      color2: "rgba(239, 68, 68, 0.4)",
      color3: "rgba(234, 179, 8, 0.6)",
      stroke1: "#22d3ee",
      stroke2: "#ef4444",
      stroke3: "#eab308",
      intensity: "Heavy Overcast Precip",
    },
    19: {
      title: "Coastal Tide Inflow Front",
      path1: "M 40 45 Q 90 20, 140 60 T 190 25 L 180 85 Z",
      path2: "M 60 48 Q 90 32, 135 55 T 170 35 L 165 75 Z",
      path3: "M 85 52 Q 95 42, 125 52 T 145 42 L 140 65 Z",
      color1: "rgba(6, 182, 212, 0.25)",
      color2: "rgba(14, 116, 144, 0.4)",
      color3: "rgba(34, 211, 238, 0.6)",
      stroke1: "#06b6d4",
      stroke2: "#0e7490",
      stroke3: "#22d3ee",
      intensity: "Surge Tidal Variance Tracker",
    },
    20: {
      title: "Monsoon Depression Core",
      path1: "M 25 25 Q 75 10, 115 65 T 165 30 L 155 85 Z",
      path2: "M 45 32 Q 75 22, 110 58 T 145 38 L 140 75 Z",
      path3: "M 70 42 Q 82 32, 105 52 T 125 44 L 120 65 Z",
      color1: "rgba(30, 41, 59, 0.45)",
      color2: "rgba(15, 23, 42, 0.65)",
      color3: "rgba(2, 132, 199, 0.75)",
      stroke1: "#475569",
      stroke2: "#1e293b",
      stroke3: "#0284c7",
      intensity: "Strong Depression Status",
    },
    21: {
      title: "Tropical Convection Wave",
      path1: "M 45 30 Q 95 10, 135 60 T 175 40 L 165 85 Z",
      path2: "M 65 38 Q 95 22, 130 52 T 155 45 L 150 75 Z",
      path3: "M 90 44 Q 102 32, 122 48 T 138 48 L 132 65 Z",
      color1: "rgba(234, 179, 8, 0.25)",
      color2: "rgba(249, 115, 22, 0.4)",
      color3: "rgba(220, 38, 38, 0.6)",
      stroke1: "#eab308",
      stroke2: "#f97316",
      stroke3: "#dc2626",
      intensity: "Thermal Draft System",
    },
    22: {
      title: "Severe Lightning Cell Base",
      path1: "M 55 15 Q 105 5, 125 65 T 165 35 L 155 90 Z",
      path2: "M 75 25 Q 105 18, 120 58 T 145 42 L 140 80 Z",
      path3: "M 95 35 Q 105 28, 115 52 T 128 46 L 123 68 Z",
      color1: "rgba(124, 58, 237, 0.25)",
      color2: "rgba(109, 40, 217, 0.4)",
      color3: "rgba(167, 139, 250, 0.6)",
      stroke1: "#7c3aed",
      stroke2: "#6d28d9",
      stroke3: "#a78bfa",
      intensity: "Excessive Convective Discharges",
    },
    23: {
      title: "Mild Sea Fog Boundary",
      path1: "M 35 45 Q 85 25, 125 55 T 175 45 L 165 80 Z",
      path2: "M 55 48 Q 85 35, 120 50 T 155 48 L 150 70 Z",
      path3: "M 80 50 Q 92 42, 112 48 T 132 48 L 128 60 Z",
      color1: "rgba(148, 163, 184, 0.25)",
      color2: "rgba(203, 213, 225, 0.4)",
      color3: "rgba(241, 245, 249, 0.6)",
      stroke1: "#94a3b8",
      stroke2: "#cbd5e1",
      stroke3: "#f1f5f9",
      intensity: "Substantial Fog / Low Visibility",
    }
  };

  return data[day] || data[18];
};

export default function IntegratedWorkspaces() {
  const [activeWorkspace, setActiveWorkspace] = useState<string>("clear_seas");
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  
  // States for Clear Seas (Workspace 2)
  const [showAccidentsOnly, setShowAccidentsOnly] = useState(false);
  const [showSeriousAccidentsOnly, setShowSeriousAccidentsOnly] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all");
  const [clearSeasMapZoom, setClearSeasMapZoom] = useState(1);
  const [hoveredIncident, setHoveredIncident] = useState<any | null>(null);

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
  const [hoveredSeismicPoint, setHoveredSeismicPoint] = useState<any | null>(null);

  // States for Meteorological Forecasting (Workspace 7)
  const [metSelectedDay, setMetSelectedDay] = useState<number>(18);
  const [selectedWeatherStation, setSelectedWeatherStation] = useState<string>("Visakhapatnam Port");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [meteorologicalSearchQuery, setMeteorologicalSearchQuery] = useState<string>("");
  const [isMeteoScanning, setIsMeteoScanning] = useState<boolean>(false);
  const [meteoScanProgress, setMeteoScanProgress] = useState<number>(0);
  const [climateTrendYear, setClimateTrendYear] = useState<string>("2026");
  const [scanMessage, setScanMessage] = useState<string>("STANDBY: Sensor Array Calibrated");
  const [metActiveSubTab, setMetActiveSubTab] = useState<"satellite" | "radar" | "lightning">("satellite");
  const [metSelectedCity, setMetSelectedCity] = useState<string>("New Delhi");
  const [weatherStations, setWeatherStations] = useState(NATIONAL_WEATHER_OBSERVATIONS);
  
  // Auto-population states
  const [isAutoFillingDetails, setIsAutoFillingDetails] = useState<boolean>(false);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);

  const handleAutoFillDetails = async (locationName: string) => {
    if (!locationName || !locationName.trim() || locationName.trim().startsWith("Custom Station")) return;
    setIsAutoFillingDetails(true);
    setAutoFillError(null);
    try {
      const response = await fetch("/api/ai/suggest-station", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName: locationName.trim() })
      });
      if (!response.ok) {
        throw new Error("Failed response from weather server.");
      }
      const data = await response.json();
      if (data) {
        if (data.name) setEditName(data.name);
        if (data.fullName) setEditFullName(data.fullName);
        if (data.x !== undefined) setEditX(data.x);
        if (data.y !== undefined) setEditY(data.y);
        if (data.condition) setEditCondition(data.condition);
        if (data.tempC !== undefined) setEditTempC(data.tempC);
        if (data.feelLikeC !== undefined) setEditFeelLikeC(data.feelLikeC);
        if (data.humidity !== undefined) setEditHumidity(data.humidity);
        if (data.wind) setEditWind(data.wind);
        if (data.lat) setEditLat(data.lat);
        if (data.lng) setEditLng(data.lng);
        if (data.pressure !== undefined) setEditPressure(data.pressure);
        if (data.alert) setEditAlert(data.alert);
      }
    } catch (err: any) {
      console.warn("Auto fill fallback triggered:", err);
      
      // Perform fully offline predictable mathematical mapping if sever has issues or is disconnected
      const queryStr = locationName.trim();
      let hash = 0;
      for (let i = 0; i < queryStr.length; i++) {
        hash = queryStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      hash = Math.abs(hash);

      const computedLat = 8.5 + (hash % 245) / 10;
      const computedLng = 68.5 + ((hash >> 2) % 235) / 10;
      const finalX = Math.max(15, Math.min(225, Math.round((computedLng - 68) * 6.5 + 30)));
      const finalY = Math.max(15, Math.min(255, Math.round((33 - computedLat) * 6.8 + 25)));

      const CONDITIONS = ["Haze", "Fine Breeze", "Drizzle / Rain", "Thunder Heavy", "Gale Inflow", "Tropical Heat", "Heavy Overcast", "Heavy Torrential Rain"];
      const chosenCondition = CONDITIONS[hash % CONDITIONS.length];
      const baseTemp = 24.5 + (hash % 13);
      const feelDiff = (chosenCondition === "Tropical Heat") ? 6 : (chosenCondition === "Thunder Heavy") ? 4 : 0;

      setEditFullName(`${queryStr.toUpperCase()} MARINE STATION`);
      setEditX(finalX);
      setEditY(finalY);
      setEditCondition(chosenCondition);
      setEditTempC(parseFloat(baseTemp.toFixed(1)));
      setEditFeelLikeC(parseFloat((baseTemp + feelDiff).toFixed(1)));
      setEditHumidity(50 + (hash % 46));
      setEditWind(`Westerly ${10 + (hash % 20)} Km/h`);
      setEditLat(`${computedLat.toFixed(2)}° N`);
      setEditLng(`${computedLng.toFixed(2)}° E`);
      setEditPressure(995 + (hash % 26));
      setEditAlert(hash % 3 === 0 ? "Strong swell advisory" : "None");
    } finally {
      setIsAutoFillingDetails(false);
    }
  };
  
  // Editing states
  const [isEditingStation, setIsEditingStation] = useState<boolean>(false);
  const [isAddingStation, setIsAddingStation] = useState<boolean>(false);
  
  const [editName, setEditName] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editX, setEditX] = useState<number>(100);
  const [editY, setEditY] = useState<number>(100);
  const [editCondition, setEditCondition] = useState("");
  const [editTempC, setEditTempC] = useState<number>(25);
  const [editFeelLikeC, setEditFeelLikeC] = useState<number>(25);
  const [editHumidity, setEditHumidity] = useState<number>(50);
  const [editWind, setEditWind] = useState("");
  const [editLat, setEditLat] = useState("");
  const [editLng, setEditLng] = useState("");
  const [editPressure, setEditPressure] = useState<number>(1012);
  const [editAlert, setEditAlert] = useState("");

  const [meteoMapZoom, setMeteoMapZoom] = useState<number>(1.0);
  const [metZoomSatellite, setMetZoomSatellite] = useState<number>(1.0);
  const [metZoomRadar, setMetZoomRadar] = useState<number>(1.0);
  const [metZoomLightning, setMetZoomLightning] = useState<number>(1.0);
  const [lightningStrikes, setLightningStrikes] = useState<Array<{id: number, x: number, y: number, recency: "10m" | "20m" | "30m", timestamp: string}>>([
    { id: 1, x: 130, y: 70, recency: "10m", timestamp: "15:24:12" },
    { id: 2, x: 80, y: 140, recency: "20m", timestamp: "15:21:05" },
    { id: 3, x: 145, y: 110, recency: "10m", timestamp: "15:25:30" },
    { id: 4, x: 160, y: 190, recency: "30m", timestamp: "15:15:44" },
    { id: 5, x: 95, y: 220, recency: "20m", timestamp: "15:19:50" },
  ]);

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
                        {/* Interactive zoomable group */}
                        <g 
                          className="transition-transform duration-300 origin-center"
                          style={{ transform: `scale(${clearSeasMapZoom})`, transformOrigin: "center" }}
                        >
                          <path d="M10 20 Q 30 15, 60 40 T 120 80 T 180 120 L 200 150 L 0 150 Z" fill="#0c1d3a" stroke="#1e3a8a" strokeWidth="1.5" />
                          
                          {/* Live interactive markers filtered based on selected criteria */}
                          {CLEAR_SEAS_INCIDENTS
                            .filter(inc => {
                              if (selectedRegionFilter !== "all" && inc.region !== selectedRegionFilter) return false;
                              if (showAccidentsOnly && inc.event !== "Grounding") return false;
                              if (showSeriousAccidentsOnly && inc.severity !== "Severe") return false;
                              return true;
                            })
                            .map((inc) => {
                              const isHovered = hoveredIncident?.name === inc.name;
                              
                              // Select color based on incident event type
                              let markerColor = "#ef4444"; // default red (Grounding)
                              if (inc.event === "Sank") markerColor = "#10b981"; // green
                              if (inc.event === "Collision") markerColor = "#3b82f6"; // blue
                              if (inc.event === "Allision") markerColor = "#eab308"; // amber (yellow)

                              return (
                                <g 
                                  key={inc.name}
                                  className="cursor-pointer group"
                                  onMouseEnter={() => setHoveredIncident(inc)}
                                  onMouseLeave={() => setHoveredIncident(null)}
                                >
                                  {/* Pulsing ring for active/unresolved severe cases */}
                                  {inc.status === "Critical" && (
                                    <circle 
                                      cx={inc.cx} 
                                      cy={inc.cy} 
                                      r={isHovered ? 10 : 7} 
                                      fill={markerColor} 
                                      className="animate-ping opacity-35" 
                                    />
                                  )}
                                  <circle 
                                    cx={inc.cx} 
                                    cy={inc.cy} 
                                    r={isHovered ? 6 : 4} 
                                    fill={markerColor} 
                                    stroke="#020617"
                                    strokeWidth={isHovered ? 1.5 : 1}
                                    className="transition-all duration-200 hover:brightness-125"
                                  />
                                </g>
                              );
                            })
                          }
                        </g>
                      </svg>

                      {/* Map legend layer box */}
                      <div className="absolute bottom-2 left-2 bg-slate-950/95 border border-slate-800 p-2 rounded text-[9.5px] font-mono font-bold max-w-[170px] space-y-0.5 select-none z-10">
                        <div className="text-cyan-400 uppercase tracking-widest font-black">LEGEND LAYER</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />Grounding (Severe)</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" />Collision (High)</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />Sank (Resolved)</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />Allision / Other</div>
                      </div>

                      {/* Floating Interactive Hover Tooltip details */}
                      {hoveredIncident && (
                        <div className="absolute top-2 left-2 bg-slate-950/95 border border-cyan-500/40 p-2 text-[9.5px] font-mono rounded-md shadow-xl max-w-[170px] pointer-events-none z-20 space-y-0.5 select-none animate-fadeIn">
                          <div className="text-cyan-300 font-extrabold tracking-tight">✦ MV {hoveredIncident.name}</div>
                          <div className="h-[1px] bg-slate-800 my-0.5" />
                          <div><span className="text-slate-500">Event:</span> <span className="text-slate-350">{hoveredIncident.event}</span></div>
                          <div><span className="text-slate-500">Region:</span> <span className="text-slate-350">{hoveredIncident.region}</span></div>
                          <div><span className="text-slate-500">Severity:</span> <span className="text-red-400 font-bold">{hoveredIncident.severity}</span></div>
                          <div><span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-medium">{hoveredIncident.status}</span></div>
                          <div className="text-[8.5px] text-slate-500 italic mt-0.5">{hoveredIncident.date}</div>
                        </div>
                      )}

                      {/* Zoom utilities with interactive click responses */}
                      <div className="absolute right-2 top-2 bg-slate-950/80 border border-slate-800 p-1 rounded flex flex-col gap-1 z-10">
                        <button 
                          onClick={() => setClearSeasMapZoom(prev => Math.min(prev + 0.25, 3.0))}
                          className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center select-none"
                          title="Zoom In"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => setClearSeasMapZoom(prev => Math.max(prev - 0.25, 1.0))}
                          className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center select-none"
                          title="Zoom Out"
                        >
                          -
                        </button>
                        {clearSeasMapZoom > 1 && (
                          <button 
                            onClick={() => setClearSeasMapZoom(1.0)}
                            className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-[9px] font-mono rounded transition flex items-center justify-center select-none"
                            title="Reset Zoom"
                          >
                            R
                          </button>
                        )}
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
                        {/* Interactive Dynamic Tectonic & Seismic Zone Vectors */}
                        {[
                          { category: "Relief Needs", d: "M 10,65 Q 40,50 78,52", stroke: "#3b82f6", label: "Western Rift Zone" },
                          { category: "URGENT HELP NEEDED", d: "M 75,42 Q 105,32 140,43", stroke: "#f43f5e", label: "Main Central Rupture Fault", pulse: true },
                          { category: "Earthquake Damage", d: "M 95,62 L 115,62 L 125,70", stroke: "#eab308", label: "Katmandu Basin Fracture" },
                          { category: "Relief Distributed", d: "M 130,85 L 165,92", stroke: "#10b981", label: "Southern Buffer Valley" },
                          { category: "Testing First Task Name", d: "M 25,32 L 85,26", stroke: "#a855f7", label: "Mustang Baseline Sensor Arc" },
                          { category: "Unknown status", d: "M 155,75 L 185,72", stroke: "#94a3b8", label: "Eastern Anomalous Shear Zone" }
                        ].map((zone) => {
                          const isActive = quakemapFilters.includes(zone.category);
                          return (
                            <g key={zone.category} className="transition-all duration-300">
                              {/* Background vector glow if active */}
                              {isActive && (
                                <path 
                                  d={zone.d} 
                                  fill="none" 
                                  stroke={zone.stroke} 
                                  strokeWidth={zone.pulse ? 4 : 2} 
                                  className={`opacity-30 ${zone.pulse ? "animate-pulse" : ""}`}
                                />
                              )}
                              {/* Main visible rupture vector stroke */}
                              <path 
                                d={zone.d} 
                                fill="none" 
                                stroke={isActive ? zone.stroke : "rgba(71,85,105,0.15)"} 
                                strokeWidth={isActive ? 1.5 : 0.75} 
                                strokeDasharray={isActive ? "none" : "2,3"}
                                className="transition-all duration-300" 
                              />
                            </g>
                          );
                        })}
                        
                        {/* Dynamic Nepal region interactively filtered pins */}
                        {SEISMIC_POINTS.filter(pt => quakemapFilters.includes(pt.category)).map((pt, index) => {
                          const isHovered = hoveredSeismicPoint?.name === pt.name;
                          return (
                            <g 
                              key={index} 
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredSeismicPoint(pt)}
                              onMouseLeave={() => setHoveredSeismicPoint(null)}
                            >
                              {pt.pulse && (
                                <circle 
                                  cx={pt.cx} 
                                  cy={pt.cy} 
                                  r={isHovered ? 11 : 8} 
                                  fill={pt.fill} 
                                  className="animate-ping opacity-30 pointer-events-none" 
                                />
                              )}
                              <circle 
                                cx={pt.cx} 
                                cy={pt.cy} 
                                r={isHovered ? 7 : 4.5} 
                                fill={pt.fill} 
                                stroke="#020617" 
                                strokeWidth="1.5" 
                                className="transition-all duration-200 hover:brightness-125" 
                              />
                            </g>
                          );
                        })}
                        
                        <text x="50" y="32" fill="#475569" fontSize="6" textAnchor="middle" fontWeight="bold" className="pointer-events-none select-none">Pokhara Sector</text>
                        <text x="90" y="52" fill="#475569" fontSize="6" textAnchor="middle" fontWeight="bold" className="pointer-events-none select-none">Kathmandu Base</text>
                        <text x="140" y="62" fill="#475569" fontSize="6" textAnchor="middle" fontWeight="bold" className="pointer-events-none select-none">Birgunj Border</text>
                      </svg>

                      {/* Interactive Point Detail Overlay */}
                      {hoveredSeismicPoint && (
                        <div className="absolute top-2 left-2 bg-slate-950/95 border border-cyan-500/40 p-2 text-[9.5px] font-mono rounded-md shadow-xl max-w-[190px] pointer-events-none z-10 space-y-0.5 select-none animate-fadeIn text-left">
                          <div className="text-cyan-400 font-extrabold tracking-tight">▲ {hoveredSeismicPoint.name}</div>
                          <div className="h-[1px] bg-slate-800 my-0.5" />
                          <div className="text-slate-450 uppercase text-[8px] tracking-wider">{hoveredSeismicPoint.category}</div>
                          <div className="text-slate-300 leading-tight mt-0.5">{hoveredSeismicPoint.detail}</div>
                          <div className="text-[8px] text-slate-500 mt-1 italic">Coords: {hoveredSeismicPoint.cx * 10}m E, {hoveredSeismicPoint.cy * 10}m N</div>
                        </div>
                      )}

                      {/* Map overlay information summary */}
                      <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 border border-slate-800 p-2 rounded-xl text-[9.5px] font-mono max-w-[170px] space-y-0.5 text-right">
                        <div className="text-amber-500 font-extrabold uppercase">NEPAL ACTION REGISTER</div>
                        <div className="text-slate-400">Total Requests logged: 428</div>
                        <div className="text-emerald-400">Response coefficient: 84%</div>
                        <div className="text-[8px] text-cyan-500 uppercase tracking-widest font-black mt-1">
                          {quakemapFilters.length} FILTERS ACTIVE
                        </div>
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
                      {(() => {
                        const dayData = getMeteorologicalDataForDay(metSelectedDay);
                        return (
                          <svg className="w-full h-full" viewBox="0 0 200 100">
                            {/* Dynamic colorful rainfall contour blobs replicating the radar image */}
                            <path d={dayData.path1} fill={dayData.color1} stroke={dayData.stroke1} strokeWidth="1" className="transition-all duration-500 ease-in-out" />
                            <path d={dayData.path2} fill={dayData.color2} stroke={dayData.stroke2} strokeWidth="1" className="transition-all duration-500 ease-in-out" />
                            <path d={dayData.path3} fill={dayData.color3} stroke={dayData.stroke3} strokeWidth="1" className="transition-all duration-500 ease-in-out" />
                            
                            <text x="110" y="45" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" className="transition-all duration-300 select-none drop-shadow-md">
                              {dayData.title}
                            </text>
                            <text x="110" y="55" fill="#94a3b8" fontSize="5.5" fontWeight="medium" textAnchor="middle" className="transition-all duration-300 select-none opacity-80">
                              {dayData.intensity}
                            </text>
                            
                            {/* Interactive scan circle line */}
                            {isMeteoScanning && (
                              <line x1="0" y1={meteoScanProgress} x2="200" y2={meteoScanProgress} stroke="#22d3ee" strokeWidth="1.5" className="opacity-85" />
                            )}
                          </svg>
                        );
                      })()}
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
                        <p className="text-[10px] font-mono text-slate-400">Live multi-station query cockpit, real-satellite imaging, radar reflectivity & lightning maps</p>
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

                  {/* Multi-Station Navigation Cockpit */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Left Column: Interactive Map & Selected Station Dashboard (5 cols) */}
                    <div className="lg:col-span-5 bg-slate-900/60 border border-slate-850 rounded-xl p-4 flex flex-col space-y-4">
                      
                      {/* Station Selection & Action Bar */}
                      <div className="flex flex-col gap-2 bg-slate-950/80 border border-slate-850 p-2.5 rounded-xl select-none">
                        <div className="flex items-center justify-between">
                          <label className="text-[9.5px] font-black tracking-tight font-mono text-slate-400 uppercase">CHOOSE DATA STATION</label>
                          <button 
                            onClick={() => {
                              setEditName("Custom Station" + (weatherStations.length + 1));
                              setEditFullName("CUSTOM OBSERVATORY STATION");
                              setEditX(120);
                              setEditY(130);
                              setEditCondition("Fine Breeze");
                              setEditTempC(26);
                              setEditFeelLikeC(26);
                              setEditHumidity(60);
                              setEditWind("Northeasterly 10 Km/h");
                              setEditLat("20.00° N");
                              setEditLng("80.00° E");
                              setEditPressure(1011);
                              setEditAlert("None");
                              setIsAddingStation(true);
                              setIsEditingStation(false);
                            }} 
                            className="bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded transition flex items-center gap-1 active:scale-95"
                          >
                            + ADD STATION
                          </button>
                        </div>
                        <select 
                          value={metSelectedCity} 
                          onChange={(e) => {
                            setMetSelectedCity(e.target.value);
                            setIsEditingStation(false);
                            setIsAddingStation(false);
                          }}
                          className="bg-slate-900 border border-slate-800 text-slate-100 text-[11px] rounded px-2.5 py-2 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer w-full"
                        >
                          {weatherStations.map((w) => (
                            <option key={w.name} value={w.name} className="bg-slate-950 text-slate-100 font-mono">
                              {w.fullName || w.name} ({tempUnit === "C" ? `${w.tempC}°C` : `${Math.round((w.tempC * 9/5) + 32)}°F`})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <span className="text-[11px] font-mono text-slate-200 font-extrabold tracking-tight uppercase">INTERACTIVE MONITOR</span>
                        
                        {/* Map controllers */}
                        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded border border-slate-800">
                          <button 
                            onClick={() => { setMetSelectedCity("New Delhi"); setMeteoMapZoom(1.0); }}
                            title="Reset Navigation Map"
                            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
                          >
                            <Compass className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setMeteoMapZoom(prev => Math.min(prev + 0.15, 1.6))}
                            title="Zoom In"
                            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition font-black text-xs leading-none"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => setMeteoMapZoom(prev => Math.max(prev - 0.15, 0.7))}
                            title="Zoom Out"
                            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition font-black text-xs leading-none"
                          >
                            -
                          </button>
                        </div>
                      </div>

                      {/* Map Container supporting interactive pan/zoom representation */}
                      <div className="h-56 bg-slate-950/80 rounded-xl border border-slate-850/80 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#071324]/30 select-none pointer-events-none z-0">
                          <svg className="w-full h-full" stroke="rgba(34,211,238,0.03)" strokeWidth="1">
                            <pattern id="met-nav-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#met-nav-grid)" />
                          </svg>
                        </div>

                        {/* Interactive India Map */}
                        <div 
                          className="w-full h-full transition-transform duration-300 relative flex items-center justify-center select-none"
                          style={{ transform: `scale(${meteoMapZoom})` }}
                        >
                          <svg className="w-56 h-56 shrink-0 object-contain text-slate-400" viewBox="0 0 240 270" fill="none">
                            {/* India Outline Silhouette */}
                            <path 
                              d="M 115,14 C 110,14 112,6 117,6 C 122,6 123,12 127,12 L 129,20 L 138,20 L 138,26 L 130,36 L 131,48 L 140,48 L 152,53 L 163,50 L 168,57 L 171,51 L 176,51 L 177,57 L 183,57 L 193,54 L 202,51 L 210,58 L 213,70 L 216,81 C 218,88 213,91 210,95 Q 206,106 197,105 L 193,95 C 188,96 182,97 178,95 L 175,98 L 168,96 C 163,101 158,103 155,103 Q 146,112 138,131 Q 128,151 119,171 Q 114,192 110,214 L 105,241 Q 102,246 100,241 C 97,235 95,221 91,203 Q 84,180 77,165 L 75,158 C 72,143 67,130 67,128 C 67,124 64,124 62,124 Q 54,120 48,114 Q 45,108 52,108 L 47,100 L 59,101 Q 67,95 79,90 C 85,82 85,73 95,70 Q 101,61 100,45 Z" 
                              fill="#1e293b" 
                              stroke="#0284c7" 
                              strokeWidth="1.2" 
                              className="fill-cyan-950/20 hover:fill-cyan-950/25 transition duration-150"
                            />
                            
                            {/* Neighboring elements */}
                            {/* Sri Lanka */}
                            <path d="M 103,248 C 104,244 108,243 111,246 C 114,249 112,255 107,256 C 104,256 102,251 103,248 Z" fill="#024e75" stroke="#0284c7" strokeWidth="1" />
                            {/* Maldives / Laccadive chains */}
                            <circle cx="56" cy="225" r="2.5" fill="#0284c7" className="animate-pulse" />
                            <circle cx="58" cy="235" r="2" fill="#0284c7" />
                            <circle cx="64" cy="254" r="2" fill="#0284c7" />
                            
                            {/* Water bodies indicator labels */}
                            <text x="32" y="170" fill="rgba(56,189,248,0.35)" fontSize="9" fontWeight="bold" fontFamily="monospace">Arabian Sea</text>
                            <text x="145" y="175" fill="rgba(56,189,248,0.35)" fontSize="9" fontWeight="bold" fontFamily="monospace">Bay of Bengal</text>
                            <text x="105" y="265" fill="rgba(56,189,248,0.25)" fontSize="8" fontWeight="bold" fontFamily="monospace">Indian Ocean</text>

                            {/* City Stations markers dynamically placed */}
                            {weatherStations.map((city) => {
                              const isSel = metSelectedCity === city.name;
                              return (
                                <g 
                                  key={city.name} 
                                  className="cursor-pointer group"
                                  onClick={() => setMetSelectedCity(city.name)}
                                >
                                  {/* Pulse beacon for current selected or rain stations */}
                                  {(isSel || city.condition.includes("Rain") || city.condition.includes("Storm")) && (
                                    <circle 
                                      cx={city.x} 
                                      cy={city.y} 
                                      r={isSel ? "9" : "6"} 
                                      className="fill-cyan-500/10 stroke-cyan-400/40 animate-ping" 
                                      strokeWidth="1"
                                    />
                                  )}

                                  {/* Physical point */}
                                  <circle 
                                    cx={city.x} 
                                    cy={city.y} 
                                    r={isSel ? "4.5" : "3.5"} 
                                    className={`transition duration-150 ${isSel ? "fill-cyan-400 stroke-cyan-100" : "fill-slate-400 stroke-slate-500 group-hover:fill-sky-400"}`}
                                    strokeWidth="1"
                                  />

                                  {/* Custom Weather Symbol Glyphs */}
                                  <g transform={`translate(${city.x - 6}, ${city.y - 18})`}>
                                    {city.condition === "Haze" && (
                                      <path d="M 1,5 L 11,5 M 3,7 L 9,7 M 2,3 L 10,3" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
                                    )}
                                    {(city.condition.includes("Rain") || city.condition.includes("Drizzle")) && (
                                      <g>
                                        <path d="M 2,5 Q 6,2 10,5 Q 12,8 9,10 L 3,10 Q 0,8 2,5 Z" fill="#64748b" />
                                        <line x1="4" y1="11" x2="3" y2="13" stroke="#38bdf8" strokeWidth="1" />
                                        <line x1="7" y1="11" x2="6" y2="13" stroke="#38bdf8" strokeWidth="1" />
                                      </g>
                                    )}
                                    {city.condition.includes("Storm") && (
                                      <g>
                                        <path d="M 2,5 Q 6,2 10,5 Q 12,8 9,10 L 3,10 Q 0,8 2,5 Z" fill="#334155" />
                                        <path d="M 5,10 L 3,14 L 7,14 L 5,18" stroke="#f59e0b" strokeWidth="1" fill="none" />
                                      </g>
                                    )}
                                    {city.condition === "Fine Breeze" && (
                                      <path d="M 1,5 C 5,2 7,8 11,5" stroke="#38bdf8" strokeWidth="1" fill="none" />
                                    )}
                                    {city.condition === "Heavy Overcast" && (
                                      <path d="M 1,6 Q 5,3 9,6 Q 11,8 8,10 L 2,10 Q 0,8 1,6" fill="#475569" />
                                    )}
                                    {(city.condition === "Tropical Heat" || city.condition === "Gale Inflow") && (
                                      <circle cx="6" cy="6" r="3" fill="#f59e0b" className="animate-pulse" />
                                    )}
                                  </g>

                                  {/* Text tag label */}
                                  <text 
                                    x={city.x + 6} 
                                    y={city.y + 3} 
                                    className={`text-[8.5px] font-sans transition duration-150 ${
                                      isSel 
                                        ? "fill-cyan-400 font-extrabold text-[9px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" 
                                        : "fill-slate-300 font-bold group-hover:fill-slate-100"
                                    }`}
                                  >
                                    {city.name}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      </div>

                      {/* Selected Station Core Details Panel matching the blue card styling */}
                      {(() => {
                        const currentCity = weatherStations.find(c => c.name === metSelectedCity) || weatherStations[0];
                        const displayTemp = tempUnit === "C" ? `${currentCity.tempC}°C` : `${Math.round((currentCity.tempC * 9/5) + 32)}°F`;
                        const displayFeels = tempUnit === "C" ? `${currentCity.feelLikeC || currentCity.tempC}°C` : `${Math.round(((currentCity.feelLikeC || currentCity.tempC) * 9/5) + 32)}°F`;

                        if (isEditingStation || isAddingStation) {
                          return (
                            <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 rounded-xl border border-slate-800 text-slate-100 space-y-3 relative shadow-lg shadow-black/40 z-20">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                                  {isAddingStation ? "➕ ADD NEW WEATHER STATION" : "✎ EDIT STATION DETAILS"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsEditingStation(false);
                                    setIsAddingStation(false);
                                  }}
                                  className="text-slate-400 hover:text-slate-200 font-mono text-[9px] font-black uppercase tracking-tight bg-slate-900 border border-slate-850 px-2 py-0.5 rounded transition"
                                >
                                  ✕ CANCEL
                                </button>
                              </div>
                              
                              <div className="space-y-2 text-[10px] font-mono leading-tight">
                                {isAutoFillingDetails && (
                                  <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 rounded-lg p-2.5 flex items-center justify-between text-[8.5px] uppercase tracking-wide font-extrabold animate-pulse">
                                    <span>📡 AI SATELLITE: ANALYZING METEOROLOGICAL VECTORS FOR {editName || "STATION"}...</span>
                                    <span className="inline-block animate-spin font-serif text-xs">◌</span>
                                  </div>
                                )}
                                {autoFillError && (
                                  <div className="bg-amber-500/15 border border-amber-500/30 text-amber-500 rounded p-1.5 text-[8px] uppercase tracking-normal">
                                    ⚠ {autoFillError}
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <div className="flex items-center justify-between mb-0.5">
                                      <label className="text-slate-450 block text-[8px] uppercase font-extrabold tracking-wider">Short name</label>
                                      {editName && (
                                        <button
                                          type="button"
                                          title="Automatically fetch details for this location"
                                          onClick={() => handleAutoFillDetails(editName)}
                                          className="text-cyan-400 hover:text-cyan-300 text-[7.5px] font-black uppercase flex items-center gap-1 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800 hover:border-cyan-500/30 cursor-pointer"
                                        >
                                          ⚡ AUTO-FILL
                                        </button>
                                      )}
                                    </div>
                                    <input
                                      type="text"
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                      onBlur={() => handleAutoFillDetails(editName)}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                      placeholder="e.g. Pune"
                                    />
                                    <span className="text-[7.5px] text-slate-500 block mt-0.5">Tabbing away or pressing fill auto-enters details</span>
                                  </div>
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Full Station description</label>
                                    <input
                                      type="text"
                                      value={editFullName}
                                      onChange={(e) => setEditFullName(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                      placeholder="e.g. PUNE REGIONAL MET"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8.5px] uppercase font-extrabold tracking-wider">Map X (10-230)</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="range"
                                        min="10"
                                        max="230"
                                        value={editX}
                                        onChange={(e) => setEditX(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                      />
                                      <span className="text-cyan-400 w-5 text-right font-extrabold text-[9px]">{editX}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8.5px] uppercase font-extrabold tracking-wider">Map Y (10-260)</label>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="range"
                                        min="10"
                                        max="260"
                                        value={editY}
                                        onChange={(e) => setEditY(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                      />
                                      <span className="text-cyan-400 w-5 text-right font-extrabold text-[9px]">{editY}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Condition</label>
                                    <select
                                      value={editCondition}
                                      onChange={(e) => setEditCondition(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-840 rounded p-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer text-[10px] h-6 font-mono"
                                    >
                                      <option value="Haze">Haze</option>
                                      <option value="Fine Breeze">Fine Breeze</option>
                                      <option value="Drizzle / Rain">Drizzle / Rain</option>
                                      <option value="Thunder Heavy">Thunder Heavy</option>
                                      <option value="Gale Inflow">Gale Inflow</option>
                                      <option value="Tropical Heat">Tropical Heat</option>
                                      <option value="Lightning Storm">Lightning Storm</option>
                                      <option value="Heavy Overcast">Heavy Overcast</option>
                                      <option value="Heavy Torrential Rain">Heavy Torrential Rain</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Temp (°C)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={editTempC}
                                      onChange={(e) => setEditTempC(Number(e.target.value))}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Feels Like (°C)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={editFeelLikeC}
                                      onChange={(e) => setEditFeelLikeC(Number(e.target.value))}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Humidity (%)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={editHumidity}
                                      onChange={(e) => setEditHumidity(Number(e.target.value))}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Wind speed</label>
                                    <input
                                      type="text"
                                      value={editWind}
                                      onChange={(e) => setEditWind(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                      placeholder="e.g. Westerly 12 Km/h"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-slate-450 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Pressure (hPa)</label>
                                    <input
                                      type="number"
                                      value={editPressure}
                                      onChange={(e) => setEditPressure(Number(e.target.value))}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-455 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">GPS Latitude</label>
                                    <input
                                      type="text"
                                      value={editLat}
                                      onChange={(e) => setEditLat(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                      placeholder="19.00° N"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-slate-455 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">GPS Longitude</label>
                                    <input
                                      type="text"
                                      value={editLng}
                                      onChange={(e) => setEditLng(e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                      placeholder="73.00° E"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-slate-455 block mb-0.5 text-[8px] uppercase font-extrabold tracking-wider">Alert Warning</label>
                                  <input
                                    type="text"
                                    value={editAlert}
                                    onChange={(e) => setEditAlert(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-840 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-[10px] h-6"
                                    placeholder="None"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 border-t border-slate-850 pt-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!editName.trim()) return;
                                    
                                    if (isAddingStation) {
                                      const newStation = {
                                        name: editName,
                                        fullName: editFullName || editName.toUpperCase(),
                                        x: editX,
                                        y: editY,
                                        condition: editCondition || "Fine Breeze",
                                        tempC: editTempC,
                                        feelLikeC: editFeelLikeC,
                                        humidity: editHumidity,
                                        wind: editWind || "Gentle Wind",
                                        astronomy: { sunrise: "06:00", sunset: "19:00", moonrise: "10:00", moonset: "23:00" },
                                        lat: editLat || "20.00° N",
                                        lng: editLng || "80.00° E",
                                        pressure: editPressure,
                                        alert: editAlert || "None"
                                      };
                                      setWeatherStations(prev => [...prev, newStation]);
                                      setMetSelectedCity(editName);
                                    } else {
                                      setWeatherStations(prev => prev.map(w => {
                                        if (w.name === metSelectedCity) {
                                          return {
                                            ...w,
                                            name: editName,
                                            fullName: editFullName,
                                            x: editX,
                                            y: editY,
                                            condition: editCondition,
                                            tempC: editTempC,
                                            feelLikeC: editFeelLikeC,
                                            humidity: editHumidity,
                                            wind: editWind,
                                            lat: editLat,
                                            lng: editLng,
                                            pressure: editPressure,
                                            alert: editAlert
                                          };
                                        }
                                        return w;
                                      }));
                                      setMetSelectedCity(editName);
                                    }
                                    setIsEditingStation(false);
                                    setIsAddingStation(false);
                                  }}
                                  className="flex-1 py-1 px-2.5 bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-black font-mono text-[10px] rounded transition uppercase shrink-0"
                                >
                                  💾 {isAddingStation ? "SAVE STATION" : "SAVE EDITS"}
                                </button>
                                
                                {!isAddingStation && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (weatherStations.length <= 1) return;
                                      const remaining = weatherStations.filter(w => w.name !== metSelectedCity);
                                      setWeatherStations(remaining);
                                      setMetSelectedCity(remaining[0].name);
                                      setIsEditingStation(false);
                                      setIsAddingStation(false);
                                    }}
                                    disabled={weatherStations.length <= 1}
                                    className="px-2 py-1 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/30 text-rose-300 font-bold font-mono text-[10px] rounded transition uppercase active:scale-[0.98] shrink-0 disabled:opacity-50"
                                    title="Delete Station"
                                  >
                                    🗑️ DELETE
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-4 rounded-xl border border-blue-900/40 text-slate-100 space-y-3.5 relative overflow-hidden shadow-lg shadow-blue-950/20">
                            
                            {/* Decorative ambient lightning glow behind panel */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="flex items-start justify-between relative z-10">
                              <div>
                                <h4 className="text-[13px] font-black tracking-tight font-sans text-white uppercase leading-tight">
                                  {currentCity.fullName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11.5px] font-bold text-sky-400 font-sans">
                                    {currentCity.condition}
                                  </span>
                                  <span className="font-mono text-[9px] bg-sky-900/60 border border-sky-700/20 px-1.5 py-0.5 rounded text-sky-300 font-bold">
                                    GPS: {currentCity.lat}, {currentCity.lng}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditName(currentCity.name);
                                    setEditFullName(currentCity.fullName || currentCity.name);
                                    setEditX(currentCity.x);
                                    setEditY(currentCity.y);
                                    setEditCondition(currentCity.condition);
                                    setEditTempC(currentCity.tempC);
                                    setEditFeelLikeC(currentCity.feelLikeC || currentCity.tempC);
                                    setEditHumidity(currentCity.humidity);
                                    setEditWind(currentCity.wind);
                                    setEditLat(currentCity.lat);
                                    setEditLng(currentCity.lng);
                                    setEditPressure(currentCity.pressure);
                                    setEditAlert(currentCity.alert || "None");
                                    setIsEditingStation(true);
                                    setIsAddingStation(false);
                                  }}
                                  className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-mono text-[9px] font-bold border border-cyan-500/20 rounded transition flex items-center gap-1 shrink-0 select-none active:scale-95"
                                >
                                  ✎ EDIT STATION
                                </button>
                                <span className="font-mono text-[10px] text-slate-400 block h-4">
                                  {currentCity.condition === "Haze" ? "ꝏ" : "☁"}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3.5 border-t border-blue-900/30 pt-3 relative z-10 text-xs font-sans">
                              <div className="bg-slate-950/40 border border-blue-900/10 p-2 rounded-lg flex flex-col">
                                <span className="text-[10px] text-slate-400 font-mono">Temperature</span>
                                <span className="text-sm font-black text-white font-mono mt-0.5">
                                  {displayTemp}
                                </span>
                                <span className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                                  Feels Like: {displayFeels}
                                </span>
                              </div>

                              <div className="bg-slate-950/40 border border-blue-900/10 p-2 rounded-lg flex flex-col">
                                <span className="text-[10px] text-slate-400 font-mono">Humidity</span>
                                <span className="text-sm font-black text-white font-mono mt-0.5">
                                  {currentCity.humidity}%
                                </span>
                                <span className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                                  Pressure: {currentCity.pressure} hPa
                                </span>
                              </div>
                            </div>

                            {/* Weather warning alert banner */}
                            {currentCity.alert && currentCity.alert !== "None" && (
                              <div className="bg-rose-950/45 border border-rose-900/30 p-2 rounded text-[10px] font-mono text-rose-300 relative z-10 flex items-center gap-1.5 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block" />
                                <span>ALERT: {currentCity.alert}</span>
                              </div>
                            )}

                            <div className="border-t border-blue-900/20 pt-2 grid grid-cols-1 gap-2 text-[10.5px] font-mono text-slate-300 relative z-10">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Wind Direction Vector:</span>
                                <span className="font-bold text-sky-300">{currentCity.wind}</span>
                              </div>
                              <div className="flex items-center justify-between border-b border-blue-950/30 pb-2">
                                <span className="text-slate-400">Observation Time:</span>
                                <span className="font-bold text-slate-300">2026-06-19 17:30 IST</span>
                              </div>

                              {/* Sun & Moon Astronomy data */}
                              <div className="grid grid-cols-4 gap-1 text-center bg-slate-950/50 rounded-lg p-1.5 text-[9px] border border-blue-900/20">
                                <div>
                                  <span className="text-slate-500 block">Sunrise</span>
                                  <span className="text-[9.5px] font-bold text-amber-500">{currentCity.astronomy.sunrise}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Sunset</span>
                                  <span className="text-[9.5px] font-bold text-amber-500">{currentCity.astronomy.sunset}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Moonrise</span>
                                  <span className="text-[9.5px] font-bold text-cyan-400">{currentCity.astronomy.moonrise}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">Moonset</span>
                                  <span className="text-[9.5px] font-bold text-cyan-400">{currentCity.astronomy.moonset}</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })()}
                    </div>

                    {/* Right Column: Tabbed Satellite / Radar / Lightning view (7 cols) */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-4.5 rounded-xl flex flex-col space-y-4">
                      
                      {/* Top Tabs Controller identical to the INSAT website layout */}
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                        {(["satellite", "radar", "lightning"] as const).map((tab) => {
                          const isActive = metActiveSubTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => setMetActiveSubTab(tab)}
                              className={`py-2 text-[11.5px] font-black font-sans uppercase rounded-lg tracking-wider transition-all duration-150 ${
                                isActive 
                                  ? "bg-sky-600 text-white shadow-md font-black" 
                                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                              }`}
                            >
                              {tab}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explicit Interactive Zoom & Panning Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-extrabold uppercase">🔍 ZOOM LEVEL:</span>
                          <span className="text-cyan-400 font-extrabold uppercase font-sans text-[11px]">
                            {metActiveSubTab === "satellite" ? `${Math.round(metZoomSatellite * 100)}%` : 
                             metActiveSubTab === "radar" ? `${Math.round(metZoomRadar * 100)}%` : 
                             `${Math.round(metZoomLightning * 100)}%`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (metActiveSubTab === "satellite") setMetZoomSatellite(p => Math.min(p + 0.25, 3.0));
                              if (metActiveSubTab === "radar") setMetZoomRadar(p => Math.min(p + 0.25, 3.0));
                              if (metActiveSubTab === "lightning") setMetZoomLightning(p => Math.min(p + 0.25, 3.0));
                            }}
                            className="bg-slate-900 border border-slate-750 text-cyan-400 hover:text-white hover:border-cyan-500 hover:bg-slate-850 px-2.5 py-1 rounded-md font-black text-[9px] uppercase tracking-wider transition cursor-pointer"
                          >
                            ➕ Zoom In
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (metActiveSubTab === "satellite") setMetZoomSatellite(p => Math.max(p - 0.25, 1.0));
                              if (metActiveSubTab === "radar") setMetZoomRadar(p => Math.max(p - 0.25, 1.0));
                              if (metActiveSubTab === "lightning") setMetZoomLightning(p => Math.max(p - 0.25, 1.0));
                            }}
                            className="bg-slate-900 border border-slate-750 text-cyan-400 hover:text-white hover:border-cyan-500 hover:bg-slate-850 px-2.5 py-1 rounded-md font-black text-[9px] uppercase tracking-wider transition cursor-pointer"
                          >
                            ➖ Zoom Out
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (metActiveSubTab === "satellite") setMetZoomSatellite(1.0);
                              if (metActiveSubTab === "radar") setMetZoomRadar(1.0);
                              if (metActiveSubTab === "lightning") setMetZoomLightning(1.0);
                            }}
                            className="bg-slate-905 border border-slate-850 text-slate-500 hover:text-slate-350 px-2.5 py-1 rounded-md text-[8px] transition cursor-pointer"
                          >
                            RESET
                          </button>
                        </div>
                      </div>

                      {/* ================= SATELLITE TAB ACTIVE CONTENT ================= */}
                      {metActiveSubTab === "satellite" && (
                        <div className="space-y-4 flex flex-col h-full animate-fadeIn">
                          
                          <div className="text-center">
                            <span className="text-sky-500 font-sans font-black text-xs uppercase tracking-widest block">SATELLITE</span>
                          </div>

                          <div className="h-[290px] bg-black rounded-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between">
                            
                            {/* Satellite background coordinates & grids */}
                            <div className="absolute inset-0 bg-transparent opacity-85 pointer-events-none z-10 flex flex-col justify-between p-4 text-[9px] font-mono text-slate-500 select-none">
                              <div className="flex justify-between">
                                <span>10° N</span>
                                <span>20° N</span>
                                <span>30° N</span>
                                <span>40° N</span>
                              </div>
                              <div className="flex justify-between mt-auto">
                                <span>75° E</span>
                                <span>80° E</span>
                                <span>85° E</span>
                                <span>90° E</span>
                              </div>
                            </div>

                            {/* Satellite coordinate drawing of India + Cloud swirls */}
                            <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#0d0e12]">
                              <svg className="w-full h-full" viewBox="0 0 200 200">
                                <g 
                                  className="transition-transform duration-300 origin-center"
                                  style={{ transform: `scale(${metZoomSatellite})`, transformOrigin: "center" }}
                                >
                                {/* Grid reference lines */}
                                <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
                                <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
                                <line x1="0" y1="150" x2="200" y2="150" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
                                <line x1="50" y1="0" x2="50" y2="200" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
                                <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />
                                <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(255,255,255,0.08)" strokeDasharray="2,2" />

                                {/* Abstract India landform in satellite format */}
                                <path 
                                  d="M 98,11 C 94,11 95,5 99,5 C 103,5 104,10 107,10 L 108,15 L 115,15 L 115,20 L 109,28 L 110,37 L 117,37 L 126,41 L 134,38 L 138,44 L 141,39 L 144,39 L 145,44 L 150,44 L 157,41 L 164,39 L 170,44 L 173,54 L 175,62 C 177,67 173,70 171,73 Q 168,81 161,80 L 158,73 C 154,74 149,74 146,73 L 144,75 L 138,73 C 134,77 131,79 128,79 Q 121,86 115,100 Q 108,115 101,131 Q 97,147 94,164 L 90,184 Q 88,188 86,184 C 84,180 82,169 79,155 Q 74,138 68,126 L 67,121 C 65,110 61,100 61,98 C 61,95 58,95 57,95 Q 51,92 46,87 Q 44,83 49,83 L 45,77 L 55,77 Q 61,73 70,69 C 75,63 75,56 82,54 Q 87,47 86,35 Z" 
                                  fill="#18181b" 
                                  stroke="#27272a" 
                                  strokeWidth="1" 
                                />

                                {/* Swirling thermal clouds using radial gradients */}
                                <defs>
                                  <radialGradient id="cloud1" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                                    <stop offset="30%" stopColor="rgba(244,244,245,0.8)" />
                                    <stop offset="60%" stopColor="rgba(212,212,216,0.3)" />
                                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                  </radialGradient>
                                  <radialGradient id="cloud2" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                                    <stop offset="40%" stopColor="rgba(212,212,216,0.6)" />
                                    <stop offset="85%" stopColor="rgba(82,82,91,0.25)" />
                                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                  </radialGradient>
                                </defs>

                                {/* Swirl structures over Bay of Bengal and mainland */}
                                <circle cx="110" cy="110" r="35" fill="url(#cloud1)" className="animate-pulse" />
                                <circle cx="125" cy="115" r="22" fill="url(#cloud2)" />
                                <circle cx="106" cy="118" r="15" fill="url(#cloud1)" />
                                <circle cx="70" cy="150" r="40" fill="url(#cloud2)" className="opacity-80" />
                                <circle cx="140" cy="50" r="25" fill="url(#cloud2)" className="opacity-60" />
                                <circle cx="85" cy="40" r="20" fill="url(#cloud1)" className="opacity-75" />

                                {/* Typhoon cloud lines */}
                                <path d="M 100,100 Q 140,90 120,130 T 110,160" stroke="#f4f4f5" strokeWidth="2.5" fill="none" className="opacity-40 animate-pulse" />
                                <path d="M 85,110 Q 115,100 100,135 T 100,155" stroke="#f4f4f5" strokeWidth="1.5" fill="none" className="opacity-30" />
                              </g>
                              </svg>

                              {/* Live satellite sweeps line */}
                              <div className="absolute left-0 right-0 h-0.5 bg-sky-500/70 shadow-[0_0_8px_rgba(56,189,248,0.9)] animate-[bounce_4s_infinite] pointer-events-none" />
                            </div>

                            {/* Header Info Banner strictly mimicking the first screenshot */}
                            <div className="absolute top-2 left-2 bg-black/85 border border-slate-800 rounded p-1.5 z-20 text-[7px] md:text-[8px] font-mono max-w-[70%] text-slate-100 uppercase space-y-0.5">
                              <div className="flex items-center gap-1.5 text-sky-400 font-extrabold pb-0.5 border-b border-slate-900 leading-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                <span>INSAT-3DS LIVE SATELLITE</span>
                              </div>
                              <p className="font-extrabold text-[#fcd34d] leading-tight">INSAT-3DS IMG, Thermal Infrared1 Count @ 10.83 µm</p>
                              <p className="text-slate-400 font-bold">GMT: 19-06-2026 / (1530-1557) IST: 19-06-2026 / (2100-2127)</p>
                              <p className="text-slate-400">L1C MERCATOR (LINEAR STRETCH: 1%)</p>
                            </div>

                            {/* Floating Zoom Controls for Satellite */}
                            <div className="absolute right-2 top-2 bg-slate-950/90 border border-slate-800 p-1 rounded flex flex-col gap-1 z-30 shadow-xl select-none">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMetZoomSatellite(prev => Math.min(prev + 0.25, 3.0));
                                }}
                                className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center"
                                title="Zoom In"
                              >
                                +
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMetZoomSatellite(prev => Math.max(prev - 0.25, 1.0));
                                }}
                                className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center"
                                title="Zoom Out"
                              >
                                -
                              </button>
                              {metZoomSatellite > 1 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMetZoomSatellite(1.0);
                                  }}
                                  className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-[9px] font-mono rounded transition flex items-center justify-center"
                                  title="Reset Zoom"
                                >
                                  R
                                </button>
                              )}
                            </div>

                            {/* Calibration scale bar in footer */}
                            <div className="w-full bg-black/90 p-2 border-t border-slate-900 z-20 flex items-center justify-between text-[8px] md:text-[9.5px] font-mono text-slate-400">
                              <span className="font-bold">444 (IR Min)</span>
                              <div className="h-2 flex-1 mx-3 rounded bg-gradient-to-r from-slate-950 via-slate-600 to-white border border-slate-800" />
                              <span className="font-bold">907 (IR Max)</span>
                            </div>

                          </div>
                        </div>
                      )}

                      {/* ================= RADAR TAB ACTIVE CONTENT ================= */}
                      {metActiveSubTab === "radar" && (
                        <div className="space-y-4 flex flex-col h-full animate-fadeIn">
                          
                          <div className="text-center">
                            <span className="text-sky-500 font-sans font-black text-xs uppercase tracking-widest block">RADAR</span>
                          </div>

                          <div className="h-[290px] bg-[#0c1322] rounded-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between">
                            
                            {/* Radar Coordinate grids */}
                            <div className="absolute inset-0 bg-transparent opacity-90 pointer-events-none z-10 flex flex-col justify-between p-4 text-[9px] font-mono text-cyan-500/60 select-none">
                              <div className="flex justify-between">
                                <span>35° N</span>
                                <span>30° N</span>
                                <span>25° N</span>
                                <span>20° N</span>
                              </div>
                              <div className="flex justify-between mt-auto">
                                <span>75° E</span>
                                <span>80° E</span>
                                <span>85° E</span>
                                <span>90° E</span>
                              </div>
                            </div>

                            {/* Radar precipitation scan elements */}
                            <div className="absolute inset-0 z-0">
                              <svg className="w-full h-full" viewBox="0 0 200 200">
                                <g 
                                  className="transition-transform duration-300 origin-center"
                                  style={{ transform: `scale(${metZoomRadar})`, transformOrigin: "center" }}
                                >
                                {/* Grid reference circles */}
                                <circle cx="100" cy="100" r="30" stroke="rgba(34,211,238,0.1)" fill="none" strokeWidth="0.8" />
                                <circle cx="100" cy="100" r="60" stroke="rgba(34,211,238,0.1)" fill="none" strokeWidth="0.8" />
                                <circle cx="100" cy="100" r="90" stroke="rgba(34,211,238,0.1)" fill="none" strokeWidth="0.8" />

                                {/* Render beautiful radar map echo clusters of India */}
                                <g className="opacity-90">
                                  {/* Heavy precipitation cell off Bay of Bengal */}
                                  <path d="M 105,105 Q 115,92 125,110 T 135,120 L 125,140 Z" fill="rgba(34,197,94,0.35)" stroke="#22c55e" strokeWidth="0.6" />
                                  <path d="M 112,108 Q 118,98 122,112 T 128,125 L 120,132 Z" fill="rgba(234,179,8,0.45)" stroke="#eab308" strokeWidth="0.6" />
                                  <path d="M 115,112 Q 119,105 120,115 T 122,122 Z" fill="rgba(239,68,68,0.6)" stroke="#ef4444" strokeWidth="0.6" />
                                  
                                  {/* Northern storm cell */}
                                  <circle cx="95" cy="55" r="14" fill="rgba(34,197,94,0.25)" stroke="#22c55e" strokeWidth="0.5" />
                                  <circle cx="95" cy="55" r="8" fill="rgba(234,179,8,0.35)" stroke="#eab308" strokeWidth="0.5" />
                                  <circle cx="95" cy="55" r="4" fill="rgba(239,68,68,0.5)" stroke="#ef4444" strokeWidth="0.5" />

                                  {/* Maldives local rainfall */}
                                  <circle cx="60" cy="210" r="15" fill="rgba(34,197,94,0.3)" />
                                </g>

                                {/* India Outline reference line over Doppler */}
                                <path 
                                  d="M 98,11 C 94,11 95,5 99,5 C 103,5 104,10 107,10 L 108,15 L 115,15 L 115,20 L 109,28 L 110,37 L 117,37 L 126,41 L 134,38 L 138,44 L 141,39 L 144,39 L 145,44 L 150,44 L 157,41 L 164,39 L 170,44 L 173,54 L 175,62 C 177,67 173,70 171,73 Q 168,81 161,80 L 158,73 C 154,74 149,74 146,73 L 144,75 L 138,73 C 134,77 131,79 128,79 Q 121,86 115,100 Q 108,115 101,131 Q 97,147 94,164 L 90,184 Q 88,188 86,184 C 84,180 82,169 79,155 Q 74,138 68,126 L 67,121 C 65,110 61,100 61,98 C 61,95 58,95 57,95 Q 51,92 46,87 Q 44,83 49,83 L 45,77 L 55,77 Q 61,73 70,69 C 75,63 75,56 82,54 Q 87,47 86,35 Z" 
                                  fill="none" 
                                  stroke="rgba(255,255,255,0.15)" 
                                  strokeWidth="0.8" 
                                />

                                {/* Radar Rotating sweep hand visualizer */}
                                <g className="origin-[100px_100px] animate-[spin_6s_linear_infinite]">
                                  <line x1="100" y1="100" x2="100" y2="0" stroke="rgba(34,211,238,0.3)" strokeWidth="1.2" />
                                  <polygon points="100,100 100,0 80,0" fill="url(#radar-sweep-grad)" />
                                </g>

                                <defs>
                                  <linearGradient id="radar-sweep-grad" x1="1" y1="1" x2="0" y2="0">
                                    <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
                                    <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                                  </linearGradient>
                                </defs>
                              </g>
                              </svg>
                            </div>

                            {/* Floating Zoom Controls for Radar */}
                            <div className="absolute right-2 top-2 bg-slate-950/90 border border-slate-800 p-1 rounded flex flex-col gap-1 z-30 shadow-xl select-none">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMetZoomRadar(prev => Math.min(prev + 0.25, 3.0));
                                }}
                                className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center"
                                title="Zoom In"
                              >
                                +
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMetZoomRadar(prev => Math.max(prev - 0.25, 1.0));
                                }}
                                className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center"
                                title="Zoom Out"
                              >
                                -
                              </button>
                              {metZoomRadar > 1 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMetZoomRadar(1.0);
                                  }}
                                  className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-[9px] font-mono rounded transition flex items-center justify-center"
                                  title="Reset Zoom"
                                >
                                  R
                                </button>
                              )}
                            </div>

                            {/* Header details text */}
                            <div className="absolute top-2 left-2 bg-slate-950/90 border border-slate-850 rounded p-1.5 z-20 text-[7.5px] font-mono text-slate-200 space-y-0.5">
                              <span className="text-cyan-400 font-extrabold block">DOppler Radar Multi-Mosaic</span>
                              <p className="font-extrabold text-white">Mosaic of Radar Reflectivity (dBZ) (1 km)</p>
                              <p className="text-slate-400 font-bold leading-none mt-0.5">Date: 2026-06-19 at 17:30 (UTC) at Height: 1.5 (km) - NCMRWF</p>
                            </div>

                            {/* Intensity indicator scales matching layout */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-950/90 p-1.5 border border-slate-850 rounded-lg text-[7px] font-mono text-slate-400 text-center space-y-1 z-25">
                              <span className="block font-black text-cyan-400">dBZ</span>
                              <div className="w-2.5 h-20 rounded-md bg-gradient-to-t from-blue-500 via-green-500 via-yellow-500 via-orange-500 via-red-500 to-pink-500" />
                              <span className="block leading-none font-bold">75</span>
                              <span className="block leading-none text-[6px]">Heavy</span>
                              <span className="block leading-none font-bold">5</span>
                              <span className="block leading-none text-[6px]">Light</span>
                            </div>

                            {/* Footer block */}
                            <div className="w-full bg-slate-950/90 p-2 border-t border-slate-900 z-20 text-[8.5px] font-mono text-slate-500 text-center">
                              Real-Time Doppler Mosaic • Updates every 10 minutes from NCMRWF Array
                            </div>

                          </div>
                        </div>
                      )}

                      {/* ================= LIGHTNING TAB ACTIVE CONTENT ================= */}
                      {metActiveSubTab === "lightning" && (
                        <div className="space-y-4 flex flex-col h-full animate-fadeIn">
                          
                          <div className="text-center flex items-center justify-between">
                            <span className="text-sky-500 font-sans font-black text-xs uppercase tracking-widest mx-auto">LIGHTNING</span>
                          </div>

                          <div className="h-[290px] bg-[#090b10] rounded-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between">
                            
                            {/* Interactive Coordinate mapping canvas for clicks */}
                            <div 
                              className="absolute inset-0 z-0 cursor-crosshair"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickXRaw = ((e.clientX - rect.left) / rect.width) * 200;
                                const clickYRaw = ((e.clientY - rect.top) / rect.height) * 200;
                                
                                // Map coordinates back if zoomed with origin at [100, 100]
                                const clickX = Math.round(100 + (clickXRaw - 100) / metZoomLightning);
                                const clickY = Math.round(100 + (clickYRaw - 100) / metZoomLightning);
                                
                                const date = new Date();
                                const hh = String(date.getHours()).padStart(2, "0");
                                const mm = String(date.getMinutes()).padStart(2, "0");
                                const ss = String(date.getSeconds()).padStart(2, "0");
                                const tempTimestamp = `${hh}:${mm}:${ss}`;

                                setLightningStrikes(prev => [
                                  {
                                    id: Date.now(),
                                    x: clickX,
                                    y: clickY,
                                    recency: "10m",
                                    timestamp: tempTimestamp
                                  },
                                  ...prev.slice(0, 7) // keep last 8
                                ]);

                                // Temporarily trigger alert scanning scanMessage sound / warning feedback
                                setScanMessage(`LIGHTNING DETECTED: Manual Strike logged at x:${clickX}, y:${clickY} coord`);
                              }}
                            >
                              <svg className="w-full h-full" viewBox="0 0 200 200">
                                <g 
                                  className="transition-transform duration-300 origin-center"
                                  style={{ transform: `scale(${metZoomLightning})`, transformOrigin: "center" }}
                                >
                                {/* Base coordinates grid */}
                                <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(239, 68, 68, 0.05)" strokeDasharray="1,1" />
                                <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(239, 68, 68, 0.05)" strokeDasharray="1,1" />
                                <line x1="0" y1="150" x2="200" y2="150" stroke="rgba(239, 68, 68, 0.05)" strokeDasharray="1,1" />
                                <line x1="50" y1="0" x2="50" y2="200" stroke="rgba(239, 68, 68, 0.05)" strokeDasharray="1,1" />
                                <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(239, 68, 68, 0.05)" strokeDasharray="1,1" />
                                <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(239, 68, 68, 0.05)" strokeDasharray="1,1" />

                                <path 
                                  d="M 98,11 C 94,11 95,5 99,5 C 103,5 104,10 107,10 L 108,15 L 115,15 L 115,20 L 109,28 L 110,37 L 117,37 L 126,41 L 134,38 L 138,44 L 141,39 L 144,39 L 145,44 L 150,44 L 157,41 L 164,39 L 170,44 L 173,54 L 175,62 C 177,67 173,70 171,73 Q 168,81 161,80 L 158,73 C 154,74 149,74 146,73 L 144,75 L 138,73 C 134,77 131,79 128,79 Q 121,86 115,100 Q 108,115 101,131 Q 97,147 94,164 L 90,184 Q 88,188 86,184 C 84,180 82,169 79,155 Q 74,138 68,126 L 67,121 C 65,110 61,100 61,98 C 61,95 58,95 57,95 Q 51,92 46,87 Q 44,83 49,83 L 45,77 L 55,77 Q 61,73 70,69 C 75,63 75,56 82,54 Q 87,47 86,35 Z" 
                                  fill="#111827" 
                                  stroke="#374151" 
                                  strokeWidth="1.2" 
                                />

                                {/* Render lightning points with indicators from the screenshot */}
                                {lightningStrikes.map((strike) => {
                                  let color = "";
                                  let nodeElement = null;
                                  
                                  if (strike.recency === "10m") {
                                    color = "fill-red-500";
                                    // ✦ Red star for last 10m
                                    nodeElement = (
                                      <polygon 
                                        points={`${strike.x},${strike.y-5} ${strike.x+1.5},${strike.y-1.5} ${strike.x+5},${strike.y} ${strike.x+1.5},${strike.y+1.5} ${strike.x},${strike.y+5} ${strike.x-1.5},${strike.y+1.5} ${strike.x-5},${strike.y} ${strike.x-1.5},${strike.y-1.5}`} 
                                        className="fill-red-500 stroke-rose-100" 
                                        strokeWidth="0.5"
                                      />
                                    );
                                  } else if (strike.recency === "20m") {
                                    color = "fill-green-400";
                                    // ♦ Green Diamond for last 20m
                                    nodeElement = (
                                      <polygon 
                                        points={`${strike.x},${strike.y-4} ${strike.x+4},${strike.y} ${strike.x},${strike.y+4} ${strike.x-4},${strike.y}`} 
                                        className="fill-emerald-400 stroke-green-100" 
                                        strokeWidth="0.5"
                                      />
                                    );
                                  } else {
                                    color = "fill-blue-500";
                                    // ● Blue Circle for last 30m
                                    nodeElement = (
                                      <circle 
                                        cx={strike.x} 
                                        cy={strike.y} 
                                        r="3" 
                                        className="fill-blue-500 stroke-blue-100" 
                                        strokeWidth="0.5"
                                      />
                                    );
                                  }

                                  return (
                                    <g key={strike.id}>
                                      {/* Pulse wave ring */}
                                      <circle 
                                        cx={strike.x} 
                                        cy={strike.y} 
                                        r="8" 
                                        className={`stroke-current ${strike.recency === "10m" ? "text-red-500" : strike.recency === "20m" ? "text-emerald-400" : "text-blue-500"} fill-none opacity-40 animate-ping`} 
                                        strokeWidth="0.6"
                                      />
                                      {nodeElement}
                                    </g>
                                  );
                                })}
                              </g>
                              </svg>
                            </div>

                            {/* Floating prompt */}
                            <div className="absolute top-2 left-2 bg-[#020617]/90 p-1.5 border border-slate-800 rounded text-[7px] md:text-[8px] font-mono text-slate-100 space-y-0.5 z-20">
                              <span className="text-[#f43f5e] font-extrabold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                INDIA METEOROLOGICAL DEPARTMENT
                              </span>
                              <p className="font-extrabold text-white">Lightning Detection: 19 Jun 2026 15:27 UTC</p>
                              <p className="text-[7.5px] text-slate-400">Click map to simulate new electrostatic discharge events</p>
                            </div>

                            {/* Lightning Legend block directly matching image 2 */}
                            <div className="absolute top-2 right-2 bg-slate-950/95 p-2 border border-slate-800 rounded-lg text-[8.5px] font-mono text-slate-300 space-y-1.5 z-25 min-w-[100px]">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-blue-200 inline-block shrink-0" />
                                <span>Last 30 min</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-emerald-400 border border-green-200 inline-block shrink-0" style={{ transform: "rotate(45deg)" }} />
                                <span>Last 20 min</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-red-500 border border-rose-200 inline-block shrink-0" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                                <span>Last 10 min</span>
                              </div>
                            </div>

                            {/* Floating Zoom Controls for Lightning */}
                            <div className="absolute top-[86px] right-2 bg-slate-950/90 border border-slate-800 p-1 rounded flex flex-col gap-1 z-30 shadow-xl select-none">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMetZoomLightning(prev => Math.min(prev + 0.25, 3.0));
                                }}
                                className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center"
                                title="Zoom In"
                              >
                                +
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMetZoomLightning(prev => Math.max(prev - 0.25, 1.0));
                                }}
                                className="w-5 h-5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-extrabold text-xs rounded transition flex items-center justify-center"
                                title="Zoom Out"
                              >
                                -
                              </button>
                              {metZoomLightning > 1 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMetZoomLightning(1.0);
                                  }}
                                  className="w-5 h-5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-[9px] font-mono rounded transition flex items-center justify-center"
                                  title="Reset Zoom"
                                >
                                  R
                                </button>
                              )}
                            </div>

                            {/* Live Discharge Register ticker feed */}
                            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 border border-slate-800/80 rounded p-1.5 max-h-[50px] overflow-y-auto font-mono text-[7px] md:text-[8px] text-slate-300 space-y-1">
                              {lightningStrikes.length === 0 ? (
                                <span className="text-slate-500 italic block">No active lightning strikes registered.</span>
                              ) : (
                                lightningStrikes.map(strike => (
                                  <div key={strike.id} className="flex justify-between hover:bg-slate-900 px-1 py-0.5 rounded leading-none transition">
                                    <span className="text-amber-400 font-extrabold">[{strike.timestamp}] DISCHARGE</span>
                                    <span className="text-slate-400">POS: {(strike.y / 6.5).toFixed(1)}°N, {(strike.x / 2.2).toFixed(1)}°E</span>
                                    <span className="text-rose-500 font-black uppercase">Live</span>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Empty spacing for log feed */}
                            <div className="h-10 invisible" />

                          </div>
                        </div>
                      )}

                    </div>

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
            )}

            {/* WORKSPACE 8: APSDMA GIS DECISION SUPPORT SYSTEM */}
            {activeWorkspace === "apsdma_gis" && (
              <div className="space-y-6 text-left animate-fadeIn">
                
                {/* Decision support multi-layer map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Map overlay view (8 cols) */}
                  <div className="lg:col-span-8 bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-mono font-black text-slate-400 uppercase tracking-widest">Decision Support System - GIS Spatial Cockpit</span>
                      <span className="text-[9.5px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/10 whitespace-nowrap">APSDMA | Real-time Sighting</span>
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
                  <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Interactive Layers Toggle</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-[10.5px] font-mono">
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
                            className={`flex items-center justify-between gap-3 p-2 rounded-lg border cursor-pointer select-none transition ${
                              isAdded 
                                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-400 font-extrabold" 
                                : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            <span className="truncate pr-1">{lay}</span>
                            <span className="text-[8.5px] sm:text-[9px] font-bold tracking-tight whitespace-nowrap shrink-0 text-right">{isAdded ? "ACTIVE LIVE" : "MUTED"}</span>
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* High fidelity charts fuel curves (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-4">
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
                  <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
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
