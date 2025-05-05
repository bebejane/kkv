import s from './page.module.scss';
import { CourseDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { updateCourse } from '@/lib/actions/update-course';
import CourseForm from '../CourseForm';
import notFound from '@app/not-found';

export type CourseProps = {
	params: Promise<{ id: string }>;
};
export const dynamic = 'force-dynamic';

export default async function Course({ params }: CourseProps) {
	const { id: idParam } = await params;
	const { course } = await apiQuery<CourseByIdQuery, CourseByIdQueryVariables>(CourseDocument, {
		variables: {
			id: idParam,
		},
		includeDrafts: true,
		apiToken: process.env.DATOCMS_API_TOKEN,
	});

	if (!course) return notFound();

	const { id, title, slug, intro, text, date, openToAll, _status } = course;

	const courseData = {
		id,
		title,
		slug,
		intro,
		text,
		date,
		open_to_all: openToAll,
		_status,
	};

	return (
		<div className={s.page}>
			<h1 className={s.title}>{title}</h1>
			<CourseForm
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
		</div>
	);
}
