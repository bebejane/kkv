'use client';
import { MapMarker } from './SwedenMap';
import dynamic from 'next/dynamic';
const DynamicMap = dynamic(() => import('./SwedenMap'), {
	loading: () => <p>Loading...</p>,
	ssr: false,
});

export default function SwedenMapWrapper({ items }: { items: MapMarker[] }) {
	return <DynamicMap items={items} />;
}
