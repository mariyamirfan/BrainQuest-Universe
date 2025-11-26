import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHint = async (gameContext: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are Codey, the friendly AI mascot of BrainQuest Universe. 
    The player needs a hint!
    Context: ${gameContext}
    
    Give a short, helpful, and super encouraging hint. Use emojis!`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "You got this! Try a different angle! 🚀";
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to my brain, but I believe in you! 🤖";
  }
};

export const chatWithAI = async (history: ChatMessage[], newMessage: string, userStats: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct history for context (simplifying to last 10 messages for token efficiency)
    const recentHistory = history.slice(-10);
    const historyString = recentHistory.map(m => `${m.role === 'user' ? 'User' : 'Codey'}: ${m.text}`).join('\n');

    const prompt = `
    System: You are Codey, the AI mascot of BrainQuest Universe. 
    Personality: Cheerful, intelligent, supportive, loves games, uses emojis.
    Goal: Help the user with the website, give game tips, or just chat about brain training.
    
    User Stats: ${userStats}
    
    Conversation History:
    ${historyString}
    
    User: ${newMessage}
    
    Codey: (Respond naturally, keep it concise unless asked for a tutorial, be fun!)`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I didn't quite catch that, but I'm happy you're here! 🌟";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "My circuits are a bit busy. Try again in a moment! ⚡";
  }
};
