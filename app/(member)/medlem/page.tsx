import s from './page.module.scss';
import { AllCoursesByWorkshopDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';

export default async function AllCourses() {
	const { allCourses, draftUrl } = await apiQuery<
		AllCoursesByWorkshopQuery,
		AllCoursesByWorkshopQueryVariables
	>(AllCoursesByWorkshopDocument, {
		variables: {
			workShopId: 'M_btCSrcQy6ek_EeaOQHKA',
		},
		all: true,
	});

	return (
		<>
			<article className={s.page}>
				<h2>Kurser</h2>
				<ul>
					{allCourses.map((course) => (
						<li key={course.id}>
							<Link href={`/medlem/kurs/${course.slug}`}>{course.title}</Link>
						</li>
					))}
				</ul>
				<br />
				<p>
					<Link href='/medlem/kurs/ny'>Ny kurs</Link>
				</p>
			</article>
		</>
	);
}
