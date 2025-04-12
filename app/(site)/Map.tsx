'use client';

import SwedenMap from '@components/map';
import { MapMarker } from '@components/map/SwedenMap';
import Link from 'next/link';
import { useState } from 'react';

export type MapProps = {
	allWorkshops: StartQuery['allWorkshops'];
};

export default function Map({ allWorkshops }: MapProps) {
	const [workshopId, setWorkshopId] = useState<string | null>(null);

	const items: MapMarker[] = allWorkshops
		.filter(({ coordinates }) => coordinates)
		.map(({ id, coordinates, name }) => ({
			id: id,
			position: [coordinates.latitude, coordinates.longitude],
			label: name,
		}));

	return (
		<>
			<div>
				<SwedenMap items={items} workshopId={workshopId} />
			</div>
			<div>
				<ul>
					{allWorkshops.map(({ id, slug, name }) => (
						<li
							key={id}
							onMouseEnter={() => setWorkshopId(id)}
							onMouseLeave={() => setWorkshopId(null)}
						>
							<Link href={`/verkstader/${slug}`}>{name}</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
