/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { useGameStore } from './store';
import { ModeSelection } from './components/ModeSelection';
import { LevelSelection } from './components/LevelSelection';
import { Gameplay } from './components/Gameplay';
import { ResultView } from './components/ResultView';

export default function App() {
  const { view } = useGameStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-200">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen relative"
          >
            <ModeSelection />
          </motion.div>
        )}

        {view === 'levels' && (
          <motion.div
            key="levels"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen relative"
          >
            <LevelSelection />
          </motion.div>
        )}

        {view === 'gameplay' && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <Gameplay />
          </motion.div>
        )}

        {view === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="min-h-screen"
          >
            <ResultView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
