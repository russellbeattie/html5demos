
var canvas = window.gameCanvas;
canvas.width  = window.innerWidth - 4;
canvas.height = window.innerHeight -4;

var ctx = canvas.getContext('2d');

var center = {};
var balls = [];
var explosions = [];

// touch
var touchX = 0;
var touchY = 0;

var startX = 0;
var startY = 0;

var isDown = false;

var prevTime = Date.now();

var scoreNum = 0;
var hitsNum = 0;
var maxHits = 20;
var hitsRadius = 0;

var colors = ["#BC008D", "#0E51A7", "#FF9E00", "#B7F200"];
var total = colors.length;
var level = 0;

var baseSpeed = 1;
var steps = 25;

var running = false;

// Add events

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mousemove", mouseMove, false);
canvas.addEventListener("touchstart", touchDown, false);
canvas.addEventListener("touchmove", touchMove, false);
canvas.addEventListener("touchend", touchUp, false);

window.addEventListener("resize", resize, false);

document.body.addEventListener("mouseup", mouseUp, false);
document.body.addEventListener("touchcancel", touchUp, false);

window.end.addEventListener("click", init, false);

// start

resize();

init();

animate(0);

// main

function init(){

    center = {
        x: 0,
        y: 0,
        radius: 0,
        position: 0,
        prevPosition: 0,
        velocity: 0
    }

    balls = [];
    explosions = [];

    scoreNum = 0;
    hitsNum = 0;
    hitsRadius = 0;

    level = 0;

    resize();

    initBalls();

    updateScore();

    window.end.style.display = 'none';

    running = true;

}


function animate(time) {

    if(running){


        ctx.fillStyle='rgba(0,0,0,0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCenter();

        drawExplosions();

        drawBalls();

       // drawTouch();
    }

    window.requestAnimationFrame(animate);

}

// drawing

var prevDelta = 0;

function drawCenter(){

    if(isDown){

        var startRadians = Math.atan2(startX - center.x, startY - center.y);
        var radians = Math.atan2(touchX - center.x, touchY - center.y);

        var deltaRadians = startRadians - radians;

        center.position = center.prevPosition + deltaRadians;

        var vel = deltaRadians - prevDelta;
        prevDelta = deltaRadians;

       center.velocity = vel;

        //console.log(deltaRadians, vel);

    }


    if(!isDown){
        center.velocity = center.velocity - (center.velocity * .03);
        center.position += center.velocity;
    }

  var position = center.position;

  for (var i = 0; i < colors.length; ++i) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, center.radius, position, position + (Math.PI * 2 * (1 / total)), false);
    ctx.lineTo(center.x, center.y);
    ctx.fill();
    position += Math.PI * 2 * (1/ total);
  }

    var targetRadius = Math.ceil(hitsNum * (center.radius/maxHits));

    if(hitsRadius < targetRadius){
        hitsRadius = hitsRadius + .3;
    }

    ctx.beginPath();
    ctx.arc(center.x, center.y, Math.floor(hitsRadius), 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000";
    ctx.fill();

}

function drawBalls(){

    for(var i = 0; i < balls.length; i++){

        var ball = balls[i];

        ball.radius = Math.floor(center.radius/8)

        // Calculate direction towards center
        var toCenterX = center.x - ball.x;
        var toCenterY = center.y - ball.y;

        // Normalize
        var toCenterLength = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
        toCenterX = toCenterX / toCenterLength;
        toCenterY = toCenterY / toCenterLength;

        // Move towards the center
        ball.x += toCenterX * ball.speed;
        ball.y += toCenterY * ball.speed;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = ball.color;
        ctx.fill();

        // check collision

        var xd = center.x - ball.x;
        var yd = center.y - ball.y;

        var sumRadius = center.radius + ball.radius -2;
        var sqrRadius = sumRadius * sumRadius;

        var distSqr = (xd * xd) + (yd * yd);

        if (distSqr <= sqrRadius){

            checkMatch(ball);

            ball = balls[i] = createBall(ball.color);

        }



    }

}

