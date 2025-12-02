
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Music2, Flower, X, ChevronRight, Activity } from 'lucide-react';
import { Mantra } from '../types';

// Pre-populated Powerful Mantras List with Full Chants
const MANTRAS_DATA: Mantra[] = [
  // Wealth & Prosperity
  {
    id: '1',
    title: 'Om Vasudhare Swaha',
    chant: 'Om Vasudhare Swaha',
    deity: 'Goddess Vasudhara',
    benefit: 'Attracts abundance, wealth, and earthly treasures.',
    category: 'Wealth',
    imageQuery: 'gold coins luxury'
  },
  {
    id: '2',
    title: 'Om Shreem Shreem Shreem',
    chant: 'Om Shreem Shreem Shreem',
    deity: 'Mahalakshmi',
    benefit: 'The seed sound for wealth, luxury, and beauty.',
    category: 'Wealth',
    imageQuery: 'lotus flower pink'
  },
  {
    id: '3',
    title: 'Om Mahalakshmi Namah',
    chant: 'Om Mahalakshmi Namah',
    deity: 'Mahalakshmi',
    benefit: 'Salutations to the Goddess of Wealth and Prosperity.',
    category: 'Wealth',
    imageQuery: 'goddess lakshmi art'
  },
  
  // Protection & Strength
  {
    id: '4',
    title: 'Om Hum Hanumate Namah',
    chant: 'Om Hum Hanumate Namah',
    deity: 'Lord Hanuman',
    benefit: 'Provides immense strength, courage, and protection from negativity.',
    category: 'Protection',
    imageQuery: 'hanuman sky'
  },
  {
    id: '5',
    title: 'Shri Hanumate Namah',
    chant: 'Shri Hanumate Namah',
    deity: 'Lord Hanuman',
    benefit: 'Invokes the blessings of Hanuman for physical and mental strength.',
    category: 'Protection',
    imageQuery: 'hanuman orange'
  },
  {
    id: '6',
    title: 'Om Bageshwaray Namah',
    chant: 'Om Bageshwaray Birbiray Hum Phat Swaha',
    deity: 'Bageshwar Dham',
    benefit: 'Removes evil eyes, negativity, and distress.',
    category: 'Protection',
    imageQuery: 'spiritual fire'
  },
  {
    id: '7',
    title: 'Narasimha Kavacham',
    chant: 'Ugram Veeram Maha Vishnum Jvalantam Sarvato Mukham Nrisimham Bhishanam Bhadram Mrityur Mrityum Namamy Aham',
    deity: 'Lord Narasimha',
    benefit: 'Ultimate protection shield against all dangers.',
    category: 'Protection',
    imageQuery: 'lion fire art'
  },

  // Peace & Liberation (Shiva)
  {
    id: '8',
    title: 'Om Namah Shivay',
    chant: 'Om Namah Shivay',
    deity: 'Lord Shiva',
    benefit: 'Purifies the soul, brings inner peace, and removes fear of death.',
    category: 'Peace',
    imageQuery: 'shiva himalayas'
  },
  {
    id: '9',
    title: 'Har Har Mahadev',
    chant: 'Har Har Mahadev',
    deity: 'Lord Shiva',
    benefit: 'Dispels ignorance and awakens the soul.',
    category: 'Peace',
    imageQuery: 'mount kailash'
  },
  {
    id: '10',
    title: 'Shivoham Shivoham',
    chant: 'Shivoham Shivoham',
    deity: 'Lord Shiva',
    benefit: 'I am Shiva. Realization of the true self and oneness.',
    category: 'Peace',
    imageQuery: 'meditation silhouette'
  },
  {
    id: '11',
    title: 'Mahamrityunjaya Mantra',
    chant: 'Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
    translation: 'Om Tryambakam Yajamahe...',
    deity: 'Lord Shiva',
    benefit: 'Bestows longevity, health, and liberation.',
    category: 'Health',
    imageQuery: 'shivaling'
  },

  // Devotion (Krishna/Ram)
  {
    id: '12',
    title: 'Hare Krishna Mahamantra',
    chant: 'Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare',
    deity: 'Lord Krishna',
    benefit: 'The Mahamantra. Cleanses the heart and awakens divine love.',
    category: 'Devotion',
    imageQuery: 'peacock feather'
  },
  {
    id: '13',
    title: 'Krishna Mantra',
    chant: 'Krishnaya Vasudevaya Haraye Paramatmane Pranata Klesha Nashaya Govindaya Namo Namah',
    deity: 'Lord Krishna',
    benefit: 'Removes all grief and misery (Pranata Klesh Nashaya).',
    category: 'Devotion',
    imageQuery: 'krishna flute'
  },
  {
    id: '14',
    title: 'Radha Mantra',
    chant: 'Radha Radha Radha',
    deity: 'Radha Rani',
    benefit: 'Attracts pure divine love and sweetness.',
    category: 'Devotion',
    imageQuery: 'radha krishna art'
  },
  {
    id: '15',
    title: 'Ram Mantra',
    chant: 'Shri Ram Jai Ram Jai Jai Ram',
    deity: 'Lord Rama',
    benefit: 'Victory over the mind and internal enemies.',
    category: 'Devotion',
    imageQuery: 'bow and arrow'
  },
  {
    id: '16',
    title: 'Sita Ram',
    chant: 'Sita Ram',
    deity: 'Sita Ram',
    benefit: 'Harmonizes masculine and feminine energies.',
    category: 'Devotion',
    imageQuery: 'diya lamp'
  },

  // Universal/Others
  {
    id: '17',
    title: 'Gayatri Mantra',
    chant: 'Om Bhur Bhuvah Svah Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat',
    translation: 'Om Bhur Bhuvah Svah...',
    deity: 'Goddess Gayatri',
    benefit: 'Illuminates the intellect and grants wisdom.',
    category: 'Success',
    imageQuery: 'sun sunrise'
  },
  {
    id: '18',
    title: 'Mangal Mantra',
    chant: 'Om Kram Kreem Kroum Sah Bhaumaya Namah',
    deity: 'Mangal Planet',
    benefit: 'Removes obstacles related to Mars (Mangal Dosha) and marriage.',
    category: 'Success',
    imageQuery: 'red planet mars'
  },
  {
    id: '19',
    title: 'Ganesha Mantra',
    chant: 'Om Shri Vardhanaya Namah',
    deity: 'Lord Ganesha',
    benefit: 'Increases growth, success, and prosperity.',
    category: 'Success',
    imageQuery: 'ganesha art'
  }
];

