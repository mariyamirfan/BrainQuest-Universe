// File: games/engine/soundManager.ts
// JS module (can convert to TS). Simple preload + play with volume controls.

export const SoundManager = {
  audioCtx: null as AudioContext | null,
  sounds: new Map<string, HTMLAudioElement>(),
  volume: 0.8,

  init() {
    try {
      // create a map of audio files
      // In a real app, these would be real assets. For this demo, we can just log or try to load.
      // We will assume assets exist or fail silently.
      const soundFiles = ['start', 'hint', 'win', 'lose', 'click', 'pause', 'resume', 'save'];
      
      soundFiles.forEach(name => {
          // Placeholder URLs or real ones if you have them. 
          // Using a data URI or empty for now to prevent 404 spam in console for this demo environment
          // unless user has uploaded assets. We'll use a constructor but handle error on play.
          const audio = new Audio();
          // audio.src = `/assets/sounds/${name}.mp3`; 
          this.sounds.set(name, audio);
      });
      
      this.sounds.forEach(a => { a.volume = this.volume; a.preload = "auto"; });
    } catch (err) {
      console.warn("SoundManager init failed", err);
    }
  },

  play(name: string) {
    const a = this.sounds.get(name);
    if (!a) return;
    try {
      if (a.src) {
          a.currentTime = 0;
          a.volume = this.volume;
          a.play().catch(e => { /* ignore autoplay errors */ });
      }
    } catch (err) {
      // autoplay restrictions may block; user gesture needed
      console.warn("Sound play failed", err);
    }
  },

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    this.sounds.forEach(a => a.volume = this.volume);
  }
};

// Initialize automatically
if (typeof window !== "undefined") {
  // Lazy init
  SoundManager.init();
}