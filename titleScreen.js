/*
Hey guys! This js file links to the titleScreen.html file for testing purposes. 
I didn't want to add it to script.js myself since you guys both understand the
rest of the code better. Feel free to add this in when you're ready.
*/

var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");

// in-game music
var introMusic; 
var gameMusic;
var introMusicCount = 0;


var title = new Image();
title.src = "images/title.png";
title.onload = function() {
    // to load the image before it's drawn onto canvas
}

var pressSpace = new Image();
pressSpace.src = "images/pressSpace.png";
pressSpace.onload = function() {
    // to load the image before it's drawn onto canvas
}

var credits = new Image();
credits.src = "images/credits.png";
credits.onload = function() {
    // to load the image before it's drawn onto canvas
}


var gameOverOptions = new Image();
gameOverOptions.src = "images/gameOverOptions.png";
gameOverOptions.onload = function() {
    // to load the image before it's drawn onto canvas
}


window.addEventListener("load", loadTitleScreen);
document.addEventListener("keydown", spaceBarPressed);
document.addEventListener("keydown", playAgain);



// loads the title screen
function loadTitleScreen()
{
    ctx.fillRect(0,0, 500, 500);
    ctx.drawImage(title, 30, 75, 250, 19);
    ctx.drawImage(credits, 105, 220, 100, 50);
    ctx.drawImage(pressSpace, 15, 150, 280, 17);
}


/*
Because of certain browser settings, playIntroMusic() is not
called onload. Instead, when the browser is clicked (anywhere)
playIntroMusic() is called. Therefore, to start the music, the
user must click the browser.
*/
function playIntroMusic()
{
    // to make sure that the intro music is not called repeatedly
    // if the user clicks the screen multiple times
    if(introMusicCount < 1)
    {
        introMusic = new Audio("audio/introMusic.mp3");
        introMusic.play();
        introMusicCount++;
    }
}



function spaceBarPressed(event) 
{
    if (event.keyCode === 32 || event.key === " ") 
    {
        // start the game loop
        // start the spawn rate
        introMusic.pause();
        playGameMusic();
    }
}



function playGameMusic()
{
    gameMusic = new Audio("audio/gameMusic.mp3");
    gameMusic.play();
}



function playAgain(event)
{
    if(event.keyCode === 32)
    {
        // restart game loop
    }
    else if (event.keyCode === 27)
    {
        // reloads the title scren if user presses esc key
        loadTitleScreen();
    }
}