import { apiQuery } from 'next-dato-utils/api';
import { AllCoursesDocument, CourseDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import { MetaSectionItem } from '@/components/common/MetaSection';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';

export type CourseProps = {
	params: Promise<{ course: string }>;
	draft?: boolean;
};

export default async function CoursePage(props: CourseProps) {
	const { params, draft } = props;
	const { course: slug } = await params;
	const { course, draftUrl } = await apiQuery<CourseQuery, CourseQueryVariables>(CourseDocument, {
		variables: {
			slug,
		},
		includeDrafts: draft ?? false,
	});

	if (!course) return notFound();

	const { id, workshop, title, intro, text, where, forMembers, signUp, date, openToAll, _status } =
		course;

	const meta: MetaSectionItem[] = [
		{
			id: 'date',
			label: 'När',
			text: capitalize(format(new Date(date), 'd MMMM yyyy', { locale: sv })),
		},
		{
			id: 'where',
			label: 'Var',
			text: where,
		},
		{
			id: 'for',
			label: 'För',
			text: forMembers ? `För medlemmar i ${workshop.name}` : `För alla`,
		},
		{
			id: 'email',
			label: 'Anmäl',
			text: signUp,
			href: signUp,
		},
	];

	return (
		<>
			<Article
				title={title}
				content={text}
				intro={intro}
				markdown={true}
				meta={meta}
				edit={{
					id,
					workshopId: workshop?.id,
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

export async function generateMetadata({ params }: CourseProps) {
	const { course: slug } = await params;
	//@ts-ignore
	const { course } = await apiQuery<CourseQuery, CourseQueryVariables>(CourseDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: course?.title,
	} as Metadata;
}
