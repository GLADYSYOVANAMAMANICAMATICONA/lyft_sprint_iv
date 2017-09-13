'use strict';

const app = {
    map: undefined,
    marcadorOrigen: undefined,
    detalleUbicacionOrigen: undefined,

    init: function () {
        app.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 5,
            center: {
                lat: -9.1191427,
                lng: -77.0349046
            },
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false
        });

        let inputOrigen = document.getElementById('origin');
        let autocompletarOrigen = new google.maps.places.Autocomplete(inputOrigen);
        autocompletarOrigen.bindTo('bounds', app.map);
        app.detalleUbicacionOrigen = new google.maps.InfoWindow();
        app.marcadorOrigen = app.createMarker(app.map);
        app.createListener(autocompletarOrigen, app.detalleUbicacionOrigen, app.marcadorOrigen);
        let inputDestino = document.getElementById('earmark');
        let autoCompletarDestino = new google.maps.places.Autocomplete(inputDestino);
        autoCompletarDestino.bindTo('bounds', app.map);
        let detalleUbicacionDestino = new google.maps.InfoWindow();
        let marcadorDestino = app.createMarker(app.map);

        app.createListener(autoCompletarDestino, detalleUbicacionDestino, marcadorDestino);
        /* Mi ubicación actual */
        app.buscarMiUbicacion();
        document.getElementById("findMe").addEventListener("click", app.buscarMiUbicacion);
        /* Ruta */
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;

        document.getElementById("road").addEventListener("click", function () {
            app.drawRoute(directionsService, directionsDisplay)
        });

        directionsDisplay.setMap(app.map);
    },

    createListener: function (autoCompletar, detalleUbicacion, marcador) {
            autoCompletar.addListener('place_changed', function () {
            detalleUbicacion.close();
            marcador.setVisible(false);
            let place = autoCompletar.getPlace();
            app.marcarUbicacion(place, detalleUbicacion, marcador);
        });
    },

    buscarMiUbicacion: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(app.markAutomaticLocation, app.funcionError);
        }
    },

    funcionError: function (error) {
        alertify.alert("Tenemos un problema para encontrar tu ubicación");
    },

    markAutomaticLocation: function (posicion) {
        let latitud, longitud;
        latitud = posicion.coords.latitude;
        longitud = posicion.coords.longitude;

        app.marcadorOrigen.setPosition(new google.maps.LatLng(latitud, longitud));
        app.map.setCenter({
            lat: latitud,
            lng: longitud
        });
        app.map.setZoom(17);
        app.marcadorOrigen.setVisible(true);
        app.detalleUbicacionOrigen.setContent('<div><strong>Mi ubicación actual</strong><br>');
        app.detalleUbicacionOrigen.open(app.map, app.marcadorOrigen);
    },

    marcarUbicacion: function (place, detalleUbicacion, marker) {
        if (!place.geometry) {
            // Error si no encuentra el lugar indicado
            window.alert("No encontramos el lugar que indicaste: '" + place.name + "'");
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            app.map.fitBounds(place.geometry.viewport);
        } else {
            app.map.setCenter(place.geometry.location);
            app.map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
        }

        detalleUbicacion.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        detalleUbicacion.open(app.map, marker);
    },

    createMarker: function (map) {
        
        let icono = {
            url: 'http://icons.iconarchive.com/icons/icons-land/transporter/128/Taxi-Front-Yellow-icon.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };

        let marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icono,
            anchorPoint: new google.maps.Point(0, -29)
        });


        
        return marker;
    },

    drawRoute: function (directionsService, directionsDisplay) {
        let origin = document.getElementById("origin").value;
        let destination = document.getElementById('earmark').value;

        if (destination != "" && destination != "") {
            directionsService.route({
                    origin: origin,
                    destination: destination,
                    travelMode: "DRIVING"
                },
                function (response, status) {
                    if (status === "OK") {
                        directionsDisplay.setDirections(response);
                    } else {
                        app.errorRoute();
                    }
                });
        }
    },

    errorRoute: function () {
        alert("No ingresaste un origen y un destino validos");
    }

}

function initMap() {
    app.init();
}
