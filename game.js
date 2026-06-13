// Global Game Configuration and State
const Game = {
    state: "MENU",
    currentLevel: 1,
    maxLevels: 50,
    isLoopRunning: false,
    
    // Timer Variables
    levelTimer: 30,      
    maxLevelTime: 30,    
    lastTimeCheck: 0     
};

// State Manager: Switches screens cleanly
function changeState(newState) {
    Game.state = newState;
    
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("settings-menu").classList.add("hidden");
    document.getElementById("extras-menu").classList.add("hidden");
    document.getElementById("gameplay-screen").classList.add("hidden");

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

// Developer Tester Function: Launches the game directly at the selected menu level
function triggerDevLevelTest() {
    const selectElement = document.getElementById("dev-level-select");
    const chosenLevel = parseInt(selectElement.value);
    
    console.log("Developer Warp Triggered! Testing Level: " + chosenLevel);
    Game.currentLevel = chosenLevel;
    
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("gameplay-screen").classList.remove("hidden");
    
    initGameplay();
}

// Fired once when player clicks PLAY or launches a test level
function initGameplay() {
    console.log("Initialising Level " + Game.currentLevel + "...");
    document.getElementById("hud-level-num").innerText = Game.currentLevel;
    
    // Calculate fuse timer window based on difficulty scaling
    Game.maxLevelTime = Math.max(15, 40 - Math.floor(Game.currentLevel / 2));
    Game.levelTimer = Game.maxLevelTime;
    Game.lastTimeCheck = performance.now();

    // Reset components for the fresh level layout
    if (typeof initWires === "function") {
        initWires();
    }
    
    if (typeof startEnemySpawner === "function") {
        startEnemySpawner();
    }

    if (typeof startTrashSpawner === "function") {
        startTrashSpawner();
    }

    // Start engine loop flag
    Game.isLoopRunning = true;
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
        
        Game.maxLevelTime = Math.max(15, 40 - Math.floor(Game.currentLevel / 2));
        Game.levelTimer = Game.maxLevelTime;
        Game.lastTimeCheck = performance.now();

        if (typeof initWires === "function") {
            initWires();
        }
        
        if (typeof startEnemySpawner === "function") {
            startEnemySpawner();
        }

        if (typeof startTrashSpawner === "function") {
            startTrashSpawner();
        }
        
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

// CRITICAL EXTENSION: Global Flashlight Overlay Mask for Level 34+
function applyBlackoutFlashlightEffect() {
    if (Game.currentLevel < 34) return; // Only trigger blackout if Level 34 or higher!

    // Save our canvas state before applying the darkness mask layer
    ctx.save();
    
    // Set our rendering composition rule to "destination-in" 
    // This makes everything invisible EXCEPT where we draw our flashlight circle!
    ctx.globalCompositeOperation = "destination-in";
    
    // Draw the circular beam of your flashlight around your current mouse point coordinates
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(currentMouseX, currentMouseY, 110, 0, Math.PI * 2); // 110px radius headlight circle beam
    ctx.fill();
    
    // Restore the standard drawing canvas composition state
    ctx.restore();
    
    // Fill the empty outer voids manually with solid black veil casing back-paneling
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
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

    // 1. Clear baseline grid background panels
    if (typeof clearGameCanvas === "function") {
        clearGameCanvas();
    }

    // 2. Process and draw active color channel line matches
    if (typeof updateAndDrawWires === "function") {
        updateAndDrawWires();
    }
    
    // 3. Process and draw active shattering rock overlays
    if (typeof updateAndDrawCharacters === "function") {
        updateAndDrawCharacters();
    }

    // 4. Process and draw floating debris components
    if (typeof updateAndDrawTrash === "function") {
        updateAndDrawTrash();
    }

    // 5. INJECT DARKNESS: Blind the screen view if player hits Nelsin's tier zones (Level 34+)
    applyBlackoutFlashlightEffect();

    // 6. Draw the top adrenaline countdown overlay on top of the black mask so players can always see their timer
    drawAdrenalineTimer();

    requestAnimationFrame(mainGameLoop);
}

// Run automatically on page launch to build the drop-down menu lists
window.onload = () => {
    console.log("Brender Project Loaded Successfully.");
    
    const selectElement = document.getElementById("dev-level-select");
    if (selectElement) {
        for (let i = 1; i <= Game.maxLevels; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = "Level " + i;
            
            if (i === 11) option.text += " (Rock Enemy Introduces)";
            if (i === 17) option.text += " (Trash & Bin Introduces)";
            if (i === 21) option.text += " (Color Taker Introduces)";
            if (i === 34) option.text += " (Nelsin Blackout Introduces)";
            if (i === 45) option.text += " (Snail 'The' Introduces)";
            
            selectElement.appendChild(option);
        }
    }
};
