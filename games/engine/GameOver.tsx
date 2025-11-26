// File: games/engine/GameOver.tsx
import React from "react";

interface Props {
  visible: boolean;
  outcome: "win" | "lose" | null;
  score: number;
  onRestart: () => void;
  onExit: () => void;
}

const GameOver: React.FC<Props> = ({ visible, outcome, score, onRestart, onExit }) => {
  if (!visible) return null;

  return (
    <div className="g-over-overlay animate-in fade-in duration-300">
      <div className="g-over-panel animate-in zoom-in-95 duration-300 dark:bg-dark-surface dark:text-white">
        <h2 className="text-2xl font-bold mb-2">{outcome === "win" ? "You Win! 🎉" : "Game Over"}</h2>
        <p className="mb-4">Your score: <strong className="text-brand-500">{score}</strong></p>
        <div className="g-over-actions">
          <button className="btn" onClick={onRestart}>{outcome === "win" ? "Play Next" : "Retry"}</button>
          <button className="btn ghost dark:text-white dark:border-gray-700" onClick={onExit}>Exit</button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;