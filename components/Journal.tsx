import React, { useState } from 'react';
import { Wand2, Save, Mic, Calendar, ChevronRight, PenLine } from 'lucide-react';
import { JournalEntry } from '../types';
import { generateJournalAnalysis } from '../services/geminiService';

interface JournalProps {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
}

export const Journal: React.FC<JournalProps> = ({ entries, addEntry }) => {
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntry, setNewEntry] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleSave = async () => {
    if (!newEntry.trim()) return;
    
    let analysis = null;
    if (analysisResult) {
      analysis = JSON.stringify(analysisResult);
    } else if (newEntry.length > 20) {
      setAnalyzing(true);
      const res = await generateJournalAnalysis(newEntry);
      if (res) analysis = JSON.stringify(res);
      setAnalyzing(false);
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: newEntryTitle || 'Untitled Entry',
      content: newEntry,
      aiAnalysis: analysis || undefined
    };
    
    addEntry(entry);
    setNewEntry('');
    setNewEntryTitle('');
    setAnalysisResult(null);
  };

  const manualAnalyze = async () => {
    if (newEntry.length < 10) return;
    setAnalyzing(true);
    const res = await generateJournalAnalysis(newEntry);
    setAnalysisResult(res);
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Journal</h2>
          <p className="text-slate-500">Express yourself freely.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 flex flex-col h-full">
            <input 
              type="text"
              value={newEntryTitle}
              onChange={(e) => setNewEntryTitle(e.target.value)}
              placeholder="Title your day..."
              className="text-xl font-semibold placeholder:text-slate-300 border-none outline-none mb-4 w-full"
            />
            
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="How are you feeling today? What's on your mind?"
              className="flex-1 resize-none outline-none text-slate-700 leading-relaxed text-lg placeholder:text-slate-300"
            />
            
            {analysisResult && (
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm text-indigo-900 animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 font-semibold mb-2 text-indigo-700">
                  <Wand2 size={16} /> AI Insight
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wide text-indigo-400 font-bold">Emotion</span>
                    <p className="font-medium">{analysisResult.emotion}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-indigo-400 font-bold">Suggestion</span>
                    <p className="font-medium">{analysisResult.suggestedAction || "Take a moment to breathe."}</p>
                  </div>
                </div>
                <p className="mt-3 text-indigo-800/80 italic border-t border-indigo-200/50 pt-2">"{analysisResult.insight}"</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
               <div className="flex gap-2">
                 <button 
                  onClick={manualAnalyze}
                  disabled={analyzing || newEntry.length < 10}
                  className="flex items-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 disabled:opacity-50 transition-colors"
                >
                  <Wand2 size={16} />
                  {analyzing ? 'Analyzing...' : 'AI Analyze'}
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <Mic size={20} />
                </button>
               </div>
              <button 
                onClick={handleSave}
                disabled={!newEntry.trim() || analyzing}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
              >
                <Save size={18} />
                Save Entry
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar History */}
        <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto pr-2 pb-20">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
             <Calendar size={18} />
             Past Entries
          </h3>
          
          {entries.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 border-dashed">
              <PenLine className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm">No stories yet.</p>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  {entry.aiAnalysis && (
                    <Wand2 size={12} className="text-purple-400" />
                  )}
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {entry.title || "Untitled"}
                </h4>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                  {entry.content}
                </p>
                {entry.aiAnalysis && (
                   <div className="mt-2 flex gap-2">
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                        Analyzed
                      </span>
                   </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};