const CATEGORIES = ['All', 'Wealth', 'Protection', 'Peace', 'Devotion', 'Health', 'Success'];

export const Mantras: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedMantra, setSelectedMantra] = useState<Mantra | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [japaCount, setJapaCount] = useState(0);
  const [autoReplay, setAutoReplay] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Filter Mantras
  const filteredMantras = activeCategory === 'All' 
    ? MANTRAS_DATA 
    : MANTRAS_DATA.filter(m => m.category === activeCategory);

  // Audio Logic
  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const playMantra = (text: string) => {
    stopAudio();
    const utterance = new SpeechSynthesisUtterance(text);
    // Adjust settings to sound more "chant-like"
    utterance.rate = 0.75; // Slower
    utterance.pitch = 0.9; // Deeper
    utterance.volume = 1;
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    // Prioritize Indian English voices or Hindi voices if available for better pronunciation
    const preferredVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('India')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      if (autoReplay && selectedMantra) {
         // Small delay before replay
         setTimeout(() => {
             if(selectedMantra) { // Check if still open
                 playMantra(text);
                 setJapaCount(prev => prev + 1);
             }
         }, 1000);
      }
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => stopAudio(); // Cleanup on unmount
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else if (selectedMantra) {
      playMantra(selectedMantra.chant);
    }
  };

  const handleJapaClick = () => {
    const newCount = japaCount + 1;
    setJapaCount(newCount);
    // Vibrate on mobile for tactile feedback
    if (navigator.vibrate) navigator.vibrate(50);
    
    if (newCount % 108 === 0) {
        // Special feedback for completing a Mala
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
         <div>
            <h2 className="text-3xl font-serif font-bold text-orange-700 flex items-center gap-2">
               <Flower className="text-amber-500 animate-spin-slow" /> Powerful Mantras
            </h2>
            <p className="text-orange-900/60">Vibrational energy to heal, protect, and manifest.</p>
         </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap border ${
              activeCategory === cat 
              ? 'bg-orange-500 text-white shadow-lg border-orange-500' 
              : 'bg-white text-orange-900/70 border-orange-100 hover:bg-orange-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMantras.map(mantra => (
               <div 
                  key={mantra.id}
                  onClick={() => {
                    setSelectedMantra(mantra);
                    setJapaCount(0);
                  }}
                  className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all hover:-translate-y-1 bg-white border border-orange-100"
               >
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/20 transition-all" />
                  
                  <div className="h-full flex flex-col justify-between p-6">
                     <div className="flex justify-between items-start z-10">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                            mantra.category === 'Wealth' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            mantra.category === 'Protection' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                           {mantra.category}
                        </span>
                        <div className="p-2 bg-orange-50 rounded-full text-orange-500">
                           <Music2 size={16} />
                        </div>
                     </div>
                     
                     <div className="z-10">
                        <h3 className="text-slate-800 font-serif font-bold text-xl leading-snug mb-1 group-hover:text-orange-600 transition-colors">
                           {mantra.title}
                        </h3>
                        <p className="text-slate-500 text-xs line-clamp-2">{mantra.benefit}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Full Screen Chant Mode */}
      {selectedMantra && (
         <div className="fixed inset-0 z-50 bg-orange-50 text-orange-900 flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Top Bar */}
            <div className="relative z-10 flex justify-between items-center p-6">
               <button 
                 onClick={() => {
                     stopAudio();
                     setSelectedMantra(null);
                 }}
                 className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-slate-500"
               >
                  <X size={24} />
               </button>
               <span className="uppercase tracking-[0.2em] text-xs font-bold text-orange-400 bg-white/50 px-3 py-1 rounded-full">{selectedMantra.deity}</span>
               <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
               
               <h2 className="text-3xl md:text-5xl font-serif font-bold text-orange-800 mb-6 leading-tight">
                  "{selectedMantra.chant}"
               </h2>
               
               <p className="text-slate-500 font-medium text-lg max-w-2xl mb-8">
                  {selectedMantra.benefit}
               </p>

               {/* Controls */}
               <div className="flex items-center gap-8 mb-12">
                  <button 
                     onClick={() => setJapaCount(0)}
                     className="text-slate-400 hover:text-orange-600 flex flex-col items-center gap-1 text-xs"
                  >
                     <RotateCcw size={20} /> Reset
                  </button>

                  <button 
                     onClick={togglePlay}
                     className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center text-white hover:scale-105 hover:shadow-orange-200 hover:shadow-2xl transition-all shadow-xl"
                  >
                     {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                  </button>

                  <button 
                     onClick={() => setAutoReplay(!autoReplay)}
                     className={`${autoReplay ? 'text-green-600' : 'text-slate-400'} hover:text-orange-600 flex flex-col items-center gap-1 text-xs transition-colors`}
                  >
                     <Activity size={20} /> {autoReplay ? 'Loop On' : 'Loop Off'}
                  </button>
               </div>

               {/* Japa Counter */}
               <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-orange-100 shadow-xl">
                  <div className="flex justify-between items-end mb-4">
                     <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Japa Count</span>
                     <span className="text-4xl font-bold text-orange-500">{japaCount} <span className="text-sm text-slate-300">/ 108</span></span>
                  </div>
                  {/* Bead Progress */}
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                     <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300"
                        style={{ width: `${(japaCount % 108) / 108 * 100}%` }}
                     />
                  </div>
                  <button 
                     onClick={handleJapaClick}
                     className="w-full py-4 bg-orange-50 hover:bg-orange-100 rounded-2xl text-sm font-bold text-orange-700 border border-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                     Tap Bead (+1)
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
