
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../components/UIComponents';
import GameUI from './engine/GameUI';
import './modules/slidingPuzzle'; // Register the module

interface GameProps {
  onGameOver: (score: number) => void;
  isActive: boolean;
}

// --- 1. Quick Math Game ---
export const QuickMathGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
  const [problem, setProblem] = useState({ q: '2 + 2', a: 4 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [input, setInput] = useState('');

  const generateProblem = useCallback(() => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const n1 = Math.floor(Math.random() * 12) + 1;
    const n2 = Math.floor(Math.random() * 12) + 1;
    let q = '', a = 0;
    
    if (op === '+') { q = `${n1} + ${n2}`; a = n1 + n2; }
    else if (op === '-') { 
      const max = Math.max(n1, n2); 
      const min = Math.min(n1, n2); 
      q = `${max} - ${min}`; a = max - min; 
    }
    else { q = `${n1} × ${n2}`; a = n1 * n2; }
    
    setProblem({ q, a });
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, score, onGameOver]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (parseInt(input) === problem.a) {
      setScore(s => s + 10);
      setInput('');
      generateProblem();
    } else {
      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md mx-auto">
      <div className="flex justify-between w-full text-lg font-bold">
        <span>Score: {score}</span>
        <span className={`${timeLeft < 10 ? 'text-red-500' : ''}`}>Time: {timeLeft}s</span>
      </div>
      <div className="bg-white dark:bg-dark-surface p-12 rounded-3xl shadow-lg w-full text-center">
        <h2 className="text-5xl font-bold mb-8 dark:text-white">{problem.q}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-center text-3xl p-4 border-b-2 border-brand-500 bg-transparent outline-none dark:text-white"
            placeholder="?"
            autoFocus
          />
        </form>
      </div>
      <p className="text-gray-500 dark:text-gray-400">Press Enter to submit</p>
    </div>
  );
};

// --- 2. Tic Tac Toe ---
export const TicTacToeGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      setTimeout(() => onGameOver(win === 'X' ? 100 : 50), 1000);
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
      setTimeout(() => onGameOver(25), 1000);
    } else {
      setXIsNext(!xIsNext);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-6 dark:text-white">
        {winner ? `Winner: ${winner}` : `Next Player: ${xIsNext ? 'X' : 'O'}`}
      </h3>
      <div className="grid grid-cols-3 gap-2 bg-gray-300 dark:bg-gray-700 p-2 rounded-xl">
        {board.map((val, i) => (
          <button
            key={i}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-dark-surface text-4xl font-bold flex items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => handleClick(i)}
            style={{ color: val === 'X' ? '#0ea5e9' : '#ec4899' }}
          >
            {val}
          </button>
        ))}
      </div>
      <Button className="mt-8" onClick={() => { setBoard(Array(9).fill(null)); setWinner(null); setXIsNext(true); }}>
        Reset Board
      </Button>
    </div>
  );
};

