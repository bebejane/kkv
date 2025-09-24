'use client';

import s from './List.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';
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
	const defaultToggles = items.reduce((acc, k) => ({ ...acc, [k.id]: { show: k.id === itemId, height: 0 } }), {});
	const [toggles, setToggles] = useState<{ [key: string]: { show: boolean; height?: number } }>(defaultToggles);
	const { innerHeight, innerWidth } = useWindowSize();

	function toggleItem(id: string) {
		if (multi) setToggles((t) => ({ ...toggles, [id]: { ...t[id], show: !t[id].show } }));
		else {
			const t = { ...toggles };
			Object.keys(t).forEach((k) => (id !== k ? (t[k].show = false) : (t[k].show = t[k].show ? false : true)));
			setToggles(t);
			onChange?.(t[id]?.show ? id : null);
		}
	}

	useEffect(() => {
		const t = { ...toggles };
		Object.keys(t).forEach((id) => (t[id].height = document.getElementById(`list-content-${id}`)?.scrollHeight ?? 0));
		setToggles(t);
	}, [innerHeight, innerWidth]);

	useEffect(() => {
		const t = { ...toggles };
		Object.keys(t).forEach((k) => (itemId !== k ? (t[k].show = false) : (t[k].show = true)));
		setToggles(t);
	}, [itemId]);

	if (!items.length) return <div className={s.empty}>{empty}</div>;

	return (
		<ul className={cn(s.list, className)}>
			{items.map(({ id, title, content, href, status }, idx) => (
				<li id={`list-${id}`} key={idx} onClick={() => toggleItem(id)}>
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
