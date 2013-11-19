

if (navigator.geolocation) {

    var options = {
            enableHighAccuracy : true,
            timeout : Infinity,
            maximumAge : 0
    };

    navigator.geolocation.getCurrentPosition(showPosition, showError, options);

} else {

    alert('Geolocation is not supported in your browser');

}

function showPosition(position) {

    var content = document.getElementById('content');

    content.innerHTML = 'Latitude: ' + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude;

}

function showError(error){

    alert('Error: ' + error.code);

}
