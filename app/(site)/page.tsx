import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import IntroStart from '@/components/start/IntroStart';
import Map from '@/components/start/Map';
import { notFound } from 'next/navigation';

export default async function Home() {
	const { start, allWorkshops, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(
		StartDocument
	);

	if (!start) return notFound();

	return (
		<>
			<div className={s.page}>
				<IntroStart images={start.images as FileField[]} />
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
