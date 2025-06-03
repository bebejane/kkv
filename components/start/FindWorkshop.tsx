'use client';

import Content from '@/components/common/Content';
import s from './FindWorkshop.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import SwedenMap from '@/components/map';
import Link from 'next/link';

export type FindWorkshopProps = {
	workshops: StartQuery['allWorkshops'];
	text: StartQuery['start']['findWorkshop'];
};

export default function FindWorkshop({ workshops, text }: FindWorkshopProps) {
	const [workshop, setWorkshop] = useState<StartQuery['allWorkshops'][0]>();

	return (
		<div className={s.findworkshop}>
			<div className={s.find}>
				<h2>Hitta verkstad</h2>
				<p>{text}</p>
				{workshop && (
					<div className={cn(s.workshop, "small")}>
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
								<a href={workshop.website}>
									{workshop.website.replace('https://', '').replace('http://', '')}
								</a>
							</>
						)}
						<br />
						<Link href={`/verkstader/${workshop.slug}`}>Läs mer</Link>
					</div>
				)}
			</div>
			<div className={s.map}>
				<SwedenMap
					items={workshops.map(({ id, coordinates, name }) => ({
						id,
						position: [coordinates.latitude, coordinates.longitude],
						label: name,
					}))}
					markerId={workshop?.id}
					onClick={(id) => setWorkshop(workshops.find((w) => w.id === id) ?? null)}
				/>
			</div>
		</div>
	);
}
