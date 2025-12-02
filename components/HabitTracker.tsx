import React, { useState } from 'react';
import { Plus, Trash2, Flame, Check } from 'lucide-react';
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

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Habit Builder</h2>
        
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit (e.g., Drink water)"
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button 
            onClick={handleAdd}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-slate-400 pb-4">Habit</th>
                {days.map(day => (
                  <th key={day} className="text-center text-xs font-medium text-slate-400 pb-4">
                    {new Date(day).toLocaleDateString(undefined, { weekday: 'short' })}
                  </th>
                ))}
                <th className="text-center text-sm font-medium text-slate-400 pb-4">Streak</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id} className="border-t border-slate-50 group">
                  <td className="py-4 font-medium text-slate-700">{habit.name}</td>
                  {days.map(day => {
                    const isCompleted = habit.completedDates.includes(day);
                    return (
                      <td key={day} className="py-4 text-center">
                        <button
                          onClick={() => toggleHabit(habit.id, day)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-green-500 text-white shadow-md scale-100' 
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200 scale-90'
                          }`}
                        >
                          {isCompleted && <Check size={16} />}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-500 font-bold">
                      <Flame size={16} />
                      {habit.streak}
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => removeHabit(habit.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {habits.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400 italic">
                    Start tracking small wins today.
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