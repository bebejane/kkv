'use client';

import Link from 'next/link';
import s from './MetaSection.module.scss';
import cn from 'classnames';

export type MetaSectionItem = {
	id: string;
	label: string;
	text: string;
	href?: string;
};

type Props = {
	items: MetaSectionItem[];
};

export default function MetaSection({ items }: Props) {
	return (
		<div className={cn(s.meta)}>
			<ul className="mid">
				{items
					.filter((el) => el.text)
					.map(({ id, label, text, href }) => (
						<li key={id}>
							<span className={cn("small", s.label)}>{label}</span>
							{href ? (
								href.includes('@') ? (
									<a href={`mailto:${href}`}>{text}</a>
								) : (
									<Link href={href}>{text}</Link>
								)
							) : (
								<span>{text}</span>
							)}
						</li>
					))}
			</ul>
		</div>
	);
}
