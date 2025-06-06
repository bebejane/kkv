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

export type WorkshopsByCityProps = {
	workshops: AllWorkshopsQuery['allWorkshops'];
	filter: string;
	slug?: string;
};

export default function WorkshopsByCity({ workshops, filter, slug }: WorkshopsByCityProps) {
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

	useEffect(() => {
		if (!slug) return;
		const cityId = workshops.find(({ slug }) => slug === slug)?.city.id;
		setCityId(cityId);
		setTimeout(() => {
			const element = document.getElementById(slug);
			element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 100);
	}, [slug]);

	return (
		<section className={s.workshopsbycity}>
			{filter === 'map' && (
				<div className={s.map}>
					<SwedenMap items={markers} markerId={cityId} onClick={(id) => setCityId(id)} />
				</div>
			)}
			<div>
				<List
					itemId={cityId}
					onChange={(id) => setCityId(id)}
					className={s.workshops}
					items={Object.keys(workshopsByCity).map((cityId) => ({
						id: cityId,
						title: workshops.find(({ city }) => city.id === cityId)?.city.title,
						content: workshopsByCity[cityId].map(
							({
								id,
								name,
								description,
								address,
								postalCode,
								city,
								website,
								email,
								phone,
								gear,
								image,
							}) => (
								<div id={slug} key={id} className={s.workshop}>
									{image?.responsiveImage && filter === 'list' && (
										<Image
											data={image.responsiveImage}
											className={s.imageWrap}
											imgClassName={s.image}
										/>
									)}
									<div className={cn('small', s.details)}>
										<h3>{name}</h3>
										<Markdown content={description} className={s.description} />
										<ul className={s.meta}>
											<li>
												<span className="very-small">UTRUSTNING</span>
												<span>{gear.map(({ title }) => title).join(', ')}</span>
											</li>
											<li>
												<span className="very-small">KONTAKT</span>
												<span>
													{address}, {postalCode}, {city.title}
													{website && (
														<>
															<br />
															<a href={website}>
																{website.replace('https://', '').replace('http://', '')}
															</a>
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
