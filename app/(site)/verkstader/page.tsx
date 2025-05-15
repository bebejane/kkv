import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument, WorkshopsStartDocument } from '@/graphql';
import { DraftMode, Markdown } from 'next-dato-utils/components';
import { Metadata } from 'next';
import { groupBy } from 'lodash-es';
import Article from '@/components/common/Article';
import List from '@/components/common/List';
import { MapMarker } from '@/components/map/SwedenMap';
import SwedenMap from '@/components/map';

export default async function WorkshopsPage({ searchParams }) {
	const { workshopsStart } = await apiQuery<WorkshopsStartQuery, WorkshopsStartQueryVariables>(
		WorkshopsStartDocument,
		{
			tags: ['workshops_start'],
		}
	);
	const { allWorkshops, draftUrl } = await apiQuery<AllWorkshopsQuery, AllWorkshopsQueryVariables>(
		AllWorkshopsDocument,
		{ all: true, tags: ['workshop'] }
	);

	const workshopsByCity = groupBy(allWorkshops, ({ city }) => city.title);
	const markers: MapMarker[] = allWorkshops
		.filter(({ coordinates }) => coordinates)
		.map(({ id, coordinates, name }) => ({
			id: id,
			position: [coordinates.latitude, coordinates.longitude],
			label: name,
		}));

	return (
		<>
			<Article title={'Verkstäder'} intro={workshopsStart?.intro}>
				<section className={s.wrap}>
					<div className={s.map}>
						<SwedenMap items={markers} workshopId={null} onHover={null} />
					</div>
					<List
						className={s.workshops}
						items={Object.keys(workshopsByCity).map((city) => ({
							id: city,
							title: city,
							content: workshopsByCity[city].map(
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
								}) => (
									<div key={id} className={s.workshop}>
										<h3>{name}</h3>
										<Markdown content={description} className={s.description} />
										<ul className={s.meta}>
											<li>
												<span>Utrustning</span>
												<span>{gear.map(({ title }) => title).join(', ')}</span>
											</li>
											<li>
												<span>Kontakt</span>
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
								)
							),
						}))}
					/>
				</section>
			</Article>
			<DraftMode url={draftUrl} path='/verkstader' />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	return {
		title: 'Verkstäder',
	} as Metadata;
}
