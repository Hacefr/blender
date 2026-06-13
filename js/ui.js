// Setup the canvas context globally so other scripts can draw on it
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Global tracking coordinates for the flashlight spotlight pointer
let currentMouseX = 400;
let currentMouseY = 300;

// Central mouse coordinate scanner hook to update flashlight position fluidly
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    currentMouseX = e.clientX - rect.left;
    currentMouseY = e.clientY - rect.top;
});

// Clears the canvas background cleanly on every single frame loop
function clearGameCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a subtle grid background just to make it look techy
    ctx.strokeStyle = "#161622";
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}
