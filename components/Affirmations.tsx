import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, Copy, Sparkles, Share2, Maximize2, X, ChevronRight } from 'lucide-react';
import { Affirmation } from '../types';
import { getAffirmationsBatch } from '../services/geminiService';

interface AffirmationsProps {
  favorites: Affirmation[];
  toggleFavorite: (affirmation: Affirmation) => void;
}

const CATEGORIES = [
  { id: 'Money', label: 'Money & Wealth', gradient: 'from-amber-400 to-yellow-600', bg: 'bg-amber-50', text: 'text-amber-900', accent: 'text-amber-600' },
  { id: 'Health', label: 'Health & Vitality', gradient: 'from-emerald-400 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-900', accent: 'text-emerald-600' },
  { id: 'Self Love', label: 'Self Love', gradient: 'from-rose-400 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-900', accent: 'text-rose-600' },
  { id: 'Love', label: 'Love & Relationship', gradient: 'from-red-400 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-900', accent: 'text-pink-600' },
  { id: 'Career', label: 'Career & Success', gradient: 'from-blue-400 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-900', accent: 'text-blue-600' },
  { id: 'Prosperity', label: 'Prosperity', gradient: 'from-purple-400 to-violet-600', bg: 'bg-purple-50', text: 'text-purple-900', accent: 'text-purple-600' },
  { id: 'Peace', label: 'Inner Peace', gradient: 'from-sky-300 to-blue-500', bg: 'bg-sky-50', text: 'text-sky-900', accent: 'text-sky-600' },
  { id: 'Gratitude', label: 'Gratitude', gradient: 'from-orange-300 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-900', accent: 'text-orange-600' },
];

