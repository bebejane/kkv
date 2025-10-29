import Article from '@/components/common/Article';
import s from './page.module.scss';
import { AllCoursesByWorkshopDocument } from '@/graphql';
import { getSession } from '@/lib/auth';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';
import List from '@/components/common/List';

export default async function AllCourses() {
	const session = await getSession();

	const { allCourses } = await apiQuery(AllCoursesByWorkshopDocument, {
		variables: {
			workShopId: session.user.id,
		},
		all: true,
		includeDrafts: true,
		apiToken: process.env.DATOCMS_API_TOKEN,
	});

	return (
		<Article
			title='Kurser'
			headerContent={
				<Link href='/medlem/kurser/ny'>
					<button>Ny kurs</button>
				</Link>
			}
		>
			<List
				className={s.list}
				items={allCourses.map(({ id, title, _status }) => ({
					id,
					title,
					href: `/medlem/kurser/${id}`,
					status: _status,
				}))}
				multi={true}
				empty='Det finns inga kurser ännu'
			/>
		</Article>
	);
}
