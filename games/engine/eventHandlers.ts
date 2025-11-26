// File: games/engine/eventHandlers.ts
// Centralized game event helpers to wire clicks/keyboard/touch to engine

export const EventHandlers = {
  attachKeyboard(engineApi: any) {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "p") engineApi.triggerEvent("togglePause");
      if (e.key === "h") engineApi.requestHint?.({});
      // forward other keys to game module if needed
      engineApi.triggerEvent("key", { key: e.key });
    };
    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  },

  attachTouchControls(container: HTMLElement, engineApi: any) {
    // Example: simple swipe detection
    let startX = 0, startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dy) < 60) {
        const dir = dx > 0 ? "right" : "left";
        engineApi.triggerEvent("swipe", { dir });
      } else if (Math.abs(dy) > 40 && Math.abs(dx) < 60) {
        const dir = dy > 0 ? "down" : "up";
        engineApi.triggerEvent("swipe", { dir });
      }
    };
    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }
};