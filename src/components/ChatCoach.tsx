import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, HelpCircle, User, Bot, RefreshCw, XCircle } from "lucide-react";
import { RoomRecord, Message } from "../types";

interface ChatCoachProps {
  savedRooms: RoomRecord[];
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  onSendMessage: (message: string, roomId: string | null) => Promise<string>;
}

const CHIP_SUGGESTIONS = [
  { text: "How do I start sorting a very messy closet?", label: "Closet tips" },
  { text: "How can I store books without cluttering desks?", label: "Storing books" },
  { text: "What's the 'one-in, one-out' rule?", label: "Declutter rule" },
  { text: "Help me deal with emotional attachments to items.", label: "Emotional clutter" },
  { text: "Recommend some budget storage bins.", label: "Budget bins" },
];

export default function ChatCoach({
  savedRooms,
  activeRoomId,
  setActiveRoomId,
  chatHistory,
  setChatHistory,
  onSendMessage,
}: ChatCoachProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Handle active room context
  const activeRoom = savedRooms.find((r) => r.id === activeRoomId) || null;

  // Handle submission
  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const messageText = (textOverride || inputText).trim();

    if (!messageText || isLoading) return;

    // Clear input
    if (!textOverride) setInputText("");
    setError(null);

    // Append user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call parent handler which makes the full-stack API call
      const reply = await onSendMessage(messageText, activeRoomId);

      const coachMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      console.error(err);
      setError("Failed to get response from Aura. Please try sending your message again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      setChatHistory([
        {
          id: "welcome",
          role: "assistant",
          text: "Hi there! I'm Aura, your personal home organization coach. Select a room photo from your scanned history above to get custom context, or ask me any general decluttering questions to get started!",
          timestamp: new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setError(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8" id="chat-coach-container">
      <div className="flex flex-col h-[640px] rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        
        {/* Chat top bar */}
        <div className="flex flex-col space-y-3 bg-zinc-50 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Aura Organization Coach</h3>
              <p className="text-[10px] text-zinc-500">Always online &bull; Powered by Gemini 3.5 Flash</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Context Selector */}
            <div className="flex items-center space-x-1">
              <label htmlFor="room-context-select" className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Context:
              </label>
              <select
                id="room-context-select"
                value={activeRoomId || ""}
                onChange={(e) => setActiveRoomId(e.target.value ? e.target.value : null)}
                className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 outline-none focus:border-teal-500"
              >
                <option value="">General (No Context)</option>
                {savedRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.analysis.organizationScore}/10)
                  </option>
                ))}
              </select>
            </div>

            {/* Clear History Button */}
            <button
              onClick={handleClearHistory}
              title="Clear chat history"
              className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Room Context Alert Banner */}
        {activeRoom && (
          <div className="flex items-center justify-between bg-teal-50 px-4 py-2 border-b border-teal-100/50 text-xs text-teal-800" id="chat-context-banner">
            <div className="flex items-center space-x-2">
              <span className="text-sm">💡</span>
              <p className="font-medium truncate max-w-lg">
                Coaching linked to <span className="font-bold">{activeRoom.name}</span>. Ask details about step goals, storage recommendations, or scoring metrics.
              </p>
            </div>
            <button
              onClick={() => setActiveRoomId(null)}
              className="text-teal-600 hover:text-teal-900 font-semibold"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-zinc-50/30" id="chat-messages-thread">
          {chatHistory.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] space-x-2.5 ${
                    isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
                  }`}
                >
                  {/* Icon Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isUser ? "bg-teal-100 text-teal-700" : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* Bubble */}
                  <div className="space-y-1">
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-teal-600 text-white rounded-tr-none"
                          : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none"
                      }`}
                    >
                      {/* Preserve formatting with white-space pre-wrap */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <p
                      className={`text-[9px] text-zinc-400 ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading bubble */}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[80%] items-start space-x-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="rounded-2xl bg-white border border-zinc-200 px-4 py-3 rounded-tl-none shadow-xs">
                    <div className="flex space-x-1.5 items-center py-1">
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center p-2 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs items-center space-x-2">
              <XCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>

        {/* Starters Suggestions Chips */}
        {chatHistory.length <= 2 && !isLoading && (
          <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 flex flex-wrap gap-2" id="chat-suggestions-chips">
            {CHIP_SUGGESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(undefined, chip.text)}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-600 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/20 shadow-xs transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-200 bg-white flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={
              activeRoom
                ? `Ask Aura about ${activeRoom.name}...`
                : "Ask about folding, organizing shelves, layouts..."
            }
            className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-2.5 text-xs text-zinc-900 shadow-xs outline-none focus:border-teal-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition-all ${
              inputText.trim() && !isLoading
                ? "bg-teal-600 hover:bg-teal-500 shadow-teal-600/10 active:scale-95"
                : "bg-zinc-100 text-zinc-300 shadow-none cursor-not-allowed"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
