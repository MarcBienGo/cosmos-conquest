var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");

var title = new Image();
title.src = "images/title.png";

var credits = new Image();
credits.src = "images/credits.png";

var stars = new Image();
stars.src = "images/stars.gif";

//ctx.fillRect(0,0,500,500);
title.onload = function(){
    ctx.drawImage(title, 30, 75, 250, 19);
}

/*stars.onload = function(){
    ctx.drawImage(stars, 0, 0, 300, 500);
}*/

credits.onload = function(){
    ctx.drawImage(credits, 105, 220, 100, 50);
}
