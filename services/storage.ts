
import { User, UserSettings } from '../types';

const STORAGE_KEY = 'brainquest_user_v1';

const DEFAULT_USER: User = {
  name: 'Player One',
  bio: 'Ready to train my brain!',
  avatar: '😎',
  xp: 0,
  level: 1,
  gems: 10,
  unlockedGames: ['quick-math', 'tic-tac-toe', 'memory-pairs', 'pixel-art'],
  achievements: [],
  history: [],
  miniRewards: [],
  settings: { sound: true, notifications: true, theme: 'light' }
};

export const Storage = {
  loadUser(): User {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Merge with default to ensure new fields (like miniRewards) exist if loading old data
        return { ...DEFAULT_USER, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load user data", e);
    }
    return DEFAULT_USER;
  },

  saveUser(user: User) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user data", e);
    }
  },

  resetData() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
};
