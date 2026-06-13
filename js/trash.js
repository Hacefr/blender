// Trash System State Variables
let trashList = new Array();
let selectedTrash = null; // Tracks which piece of garbage is currently being dragged

// Pre-loading your custom standalone trash assets
const binImage = new Image();
binImage.src = "characters/trashbin.png"; // Stored in your characters folder

const trashAssets = new Array();
const totalTrashTypes = 4; // Shuffling all 4 of your custom art pieces!

for (let i = 1; i <= totalTrashTypes; i++) {
    let img = new Image();
    img.src = "characters/trash_" + i + ".png";
    trashAssets.push(img);
}

// Fixed sizing and placement for the destination garbage bucket (Bottom Right)
const BIN_CONFIG = {
    x: 650,
    y: 450,
    width: 120,
    height: 120
};

// Set up trash sound effects loop with a safe crash fallback trigger
const trashSound = new Audio("sounds/trash.mp3");

function playTrashSound() {
    trashSound.currentTime = 0;
    trashSound.play().catch((error) => {
        console.log("Audio alert: 'sounds/trash.mp3' file is missing or still loading.");
    });
}

// Spawns random debris items instantly when Level 17+ initializes
function startTrashSpawner() {
    trashList = new Array();
    selectedTrash = null;

    if (Game && Game.currentLevel >= 17) {
        // Automatically scale up the amount of trash pieces by level difficulty
        let piecesToSpawn = 2 + Math.floor((Game.currentLevel - 17) / 3);
        
        for (let i = 0; i < piecesToSpawn; i++) {
            // Select random sprite variety index (0 to 3)
            let randomTypeIndex = Math.floor(Math.random() * totalTrashTypes);
            
            // Random scatter locations across the workspace central canvas zone
            let randomX = Math.floor(Math.random() * 400) + 150;
            let randomY = Math.floor(Math.random() * 250) + 100;

            trashList.push({
                assetIndex: randomTypeIndex,
                x: randomX,
                y: randomY,
                width: 70,  // Compact size so it is smaller than the collection bin
                height: 70,
                isDragging: false
            });
        }
        console.log("Trash system ONLINE. Dumped " + piecesToSpawn + " clutter objects.");
    }
}

// Helper checker triggered inside wires click loop to block grabbing behind garbage
function checkTrashClick(mx, my) {
    if (Game.currentLevel < 17) return false;

    // Search through items to see if mouse clicked inside any bounding box
    for (let i = trashList.length - 1; i >= 0; i--) {
        let piece = trashList[i];
        
        if (mx >= piece.x && mx <= piece.x + piece.width &&
            my >= piece.y && my <= piece.y + piece.height) {
            
            piece.isDragging = true;
            selectedTrash = piece;
            console.log("Garbage grabbed! Ready to drag to bin.");
            return true; // Click captured! Stops wire selections underneath
        }
    }
    return false;
}

// Updates movement calculations during mouse dragging ticks
function updateTrashDragging(mx, my) {
    if (selectedTrash && selectedTrash.isDragging) {
        // Center the trash item directly underneath the mouse cursor pointer tip
        selectedTrash.x = mx - (selectedTrash.width / 2);
        selectedTrash.y = my - (selectedTrash.height / 2);
    }
}

// Assesses dropping accuracy when releasing your mouse click
function releaseTrashDrop() {
    if (!selectedTrash) return;

    selectedTrash.isDragging = false;

    // Check if the trash item overlaps with the collection bin drop zone
    let trashCenterX = selectedTrash.x + (selectedTrash.width / 2);
    let trashCenterY = selectedTrash.y + (selectedTrash.height / 2);

    if (trashCenterX >= BIN_CONFIG.x && trashCenterX <= BIN_CONFIG.x + BIN_CONFIG.width &&
        trashCenterY >= BIN_CONFIG.y && trashCenterY <= BIN_CONFIG.y + BIN_CONFIG.height) {
        
        // SUCCESS: Target Hit! Remove from scene list arrays
        let indexToRemove = trashList.indexOf(selectedTrash);
        if (indexToRemove !== -1) {
            trashList.splice(indexToRemove, 1);
            playTrashSound();
            console.log("Debris recycled! Remaining: " + trashList.length);
        }
    }

    selectedTrash = null;
}

// Master draw loop renderer called by global main engine canvas updates
function updateAndDrawTrash() {
    if (Game.currentLevel < 17) return;

    // 1. Draw the Target Disposal Bin asset in the corner frame
    if (binImage && binImage.complete && binImage.naturalWidth !== 0) {
        ctx.drawImage(binImage, BIN_CONFIG.x, BIN_CONFIG.y, BIN_CONFIG.width, BIN_CONFIG.height);
    } else {
        // Safe placeholder box if trashbin.png is missing from folders
        ctx.fillStyle = "#555555";
        ctx.fillRect(BIN_CONFIG.x, BIN_CONFIG.y, BIN_CONFIG.width, BIN_CONFIG.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("TRASH BIN", BIN_CONFIG.x + 20, BIN_CONFIG.y + 65);
    }

    // 2. Draw all active drifting trash pieces scattered around
    for (let piece of trashList) {
        let currentSprite = trashAssets[piece.assetIndex];

        if (currentSprite && currentSprite.complete && currentSprite.naturalWidth !== 0) {
            ctx.drawImage(currentSprite, piece.x, piece.y, piece.width, piece.height);
        } else {
            // Safe fallback boxes colored based on item classification 
            ctx.fillStyle = piece.assetIndex === 0 ? "#cccc00" : piece.assetIndex === 1 ? "#a64dff" : piece.assetIndex === 2 ? "#0066cc" : "#ff3333";
            ctx.fillRect(piece.x, piece.y, piece.width, piece.height);
            ctx.strokeStyle = "#ffffff";
            ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
        }
    }
}
