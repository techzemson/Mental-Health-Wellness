import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Book, MessageCircle, Wind, CheckSquare, Settings, Menu, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { AIChatbot } from './components/AIChatbot';
import { BreathingTool } from './components/BreathingTool';
import { HabitTracker } from './components/HabitTracker';
import { MoodLog, JournalEntry, Habit, ViewState, UserPreferences } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for data
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: 'User',
    theme: 'light',
    pin: '1234' // Default for demo
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedMoods = localStorage.getItem('moodLogs');
    const loadedJournal = localStorage.getItem('journalEntries');
    const loadedHabits = localStorage.getItem('habits');
    
    if (loadedMoods) setMoodLogs(JSON.parse(loadedMoods));
    if (loadedJournal) setJournalEntries(JSON.parse(loadedJournal));
    if (loadedHabits) setHabits(JSON.parse(loadedHabits));
  }, []);

  // Save data effects
  useEffect(() => localStorage.setItem('moodLogs', JSON.stringify(moodLogs)), [moodLogs]);
  useEffect(() => localStorage.setItem('journalEntries', JSON.stringify(journalEntries)), [journalEntries]);
  useEffect(() => localStorage.setItem('habits', JSON.stringify(habits)), [habits]);

  // Handlers
  const addMoodLog = (log: MoodLog) => setMoodLogs(prev => [...prev, log]);
  const addJournalEntry = (entry: JournalEntry) => setJournalEntries(prev => [entry, ...prev]);
  const addHabit = (name: string) => {
    setHabits(prev => [...prev, { id: Date.now().toString(), name, completedDates: [], streak: 0 }]);
  };
  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };
  const toggleHabit = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const completed = h.completedDates.includes(date);
      let newDates = completed 
        ? h.completedDates.filter(d => d !== date)
        : [...h.completedDates, date];
      
      // Simple streak calc
      const streak = newDates.length; // Simplified for demo
      return { ...h, completedDates: newDates, streak };
    }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'journal', label: 'Journal', icon: <Book size={20} /> },
    { id: 'chat', label: 'AI Therapist', icon: <MessageCircle size={20} /> },
    { id: 'breathe', label: 'Breathe', icon: <Wind size={20} /> },
    { id: 'habits', label: 'Habits', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-10 text-blue-600">
          <Wind className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">Mindful</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                view === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
              {preferences.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{preferences.name}</p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 p-4 z-50 flex justify-between items-center">
         <div className="flex items-center gap-2 text-blue-600">
          <Wind className="w-6 h-6" />
          <h1 className="text-lg font-bold">Mindful</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6">
           <nav className="space-y-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewState);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium ${
                  view === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden h-full relative">
        <div className="h-full overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
              addMoodLog={addMoodLog} 
              moodLogs={moodLogs} 
              habits={habits}
              toggleHabit={toggleHabit}
            />
          )}
          {view === 'journal' && (
            <Journal 
              entries={journalEntries} 
              addEntry={addJournalEntry} 
              pin={preferences.pin} 
            />
          )}
          {view === 'chat' && <AIChatbot />}
          {view === 'breathe' && <BreathingTool />}
          {view === 'habits' && (
            <HabitTracker 
              habits={habits} 
              addHabit={addHabit} 
              removeHabit={removeHabit} 
              toggleHabit={toggleHabit} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;