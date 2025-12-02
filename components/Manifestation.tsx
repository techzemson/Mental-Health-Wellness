
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Moon, Sun, Flame, Eye, PenTool, Box, DollarSign, Activity, Zap, Trash2, CheckCircle2, PlayCircle, Loader2, Plus, LayoutGrid, Calendar, Move, Type, Image as ImageIcon, X, Upload, RotateCw, ZoomIn, ZoomOut, Info, ArrowRight } from 'lucide-react';
import { ManifestationData, Method369, VisionBoardItem } from '../types';
import { transformLimitingBelief, generate369Affirmation } from '../services/geminiService';

interface ManifestationProps {
  data: ManifestationData;
  updateData: (data: ManifestationData) => void;
}

export const Manifestation: React.FC<ManifestationProps> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | '369' | 'vision' | 'tools'>('dashboard');
  
  // Dashboard & Tools State
  const [limitingBelief, setLimitingBelief] = useState('');
  const [transformedBelief, setTransformedBelief] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  // 3-6-9 State
  const [show369Guide, setShow369Guide] = useState(false);
  const [new369Desire, setNew369Desire] = useState('');
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Vision Board State
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemType, setNewItemType] = useState<'text' | 'image'>('text');
  const [newItemContent, setNewItemContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 17 Second Timer Logic
  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerProgress((prev) => {
          if (prev >= 100) {
            setTimerActive(false);
            if(navigator.vibrate) navigator.vibrate(200);
            return 100;
          }
          return prev + (100 / 170); // 17 seconds * 10 (100ms interval)
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // --- VISION BOARD LOGIC ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) { // 2MB Limit
        alert("Image is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        addBoardItem('image', base64String);
        setShowAddItem(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBoardItem = (type: 'text' | 'image', content: string) => {
    const newItem: VisionBoardItem = {
      id: Date.now().toString(),
      type,
      content,
      x: 40,
      y: 40,
      zIndex: data.visionBoard.length + 1,
      scale: 1,
      rotation: 0
    };
    updateData({ ...data, visionBoard: [...data.visionBoard, newItem] });
  };

  const updateItemTransform = (id: string, updates: Partial<VisionBoardItem>) => {
    updateData({
      ...data,
      visionBoard: data.visionBoard.map(item => item.id === id ? { ...item, ...updates } : item)
    });
  };

  const handleMouseDown = (e: React.MouseEvent, id: string, initialX: number, initialY: number) => {
    e.stopPropagation();
    setSelectedItem(id);
    setIsDragging(id);
    if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
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
        
        const newX = Math.max(0, Math.min(90, x - dragOffset.x));
        const newY = Math.max(0, Math.min(90, y - dragOffset.y));

        updateItemTransform(isDragging, { x: newX, y: newY });
    }
  };

  const removeItem = (id: string) => {
      updateData({ ...data, visionBoard: data.visionBoard.filter(i => i.id !== id) });
      setSelectedItem(null);
  };

  // --- 369 LOGIC ---

  const generate369Suggestion = async () => {
    if (!new369Desire) return;
    setIsGenerating(true);
    const suggestion = await generate369Affirmation(new369Desire);
    setGeneratedAffirmation(suggestion);
    setIsGenerating(false);
  };

  const start369 = () => {
    const affirmation = generatedAffirmation || new369Desire;
    if(!affirmation) return;

    const newMethod: Method369 = {
      id: Date.now().toString(),
      desire: affirmation,
      startDate: new Date().toISOString(),
      targetDays: 33,
      currentDay: 1,
      progress: {},
      completed: false,
      isActive: true
    };
    updateData({ ...data, active369: newMethod });
    setShow369Guide(false);
  };

  const update369Progress = (period: 'morning' | 'afternoon' | 'night') => {
    if (!data.active369) return;
    const today = new Date().toISOString().split('T')[0];
    const currentProgress = data.active369.progress[today] || { morning: false, afternoon: false, night: false };
    
    const newProgress = {
      ...data.active369.progress,
      [today]: { ...currentProgress, [period]: true }
    };

    // Check if day is complete
    const updatedToday = newProgress[today];
    let dayIncrement = 0;
    if (updatedToday.morning && updatedToday.afternoon && updatedToday.night) {
        // If all done, logic to increment day would happen on next day load or manual check
        // For simplicity, we just track progress here.
    }

    updateData({ 
      ...data, 
      active369: { ...data.active369, progress: newProgress } 
    });
  };

  // --- TOOLS LOGIC ---

  const handleBurnBelief = async () => {
    if (!limitingBelief) return;
    setIsBurning(true);
    const newBelief = await transformLimitingBelief(limitingBelief);
    setTimeout(() => {
      setTransformedBelief(newBelief);
      setIsBurning(false);
      setLimitingBelief('');
    }, 2500);
  };

  const updateCheque = (field: keyof ManifestationData['cheque'], value: string) => {
      updateData({
          ...data,
          cheque: { ...data.cheque, [field]: value }
      });
  };

  const addToUniverseBox = (text: string) => {
    updateData({ ...data, universeBox: [text, ...data.universeBox] });
  };


  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 pb-20">
      {/* Welcome & Intention */}
      <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={120} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 mb-2">
            <Moon size={18} /> <span>Daily Alignment</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
            "{data.intention || "I am open to the abundance of the universe."}"
          </h1>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Set today's intention..." 
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex-1 text-white placeholder:text-indigo-300 outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                    updateData({ ...data, intention: e.target.value });
                    e.target.value = '';
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Moon Phase Widget (Simulated) */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="w-24 h-24 rounded-full bg-slate-800 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-slate-200 rounded-full translate-x-1/3 opacity-90 shadow-inner"></div> 
          </div>
          <h3 className="text-lg font-serif">Waxing Gibbous</h3>
          <p className="text-xs text-slate-400 mt-1">Good for: Action & Refinement</p>
      </div>
      
      {/* Vibration Meter */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col relative">
        <h3 className="text-slate-500 font-medium mb-4 flex items-center gap-2"><Activity size={16} /> Energy Alignment</h3>
        <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold text-indigo-600">{data.vibrationLevel}%</span>
                <span className="text-sm text-slate-400">Frequency</span>
            </div>
            <input 
                type="range" 
                min="0" max="100" 
                value={data.vibrationLevel} 
                onChange={(e) => updateData({ ...data, vibrationLevel: parseInt(e.target.value) })}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
            />
            <p className="text-xs text-slate-400 mt-3 text-center">
                {data.vibrationLevel > 80 ? "You are a magnet for miracles!" : data.vibrationLevel > 50 ? "Balanced and receptive." : "Take a moment to breathe and reset."}
            </p>
        </div>
      </div>
      
      {/* 17 Second Timer */}
      <div className="bg-gradient-to-tr from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-100 relative overflow-hidden">
         <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="font-bold text-amber-900 flex items-center gap-2"><Zap className="fill-amber-500 text-amber-600" size={18} /> Pure Thought Timer</h3>
              <p className="text-xs text-amber-700/70 mt-1">Abraham Hicks: 17s of pure thought ignites manifestation.</p>
            </div>
         </div>
         {timerActive ? (
            <div className="relative h-24 flex items-center justify-center">
               <div className="absolute inset-0 bg-amber-200/20 rounded-full animate-ping"></div>
               <div className="text-4xl font-bold text-amber-600 z-10 font-mono">
                  {Math.ceil(17 - (timerProgress / 100 * 17))}
               </div>
               <svg className="absolute w-full h-full rotate-[-90deg]">
                  <circle cx="50%" cy="50%" r="40" fill="none" stroke="#fed7aa" strokeWidth="4" />
                  <circle cx="50%" cy="50%" r="40" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="251" strokeDashoffset={251 - (251 * timerProgress / 100)} className="transition-all duration-100 linear" />
               </svg>
            </div>
         ) : (
            <button 
              onClick={() => { setTimerActive(true); setTimerProgress(0); }}
              className="w-full py-4 bg-white text-amber-600 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border border-amber-100 group"
            >
              <PlayCircle size={24} className="group-hover:scale-110 transition-transform" /> Start 17s Focus
            </button>
         )}
      </div>

       {/* Universe Box Quick Add */}
       <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
               <Box size={24} />
           </div>
           <div className="flex-1">
               <h3 className="font-bold text-slate-800">Universe Box</h3>
               <p className="text-xs text-slate-500 mb-2">Let go of "how" it will happen.</p>
               <input 
                  type="text" 
                  placeholder="I surrender this desire to the Universe..."
                  className="w-full bg-slate-50 border-b border-slate-200 px-0 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors bg-transparent"
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addToUniverseBox(e.target.value);
                      e.target.value = '';
                    }
                  }}
               />
           </div>
       </div>
    </div>
  );

  const render369 = () => {
    const today = new Date().toISOString().split('T')[0];
    const progress = data.active369?.progress[today] || { morning: false, afternoon: false, night: false };
    const isActive = data.active369?.isActive;

    if (!isActive || show369Guide) {
       return (
          <div className="max-w-2xl mx-auto pb-20">
             <div className="text-center mb-10">
                <div className="inline-block p-4 bg-indigo-50 rounded-full text-indigo-600 mb-4">
                   <PenTool size={32} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">The 3-6-9 Method</h2>
                <p className="text-slate-500">Tesla's key to the universe. Manifest in 33 days.</p>
             </div>

             <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                <div className="mb-8">
                   <label className="block text-sm font-bold text-slate-700 mb-2">What do you want to manifest?</label>
                   <textarea 
                      value={new369Desire}
                      onChange={(e) => setNew369Desire(e.target.value)}
                      placeholder="e.g. A promotion at work, a new home, inner peace..."
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 outline-none resize-none h-32"
                   />
                </div>
                
                {generatedAffirmation ? (
                   <div className="mb-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider">AI Suggestion</span>
                         <button onClick={() => setGeneratedAffirmation('')} className="text-indigo-400 hover:text-indigo-600"><X size={16}/></button>
                      </div>
                      <p className="text-xl font-serif font-bold text-indigo-900">"{generatedAffirmation}"</p>
                      <p className="text-xs text-indigo-600/60 mt-2">This is present tense and specific.</p>
                   </div>
                ) : (
                   <button 
                     onClick={generate369Suggestion}
                     disabled={!new369Desire || isGenerating}
                     className="mb-8 text-sm text-indigo-600 font-medium flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors w-max"
                   >
                     {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                     Refine with AI
                   </button>
                )}

                <div className="flex gap-4">
                   {show369Guide && <button onClick={() => setShow369Guide(false)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>}
                   <button 
                     onClick={start369}
                     disabled={!new369Desire && !generatedAffirmation}
                     className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Start 33-Day Cycle
                   </button>
                </div>
             </div>
             
             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-slate-500">
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                   <strong className="block text-indigo-600 text-lg mb-1">3 Times</strong>
                   Morning: Set Intention
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                   <strong className="block text-indigo-600 text-lg mb-1">6 Times</strong>
                   Afternoon: Amplify
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                   <strong className="block text-indigo-600 text-lg mb-1">9 Times</strong>
                   Night: Release
                </div>
             </div>
          </div>
       );
    }

    // Active View
    if (!data.active369) return null;
    
    const completedCount = Object.values(data.active369.progress).filter((d: any) => d.morning && d.afternoon && d.night).length;
    const dayNumber = completedCount + 1;

    return (
       <div className="max-w-3xl mx-auto pb-20">
          <div className="flex justify-between items-end mb-6">
             <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Day {dayNumber} of 33</span>
                <h2 className="text-2xl font-serif font-bold text-slate-800">Your Manifestation Cycle</h2>
             </div>
             <button onClick={() => {updateData({...data, active369: undefined}); setNew369Desire(''); setGeneratedAffirmation(''); }} className="text-red-400 text-xs hover:text-red-600 px-3 py-1 hover:bg-red-50 rounded-lg transition-colors">Abort Cycle</button>
          </div>

          <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10"><PenTool size={100} /></div>
             <p className="text-indigo-200 text-sm font-medium mb-2 uppercase tracking-wide">Write this exactly:</p>
             <p className="text-2xl md:text-3xl font-serif font-bold leading-tight">"{data.active369.desire}"</p>
          </div>

          <div className="grid gap-4">
             {['Morning', 'Afternoon', 'Night'].map((period, idx) => {
                 const pKey = period.toLowerCase() as 'morning' | 'afternoon' | 'night';
                 const isDone = progress[pKey];
                 const count = idx === 0 ? 3 : idx === 1 ? 6 : 9;
                 // Logic to disable next steps if previous not done
                 const isDisabled = (idx === 1 && !progress.morning) || (idx === 2 && !progress.afternoon);

                 return (
                    <button
                       key={period}
                       onClick={() => update369Progress(pKey)}
                       disabled={isDisabled || isDone}
                       className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                          isDone 
                          ? 'bg-green-50 border-green-200' 
                          : isDisabled 
                             ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                             : 'bg-white border-slate-100 hover:border-indigo-400 hover:shadow-md'
                       }`}
                    >
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isDone ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                                {period}
                             </span>
                             <span className="text-xs text-slate-400">Write {count} times</span>
                          </div>
                          <p className={`font-serif text-lg ${isDone ? 'text-green-800' : 'text-slate-700'}`}>
                             {isDone ? 'Completed' : isDisabled ? 'Locked' : 'Tap to Mark Complete'}
                          </p>
                       </div>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isDone ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-500'
                       }`}>
                          {isDone ? <CheckCircle2 size={18} /> : <PenTool size={16} />}
                       </div>
                    </button>
                 )
             })}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
             <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Progress</span>
                <span>{Math.round((completedCount / 33) * 100)}%</span>
             </div>
             <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(completedCount / 33) * 100}%` }} />
             </div>
          </div>
       </div>
    );
  };

  const renderVisionBoard = () => (
    <div className="h-full flex flex-col pb-20">
       <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
             <h3 className="font-bold text-slate-800">Vision Board</h3>
             <p className="text-xs text-slate-500">Upload images or add affirmations. Arrange freely.</p>
          </div>
          <div className="flex gap-2">
             {selectedItem && (
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 mr-2 shadow-sm animate-in fade-in">
                   <button onClick={() => updateItemTransform(selectedItem, { scale: (data.visionBoard.find(i=>i.id===selectedItem)?.scale || 1) - 0.1 })} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom Out"><ZoomOut size={16}/></button>
                   <button onClick={() => updateItemTransform(selectedItem, { scale: (data.visionBoard.find(i=>i.id===selectedItem)?.scale || 1) + 0.1 })} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom In"><ZoomIn size={16}/></button>
                   <div className="w-px h-4 bg-slate-200 mx-1"></div>
                   <button onClick={() => updateItemTransform(selectedItem, { rotation: (data.visionBoard.find(i=>i.id===selectedItem)?.rotation || 0) + 90 })} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Rotate"><RotateCw size={16}/></button>
                   <div className="w-px h-4 bg-slate-200 mx-1"></div>
                   <button onClick={() => removeItem(selectedItem)} className="p-2 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 size={16}/></button>
                </div>
             )}
             <button 
                onClick={() => setShowAddItem(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-md hover:bg-blue-700 transition-colors"
             >
               <Plus size={16} /> Add Item
             </button>
          </div>
       </div>

       {/* Board Canvas */}
       <div 
         ref={boardRef}
         onMouseMove={handleMouseMove}
         onMouseUp={() => setIsDragging(null)}
         onMouseLeave={() => setIsDragging(null)}
         onClick={() => setSelectedItem(null)}
         className="flex-1 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 relative overflow-hidden group select-none shadow-inner"
       >
          {data.visionBoard.map(item => (
              <div 
                  key={item.id} 
                  className={`absolute cursor-move transition-shadow ${selectedItem === item.id ? 'ring-2 ring-blue-500 ring-offset-2 z-50' : 'hover:ring-1 hover:ring-blue-300'}`}
                  style={{ 
                      left: `${item.x}%`, 
                      top: `${item.y}%`, 
                      zIndex: item.zIndex,
                      transform: `scale(${item.scale || 1}) rotate(${item.rotation || 0}deg)`,
                      transformOrigin: 'center'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, item.id, item.x, item.y)}
              >
                  {item.type === 'image' ? (
                      <img src={item.content} alt="Vision" className="w-48 h-auto max-w-[300px] object-cover rounded-xl shadow-lg pointer-events-none" />
                  ) : (
                      <div className="bg-yellow-100 text-yellow-900 p-4 font-serif font-bold text-center rounded-xl min-w-[150px] max-w-[250px] shadow-lg border border-yellow-200/50 pointer-events-none">
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
                           <ImageIcon size={20} /> <span className="text-xs font-bold">Image</span>
                       </button>
                   </div>
                   
                   {newItemType === 'text' ? (
                        <input 
                            type="text" 
                            placeholder="e.g. I am wealthy"
                            value={newItemContent}
                            onChange={(e) => setNewItemContent(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-100"
                            autoFocus
                        />
                   ) : (
                        <div className="mb-6">
                            <label className="block w-full p-8 border-2 border-dashed border-slate-200 rounded-xl text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                <Upload className="mx-auto text-slate-400 mb-2" />
                                <span className="text-sm text-slate-500">Click to upload image</span>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden" 
                                />
                            </label>
                            <div className="my-2 text-center text-xs text-slate-400">- OR -</div>
                            <input 
                                type="text"
                                placeholder="Paste Image URL"
                                value={newItemContent}
                                onChange={(e) => setNewItemContent(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                   )}

                   <div className="flex justify-end gap-3">
                       <button onClick={() => setShowAddItem(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                       <button 
                         onClick={() => { 
                             if(newItemContent) addBoardItem(newItemType, newItemContent);
                             setShowAddItem(false);
                             setNewItemContent('');
                         }} 
                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                       >
                         Add to Board
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );

  const renderTools = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      
      {/* Abundance Cheque */}
      <div className="md:col-span-2 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 relative group overflow-hidden">
         <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold relative z-10">
            <DollarSign size={20} /> Abundance Cheque
         </div>
         
         {/* Cheque UI */}
         <div className="bg-white border-2 border-emerald-800/20 p-8 rounded-lg font-serif relative shadow-xl transform transition-transform group-hover:scale-[1.01] max-w-2xl mx-auto">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#065f46_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className="text-xs font-sans text-slate-400">
                  <span className="font-bold text-slate-800">UNIVERSE BANK</span><br/>
                  Infinite Abundance Branch<br/>
                  Everywhere, Now 88888
               </div>
               <div className="flex flex-col items-end">
                   <div className="border border-emerald-900/10 px-4 py-1 mb-1 bg-emerald-50/50">
                       <span className="text-xs text-slate-400 mr-2">DATE</span>
                       <input 
                         value={data.cheque.date}
                         onChange={(e) => updateCheque('date', e.target.value)}
                         className="bg-transparent outline-none font-bold text-slate-700 w-24 text-right"
                       />
                   </div>
               </div>
            </div>

            <div className="flex items-end gap-4 mb-6 relative z-10">
               <span className="text-sm text-slate-500 whitespace-nowrap mb-1">PAY TO THE ORDER OF</span>
               <div className="flex-1 border-b-2 border-emerald-900/10 relative">
                 <input 
                    type="text" 
                    value={data.cheque.payee}
                    onChange={(e) => updateCheque('payee', e.target.value)}
                    className="w-full text-xl font-bold text-slate-800 outline-none bg-transparent px-2 pb-1 font-serif"
                 />
               </div>
               <div className="border-2 border-emerald-900/10 px-4 py-2 bg-emerald-50/30 flex items-center gap-1 rounded">
                  <span className="text-emerald-800 font-bold">$</span>
                  <input 
                    type="text" 
                    value={data.cheque.amount}
                    onChange={(e) => updateCheque('amount', e.target.value)}
                    className="w-32 text-xl font-bold text-slate-800 outline-none bg-transparent text-right"
                    placeholder="0.00"
                  />
               </div>
            </div>
            
            <div className="flex items-end gap-4 mb-8 relative z-10">
               <div className="flex-1 border-b-2 border-emerald-900/10 relative">
                  <input 
                     type="text"
                     placeholder="Amount in words..."
                     className="w-full text-lg text-slate-600 outline-none bg-transparent px-2 pb-1 italic"
                  />
               </div>
               <span className="text-sm font-bold text-emerald-800">DOLLARS</span>
            </div>

            <div className="flex justify-between items-end relative z-10">
                <div className="flex-1 mr-12">
                     <span className="text-xs text-slate-400 ml-2">MEMO</span>
                     <div className="border-b-2 border-emerald-900/10">
                        <input 
                            type="text" 
                            value={data.cheque.memo}
                            onChange={(e) => updateCheque('memo', e.target.value)}
                            className="w-full text-sm text-slate-600 outline-none bg-transparent px-2 pb-1"
                            placeholder="For..."
                        />
                     </div>
                </div>
                <div className="w-1/3 text-center">
                    <div className="border-b-2 border-emerald-900/10 mb-1 h-8 flex items-end justify-center">
                        <span className="font-script text-2xl text-emerald-800">The Universe</span>
                    </div>
                    <span className="text-xs text-slate-400">AUTHORIZED SIGNATURE</span>
                </div>
            </div>
         </div>
         <div className="text-center mt-4">
             <button onClick={() => window.print()} className="text-emerald-600 text-xs font-bold hover:underline">Print Cheque</button>
         </div>
      </div>

      {/* Limiting Belief Burner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative min-h-[300px]">
         <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold">
            <Flame size={20} /> Belief Burner
         </div>
         {transformedBelief ? (
           <div className="animate-in zoom-in duration-500 text-center py-8 absolute inset-0 bg-white flex flex-col items-center justify-center p-6">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-green-100 shadow-lg">
               <Sparkles size={32} />
             </div>
             <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-2">Transformed Truth</p>
             <p className="text-xl text-indigo-600 font-serif font-bold leading-relaxed mb-6">"{transformedBelief}"</p>
             <button 
               onClick={() => setTransformedBelief('')}
               className="text-sm text-slate-400 hover:text-slate-600 underline"
             >
               Process another belief
             </button>
           </div>
         ) : isBurning ? (
            <div className="absolute inset-0 bg-orange-50 flex flex-col items-center justify-center z-20">
               <div className="relative">
                   <Flame size={80} className="text-orange-500 animate-bounce blur-sm absolute top-0 left-0" />
                   <Flame size={80} className="text-yellow-500 animate-pulse relative z-10" />
               </div>
               <p className="mt-4 text-orange-800 font-bold animate-pulse">Releasing energy...</p>
            </div>
         ) : (
           <div className="flex flex-col h-full">
             <p className="text-sm text-slate-500 mb-4">What negative thought is holding you back? Type it below to release it.</p>
             <textarea 
               value={limitingBelief}
               onChange={(e) => setLimitingBelief(e.target.value)}
               placeholder="e.g. I am not good enough to be wealthy..."
               className="w-full p-4 bg-slate-50 rounded-xl mb-4 flex-1 resize-none outline-none focus:ring-2 focus:ring-orange-100 border border-slate-100"
             />
             <button 
               onClick={handleBurnBelief}
               disabled={!limitingBelief}
               className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Flame size={18} /> Burn to Ashes
             </button>
           </div>
         )}
      </div>

      {/* Scripting Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
         <div className="flex items-center gap-2 mb-4 text-purple-600 font-bold">
            <PenTool size={20} /> Future Scripting
         </div>
         <p className="text-sm text-slate-500 mb-4">Write a journal entry dated one year from now. How does it feel?</p>
         <textarea 
            className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all resize-none min-h-[150px]"
            placeholder="I am so happy and grateful now that..."
         />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Sun className="text-purple-500" /> Manifestation
            </h2>
            <p className="text-slate-500 text-sm md:text-base">Co-create your reality with intention.</p>
         </div>
         <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto scrollbar-hide">
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === '369' && render369()}
         {activeTab === 'vision' && renderVisionBoard()}
         {activeTab === 'tools' && renderTools()}
      </div>
    </div>
  );
};
