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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'dashboard' | 'journal' | 'chat' | 'breathe' | 'habits' | 'analytics';

export interface UserPreferences {
  name: string;
  theme: 'light' | 'dark' | 'nature';
  pin: string | null; // For private vault
}