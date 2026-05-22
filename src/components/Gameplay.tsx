import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, Brain, Zap, Instagram, MessageCircle, Info, Music, Video, Sparkles } from 'lucide-react';
import { useGameStore, Scenario, LEVEL_CONFIG } from '../store';
import { cn } from '../utils';

function InteractiveUI({ scenario }: { scenario: Scenario }) {
  if (scenario.ui_type === 'whatsapp' || scenario.ui_type === 'imessage') {
    const isImessage = scenario.ui_type === 'imessage';
    return (
      <div className={cn("p-4 rounded-3xl mb-8 flex flex-col gap-3 shadow-inner overflow-hidden relative", isImessage ? "bg-slate-100" : "bg-[#efeae2]")}>
        {isImessage && <div className="absolute top-0 inset-x-0 h-10 bg-slate-100/80 backdrop-blur-md z-10 flex items-center justify-center border-b border-slate-200"><span className="text-xs font-semibold text-slate-800">iMessage</span></div>}
        {!isImessage && <div className="absolute top-0 inset-x-0 h-12 bg-[#075e54] z-10 flex items-center px-4"><span className="text-sm font-semibold text-white">Contact</span></div>}
        
        <div className={cn("flex flex-col gap-3 z-0 w-full", isImessage ? "pt-12" : "pt-14")}>
          {scenario.chat_messages?.map((msg, idx) => {
            const isMe = msg.sender === 'me';
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.4 }}
                key={idx} 
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm leading-snug w-fit shadow-sm",
                  isMe ? "self-end" : "self-start",
                  isMe && isImessage ? "bg-blue-500 text-white rounded-br-sm" : "",
                  !isMe && isImessage ? "bg-slate-200 text-slate-900 rounded-bl-sm" : "",
                  isMe && !isImessage ? "bg-[#dcf8c6] text-slate-800 rounded-br-sm" : "",
                  !isMe && !isImessage ? "bg-white text-slate-800 rounded-bl-sm" : ""
                )}
              >
                {msg.text}
              </motion.div>
            )
          })}
        </div>
      </div>
    );
  }

  if (scenario.ui_type === 'instagram_story') {
    return (
      <div className="mx-auto w-64 h-96 bg-zinc-900 rounded-3xl overflow-hidden relative shadow-xl mb-8 flex items-center justify-center">
        <div className="absolute top-0 inset-x-0 h-1 bg-white/20 m-2 rounded-full overflow-hidden">
           <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 5 }} className="h-full bg-white" />
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-2">
           <div className={cn("w-8 h-8 rounded-full border-2 bg-zinc-800", scenario.story_scene?.is_close_friends !== false ? "border-emerald-500" : "border-rose-500")} />
           <span className="text-xs font-bold text-white drop-shadow-md">{scenario.story_scene?.is_close_friends !== false ? 'Close Friends' : 'Story'}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0" />
        <p className="z-10 text-center text-white/50 text-sm px-6 italic">[{scenario.story_scene?.image_desc}]</p>
        <p className="absolute bottom-6 inset-x-6 text-center text-white font-medium drop-shadow-lg z-10">{scenario.story_scene?.caption}</p>
      </div>
    )
  }

  if (scenario.ui_type === 'tiktok') {
    return (
      <div className="mx-auto w-64 h-96 bg-black rounded-3xl overflow-hidden relative shadow-xl mb-8 flex flex-col justify-end">
         <div className="absolute top-4 right-4 text-white opacity-80"><Video className="w-5 h-5"/></div>
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
         <div className="z-10 p-4 text-white">
           <div className="flex items-center gap-2 mb-2">
             <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">{scenario.tiktok_scene?.action}</div>
           </div>
           <p className="text-sm text-white/60 italic mb-2">[{scenario.tiktok_scene?.video_desc}]</p>
           <p className="font-medium text-sm drop-shadow-md">{scenario.tiktok_scene?.caption}</p>
         </div>
      </div>
    )
  }

  if (scenario.ui_type === 'spotify') {
    return (
      <div className="p-4 rounded-3xl mb-8 bg-[#121212] flex items-center gap-4 shadow-xl border border-white/5 mx-auto max-w-sm">
         <div className="w-16 h-16 bg-zinc-800 rounded-md flex items-center justify-center shrink-0">
           <Music className="w-8 h-8 text-white/20"/>
         </div>
         <div className="flex flex-col text-white overflow-hidden">
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">{scenario.spotify_scene?.action_desc}</span>
            <span className="font-bold truncate">{scenario.spotify_scene?.song_name}</span>
         </div>
      </div>
    )
  }

  return null;
}

