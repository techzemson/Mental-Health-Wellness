import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, Music } from 'lucide-react';

export const BreathingTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('Ready?');
  const [cycle, setCycle] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('ready');

  useEffect(() => {
    let interval: any;
    if (isActive) {
      // 4-7-8 Technique simplified for loop
      // 4s Inhale, 7s Hold, 8s Exhale = 19s total cycle
      // For animation simplicity in this demo: 4s In, 4s Hold, 4s Out
      
      let timer = 0;
      interval = setInterval(() => {
        timer++;
        const t = timer % 12; // 12 second cycle for demo smoothness
        
        if (t < 4) {
          setCycle('inhale');
          setText('Breathe In...');
        } else if (t < 8) {
          setCycle('hold');
          setText('Hold...');
        } else {
          setCycle('exhale');
          setText('Breathe Out...');
        }
      }, 1000);
    } else {
      setCycle('ready');
      setText('Ready?');
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-50 to-indigo-100 rounded-3xl p-8 relative overflow-hidden">
      
      {/* Background Ambience Effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl mix-blend-multiply filter animate-blob" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-8">4-7-8 Breathing</h2>
        
        <div className="relative w-64 h-64 mx-auto mb-10 flex items-center justify-center">
          {/* Animated Circles */}
          <div className={`absolute w-full h-full bg-blue-400 rounded-full opacity-20 transition-all duration-[4000ms] ease-in-out ${
            cycle === 'inhale' ? 'scale-110' : cycle === 'exhale' ? 'scale-75' : 'scale-100'
          }`} />
          <div className={`absolute w-48 h-48 bg-blue-500 rounded-full opacity-20 transition-all duration-[4000ms] ease-in-out ${
            cycle === 'inhale' ? 'scale-125' : cycle === 'exhale' ? 'scale-90' : 'scale-100'
          }`} />
          
          <div className={`relative w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-[4000ms] ${
             cycle === 'inhale' ? 'scale-110' : cycle === 'exhale' ? 'scale-90' : 'scale-100'
          }`}>
             <span className="text-xl font-bold text-blue-600 animate-pulse">{text}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {isActive ? <Pause /> : <Play />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button className="p-3 bg-white text-slate-600 rounded-full shadow-md hover:bg-slate-50">
            <Music size={24} />
          </button>
        </div>
        
        <p className="mt-8 text-slate-500 text-sm max-w-xs mx-auto">
          Inhale through your nose for 4 seconds, hold for 7 seconds, exhale audibly through your mouth for 8 seconds.
        </p>
      </div>
    </div>
  );
};