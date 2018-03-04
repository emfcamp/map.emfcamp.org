import mapboxgl from 'mapbox-gl';
import map_style from './map_style.json';

mapboxgl.accessToken = 'undefined';

var map = new mapboxgl.Map({
    container: 'map',
    style: map_style,
    hash: true
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'
}));
