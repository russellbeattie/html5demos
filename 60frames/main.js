var els = [];

for(var x = 0; x < 10; x++){
for(var i =0; i < 6; i++){
    var el = document.createElement('span');
    el.className = 'block';
    el.innerHTML = 6 * x + i;
    document.body.appendChild(el);
    els.push(el);
}
  document.body.appendChild(document.createElement('div'));
}

var timeEl = document.getElementById('time');


var b = 0;
var flip = true;

function animate(time){

  var el = els[b];

  if(flip){
    el.setAttribute('style','color: #fff; background-color: #000');
  } else {
    el.setAttribute('style','color: #000; background-color: #FFF');
  }

timeEl.innerHTML = (time/1000).toFixed(2);

  b++;



  if(b >= 60){
      b = 0;
       flip = !flip;

  }

  window.requestAnimationFrame(animate);

}

animate();
