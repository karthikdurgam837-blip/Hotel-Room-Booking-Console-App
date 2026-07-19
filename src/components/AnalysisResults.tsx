import React from "react";
import { CheckCircle2, ChevronLeft, Sparkles, MessageSquare, Trash2, ListChecks, ArrowLeftRight, Check, Package, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { RoomRecord } from "../types";

interface AnalysisResultsProps {
  record: RoomRecord;
  onBack: () => void;
  onDelete?: (id: string) => void;
  onToggleStep: (stepNumber: number) => void;
  onToggleQuickWin: (index: number) => void;
  onChatWithCoach: () => void;
}

export default function AnalysisResults({
  record,
  onBack,
  onDelete,
  onToggleStep,
  onToggleQuickWin,
  onChatWithCoach,
}: AnalysisResultsProps) {
  const { analysis, completedSteps = [], completedQuickWins = [] } = record;

  const totalSteps = analysis.actionPlan?.length || 0;
  const completedStepsCount = completedSteps.length;
  const totalQuickWins = analysis.quickWins?.length || 0;
  const completedQuickWinsCount = completedQuickWins.length;

  const overallProgress = Math.round(
    ((completedStepsCount + completedQuickWinsCount) / (totalSteps + totalQuickWins)) * 100
  );

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 5) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8" id="analysis-results-container">
      {/* Top action header bar */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-zinc-100 pb-5">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            id="results-back-btn"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 shadow-xs transition-all hover:bg-zinc-50 hover:text-zinc-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl">
              {record.name}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Analyzed on {new Date(record.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onDelete && (
            <button
              onClick={() => onDelete(record.id)}
              id="results-delete-btn"
              className="inline-flex items-center space-x-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 shadow-xs transition-all hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete Space</span>
            </button>
          )}

          <button
            onClick={onChatWithCoach}
            id="results-chat-coach-btn"
            className="inline-flex items-center space-x-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-teal-500"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Coach Aura</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Image and quick info overview */}
        <div className="space-y-6 lg:col-span-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-xs">
            <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
              <img
                src={record.image}
                alt={record.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 flex items-center justify-between border-t border-zinc-100">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                Room category:
              </span>
              <span className="text-xs font-semibold text-zinc-800 capitalize">
                {record.roomType.replace("-", " ")}
              </span>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Space Overview
            </h3>

            {/* Score Ring */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-100 p-3.5">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500">Harmony Score</p>
                <p className="text-[10px] text-zinc-400">Current declutter rate</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold ${getScoreColor(
                  analysis.organizationScore
                )}`}
              >
                {analysis.organizationScore}/10
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700">Declutter Progress</span>
                <span className="font-bold text-teal-600">{overallProgress}% Done</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                Complete the Quick Wins and Action Plan below to increase this space's organizational harmony.
              </p>
            </div>
          </div>

          {/* Prompt banner to coaching */}
          <div className="rounded-2xl bg-zinc-50 p-5 border border-zinc-100 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900">Need specific advice?</h4>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Aura, our virtual organization coach, is grounded in your room's vision scan. Ask her to elaborate on any action steps or recommend custom organization items!
              </p>
            </div>
            <button
              onClick={onChatWithCoach}
              className="mt-2 inline-flex w-full items-center justify-center space-x-1.5 rounded-lg border border-zinc-200 bg-white py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-100"
            >
              <MessageSquare className="h-4 w-4 text-teal-600" />
              <span>Discuss Plan with Aura</span>
            </button>
          </div>
        </div>

        {/* Right Column: Analysis recommendations bento-style */}
        <div className="space-y-6 lg:col-span-8">
          {/* Empathetic Overview */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm">👁️</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Gemini Vision Analysis
              </h3>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed italic">
              &ldquo;{analysis.clutterAnalysis}&rdquo;
            </p>
          </div>

          {/* Quick Wins (Checklist) */}
          {analysis.quickWins && analysis.quickWins.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-teal-600" />
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Quick Wins (5-10 Minutes)
                  </h3>
                </div>
                <span className="text-[10px] font-medium text-zinc-400">
                  {completedQuickWinsCount} of {totalQuickWins} cleared
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" id="quick-wins-checklist">
                {analysis.quickWins.map((win, idx) => {
                  const isDone = completedQuickWins.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => onToggleQuickWin(idx)}
                      className={`flex items-start space-x-3 rounded-xl border p-3 text-left transition-all ${
                        isDone
                          ? "border-teal-200 bg-teal-50/20 text-zinc-500"
                          : "border-zinc-100 bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all ${
                          isDone ? "border-teal-600 bg-teal-600 text-white" : "border-zinc-300 bg-white"
                        }`}
                      >
                        {isDone && <Check className="h-3 w-3" />}
                      </div>
                      <span className={`text-xs leading-snug ${isDone ? "line-through opacity-75" : "font-medium"}`}>
                        {win}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Plan (Sequential List) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ListChecks className="h-5 w-5 text-teal-600" />
                <h3 className="text-sm font-semibold text-zinc-900">
                  Step-by-Step Organization Plan
                </h3>
              </div>
              <span className="text-[10px] font-medium text-zinc-400">
                {completedStepsCount} of {totalSteps} complete
              </span>
            </div>

            <div className="space-y-3" id="action-plan-steps">
              {analysis.actionPlan?.map((step) => {
                const isCompleted = completedSteps.includes(step.step);
                return (
                  <div
                    key={step.step}
                    onClick={() => onToggleStep(step.step)}
                    className={`group flex cursor-pointer items-start space-x-4 rounded-xl border p-4 transition-all ${
                      isCompleted
                        ? "border-teal-200 bg-teal-50/10 text-zinc-500"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                    }`}
                  >
                    {/* Circle badge */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        isCompleted
                          ? "bg-teal-100 text-teal-700"
                          : "bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4.5 w-4.5" /> : step.step}
                    </div>

                    <div className="flex-1 space-y-1">
                      <h4
                        className={`text-xs font-semibold tracking-tight text-zinc-900 ${
                          isCompleted ? "line-through opacity-75 text-zinc-400" : ""
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className={`text-[11px] leading-relaxed ${isCompleted ? "opacity-60" : "text-zinc-500"}`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Completion marker */}
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-opacity ${
                        isCompleted
                          ? "border-teal-500 bg-teal-500 text-white"
                          : "border-zinc-200 opacity-20 group-hover:opacity-100"
                      }`}
                    >
                      {isCompleted && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Storage & Layout Bento Box */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Storage Solutions */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-teal-600" />
                <h3 className="text-sm font-semibold text-zinc-900">
                  Recommended Storage
                </h3>
              </div>

              <div className="space-y-3" id="storage-solutions-list">
                {analysis.storageSolutions?.map((sol, idx) => (
                  <div key={idx} className="rounded-xl bg-zinc-50 p-3 border border-zinc-100">
                    <p className="text-xs font-semibold text-teal-800">
                      {sol.solution}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                      {sol.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout & Space Optimization */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="h-5 w-5 text-teal-600" />
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Layout & Space Optimization
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed italic bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  &ldquo;{analysis.layoutSuggestions}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100/50">
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Tip: A clear pathway improves room energy. Focus on creating unobstructed traffic lines across the space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
