import { CourseByIdDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { updateCourse } from '@/lib/actions/update-course';
import CourseForm from '../CourseForm';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';

export type CourseProps = {
	params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function Course({ params }: CourseProps) {
	const { id: courseId } = await params;
	const { course } = await apiQuery<CourseByIdQuery, CourseByIdQueryVariables>(CourseByIdDocument, {
		variables: {
			id: courseId,
		},
		includeDrafts: true,
		apiToken: process.env.DATOCMS_API_TOKEN,
	});

	if (!course) return notFound();

	const { id, title, slug, intro, text, date, forMembers, where, signUp, openToAll, _status } =
		course;

	const courseData = {
		id,
		title,
		slug,
		intro,
		text,
		date,
		for_members: forMembers,
		where,
		sign_up: signUp,
		open_to_all: openToAll,
		_status,
	};

	return (
		<Article title={`Redigera: ${title}`}>
			<CourseForm
				key={courseData.id}
				course={courseData}
				onSubmit={async (data) => {
					'use server';
					const formData = new FormData();
					Object.entries(data).forEach(([key, value]) => {
						formData.append(key, value.toString());
					});
					await updateCourse(id, formData);
				}}
			/>
		</Article>
	);
}
