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

export type ViewState = 'dashboard' | 'journal' | 'chat' | 'breathe' | 'habits' | 'affirmations' | 'todo';

export interface UserPreferences {
  name: string;
  theme: 'light' | 'dark' | 'nature';
}