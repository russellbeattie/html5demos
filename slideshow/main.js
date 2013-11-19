

var sliding = 0;
var startClientX = 0;
var startPixelOffset = 0;
var pixelOffset = 0;
var currentSlide = 0;

var slideCount = 6;

window.addEventListener("mousedown", slideStart, false);
window.addEventListener("mousemove", slide, false);
window.addEventListener("mouseup", slideEnd, false);

window.addEventListener("touchstart", slideStart, false);
window.addEventListener("touchmove", slide, true);
window.addEventListener("touchend", slideEnd, false);

for(var i = 0; i < slideCount; i++){

    var slide = document.createElement('div');
    slide.setAttribute('class', 'slide');
    window.slides.appendChild(slide);

    var bullet = document.createElement('span');
    bullet.setAttribute('class', 'bullet');
    window.bullets.appendChild(bullet);

}

updateBullets();

function slideStart(e) {

    var clientX = e.targetTouches ?  e.targetTouches[0].clientX : e.clientX;

    if (sliding == 0) {
      sliding = 1;
      startClientX = clientX;
    }
}

function slide(e) {
    e.preventDefault();

    var clientX = e.targetTouches ?  e.targetTouches[0].clientX : e.clientX;

    var deltaSlide = clientX - startClientX;

    if (sliding == 1 && deltaSlide != 0) {
        sliding = 2;
        startPixelOffset = pixelOffset;
    }

    if (sliding == 2) {

        var touchPixelRatio = 1;

        if ((currentSlide == 0 && clientX > startClientX) || (currentSlide == slideCount - 1 && clientX < startClientX)){
            touchPixelRatio = 3;
        }

      pixelOffset = startPixelOffset + deltaSlide / touchPixelRatio;

      window.slides.className = '';
      window.slides.style.webkitTransform = ' translate3d(' + pixelOffset + 'px,0,0)';

    }
}

function slideEnd(e) {
    if (sliding == 2) {
      sliding = 0;
      currentSlide = pixelOffset < startPixelOffset ? currentSlide + 1 : currentSlide - 1;
      currentSlide = Math.min(Math.max(currentSlide, 0), slideCount - 1);
      pixelOffset = currentSlide * -document.body.clientWidth;
      window.temp.innerHTML = '#slides.animate{-webkit-transform:translate3d(' + pixelOffset + 'px,0,0)}';
      window.slides.style.webkitTransform = '';
      window.slides.className = 'animate';
      updateBullets();
    }
}

// remove the selected class from each bullet and set it to the current one
function updateBullets() {

    var bullets = document.getElementsByClassName('bullet');

    for(var i = 0; i < slideCount; i++){

        if(i == currentSlide ){
            bullets[i].className = 'bullet selected';
        } else {
            bullets[i].className = 'bullet';
        }
    }
}

