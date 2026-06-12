// Wire Component State
let wires = new Array();
let selectedWire = null; // Tracks which wire the player is currently dragging
let levelWiresCompleted = 0; // Tracks successful wire matches in the current level

// Color palette for the classic matching puzzle task
const WIRE_COLORS = new Array("#ff3366", "#33ccff", "#ffcc00", "#33ff66");

// Initialize a brand new set of wires for the level layout
function initWires() {
    wires = new Array();
    selectedWire = null;
    
    // Create start nodes on the left side (fixed pixel heights down the canvas)
    const leftPositions = new Array(150, 250, 350, 450);
    
    // Create target slots on the right side and shuffle them randomly
    const rightPositions = new Array(150, 250, 350, 450).sort(() => Math.random() - 0.5);

    for (let i = 0; i < WIRE_COLORS.length; i++) {
        wires.push({
            id: i,
            color: WIRE_COLORS[i],
            // Left start anchor coordinates
            startX: 100,
            startY: leftPositions[i],
            // Right target anchor coordinates
            targetX: 700,
            targetY: rightPositions[i],
            // Current tip location of the wire during dragging
            currentX: 100,
            currentY: leftPositions[i],
            // Matching status flags
            isDragging: false,
            isConnected: false
        });
    }
}

// Reset function called by levels.js when moving up a level stage
function resetWiresForNewLevel() {
    levelWiresCompleted = 0;
    initWires();
}

// Global mouse position helpers to calculate canvas offsets
let mouseX = 0;
let mouseY = 0;

// Listen for mouse click inside the canvas box
canvas.addEventListener("mousedown", (e) => {
    if (Game.state !== "PLAY") return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // FIRST: Check if player clicked a character. If true, stop here!
    if (typeof checkCharacterClick === "function") {
        if (checkCharacterClick(mouseX, mouseY)) {
            return; 
        }
    }

    // SECOND: Grab the wire if no characters intercepted the click
    for (let wire of wires) {
        if (!wire.isConnected) {
            const distance = Math.hypot(mouseX - wire.startX, mouseY - wire.startY);
            if (distance < 20) {
                wire.isDragging = true;
                selectedWire = wire;
                break;
            }
        }
    }
});

// Update the stretching wire coordinates when moving mouse pointer
canvas.addEventListener("mousemove", (e) => {
    if (Game.state !== "PLAY") return;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (selectedWire && selectedWire.isDragging) {
        selectedWire.currentX = mouseX;
        selectedWire.currentY = mouseY;
    }
});

// Check target connection mechanics when releasing the mouse click
canvas.addEventListener("mouseup", () => {
    if (!selectedWire) return;

    selectedWire.isDragging = false;

    // Check if released within drop zone radius of the correct color target node
    const distance = Math.hypot(mouseX - selectedWire.targetX, mouseY - selectedWire.targetY);
    
    if (distance < 25) {
        // SUCCESSFUL MATCH FOUND
        selectedWire.isConnected = true;
        selectedWire.currentX = selectedWire.targetX;
        selectedWire.currentY = selectedWire.targetY;
        
        levelWiresCompleted++;
        console.log("Connected wire! Total: " + levelWiresCompleted);
        
        // Push progress to levels.js validation controller
        if (typeof checkLevelProgress === "function") {
            checkLevelProgress(levelWiresCompleted);
        }
    } else {
        // MISSED TARGET: Snap the wire back to the left starting block
        selectedWire.currentX = selectedWire.startX;
        selectedWire.currentY = selectedWire.startY;
    }

    selectedWire = null;
});

// Main draw renderer called directly by the root game.js tick engine
function updateAndDrawWires() {
    // 1. Draw Target Nodes on Left Side (Starting anchors)
    for (let wire of wires) {
        ctx.fillStyle = wire.color;
        ctx.beginPath();
        ctx.arc(wire.startX, wire.startY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // 2. Draw Target Slots on Right Side (Color matching bays)
    for (let wire of wires) {
        ctx.fillStyle = wire.color;
        ctx.beginPath();
        ctx.arc(wire.targetX, wire.targetY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw a tiny black center hole to represent a wiring outlet socket
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(wire.targetX, wire.targetY, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Draw All Wires Paths (Straight lines stretched between points)
    for (let wire of wires) {
        ctx.strokeStyle = wire.color;
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(wire.startX, wire.startY);
        ctx.lineTo(wire.currentX, wire.currentY);
        ctx.stroke();
    }
}
