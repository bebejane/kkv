import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument } from '@/graphql';
import s from './page.module.scss';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Content from '@/components/common/Content';
import FilterBar from '@/components/common/FilterBar';
import { parseAsString } from 'nuqs/server';
import { DraftMode } from 'next-dato-utils/components';
import classNames from 'classnames';
import { Metadata } from 'next';
import Article from '@components/common/Article';

const filterParser = parseAsString.withDefault('all');

export default async function WorkshopsPage({ searchParams }) {
	const filter = filterParser.parseServerSide((await searchParams).filter);
	const { allWorkshops, draftUrl } = await apiQuery<AllWorkshopsQuery, AllWorkshopsQueryVariables>(
		AllWorkshopsDocument,
		{ all: true, tags: ['workshop'] }
	);

	const workshops = allWorkshops;

	return (
		<>
			<Article title={'Verkstäder'} className={s.workshops}>
				<div className={s.filter}>
					<FilterBar
						href='/verkstader'
						value={filter}
						options={[
							{ id: 'all', label: 'Alla' },
							{ id: 'active', label: 'Pågående' },
							{ id: 'finished', label: 'Avslutade' },
						]}
					/>
				</div>
				{!workshops?.length && (
					<p className={s.empty}>
						Det finns inga {filter === 'finished' ? 'avslutade' : 'pågående'} kurser för närvarande.
					</p>
				)}
				<ul className={s.workshops}>
					{workshops.map(({ id, name, slug }) => (
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
