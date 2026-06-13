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
            // Stop spawners when backing out to menu
            if (typeof startEnemySpawner === "function") {
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
            // Default PLAY button resets progress back to level 1
            Game.currentLevel = 1; 
            document.getElementById("gameplay-screen").classList.remove("hidden");
            initGameplay();
            break;
    }
}

// Developer Tester Function: Launches the game directly at the selected menu level
function triggerDevLevelTest() {
    const selectElement = document.getElementById("dev-level-select");
    const chosenLevel = parseInt(selectElement.value);
    
    console.log("Developer Warp Triggered! Testing Level: " + chosenLevel);
    Game.currentLevel = chosenLevel;
    
    // Swap directly onto the live screen board
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("gameplay-screen").classList.remove("hidden");
    
    initGameplay();
}

// Fired once when player clicks PLAY or launches a test level
function initGameplay() {
    console.log("Initialising Level " + Game.currentLevel + "...");
    document.getElementById("hud-level-num").innerText = Game.currentLevel;
    
    // Reset our completed counts or entities cleanly
    if (typeof resetWiresForNewLevel === "function") {
        resetWiresForNewLevel();
    }
    
    // Calculate fuse timer window based on difficulty scaling
    Game.maxLevelTime = Math.max(15, 40 - Math.floor(Game.currentLevel / 2));
    Game.levelTimer = Game.maxLevelTime;
    Game.lastTimeCheck = performance.now();

    // Start up engine loop flag
    Game.isLoopRunning = true;
    
    // Kick off our character spawning rules
    if (typeof startEnemySpawner === "function") {
        startEnemySpawner();
    }

    // CRITICAL REFRESH TRIGGER: Force start and render trash scatter immediately on level load
    if (typeof startTrashSpawner === "function") {
        startTrashSpawner();
    }
    
    // Kick off main engine tick
    requestAnimationFrame(mainGameLoop);
}

// Master Level Progression Check Hook
function checkLevelProgress(completedCount) {
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
        changeState("MENU"); 
    }
}

// Helper drawing module to render the countdown warning bar across the top
function drawAdrenalineTimer() {
    let percentRemaining = Game.levelTimer / Game.maxLevelTime;
    let barWidth = 600 * percentRemaining; 
    
    let barColor = "#00ffcc";
    if (percentRemaining < 0.5) barColor = "#ffcc00";
    if (percentRemaining < 0.25) barColor = "#ff3333";

    ctx.fillStyle = "#222233";
    ctx.fillRect(100, 20, 600, 15);

    ctx.fillStyle = barColor;
    ctx.fillRect(100, 20, barWidth, 15);
    
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 20, 600, 15);
}

// Master Engine Loop
function mainGameLoop() {
    if (!Game.isLoopRunning) return;

    let currentTime = performance.now();
    let elapsedSeconds = (currentTime - Game.lastTimeCheck) / 1000;
    Game.lastTimeCheck = currentTime;

    Game.levelTimer -= elapsedSeconds;

    if (Game.levelTimer <= 0) {
        Game.isLoopRunning = false;
        console.log("CRITICAL FUSE FAILURE: Game Over!");
        alert("GAME OVER! The circuits overheated before you could finish the wires!");
        changeState("MENU");
        return;
    }

    if (typeof clearGameCanvas === "function") {
        clearGameCanvas();
    }

    if (typeof updateAndDrawWires === "function") {
        updateAndDrawWires();
    }
    
    if (typeof updateAndDrawCharacters === "function") {
        updateAndDrawCharacters();
    }

    if (typeof updateAndDrawTrash === "function") {
        updateAndDrawTrash();
    }

    drawAdrenalineTimer();

    requestAnimationFrame(mainGameLoop);
}

// Run automatically on page launch to build the drop-down menu lists
window.onload = () => {
    console.log("Brender Project Loaded Successfully.");
    
    // Automatically fill our drop-down tester selector element with option rows 1 to 50
    const selectElement = document.getElementById("dev-level-select");
    if (selectElement) {
        for (let i = 1; i <= Game.maxLevels; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = "Level " + i;
            
            // Highlight specialty breaks on the tester box list labels
            if (i === 11) option.text += " (Rock Enemy Introduces)";
            if (i === 17) option.text += " (Trash & Bin Introduces)";
            
            selectElement.appendChild(option);
        }
    }
};
