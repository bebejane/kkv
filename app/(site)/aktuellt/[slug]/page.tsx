import { apiQuery } from 'next-dato-utils/api';
import { AllNewsDocument, NewsDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';

export type NewsProps = {
	params: Promise<{ category: 'aktuellt' | 'press'; slug: string }>;
};

export default async function NewsPage({ params }: NewsProps) {
	const { slug } = await params;
	const { news, draftUrl } = await apiQuery<NewsQuery, NewsQueryVariables>(NewsDocument, {
		variables: {
			slug,
		},
	});
	if (!news) return notFound();

	const { title, image, intro, content } = news;

	return (
		<>
			<Article
				title={title}
				image={image as FileField}
				content={content}
				intro={intro}
				link={{
					href: `/aktuellt`,
					text: `Visa alla i aktuellt`,
				}}
			/>
			<DraftMode url={draftUrl} path={`/aktuellt/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allNews } = await apiQuery<AllNewsQuery, AllNewsQueryVariables>(AllNewsDocument, {
		all: true,
	});

	return allNews.map(({ slug }) => ({
		slug,
	}));
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const { news } = await apiQuery<NewsQuery, NewsQueryVariables>(NewsDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: news?.title,
	} as Metadata;
}
