import { apiQuery } from 'next-dato-utils/api';
import { ContactDocument } from '@/graphql';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from '@node_modules/next/navigation';
import Article from '@/components/common/Article';
import { Metadata } from 'next';

export default async function ContactPage({ searchParams }) {
	const { contact, draftUrl } = await apiQuery<ContactQuery, ContactQueryVariables>(
		ContactDocument
	);

	if (!contact) return notFound();
	const { title } = contact;

	return (
		<>
			{title}
			<DraftMode url={draftUrl} path={'/kontakt'} />
		</>
	);
}

export async function generateMetadata({ params }) {
	return {
		title: 'Kontakt',
	} as Metadata;
}
