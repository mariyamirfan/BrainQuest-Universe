// File: services/systems.ts
import { User, Achievement, GameHistory, MiniReward } from '../types';
import { ACHIEVEMENTS, LEVEL_THRESHOLDS } from '../constants';

// --- XP & Leveling System ---
export const XPSystem = {
  calculateLevel(xp: number): number {
    // Find the highest level threshold that XP exceeds
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
      }
    }
    return level;
  },

  getLevelProgress(xp: number): number {
    const level = this.calculateLevel(xp);
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || (currentThreshold + 1000);
    
    return Math.floor(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
  }
};

// --- Achievement System ---
export const AchievementSystem = {
  checkAchievements(user: User, lastGame: { gameId: string, score: number }): Achievement[] {
    const unlocked: Achievement[] = [];

    // 1. First Blood (Win any game)
    if (!user.achievements.includes('first-win') && lastGame.score > 0) {
       const ach = ACHIEVEMENTS.find(a => a.id === 'first-win');
       if (ach) unlocked.push(ach);
    }

    // 2. Math Whiz
    if (lastGame.gameId === 'quick-math' && lastGame.score >= 50 && !user.achievements.includes('math-whiz')) {
        const ach = ACHIEVEMENTS.find(a => a.id === 'math-whiz');
        if (ach) unlocked.push(ach);
    }

    // 3. Strategist
    if (lastGame.gameId === 'tic-tac-toe' && lastGame.score >= 100 && !user.achievements.includes('strategist')) {
         // Simple check: if they score 100 (win value), they get it. 
         // Real app would track total wins in stats.
         const ach = ACHIEVEMENTS.find(a => a.id === 'strategist');
         if (ach) unlocked.push(ach);
    }

    return unlocked;
  }
};

// --- Reward System ---
export const RewardSystem = {
    grantMiniReward(type: 'diamond' | 'coin' | 'token', amount: number, currentRewards: MiniReward[]): MiniReward[] {
        const rewards = [...currentRewards];
        const existing = rewards.find(r => r.type === type);
        if (existing) {
            existing.amount += amount;
        } else {
            rewards.push({ type, amount });
        }
        return rewards;
    }
};