'use client';

import { MapMarker } from './SwedenMap';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./SwedenMap'), {
	loading: () => <></>,
	ssr: false,
});

export default function SwedenMapWrapper({
	items,
	markerId,
	onHover,
	onClick,
}: {
	items: MapMarker[];
	markerId: string | null;
	onHover?: (id: string | null) => void;
	onClick?: (id: string | null) => void;
}) {
	return <DynamicMap items={items} markerId={markerId} onHover={onHover} onClick={onClick} />;
}