function LoadingScreen({ chapter, isResult }: { chapter?: number; isResult?: boolean }) {
  const [loadText, setLoadText] = useState("");
  
  useEffect(() => {
    const texts = isResult ? [
      "Generating psychological profile...",
      "Connecting trauma points...",
      "Finalizing emotional verdict...",
      "Preparing painful truths..."
    ] : [
       "Connecting to simulation...",
       "Establishing context...",
       "Reading the room...",
       "Preparing scenario..."
    ];
    setLoadText(texts[0]);
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadText(texts[i]);
    }, 1500);
    return () => clearInterval(interval);
  }, [isResult]);

  if (isResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
        <div className="z-10 flex flex-col items-center max-w-sm text-center px-6">
           <motion.div animate={{ scale: [1, 1.2, 1], filter: ['blur(10px)', 'blur(30px)', 'blur(10px)'] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
           <div className="relative mb-8 flex items-center justify-center w-24 h-24">
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-l-2 border-white/20">
               <div className="absolute inset-2 rounded-full border-b-2 border-r-2 border-emerald-400/50" />
               <div className="absolute inset-6 rounded-full border-t-2 border-rose-400/50" />
             </motion.div>
             <Brain className="w-8 h-8 text-white/50 relative z-10 animate-pulse" />
           </div>
           
           <h2 className="text-xl font-bold tracking-widest text-white uppercase mb-4">Decoding Truth</h2>
           <div className="h-6 overflow-hidden">
             <AnimatePresence mode="wait">
               <motion.p key={loadText} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-white/50 text-sm font-medium">
                 {loadText}
               </motion.p>
             </AnimatePresence>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-black text-white relative overflow-hidden">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black opacity-60 pointer-events-none" />
       
       <motion.div 
         initial={{ scale: 0.95, opacity: 0 }} 
         animate={{ scale: 1, opacity: 1 }} 
         transition={{ duration: 0.8, ease: "easeOut" }}
         className="z-10 flex flex-col items-center"
       >
          <motion.div 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="text-emerald-400 text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-2"
          >
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Simulation Stage
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-7xl font-black mb-12 tracking-tighter"
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.4, duration: 0.8 }}
          >
            CHAPTER {chapter}
          </motion.h1>

          <div className="h-4 overflow-hidden mt-8">
             <AnimatePresence mode="wait">
               <motion.p key={loadText} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="text-white/30 text-[10px] sm:text-xs uppercase tracking-widest font-mono">
                 {loadText}
               </motion.p>
             </AnimatePresence>
           </div>
       </motion.div>
    </div>
  );
}

