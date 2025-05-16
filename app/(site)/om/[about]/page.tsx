import { apiQuery } from 'next-dato-utils/api';
import { AboutDocument, AllAboutsDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';

export type AboutProps = {
	params: Promise<{ about: string }>;
};

export default async function AboutPage({ params }: AboutProps) {
	const { about: slug } = await params;
	const { about, draftUrl } = await apiQuery<AboutQuery, AboutQueryVariables>(AboutDocument, {
		variables: {
			slug,
		},
	});

	if (!about) return notFound();

	const { title, content, intro } = about;

	return (
		<>
			<Article title={title} content={content} intro={intro}></Article>
			<DraftMode url={draftUrl} path={`/om/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allAbouts } = await apiQuery<AllAboutsQuery, AllAboutsQueryVariables>(AllAboutsDocument, {
		all: true,
	});

	return allAbouts.map(({ slug: about }) => ({ about }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { about: slug } = await params;
	const { about } = await apiQuery<AboutQuery, AboutQueryVariables>(AboutDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: about.title,
	} as Metadata;
}
