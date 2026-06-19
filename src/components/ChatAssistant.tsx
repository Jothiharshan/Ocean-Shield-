import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UserRole } from "../types";
import { MessageSquare, Send, Bot, User, Trash2, HelpCircle, Compass, ShieldAlert, Sparkles } from "lucide-react";

interface ChatAssistantProps {
  currentUserRole: UserRole;
}

export default function ChatAssistant({ currentUserRole }: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      content: "Awaiting frequency... OceanShield AI Tactical Subsystem active. I can compute diesel spill containment workflows, identify vessel transponder discrepancies, analyze reef temperatures, or assist with localized translation. How may I support your coastal operation today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Command panel quick answers tailored to active user roles
  const ROLE_PRESETS = {
    Fisherman: [
      { label: "Diesel Leak Mitigation", prompt: "How do I contain a localized diesel spill with basic gear?" },
      { label: "Red Tide Ocean Safety", prompt: "What are the safe parameters for fishing during a Harmful Algal Bloom?" },
    ],
    Researcher: [
      { label: "Bleach Sampling Plan", prompt: "Explain the standard protocol for documenting coral bleaching percentages in shallow reefs." },
      { label: "Sea Temp Anomalies", prompt: "How does a localized +2°C Sea Surface Temperature anomaly impact benthic seagrass beds?" },
    ],
    Authority: [
      { label: "AIS Compliance Codes", prompt: "What is the typical procedure to handle a commercial pair-trawler operating inside a no-take marine sanctuary?" },
      { label: "Emergency Oil Containment", prompt: "Draft a tactical alert template for coastal communities following a tier-2 vessel fuel breach." },
    ],
    Citizen: [
      { label: "Monofilament Snags", prompt: "Why are abandoned plastic drift nets termed ghost gear, and how do we report them safely?" },
      { label: "Toxic Algae Shellfish Info", prompt: "Is it safe to collect clams and oysters during coastal red tide events?" },
    ],
    Admin: [
      { label: "Compute Hazard Confidence", prompt: "Contrast typical validation metrics between citizen-reported visual anomalies and scientific research reports." },
      { label: "Threat Escalation", prompt: "What is the recommended threshold to escalate a 'High' severity oil spill report into a full active broadcast alert?" },
    ],
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // package current chat state to the backend
      const requestPayload = [...messages, userMsg].map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestPayload }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            content: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          content: `Incident Report Error: Failed to established secure communication link with OceanShield Satellite base. Reason: ${err.message || "Endpoint timeout"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    if (confirm("Disconnect live log channel? This will clear active telemetry transcripts.")) {
      setMessages([
        {
          id: "welcome",
          sender: "ai",
          content: "Awaiting frequency... OceanShield AI Tactical Subsystem reconnected. Send an oceanographic diagnostic inquiry or request coordinate advice.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const activePresets = ROLE_PRESETS[currentUserRole] || ROLE_PRESETS["Citizen"];

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Advisor header info bar */}
      <div className="flex items-center justify-between p-4 bg-slate-950/85 border-b border-slate-850">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-450 animate-pulse">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 tracking-wider font-sans uppercase">
              OceanGuard AI Copilot
            </h3>
            <p className="text-[10px] text-teal-400 font-medium font-mono">
              Live link (Role: {currentUserRole})
            </p>
          </div>
        </div>

        <button
          onClick={clearChatHistory}
          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 cursor-pointer transition"
          title="Clear Terminal transcripts"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Log view */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
        {messages.map((msg) => {
          const isAI = msg.sender === "ai";
          const isSimulated = msg.content.includes("[SIMULATED");

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="flex flex-col max-w-[82%]">
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-sans ${
                    isAI
                      ? "bg-slate-900 text-slate-200 rounded-tl-none border border-slate-850"
                      : "bg-sky-500 text-white rounded-tr-none shadow-md shadow-sky-500/10"
                  }`}
                >
                  {isSimulated ? (
                    <div>
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded font-mono mb-1.5 block w-max">
                        OFFLINE FALLBACK STATE
                      </span>
                      <p>{msg.content.replace(/\[SIMULATED.*\]\n\n/, "")}</p>
                    </div>
                  ) : msg.content.includes("Risk:") || msg.content.includes("Risk Level:") ? (
                    <div className="space-y-3.5 text-left">
                      <p className="whitespace-pre-line text-slate-300 font-sans">{msg.content.split("\n")[0]}</p>
                      <div className="bg-slate-950 p-4 border border-cyan-500/25 rounded-xl space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10.5px] font-bold font-mono text-cyan-400 uppercase tracking-wider">AI EVALUATION SUMMARY</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans leading-relaxed space-y-2 select-all">
                          {msg.content.split("\n").slice(1).map((line, lIdx) => {
                            if (line.toLowerCase().startsWith("risk:") || line.toLowerCase().startsWith("risk level:")) {
                              return (
                                <div key={lIdx} className="bg-cyan-950/20 border border-cyan-500/15 p-2 rounded-lg mt-1 font-mono text-cyan-300 font-bold">
                                  {line}
                                </div>
                              );
                            }
                            return (
                              <p key={lIdx} className="block mt-1 pl-1">
                                {line}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{msg.content}</p>
                  )}
                </div>
                <span
                  className={`text-[9px] text-slate-500 mt-1 font-mono ${
                    isAI ? "text-left" : "text-right"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {!isAI && (
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-900 border border-slate-850 px-3 py-2 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Role Tactical presets */}
      <div className="px-4 py-2 border-t border-slate-850 bg-slate-950/50 space-y-1.5">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" /> Quick Tactical Query Presets:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
          {activePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleSendMessage(preset.prompt)}
              className="px-2 py-1 text-[10px] text-sky-300 bg-sky-500/10 hover:bg-sky-500/18 border border-sky-400/20 rounded-md transition cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input field */}
      <div className="p-3 bg-slate-950 border-t border-slate-850">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={`Ask OceanGuard AI regarding coastal safety...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-12 py-2 text-xs text-slate-200 outline-none focus:border-sky-500 transition font-sans"
            id="chat-input"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white disabled:bg-slate-800 disabled:text-slate-500 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