export function Gameplay() {
  const { mode, currentChapter, currentLevel, choices, scenarios, setScenario, nextChapter, isLoadingScenario, setLoading, setResult, playerStats, completeLevel } = useGameStore();

  const maxChapters = LEVEL_CONFIG[currentLevel]?.chapters || 3;
  const currentScenario = scenarios[currentChapter - 1];
  const isFetching = useRef(false);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (currentScenario && !isLoadingScenario) {
      setShowTyping(true);
      const delay = Math.floor(Math.random() * 2000) + 1000;
      const t = setTimeout(() => {
        setShowTyping(false);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [currentScenario, isLoadingScenario]);

  useEffect(() => {
    async function fetchScenario() {
      if (scenarios.length >= currentChapter) return; // already fetched
      if (isFetching.current) return;
      
      isFetching.current = true;
      setLoading(true);
      try {
        const [res] = await Promise.all([
          fetch('/api/scenario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode, currentChapter, currentLevel, previousChoices: choices })
          }),
          new Promise(resolve => setTimeout(resolve, 2500)) // minimum 2.5s level intro
        ]);
        const data = await res.json();
        if (data.error) {
           throw new Error(data.error);
        }
        setScenario(data);
      } catch (err: any) {
        console.error("Failed to fetch scenario", err);
        alert(`Failed to load scenario: ${err.message}. Please try again later.`);
        // Note: we might want to decrement currentChapter or just give up for now
        // For now, we remain stuck in the loading error state unless they refresh
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    }

    if (currentChapter <= maxChapters) {
      fetchScenario();
    } else {
      if (currentLevel >= 7) {
        generateResult();
      } else {
        completeLevel();
      }
    }
  }, [currentChapter, currentLevel]);

  async function generateResult() {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        fetch('/api/result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, choices, playerStats })
        }),
        new Promise(resolve => setTimeout(resolve, 3500)) // minimum 3.5s dramatic loading
      ]);
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (err: any) {
      console.error("Failed to generate result", err);
      alert(`Failed to generate result: ${err.message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }

  if (isLoadingScenario || (!currentScenario && currentChapter <= maxChapters)) {
    return <LoadingScreen isResult={currentChapter > maxChapters && currentLevel >= 7} chapter={currentChapter} />;
  }

  if (!currentScenario) return null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col min-h-[100dvh]">
      {/* Top Bar with Stats */}
      <div className="flex flex-col gap-4 mb-6 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow flex items-center justify-center font-bold text-slate-700 text-sm">
                LV.{playerStats.level}
             </div>
             <div className="flex flex-col">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">XP</span>
                <span className="text-sm font-semibold text-slate-700 leading-none">{playerStats.xp}</span>
             </div>
          </div>
          <div className="text-xs font-bold tracking-widest uppercase text-slate-400 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
            Chapter {currentChapter} <span className="text-slate-300 mx-1">/</span> {maxChapters}
          </div>
        </div>
        
        {/* Progress Meters */}
        <div className="flex items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
           <div className="flex-1 flex flex-col gap-1.5">
              <span className="flex items-center gap-1"><Brain className="w-3 h-3 text-purple-500"/> Overthinking</span>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                 <motion.div animate={{ width: `${playerStats.overthinking}%` }} className="h-full bg-purple-500" />
              </div>
           </div>
           <div className="flex-1 flex flex-col gap-1.5">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-rose-500"/> Stress</span>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                 <motion.div animate={{ width: `${playerStats.stress}%` }} className="h-full bg-rose-500" />
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showTyping ? (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col justify-center items-center py-20 shrink-0"
          >
            <div className="flex w-fit items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm text-slate-500">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-3 h-3 rounded-full bg-slate-300" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-3 h-3 rounded-full bg-slate-300" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-3 h-3 rounded-full bg-slate-300" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentScenario.title}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
            className="flex flex-col shrink-0 flex-1"
          >
            <div className="mb-6 flex flex-col flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight px-1">
                {currentScenario.title}
              </h2>
              
              <div className="p-5 sm:p-6 bg-white rounded-3xl rounded-tl-sm shadow-sm border border-slate-100 mb-6 whitespace-pre-wrap text-slate-800 leading-relaxed text-base sm:text-lg">
                 {currentScenario.context}
              </div>

              <InteractiveUI scenario={currentScenario} />
              
              <p className="text-lg sm:text-xl font-bold text-slate-800 mb-4 px-1">
                {currentScenario?.question}
              </p>

              <div className="space-y-3 mt-auto">
                {currentScenario?.choices?.map((choice, i) => (
                  <motion.button
                    key={i}
                    onClick={() => nextChapter(choice)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-slate-300 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-slate-700 font-medium pr-4 text-sm sm:text-base leading-snug">{choice}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors shrink-0">
                       <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
