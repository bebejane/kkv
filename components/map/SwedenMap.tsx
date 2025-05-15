'use client';

import 'leaflet/dist/leaflet.css';
import s from './SwedenMap.module.scss';
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import swedenGeoJson from './sweden.json' assert { type: 'json' };
import { markerIcon, markerIconActive } from './icons';

export interface MapMarker {
	id: string;
	position: [number, number]; // [latitude, longitude]
	label: string;
}

interface SwedenMapProps {
	items: MapMarker[];
	workshopId: string | null;
	onHover?: (id: string | null) => void;
	onClick?: (id: string | null) => void;
}

const center: LatLngExpression = [62.0, 15.0];
const maxBounds = L.geoJSON(swedenGeoJson as any).getBounds();

const geoJsonStyle = () => ({
	className: s.border,
});

const SwedenMap: React.FC<SwedenMapProps> = ({ items, workshopId, onHover, onClick }) => {
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
			maxZoom={4.5}
			minZoom={4.5}
			maxBounds={maxBounds}
		>
			<GeoJSON data={swedenGeoJson as GeoJSON.FeatureCollection} style={geoJsonStyle} />
			{items.map(({ id, position, label }) => (
				<Marker
					key={id}
					position={position}
					icon={id === workshopId ? markerIconActive : markerIcon}
					eventHandlers={{
						mouseover: () => onHover?.(id),
						mouseout: () => onHover?.(null),
						click: () => onClick?.(id),
					}}
				>
					{!onClick && <Popup className={s.popup}>{label}</Popup>}
				</Marker>
			))}
		</MapContainer>
	);
};

export default SwedenMap;
