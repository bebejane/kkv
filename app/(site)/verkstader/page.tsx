import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument, WorkshopsStartDocument } from '@/graphql';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@/components/common/Article';
import WorkshopsByCity from '@/app/(site)/verkstader/WorkshopsByCity';
import WorkshopFilter from '@/app/(site)/verkstader/WorkshopFilter';

export type WorkshopPageProps = {
	searchParams: Promise<{ filter?: string }>;
	params: Promise<{ workshop: string }>;
};

export default async function WorkshopsPage({ searchParams, params }: WorkshopPageProps) {
	const { workshop: slug } = params ? await params : { workshop: null };
	const filter = (await searchParams).filter ?? 'map';
	const { workshopsStart } = await apiQuery<WorkshopsStartQuery, WorkshopsStartQueryVariables>(
		WorkshopsStartDocument,
		{
			tags: ['workshops_start'],
		}
	);
	const { allWorkshops, draftUrl } = await apiQuery<AllWorkshopsQuery, AllWorkshopsQueryVariables>(
		AllWorkshopsDocument,
		{ all: true, tags: ['workshop'] }
	);

	return (
		<>
			<Article
				title={'Verkstäder'}
				intro={workshopsStart?.intro}
				headerContent={<WorkshopFilter />}
			>
				<WorkshopsByCity workshops={allWorkshops} filter={filter} slug={slug} />
			</Article>
			<DraftMode url={draftUrl} path='/verkstader' />
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	return {
		title: 'Verkstäder',
	} as Metadata;
}
