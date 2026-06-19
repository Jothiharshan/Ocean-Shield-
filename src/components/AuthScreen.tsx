import React, { useState } from "react";
import { User, UserRole } from "../types";
import { Compass, Ship, UserCheck, ShieldAlert, Award, FileText, ChevronRight } from "lucide-react";

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Citizen");
  const [organization, setOrganization] = useState("");

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please provide credential details to connect with the Coast Guard registry.");
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now().toString().substring(8)}`,
      name,
      email,
      role,
      organization: organization || "Municipal Coastal Citizenry"
    };

    onLogin(newUser);
  };

  const getRoleDescription = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case "Citizen":
        return "Report beach trash, plastics, coastal weather, and general visual anomalies directly on our shared map.";
      case "Fisherman":
        return "Access drift current, marine heatwave indices, red tide warning signals, and file boat-safe bulletins.";
      case "Researcher":
        return "Inspect critical core temperatures, log localized coral bleaching plots, track sanctuary trends, and analyze samples.";
      case "Authority":
        return "Review active citizen submissions, authorize containment vessels, coordinate coastal dispatch, and issue alerts.";
      case "Admin":
        return "Full tactical permissions. Manage users, modify reporting grids, seed simulations, and inspect systems telemetry.";
    }
  };

  const getRoleIcon = (selectedRole: UserRole, active: boolean) => {
    const cls = active ? "text-cyan-400" : "text-slate-400";
    switch (selectedRole) {
      case "Citizen": return <UserCheck className={`w-4 h-4 ${cls}`} />;
      case "Fisherman": return <Ship className={`w-4 h-4 ${cls}`} />;
      case "Researcher": return <FileText className={`w-4 h-4 ${cls}`} />;
      case "Authority": return <ShieldAlert className={`w-4 h-4 ${cls}`} />;
      case "Admin": return <Award className={`w-4 h-4 ${cls}`} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Ocean atmosphere circle backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login frame */}
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-cyan-450 mb-1">
            <Compass className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: "30s" }} />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight font-sans">
            OceanShield AI
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Integrated Web Console for Crowdsourced Ocean Hazard Dispatch, Marine Sanctuary Surveillance, and Incident Analytics
          </p>
        </div>

        <form onSubmit={handleSimulatedSubmit} className="space-y-4">
          {/* Identity fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">
                Operator Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Captain Carlos Silva"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-250 outline-none focus:border-cyan-500 transition"
                id="auth-input-name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">
                Operator Email Coordinates *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. carlos.silva@coastalbay.org"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-250 outline-none focus:border-cyan-500 transition"
                id="auth-input-email"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">
                Maritime Organization / Vessel Sighting Code
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Marina Bay Fisherman Coop (Fleet 4)"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-250 outline-none focus:border-cyan-500 transition"
                id="auth-input-org"
              />
            </div>
          </div>

          {/* Role selector panel */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">
              Operational Clearance Role
            </label>

            <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
              {(["Citizen", "Fisherman", "Researcher", "Authority", "Admin"] as UserRole[]).map((r) => {
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-lg text-[9px] font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isActive
                        ? "bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60"
                        : "text-slate-500 hover:text-slate-350"
                    }`}
                    id={`auth-role-${r}`}
                  >
                    {getRoleIcon(r, isActive)}
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl animate-in fade-in duration-300">
              <span className="text-[9px] font-bold text-cyan-450 uppercase tracking-widest block font-mono mb-0.5">
                ROLE DEPLOYMENT SCOPE:
              </span>
              <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                {getRoleDescription(role)}
              </p>
            </div>
          </div>

          {/* Operational launch button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-950 font-bold py-3 rounded-xl text-xs tracking-wide flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-500/10 cursor-pointer"
            id="auth-login-btn"
          >
            <span>LAUNCH OCEANSHIELD CO-PILOT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* System parameters footer */}
        <p className="text-[9px] text-center text-slate-500 mt-5 font-mono">
          SECURE CHANNEL CLOUD NODE // PORT: 3000 // UTC VERIFIED
        </p>
      </div>
    </div>
  );
}
