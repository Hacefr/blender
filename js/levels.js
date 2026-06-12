// Database for all 50 levels
const LevelDatabase = {};

// Generate standard rules for all 50 levels automatically
function setupLevelDatabase() {
    for (let i = 1; i <= 50; i++) {
        // For the tutorial (1-10) and base system, you must connect all 4 wires on screen
        let targetWires = 4; 
        let description = "Connect all wires to clear the circuit.";

        if (i <= 10) {
            description = "Tutorial Step " + i + ": Speed up your connections.";
        } else {
            description = "Chaos Tier " + (i - 10) + ": Keep your cool under pressure.";
        }

        LevelDatabase[i] = {
            levelNumber: i,
            requiredWires: targetWires,
            info: description
        };
    }
}

// Call the function immediately to build our level rule system
setupLevelDatabase();

// Check if the current active level requirements are met
function checkLevelProgress(completedCount) {
    const currentRule = LevelDatabase[Game.currentLevel];
    
    if (completedCount >= currentRule.requiredWires) {
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
        
        // Update the visual HUD element instantly
        document.getElementById("hud-level-num").innerText = Game.currentLevel;
        console.log("Now Entering Level " + Game.currentLevel);
    } else {
        console.log("CONGRATULATIONS! You fully cleared Brender!");
        changeState("MENU"); // Bounce back to menu on grand victory
    }
}
