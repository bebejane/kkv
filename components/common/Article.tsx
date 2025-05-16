'use client';

import s from './Article.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { Image } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import Content from './Content';
import ArticleEditButtons from './ArticleEditButtons';

export type ArticleProps = {
	title?: string;
	image?: FileField;
	intro?: any;
	content?: any;
	headerContent?: any;
	markdown?: boolean;
	link?: {
		href: string;
		text: string;
	};
	className?: string;
	children?: React.ReactNode | React.ReactNode[];
	edit?: {
		id: string;
		workshopId: string;
		pathname: string;
		status: string;
	};
};

export default function Article({
	title,
	image,
	intro,
	content,
	headerContent,
	markdown = false,
	link,
	className,
	children,
	edit,
}: ArticleProps) {
	return (
		<article className={cn(s.article, className)}>
			{title && (
				<header>
					<h1>{title}</h1>
					{headerContent && <div className={s.headerContent}>{headerContent}</div>}
					{edit && (
						<div className={s.headerContent}>
							<ArticleEditButtons
								id={edit.id}
								pathname={edit.pathname}
								status={edit.status}
								workshopId={edit.workshopId}
							/>
						</div>
					)}
				</header>
			)}
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
