import s from './page.module.scss';
import { createCourse } from '@/lib/actions/create-course';
import CourseForm from '../CourseForm';
import Article from '@/components/common/Article';

export default async function CreateCourse() {
	return (
		<Article title='Ny kurs'>
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
		</Article>
	);
}
