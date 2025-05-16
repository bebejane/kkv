'use client';

import s from './List.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'rooks';

export type ListProps = {
	className?: string;
	itemId?: string;
	items: {
		id: string;
		title: string;
		content?: any;
		markdown?: boolean;
		href?: string;
	}[];
	onChange?: (id: string | null) => void;
};

export default function List({ items, itemId, className, onChange }: ListProps) {
	const defaultToggles = items.reduce(
		(acc, k) => ({ ...acc, [k.id]: { show: false, height: 0 } }),
		{}
	);
	const [toggles, setToggles] = useState<{ [key: string]: { show: boolean; height?: number } }>(
		defaultToggles
	);
	const { innerHeight, innerWidth } = useWindowSize();

	useEffect(() => {
		Object.keys(toggles).forEach(
			(id) =>
				(toggles[id].height = document.getElementById(`list-content-${id}`)?.scrollHeight ?? 0)
		);
		setToggles(toggles);
	}, [innerHeight, innerWidth]);

	useEffect(() => {
		if (!itemId) return;
		setToggles((t) => ({ ...defaultToggles, [itemId]: { ...t[itemId], show: true } }));
	}, [itemId]);

	return (
		<ul className={cn(s.list, className)}>
			{items.map(({ id, title, content, markdown, href }, idx) => (
				<li
					id={`list-${id}`}
					key={idx}
					onClick={() => {
						setToggles({ ...toggles, [id]: { ...toggles[id], show: !toggles[id].show } });
						onChange?.(!toggles[id].show ? id : null);
					}}
				>
					{href ? (
						<Link href={href} className={s.item}>
							<span>{title}</span>
							<button>→</button>
						</Link>
					) : (
						<div className={s.item}>
							<span>{title}</span>
							<button>{toggles[id].show ? '-' : '+'}</button>
						</div>
					)}
					{content && (
						<div
							id={`list-content-${id}`}
							className={cn(s.content, toggles[id].show && s.show)}
							style={{ height: toggles[id].show ? toggles[id].height : 0 }}
						>
							<div className={s.wrap}>{content}</div>
						</div>
					)}
				</li>
			))}
		</ul>
	);
}