function drawTouch(){
    if(isDown){
        ctx.beginPath();
        ctx.arc(touchX, touchY, 40, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fill();
    }
}

function drawExplosions(){

    var newExplosions = [];

    for(var i = 0; i < explosions.length; i++){

        var explosion = explosions[i];

        explosion.step++;

        if(explosion.step >= steps){
            continue;
        }

        var opacity = (1 - (explosion.step / steps)).toFixed(2);

        var colors = hexToRgb(explosion.color);

        var fill = 'rgba(' + colors.r + ',' + colors.g + ',' + colors.b + ',' + opacity + ')';

        explosion.radius++;

        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = fill;
        ctx.fill();

        newExplosions.push(explosion);

    }

    explosions = newExplosions;

}

// misc

function updateScore(){
    window.score.innerHTML = scoreNum;
}

function checkMatch(ball){

        // Calculate direction towards center
        var toCenterX = center.x - ball.x;
        var toCenterY = center.y - ball.y;

        // Normalize
        var toCenterLength = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
        toCenterX = toCenterX / toCenterLength;
        toCenterY = toCenterY / toCenterLength;

        // Move towards the center
        var x = ball.x;
        var y = ball.y;
        x += toCenterX * (ball.radius + 2);
        y += toCenterY * (ball.radius + 2);

        var p = ctx.getImageData(x, y, 1, 1).data;

        var hex = ("#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)).toUpperCase();

        if(hex == ball.color){

            scoreNum += 10;
            if(scoreNum % 100 == 0){
                level = level + 0.2;
            }
            updateScore();

            createExplosion(ball);

        }  else {

            hitsNum++;

            if(hitsNum >= maxHits){

                endGame();

            }

        }

}

function initBalls(){

    var c =0;
    for(var i = 0; i < total; i++){

        if( c >= colors.length ){
            c = 0;
        }
        var color = colors[c];

        balls[i] = createBall(color);

        c++;

    }

}


function createBall(color){

        color = color || "#FFFFFF";

        var distance = balls.length + 2;
        var angle = Math.random() * Math.PI * 2;
        var x = center.x + (center.radius * distance) * Math.cos(angle);
        var y = center.y + (center.radius * distance) * Math.sin(angle);

        var radius = Math.floor(center.radius / 8);

        var speed = baseSpeed + level;

        var ball = {
            x: x,
            y: y,
            radius: radius,
            color: color,
            speed: speed
        };

        return ball;

}

function createExplosion(ball){

    var explosion = {
        x: ball.x,
        y: ball.y,
        color: ball.color,
        radius: ball.radius,
        step: 0
    }

    explosions.push(explosion);

}


function rotateCenter(){

    var startRadians = Math.atan2(startX - center.x, startY - center.y);
    var radians = Math.atan2(touchX - center.x, touchY - center.y);

    var deltaRadians = startRadians - radians;

    center.position = center.prevPosition + deltaRadians;

    var newTime = Date.now();
    var interval = newTime - prevTime;
    prevTime = newTime;

    center.velocity = (deltaRadians / interval) * 10;

    console.log(interval);

}

function endGame(){

    running = false;

    window.score.innerHTML = '';
    window.end.innerHTML = "<h1>GAME OVER!</h1><h2>Score: " + scoreNum+ "</h2><h3>Touch screen to play again.</h3>";
    window.end.style.display = 'block';

}


// utility


function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255){
        return "000";
    } else {
        return ((r << 16) | (g << 8) | b).toString(16);
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



// events



function resize(){

    canvas.width  = window.innerWidth - 4;
    canvas.height = window.innerHeight -4;

    center.radius = Math.floor(Math.min(canvas.width, canvas.height) / 5) ;

    center.x = canvas.width / 2;
    center.y = canvas.height / 2;

}

function mouseUp() {
  isDown = false;
}

function touchUp() {
  isDown = false;
}

function mouseDown(e) {

    isDown = true;

    touchX = e.pageX;
    touchY = e.pageY;

    startX = touchX;
    startY = touchY;

    center.velocity = 0;
    center.prevPosition = center.position;
}

function touchDown(e) {

    isDown = true;

    touchX = e.targetTouches[0].pageX;
    touchY = e.targetTouches[0].pageY;

    startX = touchX;
    startY = touchY;

    center.velocity = 0;
    center.prevPosition = center.position;
}

function mouseMove(e) {
    touchX = e.pageX;
    touchY = e.pageY;
}

function touchMove(e) {
    e.preventDefault();
    touchX = e.targetTouches[0].pageX;
    touchY = e.targetTouches[0].pageY;
}



