const PLAYER_SPEED = 3;
const ENEMY_SPEED = 1;
var SPAWN_INTERVAL = 1000; // in milliseconds
const INITIAL_PLAYER_HEALTH = 100;
const LASER_SPEED = 10;


var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    health: INITIAL_PLAYER_HEALTH
};
var enemies = [];
var lasers = [];

// Set to keep track of currently pressed keys
let pressedKeys = new Set();
let mouseX = 0;
let mouseY = 0;

//Variable to track score
var score = 0;
var scoreIncrement = 10;

// Define a variable to track the elapsed time
var elapsedTime = 0;


// Function to handle keydown event
function handleKeyDown(event) {
    if(event.code == "ArrowUp" || event.code == "KeyW"){
        element = document.getElementsByClassName("up")[0];
        element.style.background = "linear-gradient(to top, #565e6a 0%, #333 100%)";
    }else if(event.code == "ArrowDown" || event.code == "KeyS"){
        element = document.getElementsByClassName("down")[0];
        element.style.background = "linear-gradient(to bottom, #565e6a 0%, #333 100%)";
    }else if(event.code == "ArrowLeft" || event.code == "KeyA"){
        element = document.getElementsByClassName("left")[0];
        element.style.background = "linear-gradient(to left, #565e6a 0%, #333 100%)";
    }else if(event.code == "ArrowRight" || event.code == "KeyD"){
        element = document.getElementsByClassName("right")[0];
        element.style.background = "linear-gradient(to right, #565e6a 0%, #333 100%)";
    }

    pressedKeys.add(event.key);
}

// Function to handle keyup event
function handleKeyUp(event) {
    var element;
    if(event.code == "ArrowUp" || event.code == "KeyW"){
        element = document.getElementsByClassName("up")[0];
        element.style.background = "";
    }else if(event.code == "ArrowDown" || event.code == "KeyS"){
        element = document.getElementsByClassName("down")[0];
        element.style.background = "";
    }else if(event.code == "ArrowLeft" || event.code == "KeyA"){
        element = document.getElementsByClassName("left")[0];
        element.style.background = "";
    }else if(event.code == "ArrowRight" || event.code == "KeyD"){
        element = document.getElementsByClassName("right")[0];
        element.style.background = "";
    }else if(event.code == "Space"){
        event.preventDefault();
        element = document.getElementsByClassName("a")[0];
        element.style.boxShadow = "-1px 1px 5px black, 0px 0px 5px black inset";
        element.style.borderWidth = "";
        element.style.lineHeight = "70px";
    }

    pressedKeys.delete(event.key);
}

function leftClickDown(event){
    var element;
    element = document.getElementsByClassName("a")[0];
    element.style.boxShadow = "-1px 1px 1px black, 0px 0px 5px black inset";
    element.style.borderWidth = "0px";
    element.style.lineHeight = "75px";
    spawnLaser();
}

function leftClickUp(event){
    var element;
    element = document.getElementsByClassName("a")[0];
    element.style.boxShadow = "-1px 1px 5px black, 0px 0px 5px black inset";
    element.style.borderWidth = "";
    element.style.lineHeight = "70px";
}

// Event listeners for keydown and keyup events
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

//Event listener for mouse position tracking
document.addEventListener("mousemove", handleMouseMove);

//Event listeners for mouse click events
document.addEventListener("mousedown", leftClickDown);
document.addEventListener("mouseup", leftClickUp);

// Event listener for player movement
document.addEventListener("keydown", movePlayer);

// Function to handle mousemove event
function handleMouseMove(event) {
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
}

// Function to move the player
function movePlayer() {
// Reset player's movement
let dx = 0;
let dy = 0;

// Update player movement based on currently pressed keys (WASD)
if (pressedKeys.has("w") || pressedKeys.has("W")) {
    dy -= PLAYER_SPEED; // Move up
}
if (pressedKeys.has("s") || pressedKeys.has("S")) {
    dy += PLAYER_SPEED; // Move down
}
if (pressedKeys.has("a") || pressedKeys.has("A")) {
    dx -= PLAYER_SPEED; // Move left
}
if (pressedKeys.has("d") || pressedKeys.has("D")) {
    dx += PLAYER_SPEED; // Move right
}

// Update player position
player.x += dx;
player.y += dy;

// Ensure the player stays within the canvas boundaries
if (player.x < 0) {
    player.x = 0;
}
if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
}
if (player.y < 0) {
    player.y = 0;
}
if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
}
}