// --- 3. Memory Pairs ---
export const MemoryGame: React.FC<GameProps> = ({ onGameOver }) => {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  const [cards, setCards] = useState<{id: number, content: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const items = [...emojis, ...emojis];
    const shuffled = items.sort(() => Math.random() - 0.5).map((e, i) => ({
      id: i, content: e, flipped: false, matched: false
    }));
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (cards[first].content === cards[second].content) {
        setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, matched: true } : c));
        setFlippedIndices([]);
        if (cards.filter(c => !c.matched).length <= 2) {
          setTimeout(() => onGameOver(Math.max(0, 500 - moves * 10)), 500);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, flipped: false } : c));
          setFlippedIndices([]);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flippedIndices, cards, onGameOver, moves]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].flipped || cards[index].matched) return;
    setCards(prev => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));
    setFlippedIndices(prev => [...prev, index]);
  };

  return (
    <div className="flex flex-col items-center">
       <div className="mb-4 text-lg font-medium dark:text-gray-200">Moves: {moves}</div>
       <div className="grid grid-cols-4 gap-3 sm:gap-4">
         {cards.map((card, i) => (
           <div
             key={i}
             onClick={() => handleCardClick(i)}
             className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-3xl rounded-xl cursor-pointer transition-all duration-300 transform ${
               card.flipped || card.matched ? 'bg-white dark:bg-dark-surface rotate-y-180' : 'bg-brand-500 text-transparent'
             } ${card.matched ? 'opacity-50' : 'shadow-md'}`}
           >
             {(card.flipped || card.matched) ? card.content : ''}
           </div>
         ))}
       </div>
    </div>
  );
};

// --- 4. Reaction Speed ---
export const ReactionGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [status, setStatus] = useState<'waiting' | 'ready' | 'go' | 'clicked'>('waiting');
    const [ms, setMs] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const startTest = () => {
        setStatus('ready');
        setMs(0);
        const time = 2000 + Math.random() * 3000;
        const id = setTimeout(() => {
            setStatus('go');
            setStartTime(Date.now());
        }, time);
        setTimeoutId(id);
    };

    const handleClick = () => {
        if (status === 'ready') {
            setStatus('waiting');
            if (timeoutId) clearTimeout(timeoutId);
            alert("Too early!");
        } else if (status === 'go') {
            const time = Date.now() - startTime;
            setMs(time);
            setStatus('clicked');
            setTimeout(() => onGameOver(Math.max(0, 1000 - time)), 1500);
        }
    };

    return (
        <div 
            onClick={status !== 'waiting' && status !== 'clicked' ? handleClick : undefined}
            className={`w-full max-w-lg mx-auto h-80 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none ${
                status === 'waiting' ? 'bg-gray-200 dark:bg-dark-surface' :
                status === 'ready' ? 'bg-red-500' :
                status === 'go' ? 'bg-green-500' : 'bg-brand-500'
            }`}
        >
            {status === 'waiting' && <Button onClick={startTest}>Start Test</Button>}
            {status === 'ready' && <span className="text-white text-3xl font-bold">Wait for Green...</span>}
            {status === 'go' && <span className="text-white text-5xl font-bold">CLICK!</span>}
            {status === 'clicked' && (
                <div className="text-center text-white">
                    <div className="text-5xl font-bold mb-4">{ms} ms</div>
                    <Button onClick={startTest} variant="secondary">Try Again</Button>
                </div>
            )}
        </div>
    );
};

// --- 5. Whack-A-Mole ---
export const WhackAMoleGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const newMoles = Array(9).fill(false);
      if (Math.random() > 0.3) {
        newMoles[Math.floor(Math.random() * 9)] = true;
      }
      setMoles(newMoles);
    }, 800);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(interval);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { clearInterval(interval); clearInterval(timer); };
  }, [isActive, score, onGameOver]);

  const whack = (index: number) => {
    if (moles[index]) {
      setScore(s => s + 10);
      const newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4 font-bold text-lg">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {moles.map((isMole, i) => (
          <div 
            key={i}
            onClick={() => whack(i)}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl cursor-pointer transition-all duration-100 ${
              isMole ? 'bg-brand-500 scale-105' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {isMole ? '🐹' : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 6. Word Scramble ---
export const WordScrambleGame: React.FC<GameProps> = ({ onGameOver }) => {
  const words = ['BRAIN', 'QUEST', 'LOGIC', 'PUZZLE', 'SMART', 'GAMES', 'CODEY'];
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);

  const nextWord = useCallback(() => {
    if (count >= 5) {
      onGameOver(score);
      return;
    }
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
    setScrambled(word.split('').sort(() => Math.random() - 0.5).join(''));
    setInput('');
    setCount(c => c + 1);
  }, [count, score, onGameOver]);

  useEffect(() => {
    nextWord();
  }, []); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase() === currentWord) {
      setScore(s => s + 20);
      nextWord();
    } else {
      setInput(''); 
    }
  };

  return (
    <div className="text-center w-full max-w-sm">
      <h3 className="text-xl mb-2 dark:text-gray-300">Unscramble this word:</h3>
      <div className="text-4xl font-bold tracking-widest mb-8 text-brand-600 dark:text-brand-400">{scrambled}</div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-dark-border dark:bg-dark-surface dark:text-white text-center uppercase font-bold"
          autoFocus
        />
        <Button>Check</Button>
      </form>
      <div className="mt-4 text-sm text-gray-500">{count}/5 words</div>
    </div>
  );
};

// --- 7. Sliding Puzzle (Using New Engine) ---
export const SlidingPuzzleGame: React.FC<GameProps> = ({ onGameOver }) => {
  return (
    <div className="w-full flex justify-center">
      <GameUI 
        gameId="sliding-puzzle" 
        onFinish={(score) => onGameOver(score)}
        onExit={() => onGameOver(0)}
      />
    </div>
  );
};

// --- 8. Sudoku ---
export const SudokuGame: React.FC<GameProps> = ({ onGameOver }) => {
  const solution = [
    5,3,4,6,7,8,9,1,2,
    6,7,2,1,9,5,3,4,8,
    1,9,8,3,4,2,5,6,7,
    8,5,9,7,6,1,4,2,3,
    4,2,6,8,5,3,7,9,1,
    7,1,3,9,2,4,8,5,6,
    9,6,1,5,3,7,2,8,4,
    2,8,7,4,1,9,6,3,5,
    3,4,5,2,8,6,1,7,9
  ];
  const [board, setBoard] = useState<(number|null)[]>([]);

  useEffect(() => {
    setBoard(solution.map(n => Math.random() > 0.4 ? n : null));
  }, []);

  const handleChange = (index: number, val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return;
    
    const newBoard = [...board];
    newBoard[index] = num;
    setBoard(newBoard);

    if (newBoard.every((n, i) => n === solution[i])) {
      onGameOver(300);
    }
  };

  return (
    <div className="grid grid-cols-9 gap-0.5 bg-gray-800 border-2 border-gray-800">
      {board.map((cell, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={cell || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            className={`w-8 h-8 sm:w-10 sm:h-10 text-center border-none outline-none text-lg ${
              (i % 9 === 2 || i % 9 === 5) ? 'mr-0.5' : ''
            } ${
               Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5 ? 'mb-0.5' : ''
            }`}
          />
      ))}
    </div>
  );
};

// --- 9. Maze Runner ---
export const MazeRunnerGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const maze = [
    [0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 2] // 2 is goal
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      let { x, y } = playerPos;
      if (e.key === 'ArrowUp') y--;
      if (e.key === 'ArrowDown') y++;
      if (e.key === 'ArrowLeft') x--;
      if (e.key === 'ArrowRight') x++;

      if (y >= 0 && y < maze.length && x >= 0 && x < maze[0].length && maze[y][x] !== 1) {
        setPlayerPos({ x, y });
        if (maze[y][x] === 2) onGameOver(200);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [playerPos, onGameOver]);

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-sm dark:text-gray-400">Use Arrow Keys to move the Blue Dot to the Red Square</p>
      <div className="grid grid-cols-10 gap-0 border-2 border-gray-800 bg-gray-100">
        {maze.map((row, y) => row.map((cell, x) => (
          <div key={`${x}-${y}`} className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center ${
            cell === 1 ? 'bg-gray-800' : 'bg-white'
          }`}>
            {x === playerPos.x && y === playerPos.y && <div className="w-4 h-4 rounded-full bg-blue-500" />}
            {cell === 2 && <div className="w-full h-full bg-red-500 opacity-50" />}
          </div>
        )))}
      </div>
       <div className="mt-4 flex gap-4 md:hidden">
           <Button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowUp'}))}>↑</Button>
           <div className="flex gap-4">
             <Button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}))}>←</Button>
             <Button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown'}))}>↓</Button>
             <Button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}))}>→</Button>
           </div>
       </div>
    </div>
  );
};

