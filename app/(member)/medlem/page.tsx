import s from './page.module.scss';
import { AllCoursesByWorkshopDocument } from '@/graphql';
import { getSession } from './actions/utils';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';

export default async function AllCourses() {
	const session = await getSession();

	const { allCourses, draftUrl } = await apiQuery<
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
