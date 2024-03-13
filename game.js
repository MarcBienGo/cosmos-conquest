const PLAYER_SPEED = 5;
const ENEMY_SPEED = 2;
const SPAWN_INTERVAL = 1000; // in milliseconds
const INITIAL_PLAYER_HEALTH = 100;


let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let scoreDisplay = document.getElementById("score");
let healthCanvas = document.getElementById("healthCanvas");
let healthCtx = healthCanvas.getContext("2d");

let score = 0;
let player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    health: INITIAL_PLAYER_HEALTH
};
let enemies = [];

// Function to move the player
function movePlayer(event) {
    // Update player position based on arrow key presses
    switch (event.key) {
        case "ArrowUp":
            player.y -= PLAYER_SPEED;
            break;
        case "ArrowDown":
            player.y += PLAYER_SPEED;
            break;
        case "ArrowLeft":
            player.x -= PLAYER_SPEED;
            break;
        case "ArrowRight":
            player.x += PLAYER_SPEED;
            break;
    }
}

// Function to spawn enemies
function spawnEnemy() {
    // Randomly determine the side from which the enemy will spawn (1: top, 2: right, 3: bottom, 4: left)
    let side = Math.floor(Math.random() * 4) + 1;
    let enemy = {
        x: 0,
        y: 0,
        width: 20,
        height: 20
    };

    // Randomize the initial position of the enemy based on the chosen side
    switch (side) {
        case 1: // Top side
            enemy.x = Math.random() * canvas.width;
            enemy.y = 0;
            break;
        case 2: // Right side
            enemy.x = canvas.width;
            enemy.y = Math.random() * canvas.height;
            break;
        case 3: // Bottom side
            enemy.x = Math.random() * canvas.width;
            enemy.y = canvas.height;
            break;
        case 4: // Left side
            enemy.x = 0;
            enemy.y = Math.random() * canvas.height;
            break;
    }

    enemies.push(enemy);
}

// Function to move enemies towards the player
function moveEnemies() {
    enemies.forEach(enemy => {

        //calculates distance between player and enemy
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;

        // Calculate the Euclidean distance between the enemy and the player
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the velocity components in the x and y directions towards the player
        // by dividing the distance by the total distance and multiplying by the enemy speed
        let velocityX = (dx / distance) * ENEMY_SPEED;
        let velocityY = (dy / distance) * ENEMY_SPEED;
        
        // Update the enemy's position by adding the velocity components
        enemy.x += velocityX;
        enemy.y += velocityY;
    });
}

// Function to draw player
function drawPlayer() {
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

// Function to draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    });
}

// Function to display game over message
function gameOver() {
    gameRunning = false; // Stop the game loop
    enemies = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

// Function to draw health
function drawHealthBar() {
    const barWidth = 200;
    const barHeight = 20;
    const barX = (canvas.width - barWidth) / 2;
    const barY = 10;
    const healthPercentage = player.health / INITIAL_PLAYER_HEALTH;
    const filledWidth = barWidth * healthPercentage;

    // Background of health bar
    ctx.fillStyle = "lightgray";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Filled Part
    ctx.fillStyle = "green";
    ctx.fillRect(barX, barY, filledWidth, barHeight);

    // Border of Health Bar
    ctx.strokeStyle = "black";
    ctx.strokeRect(barX, barY, barWidth, barHeight);

}

// Main draw function
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawEnemies();
    drawHealthBar();
    scoreDisplay.textContent = `Score: ${score}`;

    if (player.health <= 0) {
        gameOver();
    }
}

// Function to detect collisions between player and enemies
function checkCollisions() {
    enemies.forEach((enemy, index) => {
        // Calculate the distance between player and enemy
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // If the distance is less than the sum of the player's and enemy's radii,
        // it means they are colliding
        if (distance < (player.width / 2) + (enemy.width / 2)) {
            // Reduce player's health by 2
            player.health -= 50;
            // Remove the enemy from the array
            enemies.splice(index, 1);

            drawHealthBar();

            if (player.health <= 0) 
                gameOver();
        }
    });
}

// Main game loop
setInterval(() => {
    moveEnemies();
    checkCollisions(); // Check for collisions
    draw();
}, 100);

setInterval(spawnEnemy, SPAWN_INTERVAL);

// Event listener for player movement
document.addEventListener("keydown", movePlayer);