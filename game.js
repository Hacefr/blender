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
    console.log("Initialising Level " + Game.currentLevel + "...");
    document.getElementById("hud-level-num").innerText = Game.currentLevel;
    
    // Start up our loops and wiring modules
    Game.isLoopRunning = true;
    if (typeof initWires === "function") {
        initWires();
    }
    
    // Kick off our character spawning rules
    if (typeof startEnemySpawner === "function") {
        startEnemySpawner();
    }
    
    // Kick off main engine tick
    requestAnimationFrame(mainGameLoop);
}

// Master Level Progression Check Hook
function checkLevelProgress(completedCount) {
    // You always need exactly 4 wires to clear a board
    if (completedCount >= 4) {
        console.log("Level " + Game.currentLevel + " Clear!");
        advanceToNextLevel();
    }
}

// Moves the player forward or ends the game if they beat level 50
function advanceToNextLevel() {
    if (Game.currentLevel < Game.maxLevels) {
        Game.currentLevel++;
        
        // Reset our wire module for the fresh level layout
        if (typeof resetWiresForNewLevel === "function") {
            resetWiresForNewLevel();
        }
        
        // Reset our characters system for the new level stage
        if (typeof resetCharactersForNewLevel === "function") {
            resetCharactersForNewLevel();
        }
        
        // Update the visual HUD element instantly
        document.getElementById("hud-level-num").innerText = Game.currentLevel;
        console.log("Now Entering Level " + Game.currentLevel);
    } else {
        console.log("CONGRATULATIONS! You fully cleared Brender!");
        changeState("MENU"); // Bounce back to menu on grand victory
    }
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
    
    // 3. Process and draw active character overlays on top of the wires
    if (typeof updateAndDrawCharacters === "function") {
        updateAndDrawCharacters();
    }

    // Keep the engine spinning
    requestAnimationFrame(mainGameLoop);
}

// Run automatically on page launch
window.onload = () => {
    console.log("Brender Project Loaded Successfully.");
};
