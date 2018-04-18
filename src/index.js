import './index.css'
import mapboxgl from 'mapbox-gl'
import map_style from './map_style.json'
import LayerSwitcher from './layerswitcher.js'

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
    maxWidth: 200,
    unit: 'metric'
}));


var layers = {
    'Buried Services': 'services_',
    'Water': 'site_water_',
    'NOC': 'noc_'
}
map.addControl(new LayerSwitcher(layers), 'top-right');
