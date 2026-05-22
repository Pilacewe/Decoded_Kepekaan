import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Init Gemini
  const getAi = () => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    return new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  };

  // Endpoint to generate a scenario
  app.post('/api/scenario', async (req, res) => {
    try {
      const ai = getAi();
      const { mode, currentChapter, currentLevel, previousChoices } = req.body;

      const prompt = `You are a cinematic storyteller, senior game designer, and Gen-Z psychology experience designer. 
Generate a scenario for the social simulation game "Decode" in mode: ${mode}.
Current Level: ${currentLevel}
Current Chapter: ${currentChapter}
Previous choices: ${JSON.stringify(previousChoices)}

ESCALATION SYSTEM:
- Level 1-2: Light tension, early signs.
- Level 3-4: Awkwardness, mixed confusing signals, direct dilemma, passive aggressiveness.
- Level 5-6: Climax, emotional trap, heavy overthinking.
- Level 7+: Peak chaos, make or break, extremely toxic or deeply vulnerable.

MODE INSTRUCTIONS:
- IF mode is "friendship": Focus ONLY on platonic friends, tongkrongan drama, fake friends, betrayal. NO romance.
- IF mode is "relationship" or "red_flag": Focus on mixed signals, situationships, jealousy, passive aggressiveness.
- IF mode is "chat_decode": Focus on dry texts, hidden meanings.
- IF mode is "tongkrongan": Absurd, chaotic, awkward group dilemmas.

The scenario MUST be very complex, highly detailed, dramatic, immersive, and unpredictable. Use Gen Z context (TikTok reposts, IG close friends, Spotify blends, dry texts, read receipts). 
DO NOT repeat scenarios. Every level and chapter must be unique and escalate in intensity, reacting strictly to previous choices.

UI Type MUST be one of: "whatsapp", "instagram_story", "imessage", "tiktok", "spotify", or "standard".

If UI Type is "whatsapp" or "imessage", provide 'chat_messages' (array of objects with sender 'them' or 'me', and 'text').
If UI Type is "instagram_story", provide 'story_scene' (object with 'image_desc', 'caption', 'is_close_friends' boolean).
If UI Type is "tiktok", provide 'tiktok_scene' (object with 'video_desc', 'caption', 'action').
If UI Type is "spotify", provide 'spotify_scene' (object with 'action_desc', 'song_name').

Provide exactly 4 highly realistic Gen-Z choices (toxic, chaotic, overthinking, manipulative, mature). DO NOT be formal or textbook.
Also provide 'metrics_impact' showing how this affects tension (stress up to 100, overthinking up to 100, xp gained).

Format strictly as JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              ui_type: { type: Type.STRING },
              context: { type: Type.STRING },
              chat_messages: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { sender: { type: Type.STRING }, text: { type: Type.STRING } } 
                } 
              },
              story_scene: {
                type: Type.OBJECT,
                properties: { image_desc: { type: Type.STRING }, caption: { type: Type.STRING }, is_close_friends: { type: Type.BOOLEAN } }
              },
              tiktok_scene: {
                type: Type.OBJECT,
                properties: { video_desc: { type: Type.STRING }, caption: { type: Type.STRING }, action: { type: Type.STRING } }
              },
              spotify_scene: {
                type: Type.OBJECT,
                properties: { action_desc: { type: Type.STRING }, song_name: { type: Type.STRING } }
              },
              question: { type: Type.STRING },
              choices: { type: Type.ARRAY, items: { type: Type.STRING } },
              metrics_impact: {
                type: Type.OBJECT,
                properties: { stress: { type: Type.NUMBER }, overthinking: { type: Type.NUMBER }, xp: { type: Type.NUMBER } }
              }
            },
            required: ["title", "ui_type", "context", "question", "choices", "metrics_impact"]
          }
        }
      });
      res.json(JSON.parse(response.text || '{}'));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Endpoint to generate final personality reveal
  app.post('/api/result', async (req, res) => {
    try {
      const ai = getAi();
      const { mode, choices } = req.body;

      const prompt = `You are a Gen Z psychology-based experience designer.
Analyze the following choices made by the player in mode ${mode}:
${JSON.stringify(choices)}

Generate a Cinematic Emotional Archetype result profile. Titles MUST be funny, shareable, and painful but relatable (e.g., "👻 Hantu Last Seen", "🧊 CEO Silent Treatment", "☕ Tukang Ngetes Tanpa Ngomong", "🌧️ Overthinking FM").
Provide deep, reading, emotionally accurate analysis.

Format strictly to JSON:
- archetype (string)
- quote (string)
- loveLanguage (object: qualityTime, actsOfService, wordsOfAffirmation, physicalTouch, receivingGifts - values 0-100 that sum to 100)
- emotionalAwareness (number 0-100)
- relationshipSensitivity (number 0-100)
- communicationStyle (string)
- attachmentStyle (string, modern name. e.g. Anxious Reassurer)
- socialBattery (string)
- overthinkingMeter (number 0-100)
- greenFlagScore (number 0-100)
- redFlagRisk (number 0-100)
- conflictBehavior (string)
- textingPersonality (string)
- defenseMechanism (string)
- hiddenFear (string)
- aiLore (string, a deep psychological roasting/explanation making them say "anjir ini bener banget")
- colorTheme (string, e.g. "rainy blue", "peach pink", "warm cream", "dark slate", "lavender", "emerald")`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              archetype: { type: Type.STRING },
              quote: { type: Type.STRING },
              loveLanguage: {
                type: Type.OBJECT,
                properties: {
                  qualityTime: { type: Type.NUMBER },
                  actsOfService: { type: Type.NUMBER },
                  wordsOfAffirmation: { type: Type.NUMBER },
                  physicalTouch: { type: Type.NUMBER },
                  receivingGifts: { type: Type.NUMBER }
                }
              },
              emotionalAwareness: { type: Type.NUMBER },
              relationshipSensitivity: { type: Type.NUMBER },
              communicationStyle: { type: Type.STRING },
              attachmentStyle: { type: Type.STRING },
              socialBattery: { type: Type.STRING },
              overthinkingMeter: { type: Type.NUMBER },
              greenFlagScore: { type: Type.NUMBER },
              redFlagRisk: { type: Type.NUMBER },
              conflictBehavior: { type: Type.STRING },
              textingPersonality: { type: Type.STRING },
              defenseMechanism: { type: Type.STRING },
              hiddenFear: { type: Type.STRING },
              aiLore: { type: Type.STRING },
              colorTheme: { type: Type.STRING }
            },
            required: ["archetype", "quote", "loveLanguage", "emotionalAwareness", "relationshipSensitivity", "communicationStyle", "attachmentStyle", "socialBattery", "overthinkingMeter", "greenFlagScore", "redFlagRisk", "conflictBehavior", "textingPersonality", "defenseMechanism", "hiddenFear", "aiLore", "colorTheme"]
          }
        }
      });
      res.json(JSON.parse(response.text || '{}'));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
  }

  app.use(async (req, res, next) => {
    if ((req.path === '/' || req.path === '/index.html') && req.query.share) {
      try {
        const shareParam = req.query.share as string;
        // Parse safely handling unicode
        const dataStr = Buffer.from(shareParam, 'base64').toString('utf-8');
        const data = JSON.parse(decodeURIComponent(dataStr));
        
        const title = `Decode: ${data.archetype}`;
        const description = `"${data.quote}" | Find out your emotional archetype on Decode.`;
        const safeArchetype = encodeURIComponent(data.archetype || 'Result');
        const imageUrl = `https://placehold.co/1200x630/1e293b/ffffff.png?text=Decode:+${safeArchetype}`;

        let indexHtml = '';
        if (process.env.NODE_ENV !== 'production') {
          const fs = require('fs');
          indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
          indexHtml = await vite.transformIndexHtml(req.originalUrl, indexHtml);
        } else {
          const fs = require('fs');
          indexHtml = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8');
        }

        const ogTags = `
          <title>${title}</title>
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="twitter:card" content="summary_large_image" />
        `;
        indexHtml = indexHtml.replace('</head>', `${ogTags}</head>`);
        
        res.send(indexHtml);
        return;
      } catch (e) {
        console.error("Error processing share URL:", e);
        next();
      }
    } else {
      next();
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
