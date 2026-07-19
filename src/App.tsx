import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import RoomAnalyzer from "./components/RoomAnalyzer";
import AnalysisResults from "./components/AnalysisResults";
import ChatCoach from "./components/ChatCoach";
import { RoomRecord, Message, AnalysisResult } from "./types";

const LOCAL_STORAGE_KEY_ROOMS = "spaceharmonize_rooms";
const LOCAL_STORAGE_KEY_CHAT = "spaceharmonize_chat_history";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "new-analysis" | "chat">("dashboard");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [savedRooms, setSavedRooms] = useState<RoomRecord[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null); // Connected context in Chat
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  // Initial chat state
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi there! I'm Aura, your personal home organization and decluttering expert. Upload a photo of any space for a full analysis, or ask me questions about sorting wardrobes, styling bookcases, or managing cord clutter!",
      timestamp: new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // Load rooms and chat history from local storage on mount
  useEffect(() => {
    try {
      const storedRooms = localStorage.getItem(LOCAL_STORAGE_KEY_ROOMS);
      if (storedRooms) {
        setSavedRooms(JSON.parse(storedRooms));
      }

      const storedChat = localStorage.getItem(LOCAL_STORAGE_KEY_CHAT);
      if (storedChat) {
        setChatHistory(JSON.parse(storedChat));
      }
    } catch (e) {
      console.error("Failed to load local storage data", e);
    }
  }, []);

  // Save rooms to local storage on update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ROOMS, JSON.stringify(savedRooms));
    } catch (e) {
      console.error("Failed to save rooms to local storage", e);
    }
  }, [savedRooms]);

  // Save chat history to local storage on update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHAT, JSON.stringify(chatHistory));
    } catch (e) {
      console.error("Failed to save chat history to local storage", e);
    }
  }, [chatHistory]);

  // 1. Core API call to analyze room photo
  const handleAnalyzeRoom = async (payload: {
    image: string;
    roomType: string;
    challenges: string[];
    style: string;
    customName: string;
  }) => {
    setIsAnalyzing(true);
    setAppError(null);

    try {
      const response = await fetch("/api/analyze-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: payload.image,
          roomType: payload.roomType,
          challenges: payload.challenges,
          style: payload.style,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze room photo");
      }

      const result: AnalysisResult = await response.json();

      const newRecord: RoomRecord = {
        id: Date.now().toString(),
        name: payload.customName,
        image: payload.image,
        roomType: payload.roomType,
        challenges: payload.challenges,
        style: payload.style,
        analysis: result,
        createdAt: new Date().toISOString(),
        completedSteps: [],
        completedQuickWins: [],
      };

      setSavedRooms((prev) => [newRecord, ...prev]);
      setSelectedRoomId(newRecord.id); // Direct user to results detail page
      setActiveTab("dashboard"); // Go to dashboard tab (which renders details if selectedRoomId is set)
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setAppError(err.message || "An unexpected error occurred during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Core API call to chat with organizer coach
  const handleSendMessage = async (messageText: string, roomId: string | null) => {
    const roomContext = savedRooms.find((r) => r.id === roomId);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
        // Send up to last 15 messages for history context to stay concise
        history: chatHistory.slice(-15),
        roomContext: roomContext ? roomContext.analysis : null,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to communicate with Aura");
    }

    const data = await response.json();
    return data.reply;
  };

  // Toggle step completion checklist items
  const handleToggleStep = (roomId: string, stepNumber: number) => {
    setSavedRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const currentCompleted = room.completedSteps || [];
        const isCompleted = currentCompleted.includes(stepNumber);
        const updatedCompleted = isCompleted
          ? currentCompleted.filter((s) => s !== stepNumber)
          : [...currentCompleted, stepNumber];
        return {
          ...room,
          completedSteps: updatedCompleted,
        };
      })
    );
  };

  // Toggle quick win checklist items
  const handleToggleQuickWin = (roomId: string, index: number) => {
    setSavedRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const currentCompleted = room.completedQuickWins || [];
        const isCompleted = currentCompleted.includes(index);
        const updatedCompleted = isCompleted
          ? currentCompleted.filter((i) => i !== index)
          : [...currentCompleted, index];
        return {
          ...room,
          completedQuickWins: updatedCompleted,
        };
      })
    );
  };

  const handleDeleteRoom = (id: string) => {
    if (window.confirm("Are you sure you want to delete this space from your history?")) {
      setSavedRooms((prev) => prev.filter((r) => r.id !== id));
      if (selectedRoomId === id) {
        setSelectedRoomId(null);
      }
      if (activeRoomId === id) {
        setActiveRoomId(null);
      }
    }
  };

  // Direct trigger to chat with specific room context pre-bound
  const handleChatWithRoomContext = (roomId: string) => {
    setActiveRoomId(roomId);
    setActiveTab("chat");
  };

  // Render core views
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        if (selectedRoomId) {
          const selectedRoom = savedRooms.find((r) => r.id === selectedRoomId);
          if (selectedRoom) {
            return (
              <AnalysisResults
                record={selectedRoom}
                onBack={() => setSelectedRoomId(null)}
                onDelete={handleDeleteRoom}
                onToggleStep={(stepNum) => handleToggleStep(selectedRoom.id, stepNum)}
                onToggleQuickWin={(index) => handleToggleQuickWin(selectedRoom.id, index)}
                onChatWithCoach={() => handleChatWithRoomContext(selectedRoom.id)}
              />
            );
          }
        }
        return (
          <Dashboard
            savedRooms={savedRooms}
            onSelectRoom={(id) => setSelectedRoomId(id)}
            onDeleteRoom={handleDeleteRoom}
            onNavigateToScan={() => setActiveTab("new-analysis")}
            onNavigateToChat={() => setActiveTab("chat")}
          />
        );

      case "new-analysis":
        return (
          <RoomAnalyzer
            onAnalyze={handleAnalyzeRoom}
            isAnalyzing={isAnalyzing}
          />
        );

      case "chat":
        return (
          <ChatCoach
            savedRooms={savedRooms}
            activeRoomId={activeRoomId}
            setActiveRoomId={setActiveRoomId}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            onSendMessage={handleSendMessage}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans antialiased" id="space-harmonize-app">
      {/* Top sticky navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // When switching tabs, clear selected detailed view unless specifically looking at spaces
          if (tab !== "dashboard") {
            setSelectedRoomId(null);
          }
        }}
        savedRoomsCount={savedRooms.length}
      />

      <main className="pb-16" id="main-content-viewport">
        {/* Global Error Notice Bar */}
        {appError && (
          <div className="mx-auto max-w-4xl px-4 pt-6" id="app-error-banner">
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex justify-between items-center">
              <span>{appError}</span>
              <button
                onClick={() => setAppError(null)}
                className="font-semibold text-red-900 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab Panel */}
        {renderTabContent()}
      </main>
    </div>
  );
}
