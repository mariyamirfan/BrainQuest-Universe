export interface User {
  name: string;
  bio: string; // New
  avatar: string; // New
  xp: number;
  level: number;
  gems: number;
  unlockedGames: string[];
  achievements: string[];
  history: GameHistory[];
  miniRewards: MiniReward[]; // New
  settings: UserSettings;
}

export interface MiniReward {
  type: 'diamond' | 'coin' | 'token';
  amount: number;
}

export interface UserSettings {
  sound: boolean;
  notifications: boolean;
  theme: 'light' | 'dark';
}

export interface GameHistory {
  gameId: string;
  score: number;
  date: string;
  status: 'win' | 'loss';
  stars: number;
}

export interface GameDef {
  id: string;
  title: string;
  description: string;
  category: 'Puzzle' | 'Action' | 'Logic' | 'Memory' | 'Education' | 'Creative';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string[];
  imagePlaceholder: string;
}

export interface DailyChallenge {
  id: number;
  title: string;
  goal: string;
  reward: number;
  isCompleted: boolean;
  gameId: string;
}