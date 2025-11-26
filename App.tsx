
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { 
  HomePage, GameHub, GameDetailsPage, ProfilePage, LeaderboardPage, AboutPage, BlogPage, BlogPostPage, 
  ContactPage, HelpPage, SettingsPage, DailyChallengesPage, AchievementsPage, 
  GalleryPage, FeedbackPage, LegalPage, AgentFullPage
} from './pages/Pages';
import { 
  QuickMathGame, TicTacToeGame, MemoryGame, ReactionGame, 
  WhackAMoleGame, WordScrambleGame, SlidingPuzzleGame, SudokuGame, 
  MazeRunnerGame, BubblePopGame, ColorSwitchGame, Match3Game,
  SimonSaysGame, TowerStackGame, NumberSequenceGame, WordSearchGame,
  PatternMatchGame, TargetClickerGame, MentalMathGame, EmojiRiddleGame,
  PixelArtGame, MathAdventureGame
} from './games/MiniGames';
import { AIAgent } from './components/AIAgent';
import { GAMES } from './constants';
import { User } from './types';
import { generateHint } from './services/geminiService';
import { Button } from './components/UIComponents';
import { RewardSystem } from './services/systems';
import { Storage } from './services/storage';

const App: React.FC = () => {
  // --- Routing State ---
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');
  
  // --- User State ---
  const [user, setUser] = useState<User>(Storage.loadUser());

  // --- Theme State ---
  const [theme, setTheme] = useState<'light' | 'dark'>(user.settings.theme);

  // --- AI State ---
  const [isAIOpen, setIsAIOpen] = useState(false);

  // --- Game Session State ---
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'over'>('intro');
  const [gameScore, setGameScore] = useState(0);

  // --- Effects ---
  useEffect(() => {
    // Save user whenever it changes
    Storage.saveUser(user);
    // Sync theme
    document.documentElement.classList.toggle('dark', user.settings.theme === 'dark');
  }, [user]);

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash.slice(1) || '/';
      setPath(newPath);
      if (newPath.startsWith('/play/')) {
        const id = newPath.split('/')[2];
        setActiveGameId(id);
        setGameState('intro');
        setGameScore(0);
      } else {
        setActiveGameId(null);
      }
      
      // Scroll to top
      window.scrollTo(0,0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- Handlers ---
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setUser(u => ({ ...u, settings: { ...u.settings, theme: newTheme } }));
  };
  
  const navigate = (p: string) => window.location.hash = p;

  const handleGameOver = (score: number) => {
    setGameScore(score);
    setGameState('over');
    
    // Update User Stats
    setUser(prev => {
        let newRewards = prev.miniRewards;
        // Chance to get a reward on game over
        if (score > 50 && Math.random() > 0.4) {
             newRewards = RewardSystem.grantMiniReward('coin', 5, newRewards);
        }

        return {
            ...prev,
            xp: prev.xp + score,
            level: Math.floor((prev.xp + score) / 1000) + 1,
            gems: prev.gems + Math.floor(score / 10),
            history: [...prev.history, { 
                gameId: activeGameId!, 
                score, 
                date: new Date().toISOString(),
                status: score > 50 ? 'win' : 'loss',
                stars: score > 200 ? 3 : score > 100 ? 2 : 1
            }],
            miniRewards: newRewards
        };
    });
  };

  const requestHint = async () => {
    if (!activeGameId) return;
    setIsAIOpen(true);
    await generateHint(`Game: ${activeGameId}, Score: ${gameScore}`);
  };

  const handleUpdateUser = (updatedUser: User) => {
      setUser(updatedUser);
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (activeGameId) {
      const gameDef = GAMES.find(g => g.id === activeGameId);
      
      if (!gameDef) return <div className="text-center p-20">Game not found</div>;

      return (
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-8">
             <div>
               <button onClick={() => navigate(`#/details/${activeGameId}`)} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-2">← Back to Details</button>
               <h1 className="text-3xl font-bold dark:text-white">{gameDef.title}</h1>
             </div>
             <div className="flex gap-4">
                <Button onClick={requestHint} variant="outline" className="flex items-center gap-2">
                  💡 Hint
                </Button>
             </div>
          </div>

          {/* Game Area */}
          <div className="bg-gray-50 dark:bg-dark-surface/50 border-2 border-dashed border-gray-200 dark:border-dark-border rounded-3xl p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden shadow-inner">
            
            {gameState === 'intro' && (
               <div className="text-center max-w-md animate-in zoom-in duration-300">
                 <div className="text-8xl mb-6">{gameDef.icon}</div>
                 <h2 className="text-2xl font-bold mb-4 dark:text-white">Ready to Play?</h2>
                 <p className="mb-8 text-gray-600 dark:text-gray-400">{gameDef.description}</p>
                 <Button onClick={() => setGameState('playing')} className="w-full text-lg py-4 shadow-lg">Start Game</Button>
               </div>
            )}

            {gameState === 'playing' && (
              <div className="w-full h-full animate-in fade-in duration-500">
                {activeGameId === 'quick-math' && <QuickMathGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'tic-tac-toe' && <TicTacToeGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'memory-pairs' && <MemoryGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'reaction-speed' && <ReactionGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'whack-a-mole' && <WhackAMoleGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'word-scramble' && <WordScrambleGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'sliding-puzzle' && <SlidingPuzzleGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'sudoku' && <SudokuGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'maze-runner' && <MazeRunnerGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'bubble-pop' && <BubblePopGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'color-switch' && <ColorSwitchGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'match-3' && <Match3Game isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'simon-says' && <SimonSaysGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'tower-stack' && <TowerStackGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'number-sequence' && <NumberSequenceGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'word-search' && <WordSearchGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'pattern-match' && <PatternMatchGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'target-clicker' && <TargetClickerGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'mental-math' && <MentalMathGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'emoji-riddle' && <EmojiRiddleGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'pixel-art' && <PixelArtGame isActive={true} onGameOver={handleGameOver} />}
                {activeGameId === 'math-adventure' && <MathAdventureGame isActive={true} onGameOver={handleGameOver} />}
              </div>
            )}

            {gameState === 'over' && (
              <div className="text-center animate-in zoom-in duration-300">
                <h2 className="text-4xl font-bold mb-2 dark:text-white">Game Over!</h2>
                <div className="text-6xl font-black text-brand-600 mb-6">{gameScore}</div>
                <div className="text-gray-500 mb-8">Points Earned</div>
                <div className="flex gap-4 justify-center">
                   <Button onClick={() => { setGameState('playing'); setGameScore(0); }}>Play Again</Button>
                   <Button variant="secondary" onClick={() => navigate('#/games')}>Choose Another</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Dynamic Route matching
    if (path.startsWith('/blog/')) {
        const id = path.split('/')[2];
        return <BlogPostPage id={id} navigate={navigate} />;
    }

    if (path.startsWith('/details/')) {
        const id = path.split('/')[2];
        return <GameDetailsPage id={id} navigate={navigate} />;
    }

    switch (path) {
      case '/': return <HomePage navigate={navigate} />;
      case '/games': return <GameHub navigate={navigate} />;
      case '/profile': return <ProfilePage user={user} onUpdateUser={handleUpdateUser} navigate={navigate} />;
      case '/leaderboard': return <LeaderboardPage />;
      case '/about': return <AboutPage />;
      case '/blog': return <BlogPage navigate={navigate} />;
      case '/contact': return <ContactPage />;
      case '/help': return <HelpPage />;
      case '/settings': return <SettingsPage user={user} onUpdateUser={handleUpdateUser} />;
      case '/daily': return <DailyChallengesPage />;
      case '/achievements': return <AchievementsPage user={user} />;
      case '/gallery': return <GalleryPage />;
      case '/feedback': return <FeedbackPage />;
      case '/privacy': return <LegalPage type="privacy" />;
      case '/terms': return <LegalPage type="terms" />;
      case '/agent': return <AgentFullPage onOpenChat={() => setIsAIOpen(true)} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <Layout 
      theme={theme} 
      toggleTheme={toggleTheme} 
      onOpenAI={() => setIsAIOpen(true)} 
      currentPath={path}
      navigate={navigate}
      userLevel={user.level}
    >
      {renderContent()}
      <AIAgent 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        user={user} 
        gameContext={activeGameId ? `Playing ${activeGameId}` : 'Browsing Website'}
      />
    </Layout>
  );
};

export default App;
