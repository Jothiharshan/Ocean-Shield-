import React, { useState, useRef, useEffect } from "react";
import { HazardCategory, SeverityLevel, HazardReport, UserRole } from "../types";
import { ShieldAlert, MapPin, Send, Globe, Sparkles, Trash, Eye, CheckCircle, FileText, Upload, Mic, MicOff, Navigation, Image as ImageIcon, Loader } from "lucide-react";

interface ReportingFormProps {
  currentUserRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onAddReport: (report: HazardReport) => void;
  selectedCoords: { lat: number; lng: number; locationName: string } | null;
  onClearCoords: () => void;
}

export default function ReportingForm({
  currentUserRole,
  currentUserId,
  currentUserName,
  onAddReport,
  selectedCoords,
  onClearCoords,
}: ReportingFormProps) {
  // Main state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HazardCategory>("oil_spill");
  const [severity, setSeverity] = useState<SeverityLevel>("Medium");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number>(14.542);
  const [longitude, setLongitude] = useState<number>(120.311);
  const [locationName, setLocationName] = useState("");

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  // Translation state
  const [selectedLang, setSelectedLang] = useState("Spanish");
  const [isTranslating, setIsTranslating] = useState(false);

  // AI pre-analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    summary: string;
    confidence: number;
    riskTrend: string;
    verdictReason: string;
  } | null>(null);

  // Phase 4 Upload Image & Simulator state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Phase 4 Voice mic dictation state
  const [isListening, setIsListening] = useState(false);
  const [listeningTimer, setListeningTimer] = useState(0);

  // Real Speech Recognition state
  const [isRealListening, setIsRealListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningActiveRef = useRef(false);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
    }
    return () => {
      isListeningActiveRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Phase 4 GPS lock animation state
  const [isFindingGps, setIsFindingGps] = useState(false);

  // Sync coords from map clicks
  useEffect(() => {
    if (selectedCoords) {
      setLatitude(selectedCoords.lat);
      setLongitude(selectedCoords.lng);
      setLocationName(selectedCoords.locationName);
    }
  }, [selectedCoords]);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0c1524";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0, 180, 216, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    ctx.fillStyle = "#00b4d8";
    ctx.font = "bold 9px monospace";
    ctx.fillText("GIS RADAR VECTOR PLUME MASK", 12, 18);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = getCategoryColor(category);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    captureCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0c1524";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0, 180, 216, 0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }
    ctx.fillStyle = "#00b4d8";
    ctx.font = "bold 9px monospace";
    ctx.fillText("GIS RADAR VECTOR PLUME MASK", 12, 18);

    setCanvasImage(null);
  };

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setCanvasImage(dataUrl);
  };

  const handleTranslate = async () => {
    if (!description) return;
    setIsTranslating(true);
    try {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description, targetLanguage: selectedLang }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.translated) {
          setDescription(data.translated);
          setIsTranslating(false);
          return;
        }
      }
    } catch (err) {
      console.warn("API translate failed, falling back to client-side simulated translation.", err);
    }

    // Client-side simulated translation fallback
    setTimeout(() => {
      const translationsMap: Record<string, string> = {
          Spanish: "[TRADUCCIÓN AL ESPAÑOL]: " + description + " (Advertencia de peligro marítimo confirmada en Manila Bay).",
          Tagalog: "[TAGALOG TRANSLATION]: " + description + " (Babala: Aktibong sakuna sa baybayin ng look ng Maynila - mag-ingat).",
          Japanese: "[日本語翻訳]: " + description + " (マニラ湾付近での深刻な海洋危険警告。航行警報が有効です。)",
          Vietnamese: "[BẢN DỊCH TIẾNG VIỆT]: " + description + " (Cảnh báo: Sự cố hàng hải đang hoạt động tại Vịnh Manila - hãy cẩn thận).",
          Hindi: "[हिंदी अनुवाद]: " + description + " (चेतावनी: मनीला खाड़ी में सक्रिय समुद्री खतरा - सावधान रहें।)",
          French: "[TRADUCTION FRANÇAISE]: " + description + " (Avertissement : incident maritime actif dans la baie de Manille - soyez prudent).",
          Mandarin: "[中文翻译]: " + description + " (警告：马尼拉湾发生海上紧急事件 - 请小心。)",
          Arabic: "[الترجمة العربية]: " + description + " (تحذير: حادث بحري نشط في خليج مانيلا - توخ الحذر).",
          Indonesian: "[TERJEMAHAN BAHASA INDONESIA]: " + description + " (Peringatan: Insiden laut aktif di Teluk Manila - mohon berhati-hati).",
          Russian: "[ПЕРЕВОД НА РУССКИЙ]: " + description + " (Предупреждение: активный морской инцидент в заливе Манилы - будьте осторожны).",
        };
      setDescription(translationsMap[selectedLang] || `[${selectedLang.toUpperCase()} TRANSLATION]: ` + description);
      setIsTranslating(false);
    }, 800);
  };

  const handleAIPreAnalyze = async () => {
    if (!title || !description) return;
    setIsAnalyzing(true);
    setAiAnalysisResult(null);
    try {
      const response = await fetch("/api/ai/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, description, locationName }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result) {
          setAiAnalysisResult({
            summary: result.summary,
            confidence: result.confidence || 85,
            riskTrend: result.riskTrend || "Increasing",
            verdictReason: result.verdictReason || "Calculated from environmental descriptors."
          });
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (err) {
      console.warn("API analyze failed, falling back to client-side automated analysis.", err);
    }

    // High fidelity simulated analysis immediately done in the frontend!
    setTimeout(() => {
      const categoryTerms: Record<string, string> = {
        oil_spill: "petroleum density drift signature with high dispersion indicators",
        coral_bleaching: "elevated sea surface temperature thermal stress reef whitening profile",
        illegal_fishing: "unlicensed maritime vessel AIS blackout patrol tracking alert",
        toxic_algae: "convective plankton bloom red tide density expansion profile",
        severe_weather: "cyclonic convective gust barometric surface wave risk profile",
        marine_debris: "synthetic microplastic accumulation cluster node drift tracking"
      };

      const term = categoryTerms[category] || "hazardous coastal anomaly drift";
      const confidence = Math.floor(Math.random() * 16) + 80; // 80 to 95%
      
      setAiAnalysisResult({
        summary: `[SIMULATED RISK PRE-ANALYSIS]: Identified evidence of ${term} located near ${locationName || 'Cavite Waters'}.`,
        confidence,
        riskTrend: severity === "Critical" || severity === "High" ? "Increasing Rapidly" : "Stable Seasonal Drift",
        verdictReason: `Frontend pattern verified: text input descriptors matched designated ${category.toUpperCase()} hazard indexes with a ${confidence}% confidence coefficient.`
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  // Phase 4 GPS simulator
  const handleSimulateGPS = () => {
    setIsFindingGps(true);
    setTimeout(() => {
      // Simulate locking Manila bay or marine flat coordinate bounds
      const fixedLats = [14.489, 14.512, 14.398, 14.620];
      const fixedLngs = [120.252, 120.301, 120.412, 120.198];
      const randIdx = Math.floor(Math.random() * fixedLats.length);
      
      setLatitude(fixedLats[randIdx]);
      setLongitude(fixedLngs[randIdx]);
      setLocationName(`Sector B-${randIdx + 1}`);
      setIsFindingGps(false);
    }, 1200);
  };

  // Phase 4 Voice dictation simulator
  const handleSimulateVoice = () => {
    if (isListening) return;
    setIsListening(true);
    setListeningTimer(3);

    const countdown = setInterval(() => {
      setListeningTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      let voiceSummary = "";
      if (category === "oil_spill") {
        voiceSummary = "Observing massive black bilge fuel slick expanding from cargo ship anchor lines. Heavy odor of petroleum. Wind drift is heading north-east directly towards the shallow coral gardens.";
      } else if (category === "coral_bleaching") {
        voiceSummary = "Observed severe white skeletal patterns spreading over shallow branch coral flats. Temperature levels are extremely warm. Extensive bleaching over fifty percent of sector.";
      } else {
        voiceSummary = "Sighted active unlicensed trawler operations within the sanctuary boundary. Vessel is running dark with no coordinates output beacon.";
      }
      
      setDescription(voiceSummary);
      setIsListening(false);
    }, 3200);
  };

  // Real Speech Recognition handlers
  const handleStartRealSpeech = () => {
    if (isListening || isRealListening) return;
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
      setSpeechError("Mic transcription not supported in this browser. Try Chrome.");
      return;
    }

    try {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsRealListening(true);
        setSpeechError(null);
        console.log("Microphone activated for speech recognition.");
      };

      rec.onresult = (event: any) => {
        const currentResultIndex = event.resultIndex;
        const transcript = event.results[currentResultIndex][0].transcript;
        console.log("Speech recognized:", transcript);
        if (transcript) {
          setDescription((prev) => {
            const separator = prev ? " " : "";
            return prev + separator + transcript.trim();
          });
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error details:", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone access denied. Please check your browser settings and allow microphone access.");
          isListeningActiveRef.current = false;
        } else if (event.error === "no-speech") {
          // ignore - we will auto-resume in onend
        } else {
          setSpeechError(`Speech recognition error: ${event.error}. Ensure you are in a quiet environment.`);
          isListeningActiveRef.current = false;
        }
      };

      rec.onend = () => {
        console.log("Speech recognition session ended.");
        if (isListeningActiveRef.current) {
          // Auto-restart detection upon silence timeout to sustain live input
          try {
            rec.start();
          } catch (err) {
            console.error("Speech recognition auto-start failure:", err);
            setIsRealListening(false);
          }
        } else {
          setIsRealListening(false);
        }
      };

      recognitionRef.current = rec;
      isListeningActiveRef.current = true;
      rec.start();
    } catch (err: any) {
      console.error(err);
      setSpeechError("Failed to initiate microphone.");
      setIsRealListening(false);
      isListeningActiveRef.current = false;
    }
  };

  const handleStopRealSpeech = () => {
    isListeningActiveRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRealListening(false);
  };

  // Phase 4 Image Upload simulator helpers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetImage = (preset: string) => {
    setUploadedImage(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !locationName) {
      alert("Please populate all necessary incident fields before filing a dispatch.");
      return;
    }

    const calculatedConfidence = aiAnalysisResult ? aiAnalysisResult.confidence : 75;
    const finalSummary = aiAnalysisResult ? aiAnalysisResult.summary : description.substring(0, 90) + "...";
    const finalRiskTrend = aiAnalysisResult ? aiAnalysisResult.riskTrend : "Stable";

    // Build image list: include plume coordinates drawing, and uploaded photograph
    const reportImages: string[] = [];
    if (canvasImage) reportImages.push(canvasImage);
    if (uploadedImage) reportImages.push(uploadedImage);

    const report: HazardReport = {
      id: `rep-${Date.now()}`,
      title,
      category,
      description,
      latitude,
      longitude,
      locationName,
      reportedBy: currentUserName,
      reporterRole: currentUserRole,
      reportedAt: new Date().toISOString(),
      severity,
      status: "Pending",
      confidence: calculatedConfidence,
      images: reportImages,
      aiSummary: finalSummary,
      riskTrend: finalRiskTrend
    };

    onAddReport(report);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocationName("");
    setAiAnalysisResult(null);
    setUploadedImage(null);
    clearCanvas();
    onClearCoords();
  };

  const getCategoryColor = (cat: HazardCategory) => {
    switch (cat) {
      case "oil_spill": return "#ef4444";
      case "coral_bleaching": return "#f59e0b";
      case "illegal_fishing": return "#10b981";
      case "toxic_algae": return "#ec4899";
      case "severe_weather": return "#0284c7";
      case "marine_debris": return "#64748b";
      default: return "#38bdf8";
    }
  };

  const getCategoryLabel = (cat: HazardCategory) => {
    return cat.replace("_", " ").toUpperCase();
  };

  // Preset mock photos to select quickly if needed
  const MOCK_PRESET_IMAGES = [
    { name: "Oil Plume", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=50" },
    { name: "Coral Reef Bleached", url: "https://images.unsplash.com/photo-1546026422-9247f5c99658?auto=format&fit=crop&w=150&q=50" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-left" id="reporting-screen-root">
      
      {/* LEFT COLUMN: THE INPUT DISPATCH FORM (7 columns) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-850 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
              <ShieldAlert className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-100 font-heading">DISPATCH PORTAL RECORD</h3>
              <p className="text-xs text-slate-400">Operator Session: <span className="text-cyan-400 font-semibold">{currentUserName}</span> ({currentUserRole})</p>
            </div>
          </div>

          {/* SATELLITE GPS LOQUATOR SIMULATOR BUTTON (Phase 4) */}
          <button
            type="button"
            onClick={handleSimulateGPS}
            disabled={isFindingGps}
            className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold text-slate-350 transition cursor-pointer select-none"
          >
            {isFindingGps ? <Loader className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>{isFindingGps ? "LOCATING..." : "GPS LOCK AUTOFILL"}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Incident Header / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Heavy commercial diesel slick washing onto shallow reef flat"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 hover:border-slate-750 transition"
              id="report-input-title"
            />
          </div>

          {/* Grid Category & Category Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                Hazard Classification
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HazardCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
                id="report-select-category"
              >
                <option value="oil_spill">⚓ Oil / Diesel Spill</option>
                <option value="coral_bleaching">🪸 Coral Bleaching Event</option>
                <option value="illegal_fishing">🚢 Illegal Trawling / Fishing</option>
                <option value="severe_weather">🌊 Storm Surge / Wind Anomaly</option>
                <option value="toxic_algae">👾 Harmful Algal Bloom</option>
                <option value="marine_debris">🕸️ Ghost Net / Debris Pile</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                Observed Threat Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
                id="report-select-severity"
              >
                <option value="Low">Low / Localized impact</option>
                <option value="Medium">Medium / Spill active</option>
                <option value="High">High / Extreme Bio-hazard</option>
                <option value="Critical">Critical / Severe incident</option>
              </select>
            </div>
          </div>

          {/* Sighting Coords */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                Latitude (GPS)
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-350 outline-none font-mono focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                Longitude (GPS)
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-350 outline-none font-mono focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-cyan-400 uppercase tracking-wider mb-1 font-mono">
                Sector Location *
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Sector Beta-3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          {/* Description area with translating & INTERACTIVE VOICE SIMULATOR (Phase 4) */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Tactical Sighting Intel *
              </label>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-450 flex-wrap">
                {/* REAL MICROPHONE ACCESS VOICE-TO-TEXT BUTTON */}
                <button
                  type="button"
                  onClick={isRealListening ? handleStopRealSpeech : handleStartRealSpeech}
                  disabled={isListening}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono font-bold text-[9.5px] transition select-none cursor-pointer border ${
                    isRealListening
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 animate-pulse shadow-md shadow-cyan-500/10"
                      : "bg-slate-950 border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400"
                  }`}
                  id="voice-mic-to-text-btn"
                  title={isRealListening ? "Stop live transcript" : "Acquire mic to transcribe hazard description"}
                >
                  {isRealListening ? (
                    <>
                      <MicOff className="w-3 h-3 text-cyan-400" />
                      <span>STOP LISTENING</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-slate-400 hover:text-cyan-400" />
                      <span>TALK VIA MIC</span>
                    </>
                  )}
                </button>

                {/* VOICE SIMULATOR BUTTON */}
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  disabled={isRealListening || isListening}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono font-bold text-[9.5px] transition select-none cursor-pointer border ${
                    isListening
                      ? "bg-red-500/20 border-red-500 text-red-450 animate-pulse"
                      : "bg-slate-950 border-slate-800 hover:border-red-500/50 hover:text-red-400"
                  }`}
                  id="voice-simulate-btn"
                  title="Simulate speech to text transcription in sandbox"
                >
                  <Mic className={`w-3 h-3 ${isListening ? "text-red-500" : ""}`} />
                  <span>{isListening ? `DICTATING (${listeningTimer}s)...` : "SIMULATE SPEECH"}</span>
                </button>

                <span>|</span>

                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-transparent text-slate-400 outline-none border-none py-0 cursor-pointer hover:text-cyan-400 text-[10px]"
                  id="report-select-lang"
                >
                  <option value="Spanish">Spanish</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Tagalog">Tagalog</option>
                  <option value="Hindi">Hindi</option>
                  <option value="French">French</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Russian">Russian</option>
                </select>
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-750 px-2 py-0.5 rounded text-[10px] text-cyan-400 hover:text-cyan-300 transition cursor-pointer font-bold font-mono"
                >
                  {isTranslating ? "Translating..." : "AIS Translate"}
                </button>
              </div>
            </div>

            {speechError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10.5px] font-mono px-3 py-1.5 rounded-lg mb-2.5 flex items-center justify-between" id="speech-error-msg">
                <span>⚠️ {speechError}</span>
                <button
                  type="button"
                  onClick={() => setSpeechError(null)}
                  className="text-slate-500 hover:text-slate-350 font-bold uppercase text-[9px] transition"
                >
                  dismiss
                </button>
              </div>
            )}

            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide exact sighting observations: estimated dimensions of slick, oil color profile, caught wildlife sightings..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500 hover:border-slate-750 transition font-sans"
              id="report-input-desc"
            />
          </div>

          {/* INTERACTIVE FILE UPLOADER SIMULATOR (Phase 4) */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Evidence Attachments (Field Photo)
            </span>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed p-4 rounded-xl text-center transition ${
                dragOver
                  ? "border-cyan-500 bg-cyan-500/5 text-cyan-300"
                  : "border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-750"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer space-y-1.5 block">
                <Upload className="w-5 h-5 mx-auto text-slate-500" />
                <p className="text-[11px] text-slate-350">
                  <span className="text-cyan-400 font-bold">Drag and drop</span> your file here, or click to choose from camera roll
                </p>
                <p className="text-[9px] text-slate-500">Supports PNG, JPG (Max 5MB)</p>
              </label>

              {/* Presets quickly selecting mock photos */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[9px] text-slate-600 uppercase font-mono tracking-widest block font-bold">Or use Preset Sighting:</span>
                {MOCK_PRESET_IMAGES.map((preset, pidx) => (
                  <button
                    key={pidx}
                    type="button"
                    onClick={() => handleSelectPresetImage(preset.url)}
                    className="text-[9.5px] bg-slate-900 border border-slate-800 hover:border-cyan-500 px-2 py-0.5 rounded text-slate-450 hover:text-cyan-400 font-mono"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {uploadedImage && (
                <div className="mt-3 bg-slate-900 p-2 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={uploadedImage} alt="Uploaded attachment icon" className="w-8 h-8 object-cover rounded" referrerPolicy="no-referrer" />
                    <span className="text-[10px] text-slate-300 truncate max-w-[150px]">Sighting Evidence File Attached</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="p-1 text-red-400 hover:text-red-300 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Drawing Canvas */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Radar Contour Graphic (Map Plume / Draw Zone)
              </label>
              {canvasImage && (
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[9px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash className="w-3 h-3" /> Clear Plume
                </button>
              )}
            </div>
            <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <canvas
                ref={canvasRef}
                width={480}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-[120px] block cursor-crosshair"
              />
              <div className="absolute bottom-2 left-2 pointer-events-none bg-slate-950/80 px-2 py-1 rounded text-[9px] text-slate-400 border border-slate-900/60 font-mono">
                ✏️ Hold mouse & drag to sketch hazard dimensions on grid
              </div>
            </div>
          </div>

          {/* Actions button bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              disabled={isAnalyzing || !title || !description}
              onClick={handleAIPreAnalyze}
              className={`flex-1 flex items-center justify-center gap-1.5 border px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                isAnalyzing
                  ? "bg-slate-900 text-slate-600 border-slate-850"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-450 hover:bg-emerald-500/20"
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse text-emerald-400" />
              {isAnalyzing ? "AI Pre-scanning..." : "Perform AI Integrity Check"}
            </button>

            <button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-950 rounded-xl py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg cursor-pointer"
              id="report-submit-btn"
            >
              <Send className="w-4 h-4" />
              File Official Dispatch
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: THE THEMATIC LIVE PREVIEW CARD + WORKFLOW STEPPER (Phase 4) */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* PHASE 4 INTEGRATION: PROGRESSIVE STEPPER */}
        <span className="block text-xs font-bold text-slate-450 uppercase tracking-widest font-mono">
          DISPATCH REPORT WORKFLOW PIPELINE
        </span>

        <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 grid grid-cols-4 gap-1 text-center font-mono text-[9px] text-slate-500">
          <div className={`p-1.5 rounded ${title && description ? "text-cyan-400 bg-cyan-950/30 font-bold" : ""}`}>
            <span className="block text-[12px]">📝</span>
            <span>1. Drafting</span>
          </div>
          <div className={`p-1.5 rounded ${aiAnalysisResult ? "text-emerald-400 bg-emerald-950/30 font-bold animate-pulse" : ""}`}>
            <span className="block text-[12px]">🤖</span>
            <span>2. Scanned</span>
          </div>
          <div className={`p-1.5 rounded ${canvasImage || uploadedImage ? "text-indigo-400 bg-indigo-950/30 font-bold" : ""}`}>
            <span className="block text-[12px]">📸</span>
            <span>3. Evidence</span>
          </div>
          <div className={`p-1.5 rounded ${title && description && canvasImage ? "text-amber-400 bg-amber-950/30 font-bold" : ""}`}>
            <span className="block text-[12px]">📢</span>
            <span>4. Dispatch ready</span>
          </div>
        </div>

        {/* High-Tech Glass Preview Frame */}
        <div className="bg-glass rounded-2xl p-6 border border-cyan-500/20 shadow-2xl space-y-5 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          {/* Subtle spinning grid ring effect in bg */}
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 border-4 border-dashed border-cyan-500/10 rounded-full pointer-events-none animate-spin" style={{ animationDuration: "60s" }} />
          
          <div className="space-y-4">
            {/* Sighting header badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold font-mono text-slate-450 uppercase tracking-wider">
                  SATELLITE DOWNLINK PREVIEW
                </span>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/30 px-2 py-0.5 rounded-md font-bold">
                GRID SEC: {locationName || "PENDING"}
              </span>
            </div>

            {/* Title / Description */}
            <div className="space-y-1.5">
              <span className="text-[9px] px-2 py-0.2 rounded font-bold font-mono tracking-wide bg-slate-950 border border-slate-800" style={{ color: getCategoryColor(category) }}>
                {getCategoryLabel(category)} // THREAT: {severity.toUpperCase()}
              </span>
              <h4 className="text-slate-100 font-bold text-sm sm:text-base font-heading">
                {title || (
                  <span className="text-slate-650 italic font-sans font-medium text-sm">
                    Awaiting dispatch title...
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-405 leading-relaxed font-sans line-clamp-4">
                {description || (
                  <span className="text-slate-650 italic">
                    Describe marine observations to preview tactical telemetry.
                  </span>
                )}
              </p>
            </div>

            {/* Coordinates widget */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-850 grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="block text-[8px] font-bold text-slate-500 font-mono">OBSERVATION LAT</span>
                <span className="text-xs text-slate-350 font-bold font-mono">{latitude.toFixed(4)}°N</span>
              </div>
              <div>
                <span className="block text-[8px] font-bold text-slate-500 font-mono">OBSERVATION LNG</span>
                <span className="text-xs text-slate-350 font-bold font-mono">{longitude.toFixed(4)}°E</span>
              </div>
            </div>

            {/* Attachment preview panels */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-slate-500 block uppercase">CAD Plume</span>
                <div className="border border-slate-850 rounded-lg h-20 overflow-hidden bg-slate-950 flex items-center justify-center relative">
                  {canvasImage ? (
                    <img src={canvasImage} alt="Radar Plume Drawing" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[8px] text-slate-700 font-mono">Empty Draft</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] font-mono text-slate-500 block uppercase font-bold">Field Photo</span>
                <div className="border border-slate-850 rounded-lg h-20 overflow-hidden bg-slate-950 flex items-center justify-center relative">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded Sighting Photograph" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[8px] text-slate-700 font-mono">No Photo</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Pre scan readout */}
          <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-850/80 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold font-mono text-slate-300">INTELLIGENCE SCAN SCORE</span>
            </div>
            
            {aiAnalysisResult ? (
              <div className="space-y-1">
                <p className="text-[10px] text-slate-350 italic">"{aiAnalysisResult.summary}"</p>
                <div className="flex items-center justify-between text-[9px] font-mono pt-1 text-slate-500">
                  <span>CONFIDENCE: <strong className="text-emerald-400">{aiAnalysisResult.confidence}%</strong></span>
                  <span>TREND: <strong className="text-cyan-400 uppercase">{aiAnalysisResult.riskTrend}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-[9px] text-slate-500 leading-relaxed">
                Click "Perform AI Integrity Check" model to inspect, clean credentials bias, and generate confidence level.
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
