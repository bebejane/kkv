import { apiQuery } from 'next-dato-utils/api';
import { AllCoursesDocument, CourseDocument } from '@/graphql';
import { notFound } from '@node_modules/next/navigation';
import Article from '@/components/common/Article';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';

export type CourseProps = {
	params: Promise<{ project: string }>;
};

export default async function CoursePage({ params }: CourseProps) {
	const { project: slug } = await params;
	const { course, draftUrl } = await apiQuery<CourseQuery, CourseQueryVariables>(CourseDocument, {
		variables: {
			slug,
		},
	});

	if (!course) return notFound();

	const { title } = course;

	return (
		<>
			{title}
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

	return allCourses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
	const { course: slug } = await params;
	const { course } = await apiQuery<CourseQuery, CourseQueryVariables>(CourseDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: course.title,
	} as Metadata;
}
