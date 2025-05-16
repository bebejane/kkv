import s from './page.module.scss';
import { WorkshopDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { updateWorkshop } from '@/lib/actions/update-workshop';
import ProfileForm from './ProfileForm';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';

export type WorkshopProps = {
	params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export default async function Workshop({ params }: WorkshopProps) {
	const { slug: slugParam } = await params;
	const { workshop, allWorkshopGears } = await apiQuery<WorkshopQuery, WorkshopQueryVariables>(
		WorkshopDocument,
		{
			variables: {
				slug: slugParam,
			},
			apiToken: process.env.DATOCMS_API_TOKEN,
		}
	);

	if (!workshop) return notFound();

	const { id, slug, name, description, address, city, postalCode, website, image, gear } = workshop;

	const workshopData = {
		id,
		slug,
		description,
		postal_code: postalCode,
		website,
		address,
		image: image?.id,
		gear: gear.map((g) => ({ value: g.id, label: g.title })),
	};

	return (
		<Article title={'Redigera profil'}>
			<ProfileForm
				data={workshopData}
				workshop={workshop}
				allWorkshopGears={allWorkshopGears}
				onSubmit={async (data) => {
					'use server';
					await updateWorkshop(data);
				}}
			/>
		</Article>
	);
}
