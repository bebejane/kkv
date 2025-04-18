import s from './page.module.scss';
import { WorkshopDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { updateWorkshop } from '@/lib/actions/update-workshop';
import WorkshopForm from './WorkshopForm';
import notFound from '@app/not-found';

export type WorkshopProps = {
	params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export default async function Workshop({ params }: WorkshopProps) {
	const { slug: slugParam } = await params;
	const { workshop } = await apiQuery<WorkshopQuery, WorkshopQueryVariables>(WorkshopDocument, {
		variables: {
			slug: slugParam,
		},
		apiToken: process.env.DATOCMS_API_TOKEN,
	});

	if (!workshop) return notFound();

	const { id, slug, name, description, address, city, postalCode, website } = workshop;

	const workshopData = {
		id,
		slug,
		description,
		city,
		postal_code: postalCode,
		website,
		address,
	};

	return (
		<div className={s.page}>
			<h1 className={s.title}>Min profil</h1>
			<WorkshopForm
				workshop={workshopData}
				onSubmit={async (data) => {
					'use server';
					await updateWorkshop(data);
				}}
			/>
		</div>
	);
}
