import './index.css';
import mapboxgl from 'mapbox-gl';
import map_style from './map_style.json';
import LayerSwitcher from './layerswitcher.js';
import DistanceMeasure from './distancemeasure.js';
import VillagesEditor from './villages/villages.js';

mapboxgl.accessToken = 'undefined';

if (DEV) {
  map_style['sources']['villages']['data'] = 'http://localhost:5000/api/map';
}

var map = new mapboxgl.Map({
  container: 'map',
  style: map_style,
  hash: true,
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
);

map.addControl(
  new mapboxgl.ScaleControl({
    maxWidth: 200,
    unit: 'metric',
  }),
);

map.addControl(new DistanceMeasure(), 'top-right');
map.addControl(new VillagesEditor('villages', 'villages_symbol'), 'top-right');

var layers = {
  'Buried Services': 'services_',
  Water: 'site_water_',
  DKs: 'dk_',
  'NOC-Physical': 'noc_',
  Power: 'power_',
  Lighting: 'lighting_',
  Villages: 'villages_',
};
var layers_enabled = ['Villages'];
map.addControl(new LayerSwitcher(layers, layers_enabled), 'top-right');
