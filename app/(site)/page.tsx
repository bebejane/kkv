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

	const items: MapMarker[] = allWorkshops.map(({ id, coordinates, name }) => ({
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
				<ul>
					{allWorkshops.map((workshop) => (
						<li key={workshop.id}>
							<Link href={`/verkstader/${workshop.slug}`}>{workshop.name}</Link>
						</li>
					))}
				</ul>
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
