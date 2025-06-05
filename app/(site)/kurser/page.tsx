import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllCoursesDocument, CoursesStartDocument } from '@/graphql';
import { parseAsString } from 'nuqs/server';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@/components/common/Article';
import { notFound } from 'next/navigation';
import ThumbnailContainer from '@/components/common/ThumbnailContainer';
import Thumbnail from '@/components/common/Thumbnail';
import { formatDate } from '@/lib/utils';

const filterParser = parseAsString.withDefault('all');

export default async function CoursesPage({ searchParams }) {
	const filter = filterParser.parseServerSide((await searchParams).filter);
	const { allCourses, draftUrl } = await apiQuery<AllCoursesQuery, AllCoursesQueryVariables>(
		AllCoursesDocument,
		{ all: true, tags: ['course'] }
	);

	const { coursesStart } = await apiQuery<CoursesStartQuery, CoursesStartQueryVariables>(
		CoursesStartDocument,
		{
			tags: ['courses_start'],
		}
	);

	if (!coursesStart) return notFound();

	return (
		<>
			<Article title={'Kurser'} intro={coursesStart?.intro}>
				{!allCourses?.length && (
					<p className={s.empty}>
						Det finns inga {filter === 'finished' ? 'avslutade' : 'pågående'} kurser för närvarande.
					</p>
				)}
				<ThumbnailContainer>
					{allCourses.map(({ id, title, intro, slug, date, where }) => (
						<Thumbnail
							key={id}
							title={title}
							href={`/kurser/${slug}`}
							text={intro}
							markdown={true}
							meta={[
								{
									label: 'När',
									text: formatDate(date),
								},
								{
									label: 'Var',
									text: where,
								},
							]}
						/>
					))}
				</ThumbnailContainer>
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
