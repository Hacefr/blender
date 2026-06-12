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