export const Affirmations: React.FC<AffirmationsProps> = ({ favorites, toggleFavorite }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [feed, setFeed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [manifestMode, setManifestMode] = useState<string | null>(null);
  const [view, setView] = useState<'feed' | 'favorites'>('feed');

  useEffect(() => {
    loadCategory(CATEGORIES[0]);
  }, []);

  const loadCategory = async (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category);
    setLoading(true);
    setFeed([]); // Clear current feed for visual refresh
    const newAffirmations = await getAffirmationsBatch(category.id);
    setFeed(newAffirmations);
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isFavorite = (text: string) => favorites.some(f => f.text === text);

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Sparkles className="text-yellow-500" /> Affirmations
           </h2>
           <p className="text-slate-500">Manifest your reality, one thought at a time.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
                onClick={() => setView('feed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'feed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
             >
                Daily Feed
             </button>
             <button 
                onClick={() => setView('favorites')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'favorites' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
             >
                Favorites
             </button>
        </div>
      </div>

      {view === 'feed' ? (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
             
             {/* Sidebar Categories */}
             <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => loadCategory(cat)}
                        className={`flex-shrink-0 p-3 lg:p-4 rounded-xl text-left transition-all border group relative overflow-hidden ${
                            selectedCategory.id === cat.id 
                            ? 'bg-slate-900 text-white shadow-lg scale-[1.02]' 
                            : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${cat.gradient} opacity-20 rounded-bl-full transition-opacity group-hover:opacity-30`} />
                        <span className="font-medium text-sm lg:text-base relative z-10">{cat.label}</span>
                    </button>
                ))}
             </div>

             {/* Feed Area */}
             <div className="flex-1 overflow-y-auto pr-2 pb-20">
                <div className="mb-6 flex justify-between items-center">
                    <h3 className={`text-xl font-serif font-bold ${selectedCategory.accent}`}>
                        {selectedCategory.label} Feed
                    </h3>
                    <button 
                        onClick={() => loadCategory(selectedCategory)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                        title="Refresh Feed"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {loading && feed.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feed.map((text, idx) => (
                            <div 
                                key={idx} 
                                className={`relative group p-6 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 ${
                                    idx % 3 === 0 ? 'md:col-span-2 aspect-[2/1] bg-gradient-to-br text-white' : 'aspect-square bg-white border-slate-100 text-slate-700'
                                } ${idx % 3 === 0 ? selectedCategory.gradient : ''}`}
                            >
                                <div className="h-full flex flex-col justify-between">
                                    <div className="flex-1 flex items-center justify-center text-center p-4">
                                        <p className={`font-serif leading-tight ${idx % 3 === 0 ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}>
                                            "{text}"
                                        </p>
                                    </div>
                                    
                                    <div className={`flex justify-between items-center pt-4 border-t ${idx % 3 === 0 ? 'border-white/20' : 'border-slate-100'}`}>
                                        <button 
                                            onClick={() => setManifestMode(text)}
                                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70 hover:opacity-100"
                                        >
                                            <Maximize2 size={14} /> Manifest
                                        </button>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleCopy(text)}
                                                className={`p-2 rounded-full ${idx % 3 === 0 ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button 
                                                onClick={() => toggleFavorite({
                                                    id: Date.now().toString(),
                                                    text,
                                                    category: selectedCategory.id,
                                                    isFavorite: true,
                                                    timestamp: Date.now()
                                                })}
                                                className={`p-2 rounded-full transition-colors ${
                                                    isFavorite(text) 
                                                        ? 'text-red-500 bg-red-100' 
                                                        : idx % 3 === 0 ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                                                }`}
                                            >
                                                <Heart size={16} className={isFavorite(text) ? 'fill-current' : ''} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
      ) : (
        // Favorites View
        <div className="flex-1 overflow-y-auto pb-20">
             {favorites.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400">
                     <Heart size={48} className="mb-4 text-slate-200" />
                     <p>Your collection is empty.</p>
                     <button onClick={() => setView('feed')} className="text-blue-500 font-medium mt-2">Go to Feed</button>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {favorites.map(aff => {
                         const catTheme = CATEGORIES.find(c => c.id === aff.category) || CATEGORIES[0];
                         return (
                             <div key={aff.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all">
                                 <div className="mb-4 flex justify-between items-start">
                                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${catTheme.bg} ${catTheme.text}`}>
                                        {catTheme.label}
                                     </span>
                                     <button 
                                        onClick={() => toggleFavorite(aff)}
                                        className="text-red-500 p-1 hover:bg-red-50 rounded-full"
                                     >
                                        <Heart size={16} className="fill-current" />
                                     </button>
                                 </div>
                                 <p className="text-xl font-serif text-slate-800 mb-6 leading-relaxed">"{aff.text}"</p>
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => setManifestMode(aff.text)} className="p-2 text-slate-400 hover:text-blue-600">
                                        <Maximize2 size={16} />
                                     </button>
                                     <button onClick={() => handleCopy(aff.text)} className="p-2 text-slate-400 hover:text-blue-600">
                                        <Copy size={16} />
                                     </button>
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             )}
        </div>
      )}

      {/* Manifest Mode Modal */}
      {manifestMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-300">
              <button 
                onClick={() => setManifestMode(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white p-2"
              >
                  <X size={32} />
              </button>
              
              <div className="max-w-4xl w-full text-center relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
                  
                  <h2 className="relative text-4xl md:text-6xl font-serif text-white leading-tight font-medium mb-12 drop-shadow-2xl">
                      "{manifestMode}"
                  </h2>
                  
                  <div className="relative flex justify-center gap-8 text-white/60">
                      <div className="flex flex-col items-center gap-2">
                          <span className="text-sm uppercase tracking-widest">Breathe In</span>
                          <div className="w-1 h-8 bg-gradient-to-b from-white to-transparent rounded-full" />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                          <span className="text-sm uppercase tracking-widest">Believe</span>
                          <div className="w-1 h-8 bg-gradient-to-b from-white to-transparent rounded-full" />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                          <span className="text-sm uppercase tracking-widest">Receive</span>
                          <div className="w-1 h-8 bg-gradient-to-b from-white to-transparent rounded-full" />
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};