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
	interactive,
	onHover,
	onClick,
}: {
	items: MapMarker[];
	markerId: string | null;
	interactive?: boolean;
	onHover?: (id: string | null) => void;
	onClick?: (id: string | null) => void;
}) {
	return (
		<DynamicMap
			items={items}
			interactive={interactive}
			markerId={markerId}
			onHover={onHover}
			onClick={onClick}
		/>
	);
}
