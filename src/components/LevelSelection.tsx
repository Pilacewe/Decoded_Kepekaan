import { motion } from 'motion/react';
import { useGameStore, LEVEL_CONFIG } from '../store';
import { Lock, Play, CheckCircle2, ChevronLeft } from 'lucide-react';
import { cn } from '../utils';

export function LevelSelection() {
  const { completedLevels, startLevel, setView, mode } = useGameStore();

  const maxUnlockedLevel = Math.max(...completedLevels, 0) + 1;
  const levels = Object.entries(LEVEL_CONFIG).map(([levelNumStr, config]) => {
    const levelNum = parseInt(levelNumStr, 10);
    const isCompleted = completedLevels.includes(levelNum);
    const isUnlocked = levelNum <= maxUnlockedLevel;
    
    return {
      levelNum,
      ...config,
      isCompleted,
      isUnlocked,
    };
  });

  return (
    <div className="min-h-[100dvh] bg-[#faf9f6] text-slate-900 py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-slate-800 transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Modes
        </button>

        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500">
              {mode?.replace('_', ' ')} Simulation
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter"
          >
            Select Stage.
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, i) => (
            <motion.button
              key={level.levelNum}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => level.isUnlocked && startLevel(level.levelNum)}
              disabled={!level.isUnlocked}
              className={cn(
                "relative flex flex-col items-start p-8 rounded-[2rem] text-left transition-all overflow-hidden h-full",
                level.isUnlocked 
                  ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-slate-100 cursor-pointer" 
                  : "bg-slate-100/50 border border-slate-200/50 cursor-not-allowed opacity-80"
              )}
            >
              <div className="flex w-full items-center justify-between mb-8">
                <span className={cn(
                  "text-sm font-bold tracking-widest uppercase",
                  level.isCompleted ? "text-emerald-500" : (level.isUnlocked ? "text-slate-900" : "text-slate-400")
                )}>
                  Level {level.levelNum}
                </span>
                {level.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : level.isUnlocked ? (
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                     <Play className="w-4 h-4 text-slate-900 ml-0.5" />
                   </div>
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <h3 className={cn("text-2xl font-black tracking-tight mb-2", level.isUnlocked ? "text-slate-900" : "text-slate-400")}>
                {level.title}
              </h3>
              
              <p className={cn("text-sm font-medium leading-relaxed mb-8", level.isUnlocked ? "text-slate-500" : "text-slate-400")}>
                {level.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {level.chapters} Chapters
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
