import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, VideoPlayer } from 'next-dato-utils/components';
import { Block } from '@/components/blocks';
import * as StartBlocks from '@/components/blocks/start';
import SwedenMap from '@components/map';
import { MapMarker } from '@components/map/SwedenMap';
import Link from 'next/link';

export default async function Home() {
	const { allWorkshops, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument);

	const items: MapMarker[] = allWorkshops
		.filter(({ coordinates }) => coordinates)
		.map(({ id, coordinates, name }) => ({
			id: id,
			position: [coordinates.latitude, coordinates.longitude],
			label: name,
		}));

	return (
		<>
			<div className={s.page}>
				<div>
					<SwedenMap items={items} />
				</div>
				<div>
					<ul>
						{allWorkshops.map(({ id, slug, name }) => (
							<li key={id}>
								<Link href={`/verkstader/${slug}`}>{name}</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
