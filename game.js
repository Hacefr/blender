// Global Game Configuration and State
const Game = {
    state: "MENU",
    currentLevel: 1,
    maxLevels: 50,
    isLoopRunning: false,
    
    // Timer Variables
    levelTimer: 30,      // Current seconds remaining
    maxLevelTime: 30,    // Total allowed seconds for this level stage
    lastTimeCheck: 0     // Performance timestamp helper
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
            // Clear out systems on menu bounce
            if (typeof startEnemySpawner === "function") {
                Game.currentLevel = 1; 
                startEnemySpawner();
            }
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

// Developer Cheat Function to warp straight to the action
function triggerCheatLevel11() {
    console.log("Developer Warp Activated! Setting game state to Level 11...");
    Game.currentLevel = 11;
    changeState("PLAY");
}

// Fired once when player clicks PLAY
function initGameplay() {
    console.log("Initialising Level " + Game.currentLevel + "...");
    document.getElementById("hud-level-num").innerText = Game.currentLevel;
    
    // Calculate fuse timer window based on difficulty scaling
    // Level 1 starts with a generous 40 seconds. Levels 40+ drop down to a strict 15 seconds!
    Game.maxLevelTime = Math.max(15, 40 - Math.floor(Game.currentLevel / 2));
    Game.levelTimer = Game.maxLevelTime;
    Game.lastTimeCheck = performance.now();

    // Start up our loops and wiring modules
    Game.isLoopRunning = true;
    if (typeof initWires === "function") {
        initWires();
    }
    
    // Kick off our character spawning rules on initial load
    if (typeof startEnemySpawner === "function") {
        startEnemySpawner();
    }

    // Launch trash systems on initial startup
    if (typeof startTrashSpawner === "function") {
        startTrashSpawner();
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
        
        // Reset and recalculate the countdown window for the new level tier
        Game.maxLevelTime = Math.max(15, 40 - Math.floor(Game.currentLevel / 2));
        Game.levelTimer = Game.maxLevelTime;
        Game.lastTimeCheck = performance.now();

        // Reset our wire module for the fresh level layout
        if (typeof resetWiresForNewLevel === "function") {
            resetWiresForNewLevel();
        }
        
        // Force check and start the enemy system for the new level height
        if (typeof startEnemySpawner === "function") {
            startEnemySpawner();
        }

        // Re-spawns a fresh batch of trash scatter piles if Level 17+
        if (typeof startTrashSpawner === "function") {
            startTrashSpawner();
        }
        
        // Update the visual HUD element instantly
        document.getElementById("hud-level-num").innerText = Game.currentLevel;
        console.log("Now Entering Level " + Game.currentLevel);
    } else {
        console.log("CONGRATULATIONS! You fully cleared Brender!");
        alert("VICTORY! You connected all channels and cleared Brender!");
        changeState("MENU"); // Bounce back to menu on grand victory
    }
}

// Helper drawing module to render the countdown warning bar across the top
function drawAdrenalineTimer() {
    // Calculate remaining ratio percentage width
    let percentRemaining = Game.levelTimer / Game.maxLevelTime;
    let barWidth = 600 * percentRemaining; // Scale to fit central canvas alignment
    
    // Choose tint context color dynamically (Green = Safe, Red = Absolute Emergency)
    let barColor = "#00ffcc";
    if (percentRemaining < 0.5) barColor = "#ffcc00";
    if (percentRemaining < 0.25) barColor = "#ff3333";

    // Draw background track container bar
    ctx.fillStyle = "#222233";
    ctx.fillRect(100, 20, 600, 15);

    // Draw the shrinking animated foreground energy fuse bar
    ctx.fillStyle = barColor;
    ctx.fillRect(100, 20, barWidth, 15);
    
    // Draw thin visual highlight border casing
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 20, 600, 15);
}

// Master Engine Loop
function mainGameLoop() {
    if (!Game.isLoopRunning) return;

    // 1. Calculate time delta differences to track smooth second tick-downs
    let currentTime = performance.now();
    let elapsedSeconds = (currentTime - Game.lastTimeCheck) / 1000;
    Game.lastTimeCheck = currentTime;

    // Tick the level timer down
    Game.levelTimer -= elapsedSeconds;

    // Check for Game Over Loss conditions
    if (Game.levelTimer <= 0) {
        Game.isLoopRunning = false;
        console.log("CRITICAL FUSE FAILURE: Game Over!");
        alert("GAME OVER! The circuits overheated before you could finish the wires!");
        changeState("MENU");
        return;
    }

    // 2. Clear the canvas using our native UI hooks
    if (typeof clearGameCanvas === "function") {
        clearGameCanvas();
    }

    // 3. Process and draw current active wires
    if (typeof updateAndDrawWires === "function") {
        updateAndDrawWires();
    }
    
    // 4. Process and draw active character overlays on top of the wires
    if (typeof updateAndDrawCharacters === "function") {
        updateAndDrawCharacters();
    }

    // 5. Process and draw active garbage drag obstacles
    if (typeof updateAndDrawTrash === "function") {
        updateAndDrawTrash();
    }

    // 6. Draw the top adrenaline countdown overlay on top of everything
    drawAdrenalineTimer();

    // Keep the engine spinning
    requestAnimationFrame(mainGameLoop);
}

// Run automatically on page launch
window.onload = () => {
    console.log("Brender Project Loaded Successfully.");
};
