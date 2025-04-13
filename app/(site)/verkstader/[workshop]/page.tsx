import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument, WorkshopDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';

export type WorkshopProps = {
	params: Promise<{ workshop: string }>;
};

export default async function WorkshopPage({ params }: WorkshopProps) {
	const { workshop: slug } = await params;
	const { workshop, draftUrl } = await apiQuery<WorkshopQuery, WorkshopQueryVariables>(
		WorkshopDocument,
		{
			variables: {
				slug,
			},
		}
	);

	if (!workshop) return notFound();

	const { id, name, email, image, street, location, coordinates, text } = workshop;

	return (
		<>
			<Article title={name} content={text} image={image as FileField} markdown={true}></Article>
			<DraftMode url={draftUrl} path={`/verkstader/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allWorkshops } = await apiQuery<AllWorkshopsQuery, AllWorkshopsQueryVariables>(
		AllWorkshopsDocument,
		{
			all: true,
		}
	);

	return allWorkshops.map(({ slug: workshop }) => ({ workshop }));
}

export async function generateMetadata({ params }) {
	const { workshop: slug } = await params;
	const { workshop } = await apiQuery<WorkshopQuery, WorkshopQueryVariables>(WorkshopDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: workshop.name,
	} as Metadata;
}
