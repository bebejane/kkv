'use client';

import Content from '@/components/common/Content';
import s from './List.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'rooks';
import { Markdown } from 'next-dato-utils/components';

export type ListProps = {
	className?: string;
	items: {
		id: string;
		title: string;
		content: any;
		markdown?: boolean;
	}[];
};

export default function List({ items, className }: ListProps) {
	const defaultToggles = items.reduce(
		(acc, k) => ({ ...acc, [k.id]: { show: false, height: 0 } }),
		{}
	);
	const [toggles, setToggles] = useState<{ [key: string]: { show: boolean; height?: number } }>(
		defaultToggles
	);
	const ref = useRef<HTMLUListElement>(null);
	const { innerHeight, innerWidth } = useWindowSize();

	useEffect(() => {
		Object.keys(toggles).forEach(
			(k) => (toggles[k].height = document.getElementById(`list-content-${k}`)?.scrollHeight ?? 0)
		);
		setToggles(toggles);
	}, [innerHeight, innerWidth]);

	return (
		<ul className={cn(s.list, className)}>
			{items.map(({ id, title, content, markdown }, idx) => (
				<li
					id={`list-${id}`}
					key={idx}
					onClick={() =>
						setToggles({ ...toggles, [id]: { ...toggles[id], show: !toggles[id].show } })
					}
				>
					<div className={s.item}>
						<span>{title}</span>
						<button>{toggles[id].show ? '-' : '+'}</button>
					</div>
					{content && (
						<div
							id={`list-content-${id}`}
							className={cn(s.content, toggles[id].show && s.show)}
							style={{ height: toggles[id].show ? toggles[id].height : 0 }}
						>
							{content}
						</div>
					)}
				</li>
			))}
		</ul>
	);
}
