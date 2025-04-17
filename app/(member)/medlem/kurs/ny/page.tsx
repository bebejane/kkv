import s from './page.module.scss';
import { createCourse } from '@app/(member)/medlem/kurs/actions/create';
import CourseForm from '@/app/(member)/medlem/kurs/components/CourseForm';

export default async function CreateCourse() {
	return (
		<div className={s.page}>
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
		</div>
	);
}
