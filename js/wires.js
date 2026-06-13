// Wire Component State
let wires = new Array();
let selectedWire = null; 
let levelWiresCompleted = 0; 

const WIRE_COLORS = new Array("#ff3366", "#33ccff", "#ffcc00", "#33ff66");

function initWires() {
    wires = new Array();
    selectedWire = null;
    levelWiresCompleted = 0;
    
    const leftPositions = new Array(150, 250, 350, 450);
    const rightPositions = new Array(150, 250, 350, 450).sort(() => Math.random() - 0.5);

    for (let i = 0; i < WIRE_COLORS.length; i++) {
        wires.push({
            id: i,
            color: WIRE_COLORS[i],
            startX: 100,
            startY: leftPositions[i],
            targetX: 700,
            targetY: rightPositions[i],
            currentX: 100,
            currentY: leftPositions[i],
            isDragging: false,
            isConnected: false
        });
    }
}

function resetWiresForNewLevel() {
    initWires();
}

// Independent, dedicated wire mouse handling click layer
canvas.addEventListener("mousedown", (e) => {
    if (Game.state !== "PLAY") return;
    const rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    // Intercept check priorities: Rocks first, trash piles second
    if (typeof checkCharacterClick === "function" && checkCharacterClick(mx, my)) return;
    if (typeof checkTrashClick === "function" && checkTrashClick(mx, my)) return;

    for (let wire of wires) {
        if (!wire.isConnected) {
            const distance = Math.hypot(mx - wire.startX, my - wire.startY);
            if (distance < 20) {
                wire.isDragging = true;
                selectedWire = wire;
                break;
            }
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (Game.state !== "PLAY") return;
    const rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    if (selectedWire && selectedWire.isDragging) {
        selectedWire.currentX = mx;
        selectedWire.currentY = my;
    }
});

canvas.addEventListener("mouseup", () => {
    if (Game.state !== "PLAY" || !selectedWire) return;

    selectedWire.isDragging = false;
    const distance = Math.hypot(selectedWire.currentX - selectedWire.targetX, selectedWire.currentY - selectedWire.targetY);
    
    if (distance < 25) {
        selectedWire.isConnected = true;
        selectedWire.currentX = selectedWire.targetX;
        selectedWire.currentY = selectedWire.targetY;
        
        levelWiresCompleted++;
        console.log("Connected wire! Total: " + levelWiresCompleted);
        
        if (typeof checkLevelProgress === "function") {
            checkLevelProgress(levelWiresCompleted);
        }
    } else {
        selectedWire.currentX = selectedWire.startX;
        selectedWire.currentY = selectedWire.startY;
    }

    selectedWire = null;
});

function updateAndDrawWires() {
    for (let wire of wires) {
        ctx.fillStyle = wire.color;
        ctx.beginPath();
        ctx.arc(wire.startX, wire.startY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    for (let wire of wires) {
        ctx.fillStyle = wire.color;
        ctx.beginPath();
        ctx.arc(wire.targetX, wire.targetY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(wire.targetX, wire.targetY, 6, 0, Math.PI * 2);
        ctx.fill();
    }

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
