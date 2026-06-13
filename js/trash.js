let trashList = new Array();
let selectedTrash = null; 

const binImage = new Image();
binImage.src = "characters/trashbin.png"; 

const trashAssets = new Array();
const totalTrashTypes = 4; 

for (let i = 1; i <= totalTrashTypes; i++) {
    let img = new Image();
    img.src = "characters/trash_" + i + ".png";
    trashAssets.push(img);
}

const BIN_CONFIG = {
    x: 650,
    y: 450,
    width: 120,
    height: 120
};

const trashSound = new Audio("sounds/trash.mp3");

function playTrashSound() {
    trashSound.currentTime = 0;
    trashSound.play().catch((error) => {
        console.log("Audio alert: 'sounds/trash.mp3' file is missing.");
    });
}

function startTrashSpawner() {
    trashList = new Array();
    selectedTrash = null;

    if (Game && Game.currentLevel >= 17) {
        let piecesToSpawn = 2 + Math.floor((Game.currentLevel - 17) / 3);
        
        for (let i = 0; i < piecesToSpawn; i++) {
            let randomTypeIndex = Math.floor(Math.random() * totalTrashTypes);
            let randomX = Math.floor(Math.random() * 400) + 150;
            let randomY = Math.floor(Math.random() * 250) + 100;

            trashList.push({
                assetIndex: randomTypeIndex,
                x: randomX,
                y: randomY,
                width: 70,  
                height: 70,
                isDragging: false
            });
        }
        console.log("Trash system ONLINE. Dumped " + piecesToSpawn + " clutter objects.");
    }
}

function checkTrashClick(mx, my) {
    if (Game.currentLevel < 17) return false;

    for (let i = trashList.length - 1; i >= 0; i--) {
        let piece = trashList[i];
        
        if (mx >= piece.x && mx <= piece.x + piece.width &&
            my >= piece.y && my <= piece.y + piece.height) {
            
            piece.isDragging = true;
            selectedTrash = piece;
            console.log("Garbage grabbed! Ready to drag to bin.");
            return true; 
        }
    }
    return false;
}

function updateTrashDragging(mx, my) {
    if (selectedTrash && selectedTrash.isDragging) {
        selectedTrash.x = mx - (selectedTrash.width / 2);
        selectedTrash.y = my - (selectedTrash.height / 2);
    }
}

function releaseTrashDrop() {
    if (!selectedTrash) return;

    selectedTrash.isDragging = false;

    let trashCenterX = selectedTrash.x + (selectedTrash.width / 2);
    let trashCenterY = selectedTrash.y + (selectedTrash.height / 2);

    if (trashCenterX >= BIN_CONFIG.x && trashCenterX <= BIN_CONFIG.x + BIN_CONFIG.width &&
        trashCenterY >= BIN_CONFIG.y && trashCenterY <= BIN_CONFIG.y + BIN_CONFIG.height) {
        
        let indexToRemove = trashList.indexOf(selectedTrash);
        if (indexToRemove !== -1) {
            trashList.splice(indexToRemove, 1);
            playTrashSound();
            console.log("Debris recycled! Remaining: " + trashList.length);
        }
    }

    selectedTrash = null;
}

function updateAndDrawTrash() {
    if (Game.currentLevel < 17) return;

    if (binImage && binImage.complete && binImage.naturalWidth !== 0) {
        ctx.drawImage(binImage, BIN_CONFIG.x, BIN_CONFIG.y, BIN_CONFIG.width, BIN_CONFIG.height);
    } else {
        ctx.fillStyle = "#555555";
        ctx.fillRect(BIN_CONFIG.x, BIN_CONFIG.y, BIN_CONFIG.width, BIN_CONFIG.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("TRASH BIN", BIN_CONFIG.x + 20, BIN_CONFIG.y + 65);
    }

    for (let piece of trashList) {
        let currentSprite = trashAssets[piece.assetIndex];

        if (currentSprite && currentSprite.complete && currentSprite.naturalWidth !== 0) {
            ctx.drawImage(currentSprite, piece.x, piece.y, piece.width, piece.height);
        } else {
            ctx.fillStyle = piece.assetIndex === 0 ? "#cccc00" : piece.assetIndex === 1 ? "#a64dff" : piece.assetIndex === 2 ? "#0066cc" : "#ff3333";
            ctx.fillRect(piece.x, piece.y, piece.width, piece.height);
            ctx.strokeStyle = "#ffffff";
            ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
        }
    }
}
