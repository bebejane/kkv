import s from './page.module.scss';
//import { HomeDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, VideoPlayer } from 'next-dato-utils/components';
import { Block } from '@/components/blocks';
import * as StartBlocks from '@/components/blocks/start';

export default async function Home() {
	//const { home, draftUrl } = await apiQuery<HomeQuery, HomeQueryVariables>(HomeDocument);

	return (
		<>
			<article className={s.page}>Home</article>
		</>
	);
}
