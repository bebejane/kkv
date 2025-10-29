import { AllWorkshopsDocument, WorkshopBySlugDocument, WorkshopDocument } from '@/graphql';
import { default as page } from '../page';
import { apiQuery } from 'next-dato-utils/api';
import { Metadata } from 'next';

export type Props = {
	searchParams: Promise<{ filter?: string }>;
	params: Promise<{ workshop: string }>;
};

export default async function WorkshopPage({ searchParams, params }: Props) {
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
