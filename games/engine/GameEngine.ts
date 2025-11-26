// File: games/engine/GameEngine.ts
// TypeScript: Generic game loop + state management used by individual game logic modules.

type EngineState = {
  time: number;
  score: number;
  lives: number;
  level?: number;
  isRunning: boolean;
};

type EventHandler = (payload?: any) => void;

export class GameEngine {
  private gameId: string;
  private state: EngineState;
  private intervalId: number | null = null;
  private tickRate = 1000; // tick every second (game-specific modules may use rAF)
  private listeners: Map<string, EventHandler[]> = new Map();
  private mounted = false;
  private gameModule: any = null; // will import per game

  constructor(gameId: string) {
    this.gameId = gameId;
    this.state = {
      time: 60,
      score: 0,
      lives: 3,
      level: 1,
      isRunning: false
    };

    this.loadModule();
  }

  async loadModule() {
    try {
      // Look for module in global registry
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const registry = (window as any).GameModules;
      if (registry && registry[this.gameId]) {
        this.gameModule = registry[this.gameId];
        // Allow module to initialize with engine API
        this.gameModule.init?.(this.api());
      } else {
        console.warn(`Game module ${this.gameId} not found in registry`);
      }
    } catch (err) {
      console.warn("Game module load failed:", err);
    }
  }

  // Simple event emitter
  on(event: string, cb: EventHandler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  emit(event: string, payload?: any) {
    const arr = this.listeners.get(event) || [];
    arr.forEach((cb) => cb(payload));
  }

  api() {
    return {
      getState: () => ({ ...this.state }),
      addScore: (pts: number) => this.addScore(pts),
      loseLife: () => this.loseLife(),
      requestHint: (ctx: any) => this.requestHint(ctx),
      finish: (win: boolean) => this.finish(win),
      saveProgress: () => this.saveProgress(),
      mountTo: (container: HTMLElement) => this.mount(container),
      triggerEvent: (name: string, data?: any) => this.emit(name, data)
    };
  }

  mount(container: HTMLElement) {
    if (this.mounted) return;
    // Let game module mount itself into container
    if (this.gameModule?.mount) {
      this.gameModule.mount(container, this.api());
    } else {
      // default fallback
      const canvas = document.createElement("canvas");
      canvas.width = container.clientWidth || 800;
      canvas.height = container.clientHeight || 600;
      canvas.className = "w-full h-full";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f3f3f3";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#333";
        ctx.font = "20px Inter, sans-serif";
        ctx.fillText("Module not loaded for " + this.gameId, 20, 50);
      }
    }

    this.mounted = true;
  }

  start() {
    if (this.state.isRunning) return;
    this.state.isRunning = true;
    
    // Check if module is loaded, if not try again (race condition fix)
    if (!this.gameModule) this.loadModule();

    this.gameModule?.start?.(this.api());

    this.intervalId = window.setInterval(() => this.tick(), this.tickRate);
    this.emit("tick", this.state);
  }

  tick() {
    if (!this.state.isRunning) return;
    // decrement time
    this.state.time -= 1;
    // allow module to run a tick
    this.gameModule?.tick?.(this.api());
    this.emit("tick", this.state);

    if (this.state.time <= 0 || this.state.lives <= 0) {
      this.finish(false);
    }
  }

  pause() {
    this.state.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit("tick", this.state);
  }

  resume() {
    if (this.state.isRunning) return;
    this.state.isRunning = true;
    this.intervalId = window.setInterval(() => this.tick(), this.tickRate);
  }

  reset() {
    this.state.time = 60;
    this.state.score = 0;
    this.state.lives = 3;
    this.state.level = 1;
    this.emit("tick", this.state);
    this.gameModule?.reset?.(this.api());
  }

  addScore(pts: number) {
    this.state.score += pts;
    this.emit("tick", this.state);
  }

  loseLife() {
    this.state.lives -= 1;
    this.emit("tick", this.state);
    if (this.state.lives <= 0) this.finish(false);
  }

  requestHint(context?: any) {
    this.emit("hintRequest", { ...context, gameId: this.gameId, state: this.state });
  }

  finish(win: boolean) {
    this.pause();
    this.gameModule?.finish?.(this.api(), win);
    this.emit("gameover", { outcome: win ? "win" : "lose", state: this.state });
    this.saveProgress();
  }

  saveProgress() {
    try {
      const key = "game_history";
      const raw = localStorage.getItem(key);
      const all = raw ? JSON.parse(raw) : {};
      all[this.gameId] = {
        lastScore: this.state.score,
        bestScore: Math.max(this.state.score, all?.[this.gameId]?.bestScore || 0),
        plays: (all?.[this.gameId]?.plays || 0) + 1,
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(all));
    } catch (err) {
      console.warn("Save progress failed", err);
    }
  }

  exit() {
    this.pause();
    this.emit("exit");
  }

  destroy() {
    this.pause();
    this.listeners.clear();
    this.gameModule?.destroy?.();
  }
}