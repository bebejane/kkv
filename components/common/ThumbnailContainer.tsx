import Link from 'next/link';
import s from './ThumbnailContainer.module.scss';
import cn from 'classnames';

export type ThumbnailProps = {
	children: any;
	className?: string;
	header?: {
		title: string;
		href: string;
	};
};

export default function ThumbnailContainer({ children, header, className }: ThumbnailProps) {
	return (
		<>
			{header && (
				<header className={s.header}>
					<h2>{header.title}</h2>
					<Link href={header.href}>Visa alla</Link>
				</header>
			)}
			<ul className={cn(s.container, className)}>{children}</ul>
		</>
	);
}