// Function to spawn enemies
function spawnEnemy() {
    // Randomly determine the side from which the enemy will spawn (1: top, 2: right, 3: bottom, 4: left)
    var side = Math.floor(Math.random() * 4) + 1;
    var enemy = {
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        health: 10
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
        var dx = player.x - enemy.x;
        var dy = player.y - enemy.y;

        // Calculate the Euclidean distance between the enemy and the player
        var distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the velocity components in the x and y directions towards the player
        // by dividing the distance by the total distance and multiplying by the enemy speed
        var velocityX = (dx / distance) * ENEMY_SPEED;
        var velocityY = (dy / distance) * ENEMY_SPEED;
        
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
    const barWidth = 40;
    const barHeight = 5;
    const barX = (player.x - barWidth / 2) + 9.25;
    const barY = player.y + player.height + 5;
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
    drawLasers();
    drawHealthBar();
    drawScore();

    if (player.health <= 0) {
        gameOver();
    }
}

function drawLasers() {
    lasers.forEach(laser => {
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x + laser.dx * LASER_SPEED * 100, laser.y + laser.dy * LASER_SPEED * 100);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    });
}

function spawnLaser() {
    // Calculate angle between player and mouse position
    var dx = mouseX - player.x;
    var dy = mouseY - player.y;
    var angle = Math.atan2(dy, dx);

    // Calculate velocity components based on angle
    var dxLaser = Math.cos(angle);
    var dyLaser = Math.sin(angle);

    // Spawn a new laser object with calculated velocity
    var newLaser = { x: player.x + 10, y: player.y + 10, dx: dxLaser, dy: dyLaser };
    lasers.push(newLaser);
    
    // Remove the laser after 1 second
    setTimeout(() => {
        var index = lasers.indexOf(newLaser);
        if (index !== -1) {
            lasers.splice(index, 1);
        }
    }, 100);
}

// Function to update score
function updateScore() {
    score += scoreIncrement;
}

// Function to display score
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 30); 
}

//Function to check if enemy has damaged player
function checkCollisions() {
    enemies.forEach((enemy, enemyIndex) => {
        // Calculate the distance between player and enemy
        var dxPlayerEnemy = player.x - enemy.x;
        var dyPlayerEnemy = player.y - enemy.y;
        var distancePlayerEnemy = Math.sqrt(dxPlayerEnemy * dxPlayerEnemy + dyPlayerEnemy * dyPlayerEnemy);

        // If the distance is less than the sum of the player's and enemy's radii,
        // it means they are colliding
        if (distancePlayerEnemy < (player.width / 2) + (enemy.width / 2)) {
            // Reduce player's health by 2
            player.health -= enemy.health;

            // Reduce enemy's health
            enemy.health -= 50;

            // Remove the enemy if its health reaches zero
            if (enemy.health <= 0) {
                updateScore();
                enemies.splice(enemyIndex, 1);
            }

            drawHealthBar();

            if (player.health <= 0)
                gameOver();
        }

        lasers.forEach((laser, laserIndex) => {
            // Calculate the distance between the enemy's center and each point along the laser's path
            var dxEnemyCenter;
            var dyEnemyCenter;
            var distanceEnemyCenterLaserEnd;

            for (let i = 0; i <= LASER_SPEED * 100; i++) {
                dxEnemyCenter = enemy.x + enemy.width / 2 - (laser.x + i * laser.dx);
                dyEnemyCenter = enemy.y + enemy.height / 2 - (laser.y + i * laser.dy);
                distanceEnemyCenterLaserEnd = Math.sqrt(dxEnemyCenter * dxEnemyCenter + dyEnemyCenter * dyEnemyCenter);

                // If the distance is less than the sum of the enemy's width and half the laser's width, it means the enemy is hit
                if (distanceEnemyCenterLaserEnd < enemy.width / 2 + 1) {
                    // Reduce enemy's health by 50
                    enemy.health -= 50;

                    // Remove the enemy if its health reaches zero
                    if (enemy.health <= 0) {
                        updateScore();
                        enemies.splice(enemyIndex, 1);
                    }

                    // Remove the laser
                    //lasers.splice(laserIndex, 1);

                    // Display message in console
                    console.log("Enemy hit!");
                    break; // Break the loop if the enemy is hit
                }
            }
        });
    });
}


//Function to increase difficulty at set intervals
function increaseSpawnRate() {
    elapsedTime += 1000;
    if (elapsedTime >= 45000) {
        scoreIncrement++;
        SPAWN_INTERVAL -= 100; 
        elapsedTime = 0; 
    }
}


function gameLoop() {
    movePlayer();
    moveEnemies();
    checkCollisions();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

setInterval(spawnEnemy, SPAWN_INTERVAL);
setInterval(increaseSpawnRate, 1000);