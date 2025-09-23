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
		status?: 'updated' | 'published' | 'new' | 'draft';
	}[];
	empty?: string;
	multi: boolean;
	onChange?: (id: string | null) => void;
};

export default function List({ items, itemId, className, empty, multi = false, onChange }: ListProps) {
	const defaultToggles = items.reduce((acc, k) => ({ ...acc, [k.id]: { show: false, height: 0 } }), {});
	const [toggles, setToggles] = useState<{ [key: string]: { show: boolean; height?: number } }>(defaultToggles);
	const { innerHeight, innerWidth } = useWindowSize();

	function toggleItem(id: string) {
		if (multi) setToggles((t) => ({ ...toggles, [id]: { ...t[id], show: !t[id].show } }));
		else {
			const t = { ...toggles };
			Object.keys(t).forEach((k) => (id !== k ? (t[k].show = false) : (t[k].show = t[k].show ? false : true)));
			setToggles(t);
		}
	}

	useEffect(() => {
		Object.keys(toggles).forEach(
			(id) => (toggles[id].height = document.getElementById(`list-content-${id}`)?.scrollHeight ?? 0)
		);
		setToggles(toggles);
	}, [innerHeight, innerWidth]);

	useEffect(() => {
		if (!itemId) return;
		toggleItem(itemId);
	}, [itemId]);

	if (!items.length) return <div className={s.empty}>{empty}</div>;
	console.log('render');
	return (
		<ul className={cn(s.list, className)}>
			{items.map(({ id, title, content, href, status }, idx) => (
				<li
					id={`list-${id}`}
					key={idx}
					onClick={() => {
						toggleItem(id);
						///onChange?.(!toggles[id].show ? id : null);
					}}
				>
					{href ? (
						<Link href={href} className={s.item}>
							<span>{title}</span>
							{status !== 'published' && (
								<div className={cn(s.status)}>
									<span>Not Published</span>
								</div>
							)}
							<button>→</button>
						</Link>
					) : (
						<div className={s.item}>
							<span>{title}</span>
							<button>{toggles[id]?.show ? '-' : '+'}</button>
						</div>
					)}
					{content && (
						<div
							id={`list-content-${id}`}
							className={cn(s.content, toggles[id].show && s.show)}
							style={{ height: toggles[id]?.show ? toggles[id].height : 0 }}
						>
							<div className={s.wrap}>{content}</div>
						</div>
					)}
				</li>
			))}
		</ul>
	);
}
