import s from './page.module.scss';
import { AllCoursesByWorkshopDocument } from '@/graphql';
import { getSession } from '@/lib/auth';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';

export default async function AllCourses() {
	const session = await getSession();

	const { allCourses } = await apiQuery<
		AllCoursesByWorkshopQuery,
		AllCoursesByWorkshopQueryVariables
	>(AllCoursesByWorkshopDocument, {
		variables: {
			workShopId: session.user.id,
		},
		all: true,
		apiToken: process.env.DATOCMS_API_TOKEN,
	});

	return (
		<>
			<h2>Kurser</h2>
			<ul className={s.courses}>
				{allCourses.map((course) => (
					<li key={course.id}>
						<Link href={`/medlem/kurser/${course.id}`}>{course.title}</Link>
					</li>
				))}
			</ul>
			<br />
			<p>
				<Link href='/medlem/kurser/ny'>
					<button>Ny kurs</button>
				</Link>
			</p>
		</>
	);
}
