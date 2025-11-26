// File: games/engine/GameUI.tsx
import React, { useEffect, useRef, useState } from "react";
import { GameEngine } from "./GameEngine";
import { SoundManager } from "./soundManager";
import { AIHintAgent } from "./aiHintAgent";
import GameOver from "./GameOver";

interface GameUIProps {
  gameId: string; // e.g., 'sliding-puzzle'
  width?: number; // preferred canvas width
  height?: number;
  onExit?: () => void;
  onFinish?: (score: number) => void; // Sync with main app
}

const GameUI: React.FC<GameUIProps> = ({ gameId, width = 800, height = 600, onExit, onFinish }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [engine] = useState(() => new GameEngine(gameId));
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showGameOver, setShowGameOver] = useState(false);
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);
  const aiAgentRef = useRef(new AIHintAgent(gameId));

  // Initialize engine once
  useEffect(() => {
    engine.on("tick", (state) => {
      setTime(state.time);
      setScore(state.score);
      setLives(state.lives);
    });

    engine.on("gameover", (result) => {
      setOutcome(result.outcome);
      setShowGameOver(true);
      setRunning(false);
      SoundManager.play(result.outcome === "win" ? "win" : "lose");
      if (onFinish) onFinish(result.state.score);
    });

    engine.on("hintRequest", async (payload) => {
      const hint = await aiAgentRef.current.requestHint(payload);
      SoundManager.play("hint");
      alert(`💡 Hint: ${hint.text}`);
    });

    // Mount engine to DOM
    if (containerRef.current) {
        // Find or create stage
        const stage = containerRef.current.querySelector('.game-stage') as HTMLElement;
        if (stage) engine.mount(stage);
    }

    // Responsive scaling
    const resize = () => {
      const el = containerRef.current;
      if (!el) return;
      const parentWidth = el.clientWidth;
      const scale = Math.min(1, parentWidth / width);
      const canvas = el.querySelector(".game-canvas") as HTMLElement | null;
      if (canvas) canvas.style.setProperty("transform", `scale(${scale})`);
    };

    window.addEventListener("resize", resize);
    // Delay resize slightly to ensure DOM is ready
    setTimeout(resize, 100);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      engine.destroy();
    };
  }, [engine, width, onFinish]);

  // UI controls
  const handleStart = () => {
    SoundManager.play("start");
    engine.start();
    setRunning(true);
    setShowGameOver(false);
  };

  const handlePause = () => {
    engine.pause();
    setRunning(false);
    SoundManager.play("pause");
  };

  const handleResume = () => {
    engine.resume();
    setRunning(true);
    SoundManager.play("resume");
  };

  const handleRequestHint = () => {
    engine.requestHint({ score, time, lives });
  };

  const handleExit = () => {
      engine.exit();
      onExit?.();
  };

  return (
    <div className="game-wrapper dark:bg-dark-surface dark:border-dark-border" ref={containerRef}>
      <div className="game-header">
        <div className="game-info">
          <div>Score: <strong className="text-brand-600 dark:text-brand-400">{score}</strong></div>
          <div>Time: <strong className={time < 10 ? 'text-red-500' : 'dark:text-white'}>{time}s</strong></div>
          <div>Lives: <strong className="dark:text-white">{lives}</strong></div>
        </div>

        <div className="game-controls">
          {!running ? (
            <button className="btn" onClick={handleStart}>{time < 60 && time > 0 ? "Resume" : "Start"}</button>
          ) : (
            <button className="btn" onClick={handlePause}>Pause</button>
          )}
          <button className="btn" onClick={handleRequestHint}>Hint</button>
          <button className="btn ghost" onClick={() => { engine.saveProgress(); SoundManager.play("save"); alert("Game Saved!"); }}>Save</button>
          <button className="btn link" onClick={handleExit}>Exit</button>
        </div>
      </div>

      <div className="game-stage bg-gray-100 dark:bg-gray-800/50">
         {/* Engine mounts here */}
      </div>

      <GameOver 
        visible={showGameOver} 
        outcome={outcome} 
        score={score} 
        onRestart={() => { engine.reset(); handleStart(); setShowGameOver(false); }} 
        onExit={handleExit} 
      />
    </div>
  );
};

export default GameUI;