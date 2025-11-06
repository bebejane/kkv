import { AllWorkshopsDocument, WorkshopBySlugDocument } from '@/graphql';
import { default as page } from '../page';
import { apiQuery } from 'next-dato-utils/api';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function WorkshopPage({ searchParams, params }: PageProps<'/verkstader/[workshop]'>) {
	return page({ params, searchParams });
}

export async function generateStaticParams() {
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, {
		all: true,
	});

	return allWorkshops.map(({ slug: workshop }) => ({ workshop }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { workshop: slug } = await params;
	const { workshop } = await apiQuery(WorkshopBySlugDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: workshop.name,
	} as Metadata;
}
