import React, { useState } from 'react';
import { Lock, Unlock, Wand2, Save, Mic } from 'lucide-react';
import { JournalEntry } from '../types';
import { generateJournalAnalysis } from '../services/geminiService';

interface JournalProps {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  pin: string | null;
}

export const Journal: React.FC<JournalProps> = ({ entries, addEntry, pin }) => {
  const [isLocked, setIsLocked] = useState(!!pin);
  const [pinInput, setPinInput] = useState('');
  const [newEntry, setNewEntry] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleUnlock = () => {
    if (pinInput === pin) setIsLocked(false);
    else alert('Incorrect PIN');
  };

  const handleSave = async () => {
    if (!newEntry.trim()) return;
    
    let analysis = null;
    if (analysisResult) {
      analysis = JSON.stringify(analysisResult);
    } else if (newEntry.length > 20) {
      // Auto analyze if not done manually
      setAnalyzing(true);
      const res = await generateJournalAnalysis(newEntry);
      if (res) analysis = JSON.stringify(res);
      setAnalyzing(false);
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: newEntry,
      aiAnalysis: analysis || undefined
    };
    
    addEntry(entry);
    setNewEntry('');
    setAnalysisResult(null);
  };

  const manualAnalyze = async () => {
    if (newEntry.length < 10) return;
    setAnalyzing(true);
    const res = await generateJournalAnalysis(newEntry);
    setAnalysisResult(res);
    setAnalyzing(false);
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-100 rounded-3xl">
        <Lock className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Private Vault Locked</h3>
        <input 
          type="password" 
          maxLength={4}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="Enter PIN"
          className="p-3 text-center text-2xl tracking-widest w-40 rounded-xl border border-slate-300 mb-4"
        />
        <button 
          onClick={handleUnlock}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      {/* Editor */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">New Entry</h3>
          <div className="flex gap-2">
            <button 
              onClick={manualAnalyze}
              disabled={analyzing || newEntry.length < 10}
              className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 disabled:opacity-50"
            >
              <Wand2 size={14} />
              {analyzing ? 'Analyzing...' : 'AI Analyze'}
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full">
              <Mic size={18} />
            </button>
          </div>
        </div>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="How are you feeling today?"
          className="p-4 h-40 resize-none outline-none text-slate-700"
        />
        
        {analysisResult && (
          <div className="mx-4 mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-900">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <Wand2 size={14} /> AI Insight:
            </div>
            <p><strong>Emotion:</strong> {analysisResult.emotion}</p>
            <p className="mt-1">{analysisResult.insight}</p>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={!newEntry.trim() || analyzing}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Save size={18} />
            Save Entry
          </button>
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-20">
        <h3 className="text-lg font-bold text-slate-700 px-2">Past Entries</h3>
        {entries.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No journal entries yet.</div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-slate-400">
                  {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                {entry.aiAnalysis && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">AI Analyzed</span>
                )}
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
              {entry.aiAnalysis && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500">
                  {(() => {
                    try {
                      const data = JSON.parse(entry.aiAnalysis);
                      return <p className="italic">"{data.insight}"</p>;
                    } catch { return null; }
                  })()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};