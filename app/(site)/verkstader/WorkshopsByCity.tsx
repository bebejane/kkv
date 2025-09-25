'use client';

import s from './WorkshopsByCity.module.scss';
import { Markdown } from 'next-dato-utils/components';
import { groupBy } from 'lodash-es';
import List from '@/components/common/List';
import { MapMarker } from '@/components/map/SwedenMap';
import SwedenMap from '@/components/map';
import { useEffect, useState } from 'react';
import { Image } from 'react-datocms';
import cn from 'classnames';
import Link from 'next/link';

export type WorkshopsByCityProps = {
	workshops: AllWorkshopsQuery['allWorkshops'];
	view: string;
	slug?: string;
};

export default function WorkshopsByCity({ workshops, view, slug }: WorkshopsByCityProps) {
	const [cityId, setCityId] = useState<string | null>(workshops.find((item) => item.slug === slug)?.city.id);
	const workshopsByCity = groupBy(workshops, ({ city }) => city.id);

	const markers: MapMarker[] = Object.keys(workshopsByCity).map((cityId) => ({
		id: cityId,
		position: [workshopsByCity[cityId][0].coordinates.latitude, workshopsByCity[cityId][0].coordinates.longitude],
		label: workshopsByCity[cityId][0].city.title,
	}));

	useEffect(() => {
		if (!slug) return;
		const cityId = workshops.find((item) => item.slug === slug)?.city.id;
		setCityId(cityId);
	}, [slug]);

	useEffect(() => {
		const city = workshops.find((item) => item.city?.id === cityId)?.city;

		setTimeout(() => {
			const element = document.getElementById(`list-${city?.id}`);
			element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 100);
	}, [cityId]);

	return (
		<section className={s.workshopsbycity}>
			{view === 'map' && (
				<div className={s.map}>
					<SwedenMap items={markers} markerId={cityId} onClick={(id) => setCityId(id)} />
				</div>
			)}
			<div className={cn(s.wrapper, view === 'list' && s.full)}>
				<List
					itemId={cityId}
					onChange={(id) => setCityId(id)}
					className={s.workshops}
					multi={false}
					items={Object.keys(workshopsByCity)
						.sort((a, b) => workshopsByCity[a][0].city.title.localeCompare(workshopsByCity[b][0].city.title, 'sv'))
						.map((cityId) => ({
							id: cityId,
							title: workshops.find(({ city }) => city.id === cityId)?.city.title,
							content: workshopsByCity[cityId]
								.sort((a, b) => a.name.localeCompare(b.name, 'sv'))
								.map(
									(
										{ id, slug, name, description, address, postalCode, city, website, email, phone, gear, image },
										idx
									) => (
										<div id={slug} key={id} className={s.workshop}>
											{image?.responsiveImage && view === 'list' && (
												<Image data={image.responsiveImage} className={s.imageWrap} imgClassName={s.image} />
											)}
											<div className={cn('small', s.details)}>
												<h3>{name}</h3>
												<Markdown content={description} className={s.description} />
												<ul className={s.meta}>
													{gear.length > 0 && (
														<li>
															<span className='very-small'>UTRUSTNING</span>
															<span>{gear.map(({ title }) => title).join(', ')}</span>
														</li>
													)}
													<li>
														<span className='very-small'>KONTAKT</span>
														<span>
															{address}, {postalCode}, {city.title}
															{website && (
																<>
																	<br />
																	<Link href={website}>Besök hemsida</Link>
																</>
															)}
															{email && (
																<>
																	<br />
																	<a href={`mailto:${email}`}>{email}</a>
																</>
															)}
															{phone && (
																<>
																	<br />
																	<a href={`tel:${phone}`}>{phone}</a>
																</>
															)}
															<br />
														</span>
													</li>
												</ul>
											</div>
										</div>
									)
								),
						}))}
				/>
			</div>
		</section>
	);
}
