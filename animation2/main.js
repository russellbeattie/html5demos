
var count = 0;

content.addEventListener("webkitAnimationIteration", function(){
    count++;
    counter.innerHTML = count
}, false);

