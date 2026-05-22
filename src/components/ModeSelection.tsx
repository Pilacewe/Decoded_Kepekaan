import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, MessageSquareText, ShieldAlert, Zap, Sparkles, ChevronRight, Fingerprint } from 'lucide-react';
import { useGameStore, GameMode } from '../store';
import { cn } from '../utils';

const MODES = [
  { id: 'relationship', label: 'Relationship Mode', icon: Heart, description: 'Navigate mixed signals, situationships, and unspoken emotional boundaries.', color: 'text-rose-500', bg: 'bg-rose-50', gradient: 'from-rose-500/10 to-transparent' },
  { id: 'friendship', label: 'Friendship Mode', icon: Users, description: 'Survive fake friends, tongkrongan politics, and unspoken resentments.', color: 'text-blue-500', bg: 'bg-blue-50', gradient: 'from-blue-500/10 to-transparent' },
  { id: 'chat_decode', label: 'Chat Decode', icon: MessageSquareText, description: 'Analyze passive aggressive texts, typing indicators, and dry replies.', color: 'text-purple-500', bg: 'bg-purple-50', gradient: 'from-purple-500/10 to-transparent' },
  { id: 'tongkrongan', label: 'Tongkrongan Chaos', icon: Zap, description: 'Absurd choices, circle drama, and roasting your friends.', color: 'text-amber-500', bg: 'bg-amber-50', gradient: 'from-amber-500/10 to-transparent' },
  { id: 'red_flag', label: 'Red Flag Investigation', icon: ShieldAlert, description: 'Spot emotional manipulation before it ruins your mental health.', color: 'text-emerald-500', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
];

export function ModeSelection() {
  const setMode = useGameStore((s) => s.setMode);
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-black text-white relative overflow-hidden py-10 px-6">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black opacity-60"></div>
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="z-10 flex flex-col items-center text-center max-w-md"
         >
           <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/20">
             <Fingerprint className="w-8 h-8 text-white/80" />
           </div>
           <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Are you ready to be read?</h1>
           <p className="text-lg text-white/60 mb-12 font-medium leading-relaxed">
             Decode is a psychological social simulation. Every choice shapes your hidden emotional archetype. No right answers. Just painful truths.
           </p>
           
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setShowIntro(false)}
             className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2"
           >
             Enter Simulation <ChevronRight className="w-4 h-4" />
           </motion.button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-12 sm:mb-16 space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="inline-flex items-center justify-center p-3 sm:p-4 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4 border border-slate-100"
        >
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 drop-shadow-sm">
          Select Simulation.
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-lg mx-auto font-medium">
          Choose a scenario to decode your social survival patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {MODES.map((mode, i) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              onClick={() => setMode(mode.id as GameMode)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex flex-col items-start p-6 sm:p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all border border-slate-100 text-left overflow-hidden h-full"
            >
              <div className={cn("absolute inset-x-0 top-0 h-32 bg-gradient-to-b opacity-50 pointer-events-none transition-opacity group-hover:opacity-100", mode.gradient)} />
              
              <div className={cn("p-4 rounded-2xl mb-6 transition-colors shadow-sm relative z-10", mode.bg, mode.color)}>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 relative z-10">{mode.label}</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium relative z-10">
                {mode.description}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 relative z-10">
                Play Chapter <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" {...props}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H3" />
    </svg>
  )
}
