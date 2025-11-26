
import { GameDef, Achievement, BlogPost, DailyChallenge } from './types';

export const GAMES: GameDef[] = [
  // Original 12
  { id: 'quick-math', title: 'Quick Math', description: 'Solve arithmetic problems against the clock.', category: 'Logic', difficulty: 'Easy', icon: '➗' },
  { id: 'memory-pairs', title: 'Memory Pairs', description: 'Find matching cards in the grid.', category: 'Memory', difficulty: 'Medium', icon: '🃏' },
  { id: 'reaction-speed', title: 'Reaction Speed', description: 'Click as soon as the screen turns green.', category: 'Action', difficulty: 'Hard', icon: '⚡' },
  { id: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic 3x3 strategy game.', category: 'Logic', difficulty: 'Easy', icon: '❌' },
  { id: 'whack-a-mole', title: 'Whack-A-Mole', description: 'Hit the targets before they disappear.', category: 'Action', difficulty: 'Medium', icon: '🔨' },
  { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble the letters to form words.', category: 'Puzzle', difficulty: 'Medium', icon: '🔡' },
  { id: 'sliding-puzzle', title: 'Sliding Puzzle', description: 'Order the tiles correctly.', category: 'Puzzle', difficulty: 'Hard', icon: '🧩' },
  { id: 'sudoku', title: 'Sudoku', description: 'Fill the grid with numbers 1-9.', category: 'Logic', difficulty: 'Hard', icon: '🔢' },
  { id: 'maze-runner', title: 'Maze Runner', description: 'Navigate to the exit.', category: 'Action', difficulty: 'Medium', icon: '🌀' },
  { id: 'bubble-pop', title: 'Bubble Pop', description: 'Pop matching bubbles.', category: 'Action', difficulty: 'Easy', icon: '🫧' },
  { id: 'color-switch', title: 'Color Switch', description: 'Match the ball color with obstacles.', category: 'Action', difficulty: 'Hard', icon: '🎨' },
  { id: 'match-3', title: 'Match-3', description: 'Align 3 items to clear them.', category: 'Puzzle', difficulty: 'Medium', icon: '💎' },
  
  // New Games
  { id: 'simon-says', title: 'Simon Says', description: 'Memorize and repeat the color sequence.', category: 'Memory', difficulty: 'Medium', icon: '🔴' },
  { id: 'tower-stack', title: 'Tower Stack', description: 'Stack the blocks as high as you can.', category: 'Action', difficulty: 'Hard', icon: '🏗️' },
  { id: 'number-sequence', title: 'Number Sequence', description: 'Find the next number in the pattern.', category: 'Education', difficulty: 'Medium', icon: '📈' },
  { id: 'word-search', title: 'Word Search', description: 'Find hidden words in the letter grid.', category: 'Puzzle', difficulty: 'Easy', icon: '🔍' },
  { id: 'pattern-match', title: 'Pattern Match', description: 'Recreate the grid pattern from memory.', category: 'Creative', difficulty: 'Hard', icon: '🔳' },
  { id: 'target-clicker', title: 'Target Clicker', description: 'Test your aim and speed.', category: 'Action', difficulty: 'Medium', icon: '🎯' },
  { id: 'mental-math', title: 'Mental Math', description: 'Advanced arithmetic chains.', category: 'Education', difficulty: 'Hard', icon: '🧠' },
  { id: 'emoji-riddle', title: 'Emoji Riddle', description: 'Guess the phrase from the emojis.', category: 'Puzzle', difficulty: 'Easy', icon: '🤔' },
  
  // Final Additions
  { id: 'pixel-art', title: 'Pixel Art', description: 'Relax and draw with pixels.', category: 'Creative', difficulty: 'Easy', icon: '🎨' },
  { id: 'math-adventure', title: 'Math Adventure', description: 'Defeat monsters using math skills.', category: 'Education', difficulty: 'Medium', icon: '⚔️' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-win', title: 'First Blood', description: 'Win your first game', xpReward: 100, icon: '🏆' },
  { id: 'math-whiz', title: 'Math Whiz', description: 'Score 50+ in Quick Math', xpReward: 200, icon: '🧠' },
  { id: 'speed-demon', title: 'Speed Demon', description: 'Reaction time under 250ms', xpReward: 300, icon: '⚡' },
  { id: 'puzzle-master', title: 'Puzzle Master', description: 'Complete 50 puzzles', xpReward: 500, icon: '🧩' },
  { id: 'strategist', title: 'Strategist', description: 'Win Tic Tac Toe 5 times', xpReward: 150, icon: '❌' },
  { id: 'mole-hunter', title: 'Mole Hunter', description: 'Whack 50 moles', xpReward: 250, icon: '🔨' },
  { id: 'simon-master', title: 'Simon Master', description: 'Reach sequence 10 in Simon Says', xpReward: 400, icon: '🔴' },
  { id: 'artist', title: 'Picasso', description: 'Create your first Pixel Art', xpReward: 100, icon: '🎨' },
];

export const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 8000, 12000, 17000, 25000, 35000];

export const NAV_LINKS = [
  { label: 'Home', path: '#/' },
  { label: 'Games', path: '#/games' },
  { label: 'Daily', path: '#/daily' },
  { label: 'Leaderboard', path: '#/leaderboard' },
  { label: 'Blog', path: '#/blog' },
  { label: 'Profile', path: '#/profile' },
];

export const AVATARS = [
    '😎', '🤖', '🦊', '🐯', '🐼', '🐵', '🦄', '🐲', '👽', '👻', '👾', '🤠', '🦸', '🦹', '🧙', '🧚'
];

export const BLOG_POSTS: BlogPost[] = [
  { 
    id: 1, 
    title: 'How to Train Your Brain', 
    category: 'Tips & Tricks', 
    date: 'Oct 12, 2023', 
    excerpt: 'Discover simple daily habits that can improve your cognitive function and memory.',
    content: [
      "Your brain is like a muscle – the more you use it, the stronger it gets. But just like going to the gym, consistency is key.",
      "Start with small puzzles like Sudoku or a quick game of Memory Pairs. These activate your working memory and pattern recognition skills.",
      "Nutrition also plays a huge role. Omega-3 fatty acids, found in fish and walnuts, are essential for brain health. Don't forget to stay hydrated!",
      "Finally, sleep is when your brain processes information. Aim for 7-9 hours of quality sleep to solidify what you've learned during the day."
    ],
    imagePlaceholder: '🧠'
  },
  { 
    id: 2, 
    title: 'The Science of Gamification', 
    category: 'Education', 
    date: 'Oct 15, 2023', 
    excerpt: 'Why do we love games? Learn about the dopamine loops that keep us engaged.',
    content: [
      "Gamification isn't just a buzzword; it's a powerful tool based on human psychology. It leverages our natural desire for competition, achievement, and status.",
      "When you complete a level or earn a badge, your brain releases dopamine, a neurotransmitter associated with pleasure and reward. This reinforces the behavior and motivates you to keep playing.",
      "BrainQuest uses this science to make learning addictive. By tracking your XP and leveling up, we turn cognitive training into a fun, rewarding journey."
    ],
    imagePlaceholder: '🎮'
  },
  { 
    id: 3, 
    title: 'Meet Codey: The AI Behind BrainQuest', 
    category: 'News', 
    date: 'Oct 20, 2023', 
    excerpt: 'An exclusive look at how our friendly AI assistant helps you learn and grow.',
    content: [
      "Codey isn't just a chatbot; he's your personal brain coach. Powered by the advanced Google Gemini API, Codey understands context and emotion.",
      "Whether you're stuck on a math problem or just need a little motivation, Codey is there to help. He can generate hints tailored to your current game state.",
      "We're constantly updating Codey with new capabilities, so don't be afraid to say hello and ask him anything!"
    ],
    imagePlaceholder: '🤖'
  },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 1, title: 'Math Morning', goal: 'Score 50 in Quick Math', reward: 50, isCompleted: false, gameId: 'quick-math' },
  { id: 2, title: 'Sharp Eyes', goal: 'Find all pairs in under 15 moves', reward: 75, isCompleted: true, gameId: 'memory-pairs' },
  { id: 3, title: 'Speedster', goal: 'Reaction time < 300ms', reward: 100, isCompleted: false, gameId: 'reaction-speed' },
];

export const PRIVACY_TEXT = `
**Privacy Policy**

At BrainQuest Universe, we take your privacy seriously. This policy describes how we collect, use, and protect your information.

1. **Information Collection**: We collect game progress data, scores, and settings preferences locally on your device. We do not transmit personal data to external servers without your consent.
2. **AI Interaction**: Chats with Codey (AI) are processed via the Gemini API. These interactions are stateless and not used to train models on your personal data.
3. **Cookies**: We use local storage to save your progress.
`;

export const TERMS_TEXT = `
**Terms of Service**

By using BrainQuest Universe, you agree to the following terms:

1. **Fair Play**: Do not use bots or scripts to manipulate game scores.
2. **Respect**: When providing feedback or contacting support, please remain respectful.
3. **Intellectual Property**: All game assets and code are property of BrainQuest Universe.
`;
