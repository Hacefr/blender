let activeEnemies = new Array();
const brawlerImages = new Array();

for (let i = 0; i <= 5; i++) {
    let img = new Image();
    img.src = "characters/brawler_" + i + ".png";
    brawlerImages.push(img);
}

const crackSound = new Audio("sounds/crack.mp3");

function playCrackSound() {
    crackSound.currentTime = 0;
    crackSound.play().catch((error) => {
        console.log("Audio alert: 'sounds/crack.mp3' file is missing.");
    });
}

let spawnTimer = null;

function startEnemySpawner() {
    if (spawnTimer !== null) {
        clearInterval(spawnTimer);
        spawnTimer = null;
    }

    if (Game && Game.currentLevel >= 11) {
        spawnTimer = setInterval(() => {
            if (Game.isLoopRunning && Game.state === "PLAY") {
                if (activeEnemies.length < 5) {
                    // Centralized anchor bounds tracking
                    let randomX = Math.floor(Math.random() * 400) + 150;
                    let randomY = Math.floor(Math.random() * 200) + 100;
                    
                    spawnCharacter("BRAWLER", randomX, randomY);
                }
            }
        }, 3000); 
        console.log("Enemy Spawner ACTIVATED for Level " + Game.currentLevel);
    } else {
        console.log("Enemy Spawner dormant. Current level is below 11.");
    }
}

function resetCharactersForNewLevel() {
    activeEnemies = new Array();
    startEnemySpawner();
}

function spawnCharacter(enemyType, posX, posY) {
    activeEnemies.push({
        type: enemyType,
        x: posX,
        y: posY,
        width: 180,  
        height: 180, 
        stage: 0     
    });
    console.log("A wild " + enemyType + " spawned at X:" + posX + " Y:" + posY);
}

function checkCharacterClick(mx, my) {
    for (let i = activeEnemies.length - 1; i >= 0; i--) {
        let enemy = activeEnemies[i];
        
        if (mx >= enemy.x && mx <= enemy.x + enemy.width &&
            my >= enemy.y && my <= enemy.y + enemy.height) {
            
            playCrackSound();
            enemy.stage++;
            console.log("Monster hit! Progressed to decay stage: " + enemy.stage);
            
            if (enemy.stage > 5) {
                activeEnemies.splice(i, 1);
                console.log("Monster completely destroyed!");
            }
            
            return true; 
        }
    }
    return false; 
}

function updateAndDrawCharacters() {
    for (let enemy of activeEnemies) {
        let currentSprite = brawlerImages[enemy.stage];
        
        if (currentSprite && currentSprite.complete && currentSprite.naturalWidth !== 0) {
            ctx.drawImage(currentSprite, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            ctx.fillStyle = "#e65c00";
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText("BRAWLER STATE", enemy.x + 20, enemy.y + 40);
            ctx.fillText("Stage: " + enemy.stage + " / 5", enemy.x + 20, enemy.y + 70);
            ctx.font = "12px sans-serif";
            ctx.fillText("(Missing Image File)", enemy.x + 20, enemy.y + 140);
        }
    }
}
