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

// Redirected event inputs controlled by global main panel loop hooks
function checkWiresClick(mx, my) {
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
}

function updateWiresDragging(mx, my) {
    if (selectedWire && selectedWire.isDragging) {
        selectedWire.currentX = mx;
        selectedWire.currentY = my;
    }
}

function releaseWiresDrop() {
    if (!selectedWire) return;

    selectedWire.isDragging = false;

    // Use current global positions updated from main engine mouse traps
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
}

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
