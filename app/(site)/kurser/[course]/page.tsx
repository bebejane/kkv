import { apiQuery } from 'next-dato-utils/api';
import { AllCoursesDocument, CourseDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';

export type CourseProps = {
	params: Promise<{ course: string }>;
};

export default async function CoursePage({ params }: CourseProps) {
	const { course: slug } = await params;
	const { course, draftUrl } = await apiQuery<CourseQuery, CourseQueryVariables>(CourseDocument, {
		variables: {
			slug,
		},
		includeDrafts: true,
	});

	if (!course) return notFound();

	const { id, workshop, title, intro, text, date, openToAll, _status } = course;

	return (
		<>
			<Article
				title={title}
				content={text}
				intro={intro}
				markdown={true}
				edit={{
					id: workshop?.id,
					pathname: `/medlem/kurser/${id}`,
					status: _status,
				}}
			>
				<section>
					<p>
						{date}
						<br />
						{openToAll ? 'Öppen för alla' : 'Endast för medlemmar'}
					</p>
				</section>
			</Article>
			<DraftMode url={draftUrl} path={`/kurser/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allCourses } = await apiQuery<AllCoursesQuery, AllCoursesQueryVariables>(
		AllCoursesDocument,
		{
			all: true,
		}
	);

	return allCourses.map(({ slug: course }) => ({ course }));
}

export async function generateMetadata({ params }) {
	const { course: slug } = await params;
	const { course } = await apiQuery<CourseQuery, CourseQueryVariables>(CourseDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: course?.title,
	} as Metadata;
}
