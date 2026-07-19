import React from "react";
import { Sparkles, Home, Layers, MessageSquare, Info } from "lucide-react";

interface HeaderProps {
  activeTab: "dashboard" | "new-analysis" | "chat";
  setActiveTab: (tab: "dashboard" | "new-analysis" | "chat") => void;
  savedRoomsCount: number;
}

export default function Header({ activeTab, setActiveTab, savedRoomsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo & title */}
        <div 
          onClick={() => setActiveTab("dashboard")}
          className="flex cursor-pointer items-center space-x-2.5 transition-opacity hover:opacity-90"
          id="brand-logo-container"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">
              SpaceHarmonize
            </h1>
            <p className="text-[10px] font-medium text-teal-600 uppercase tracking-wider">
              AI Organization Coach
            </p>
          </div>
        </div>

        {/* Tab navigation tabs */}
        <nav className="flex space-x-1 sm:space-x-2" id="main-navigation">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-zinc-100 text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">My Spaces</span>
            {savedRoomsCount > 0 && (
              <span className="ml-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-teal-100 px-1 text-[10px] font-semibold text-teal-700">
                {savedRoomsCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-new"
            onClick={() => setActiveTab("new-analysis")}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeTab === "new-analysis"
                ? "bg-teal-50 text-teal-700"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Analyze Room</span>
          </button>

          <button
            id="nav-tab-coach"
            onClick={() => setActiveTab("chat")}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              activeTab === "chat"
                ? "bg-zinc-100 text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Aura Coach</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
