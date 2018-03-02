mapboxgl.accessToken = 'undefined';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'emf.json',
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
    maxWidth: 80,
    unit: 'metric'
}));
