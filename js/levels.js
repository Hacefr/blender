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
