'use client';

import 'leaflet/dist/leaflet.css';
import s from './SwedenMap.module.scss';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import swedenGeoJson from './sweden.json' assert { type: 'json' };
import { markerIcon, markerIconActive } from './icons';

export interface MapMarker {
	id: string;
	position: [number, number];
	label: string;
}

interface SwedenMapProps {
	items: MapMarker[];
	markerId: string | null;
	interactive?: boolean;
	onHover?: (id: string | null) => void;
	onClick?: (id: string | null) => void;
}

const center: LatLngExpression = [62.0, 15.0];
const maxBounds = L.geoJSON(swedenGeoJson as any)
	.getBounds()
	.pad(0.05);

const geoJsonStyle = () => ({
	className: s.border,
});

const SwedenMap: React.FC<SwedenMapProps> = ({
	items,
	markerId,
	onHover,
	onClick,
	interactive = true,
}) => {
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
			className={s.container}
			center={center}
			attributionControl={false}
			zoomControl={false}
			scrollWheelZoom={false}
			dragging={false}
			touchZoom={false}
			boxZoom={false}
			doubleClickZoom={false}
			maxBounds={maxBounds}
			bounds={maxBounds}
			zoomSnap={0}
		>
			<GeoJSON data={swedenGeoJson as GeoJSON.FeatureCollection} style={geoJsonStyle} />
			{items.map(({ id, position, label }) => (
				<Marker
					key={id}
					position={position}
					icon={id === markerId ? markerIconActive : markerIcon}
					eventHandlers={
						interactive
							? {
									mouseover: () => onHover?.(id),
									mouseout: () => onHover?.(null),
									click: () => onClick?.(id),
								}
							: {}
					}
				/>
			))}
		</MapContainer>
	);
};

export default SwedenMap;
