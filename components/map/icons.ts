import L from 'leaflet';
import circle from './circle.svg';
const markerIcon = new L.Icon({
    iconUrl: '/images/circle.svg',
    iconRetinaUrl: '/images/circle.svg',
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(16, 32),
    className: 'leaflet-div-icon'
})
export { markerIcon }