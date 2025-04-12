import L from 'leaflet';

export const markerIcon = new L.Icon.Default({
    iconUrl: '/marker.svg',
    iconRetinaUrl: '/marker.svg',
    imagePath: '/images',
    iconAnchor: null,
    popupAnchor: [0, -10],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(16, 16),
});

export const markerIconActive = new L.Icon.Default({
    iconUrl: '/marker-active.svg',
    iconRetinaUrl: '/marker-active.svg',
    imagePath: '/images',
    iconAnchor: null,
    popupAnchor: [0, -10],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(16, 16),
});
