import s from './Thumbnail.module.scss';
import cn from 'classnames';
import { Image } from 'react-datocms';
import Content from './Content';
import Link from 'next/link';
import { Markdown } from 'next-dato-utils/components';

export type ThumbnailProps = {
	title: string;
	image?: FileField;
	text: any;
	className?: string;
	href: string;
	meta?: {
		label: string;
		text: string;
		href?: string;
	}[];
	markdown?: boolean;
};

export default function Thumbnail({
	title,
	image,
	text,
	href,
	meta,
	markdown,
	className,
}: ThumbnailProps) {
	return (
		<li className={cn(s.thumbnail, className)}>
			<div className={s.wrap}>
				<Link href={href}>
					<h3>{title}</h3>
					{image && <Image data={image.responsiveImage} imgClassName={s.image} />}
					{markdown && <Markdown content={text} className={s.text} />}
					{!markdown && <Content content={text} className={s.text} />}
				</Link>
				{meta && (
					<ul className={s.meta}>
						{meta.map(({ label, text, href }, idx) => (
							<li key={idx}>
								<span>{label}</span>
								{href ? <Link href={href}>{text}</Link> : <span>{text}</span>}
							</li>
						))}
					</ul>
				)}
			</div>
		</li>
	);
}
