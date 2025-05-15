import { apiQuery } from 'next-dato-utils/api';
import { AllKnowledgeBasesDocument, KnowledgeBaseDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';

export type KnowledgeBaseProps = {
	params: Promise<{ knowledge: string }>;
};

export default async function KnowledgeBasePage({ params }: KnowledgeBaseProps) {
	const { knowledge: slug } = await params;
	const { knowledgeBase, draftUrl } = await apiQuery<
		KnowledgeBaseQuery,
		KnowledgeBaseQueryVariables
	>(KnowledgeBaseDocument, {
		variables: {
			slug,
		},
	});

	if (!knowledgeBase) return notFound();

	const { id, title, image, content } = knowledgeBase;

	return (
		<>
			<Article title={title} content={content} image={image as FileField} />
			<DraftMode url={draftUrl} path={`/kunskapsbank/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allKnowledgeBases } = await apiQuery<
		AllKnowledgeBasesQuery,
		AllKnowledgeBasesQueryVariables
	>(AllKnowledgeBasesDocument, {
		all: true,
	});

	return allKnowledgeBases.map(({ slug: knowledge }) => ({ knowledge }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { knowledge: slug } = await params;
	const { knowledgeBase } = await apiQuery<KnowledgeBaseQuery, KnowledgeBaseQueryVariables>(
		KnowledgeBaseDocument,
		{
			variables: {
				slug,
			},
		}
	);

	return {
		title: knowledgeBase?.title,
	} as Metadata;
}
