import s from './Article.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { Image } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import Content from './Content';

export type ArticleProps = {
	title?: string;
	image?: FileField;
	intro?: any;
	content?: any;
	markdown?: boolean;
	link?: {
		href: string;
		text: string;
	};
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
};

export default function Article({
	title,
	image,
	intro,
	content,
	markdown = false,
	link,
	className,
	children,
}: ArticleProps) {
	return (
		<article className={cn(s.article, className)}>
			<header className={cn(!image && s.noImage)}>
				<h1>{title}</h1>
				{image && (
					<figure>
						<Image data={image.responsiveImage} className={s.image} pictureClassName={s.picture} />
					</figure>
				)}
			</header>
			{intro && markdown && <Markdown content={intro} className={'intro'} />}
			{content && markdown && <Markdown content={content} className={s.content} />}
			{intro && !markdown && <Content content={intro} className={'intro'} />}
			{content && !markdown && <Content content={content} className={s.content} />}
			{children}
			{link && (
				<Link href={link.href}>
					<button className='medium-weight shortcut'>{link.text}</button>
				</Link>
			)}
		</article>
	);
}
