import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllKnowledgeBasesDocument, KnowledgeBaseStartDocument } from '@/graphql';
import Link from 'next/link';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@/components/common/Article';
import { notFound } from 'next/navigation';

export default async function WorkshopsPage({ searchParams }) {
	const { allKnowledgeBases, draftUrl } = await apiQuery<
		AllKnowledgeBasesQuery,
		AllKnowledgeBasesQueryVariables
	>(AllKnowledgeBasesDocument, { all: true, tags: ['knowledge_base'] });

	const { knowledgebaseStart } = await apiQuery<
		KnowledgeBaseStartQuery,
		KnowledgeBaseStartQueryVariables
	>(KnowledgeBaseStartDocument, {
		tags: ['knowledgebase_start'],
	});

	if (!knowledgebaseStart) return notFound();

	return (
		<>
			<Article title={'Kunskapsbank'} intro={knowledgebaseStart?.intro} className={s.workshops}>
				<ul className={s.workshops}>
					{allKnowledgeBases.map(({ id, title, slug }) => (
						<li key={id}>
							<Link href={`/kunskapsbank/${slug}`}>{title}</Link>
						</li>
					))}
				</ul>
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
