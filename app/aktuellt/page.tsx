import { apiQuery } from 'next-dato-utils/api';
import { AllNewsDocument } from '@/graphql';
import s from './page.module.scss';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Content from '@/components/common/Content';
import { DraftMode } from 'next-dato-utils/components';
import Article from '@/components/common/Article';
import { format } from 'date-fns';
import { Metadata } from 'next';

export type Props = {
	params: Promise<{
		category: 'aktuellt' | 'press';
	}>;
};

export default async function NewsPage({ params }) {
	const { category } = await params;
	const { allNews, draftUrl } = await apiQuery<AllNewsQuery, AllNewsQueryVariables>(
		AllNewsDocument,
		{ tags: ['news', 'press'], all: true }
	);

	return (
		<>
			<Article title={'Aktuellt'} className={s.news}>
				<ul>
					{allNews.map(({ id, title, slug, _firstPublishedAt }, idx) => (
						<li key={id}>
							<div>
								<span className='meta'>{format(new Date(_firstPublishedAt), 'MM/dd yyyy')}</span>
								<Link href={`/aktuellt/${slug}`}>
									<h2>{title}</h2>
								</Link>
							</div>
						</li>
					))}
				</ul>
			</Article>
			<DraftMode url={draftUrl} path={'/aktuellt'} />
		</>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Aktuellt',
	} as Metadata;
}
