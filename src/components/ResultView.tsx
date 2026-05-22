import { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCcw, Heart, Shield, MessageCircle, AlertTriangle, Zap, Battery, Swords, Share2, Check, Sparkles, BrainCircuit, ScanSearch, Ghost, Smartphone, Eye } from 'lucide-react';
import { useGameStore } from '../store';
import { cn } from '../utils';

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-slate-200 rounded-full"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{ 
            y: [null, Math.random() * -100 - 50],
            opacity: [null, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

export function ResultView() {
  const { result, resetGame } = useGameStore();
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const {
    archetype,
    quote,
    loveLanguage,
    emotionalAwareness,
    relationshipSensitivity,
    communicationStyle,
    attachmentStyle,
    socialBattery,
    overthinkingMeter,
    greenFlagScore,
    redFlagRisk,
    conflictBehavior,
    textingPersonality,
    defenseMechanism,
    hiddenFear,
    aiLore,
  } = result;

  const loveLangData = [
    { name: 'Quality Time', value: loveLanguage?.qualityTime || 20, color: '#f43f5e' },
    { name: 'Acts of Service', value: loveLanguage?.actsOfService || 20, color: '#3b82f6' },
    { name: 'Words of Affirmation', value: loveLanguage?.wordsOfAffirmation || 20, color: '#10b981' },
    { name: 'Physical Touch', value: loveLanguage?.physicalTouch || 20, color: '#f59e0b' },
    { name: 'Receiving Gifts', value: loveLanguage?.receivingGifts || 20, color: '#8b5cf6' },
  ].filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const handleShare = async () => {
    try {
      const shareData = btoa(unescape(encodeURIComponent(JSON.stringify(result))));
      const shareUrl = `${window.location.origin}/?share=${shareData}`;
      const shareText = `I played Decode and got: ${archetype}!\n\n"${quote}"\n\nTop Love Language: ${loveLangData[0]?.name || 'Quality Time'}\nConflict: ${conflictBehavior}\n\nSee my full result and play Decode here: ${shareUrl}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Decode Result',
            text: shareText,
          });
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            copyToClipboard(shareText);
          }
        }
      } else {
        copyToClipboard(shareText);
      }
    } catch(e) {
      console.error("Failed to generate share link", e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("p-6 sm:p-8 rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 transition-all", className)}>
      {children}
    </div>
  );

  return (
    <div className="min-h-[100dvh] py-16 px-4 sm:px-6 md:px-8 font-sans relative flex flex-col items-center bg-[#faf9f6] text-slate-900">
      <Particles />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl text-center mb-16 relative z-10 pt-10"
      >
        <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white text-xs font-black tracking-widest uppercase mb-10 shadow-sm border border-slate-200 text-slate-500">
          <Sparkles className="w-4 h-4 text-emerald-500" /> SIMULATION COMPLETE
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-slate-900 drop-shadow-sm px-4">
          {archetype}
        </h1>
        
        <div className="max-w-3xl mx-auto mb-12 px-4">
          <p className="text-xl sm:text-3xl text-slate-500 font-serif italic leading-relaxed">"{quote}"</p>
        </div>
        
        {/* Core Lore */}
        <Card className="max-w-3xl mx-auto relative overflow-hidden text-left bg-gradient-to-br from-white to-slate-50/50">
          <BrainCircuit className="absolute -top-10 -right-10 w-48 h-48 text-slate-100 -rotate-12 pointer-events-none" />
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-loose relative z-10 px-2 sm:px-4">
            {aiLore}
          </p>
        </Card>
      </motion.div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-16">
        
        {/* Love Language Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <Card className="h-full flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full shrink-0">
               <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><Heart className="w-6 h-6" /></div>
                 <h3 className="text-xl font-black tracking-tight text-slate-900">Love Languages</h3>
               </div>
               <div className="flex flex-col gap-6">
                 {loveLangData.map(d => (
                   <div key={d.name}>
                     <div className="flex items-center justify-between text-sm font-bold mb-2">
                       <span className="text-slate-700">{d.name}</span>
                       <span className="text-slate-400">{d.value}%</span>
                     </div>
                     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: d.color }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </Card>
        </motion.div>

        {/* Meters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col">
          <Card className="flex-1 flex flex-col justify-center gap-8">
             <div className="flex items-center gap-3 mb-2">
                 <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl"><ScanSearch className="w-6 h-6" /></div>
                 <h3 className="text-xl font-black tracking-tight text-slate-900">Metrics</h3>
             </div>
             
             <div>
               <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-slate-400 mb-2">
                 <span className="flex items-center gap-1.5">Overthinking</span>
                 <span className="text-purple-600">{overthinkingMeter}%</span>
               </div>
               <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{width: `${overthinkingMeter}%`}} />
               </div>
             </div>
             <div>
               <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-slate-400 mb-2">
                 <span className="flex items-center gap-1.5">Sensitivity</span>
                 <span className="text-blue-600">{relationshipSensitivity}%</span>
               </div>
               <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{width: `${relationshipSensitivity}%`}} />
               </div>
             </div>
             <div>
               <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-slate-400 mb-2">
                 <span className="flex items-center gap-1.5">EQ Radar</span>
                 <span className="text-emerald-600">{emotionalAwareness}%</span>
               </div>
               <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width: `${emotionalAwareness}%`}} />
               </div>
             </div>
          </Card>
        </motion.div>

        {/* Communication & Texting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card>
             <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl w-fit mb-4"><MessageCircle className="w-6 h-6" /></div>
             <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Communication Style</h3>
             <p className="font-bold text-slate-800 text-lg leading-snug">{communicationStyle}</p>
           </Card>
           <Card>
             <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl w-fit mb-4"><Smartphone className="w-6 h-6" /></div>
             <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Texting Vibe</h3>
             <p className="font-bold text-slate-800 text-lg leading-snug">{textingPersonality}</p>
           </Card>
           <Card>
             <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl w-fit mb-4"><Battery className="w-6 h-6" /></div>
             <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Social Battery</h3>
             <p className="font-bold text-slate-800 text-lg leading-snug">{socialBattery}</p>
           </Card>
        </motion.div>

        {/* Deep Psyche */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="flex flex-col gap-6">
             <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> Attachment Pattern</h3>
                <p className="text-xl font-bold text-slate-800">{attachmentStyle}</p>
             </div>
             <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2 flex items-center gap-2"><Swords className="w-4 h-4"/> Conflict Response</h3>
                <p className="text-xl font-bold text-slate-800">{conflictBehavior}</p>
             </div>
           </Card>
           <Card className="flex flex-col gap-6">
             <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2 flex items-center gap-2"><Ghost className="w-4 h-4"/> Defense Mechanism</h3>
                <p className="text-xl font-bold text-slate-800">{defenseMechanism}</p>
             </div>
             <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Hidden Fear</h3>
                <p className="text-xl font-bold text-slate-800">{hiddenFear}</p>
             </div>
           </Card>
        </motion.div>

        {/* Flags */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="bg-emerald-50/50 border-emerald-100">
             <h3 className="text-xs uppercase font-bold text-emerald-600 tracking-widest mb-4">Green Flag Score</h3>
             <div className="flex items-end gap-2 mb-2">
               <span className="text-5xl font-black text-emerald-600">{greenFlagScore}%</span>
             </div>
             <p className="text-emerald-700/70 font-medium text-sm">Your healthiest emotional trait.</p>
           </Card>
           <Card className="bg-rose-50/50 border-rose-100">
             <h3 className="text-xs uppercase font-bold text-rose-600 tracking-widest mb-4">Red Flag Risk</h3>
             <div className="flex items-end gap-2 mb-2">
               <span className="text-5xl font-black text-rose-600">{redFlagRisk}%</span>
             </div>
             <p className="text-rose-700/70 font-medium text-sm">Your most toxic blind spot.</p>
           </Card>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 mb-20 relative z-10"
      >
        <button 
          onClick={handleShare}
          className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {copied ? 'Copied Link!' : 'Share Result'}
        </button>
        <button 
          onClick={() => { resetGame(); window.location.search = ''; }}
          className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center gap-2 hover:shadow-sm"
        >
          <RefreshCcw className="w-5 h-5" />
          Retake Simulation
        </button>
      </motion.div>
    </div>
  );
}
