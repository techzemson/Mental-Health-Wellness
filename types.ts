
export interface MoodLog {
  id: string;
  timestamp: number;
  mood: 'Happy' | 'Calm' | 'Anxious' | 'Sad' | 'Angry' | 'Tired';
  intensity: number; // 1-100
  tags: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  aiAnalysis?: string;
  tags?: string[];
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  streak: number;
  frequency: 'daily' | 'weekly';
  targetDays: number; // e.g., 7 for daily
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  isFavorite: boolean;
  timestamp: number;
}

export interface Todo {
  id: string;
  text: string;
  note?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

// Mantra Types
export interface Mantra {
  id: string;
  title: string; // Display Name (e.g. "Narasimha Kavacham")
  chant: string; // Full Sanskrit Text for Audio/Reading
  translation?: string;
  deity: string;
  benefit: string;
  category: 'Wealth' | 'Protection' | 'Health' | 'Peace' | 'Devotion' | 'Success';
  imageQuery: string;
}

// Manifestation Types
export interface VisionBoardItem {
  id: string;
  type: 'image' | 'text';
  content: string; // URL or text
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  color?: string;
  zIndex: number;
}

export interface Method369 {
  id: string;
  desire: string;
  startDate: string;
  progress: {
    [date: string]: {
      morning: boolean;
      afternoon: boolean;
      night: boolean;
    }
  };
  completed: boolean;
}

export interface ChequeData {
    payee: string;
    amount: string;
    memo: string;
    date: string;
}

export interface ManifestationData {
  intention: string;
  vibrationLevel: number; // 1-100
  universeBox: string[]; // List of worries/desires 'sent' to universe
  cheque: ChequeData;
  visionBoard: VisionBoardItem[];
  active369?: Method369;
}

export type ViewState = 'dashboard' | 'journal' | 'chat' | 'breathe' | 'habits' | 'affirmations' | 'todo' | 'manifestation' | 'mantras';

export interface UserPreferences {
  name: string;
  theme: 'light' | 'dark' | 'nature';
}
