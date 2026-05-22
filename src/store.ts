import { create } from 'zustand';

export type GameMode = 'relationship' | 'friendship' | 'chat_decode' | 'chaos' | 'tongkrongan' | null;
export type GameView = 'home' | 'levels' | 'gameplay' | 'result';

export const LEVEL_CONFIG: Record<number, { title: string; chapters: number; description: string }> = {
  1: { title: "Light Tension", chapters: 3, description: "Early signs and mixed signals." },
  2: { title: "Awkward Silence", chapters: 4, description: "Unspoken boundaries tested." },
  3: { title: "The Dilemma", chapters: 4, description: "Passive aggressiveness arises." },
  4: { title: "Overthinking Peak", chapters: 5, description: "Mind games and social media chaos." },
  5: { title: "Emotional Trap", chapters: 5, description: "The turning point of the connection." },
  6: { title: "Vulnerability", chapters: 6, description: "Breaking down the walls." },
  7: { title: "The Verdict", chapters: 6, description: "Final emotional confrontation." }
};

export interface Choice {
  questionId: string;
  response: string;
}

export interface Scenario {
  title: string;
  ui_type: 'whatsapp' | 'instagram_story' | 'imessage' | 'tiktok' | 'spotify' | 'standard';
  context: string;
  chat_messages?: { sender: 'them' | 'me'; text: string }[];
  story_scene?: { image_desc: string; caption: string; is_close_friends?: boolean };
  tiktok_scene?: { video_desc: string; caption: string; action: string };
  spotify_scene?: { action_desc: string; song_name: string };
  question: string;
  choices: string[];
  metrics_impact: {
    stress: number;
    overthinking: number;
    xp: number;
  };
}

interface GameState {
  view: GameView;
  mode: GameMode;
  currentLevel: number;
  currentChapter: number;
  completedLevels: number[];
  scenarios: Scenario[];
  choices: Choice[];
  isLoadingScenario: boolean;
  result: any | null;
  playerStats: { stress: number; overthinking: number; xp: number; level: number };
  
  setView: (view: GameView) => void;
  setMode: (mode: GameMode) => void;
  startLevel: (level: number) => void;
  completeLevel: () => void;
  nextChapter: (choice: string) => void;
  setScenario: (scenario: Scenario) => void;
  setLoading: (loading: boolean) => void;
  setResult: (result: any) => void;
  resetGame: () => void;
}

let initialResult = null;
let initialMode = null;
let initialView: GameView = 'home';
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const shareData = params.get('share');
  if (shareData) {
    try {
      const decodedStr = decodeURIComponent(escape(atob(shareData)));
      initialResult = JSON.parse(decodedStr);
      initialMode = 'relationship';
      initialView = 'result';
    } catch(e) {
      console.error("Failed to parse shared result");
    }
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  view: initialView,
  mode: initialMode as GameMode,
  currentLevel: 1,
  currentChapter: 1,
  completedLevels: [],
  scenarios: [],
  choices: [],
  isLoadingScenario: false,
  result: initialResult,
  playerStats: { stress: 0, overthinking: 0, xp: 0, level: 1 },

  setView: (view) => set({ view }),
  setMode: (mode) => set({ mode, view: 'levels', currentLevel: 1, currentChapter: 1, completedLevels: [], choices: [], scenarios: [], result: null, playerStats: { stress: 0, overthinking: 0, xp: 0, level: 1 } }),
  
  startLevel: (level) => set({ currentLevel: level, currentChapter: 1, scenarios: [], view: 'gameplay' }),
  
  completeLevel: () => {
    const { currentLevel, completedLevels } = get();
    const newCompleted = completedLevels.includes(currentLevel) ? completedLevels : [...completedLevels, currentLevel];
    set({ completedLevels: newCompleted, view: 'levels' });
  },

  nextChapter: (choice) => {
    const { scenarios, playerStats } = get();
    // Save choice
    const currentScenario = scenarios[scenarios.length - 1];
    const impact = currentScenario.metrics_impact;
    const newXp = playerStats.xp + (impact.xp || 15);
    set((state) => ({
      choices: [...state.choices, { questionId: currentScenario.title, response: choice }],
      currentChapter: state.currentChapter + 1,
      playerStats: {
        stress: Math.max(0, Math.min(100, state.playerStats.stress + (impact.stress || 5))),
        overthinking: Math.max(0, Math.min(100, state.playerStats.overthinking + (impact.overthinking || 5))),
        xp: newXp,
        level: Math.floor(newXp / 100) + 1
      }
    }));
  },

  setScenario: (scenario) => set((state) => ({ scenarios: [...state.scenarios, scenario] })),
  setLoading: (isLoadingScenario) => set({ isLoadingScenario }),
  setResult: (result) => set({ result, view: 'result' }),
  resetGame: () => set({ mode: null, view: 'home', currentLevel: 1, currentChapter: 1, completedLevels: [], choices: [], scenarios: [], result: null, playerStats: { stress: 0, overthinking: 0, xp: 0, level: 1 } })
}));
