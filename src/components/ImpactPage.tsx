import React from "react";
import { Compass, Users, Heart, AlertTriangle, Clock, ShieldCheck, HelpCircle, Landmark } from "lucide-react";

export default function ImpactPage() {
  const analyticsCards = [
    {
      title: "PRESERVED MARITIME DOMAIN",
      value: "14,350 sq km",
      desc: "Protected coral lagoon sectors and deep anchorage lines fully mapped with daily overwatch tracking.",
      icon: Compass,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
    },
    {
      title: "CROWD OBSERVATION NETWORK",
      value: "1,842 Active",
      desc: "Accredited local fishermen, diving guides, coast guard observers and researchers feeding live reports.",
      icon: Users,
      color: "text-emerald-450 border-emerald-500/20 bg-emerald-500/10"
    },
    {
      title: "LOGGED SEA HAZARDS",
      value: "324 Incidents",
      desc: "Total oil leaks, coral bleaching spots, storm surges, and toxic blooms monitored & cataloged.",
      icon: AlertTriangle,
      color: "text-cyan-300 border-sky-505/20 bg-sky-550/10"
    },
    {
      title: "SIGNAL RADAR BROADCASTS",
      value: "42 Emergency Sweeps",
      desc: "Active protection boundaries push alerts live into shipping carrier telemetry blocks.",
      icon: ShieldCheck,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10"
    }
  ];

  const testimonials = [
    {
      text: "Before OceanShield, fuel slicks went unrecorded for weeks. Now our community files dispatches on our smartphones in minutes, and the whole bay stays notified.",
      author: "Enrique Ramos, Fisherman Leader",
      location: "San Jose Coastal Sanctuary"
    },
    {
      text: "The satellite analysis matched with direct citizen reports gives our research lab instant calibration coordinates. It has cut physical sampling preparation times down by 75%.",
      author: "Dr. Clara Mendoza, Marine Biologist",
      location: "State Hydrographic Institute"
    }
  ];

  return (
    <div className="space-y-8 text-left" id="impact-page-root">
      
      {/* Landing header summary */}
      <div className="bg-slate-900 border border-slate-820 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-400 font-extrabold block">
            CITIZEN SCIENCE & CONSERVATION SUCCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-100 uppercase tracking-tight">
            How crowdsourced telemetry protects our oceans
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            OceanShield bridges the gap between high-altitude space monitoring and local coastal experience. By empowering fishing communities and conservation teams, we convert raw observations into actionable safety zones within minutes.
          </p>
        </div>
      </div>

      {/* Grid numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4 hover:border-slate-800 transition shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black font-heading text-slate-100">
                  {card.value}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split layout: explanation of the pipeline + testimonials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: The Workflow Explained (7 columns) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="font-bold text-slate-100 font-heading text-base uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-450" />
            <span>THE ACTION PIPELINE METRIC</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <div className="w-6 h-6 bg-cyan-950 text-cyan-400 font-mono font-black text-xs rounded-lg flex items-center justify-center border border-cyan-850 shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-200">Incident Reported in the Field</h4>
                <p className="text-slate-400 leading-relaxed font-sans">
                  Local fishermen or coastal observers spot a threat, sketch the dimensions, attach photographs, and submit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <div className="w-6 h-6 bg-indigo-950 text-indigo-400 font-mono font-black text-xs rounded-lg flex items-center justify-center border border-indigo-850 shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-200">AI Integrity Scanner Analyzes Content</h4>
                <p className="text-slate-400 leading-relaxed font-sans">
                  Our server-side algorithm checks lexical validity, calibrates coordinate overlaps, and generates a weighted confidence level.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <div className="w-6 h-6 bg-emerald-950 text-emerald-450 font-mono font-black text-xs rounded-lg flex items-center justify-center border border-emerald-850 shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-200">Coast Guard Command Verification</h4>
                <p className="text-slate-400 leading-relaxed font-sans">
                  Experts review the incident, corroborate with regional hydrographic sensors, and elevate report status to "Verified".
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <div className="w-6 h-6 bg-orange-950 text-orange-400 font-mono font-black text-xs rounded-lg flex items-center justify-center border border-orange-850 shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-200">Emergency Alert Signal Broadcast</h4>
                <p className="text-slate-400 leading-relaxed font-sans">
                  The system compiles a dynamic emergency boundary layout. Local commercial carriers receive warning signals to slow down and run containment steps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Observer Voices (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="block text-xs font-bold text-slate-500 font-mono uppercase">
            COMMUNITY WORDS FROM THE FIELD
          </span>

          {testimonials.map((test, index) => (
            <div key={index} className="bg-glass rounded-2xl p-5 border border-cyan-500/15 flex flex-col justify-between min-h-[170px] space-y-4">
              <p className="text-xs text-slate-350 italic leading-relaxed font-sans">
                "{test.text}"
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-850/50">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-550/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                  VO
                </div>
                <div>
                  <h5 className="font-bold text-slate-200 text-xs">{test.author}</h5>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide font-mono block">{test.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
