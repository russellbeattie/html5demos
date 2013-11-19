var count = 0;
var delay = 0;
var touchstartTimestamp = -1;
var button = window.tapMe;

button.addEventListener("touchend", function() {
    touchstartTimestamp = performance.now();
}, false);

button.addEventListener("touchcancel", function() {
  touchstartTimestamp = performance.now();
}, false);

button.addEventListener("click", function(ev) {
    count++;
    var delta = performance.now() - touchstartTimestamp;
    window.results.innerHTML = delta.toFixed(2) + ' ms';
}, false);