// --- 10. Bubble Pop ---
export const BubblePopGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
  const [bubbles, setBubbles] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * 80 + 10;
      const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      setBubbles(prev => [...prev, { id, x, y: 100, color }]);
    }, 800);

    const animLoop = setInterval(() => {
      setBubbles(prev => {
        const next = prev.map(b => ({ ...b, y: b.y - 1 })).filter(b => b.y > -10);
        return next;
      });
    }, 50);

    const timer = setTimeout(() => onGameOver(score), 30000); // 30s game

    return () => { clearInterval(interval); clearInterval(animLoop); clearTimeout(timer); };
  }, [isActive, score, onGameOver]);

  const pop = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 10);
  };

  return (
    <div className="relative w-full h-80 bg-blue-50 dark:bg-blue-900/20 overflow-hidden rounded-xl border border-blue-200" ref={containerRef}>
      <div className="absolute top-2 right-2 font-bold dark:text-white">Score: {score}</div>
      {bubbles.map(b => (
        <div
          key={b.id}
          onClick={() => pop(b.id)}
          className={`absolute w-12 h-12 rounded-full ${b.color} cursor-pointer shadow-lg opacity-80 hover:scale-110 transition-transform`}
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
        />
      ))}
    </div>
  );
};

// --- 11. Color Switch (Simplified) ---
export const ColorSwitchGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308']; // Red, Blue, Green, Yellow
  const [ball, setBall] = useState({ y: 0, colorIdx: 0 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const loop = setInterval(() => {
      setBall(prev => {
        if (prev.y > 80) {
           return { y: 0, colorIdx: Math.floor(Math.random() * 4) };
        }
        return { ...prev, y: prev.y + 2 };
      });
    }, 50);
    return () => clearInterval(loop);
  }, [isActive]);

  const [playerColorIdx, setPlayerColorIdx] = useState(0);

  useEffect(() => {
      if (ball.y >= 80 && ball.y <= 85) {
          if (ball.colorIdx === playerColorIdx) {
             setScore(s => s + 1);
          } else {
             onGameOver(score);
          }
      }
  }, [ball.y, playerColorIdx, ball.colorIdx, onGameOver, score]);

  return (
      <div className="flex flex-col items-center h-80 justify-between py-4">
          <div className="text-xl font-bold dark:text-white">Score: {score}</div>
          <div className="relative w-full h-full flex justify-center">
              <div 
                className="absolute w-8 h-8 rounded-full"
                style={{ top: `${ball.y}%`, backgroundColor: colors[ball.colorIdx] }}
              />
              <div 
                onClick={() => setPlayerColorIdx(c => (c + 1) % 4)}
                className="absolute bottom-0 w-16 h-16 rounded-lg cursor-pointer transition-colors border-4 border-white shadow-lg"
                style={{ backgroundColor: colors[playerColorIdx] }}
              />
          </div>
          <p className="text-gray-500">Tap square to match falling ball color</p>
      </div>
  );
};

