
import React, { useState } from 'react';
import { Wand2, Save, Mic, Calendar, ChevronRight, PenLine, Search, Plus, Trash2, Edit2, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { JournalEntry } from '../types';
import { generateJournalAnalysis } from '../services/geminiService';

interface JournalProps {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
}

export const Journal: React.FC<JournalProps> = ({ entries, addEntry, updateEntry, deleteEntry }) => {
  // Navigation & Selection State
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Editor State
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Computed
  const selectedEntry = entries.find(e => e.id === selectedEntryId);
  const filteredEntries = entries.filter(e => 
    (e.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     e.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handlers
  const resetEditor = () => {
    setEntryTitle('');
    setEntryContent('');
    setAnalysisResult(null);
    setIsEditing(false);
    setSelectedEntryId(null);
  };

  const handleStartEdit = (entry: JournalEntry) => {
    setEntryTitle(entry.title || '');
    setEntryContent(entry.content);
    setAnalysisResult(entry.aiAnalysis ? JSON.parse(entry.aiAnalysis) : null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!entryContent.trim()) return;
    
    let analysis = null;
    // Keep existing analysis if editing and not changed much, otherwise re-analyze if user requests (simple logic for now: keep existing if present)
    if (analysisResult) {
      analysis = JSON.stringify(analysisResult);
    } else if (entryContent.length > 20) {
      setAnalyzing(true);
      const res = await generateJournalAnalysis(entryContent);
      if (res) analysis = JSON.stringify(res);
      setAnalyzing(false);
    }

    if (isEditing && selectedEntryId) {
       // Update existing
       const updated: JournalEntry = {
           ...selectedEntry!,
           title: entryTitle || 'Untitled Entry',
           content: entryContent,
           aiAnalysis: analysis || selectedEntry?.aiAnalysis
       };
       updateEntry(updated);
       setIsEditing(false); // Return to read mode
    } else {
       // Create new
       const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: entryTitle || 'Untitled Entry',
        content: entryContent,
        aiAnalysis: analysis || undefined
      };
      addEntry(newEntry);
      // Auto-select the new entry
      setSelectedEntryId(newEntry.id);
    }
    setAnalysisResult(null); // Clear local analysis state so it reloads from entry next time
  };

  const manualAnalyze = async () => {
    if (entryContent.length < 10) return;
    setAnalyzing(true);
    const res = await generateJournalAnalysis(entryContent);
    setAnalysisResult(res);
    setAnalyzing(false);
  };

  const handleDelete = () => {
      if (selectedEntryId) {
          if (confirm('Are you sure you want to delete this entry?')) {
              deleteEntry(selectedEntryId);
              resetEditor();
          }
      }
  };

  // --- RENDERERS ---

  const renderSidebar = () => (
      <div className={`w-full lg:w-80 flex flex-col gap-4 border-r border-slate-100 bg-white lg:bg-transparent ${selectedEntryId ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex gap-2 mb-2">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                   type="text" 
                   placeholder="Search journal..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
             </div>
             <button 
                onClick={resetEditor}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                title="New Entry"
             >
                <Plus size={20} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {filteredEntries.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                      <p className="text-sm">No entries found.</p>
                  </div>
              ) : (
                  filteredEntries.map(entry => (
                      <div 
                        key={entry.id} 
                        onClick={() => setSelectedEntryId(entry.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all border group ${
                            selectedEntryId === entry.id 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedEntryId === entry.id ? 'text-blue-500' : 'text-slate-400'}`}>
                                  {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                              {entry.aiAnalysis && <Wand2 size={12} className="text-purple-400" />}
                          </div>
                          <h4 className={`font-medium mb-1 line-clamp-1 ${selectedEntryId === entry.id ? 'text-blue-800' : 'text-slate-700'}`}>
                              {entry.title || "Untitled"}
                          </h4>
                          <p className={`text-xs line-clamp-2 ${selectedEntryId === entry.id ? 'text-blue-600/70' : 'text-slate-500'}`}>
                              {entry.content}
                          </p>
                      </div>
                  ))
              )}
          </div>
      </div>
  );

  const renderEditor = () => (
      <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                 <button onClick={() => setSelectedEntryId(null)} className="lg:hidden text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                 </button>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    {isEditing ? 'Editing Entry' : 'New Entry'}
                 </span>
                 {selectedEntryId && isEditing && (
                    <button onClick={() => setIsEditing(false)} className="text-xs text-red-500 hover:underline">
                        Cancel Edit
                    </button>
                 )}
              </div>

              <input 
                  type="text"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder="Title your day..."
                  className="text-2xl font-bold placeholder:text-slate-300 border-none outline-none mb-4 w-full text-slate-800"
              />
              
              <textarea
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  placeholder="How are you feeling today? What's on your mind?"
                  className="flex-1 resize-none outline-none text-slate-700 leading-relaxed text-lg placeholder:text-slate-300"
              />
              
              {/* AI Result Preview in Editor */}
              {analysisResult && (
                  <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm text-indigo-900 animate-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-2 font-semibold mb-2 text-indigo-700">
                          <Wand2 size={16} /> AI Insight
                      </div>
                      <p className="italic mb-2">"{analysisResult.insight}"</p>
                      <div className="flex gap-4 text-xs">
                          <span className="bg-white/50 px-2 py-1 rounded">Mood: {analysisResult.emotion}</span>
                          <span className="bg-white/50 px-2 py-1 rounded">Tip: {analysisResult.suggestedAction}</span>
                      </div>
                  </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex gap-2">
                      <button 
                          onClick={manualAnalyze}
                          disabled={analyzing || entryContent.length < 10}
                          className="flex items-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 disabled:opacity-50 transition-colors"
                      >
                          <Wand2 size={16} />
                          {analyzing ? 'Analyzing...' : 'AI Analyze'}
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="Voice to Text (Coming Soon)">
                          <Mic size={20} />
                      </button>
                  </div>
                  <button 
                      onClick={handleSave}
                      disabled={!entryContent.trim() || analyzing}
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 font-medium"
                  >
                      <Save size={18} />
                      {isEditing ? 'Update' : 'Save'}
                  </button>
              </div>
          </div>
      </div>
  );

  const renderReader = () => {
     if (!selectedEntry) return null;
     const analysis = selectedEntry.aiAnalysis ? JSON.parse(selectedEntry.aiAnalysis) : null;

     return (
         <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
             {/* Toolbar */}
             <div className="absolute top-4 right-4 flex gap-2">
                 <button 
                    onClick={() => handleStartEdit(selectedEntry)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                 >
                     <Edit2 size={18} />
                 </button>
                 <button 
                    onClick={handleDelete}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                 >
                     <Trash2 size={18} />
                 </button>
             </div>

             <div className="p-8 h-full overflow-y-auto">
                 <button onClick={() => setSelectedEntryId(null)} className="lg:hidden text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium mb-6">
                    <ArrowLeft size={16} /> Back
                 </button>

                 <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-2">
                     <Calendar size={14} />
                     {new Date(selectedEntry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     <span className="mx-1">•</span>
                     <Clock size={14} />
                     {new Date(selectedEntry.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                 </div>

                 <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-8 leading-tight">
                     {selectedEntry.title}
                 </h1>

                 <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-600 whitespace-pre-wrap mb-10 font-serif">
                     {selectedEntry.content}
                 </div>

                 {analysis && (
                     <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                         <div className="flex items-center gap-2 text-indigo-700 font-bold mb-4">
                             <Sparkles size={18} /> AI Wellness Insight
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                 <p className="text-xs uppercase tracking-wide text-indigo-400 font-bold mb-1">Emotional Resonance</p>
                                 <p className="text-indigo-900 font-medium text-lg">{analysis.emotion}</p>
                             </div>
                             <div>
                                 <p className="text-xs uppercase tracking-wide text-indigo-400 font-bold mb-1">Wellness Tip</p>
                                 <p className="text-indigo-900 font-medium">{analysis.suggestedAction}</p>
                             </div>
                         </div>
                         <div className="mt-4 pt-4 border-t border-indigo-200/50">
                             <p className="text-indigo-800 italic">"{analysis.insight}"</p>
                         </div>
                     </div>
                 )}
             </div>
         </div>
     );
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Header - Only visible on desktop if needed, currently sidebar handles title */}
      
      <div className="flex flex-1 gap-6 overflow-hidden relative">
         {/* Sidebar - Always visible on desktop, hidden on mobile if entry selected */}
         {renderSidebar()}
         
         {/* Main Content Area */}
         <div className={`flex-1 ${!selectedEntryId ? 'hidden lg:block' : 'block'}`}>
             {!selectedEntryId || isEditing ? renderEditor() : renderReader()}
         </div>
      </div>
    </div>
  );
};
