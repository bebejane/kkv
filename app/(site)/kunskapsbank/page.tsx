import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllKnowledgeBasesDocument, KnowledgeBaseStartDocument } from '@/graphql';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@/components/common/Article';
import { notFound } from 'next/navigation';
import Thumbnail from '@/components/common/Thumbnail';
import ThumbnailContainer from '@/components/common/ThumbnailContainer';

export default async function WorkshopsPage({ searchParams }) {
	const { allKnowledgeBases, draftUrl } = await apiQuery(AllKnowledgeBasesDocument);
	const { knowledgebaseStart } = await apiQuery(KnowledgeBaseStartDocument);

	if (!knowledgebaseStart) return notFound();

	return (
		<>
			<Article title={'Kunskapsbank'} intro={knowledgebaseStart?.intro} className={s.workshops}>
				<ThumbnailContainer>
					{allKnowledgeBases.map(({ id, title, intro, slug, image }) => (
						<Thumbnail key={id} title={title} href={`/kunskapsbank/${slug}`} text={intro} image={image as FileField} />
					))}
				</ThumbnailContainer>
			</Article>
			<DraftMode url={draftUrl} path='/kunskapsbank' />
		</>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Kunskapsbank',
	} as Metadata;
}
