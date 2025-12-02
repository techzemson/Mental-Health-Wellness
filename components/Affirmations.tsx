import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, Sun, Moon, Coffee, Sparkles, Copy, Share2 } from 'lucide-react';
import { Affirmation } from '../types';
import { getAffirmation } from '../services/geminiService';

interface AffirmationsProps {
  favorites: Affirmation[];
  toggleFavorite: (affirmation: Affirmation) => void;
}

const CATEGORIES = [
  { id: 'Confidence', label: 'Confidence', color: 'from-orange-400 to-pink-500' },
  { id: 'Anxiety', label: 'Anxiety Relief', color: 'from-blue-400 to-cyan-500' },
  { id: 'Productivity', label: 'Productivity', color: 'from-emerald-400 to-teal-500' },
  { id: 'Healing', label: 'Healing', color: 'from-purple-400 to-indigo-500' },
  { id: 'Self-love', label: 'Self Love', color: 'from-rose-400 to-red-500' },
];

export const Affirmations: React.FC<AffirmationsProps> = ({ favorites, toggleFavorite }) => {
  const [currentAffirmation, setCurrentAffirmation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState('Confidence');
  const [loading, setLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');
  const [view, setView] = useState<'generate' | 'favorites'>('generate');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 18) setTimeOfDay('Afternoon');
    else setTimeOfDay('Night');
    
    // Initial fetch
    handleGenerate('Confidence');
  }, []);

  const handleGenerate = async (category: string) => {
    setLoading(true);
    setSelectedCategory(category);
    const text = await getAffirmation(category, timeOfDay);
    setCurrentAffirmation(text);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAffirmation);
    // Could add toast here
  };

  const isCurrentFavorite = favorites.some(f => f.text === currentAffirmation);

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Affirmations</h2>
           <p className="text-slate-500">Positive thoughts for your {timeOfDay.toLowerCase()}.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
                onClick={() => setView('generate')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'generate' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
             >
                Discover
             </button>
             <button 
                onClick={() => setView('favorites')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'favorites' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
             >
                Favorites
             </button>
        </div>
      </div>

      {view === 'generate' ? (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
             {/* Main Card */}
             <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${CATEGORIES.find(c => c.id === selectedCategory)?.color || 'from-blue-400 to-indigo-500'}`} />
                
                <div className="z-10 max-w-2xl">
                    <div className="mb-6 flex justify-center gap-4">
                        <button 
                            onClick={() => setTimeOfDay('Morning')}
                            className={`p-2 rounded-full ${timeOfDay === 'Morning' ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200' : 'text-slate-300 hover:bg-slate-50'}`}
                        >
                            <Coffee size={20} />
                        </button>
                        <button 
                            onClick={() => setTimeOfDay('Afternoon')}
                            className={`p-2 rounded-full ${timeOfDay === 'Afternoon' ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-200' : 'text-slate-300 hover:bg-slate-50'}`}
                        >
                            <Sun size={20} />
                        </button>
                         <button 
                            onClick={() => setTimeOfDay('Night')}
                            className={`p-2 rounded-full ${timeOfDay === 'Night' ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-200' : 'text-slate-300 hover:bg-slate-50'}`}
                        >
                            <Moon size={20} />
                        </button>
                    </div>

                    <div className="min-h-[200px] flex items-center justify-center mb-8">
                        {loading ? (
                             <RefreshCw className="animate-spin text-slate-300 w-10 h-10" />
                        ) : (
                            <h3 className="text-3xl md:text-4xl font-serif text-slate-800 leading-tight animate-in fade-in zoom-in duration-500">
                                "{currentAffirmation}"
                            </h3>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                         <button 
                            onClick={() => handleGenerate(selectedCategory)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            <Sparkles size={18} />
                            New Affirmation
                        </button>
                        <button 
                            onClick={() => toggleFavorite({ 
                                id: Date.now().toString(), 
                                text: currentAffirmation, 
                                category: selectedCategory, 
                                isFavorite: true, 
                                timestamp: Date.now() 
                            })}
                            className={`p-3 rounded-full border transition-all ${isCurrentFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                        >
                            <Heart size={20} className={isCurrentFavorite ? "fill-current" : ""} />
                        </button>
                        <button onClick={handleCopy} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-full hover:border-slate-300 transition-all">
                            <Copy size={20} />
                        </button>
                    </div>
                </div>
             </div>

             {/* Sidebar Categories */}
             <div className="w-full lg:w-72 flex flex-col gap-3 overflow-y-auto">
                <h4 className="font-semibold text-slate-700 mb-2">Categories</h4>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleGenerate(cat.id)}
                        className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden group ${
                            selectedCategory === cat.id 
                            ? 'bg-white border-slate-300 shadow-md scale-[1.02]' 
                            : 'bg-white border-slate-100 hover:border-slate-200 text-slate-500'
                        }`}
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${cat.color}`} />
                        <span className={`font-medium ${selectedCategory === cat.id ? 'text-slate-800' : ''}`}>{cat.label}</span>
                    </button>
                ))}
             </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20">
             {favorites.length === 0 ? (
                 <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-20">
                     <Heart size={48} className="mb-4 text-slate-200" />
                     <p>No favorites yet.</p>
                 </div>
             ) : (
                 favorites.map(aff => (
                     <div key={aff.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all">
                         <div className="mb-4">
                             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                                {aff.category}
                             </span>
                         </div>
                         <p className="text-lg font-medium text-slate-700 mb-6">"{aff.text}"</p>
                         <button 
                            onClick={() => toggleFavorite(aff)}
                            className="absolute bottom-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Heart size={18} className="fill-current" />
                         </button>
                     </div>
                 ))
             )}
        </div>
      )}
    </div>
  );
};