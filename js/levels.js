// Database for all 50 levels
const LevelDatabase = {};

// Generate standard rules for all 50 levels automatically
function setupLevelDatabase() {
    for (let i = 1; i <= 50; i++) {
        // Base configurations
        let targetWires = 3; // Default requirement
        let description = "Tutorial: Master the wire dragging basics.";

        // Tutorial Escalation (Levels 1 to 10)
        if (i <= 10) {
            targetWires = 2 + Math.floor(i / 2); // Scales up from 2 to 7 wires
            description = `Tutorial Step ${i}: Speed up your connections.`;
        } 
        // Future Enemy Levels (11 to 50)
        else {
            targetWires = 6 + Math.floor(i / 5); // Requirements scale higher
            description = `Chaos Tier: Keep your cool under pressure.`;
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
        console.log(`Level ${Game.currentLevel} Clear!`);
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
        console.log(`Now Entering Level ${Game.currentLevel}`);
    } else {
        console.log("CONGRATULATIONS! You fully cleared Brender!");
        changeState("MENU"); // Bounce back to menu on grand victory
    }
}
