import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import Map from './Map';

export default async function Home() {
	const { allWorkshops, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument);

	return (
		<>
			<div className={s.page}>
				<Map allWorkshops={allWorkshops} />
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
