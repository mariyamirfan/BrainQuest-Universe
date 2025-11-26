// File: games/modules/slidingPuzzle.ts
// A minimal sliding-puzzle module integrated with GameEngine.

export const slidingPuzzle = (() => {
  let api: any;
  let containerEl: HTMLElement | null = null;
  let board: number[] = [];
  let cols = 3, rows = 3;

  function shuffle() {
    board = Array.from({ length: cols * rows }, (_, i) => i);
    // Simple shuffle
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
  }

  function render() {
      if (!containerEl) return;
      
      // We render into the div we created in mount()
      const grid = containerEl.querySelector('.sliding-grid') as HTMLElement;
      if(!grid) return;

      grid.innerHTML = ''; // clear
      
      for (let i = 0; i < cols * rows; i++) {
        const idx = board[i];
        const cell = document.createElement("div");
        cell.className = "tile";
        cell.style.background = idx === 0 ? "rgba(0,0,0,0.05)" : "#fff";
        if (idx === 0) cell.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.1)";
        cell.style.borderRadius = "10px";
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.fontSize = "32px";
        cell.style.fontWeight = "bold";
        cell.style.cursor = "pointer";
        cell.style.transition = "all 0.2s";
        cell.style.color = "#333";
        
        // Mobile tap
        cell.onclick = () => moveTile(i);

        cell.textContent = idx === 0 ? "" : String(idx);
        grid.appendChild(cell);
      }
  }

  function moveTile(index: number) {
    const zeroIndex = board.indexOf(0);
    const validMoves = [zeroIndex - 1, zeroIndex + 1, zeroIndex - 3, zeroIndex + 3];
    
    // Check row wrapping for left/right moves
    if (zeroIndex % 3 === 0 && index === zeroIndex - 1) return;
    if (zeroIndex % 3 === 2 && index === zeroIndex + 1) return;

    if (validMoves.includes(index)) {
      [board[index], board[zeroIndex]] = [board[zeroIndex], board[index]];
      render();
      checkWin();
    }
  }

  function checkWin() {
      const winStr = '123456780';
      if (board.join('') === winStr) {
          api.addScore(500);
          api.finish(true);
      }
  }

  return {
    init(engineApi: any) {
      api = engineApi;
    },

    mount(container: HTMLElement, engineApi: any) {
      containerEl = container;
      // create simple grid DOM container
      const wrapper = document.createElement("div");
      wrapper.className = "game-canvas"; // Use class for auto-scaling
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "center";
      
      const grid = document.createElement("div");
      grid.className = "sliding-grid";
      grid.style.width = "400px";
      grid.style.height = "400px";
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      grid.style.gap = "10px";
      grid.style.padding = "10px";
      grid.style.backgroundColor = "#e2e8f0";
      grid.style.borderRadius = "16px";

      wrapper.appendChild(grid);
      container.appendChild(wrapper);
      
      // initial render empty
    },

    start(engineApi: any) {
      shuffle();
      render();
    },

    tick(engineApi: any) {
      // Logic per second
    },

    reset(engineApi: any) {
      shuffle();
      render();
    },

    finish(engineApi: any, win: boolean) {
      // 
    },

    destroy() {
      if (containerEl) containerEl.innerHTML = "";
      containerEl = null;
    }
  };
})();

// Register module
if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).GameModules = (window as any).GameModules || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).GameModules["sliding-puzzle"] = slidingPuzzle;
}