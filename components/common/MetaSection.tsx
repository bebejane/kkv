'use client';

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
			<ul>
				{items
					.filter((el) => el.text)
					.map(({ id, label, text, href }) => (
						<li key={id}>
							<span className={s.label}>{label}</span>
							<span>{text}</span>
						</li>
					))}
			</ul>
		</div>
	);
}
