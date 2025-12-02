import React, { useState, useEffect } from 'react';
    import { Smile, Meh, Frown, Angry, CloudRain, Sun, Zap, CheckCircle2 } from 'lucide-react';
    import { MoodLog, Habit } from '../types';
    import { getAffirmation } from '../services/geminiService';
    import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
    
    interface DashboardProps {
      addMoodLog: (mood: MoodLog) => void;
      habits: Habit[];
      moodLogs: MoodLog[];
      toggleHabit: (id: string, date: string) => void;
    }
    
    export const Dashboard: React.FC<DashboardProps> = ({ addMoodLog, habits, moodLogs, toggleHabit }) => {
      const [sliderValue, setSliderValue] = useState(50);
      const [selectedMood, setSelectedMood] = useState<string | null>(null);
      const [affirmation, setAffirmation] = useState<string>('Loading your daily spark...');
    
      useEffect(() => {
        getAffirmation('Confidence').then(setAffirmation);
      }, []);
    
      const handleSaveMood = () => {
        if (!selectedMood) return;
        addMoodLog({
          id: Date.now().toString(),
          timestamp: Date.now(),
          mood: selectedMood as any,
          intensity: sliderValue,
          tags: []
        });
        // Reset selection optionally, or show success
        alert('Mood tracked!');
        setSelectedMood(null);
      };
    
      const today = new Date().toISOString().split('T')[0];
    
      const moods = [
        { label: 'Happy', icon: <Smile className="text-yellow-500" />, color: 'bg-yellow-50 border-yellow-200' },
        { label: 'Calm', icon: <Sun className="text-orange-400" />, color: 'bg-orange-50 border-orange-200' },
        { label: 'Tired', icon: <CloudRain className="text-blue-400" />, color: 'bg-blue-50 border-blue-200' },
        { label: 'Sad', icon: <Frown className="text-indigo-500" />, color: 'bg-indigo-50 border-indigo-200' },
        { label: 'Anxious', icon: <Zap className="text-purple-500" />, color: 'bg-purple-50 border-purple-200' },
        { label: 'Angry', icon: <Angry className="text-red-500" />, color: 'bg-red-50 border-red-200' },
      ];
    
      // Prepare chart data (last 7 logs)
      const chartData = moodLogs.slice(-7).map(log => ({
        time: new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
        intensity: log.intensity
      }));
    
      return (
        <div className="space-y-6 pb-20">
          {/* Welcome & Affirmation */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold mb-2">Hello, Friend</h1>
            <p className="text-blue-100 opacity-90 italic">"{affirmation}"</p>
          </div>
    
          {/* Mood Tracker */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">How are you feeling?</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    selectedMood === m.label 
                      ? `${m.color} ring-2 ring-blue-400 ring-offset-2` 
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {React.cloneElement(m.icon as any, { size: 28 })}
                  <span className="text-xs font-medium text-slate-600">{m.label}</span>
                </button>
              ))}
            </div>
            
            {selectedMood && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>Mild</span>
                  <span>Intense</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
                />
                <button 
                  onClick={handleSaveMood}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Log Mood
                </button>
              </div>
            )}
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Habits */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Daily Goals</h2>
              <div className="space-y-3">
                {habits.map(habit => {
                  const isCompleted = habit.completedDates.includes(today);
                  return (
                    <div 
                      key={habit.id} 
                      onClick={() => toggleHabit(habit.id, today)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <span className={`font-medium ${isCompleted ? 'text-green-700' : 'text-slate-600'}`}>
                        {habit.name}
                      </span>
                      <CheckCircle2 className={`${isCompleted ? 'text-green-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
                {habits.length === 0 && <p className="text-slate-400 text-sm">Add habits in the Habits tab.</p>}
              </div>
            </div>
    
            {/* Mini Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Mood Trend</h2>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                      itemStyle={{ color: '#2563eb' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="intensity" 
                      stroke="#2563eb" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      );
    };