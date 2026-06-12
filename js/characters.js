// Master list to track characters active on the screen
let activeEnemies = new Array();

// Pre-loading your custom standalone image stages so they don't flicker
const brawlerImages = new Array();

// Loop from 0 to 5 to load all 6 of your standalone designs
for (let i = 0; i <= 5; i++) {
    let img = new Image();
    img.src = "characters/brawler_" + i + ".png";
    brawlerImages.push(img);
}

// Timer variable to control how often characters pop up
let spawnTimer = null;

// Starts up the enemy spawning system if the level is 11 or higher
function startEnemySpawner() {
    // Clear any old timers first so they do not double up
    if (spawnTimer !== null) {
        clearInterval(spawnTimer);
        spawnTimer = null;
    }

    // CRITICAL FIX: Always read the current level state from the master Game object dynamically
    if (Game && Game.currentLevel >= 11) {
        spawnTimer = setInterval(() => {
            if (Game.isLoopRunning && Game.state === "PLAY") {
                // Limit the maximum number of stacked enemies to 5 at once
                if (activeEnemies.length < 5) {
                    // Pick a random spot on the canvas, keeping them inside the borders
                    let randomX = Math.floor(Math.random() * 450) + 150;
                    let randomY = Math.floor(Math.random() * 250) + 100;
                    
                    spawnCharacter("BRAWLER", randomX, randomY);
                }
            }
        }, 3000); // A new monster spawns every 3 seconds
        console.log("Enemy Spawner ACTIVATED for Level " + Game.currentLevel);
    } else {
        console.log("Enemy Spawner dormant. Current level is below 11.");
    }
}

// Resets and clears the screen when moving up a level stage
function resetCharactersForNewLevel() {
    activeEnemies = new Array();
    startEnemySpawner();
}

// Adds a brand new monster object into our tracking list
function spawnCharacter(enemyType, posX, posY) {
    activeEnemies.push({
        type: enemyType,
        x: posX,
        y: posY,
        width: 180,  // The exact size you chose
        height: 180, // The exact size you chose
        stage: 0     // Starts at 0 (your clean, non-decayed sprite)
    });
    console.log("A wild " + enemyType + " spawned at X:" + posX + " Y:" + posY);
}

// Checks if the player successfully clicked on a monster instead of a wire
function checkCharacterClick(mx, my) {
    // Loop backwards to check the top-most enemy first (Stacking order)
    for (let i = activeEnemies.length - 1; i >= 0; i--) {
        let enemy = activeEnemies[i];
        
        // Simple bounding box collision check
        if (mx >= enemy.x && mx <= enemy.x + enemy.width &&
            my >= enemy.y && my <= enemy.y + enemy.height) {
            
            // Advance to the next decay stage sprite
            enemy.stage++;
            console.log("Monster hit! Progressed to decay stage: " + enemy.stage);
            
            // If it goes past stage 5 (your sad puddle), it disappears completely
            if (enemy.stage > 5) {
                activeEnemies.splice(i, 1);
                console.log("Monster completely destroyed!");
            }
            
            return true; // Intercepted! Blocks the click from hitting wires below
        }
    }
    return false; // No monster was clicked
}

// Main draw renderer called directly by the master game.js loop engine
function updateAndDrawCharacters() {
    for (let enemy of activeEnemies) {
        let currentSprite = brawlerImages[enemy.stage];
        
        // Safety check: Make sure the file exists and is loaded properly
        if (currentSprite && currentSprite.complete && currentSprite.naturalWidth !== 0) {
            ctx.drawImage(currentSprite, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            // SAFE FALLBACK: Draws a temporary solid block if images are empty
            ctx.fillStyle = "#e65c00";
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Print the current status info inside the fallback box
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("BRAWLER STATE", enemy.x + 20, enemy.y + 40);
            ctx.fillText("Stage: " + enemy.stage + " / 5", enemy.x + 20, enemy.y + 70);
            ctx.font = "12px sans-serif";
            ctx.fillText("(Missing Image File)", enemy.x + 20, enemy.y + 140);
        }
    }
}
