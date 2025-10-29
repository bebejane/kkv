import s from './page.module.scss';
import { WorkshopDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { updateWorkshop } from '@/lib/actions/update-workshop';
import ProfileForm from './ProfileForm';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { getSession } from '@/lib/auth';

export type WorkshopProps = {
	params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export default async function Workshop({}: WorkshopProps) {
	const session = await getSession();

	const { workshop, allWorkshopGears } = await apiQuery(WorkshopDocument, {
		variables: {
			email: session?.user?.email,
		},
		apiToken: process.env.DATOCMS_API_TOKEN,
	});

	if (!workshop) return notFound();

	const { id, slug, description, address, postalCode, website, image, gear } = workshop;

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
