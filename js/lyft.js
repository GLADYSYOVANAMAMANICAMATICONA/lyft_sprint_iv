'use strict';
const app = {

    map : undefined,
    markerOrigin : undefined,
    detaillocationorigin : undefined,
    setContent : undefined,

    init : function() {
        app.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 5,
            center: { lat: -9.1191427,
                      lng: -77.0349046
                     },
            mapTypeControl: true,
            zoomControl: true,
            streetViewControl: true
        });

        let inputOrigin = document.getElementById('origin');
        let autoCompleteOrigin = new google.maps.places.Autocomplete(inputOrigin);
        autoCompleteOrigin.bindTo('bounds', app.map);
        let detaillocationorigin = new google.maps.InfoWindow();
        let markerOrigin = app.createMark(app.map);

        app.createListener(autoCompleteOrigin, detaillocationorigin, markerOrigin);

        let inputearmark = document.getElementById('earmark');
        let autocompleteearmark = new google.maps.places.Autocomplete(inputearmark);
        autocompleteearmark.bindTo('bounds', app.map);
        let detailLocationEarmark = new google.maps.InfoWindow();
        let markerEarmark = app.createMark(app.map);

        app.createListener(autocompleteearmark, detailLocationEarmark, markerEarmark);

        /* Mi ubicación actual */
        document.getElementById("findMe").addEventListener("click", app.findMyLocation);
        /* road */
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;

        document.getElementById("road").addEventListener("click", function () {app.drawPath(directionsService, directionsDisplay) });

        directionsDisplay.setMap(app.map);
    },

         createListener : function (autocomplete, detailLocation, marker) {
            autocomplete.addListener('place_changed', function () {
                detailLocation.close();
                marker.setVisible(false);
                let place = autocomplete.getPlace();
                app.markerLocation(place, detailLocation, marker);
            });
        },

        findMyLocation : function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(app.markerLocationAutomatic, app.functionerror);
            }
        },

         functionerror : function (error) {
            alert("Tenemos un problema para encontrar tu ubicación");
        },

        markerLocationAutomatic : function (position) {
            let latitud, longitud;
            console.log("aslkdsalkdj")
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;

            //markerOrigin.setPosition(new google.maps.LatLng(latitud, longitud));
            app.map.setCenter({ lat: latitud, lng: longitud });
            app.map.setZoom(17);

            //inputOrigin.value = new google.maps.LatLng(latitud,longitud); //CON ESTO LOGRO QUE EN EL INPUT ORIGEN SALGA LAS COORDENADAS DE MI UBICACION

            //markerOrigin.setVisible(true);

            app.detaillocationorigin.setContent('<div><strong>Mi ubicación actual</strong><br>');
            detaillocationorigin.open(app.map,markerOrigin);
        },

         markerLocation : function (place, detailLocation, marker) {
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

            detailLocation.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            detailLocation.open(app.map, marker);
        },

         createMark : function(map) {
            let icono = {
                url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Bike-icon.png',
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                width: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            };

            let marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                icon: icono,
                widthPoint: new google.maps.Point(0, -29)
            });

            return marker;
        },

        drawPath : function (directionsService, directionsDisplay) {
            let origin = $('#origin').val();
            let destination = $('#earmark').val();

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
                            error();
                        }
                    });
            }
        },

        error : function() {
            alert("No ingresaste un origen y un earmark validos");
        }
    };

function initMap () {
    app.init ();
}
