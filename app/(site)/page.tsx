import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import IntroStart from '@/components/start/IntroStart';
import Map from '@/components/start/Map';
import { notFound } from 'next/navigation';
import Content from '@/components/common/Content';
import FindWorkshop from '@/components/start/FindWorkshop';
import ThumbnailContainer from '@/components/common/ThumbnailContainer';
import Thumbnail from '@/components/common/Thumbnail';

export default async function Home() {
	const { start, allWorkshops, allCourses, allKnowledgeBases, draftUrl } = await apiQuery<
		StartQuery,
		StartQueryVariables
	>(StartDocument);

	if (!start) return notFound();

	return (
		<>
			<div className={s.page}>
				<IntroStart images={start.images as FileField[]} />
				<section className={s.intro}>
					<Content className="intro" content={start.intro} />
				</section>
				<section>
					<FindWorkshop workshops={allWorkshops} text={start.findWorkshop} />
				</section>
				<section>
					<ThumbnailContainer header={{ title: 'Kurser för medlemmar', href: '/kurser' }}>
						{allCourses.map(({ id, title, intro, slug }) => (
							<Thumbnail
								key={id}
								title={title}
								text={intro}
								markdown={true}
								href={`/kurser/${slug}`}
							/>
						))}
					</ThumbnailContainer>
				</section>
				<section>
					<ThumbnailContainer header={{ title: 'Kunskapsbank', href: '/kunskapsbank' }}>
						{allKnowledgeBases.map(({ id, title, slug, image, intro }) => (
							<Thumbnail
								key={id}
								title={title}
								text={intro}
								image={image as FileField}
								markdown={false}
								href={`/kunskapsbank/${slug}`}
							/>
						))}
					</ThumbnailContainer>
				</section>
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
