// File: games/engine/aiHintAgent.ts
import { generateHint } from '../../services/geminiService';

export class AIHintAgent {
  private gameId: string;
  
  constructor(gameId: string) {
    this.gameId = gameId;
  }

  async requestHint(context: any): Promise<{ text: string; confidence?: number; emotion?: string }> {
    // Prepare a helpful hint prompt.
    const prompt = `Game: ${this.gameId}. 
    Current State: Score ${context.score}, Time ${context.time}.
    The user is stuck and needs a hint.`;

    try {
      // Reuse the existing Gemini service
      const text = await generateHint(prompt);
      
      // We return a structured object, but generateHint just returns string.
      // We'll mock the confidence/emotion for now.
      return { text: text, confidence: 0.9, emotion: "encouraging" };
    } catch (err) {
      console.warn("AI hint failed", err);
      return { text: "Don't give up! You can do it!", confidence: 0.5, emotion: "supportive" };
    }
  }
}