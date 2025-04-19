'use client';
import { MapMarker } from './SwedenMap';
import dynamic from 'next/dynamic';
const DynamicMap = dynamic(() => import('./SwedenMap'), {
	loading: () => <></>,
	ssr: false,
});

export default function SwedenMapWrapper({
	items,
	workshopId,
	onHover,
}: {
	items: MapMarker[];
	workshopId: string | null;
	onHover?: (id: string | null) => void;
}) {
	return <DynamicMap items={items} workshopId={workshopId} onHover={onHover} />;
}
