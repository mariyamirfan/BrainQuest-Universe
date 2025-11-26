// File: games/engine/difficultyEngine.ts
// TypeScript: Manage adaptive difficulty based on player performance.

export class DifficultyEngine {
  private difficulty = 1; // 1 = easy, 2 = medium, 3 = hard
  private performanceWindow: number[] = []; // recent scores or success rates

  constructor(private maxWindow = 5) {}

  recordPerformance(value: number) {
    this.performanceWindow.push(value);
    if (this.performanceWindow.length > this.maxWindow) {
      this.performanceWindow.shift();
    }
    this.recalculate();
  }

  private recalculate() {
    if (this.performanceWindow.length === 0) return;
    const avg = this.performanceWindow.reduce((a, b) => a + b, 0) / this.performanceWindow.length;
    // simple heuristic: if avg is high, increase difficulty; if low, decrease
    if (avg > 0.8) this.difficulty = Math.min(3, this.difficulty + 1);
    else if (avg < 0.4) this.difficulty = Math.max(1, this.difficulty - 1);
    // otherwise keep
  }

  getDifficulty() {
    return this.difficulty;
  }

  // Adjust numeric values for game modules
  getMultiplier() {
    return 1 + (this.difficulty - 1) * 0.5; // easy=1.0, med=1.5, hard=2.0
  }
}