export interface AnalysisResult {
  roomType: string;
  organizationScore: number;
  clutterAnalysis: string;
  quickWins: string[];
  actionPlan: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  storageSolutions: Array<{
    solution: string;
    benefit: string;
  }>;
  layoutSuggestions: string;
}

export interface RoomRecord {
  id: string;
  name: string;
  image: string; // base64 dataUrl
  roomType: string;
  challenges: string[];
  style: string;
  analysis: AnalysisResult;
  createdAt: string;
  completedSteps: number[]; // step numbers that have been completed
  completedQuickWins: number[]; // quick win index offsets that have been completed
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export type RoomTypeOption = {
  value: string;
  label: string;
  icon: string;
};

export type StyleOption = {
  value: string;
  label: string;
  description: string;
};
