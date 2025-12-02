
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Book, MessageCircle, Wind, CheckSquare, Sparkles, ListTodo, Menu, X, Sun, Music } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { AIChatbot } from './components/AIChatbot';
import { BreathingTool } from './components/BreathingTool';
import { HabitTracker } from './components/HabitTracker';
import { Affirmations } from './components/Affirmations';
import { TodoList } from './components/TodoList';
import { Manifestation } from './components/Manifestation';
import { Mantras } from './components/Mantras';
import { MoodLog, JournalEntry, Habit, ViewState, UserPreferences, Affirmation, Todo, ManifestationData } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for data
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [manifestationData, setManifestationData] = useState<ManifestationData>({
    intention: '',
    vibrationLevel: 75,
    universeBox: [],
    cheque: { payee: 'Me', amount: '', memo: '', date: new Date().toLocaleDateString(), signature: '' },
    visionBoard: [],
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: 'User',
    theme: 'light',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedMoods = localStorage.getItem('moodLogs');
    const loadedJournal = localStorage.getItem('journalEntries');
    const loadedHabits = localStorage.getItem('habits');
    const loadedAffirmations = localStorage.getItem('affirmations');
    const loadedTodos = localStorage.getItem('todos');
    const loadedManifestation = localStorage.getItem('manifestation');
    
    if (loadedMoods) setMoodLogs(JSON.parse(loadedMoods));
    if (loadedJournal) setJournalEntries(JSON.parse(loadedJournal));
    if (loadedHabits) setHabits(JSON.parse(loadedHabits));
    if (loadedAffirmations) setAffirmations(JSON.parse(loadedAffirmations));
    if (loadedTodos) setTodos(JSON.parse(loadedTodos));
    if (loadedManifestation) setManifestationData(JSON.parse(loadedManifestation));
  }, []);

  // Save data effects
  useEffect(() => localStorage.setItem('moodLogs', JSON.stringify(moodLogs)), [moodLogs]);
  useEffect(() => localStorage.setItem('journalEntries', JSON.stringify(journalEntries)), [journalEntries]);
  useEffect(() => localStorage.setItem('habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('affirmations', JSON.stringify(affirmations)), [affirmations]);
  useEffect(() => localStorage.setItem('todos', JSON.stringify(todos)), [todos]);
  useEffect(() => localStorage.setItem('manifestation', JSON.stringify(manifestationData)), [manifestationData]);

  // Handlers
  const addMoodLog = (log: MoodLog) => setMoodLogs(prev => [...prev, log]);
  const addJournalEntry = (entry: JournalEntry) => setJournalEntries(prev => [entry, ...prev]);
  
  const addHabit = (name: string) => {
    setHabits(prev => [...prev, { 
      id: Date.now().toString(), 
      name, 
      completedDates: [], 
      streak: 0,
      frequency: 'daily',
      targetDays: 7
    }]);
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
      
      const streak = newDates.length; 

      return { ...h, completedDates: newDates, streak };
    }));
  };

  const toggleFavoriteAffirmation = (aff: Affirmation) => {
    setAffirmations(prev => {
      const exists = prev.find(a => a.text === aff.text);
      if (exists) {
        return prev.filter(a => a.text !== aff.text);
      }
      return [aff, ...prev];
    });
  };

  const addTodo = (todo: Todo) => setTodos(prev => [todo, ...prev]);
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };
  const deleteTodo = (id: string) => setTodos(prev => prev.filter(t => t.id !== id));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'journal', label: 'Journal', icon: <Book size={20} /> },
    { id: 'affirmations', label: 'Affirmations', icon: <Sparkles size={20} /> },
    { id: 'manifestation', label: 'Manifestation', icon: <Sun size={20} /> },
    { id: 'mantras', label: 'Powerful Mantras', icon: <Music size={20} /> },
    { id: 'habits', label: 'Habits', icon: <CheckSquare size={20} /> },
    { id: 'todo', label: 'Tasks & Notes', icon: <ListTodo size={20} /> },
    { id: 'chat', label: 'AI Therapist', icon: <MessageCircle size={20} /> },
    { id: 'breathe', label: 'Breathe', icon: <Wind size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 p-6 z-10">
        <div className="flex items-center gap-2.5 mb-10 text-blue-600 px-2">
          <div className="p-2 bg-blue-50 rounded-xl">
             <Wind className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Mindful</h1>
        </div>
        
        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-2 scrollbar-hide">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium duration-200 ${
                view === item.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 mt-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {preferences.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{preferences.name}</p>
              <p className="text-xs text-slate-400">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 p-4 z-50 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-2 text-blue-600">
          <Wind className="w-6 h-6" />
          <h1 className="text-lg font-bold text-slate-800">Mindful</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6 animate-in slide-in-from-right duration-200 overflow-y-auto">
           <nav className="space-y-3 pb-10">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewState);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
                  view === item.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
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
      <main className="flex-1 overflow-hidden h-full relative w-full">
        <div className="h-full overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto scroll-smooth">
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
            />
          )}
          {view === 'affirmations' && (
            <Affirmations 
              favorites={affirmations} 
              toggleFavorite={toggleFavoriteAffirmation} 
            />
          )}
          {view === 'manifestation' && (
            <Manifestation 
              data={manifestationData}
              updateData={setManifestationData}
            />
          )}
          {view === 'mantras' && (
             <Mantras />
          )}
          {view === 'todo' && (
            <TodoList 
              todos={todos} 
              addTodo={addTodo} 
              updateTodo={updateTodo} 
              deleteTodo={deleteTodo} 
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
