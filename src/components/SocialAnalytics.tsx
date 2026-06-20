import React, { useState } from "react";
import { SocialTrend, HazardCategory } from "../types";
import { TrendingUp, BarChart2, Smile, AlertCircle, Heart, Search, MessageSquare, Compass, Calendar, Sparkles, Filter, Info } from "lucide-react";

interface SocialAnalyticsProps {
  socialTrends: SocialTrend[];
}

export default function SocialAnalytics({ socialTrends }: SocialAnalyticsProps) {
  const [selectedTrendTag, setSelectedTrendTag] = useState<string>("oil_slick_delta");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"24H" | "7D" | "30D" | "Custom">("7D");

  // Dynamically calculate trends based on selected time filter
  const getDynamicTrend = (trend: SocialTrend) => {
    const multipliers = {
      "24H": { vol: 1, pos: 1, neu: 1, neg: 1 },
      "7D": { vol: 5, pos: 0.9, neu: 1.1, neg: 1.2 },
      "30D": { vol: 20, pos: 0.7, neu: 1.2, neg: 1.5 },
      "Custom": { vol: 50, pos: 0.5, neu: 1.5, neg: 2 },
    };
    const mult = multipliers[timeFilter];
    return {
      ...trend,
      volume24h: Math.round(trend.volume24h * mult.vol),
      sentiment: {
        positive: Math.round(trend.sentiment.positive * mult.pos),
        neutral: Math.round(trend.sentiment.neutral * mult.neu),
        negative: Math.round(trend.sentiment.negative * mult.neg),
      },
    };
  };

  const currentTrend = getDynamicTrend(socialTrends.find((t) => t.keyword === selectedTrendTag) || socialTrends[0]);

  // Filter trends based on query
  const filteredTrends = socialTrends
    .map(getDynamicTrend)
    .filter(
      (t) =>
        t.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.topCategory.replace("_", " ").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getSentimentColor = (type: "positive" | "neutral" | "negative") => {
    switch (type) {
      case "positive": return "#10b981"; // Emerald
      case "neutral": return "#64748b"; // Slate
      case "negative": return "#ef4444"; // Red
    }
  };

  const getCategoryTheme = (category: HazardCategory) => {
    switch (category) {
      case "oil_spill": return { color: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/10" };
      case "coral_bleaching": return { color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/10" };
      case "illegal_fishing": return { color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" };
      case "toxic_algae": return { color: "text-pink-400", border: "border-pink-500/20", bg: "bg-pink-500/10" };
      case "severe_weather": return { color: "text-sky-400", border: "border-sky-500/20", bg: "bg-sky-500/10" };
      case "marine_debris": return { color: "text-slate-400", border: "border-slate-500/20", bg: "bg-slate-500/10" };
    }
  };

  // SVG parameters for Sentiment Donut
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  const totalSentiment = currentTrend.sentiment.positive + currentTrend.sentiment.neutral + currentTrend.sentiment.negative;
  const posPct = currentTrend.sentiment.positive / totalSentiment;
  const neuPct = currentTrend.sentiment.neutral / totalSentiment;
  const negPct = currentTrend.sentiment.negative / totalSentiment;

  const posOffset = 0;
  const neuOffset = posPct * circumference;
  const negOffset = (posPct + neuPct) * circumference;

  // Trend data points based on selected time filter (Simulated line heights)
  const getTrendLinePoints = () => {
    switch (timeFilter) {
      case "24H":
        return [
          { label: "00:00", val: 12 },
          { label: "04:00", val: 18 },
          { label: "08:00", val: 32 },
          { label: "12:00", val: 45 },
          { label: "16:00", val: 28 },
          { label: "20:00", val: 56 },
          { label: "24:00", val: 42 }
        ];
      case "7D":
        return [
          { label: "Mon", val: 24 },
          { label: "Tue", val: 45 },
          { label: "Wed", val: 15 },
          { label: "Thu", val: 78 },
          { label: "Fri", val: 52 },
          { label: "Sat", val: 91 },
          { label: "Sun", val: 74 }
        ];
      case "30D":
        return [
          { label: "W1", val: 110 },
          { label: "W2", val: 195 },
          { label: "W3", val: 140 },
          { label: "W4", val: 280 }
        ];
      case "Custom":
        return [
          { label: "May", val: 450 },
          { label: "Jun", val: 620 }
        ];
    }
  };

  const trendPoints = getTrendLinePoints();
  const maxVal = Math.max(...trendPoints.map(p => p.val), 1);

  // Regional comparisons (Phase 5)
  const regionalMetrics = [
    { region: "Sector Alpha-1 (Manila Basin)", alerts: 14, responseTime: "18m", threat: "High", color: "text-red-400" },
    { region: "Sector Bravo-2 (Reef Flats)", alerts: 26, responseTime: "24m", threat: "Critical", color: "text-amber-500" },
    { region: "Sector Delta-3 (Cargo Channel)", alerts: 6, responseTime: "15m", threat: "Moderate", color: "text-cyan-400" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 md:p-5 shadow-2xl space-y-6" id="social-analytics-panel">
      
      {/* Header section with Custom Scraper info + TIME FILTER SELECTOR (Phase 5) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest font-bold text-sky-400">
            <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
            <span>EXPERT HYDROGRAPHIC METRICS & TIMELINE FILTERS</span>
          </div>
          <h3 className="font-extrabold text-slate-100 font-heading text-lg tracking-tight mt-0.5">OCEAN ANALYTICS CORE</h3>
        </div>

        {/* TIME FILTERS BUTTONS (Phase 5) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-850 self-start md:self-auto">
          {(["24H", "7D", "30D", "Custom"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 text-[10.5px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                timeFilter === filter
                  ? "bg-cyan-500 text-slate-950 shadow-md scale-102"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: First row is Hashtag scrapper + Sentiment Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Keywords scrapper (5 columns) */}
        <div className="lg:col-span-5 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Trending Sighting Tags ({filteredTrends.length})
            </span>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filter hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg pl-7.5 pr-2 py-1 text-[10px] text-slate-250 outline-none focus:border-cyan-500 transition font-mono max-w-[130px]"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredTrends.map((trend) => {
              const theme = getCategoryTheme(trend.topCategory);
              const isSelected = selectedTrendTag === trend.keyword;

              return (
                <div
                  key={trend.keyword}
                  onClick={() => setSelectedTrendTag(trend.keyword)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-800 border-cyan-500 text-slate-200"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-semibold text-slate-200">
                      #{trend.keyword}
                    </span>
                    <span className={`text-[9.5px] mt-0.5 ${theme.color} uppercase tracking-wider font-semibold font-sans`}>
                      {trend.topCategory.replace("_", " ")}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block font-mono text-xs text-slate-200 font-bold">
                      {trend.volume24h.toLocaleString()} posts
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold bg-emerald-500/10 text-emerald-400">
                      +{trend.trendPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredTrends.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-500 font-mono">
                No matching hashtags found
              </div>
            )}
          </div>
        </div>

        {/* Sentiment breakdown (7 columns) */}
        <div className="lg:col-span-7 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between text-left space-y-4">
          <div>
            <span className="text-[9px] font-black text-cyan-450 font-mono uppercase tracking-widest block">
              #{currentTrend.keyword} TELEMETRY SENTIMENT SCAN
            </span>
            <h4 className="text-slate-100 font-bold font-heading text-sm mt-0.5 capitalize">
              Public Urgency Radar Breakdown ({timeFilter} Window)
            </h4>

            {/* Donut and Legend info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-4">
              
              {/* Donut Chart */}
              <div className="relative flex justify-center">
                <svg width="130" height="130" viewBox="0 0 150 150" className="transform -rotate-90">
                  <circle cx="75" cy="75" r={radius} fill="none" stroke="#0e1726" strokeWidth={strokeWidth} />
                  <circle cx="75" cy="75" r={radius} fill="none" stroke={getSentimentColor("positive")} strokeWidth={strokeWidth} strokeDashoffset={posOffset} strokeDasharray={`${posPct * circumference} ${circumference}`} />
                  <circle cx="75" cy="75" r={radius} fill="none" stroke={getSentimentColor("neutral")} strokeWidth={strokeWidth} strokeDasharray={`${neuPct * circumference} ${circumference}`} strokeDashoffset={-neuOffset} />
                  <circle cx="75" cy="75" r={radius} fill="none" stroke={getSentimentColor("negative")} strokeWidth={strokeWidth} strokeDasharray={`${negPct * circumference} ${circumference}`} strokeDashoffset={-negOffset} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-slate-150 font-mono">
                    {Math.round(negPct * 100)}%
                  </span>
                  <span className="text-[9px] text-red-400 font-mono font-bold">NEGATIVE</span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-850">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-slate-300 font-mono">Urgent Alert / Distress</span>
                  </div>
                  <strong className="text-red-400 font-mono">{Math.round(negPct * 100)}%</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-850">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-slate-300 font-mono">Inquisitive Inquiry</span>
                  </div>
                  <strong className="text-slate-400 font-mono">{Math.round(neuPct * 100)}%</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-850">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-300 font-mono">Accredited Helpful Info</span>
                  </div>
                  <strong className="text-emerald-400 font-mono">{Math.round(posPct * 100)}%</strong>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-850 text-[11px] text-slate-350 leading-relaxed font-sans">
            🚨 <strong>AI SENTINEL INTERPRETATION:</strong> Keyword analysis surrounding <strong>#{currentTrend.keyword}</strong> indicates public anxiety. High priority requested for Sector coordinates tracking reef environments.
          </div>
        </div>

      </div>

      {/* Second row: Trend Graphs Chart & Region Comparisons (Phase 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Trend line Graphs (7 columns) */}
        <div className="lg:col-span-7 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black font-mono text-cyan-400 block uppercase">
                SATELLITE INCIDENT DISPATCH VOLUMES
              </span>
              <h4 className="font-bold text-slate-100 text-sm font-heading">
                Temporal Trend Graph ({timeFilter} Window)
              </h4>
            </div>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 text-cyan-400 border border-slate-800 font-mono rounded">
              TOTAL RECORDED INCREMENT
            </span>
          </div>

          {/* Premium Custom SVG bar / line graph chart representation */}
          <div className="h-44 w-full bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col justify-between p-4 relative overflow-hidden">
            
            {/* Background glowing sweep grid */}
            <div className="absolute inset-0 bg-marineGrid opacity-10 pointer-events-none" />

            <div className="flex-1 flex items-end justify-between gap-2.5 pt-4">
              {trendPoints.map((point, index) => {
                const heightPct = (point.val / maxVal) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                    
                    {/* Hover tooltip value count block */}
                    <span className="absolute top-[-10px] bg-slate-950 text-cyan-400 text-[9px] font-mono px-1.5 py-0.2 rounded border border-cyan-850 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-150">
                      {point.val} logs
                    </span>

                    {/* SVG column bar indicator */}
                    <div className="w-full bg-cyan-500/10 hover:bg-cyan-500/25 border-t border-cyan-500/30 rounded-t-md transition-all duration-300" style={{ height: `${heightPct * 0.75}%` }} />

                    {/* Bottom axis coordinate descriptor label */}
                    <span className="text-[8.5px] font-mono text-slate-500 mt-2 font-bold block truncate max-w-full">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Region Comparisons stats (5 columns) */}
        <div className="lg:col-span-5 bg-slate-950/50 border border-slate-850 rounded-2xl p-5 text-left space-y-3">
          <span className="text-[9px] font-black font-mono text-indigo-400 block uppercase">
            REGIONAL DENSITY ASSESSMENT MATRIX
          </span>
          <h4 className="font-bold text-slate-100 text-sm font-heading">
            Sectors Threat Comparison
          </h4>

          <div className="space-y-2 text-xs font-sans mt-3">
            {regionalMetrics.map((met, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-850 hover:bg-slate-900 transition">
                <div>
                  <h5 className="font-bold text-slate-200">{met.region}</h5>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Response Target: {met.responseTime}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-black ${
                    met.threat === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    met.threat === "High" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                    "bg-cyan-505/10 text-cyan-400 border border-cyan-500/20"
                  }`}>
                    {met.threat}
                  </span>
                  <span className="block text-[9px] text-slate-450 font-mono mt-1 font-bold">{met.alerts} Active Logs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
