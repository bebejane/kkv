import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllCoursesDocument, CoursesStartDocument } from '@/graphql';
import Link from 'next/link';
import { parseAsString } from 'nuqs/server';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@/components/common/Article';
import { notFound } from 'next/navigation';

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
				<ul>
					{allCourses.map(({ id, title, slug }) => (
						<li key={id}>
							<Link href={`/kurser/${slug}`}>
								<figure>
									<figcaption>
										<h2>{title}</h2>
										<div className={s.fade}></div>
									</figcaption>
									<div className={s.fade}></div>
								</figure>
							</Link>
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
