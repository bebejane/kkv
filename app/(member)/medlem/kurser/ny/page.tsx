import s from './page.module.scss';
import { createCourse } from '@/lib/actions/create-course';
import CourseForm from '../CourseForm';

export default async function CreateCourse() {
	return (
		<>
			<h1 className={s.title}>Ny kurs</h1>
			<CourseForm
				onSubmit={async (data) => {
					'use server';
					const formData = new FormData();
					Object.entries(data).forEach(([key, value]) => {
						formData.append(key, value.toString());
					});
					await createCourse(formData);
				}}
			/>
		</>
	);
}
