
var canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

var colorBarHeight = 40;
var color = '#fff';
var isDown = false;
var points = [];

resize();

window.addEventListener("resize", resize, false);

canvas.addEventListener("mousedown", pointerDown, false);
canvas.addEventListener("mousemove", pointerMove, false);
canvas.addEventListener("touchstart", pointerDown, false);
canvas.addEventListener("touchmove", pointerMove, false);
canvas.addEventListener("touchend", pointerUp, false);

document.body.addEventListener("mouseup", pointerUp, false);
document.body.addEventListener("touchcancel", pointerUp, false);

animate();

function drawGradient(){
    var grad = ctx.createLinearGradient(0, canvas.height - colorBarHeight, canvas.width, canvas.height);
    grad.addColorStop(0, 'black');
    grad.addColorStop(1 / 8, 'red');
    grad.addColorStop(2 / 8, 'orange');
    grad.addColorStop(3 / 8, 'yellow');
    grad.addColorStop(4 / 8, 'green')
    grad.addColorStop(5 / 8, 'aqua');
    grad.addColorStop(6 / 8, 'blue');
    grad.addColorStop(7 / 8, 'purple');
    grad.addColorStop(1, 'white');
    ctx.fillStyle = grad;
    ctx.fillRect(0, canvas.height - colorBarHeight, canvas.width, canvas.height);
}


function animate(time) {

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;

    if (points.length > 2) {

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x,points[2].y);
        //ctx.lineTo(points[1].x, points[1].y);
        ctx.stroke();

        points.shift();
    }

    window.requestAnimationFrame(animate);

}

 function resize(e){
    canvas.width  =  window.innerWidth;
    canvas.height = window.innerHeight;
    drawGradient();
 }

function pointerUp() {
    isDown = false;
    points = [];
}

function pointerDown(e) {
    isDown = true;

    var point = {};
    if(e.targetTouches){
        e.preventDefault();
        point.x = e.targetTouches[0].pageX;
        point.y = e.targetTouches[0].pageY;

        if(e.targetTouches.length > 2){
            ctx.fillStyle='rgb(0,0,0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawGradient();
        }

    } else {
        point.x = e.pageX;
        point.y = e.pageY;
    }

    if(point.y > canvas.height - colorBarHeight){
        var data = ctx.getImageData(point.x, point.y, 1, 1).data;
        color = 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
    }

}

function pointerMove(e) {

    var point = {};

    if(e.targetTouches){
        e.preventDefault();
        point.x = e.targetTouches[0].pageX;
        point.y = e.targetTouches[0].pageY;
    } else {
        point.x = e.pageX;
        point.y = e.pageY;
    }

    if(isDown && point.y < canvas.height - colorBarHeight){
        points.push(point);
    }

}

