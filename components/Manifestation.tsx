
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Moon, Sun, Flame, Eye, PenTool, Box, DollarSign, Activity, Zap, Trash2, CheckCircle2, PlayCircle, Loader2, Plus, LayoutGrid, Calendar, Move, Type, Image as ImageIcon, X } from 'lucide-react';
import { ManifestationData, Method369, VisionBoardItem } from '../types';
import { transformLimitingBelief } from '../services/geminiService';

interface ManifestationProps {
  data: ManifestationData;
  updateData: (data: ManifestationData) => void;
}

export const Manifestation: React.FC<ManifestationProps> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | '369' | 'vision' | 'tools'>('dashboard');
  const [showBurner, setShowBurner] = useState(false);
  const [limitingBelief, setLimitingBelief] = useState('');
  const [transformedBelief, setTransformedBelief] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  
  // Vision Board State
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemType, setNewItemType] = useState<'text' | 'image'>('text');
  const [newItemContent, setNewItemContent] = useState('');

  // 17 Second Timer Logic
  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerProgress((prev) => {
          if (prev >= 100) {
            setTimerActive(false);
            return 100;
          }
          return prev + (100 / 170); // 17 seconds * 10 (100ms interval)
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent, id: string, initialX: number, initialY: number) => {
    e.stopPropagation();
    setIsDragging(id);
    if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        // Calculate offset from item's top-left
        const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;
        setDragOffset({ x: mouseXPercent - initialX, y: mouseYPercent - initialY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Clamp to board
        const newX = Math.max(0, Math.min(90, x - dragOffset.x));
        const newY = Math.max(0, Math.min(90, y - dragOffset.y));

        updateData({
            ...data,
            visionBoard: data.visionBoard.map(item => 
                item.id === isDragging ? { ...item, x: newX, y: newY } : item
            )
        });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleAddBoardItem = () => {
      if(!newItemContent.trim()) return;
      const newItem: VisionBoardItem = {
          id: Date.now().toString(),
          type: newItemType,
          content: newItemContent,
          x: 40,
          y: 40,
          zIndex: data.visionBoard.length + 1
      };
      updateData({ ...data, visionBoard: [...data.visionBoard, newItem] });
      setNewItemContent('');
      setShowAddItem(false);
  };

  const removeItem = (id: string) => {
      updateData({ ...data, visionBoard: data.visionBoard.filter(i => i.id !== id) });
  };

  const handleBurnBelief = async () => {
    if (!limitingBelief) return;
    setIsBurning(true);
    // Simulate burning animation time then get AI result
    const newBelief = await transformLimitingBelief(limitingBelief);
    setTimeout(() => {
      setTransformedBelief(newBelief);
      setIsBurning(false);
      setLimitingBelief('');
    }, 2000);
  };

  const start369 = (desire: string) => {
    const newMethod: Method369 = {
      id: Date.now().toString(),
      desire,
      startDate: new Date().toISOString(),
      progress: {},
      completed: false
    };
    updateData({ ...data, active369: newMethod });
  };

  const update369 = (period: 'morning' | 'afternoon' | 'night') => {
    if (!data.active369) return;
    const today = new Date().toISOString().split('T')[0];
    const currentProgress = data.active369.progress[today] || { morning: false, afternoon: false, night: false };
    
    const newProgress = {
      ...data.active369.progress,
      [today]: { ...currentProgress, [period]: true }
    };

    updateData({ 
      ...data, 
      active369: { ...data.active369, progress: newProgress } 
    });
  };

  const addToUniverseBox = (text: string) => {
    updateData({ ...data, universeBox: [text, ...data.universeBox] });
  };

  const updateCheque = (field: keyof ManifestationData['cheque'], value: string) => {
      updateData({
          ...data,
          cheque: { ...data.cheque, [field]: value }
      });
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {/* Intention Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-3xl shadow-xl col-span-1 md:col-span-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={100} /></div>
        <h3 className="text-indigo-200 font-serif mb-2">Daily Intention</h3>
        {data.intention ? (
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">"{data.intention}"</h2>
            <button onClick={() => updateData({ ...data, intention: '' })} className="text-xs text-indigo-300 hover:text-white">Change</button>
          </div>
        ) : (
          <div className="relative z-10 flex gap-2 mt-4">
            <input 
              type="text" 
              placeholder="I am attracting..." 
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 flex-1 text-white placeholder:text-indigo-300 outline-none focus:bg-white/20 transition-all"
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') updateData({ ...data, intention: e.target.value });
              }}
            />
          </div>
        )}
      </div>

      {/* Vibration Meter */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center relative">
        <h3 className="text-slate-500 font-medium mb-4 flex items-center gap-2"><Activity size={16} /> Vibration Check</h3>
        <div className="relative w-32 h-32 flex items-center justify-center">
           <svg className="w-full h-full" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeDasharray={`${data.vibrationLevel}, 100`} className="transition-all duration-1000 ease-out" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
           </svg>
           <div className="absolute text-2xl font-bold text-slate-700">{data.vibrationLevel}%</div>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={data.vibrationLevel} 
          onChange={(e) => updateData({ ...data, vibrationLevel: parseInt(e.target.value) })}
          className="w-full mt-4 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>
      
      {/* 17 Second Timer */}
      <div className="bg-gradient-to-tr from-amber-100 to-orange-100 p-6 rounded-3xl border border-amber-200 col-span-1 md:col-span-1">
         <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-amber-900 flex items-center gap-2"><Zap className="fill-amber-500 text-amber-600" size={18} /> 17-Second Spark</h3>
              <p className="text-xs text-amber-700/70 mt-1">Hold a thought pure for 17s to ignite it.</p>
            </div>
         </div>
         {timerActive ? (
            <div className="relative h-12 bg-white/50 rounded-full overflow-hidden flex items-center justify-center">
               <div className="absolute left-0 top-0 h-full bg-amber-400/50 transition-all duration-100 ease-linear" style={{ width: `${timerProgress}%` }} />
               <span className="relative font-bold text-amber-800 z-10">{Math.ceil(17 - (timerProgress / 100 * 17))}s</span>
            </div>
         ) : (
            <button 
              onClick={() => { setTimerActive(true); setTimerProgress(0); }}
              className="w-full py-3 bg-white text-amber-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle size={20} /> Start Focus
            </button>
         )}
      </div>

      {/* Universe Box Preview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Box size={18} className="text-purple-500" /> Universe Box</h3>
         <p className="text-xs text-slate-500 mb-4">Surrender your worries or wishes here.</p>
         <div className="relative">
           <input 
              type="text" 
              placeholder="I release..."
              className="w-full pr-10 pl-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-300"
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  addToUniverseBox(e.target.value);
                  e.target.value = '';
                }
              }}
           />
           <span className="absolute right-3 top-2.5 text-slate-400 text-xs">{data.universeBox.length} in box</span>
         </div>
      </div>
    </div>
  );

  const render369 = () => {
    const today = new Date().toISOString().split('T')[0];
    const progress = data.active369?.progress[today] || { morning: false, afternoon: false, night: false };

    return (
      <div className="h-full flex flex-col items-center max-w-2xl mx-auto w-full">
        {!data.active369 ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
               <PenTool size={32} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">The 3-6-9 Method</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Write your desire 3 times in the morning, 6 times in the afternoon, and 9 times at night. Tesla believed these numbers held the key to the universe.
            </p>
            <input 
               type="text"
               id="new369"
               placeholder="What do you desire? (Present tense)"
               className="w-full p-4 text-center text-lg border-b-2 border-indigo-200 focus:border-indigo-600 outline-none bg-transparent mb-8 placeholder:text-slate-300"
            />
            <button 
              onClick={() => {
                const input = document.getElementById('new369') as HTMLInputElement;
                if(input.value) start369(input.value);
              }}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Start Manifestation Cycle
            </button>
          </div>
        ) : (
          <div className="w-full animate-in slide-in-from-bottom-4">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Current Cycle</h3>
                <button onClick={() => updateData({ ...data, active369: undefined })} className="text-xs text-red-400 hover:text-red-600">End Cycle</button>
             </div>
             
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-indigo-900 mb-2">"{data.active369.desire}"</h2>
                <p className="text-slate-400 text-sm">Started on {new Date(data.active369.startDate).toLocaleDateString()}</p>
             </div>

             <div className="grid gap-4">
                <button 
                  onClick={() => update369('morning')}
                  disabled={progress.morning}
                  className={`p-6 rounded-2xl border transition-all flex justify-between items-center ${
                    progress.morning 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-left">
                    <span className="block text-xs font-bold uppercase tracking-wider opacity-60">Morning (3x)</span>
                    <span className="font-serif text-lg">Set the intention</span>
                  </div>
                  {progress.morning ? <CheckCircle2 className="text-green-600" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                </button>

                <button 
                  onClick={() => update369('afternoon')}
                  disabled={!progress.morning || progress.afternoon}
                  className={`p-6 rounded-2xl border transition-all flex justify-between items-center ${
                    progress.afternoon
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : !progress.morning ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-left">
                    <span className="block text-xs font-bold uppercase tracking-wider opacity-60">Afternoon (6x)</span>
                    <span className="font-serif text-lg">Amplify the energy</span>
                  </div>
                  {progress.afternoon ? <CheckCircle2 className="text-green-600" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                </button>

                <button 
                  onClick={() => update369('night')}
                  disabled={!progress.afternoon || progress.night}
                  className={`p-6 rounded-2xl border transition-all flex justify-between items-center ${
                    progress.night
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : !progress.afternoon ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-left">
                    <span className="block text-xs font-bold uppercase tracking-wider opacity-60">Night (9x)</span>
                    <span className="font-serif text-lg">Release to the universe</span>
                  </div>
                  {progress.night ? <CheckCircle2 className="text-green-600" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                </button>
             </div>
          </div>
        )}
      </div>
    );
  };

  const renderVisionBoard = () => (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <p className="text-slate-500">Visualize your dream life. Drag items to arrange.</p>
          <button 
             onClick={() => setShowAddItem(true)}
             className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Add Item
          </button>
       </div>

       {/* Canvas */}
       <div 
         ref={boardRef}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
         className="flex-1 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 relative overflow-hidden group select-none"
       >
          {data.visionBoard.map(item => (
              <div 
                  key={item.id} 
                  className="absolute cursor-move shadow-lg hover:shadow-2xl transition-shadow group-active:cursor-grabbing rounded-xl"
                  style={{ 
                      left: `${item.x}%`, 
                      top: `${item.y}%`, 
                      zIndex: isDragging === item.id ? 999 : item.zIndex 
                  }}
                  onMouseDown={(e) => handleMouseDown(e, item.id, item.x, item.y)}
              >
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity z-50 scale-75"
                  >
                      <X size={12} />
                  </button>

                  {item.type === 'image' ? (
                      <img src={item.content} alt="Vision" className="w-48 h-auto max-h-64 object-cover rounded-xl pointer-events-none" />
                  ) : (
                      <div className="bg-yellow-100 text-yellow-900 p-4 font-serif font-bold text-center rounded-xl min-w-[150px] max-w-[250px] shadow-sm border border-yellow-200/50">
                          {item.content}
                      </div>
                  )}
              </div>
          ))}
          
          {data.visionBoard.length === 0 && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-slate-400 pointer-events-none">
                 <LayoutGrid size={48} className="mx-auto mb-2 opacity-30" />
                 <p>Your vision board is empty.</p>
                 <p className="text-sm">Click "Add Item" to start manifesting.</p>
             </div>
          )}
       </div>

       {/* Add Item Modal */}
       {showAddItem && (
           <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
               <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
                   <h3 className="text-lg font-bold mb-4">Add to Vision Board</h3>
                   <div className="flex gap-4 mb-4">
                       <button 
                         onClick={() => setNewItemType('text')}
                         className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-2 border transition-colors ${newItemType === 'text' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                       >
                           <Type size={20} /> <span className="text-xs font-bold">Text / Affirmation</span>
                       </button>
                       <button 
                         onClick={() => setNewItemType('image')}
                         className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-2 border transition-colors ${newItemType === 'image' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                       >
                           <ImageIcon size={20} /> <span className="text-xs font-bold">Image URL</span>
                       </button>
                   </div>
                   
                   <input 
                      type="text" 
                      placeholder={newItemType === 'text' ? "e.g. I am wealthy" : "https://example.com/image.jpg"}
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-100"
                      autoFocus
                   />

                   <div className="flex justify-end gap-3">
                       <button onClick={() => setShowAddItem(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                       <button onClick={handleAddBoardItem} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add to Board</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );

  const renderTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      
      {/* Limiting Belief Burner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
         <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold">
            <Flame size={20} /> Belief Burner
         </div>
         {transformedBelief ? (
           <div className="animate-in zoom-in duration-500 text-center py-8">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Sparkles />
             </div>
             <p className="text-lg font-serif font-medium text-slate-800 mb-2">New Empowered Belief</p>
             <p className="text-xl text-indigo-600 font-bold">"{transformedBelief}"</p>
             <button 
               onClick={() => setTransformedBelief('')}
               className="mt-6 text-sm text-slate-400 hover:text-slate-600 underline"
             >
               Burn another
             </button>
           </div>
         ) : isBurning ? (
            <div className="flex flex-col items-center justify-center py-12">
               <Flame size={64} className="text-orange-500 animate-bounce" />
               <p className="mt-4 text-orange-600 font-bold animate-pulse">Transmuting energy...</p>
            </div>
         ) : (
           <div>
             <p className="text-sm text-slate-500 mb-4">Write a limiting belief and watch it burn away, replaced by truth.</p>
             <textarea 
               value={limitingBelief}
               onChange={(e) => setLimitingBelief(e.target.value)}
               placeholder="I am not good enough..."
               className="w-full p-4 bg-slate-50 rounded-xl mb-4 h-32 resize-none outline-none focus:ring-2 focus:ring-orange-100"
             />
             <button 
               onClick={handleBurnBelief}
               disabled={!limitingBelief}
               className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <Flame size={18} /> Burn & Release
             </button>
           </div>
         )}
      </div>

      {/* Abundance Cheque */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 relative group">
         <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold">
            <DollarSign size={20} /> Abundance Cheque
         </div>
         <div className="bg-white border-2 border-emerald-800/20 p-6 rounded-lg font-serif relative shadow-md transform transition-transform group-hover:scale-[1.02]">
            <div className="absolute top-2 right-4 text-emerald-900/10 text-4xl font-bold pointer-events-none">UNIVERSE BANK</div>
            <div className="flex justify-between items-end border-b border-emerald-900/10 pb-2 mb-4">
               <span className="text-xs text-slate-400">PAY TO</span>
               <input 
                  type="text" 
                  value={data.cheque.payee}
                  onChange={(e) => updateCheque('payee', e.target.value)}
                  className="text-lg font-bold text-slate-800 text-right outline-none bg-transparent w-full"
               />
            </div>
            <div className="flex gap-4 mb-4">
               <div className="flex-1 border-b border-emerald-900/10 flex items-end pb-2">
                 <input 
                    type="text" 
                    placeholder="Amount" 
                    value={data.cheque.amount}
                    onChange={(e) => updateCheque('amount', e.target.value)}
                    className="w-full text-right font-bold text-2xl outline-none placeholder:text-emerald-100 text-emerald-700 bg-transparent" 
                 />
               </div>
               <span className="text-2xl font-bold text-emerald-800">$</span>
            </div>
            <div className="border-b border-emerald-900/10 pb-1 mb-2">
                 <input 
                    type="text" 
                    placeholder="Memo (e.g. For Services Rendered)" 
                    value={data.cheque.memo}
                    onChange={(e) => updateCheque('memo', e.target.value)}
                    className="w-full text-xs text-slate-500 outline-none bg-transparent placeholder:text-slate-300" 
                 />
            </div>
            <div className="text-xs text-emerald-600/50 mt-4 text-center">SIGNED: THE UNIVERSE</div>
         </div>
         <p className="text-center text-xs text-emerald-600 mt-4">This cheque is energetic currency.</p>
      </div>
      
      {/* Scripting */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <div className="flex items-center gap-2 mb-4 text-purple-600 font-bold">
            <PenTool size={20} /> Future Scripting
         </div>
         <p className="text-sm text-slate-500 mb-4">Journal as if it has already happened.</p>
         <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4 text-slate-400 italic text-sm">
            "I am so happy and grateful now that..."
         </div>
      </div>
      
      {/* Universe Box List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
         <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold">
            <Box size={20} /> Universe Box Contents
         </div>
         <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {data.universeBox.length === 0 ? (
               <p className="text-sm text-slate-400 text-center py-4">Box is empty.</p>
            ) : (
               data.universeBox.map((item, idx) => (
                  <div key={idx} className="p-3 bg-indigo-50 text-indigo-900 text-sm rounded-lg flex justify-between items-center animate-in slide-in-from-right-2">
                     <span className="truncate">{item}</span>
                     <CheckCircle2 size={14} className="text-indigo-400" />
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Sun className="text-purple-500" /> Manifestation
            </h2>
            <p className="text-slate-500">Co-create your reality with the universe.</p>
         </div>
         <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            {[
               { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
               { id: '369', label: '3-6-9 Method', icon: PenTool },
               { id: 'vision', label: 'Vision Board', icon: Eye },
               { id: 'tools', label: 'Tools', icon: Box },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                     activeTab === tab.id 
                     ? 'bg-blue-600 text-white shadow-md' 
                     : 'text-slate-500 hover:bg-slate-50'
                  }`}
               >
                  <tab.icon size={16} />
                  {tab.label}
               </button>
            ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === '369' && render369()}
         {activeTab === 'vision' && renderVisionBoard()}
         {activeTab === 'tools' && renderTools()}
      </div>
    </div>
  );
};
