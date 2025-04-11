'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import s from './SwedenMap.module.scss';
import swedenGeoJson from './sweden.json' assert { type: 'json' };

export interface MapMarker {
	id: string | number;
	position: [number, number]; // [latitude, longitude]
	label: string;
}

interface SwedenMapProps {
	items: MapMarker[];
}

const markerIcon = new L.Icon.Default({
	iconUrl: '/images/circle.svg',
	iconRetinaUrl: '/images/circle.svg',
	iconAnchor: null,
	popupAnchor: null,
	shadowUrl: null,
	shadowSize: null,
	shadowAnchor: null,
	iconSize: new L.Point(16, 16),
	//className: 'leaflet-div-icon',
});

const center: LatLngExpression = [62.0, 15.0];
const zoomLevel = 4;

const geoJsonStyle = () => ({
	className: s.border,
});

const SwedenMap: React.FC<SwedenMapProps> = ({ items }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (!isClient) return;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
			iconUrl: require('leaflet/dist/images/marker-icon.png'),
			shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
		});
	}, [isClient]);

	if (!isClient) {
		return null;
	}

	return (
		<MapContainer
			center={center}
			zoom={4.5}
			className={s.container}
			attributionControl={false}
			zoomControl={false}
			zoomSnap={0.5}
		>
			<GeoJSON data={swedenGeoJson as GeoJSON.FeatureCollection} style={geoJsonStyle} />
			{items.map(({ id, position, label }) => (
				<Marker
					key={id}
					position={position}
					//icon={markerIcon}
				>
					<Popup>
						<div>{label}</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default SwedenMap;
