import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument, WorkshopsStartDocument } from '@/graphql';
import s from './page.module.scss';
import Link from 'next/link';
import { parseAsString } from 'nuqs/server';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@/components/common/Article';

const filterParser = parseAsString.withDefault('all');

export default async function WorkshopsPage({ searchParams }) {
	const filter = filterParser.parseServerSide((await searchParams).filter);
	const { allWorkshops, draftUrl } = await apiQuery<AllWorkshopsQuery, AllWorkshopsQueryVariables>(
		AllWorkshopsDocument,
		{ all: true, tags: ['workshop'] }
	);

	const { workshopsStart } = await apiQuery<WorkshopsStartQuery, WorkshopsStartQueryVariables>(
		WorkshopsStartDocument,
		{
			tags: ['workshops_start'],
		}
	);

	return (
		<>
			<Article title={'Verkstäder'} className={s.workshops} intro={workshopsStart?.intro}>
				{!allWorkshops?.length && (
					<p className={s.empty}>
						Det finns inga {filter === 'finished' ? 'avslutade' : 'pågående'} kurser för närvarande.
					</p>
				)}
				<ul className={s.workshops}>
					{allWorkshops.map(({ id, name, slug }) => (
						<li key={id}>
							<Link href={`/verkstader/${slug}`}>{name}</Link>
						</li>
					))}
				</ul>
			</Article>
			<DraftMode url={draftUrl} path='/kurser' />
		</>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Kurser',
	} as Metadata;
}
