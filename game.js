// Global Game Configuration and State
const Game = {
    state: "MENU",
    currentLevel: 1,
    maxLevels: 50,
    isLoopRunning: false
};

// State Manager: Switches screens and runs custom startup tasks
function changeState(newState) {
    Game.state = newState;
    
    // Hide all layers first
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("settings-menu").classList.add("hidden");
    document.getElementById("extras-menu").classList.add("hidden");
    document.getElementById("gameplay-screen").classList.add("hidden");

    // Open target layer and fire initialization logic
    switch(newState) {
        case "MENU":
            document.getElementById("main-menu").classList.remove("hidden");
            Game.isLoopRunning = false;
            break;
        case "SETTINGS":
            document.getElementById("settings-menu").classList.remove("hidden");
            break;
        case "EXTRAS":
            document.getElementById("extras-menu").classList.remove("hidden");
            break;
        case "PLAY":
            document.getElementById("gameplay-screen").classList.remove("hidden");
            initGameplay();
            break;
    }
}

// Fired once when player clicks PLAY
function initGameplay() {
    console.log(`Initialising Level ${Game.currentLevel}...`);
    document.getElementById("hud-level-num").innerText = Game.currentLevel;
    
    // Start up our loops and wiring modules
    Game.isLoopRunning = true;
    if (typeof initWires === "function") {
        initWires();
    }
    
    // Kick off main engine tick
    requestAnimationFrame(mainGameLoop);
}

// Master Engine Loop
function mainGameLoop() {
    if (!Game.isLoopRunning) return;

    // 1. Clear the canvas using our native UI hooks
    if (typeof clearGameCanvas === "function") {
        clearGameCanvas();
    }

    // 2. Process and draw current active wires
    if (typeof updateAndDrawWires === "function") {
        updateAndDrawWires();
    }

    // Keep the engine spinning
    requestAnimationFrame(mainGameLoop);
}

// Run automatically on page launch
window.onload = () => {
    console.log("Brender Project Loaded Successfully.");
};