// --- 12. Match-3 ---
export const Match3Game: React.FC<GameProps> = ({ onGameOver }) => {
    const [grid, setGrid] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const colors = ['🔴', '🔵', '🟢', '🟡', '🟣'];

    useEffect(() => {
        setGrid(Array(25).fill(null).map(() => colors[Math.floor(Math.random() * colors.length)]));
    }, []);

    const checkMatches = (currentGrid: string[]) => {
        let matches = new Set<number>();
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                const idx = i * 5 + j;
                if (currentGrid[idx] === currentGrid[idx+1] && currentGrid[idx] === currentGrid[idx+2]) {
                    matches.add(idx); matches.add(idx+1); matches.add(idx+2);
                }
            }
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                const idx = j * 5 + i;
                if (currentGrid[idx] === currentGrid[idx+5] && currentGrid[idx] === currentGrid[idx+10]) {
                    matches.add(idx); matches.add(idx+5); matches.add(idx+10);
                }
            }
        }
        return matches;
    };

    const handleClick = (i: number) => {
        if (selected === null) {
            setSelected(i);
        } else {
            const newGrid = [...grid];
            [newGrid[selected], newGrid[i]] = [newGrid[i], newGrid[selected]];
            
            const matches = checkMatches(newGrid);
            if (matches.size > 0) {
                setScore(s => s + matches.size * 10);
                matches.forEach(idx => {
                    newGrid[idx] = colors[Math.floor(Math.random() * colors.length)];
                });
                setGrid(newGrid);
                if (score > 500) onGameOver(score);
            } else {
                setGrid(newGrid);
            }
            setSelected(null);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="text-xl font-bold mb-4 dark:text-white">Score: {score}</div>
            <div className="grid grid-cols-5 gap-1 bg-gray-200 p-2 rounded-lg">
                {grid.map((c, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleClick(i)}
                      className={`w-12 h-12 flex items-center justify-center text-2xl cursor-pointer rounded hover:bg-white/50 transition-all ${selected === i ? 'bg-white ring-2 ring-brand-500' : ''}`}
                    >
                        {c}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 13. Simon Says ---
export const SimonSaysGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
    const colors = ['red', 'green', 'blue', 'yellow'];
    const [sequence, setSequence] = useState<string[]>([]);
    const [userStep, setUserStep] = useState(0);
    const [isShowing, setIsShowing] = useState(false);
    const [activeColor, setActiveColor] = useState<string | null>(null);

    const addStep = useCallback(() => {
        const nextColor = colors[Math.floor(Math.random() * 4)];
        setSequence(prev => [...prev, nextColor]);
        setUserStep(0);
        setIsShowing(true);
    }, []);

    useEffect(() => {
        if (!isActive) return;
        if (sequence.length === 0) {
            setTimeout(addStep, 1000);
        }
    }, [isActive, sequence, addStep]);

    useEffect(() => {
        if (isShowing) {
            let i = 0;
            const interval = setInterval(() => {
                if (i >= sequence.length) {
                    clearInterval(interval);
                    setIsShowing(false);
                    setActiveColor(null);
                    return;
                }
                setActiveColor(sequence[i]);
                setTimeout(() => setActiveColor(null), 500);
                i++;
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isShowing, sequence]);

    const handleColorClick = (color: string) => {
        if (isShowing) return;
        
        // Light up briefly
        setActiveColor(color);
        setTimeout(() => setActiveColor(null), 200);

        if (color === sequence[userStep]) {
            if (userStep === sequence.length - 1) {
                // Next round
                setTimeout(addStep, 1000);
            } else {
                setUserStep(s => s + 1);
            }
        } else {
            onGameOver((sequence.length - 1) * 10);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <h3 className="text-xl dark:text-white">{isShowing ? 'Watch...' : 'Repeat!'}</h3>
            <div className="grid grid-cols-2 gap-4">
                {colors.map(c => (
                    <button
                        key={c}
                        onClick={() => handleColorClick(c)}
                        className={`w-32 h-32 rounded-2xl transition-all duration-200 transform active:scale-95 ${
                            activeColor === c ? 'brightness-125 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.5)]' : 'brightness-75'
                        }`}
                        style={{ backgroundColor: c === 'red' ? '#ef4444' : c === 'green' ? '#22c55e' : c === 'blue' ? '#3b82f6' : '#eab308' }}
                    />
                ))}
            </div>
            <div className="text-gray-500">Sequence Length: {sequence.length}</div>
        </div>
    );
};

// --- 14. Tower Stack ---
export const TowerStackGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
    const [score, setScore] = useState(0);
    const [stack, setStack] = useState<{width: number, x: number}[]>([{width: 200, x: 100}]);
    const [currentBlock, setCurrentBlock] = useState({width: 200, x: 0, dir: 1});
    const [speed, setSpeed] = useState(5);
    
    // Animation loop
    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            setCurrentBlock(prev => {
                let nextX = prev.x + (prev.dir * speed);
                if (nextX > 300 || nextX < 0) {
                     return { ...prev, x: prev.x, dir: prev.dir * -1 };
                }
                return { ...prev, x: nextX };
            });
        }, 30);
        return () => clearInterval(interval);
    }, [isActive, speed]);

    const dropBlock = () => {
        const topStack = stack[stack.length - 1];
        // Calculate overlap
        const blockStart = currentBlock.x;
        const blockEnd = currentBlock.x + currentBlock.width;
        const stackStart = topStack.x;
        const stackEnd = topStack.x + topStack.width;

        const overlapStart = Math.max(blockStart, stackStart);
        const overlapEnd = Math.min(blockEnd, stackEnd);
        const overlapWidth = overlapEnd - overlapStart;

        if (overlapWidth <= 0) {
            onGameOver(score * 10);
        } else {
            setScore(s => s + 1);
            setStack(prev => [...prev, { width: overlapWidth, x: overlapStart }]);
            setCurrentBlock({ width: overlapWidth, x: 0, dir: 1 });
            setSpeed(s => s + 0.5);
        }
    };

    return (
        <div className="flex flex-col items-center cursor-pointer" onClick={dropBlock}>
            <div className="text-xl font-bold mb-4 dark:text-white">Score: {score}</div>
            <div className="w-[400px] h-[300px] bg-gray-100 dark:bg-gray-800 relative overflow-hidden border-b-2 border-gray-400 flex flex-col-reverse items-center">
                {stack.map((b, i) => (
                    <div key={i} className="h-8 bg-brand-500 border border-brand-600 mb-0.5" style={{ width: b.width, transform: `translateX(${b.x - 200}px)` }} />
                ))}
                {/* Moving Block (Absolute) */}
                <div 
                    className="absolute bottom-[200px] h-8 bg-red-500 border border-red-600"
                    style={{ 
                        width: currentBlock.width, 
                        left: 0,
                        transform: `translateX(${currentBlock.x}px)`,
                        bottom: `${stack.length * 34}px`
                    }} 
                />
            </div>
            <p className="mt-4 text-gray-500">Click to stack the block!</p>
        </div>
    );
};

// --- 15. Number Sequence ---
export const NumberSequenceGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [answer, setAnswer] = useState(0);
    const [score, setScore] = useState(0);
    const [input, setInput] = useState('');

    const generateSequence = useCallback(() => {
        const type = Math.floor(Math.random() * 3);
        const start = Math.floor(Math.random() * 10) + 1;
        let seq = [];
        let next = 0;

        if (type === 0) { // Linear (+n)
            const step = Math.floor(Math.random() * 5) + 2;
            seq = [start, start + step, start + step*2, start + step*3];
            next = start + step*4;
        } else if (type === 1) { // Geometric (*n)
            const mult = Math.floor(Math.random() * 2) + 2;
            seq = [start, start * mult, start * mult*mult, start * mult*mult*mult];
            next = start * mult*mult*mult*mult;
        } else { // Fibonacci-ish
             seq = [start, start+1, start*2+1, start*3+2]; // Simplified random logic for complexity
             // Reset to real Fibonacci for clarity
             let a = start, b = start;
             seq = [a, b];
             for(let i=0; i<3; i++) {
                 const c = a + b;
                 seq.push(c);
                 a = b; b = c;
             }
             next = a + b;
             seq.pop(); // remove answer
        }
        setSequence(seq);
        setAnswer(next);
    }, []);

    useEffect(() => {
        generateSequence();
    }, [generateSequence]);

    const checkAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(input) === answer) {
            setScore(s => s + 20);
            setInput('');
            generateSequence();
        } else {
            onGameOver(score);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-md mx-auto">
             <div className="text-xl font-bold mb-8 dark:text-white">Score: {score}</div>
             <div className="flex gap-4 mb-8">
                 {sequence.map((n, i) => (
                     <div key={i} className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center text-2xl font-bold dark:text-white">
                         {n}
                     </div>
                 ))}
                 <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-500">?</div>
             </div>
             <form onSubmit={checkAnswer} className="flex gap-2">
                 <input 
                     type="number" 
                     value={input} 
                     onChange={e => setInput(e.target.value)} 
                     className="p-3 border rounded-xl dark:bg-dark-surface dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-brand-500"
                     autoFocus
                     placeholder="Next number..."
                 />
                 <Button>Submit</Button>
             </form>
        </div>
    );
};

