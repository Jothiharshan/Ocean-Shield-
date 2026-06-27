import React, { useState } from "react";
import { User, UserRole } from "../types";
import { User as UserIcon, Lock, Mail, Facebook, Twitter, Compass } from "lucide-react";
import { getTranslation } from "../utils/translations";

interface AuthScreenProps {
  onLogin: (user: User) => void;
  lang?: string;
}

export default function AuthScreen({ onLogin, lang = "English" }: AuthScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Citizen");
  const [organization, setOrganization] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [formError, setFormError] = useState("");

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Operator credential name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("A valid operator email coordinates address is required.");
      return;
    }
    if (!agreeTerms) {
      setFormError("You must agree to the OceanShield security policies and terms.");
      return;
    }

    setFormError("");
    const newUser: User = {
      id: `usr-${Date.now().toString().substring(8)}`,
      name: name.trim(),
      email: email.trim(),
      role: role,
      organization: organization.trim() || "National Marine Citizenry"
    };

    onLogin(newUser);
  };

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authProvider, setAuthProvider] = useState("");
  const [authPercent, setAuthPercent] = useState(0);

  // Preset quick operator profiles mapped to social buttons for seamless evaluation
  const handleQuickOAuthPreset = (presetRole: UserRole, providerName: string) => {
    if (!agreeTerms) {
      setFormError("You must check the 'terms and conditions' box down below before using social Quick-Log.");
      return;
    }

    setFormError("");

    let presetName = "";
    let presetOrg = "";
    let presetEmail = "";

    switch (presetRole) {
      case "Admin":
        presetName = "Jothi Harshan D K";
        presetEmail = "admin.harshan@oceanshield.gov";
        presetOrg = "Coast Guard Operations Command";
        break;
      case "Researcher":
        presetName = "Dr. Marj Navasca";
        presetEmail = "m.navasca@marineagency.org";
        presetOrg = "Hydrographic Research Institute";
        break;
      case "Authority":
        presetName = "Chief Officer Elena Rostova";
        presetEmail = "e.rostova@coastalguard.net";
        presetOrg = "Maritime Overwatch Directorate";
        break;
    }

    const newUser: User = {
      id: `usr-oauth-${presetRole.toLowerCase()}`,
      name: presetName,
      email: presetEmail,
      role: presetRole,
      organization: presetOrg
    };

    setAuthProvider(providerName);
    setIsAuthLoading(true);
    setAuthPercent(0);

    // Simulate standard secure OAuth handshaking loop
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 10;
      setAuthPercent(currentPercent);
      if (currentPercent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAuthLoading(false);
          onLogin(newUser);
        }, 250);
      }
    }, 70);
  };

  const getRoleDescription = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case "Citizen":
        return getTranslation(lang, "desc_citizen", "Report seaside plastics, reef health, and general weather anomalies on our shared map.");
      case "Fisherman":
        return getTranslation(lang, "desc_fisherman", "Access drift directions, SST waves, red tide warnings, and direct boat-safe dispatches.");
      case "Researcher":
        return getTranslation(lang, "desc_researcher", "Inspect water temperatures, Coral bleaching zones, log raw data, and scientific insights.");
      case "Authority":
        return getTranslation(lang, "desc_authority", "Review active citizen hazard logs, authorize clean-up ships, and issue immediate emergency alerts.");
      case "Admin":
        return getTranslation(lang, "desc_admin", "Full operational access. Override telemetry logs, seed simulations, change roles, and system config.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden" id="auth-portal-screen">
      
      {/* Simulation load portal overlay */}
      {isAuthLoading && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in duration-200">
          <div className="absolute top-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl relative z-10 text-center space-y-6">
            <div className="flex justify-center">
              <Compass className="w-10 h-10 text-[#ff7a70] animate-spin" style={{ animationDuration: "3s" }} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] text-[#ff7a70] font-mono font-bold tracking-widest uppercase block animate-pulse">UPLINK HANDSHAKE IN PROGRESS</span>
              <h3 className="text-md font-bold text-slate-100">Connecting via {authProvider}</h3>
              <p className="text-[11px] text-slate-400 leading-normal">Securing operational vector coordinates & downloading coastal sentinel data feeds.</p>
            </div>

            {/* Custom progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-[#ff7a70] via-[#ffd269] to-[#55efc4] h-full transition-all duration-75 rounded-full"
                  style={{ width: `${authPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 leading-none">
                <span>IDENTITY PROVISIONED</span>
                <span className="font-bold text-cyan-400">{authPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative backdrop graphics */}
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-955/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main split-screen container mimicking the reference mockup */}
      <div className="w-full max-w-4xl bg-[#1d2731] border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* LEFT COLUMN: MEMBER LOGIN FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between space-y-8">
          <div>
            {/* Header Identity */}
            <div className="flex items-center gap-2 mb-6 text-cyan-400">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "25s" }} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">OCEANSHIELD DIGITAL PORTAL</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-[#ff7a70] tracking-tight mb-2">
              {getTranslation(lang, "member_login", "Member Login")}
            </h2>
            <p className="text-xs text-slate-400">
              {getTranslation(lang, "login_subtitle", "Please fill in your basic info to authenticate telemetry link")}
            </p>
          </div>

          <form onSubmit={handleSimulatedSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-450 text-left font-mono">
                ⚠ {formError}
              </div>
            )}

            {/* Operator Full Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4 text-[#ff7a70]/80" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={getTranslation(lang, "placeholder_name", "Operator Full Name")}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-3xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                required
              />
            </div>

            {/* Operator Email Coordinates Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4 text-[#ff7a70]/80" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={getTranslation(lang, "placeholder_email", "Security Email Coordinates")}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-3xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                required
              />
            </div>

            {/* Sighting Organization Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={getTranslation(lang, "placeholder_org", "Organization or Vessel Code (Optional)")}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-3xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
              />
            </div>

            {/* Clearance Level Selection dropdown */}
            <div className="space-y-1.5 text-left pt-1">
              <label className="text-[10px] font-mono font-bold tracking-wider text-slate-505 block pl-1 uppercase">
                {getTranslation(lang, "access_level", "Access Level Clearance:")}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-cyan-400 font-bold focus:border-cyan-500 outline-none transition cursor-pointer"
              >
                <option value="Citizen">Citizen (Voluntary Spotter)</option>
                <option value="Fisherman">Fisherman (Navigational Log)</option>
                <option value="Researcher">Researcher (Institute Hydrology)</option>
                <option value="Authority">Authority (Overwatch Dispatcher)</option>
                <option value="Admin">Admin (System Operations)</option>
              </select>
              <div className="p-2.5 bg-slate-950/20 border border-slate-850 rounded-xl mt-1.5">
                <p className="text-[10.5px] text-slate-400 leading-normal">
                  {getRoleDescription(role)}
                </p>
              </div>
            </div>

            {/* Warm Coral to turquoise Capsule Login Button from mockup */}
            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-[#ff7a70] to-[#55efc4] hover:opacity-95 active:scale-[0.98] text-slate-950 font-black tracking-widest text-xs uppercase py-3.5 px-6 rounded-full transition shadow-lg cursor-pointer transform"
            >
              {getTranslation(lang, "btn_login", "LOGIN")}
            </button>
          </form>

          {/* Bottom Forgot Password Option */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                alert("For high-fidelity evaluation, utilize the quick-preset operator profiles on the right side box, or enter any demo name and email on the left and hit LOGIN to access immediately.");
              }}
              className="text-xs text-slate-400 hover:text-[#ff7a70] font-mono tracking-wide transition cursor-pointer italic"
            >
              Forget Password?
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SCENIC IMMERSIVE SIGN UP CARD WITH INTUITIVE PRESET ROLES */}
        <div className="w-full md:w-1/2 relative bg-slate-950 overflow-hidden flex flex-col justify-between p-8 md:p-12 text-center text-slate-100 border-t md:border-t-0 md:border-l border-slate-800">
          
          {/* Panoramic misty background overlay resembling the image screenshot */}
          <div className="absolute inset-0 z-0 select-none opacity-40 pointer-events-none bg-cover bg-center mix-blend-color-dodge filter brightness-75 contrast-125 saturate-120" 
               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?auto=format&fit=crop&q=80&w=800')` }} 
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#1b1e2e]/90 via-[#101424]/95 to-[#0b0c16]/98 mix-blend-multiply pointer-events-none" />

          {/* Core Content */}
          <div className="relative z-20 my-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#ff7a70] tracking-tight">
                Sign Up
              </h2>
              <p className="text-xs text-slate-350 max-w-sm mx-auto">
                Join our coastal rescue network instantly or test expert roles immediately using our secure integrations
              </p>
            </div>

            {/* Quick-Preset OAuth Buttons Section corresponding to mockup's Social Account circles */}
            <div className="space-y-5">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff7a70] uppercase block">
                {getTranslation(lang, "or_social", "QUICK-LOG PRESETS (OAUTH COOPERATIVE)")}
              </span>

              <div className="flex justify-center items-center gap-6">
                
                {/* PRESET 1: RESEARCHER SLOT via Gmail */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickOAuthPreset("Researcher", "Google / Gmail")}
                    className="w-12 h-12 rounded-full border border-[#ff7a70]/50 hover:border-[#ff7a70] bg-slate-900/60 hover:bg-[#ff7a70]/10 flex items-center justify-center transition-all cursor-pointer group active:scale-90 relative z-30"
                    title="Sign up / Login instantly as Science Researcher"
                  >
                    <Mail className="w-5 h-5 text-[#ff7a70] group-hover:scale-110 transition pointer-events-none" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">Gmail</span>
                </div>

                {/* PRESET 2: AUTHORITY OVERWATCH via Facebook */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickOAuthPreset("Authority", "Facebook Connect")}
                    className="w-12 h-12 rounded-full border border-sky-500/50 hover:border-sky-400 bg-slate-900/60 hover:bg-sky-500/10 flex items-center justify-center transition-all cursor-pointer group active:scale-90 relative z-30"
                    title="Sign up / Login instantly as Coast Guard Authority"
                  >
                    <Facebook className="w-5 h-5 text-sky-450 group-hover:scale-110 transition pointer-events-none" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">Facebook</span>
                </div>

                {/* PRESET 3: COAST GUARD ADMIN via Twitter */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickOAuthPreset("Admin", "Twitter/X Secure Uplink")}
                    className="w-12 h-12 rounded-full border border-cyan-400/50 hover:border-cyan-300 bg-slate-900/60 hover:bg-cyan-400/10 flex items-center justify-center transition-all cursor-pointer group active:scale-90 relative z-30"
                    title="Sign up / Login instantly as System Admin"
                  >
                    <Twitter className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition pointer-events-none" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">Twitter</span>
                </div>

              </div>
            </div>

            {/* Terms and Conditions Agree Box */}
            <div className="flex items-start justify-center gap-2 max-w-xs mx-auto">
              <label className="flex items-center gap-2 text-slate-350 select-none cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-800 text-[#ff7a70] bg-slate-900 focus:ring-0 focus:ring-offset-0 cursor-pointer w-4 h-4"
                  id="agree-checkbox"
                />
                <span>{getTranslation(lang, "agree_terms", "By signing up I agree with terms and conditions")}</span>
              </label>
            </div>
          </div>

          {/* Bottom Switch button */}
          <div className="relative z-20 text-center pt-4 border-t border-slate-900">
            <button
              onClick={() => {
                setName("Spotter Citizen");
                setEmail("spotter@oceanshield-guild.org");
                setRole("Citizen");
                setOrganization("Local Volunteers Fleet");
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 font-bold underline transition cursor-pointer"
            >
              {getTranslation(lang, "active_credentials", "Quick prefill credentials on left")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
