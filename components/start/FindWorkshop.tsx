'use client';

import Content from '@/components/common/Content';
import s from './FindWorkshop.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import SwedenMap from '@/components/map';
import Link from 'next/link';
import { groupBy } from 'lodash-es';
import { MapMarker } from '@/components/map/SwedenMap';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import { router } from 'next-dato-utils/config';
import { useRouter } from 'next/navigation';

export type FindWorkshopProps = {
	workshops: StartQuery['allWorkshops'];
	text: StartQuery['start']['findWorkshop'];
};

export default function FindWorkshop({ workshops, text }: FindWorkshopProps) {
	const isDesktop = useIsDesktop();
	const router = useRouter();
	const [cityId, setCityId] = useState<string | null>(null);
	const workshopsByCity = groupBy(workshops, ({ city }) => city.id);
	const markers: MapMarker[] = Object.keys(workshopsByCity).map((cityId) => ({
		id: cityId,
		position: [
			workshopsByCity[cityId][0].coordinates.latitude,
			workshopsByCity[cityId][0].coordinates.longitude,
		],
		label: workshopsByCity[cityId][0].city.title,
	}));

	const cityWorkshops = workshops.filter(({ city }) => city.id === cityId);

	return (
		<div className={s.findworkshop}>
			<div className={s.find}>
				<h2>Hitta verkstad</h2>
				<p>{text}</p>
				{cityWorkshops.length > 0 && (
					<ul className={cn(s.workshops, 'small')}>
						{cityWorkshops.map((workshop) => (
							<li key={workshop.id}>
								<h3>{workshop.name}</h3>
								{workshop.address}, {workshop.postalCode}, {workshop.city.title}
								{workshop.phone && (
									<>
										<br />
										<a href={`tel:${workshop.phone}`}>{workshop.phone}</a>
									</>
								)}
								{workshop.website && (
									<>
										<br />
										{workshop.website.replace('https://', '').replace('http://', '')}
									</>
								)}
								<br />
								<Link href={`/verkstader/${workshop.slug}`}>Läs mer</Link>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className={s.map} onClick={() => !isDesktop && router.push('/verkstader')}>
				<SwedenMap
					items={markers}
					markerId={cityId}
					interactive={isDesktop ? true : false}
					onClick={(id) => setCityId(id === cityId ? null : id)}
				/>
			</div>
		</div>
	);
}