// --- 16. Word Search ---
export const WordSearchGame: React.FC<GameProps> = ({ onGameOver }) => {
    const gridSize = 8;
    const words = ['REACT', 'CODE', 'BRAIN', 'GAME', 'LOGIC'];
    const [grid, setGrid] = useState<string[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selectedCells, setSelectedCells] = useState<{r:number, c:number}[]>([]);

    useEffect(() => {
        // Simple generation: Place words horizontally/vertically then fill random
        const g = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
        words.forEach(word => {
            let placed = false;
            while (!placed) {
                const dir = Math.random() > 0.5 ? 'h' : 'v';
                const r = Math.floor(Math.random() * (gridSize - (dir === 'v' ? word.length : 0)));
                const c = Math.floor(Math.random() * (gridSize - (dir === 'h' ? word.length : 0)));
                // Check collision (simplified: just overwrite for this mini-game demo to ensure functionality)
                let fits = true;
                for(let i=0; i<word.length; i++) {
                    if (g[dir==='v'?r+i:r][dir==='h'?c+i:c] !== '') fits = false;
                }
                if (fits) {
                    for(let i=0; i<word.length; i++) {
                        g[dir==='v'?r+i:r][dir==='h'?c+i:c] = word[i];
                    }
                    placed = true;
                }
            }
        });
        // Fill empty
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for(let r=0; r<gridSize; r++) {
            for(let c=0; c<gridSize; c++) {
                if(g[r][c] === '') g[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
        setGrid(g);
    }, []);

    useEffect(() => {
        if (foundWords.length === words.length) {
            setTimeout(() => onGameOver(500), 1000);
        }
    }, [foundWords, onGameOver]);

    const handleCellClick = (r: number, c: number) => {
        // Toggle selection
        const existingIdx = selectedCells.findIndex(cell => cell.r === r && cell.c === c);
        let newSelection = [];
        
        if (existingIdx >= 0) {
            newSelection = selectedCells.filter((_, i) => i !== existingIdx);
        } else {
            newSelection = [...selectedCells, {r, c}];
        }
        
        // Sort by position to form string
        newSelection.sort((a,b) => (a.r*gridSize + a.c) - (b.r*gridSize + b.c));
        setSelectedCells(newSelection);

        // Check word
        const word = newSelection.map(cell => grid[cell.r][cell.c]).join('');
        if (words.includes(word) && !foundWords.includes(word)) {
            setFoundWords(prev => [...prev, word]);
            setSelectedCells([]);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-4 mb-6 flex-wrap justify-center">
                {words.map(w => (
                    <span key={w} className={`px-3 py-1 rounded-full text-sm font-bold ${foundWords.includes(w) ? 'bg-green-100 text-green-700 line-through' : 'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}>
                        {w}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-8 gap-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                {grid.map((row, r) => row.map((char, c) => {
                    const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
                    return (
                        <div 
                            key={`${r}-${c}`}
                            onClick={() => handleCellClick(r, c)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold cursor-pointer rounded select-none ${
                                isSelected ? 'bg-brand-500 text-white' : 'bg-white dark:bg-dark-surface dark:text-gray-300'
                            }`}
                        >
                            {char}
                        </div>
                    );
                }))}
            </div>
        </div>
    );
};

// --- 17. Pattern Match ---
export const PatternMatchGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
    const [pattern, setPattern] = useState<number[]>([]);
    const [userPattern, setUserPattern] = useState<number[]>([]);
    const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
    const [level, setLevel] = useState(1);

    const generatePattern = useCallback(() => {
        setPhase('memorize');
        setUserPattern([]);
        const count = 3 + level;
        const newPattern = new Set<number>();
        while(newPattern.size < count) {
            newPattern.add(Math.floor(Math.random() * 16));
        }
        setPattern(Array.from(newPattern));
        
        setTimeout(() => {
            setPhase('recall');
        }, 2000);
    }, [level]);

    useEffect(() => {
        if (isActive) generatePattern();
    }, [isActive, generatePattern]);

    const handleCellClick = (i: number) => {
        if (phase !== 'recall') return;
        
        if (pattern.includes(i)) {
             if (!userPattern.includes(i)) {
                 const newUser = [...userPattern, i];
                 setUserPattern(newUser);
                 if (newUser.length === pattern.length) {
                     // Level up
                     setTimeout(() => {
                         setLevel(l => l + 1);
                     }, 500);
                 }
             }
        } else {
            // Wrong click
            onGameOver((level - 1) * 100);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 dark:text-white">{phase === 'memorize' ? 'Memorize!' : 'Recall!'}</h3>
            <div className="grid grid-cols-4 gap-2">
                {Array(16).fill(null).map((_, i) => {
                    const isActive = phase === 'memorize' ? pattern.includes(i) : userPattern.includes(i);
                    return (
                        <div 
                            key={i}
                            onClick={() => handleCellClick(i)}
                            className={`w-16 h-16 rounded-xl transition-colors duration-200 cursor-pointer ${
                                isActive ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        />
                    );
                })}
            </div>
            <p className="mt-4 text-gray-500">Level {level}</p>
        </div>
    );
};

// --- 18. Target Clicker ---
export const TargetClickerGame: React.FC<GameProps> = ({ onGameOver, isActive }) => {
    const [targets, setTargets] = useState<{id: number, x: number, y: number, size: number}[]>([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!isActive) return;
        const spawn = setInterval(() => {
            if (targets.length < 5) {
                setTargets(prev => [...prev, {
                    id: Date.now(),
                    x: Math.random() * 80 + 10,
                    y: Math.random() * 80 + 10,
                    size: 60
                }]);
            }
        }, 600);
        
        const shrink = setInterval(() => {
             setTargets(prev => {
                 const next = prev.map(t => ({...t, size: t.size - 1})).filter(t => t.size > 0);
                 return next;
             });
        }, 50);

        const timer = setTimeout(() => onGameOver(score), 30000);

        return () => { clearInterval(spawn); clearInterval(shrink); clearTimeout(timer); };
    }, [isActive, score, onGameOver, targets.length]);

    const hit = (id: number) => {
        setTargets(prev => prev.filter(t => t.id !== id));
        setScore(s => s + 50);
    };

    return (
        <div className="relative w-full h-[400px] bg-gray-900 rounded-3xl overflow-hidden cursor-crosshair">
            <div className="absolute top-4 left-4 text-white font-bold">Score: {score}</div>
            {targets.map(t => (
                <div 
                    key={t.id}
                    onMouseDown={() => hit(t.id)}
                    className="absolute rounded-full bg-red-500 border-4 border-white shadow-[0_0_15px_rgba(255,0,0,0.8)]"
                    style={{ 
                        left: `${t.x}%`, 
                        top: `${t.y}%`, 
                        width: t.size, 
                        height: t.size,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="w-full h-full rounded-full border-2 border-white opacity-50 scale-50"></div>
                </div>
            ))}
        </div>
    );
};

// --- 19. Mental Math ---
export const MentalMathGame: React.FC<GameProps> = ({ onGameOver }) => {
    // Similar to Quick Math but chains operations
    const [problem, setProblem] = useState({ q: '', a: 0 });
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);

    const generate = useCallback(() => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        const n3 = Math.floor(Math.random() * 5) + 1;
        
        // (A + B) * C or A * B - C
        if (Math.random() > 0.5) {
             setProblem({ q: `(${n1} + ${n2}) × ${n3}`, a: (n1 + n2) * n3 });
        } else {
             setProblem({ q: `${n1} × ${n2} - ${n3}`, a: n1 * n2 - n3 });
        }
    }, []);

    useEffect(() => { generate(); }, [generate]);

    const check = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(input) === problem.a) {
            setScore(s => s + 30);
            setInput('');
            generate();
        } else {
            onGameOver(score);
        }
    };

    return (
        <div className="text-center space-y-8">
             <div className="text-xl">Solve Chain:</div>
             <div className="text-4xl font-mono font-bold dark:text-white bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl">{problem.q}</div>
             <form onSubmit={check} className="max-w-xs mx-auto flex gap-2">
                 <input 
                     type="number" 
                     value={input} 
                     onChange={e => setInput(e.target.value)} 
                     className="w-full p-3 rounded-lg border dark:bg-dark-surface dark:text-white"
                     autoFocus
                 />
                 <Button>Go</Button>
             </form>
             <div className="text-brand-500 font-bold text-xl">{score} pts</div>
        </div>
    );
};

// --- 20. Emoji Riddle ---
export const EmojiRiddleGame: React.FC<GameProps> = ({ onGameOver }) => {
    const riddles = [
        { q: '👻 🏠', a: 'HAUNTED HOUSE' },
        { q: '👨‍🚀 🚀 🌑', a: 'ASTRONAUT' },
        { q: '🌧️ 🌈', a: 'RAINBOW' },
        { q: '🦁 👑', a: 'LION KING' },
        { q: '🌮 🔔', a: 'TACO BELL' }
    ];
    const [idx, setIdx] = useState(0);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);

    const check = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.toUpperCase().trim() === riddles[idx].a) {
             if (idx < riddles.length - 1) {
                 setScore(s => s + 100);
                 setIdx(i => i + 1);
                 setInput('');
             } else {
                 onGameOver(score + 100);
             }
        } else {
             setInput(''); // shake
        }
    };

    return (
        <div className="text-center space-y-8 max-w-md mx-auto">
             <div className="text-6xl animate-bounce-slow">{riddles[idx].q}</div>
             <p className="text-gray-500">Guess the phrase!</p>
             <form onSubmit={check}>
                 <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="w-full p-4 text-center text-xl font-bold uppercase border-b-2 border-brand-500 bg-transparent outline-none dark:text-white"
                    placeholder="TYPE HERE"
                    autoFocus
                 />
             </form>
             <div className="text-sm text-gray-400">{idx + 1} / {riddles.length}</div>
        </div>
    );
};

// --- 21. Pixel Art (Creative) ---
export const PixelArtGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [grid, setGrid] = useState<string[]>(Array(64).fill('#ffffff'));
  const [color, setColor] = useState('#000000');
  const palette = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#ffffff'];

  const paint = (i: number) => {
    const newGrid = [...grid];
    newGrid[i] = color;
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-8 gap-1 bg-gray-300 p-2 rounded">
        {grid.map((c, i) => (
          <div 
            key={i} 
            onClick={() => paint(i)}
            className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer border border-gray-100"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {palette.map(c => (
           <button 
             key={c}
             onClick={() => setColor(c)}
             className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
             style={{ backgroundColor: c }}
           />
        ))}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setGrid(Array(64).fill('#ffffff'))} variant="ghost">Clear</Button>
        <Button onClick={() => onGameOver(100)}>Finish Art</Button>
      </div>
    </div>
  );
};

// --- 22. Math Adventure (RPG) ---
export const MathAdventureGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [step, setStep] = useState(0);
  const [hp, setHp] = useState(100);
  const [monsterHp, setMonsterHp] = useState(50);
  const [log, setLog] = useState<string[]>(['A Goblin appears!']);
  const [question, setQuestion] = useState({ q: '5 x 4', a: 20, damage: 15 });

  useEffect(() => {
      // Generate new question on step change
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;
      setQuestion({ q: `${n1} x ${n2}`, a: n1 * n2, damage: Math.floor((n1*n2)/2) });
  }, [step]);

  const attack = (inputVal: string) => {
     const val = parseInt(inputVal);
     if (val === question.a) {
         setMonsterHp(h => h - question.damage);
         setLog(prev => [`Hit for ${question.damage} damage!`, ...prev]);
         if (monsterHp - question.damage <= 0) {
             setLog(prev => ['Monster defeated! Next stage...', ...prev]);
             setTimeout(() => {
                 setMonsterHp(50 + step * 20);
                 setStep(s => s + 1);
             }, 1000);
         }
     } else {
         setHp(h => h - 10);
         setLog(prev => ['Missed! You took 10 damage.', ...prev]);
         if (hp - 10 <= 0) {
             onGameOver(step * 100);
         }
     }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
       <div className="flex justify-between font-bold dark:text-white">
           <span className="text-green-500">HP: {hp}</span>
           <span>Stage: {step + 1}</span>
           <span className="text-red-500">Enemy: {monsterHp}</span>
       </div>
       
       <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 overflow-y-auto space-y-1 text-sm text-gray-600 dark:text-gray-300 font-mono">
           {log.map((l, i) => <div key={i}>{l}</div>)}
       </div>

       <div className="text-center p-6 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border">
           <div className="text-sm text-gray-500 mb-2">To Attack: Solve</div>
           <div className="text-3xl font-bold mb-4 dark:text-white">{question.q}</div>
           <div className="grid grid-cols-2 gap-4">
               {[question.a, question.a + Math.floor(Math.random()*5)+1, question.a - Math.floor(Math.random()*3)-1, question.a + 10]
                .sort(() => Math.random() - 0.5)
                .map((ans, i) => (
                   <Button key={i} onClick={() => attack(String(ans))} variant="outline">{ans}</Button>
                ))
               }
           </div>
       </div>
       <Button className="w-full" variant="ghost" onClick={() => onGameOver(step * 100)}>Run Away (Exit)</Button>
    </div>
  );
};
