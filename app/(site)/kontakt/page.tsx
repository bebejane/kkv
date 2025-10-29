import { apiQuery } from 'next-dato-utils/api';
import { ContactDocument } from '@/graphql';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Article from '@/components/common/Article';
import { Metadata } from 'next';

export default async function ContactPage({ searchParams }) {
	const { contact, draftUrl } = await apiQuery(ContactDocument);

	if (!contact) return notFound();
	const { title, content } = contact;

	return (
		<>
			<Article title={title} content={content}></Article>
			<DraftMode url={draftUrl} path={'/kontakt'} />
		</>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Kontakt',
	} as Metadata;
}
