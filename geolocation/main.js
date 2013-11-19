
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

    var coords = [position.coords.latitude, position.coords.longitude];

    nokia.maps.util.ApplicationContext.set({
        "appId": "YOUR_APP_ID",
        "authenticationToken": "YOUR_AUTHENTICATION_TOKEN"
    });

    var map = new nokia.maps.map.Display(
        mapContainer,
        {   center: coords,
            zoomLevel: 14,
            components: [
                new nokia.maps.map.component.Behavior(),
                new nokia.maps.map.component.ZoomBar(),
                new nokia.maps.map.component.Overview(),
                new nokia.maps.map.component.TypeSelector(),
                new nokia.maps.map.component.ScaleBar()
            ]
        }
    );

    var marker = new nokia.maps.map.StandardMarker(coords, {
        text: ":-)"
    });

    map.objects.add(marker);

}

function showError(error) {

    mapContainer.innerHTML = error.code;

}


