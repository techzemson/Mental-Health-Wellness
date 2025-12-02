import React, { useState } from 'react';
import { Plus, Trash2, Flame, Check, Trophy, TrendingUp } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  addHabit: (name: string) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, addHabit, removeHabit, toggleHabit }) => {
  const [newHabitName, setNewHabitName] = useState('');

  const handleAdd = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName);
      setNewHabitName('');
    }
  };

  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const days = getLast7Days();

  // Calculate overall progress
  const totalHabits = habits.length;
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const progressPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10" />
            <h3 className="text-blue-100 font-medium mb-1">Today's Focus</h3>
            <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">{completedToday}/{totalHabits}</span>
                <span className="text-blue-200 mb-1">completed</span>
            </div>
            <div className="mt-4 w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-white h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Flame size={20} />
                </div>
                <span className="text-slate-500 font-medium">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
                {Math.max(0, ...habits.map(h => h.streak))} <span className="text-sm font-normal text-slate-400">days</span>
            </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                    <Trophy size={20} />
                </div>
                <span className="text-slate-500 font-medium">Total Wins</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
                {habits.reduce((acc, curr) => acc + curr.completedDates.length, 0)} <span className="text-sm font-normal text-slate-400">check-ins</span>
            </p>
        </div>
      </div>

      {/* Main Habit List */}
      <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800">Habit Builder</h2>
            <div className="flex w-full sm:w-auto gap-2">
                <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="New habit..."
                    className="flex-1 sm:w-64 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button 
                    onClick={handleAdd}
                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 pb-4 pl-2">Habit</th>
                {days.map(day => (
                  <th key={day} className="text-center text-xs font-semibold uppercase text-slate-400 pb-4">
                    <div className="flex flex-col items-center">
                        <span>{new Date(day).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                        <span className={`text-[10px] mt-1 ${day === today ? 'bg-blue-100 text-blue-600 px-1.5 rounded-full' : ''}`}>
                             {new Date(day).getDate()}
                        </span>
                    </div>
                  </th>
                ))}
                <th className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 pb-4">Streak</th>
                <th className="w-10 pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-2 font-medium text-slate-700">{habit.name}</td>
                  {days.map(day => {
                    const isCompleted = habit.completedDates.includes(day);
                    return (
                      <td key={day} className="py-3 text-center">
                        <button
                          onClick={() => toggleHabit(habit.id, day)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-blue-500 text-white shadow-md shadow-blue-200 scale-100' 
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200 scale-90'
                          }`}
                        >
                          {isCompleted && <Check size={18} strokeWidth={3} />}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 text-center">
                    <div className={`flex items-center justify-center gap-1 font-bold ${habit.streak > 0 ? 'text-orange-500' : 'text-slate-300'}`}>
                      <Flame size={16} className={habit.streak > 0 ? 'fill-orange-500' : ''} />
                      {habit.streak}
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <button 
                      onClick={() => removeHabit(habit.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {habits.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                        <TrendingUp size={32} className="text-slate-200" />
                        <p>No habits yet. Start small today!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};