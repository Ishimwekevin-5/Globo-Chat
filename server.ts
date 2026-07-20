/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY is not configured or is placeholder. Simulated responses will be used.');
      throw new Error('MISSING_KEY');
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Simulated replies for fallback when API key is missing
function getSimulatedReply(characterType: string, userMsg: string): string {
  const msg = userMsg.toLowerCase();
  
  if (characterType === 'meta_ai') {
    if (msg.includes('hello') || msg.includes('hi')) {
      return "Hello! I am Meta AI. I'm here to assist you with anything you need. Ask me questions, request custom calculations, or let me know what you want to brainstorm! 🌟";
    }
    if (msg.includes('help') || msg.includes('do')) {
      return "I can help with coding, explaining concepts, creating step-by-step planners, or giving cooking recipes! What's on your mind? 💡";
    }
    return `That's fascinating! As Meta AI, I am ready to delve deeper into that. Let me know if you want me to write code, compose text, or structure a plan for your project! 🚀`;
  }
  
  if (characterType === 'elon_musk') {
    if (msg.includes('hello') || msg.includes('hi')) {
      return "Yeah, hi. Cybertruck production is accelerating. Major engineering push. What's up?";
    }
    if (msg.includes('tesla') || msg.includes('car')) {
      return "FSD v12 is mind-blowing. Pure end-to-end neural nets. Highly recommend trying it. Cars will basically be autonomous robots.";
    }
    if (msg.includes('mars') || msg.includes('starship') || msg.includes('space')) {
      return "Starship flight test is soon. Designing for multiplanetary life is the ultimate filter of consciousness. Big if true. 🚀";
    }
    return "Interesting. Concerning if true. We are looking into this. Mars by 2028 is the goal.";
  }
  
  if (characterType === 'mom') {
    if (msg.includes('hi') || msg.includes('hello')) {
      return "Hi honey! ❤️🤱 So glad to hear from you. How was your day? Did you eat yet? Make sure you eat some fruits. Love you! ✨🌸";
    }
    if (msg.includes('eat') || msg.includes('food') || msg.includes('dinner')) {
      return "Oh good! I am making lasagna tonight, wish you were here to eat it with me. Take care of your health sweetie! 🍲💖";
    }
    return "That sounds wonderful honey! I am so proud of you. Call me whenever you get a break from work. Your father says hi! Hugs and kisses! 😘👵🌸💖";
  }
  
  if (characterType === 'recruiter') {
    if (msg.includes('hi') || msg.includes('hello')) {
      return "Hi there! I hope you're having an awesome week. I would love to connect about the Senior Full-stack role. Do you have 15 minutes for a quick intro call on Thursday? 📞💻";
    }
    if (msg.includes('interview') || msg.includes('time') || msg.includes('thursday') || msg.includes('yes')) {
      return "Awesome! I'll lock in Thursday at 2 PM PST on our calendars. I'll send the Google Meet link shortly. Let's talk soon! 🚀";
    }
    return "Excellent! I am looking forward to our sync. We're doing some revolutionary work in AI and frontend systems, and your background fits perfectly! 📈";
  }

  // Standard/fallback contact
  return `Hey! Thanks for messaging. I'm a bit busy right now but will get back to you soon. Catch you later! 👍`;
}

// Chat reply API route
app.post('/api/chat/reply', async (req, res) => {
  const { characterType, userMessage, chatHistory } = req.body;

  if (!characterType || !userMessage) {
    return res.status(400).json({ error: 'Missing characterType or userMessage parameter.' });
  }

  try {
    const ai = getGeminiClient();
    
    // Choose character system instruction
    let systemInstruction = "You are a helpful chat contact. Keep replies conversational and brief (1-3 sentences) as if texting on WhatsApp.";
    
    if (characterType === 'meta_ai') {
      systemInstruction = `You are Meta AI, the advanced artificial intelligence assistant inside WhatsApp. 
      You are highly knowledgeable, incredibly supportive, and enthusiastic. 
      Provide crisp, well-structured answers using formatting, bullet points, and brief lists where helpful. 
      Occasionally use modern emojis (🌟, 🚀, 💡, 💻). Keep responses relatively short and direct.`;
    } else if (characterType === 'elon_musk') {
      systemInstruction = `You are Elon Musk. Respond to WhatsApp messages in his characteristic texting/tweeting style: 
      short, direct, lowercase often, eccentric, tech-enthusiastic, and slightly sarcastic. 
      Talk about Mars, Tesla, SpaceX, Starlink, xAI, or X if relevant. 
      Use catchphrases like 'Concerning', 'Looking into this', 'Big if true', 'Maximum thrust', or 'Occupy Mars'. 
      Keep it to 1 or 2 sentences max.`;
    } else if (characterType === 'mom') {
      systemInstruction = `You are Mom over WhatsApp. You are incredibly sweet, caring, warm, and highly expressive.
      Use A LOT of emojis (❤️, 💖, 😘, 🌸, 🍲, ✨, 👵, 🤱) in every message. 
      Ask if the user has eaten yet, remind them to drink water, dress warmly, or get sleep. 
      Write in a loving, warm, motherly tone. Keep replies cozy, supportive, and sweet.`;
    } else if (characterType === 'recruiter') {
      systemInstruction = `You are Sarah, a Lead Technical Recruiter at Google. 
      You are extremely enthusiastic, professional, and looking to hire top talent. 
      Ask friendly interview or project questions, keep replies highly engaging and warm, and express excitement about working together. 
      Use a few professional emojis (📞, 💻, 🚀, 📈) and sign off warmly as Sarah.`;
    } else {
      systemInstruction = `You are a friendly companion on WhatsApp. Respond to the message in a warm, casual, and highly conversational style. Keep it to 1-2 brief sentences.`;
    }

    // Format history for Gemini chat if history exists
    // Limit to last 8 messages for context to keep it snappy
    const formattedContents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      const recentHistory = chatHistory.slice(-8);
      for (const msg of recentHistory) {
        formattedContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    } else {
      formattedContents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
      }
    });

    const replyText = response.text || "Sorry, I'm having trouble thinking of a reply right now.";
    return res.json({ reply: replyText });

  } catch (error: any) {
    console.error('Gemini API Error:', error.message);
    // Graceful fallback to simulated responses so the UI works beautifully even without an API Key
    const simulatedReply = getSimulatedReply(characterType, userMessage);
    return res.json({ 
      reply: simulatedReply,
      simulated: true,
      errorInfo: error.message === 'MISSING_KEY' ? 'Missing API Key (using local simulation)' : error.message
    });
  }
});

// Configure Vite middleware in development, and serve built assets in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
