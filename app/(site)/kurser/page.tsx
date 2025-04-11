import { apiQuery } from 'next-dato-utils/api';
import { AllCoursesDocument } from '@/graphql';
import s from './page.module.scss';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Content from '@/components/common/Content';
import FilterBar from '@/components/common/FilterBar';
import { parseAsString } from 'nuqs/server';
import { DraftMode } from 'next-dato-utils/components';
import classNames from 'classnames';
import { Metadata } from 'next';

const filterParser = parseAsString.withDefault('all');

export default async function CoursesPage({ searchParams }) {
	const filter = filterParser.parseServerSide((await searchParams).filter);
	const { allCourses, draftUrl } = await apiQuery<AllCoursesQuery, AllCoursesQueryVariables>(
		AllCoursesDocument,
		{ all: true, tags: ['course'] }
	);

	const courses = allCourses;
	console.log(allCourses);

	return (
		<>
			<article className={s.courses}>
				<header>
					<h1>Kurser</h1>
					<div className={s.filter}>
						<FilterBar
							href='/kurser'
							value={filter}
							options={[
								{ id: 'all', label: 'Alla' },
								{ id: 'active', label: 'Pågående' },
								{ id: 'finished', label: 'Avslutade' },
							]}
						/>
					</div>
				</header>
				{!courses?.length && (
					<p className={s.empty}>
						Det finns inga {filter === 'finished' ? 'avslutade' : 'pågående'} kurser för närvarande.
					</p>
				)}
				<ul>
					{courses.map(({ id, title, slug }) => (
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
			</article>
			<DraftMode url={draftUrl} path='/kurser' />
		</>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Kurser',
	} as Metadata;
}
