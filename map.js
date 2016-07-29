var config;
var map;
var layerSwitcher = null;
var siteMarker = null;
var locationMarker = null;
var lastLocation = null;


function initMap() {
    var bounds = L.latLngBounds([config.extents[0], config.extents[1]],
                                [config.extents[2], config.extents[3]]);

    var siteIcon = L.icon({iconUrl: 'pin.png', iconSize: [50, 50]});

    var baseMaps = { 'OpenStreetMap':
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.3,
        maxZoom: config.zoom_range[1],
        maxNativeZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    })};

    var overlayMaps = {};

    config.layers.forEach(function(layerName) {
        var layer = L.tileLayer(config.base_url + '/' + layerName + '/{z}/{x}/{y}.png',{
            minZoom: config.zoom_range[0],
            maxZoom: config.zoom_range[1],
            bounds: bounds,
            attribution: '&copy; <a href="https://www.emfcamp.org">Electromagnetic Field</a>'
        });
        overlayMaps[layerName] = layer;
    });

    map = L.map('map', {
        zoom: 17,
        center: [51.21265, -0.60727],
        layers: [baseMaps['OpenStreetMap'], overlayMaps['base']],
    });
    new L.Hash(map);
    layerSwitcher = L.control.layers(baseMaps, overlayMaps).addTo(map);
    L.control.scale({maxWidth: 200}).addTo(map);

    map.on('locationfound', function(e) {
        if (locationMarker == null) {
            locationMarker = L.circle(e.latlng, {color: '#136AEC',
                                                          fillColor: '#2A93EE',
                                                          fillOpacity: 0.3,
                                                          weight: 1,
                                                          opacity: 0.9,
                                                          radius: 10}).addTo(map);
        }
        lastLocation = e;
        updateLocationMarker();
    });

    map.on('locationerror', function(e) {
        if (locationMarker != null) {
            locationMarker.remove();
            locationMarker = null;
        }
    });

    map.on('zoomend', function(e) {
        updateLocationMarker();
        if (map.getZoom() < config.zoom_range[0]) {
            baseMaps['OpenStreetMap'].setOpacity(1);
            if (siteMarker == null) {
                siteMarker = L.marker(bounds.getCenter(), {icon: siteIcon}).addTo(map);
            }
        } else {
            baseMaps['OpenStreetMap'].setOpacity(0.3);
            if (siteMarker != null) {
                siteMarker.remove();
                siteMarker = null;
            }
        }
    });
    map.locate({enableHighAccuracy: true, watch: true})

    $.getJSON('https://wiki.emfcamp.org/villages.php', addVillages);
}

function addVillages(data) {
    let layer = L.featureGroup([]);
    let villages = data['results'];
    for (name in villages) {
        (function(){
            village = villages[name];
            if (village["printouts"]["Village Location"].length == 0) {
                return;
            }
            console.log(village);
            var icon;
            if (village["printouts"]["Image"].length > 0) {
                icon = L.icon({
                    iconUrl: village["printouts"]["Image"][0],
                    iconSize: [21 ,21],
                    iconAnchor: [10, 10]
                })
            } else {
                icon = L.icon({
                    iconUrl: 'pin.png',
                    iconSize: [21 ,21],
                    iconAnchor: [10, 10]
                })
            }
            let marker = L.marker([village["printouts"]["Village Location"][0]["lat"],
                                   village["printouts"]["Village Location"][0]["lon"]], {icon: icon}).addTo(layer);

            a = jQuery("<a/>");
            a.attr("href", village["fullurl"]);
            a.text(village["fulltext"]);
            b = jQuery("<b/>");
            a.appendTo(b);
            p = jQuery("<p>");
            p.text(village["printouts"]["Village Description"][0]);
            marker.bindPopup(b.html() + "<br/>" + p.html());
        })();
    };
    layerSwitcher.addOverlay(layer, 'Villages');
    layer.addTo(map);
}

function updateLocationMarker() {
    if (locationMarker != null) {
        locationMarker.setRadius(lastLocation.accuracy);
        locationMarker.setLatLng(lastLocation.latlng);
    }
}

$(function() {
    $.getJSON('/config.json', function(data) {
        config = data;
        initMap();
    })
});


