// Canvas setup and animation variables
let canvas, ctx;
let animationId;
let isPlaying = false;
let time = 0;
let speed = 5;

// DNA parameters
const dnaStrands = [];
const maxStrands = 50;
const colors = {
    strand1: '#4299e1', // blue-500
    strand2: '#48bb78', // green-500
    connection: '#cbd5e0' // gray-400
};

// Initialize everything when the window loads
window.addEventListener('load', () => {
    setupCanvas();
    setupControls();
    initializeDNA();
    draw(); // Initial draw
});

// Canvas setup function
function setupCanvas() {
    canvas = document.getElementById('dnaCanvas');
    ctx = canvas.getContext('2d');

    // Make canvas responsive
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = window.innerHeight * 0.7; // 70% of viewport height
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// Control setup function
function setupControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const speedControl = document.getElementById('speedControl');

    playBtn.addEventListener('click', () => {
        if (!isPlaying) {
            isPlaying = true;
            animate();
        }
    });

    pauseBtn.addEventListener('click', () => {
        isPlaying = false;
        cancelAnimationFrame(animationId);
    });

    resetBtn.addEventListener('click', () => {
        isPlaying = false;
        cancelAnimationFrame(animationId);
        time = 0;
        dnaStrands.length = 0;
        initializeDNA();
        draw();
    });

    speedControl.addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
    });
}

// Initialize DNA strands
function initializeDNA() {
    for (let i = 0; i < maxStrands; i++) {
        dnaStrands.push({
            y: (canvas.height / maxStrands) * i,
            offset: Math.random() * Math.PI * 2,
            growth: 0
        });
    }
}

// Animation function
function animate() {
    if (!isPlaying) return;
    time += 0.02 * speed;
    draw();
    animationId = requestAnimationFrame(animate);
}

// Main drawing function
function draw() {
    // Clear canvas with slight transparency for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const amplitude = 50;
    const frequency = 0.02;
    const spacing = canvas.height / maxStrands;

    dnaStrands.forEach((strand, index) => {
        // Only draw if the strand has started growing
        if (strand.growth < index) {
            strand.growth += 0.1 * speed;
            return;
        }

        const y = strand.y;
        
        // Draw the double helix
        for (let x = 0; x < canvas.width; x += 20) {
            const wave1 = amplitude * Math.sin(frequency * x + time + strand.offset);
            const wave2 = amplitude * Math.sin(frequency * x + time + strand.offset + Math.PI);

            // Draw connecting lines
            if (x < canvas.width - 20) {
                ctx.beginPath();
                ctx.strokeStyle = colors.connection;
                ctx.lineWidth = 1;
                ctx.moveTo(x, y + wave1);
                ctx.lineTo(x + 20, y + wave2);
                ctx.stroke();
            }

            // Draw the main strands
            ctx.beginPath();
            ctx.fillStyle = colors.strand1;
            ctx.arc(x, y + wave1, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = colors.strand2;
            ctx.arc(x, y + wave2, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Add glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#4299e1';
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Animation error:', e);
    isPlaying = false;
    cancelAnimationFrame(animationId);
    
    // Display error message on canvas
    if (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('An error occurred. Please refresh the page.', canvas.width/2, canvas.height/2);
    }
});
