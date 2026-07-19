import React from "react";
import { Plus, Sparkles, MessageSquare, ListTodo, Trophy, LayoutGrid, Trash2, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { RoomRecord } from "../types";

interface DashboardProps {
  savedRooms: RoomRecord[];
  onSelectRoom: (id: string) => void;
  onDeleteRoom: (id: string) => void;
  onNavigateToScan: () => void;
  onNavigateToChat: () => void;
}

export default function Dashboard({
  savedRooms,
  onSelectRoom,
  onDeleteRoom,
  onNavigateToScan,
  onNavigateToChat,
}: DashboardProps) {
  // Compute aggregated stats
  const roomsCount = savedRooms.length;
  
  const totalSteps = savedRooms.reduce(
    (acc, room) => acc + (room.analysis.actionPlan?.length || 0),
    0
  );
  const completedSteps = savedRooms.reduce(
    (acc, room) => acc + (room.completedSteps?.length || 0),
    0
  );

  const totalQuickWins = savedRooms.reduce(
    (acc, room) => acc + (room.analysis.quickWins?.length || 0),
    0
  );
  const completedQuickWins = savedRooms.reduce(
    (acc, room) => acc + (room.completedQuickWins?.length || 0),
    0
  );

  const totalTasks = totalSteps + totalQuickWins;
  const totalCompleted = completedSteps + completedQuickWins;
  const overallTidyPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Average Organization Score
  const averageScore =
    roomsCount > 0
      ? (
          savedRooms.reduce((acc, room) => acc + room.analysis.organizationScore, 0) /
          roomsCount
        ).toFixed(1)
      : "N/A";

  // Category Icon helper
  const getRoomIcon = (roomType: string) => {
    switch (roomType) {
      case "living-room":
        return "🛋️";
      case "bedroom":
        return "🛏️";
      case "kitchen":
        return "🍳";
      case "office":
        return "💻";
      case "closet":
        return "👕";
      case "bathroom":
        return "🛁";
      default:
        return "🏠";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8" id="dashboard-container">
      
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-10 text-white sm:px-12 sm:py-14 shadow-xl shadow-zinc-900/10" id="dashboard-hero">
        {/* Subtle mesh background design */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-800/40 via-zinc-900 to-zinc-900 opacity-90 z-0" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl z-0" />

        <div className="relative z-10 flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-8">
          <div className="max-w-xl space-y-2">
            <span className="inline-flex items-center rounded-full bg-teal-500/25 px-2.5 py-0.5 text-xs font-semibold text-teal-300">
              Welcome to SpaceHarmonize
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Bring peace and order to your home.
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Upload photos of your room clutter and let Gemini formulate targeted checklists, product plans, and spatial layovers. Chat with coach Aura to stay motivated!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 shrink-0">
            <button
              onClick={onNavigateToScan}
              id="hero-scan-room-btn"
              className="inline-flex items-center justify-center space-x-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-teal-400 active:scale-[0.98]"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Scan New Room</span>
            </button>

            <button
              onClick={onNavigateToChat}
              id="hero-chat-btn"
              className="inline-flex items-center justify-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98]"
            >
              <MessageSquare className="h-4.5 w-4.5 text-teal-400" />
              <span>Ask Coach Aura</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Summary Accomplishment Bento Grid */}
      {roomsCount > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" id="accomplishments-grid">
          {/* Total spaces */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center space-x-4 shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Scanned Spaces</p>
              <p className="text-2xl font-bold text-zinc-900 mt-0.5">{roomsCount}</p>
            </div>
          </div>

          {/* Overall tidy progress */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center space-x-4 shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ListTodo className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Overall Progress</p>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-bold text-zinc-900">{overallTidyPercentage}%</span>
                <span className="text-[10px] text-zinc-400">
                  ({totalCompleted}/{totalTasks} items)
                </span>
              </div>
            </div>
          </div>

          {/* Avg rating score */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center space-x-4 shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Avg Room Score</p>
              <p className="text-2xl font-bold text-zinc-900 mt-0.5">{averageScore} / 10</p>
            </div>
          </div>

          {/* Quick encouragement advice */}
          <div className="rounded-2xl border border-zinc-200 bg-teal-50/50 p-5 border-dashed flex items-center space-x-3.5 shadow-2xs">
            <div className="text-xl">✨</div>
            <div>
              <p className="text-[11px] font-bold text-teal-800">Declutter Challenge</p>
              <p className="text-[10px] text-teal-600 mt-0.5 leading-normal">
                Spend 5 minutes sorting a single drawer or desktop surfaces today.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Body: Saved Rooms List or Empty State */}
      <div className="space-y-4" id="my-spaces-section">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900">
            My Scanned Spaces
          </h3>
          {roomsCount > 0 && (
            <span className="text-xs text-zinc-400">
              Select any space to open deep analysis and checklists
            </span>
          )}
        </div>

        {roomsCount === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-16 px-6 text-center shadow-xs" id="empty-state-container">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-6">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900">No rooms scanned yet</h4>
            <p className="mt-1.5 max-w-sm text-xs text-zinc-500 leading-relaxed">
              Scan a photo of your bedroom, office, closet, or kitchen to generate customized steps, organization grades, and storage item designs.
            </p>
            <button
              onClick={onNavigateToScan}
              id="empty-scan-btn"
              className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-teal-500 shadow-md shadow-teal-600/5 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Scan Your First Room</span>
            </button>
          </div>
        ) : (
          /* Rooms Gallery Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" id="spaces-gallery-grid">
            {savedRooms.map((room) => {
              const rTotal = (room.analysis.actionPlan?.length || 0) + (room.analysis.quickWins?.length || 0);
              const rDone = (room.completedSteps?.length || 0) + (room.completedQuickWins?.length || 0);
              const progress = rTotal > 0 ? Math.round((rDone / rTotal) * 100) : 0;

              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:border-zinc-300 transition-all cursor-pointer hover:shadow-xs hover:translate-y-[-2px]"
                  id={`room-card-${room.id}`}
                >
                  {/* Photo area */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Category Icon Badge */}
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-xs text-sm">
                      {getRoomIcon(room.roomType)}
                    </div>

                    {/* Score overlay */}
                    <div className="absolute right-3 top-3 flex items-center space-x-1 rounded-lg bg-zinc-950/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                      <span>Harmony Score:</span>
                      <span className="text-teal-400">{room.analysis.organizationScore}</span>
                    </div>
                  </div>

                  {/* Room details */}
                  <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 group-hover:text-teal-600 transition-colors truncate max-w-[80%]">
                          {room.name}
                        </h4>
                        <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-snug line-clamp-2">
                        {room.analysis.clutterAnalysis}
                      </p>
                    </div>

                    {/* Progress details */}
                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-zinc-600">Decluttered</span>
                        <span className="font-bold text-teal-600">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-0.5">
                        <span>{rDone} of {rTotal} cleared</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRoom(room.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:underline inline-flex items-center space-x-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
