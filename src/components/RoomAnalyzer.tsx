import React, { useState, useRef } from "react";
import { Upload, X, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RoomAnalyzerProps {
  onAnalyze: (payload: {
    image: string;
    roomType: string;
    challenges: string[];
    style: string;
    customName: string;
  }) => void;
  isAnalyzing: boolean;
}

const ROOM_TYPES = [
  { value: "living-room", label: "Living Room", icon: "🛋️" },
  { value: "bedroom", label: "Bedroom", icon: "🛏️" },
  { value: "kitchen", label: "Kitchen", icon: "🍳" },
  { value: "office", label: "Home Office", icon: "💻" },
  { value: "closet", label: "Closet & Wardrobe", icon: "👕" },
  { value: "bathroom", label: "Bathroom", icon: "🛁" },
  { value: "other", label: "Other Space", icon: "🏠" },
];

const CHALLENGE_OPTIONS = [
  { value: "Surface Clutter", label: "Surface Clutter", desc: "Crowded desks, counters, tables" },
  { value: "Poor Storage", label: "Poor Storage", desc: "Missing shelving, baskets, or cabinets" },
  { value: "Awkward Layout", label: "Awkward Layout", desc: "Inefficient furniture placement" },
  { value: "Messy Electronics", label: "Messy Electronics & Cables", desc: "Visible cords, chargers, power strips" },
  { value: "Paper Pile-ups", label: "Paper & Mail Pile-ups", desc: "Loose documents, receipts, catalogs" },
  { value: "Overflowing Clothes", label: "Clothing Overflow", desc: "Unfolded laundry, packed closets" },
  { value: "Toys & Gear", label: "Kids' Toys & Play Gear", desc: "Scattered playthings, games, craft supplies" },
];

const STYLE_OPTIONS = [
  { value: "Minimalist", label: "Warm Minimalist", desc: "Sparse surfaces, hidden storage, simple clean lines" },
  { value: "Scandinavian", label: "Scandinavian", desc: "Bright woods, cozy neutrals, simple storage grids" },
  { value: "Modern Functional", label: "Modern Functional", desc: "Highly modular, labeled organizers, space-efficient" },
  { value: "Cozy Cozy", label: "Cozy & Inviting", desc: "Warm lighting, potted plants, natural wicker bins" },
  { value: "Industrial", label: "Industrial & Sleek", desc: "Metal framing, dark wire baskets, structured order" },
];

const LOADING_TIPS = [
  "Tip: Start decluttering with the 'one-in, one-out' rule for seasonal garments.",
  "Tip: Focus on clearing flat surfaces first — they gather dust and visual chaos.",
  "Tip: Group similar items in decorative baskets to keep them out of sight but accessible.",
  "Tip: Optimize vertical space! Shelves elevate items and keep floor space clear.",
  "Tip: Give everything a dedicated 'home' so it's simple to tidy up at night.",
  "Tip: Spend just 10 minutes a day tidying up to completely bypass clutter buildups.",
];

export default function RoomAnalyzer({ onAnalyze, isAnalyzing }: RoomAnalyzerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState("living-room");
  const [challenges, setChallenges] = useState<string[]>([]);
  const [style, setStyle] = useState("Modern Functional");
  const [customName, setCustomName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate loading tips during analysis
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Image file is too large. Please select an image smaller than 15MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Challenge toggle
  const toggleChallenge = (val: string) => {
    setChallenges((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError("Please upload a room photo first.");
      return;
    }
    const defaultName = `My ${ROOM_TYPES.find((r) => r.value === roomType)?.label || "Space"}`;
    onAnalyze({
      image,
      roomType,
      challenges,
      style,
      customName: customName.trim() || defaultName,
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8" id="analyzer-container">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm"
            id="analysis-loader"
          >
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute h-full w-full rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
              <Sparkles className="h-10 w-10 text-teal-600 animate-pulse" />
            </div>

            <h3 className="mt-8 text-xl font-semibold text-zinc-900">
              Analyzing Room Harmony...
            </h3>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Our spatial organizer and Gemini 3.1 Pro are evaluating clutter densities, sorting storage solutions, and drafting your step-by-step room transformation.
            </p>

            <div className="mt-12 min-h-[60px] max-w-lg rounded-xl bg-teal-50/50 px-6 py-4 border border-teal-100/30 text-teal-800">
              <motion.p
                key={loadingTipIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-medium leading-relaxed"
              >
                {LOADING_TIPS[loadingTipIndex]}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Header info */}
            <div className="text-center sm:text-left">
              <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                AI Space Scan
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Transform Your Space
              </h2>
              <p className="mt-1.5 text-sm text-zinc-500">
                Upload a photo of any cluttered room or closet. Gemini will construct a tailored organizing action plan, bento quick wins, and storage guides.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-sm text-red-700" id="analyzer-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Image upload */}
              <div className="space-y-6 lg:col-span-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-900">
                    Room Photo
                  </label>
                  <p className="text-xs text-zinc-500">
                    Capture the clutter clearly for the best categorization results.
                  </p>
                </div>

                <div
                  id="drag-drop-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                    isDragging
                      ? "border-teal-500 bg-teal-50/30 scale-[0.99]"
                      : image
                      ? "border-zinc-200 bg-zinc-50"
                      : "border-zinc-300 hover:border-zinc-400 bg-white"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />

                  {image ? (
                    <div className="relative h-full w-full p-3 flex flex-col justify-between" id="image-preview-container">
                      <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-zinc-200 shadow-inner bg-zinc-100">
                        <img
                          src={image}
                          alt="Room preview"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        id="remove-image-btn"
                        className="mt-3 inline-flex w-full items-center justify-center space-x-1.5 rounded-lg border border-zinc-200 bg-white py-2 text-xs font-medium text-zinc-700 shadow-xs transition-all hover:bg-zinc-50 hover:text-zinc-900"
                      >
                        <X className="h-4 w-4" />
                        <span>Remove and select another</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 shadow-xs border border-zinc-100">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-zinc-900">
                        Drag and drop your photo here, or{" "}
                        <span className="text-teal-600 hover:underline">browse</span>
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Supports PNG, JPG, or JPEG up to 15MB
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="customName" className="text-sm font-semibold text-zinc-900">
                    Custom Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="customName"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Living Room Corner, Home Office Desk"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 shadow-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Right Column: Details & Custom Settings */}
              <div className="space-y-6 lg:col-span-7">
                {/* Room Type */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-zinc-900">
                    What type of space is this?
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" id="room-type-selector">
                    {ROOM_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setRoomType(type.value)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                          roomType === type.value
                            ? "border-teal-600 bg-teal-50/50 text-teal-800 ring-1 ring-teal-600"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950"
                        }`}
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span className="mt-1 text-[11px] font-medium leading-none truncate w-full">
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-zinc-900">
                    Key organization challenges
                  </label>
                  <div className="space-y-2" id="challenges-checkbox-group">
                    {CHALLENGE_OPTIONS.map((opt) => {
                      const isSelected = challenges.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleChallenge(opt.value)}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                            isSelected
                              ? "border-teal-600 bg-teal-50/30 text-zinc-900"
                              : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-800"
                          }`}
                        >
                          <div>
                            <p className={`text-xs font-semibold ${isSelected ? "text-teal-700" : "text-zinc-800"}`}>
                              {opt.label}
                            </p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              {opt.desc}
                            </p>
                          </div>
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-md border text-white transition-all ${
                              isSelected ? "border-teal-600 bg-teal-600" : "border-zinc-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aesthetic Vibe Goals */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-zinc-900">
                    Aesthetic Vibe & Style Goal
                  </label>
                  <div className="space-y-2" id="style-selector">
                    {STYLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStyle(opt.value)}
                        className={`flex w-full items-start space-x-3 rounded-xl border px-4 py-3 text-left transition-all ${
                          style === opt.value
                            ? "border-teal-600 bg-teal-50/30 text-zinc-950 ring-1 ring-teal-600"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-800"
                        }`}
                      >
                        <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-300">
                          {style === opt.value && (
                            <div className="h-2 w-2 rounded-full bg-teal-600" />
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${style === opt.value ? "text-teal-700" : "text-zinc-800"}`}>
                            {opt.label}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!image}
                  className={`flex w-full items-center justify-center space-x-2 rounded-xl py-3.5 text-sm font-semibold shadow-md transition-all ${
                    image
                      ? "bg-teal-600 text-white hover:bg-teal-500 shadow-teal-600/10 active:scale-[0.99]"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
                  }`}
                  id="analyzer-submit-btn"
                >
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Analyze with Gemini Pro</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
