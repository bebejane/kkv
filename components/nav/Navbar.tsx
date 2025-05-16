'use client';

import s from './Navbar.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Menu } from '@/lib/menu';

import { Session } from 'next-auth';
import { useWindowSize } from 'rooks';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { set } from 'date-fns';
export type NavbarProps = {
	menu: Menu;
	session: Session;
	bottom?: boolean;
};

export default function Navbar({ menu, session, bottom }: NavbarProps) {
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [selected, setSelected] = useState<string | null>(null);
	const [subStyle, setSubStyle] = useState<CSSProperties | null>();
	const { innerHeight, innerWidth } = useWindowSize();
	const { scrolledPosition, viewportHeight } = useScrollInfo();
	const logoRef = useRef<HTMLImageElement>(null);
	const leaveTimout = useRef<NodeJS.Timeout | null>(null);
	const parent = menu.find(({ id }) => id === selected);
	const sub = parent?.sub;
	const member = menu.find(({ id }) => id === 'member');

	useEffect(() => {
		if (!logoRef.current) return;
		if (pathname !== '/') {
			logoRef.current.style.clipPath = `inset(0 0 0 0)`;
			return;
		}
		const ratio = 1 - Math.max(0, Math.min(1, (scrolledPosition / viewportHeight) * 4));
		logoRef.current.style.clipPath = `inset(${ratio * 100}% 0 0 0)`;
	}, [pathname, scrolledPosition, viewportHeight]);

	menu = menu.map((item) => {
		if (item.id === 'member') {
			if (!session?.user) return { ...item, sub: null };
			else return { ...item, title: 'Medlem' };
		}
		return item;
	});

	function handleLeave() {
		setSelected(null);
	}
	function handleEnter(id: string) {
		setSelected(id);
	}

	useEffect(() => {
		const menuItem = document.getElementById(`${selected}-menu`);
		const subMenu = document.getElementById('menu-sub');

		if (!menuItem || !subMenu) return;

		const position = menuItem.dataset.position;
		const menuItemRect = menuItem.getBoundingClientRect();
		const subRect = menuItem.getBoundingClientRect();
		const padding = parseInt(getComputedStyle(subMenu).paddingLeft);
		const outerMargin = window.getComputedStyle(document.body).getPropertyValue('--outer-margin');
		const marginLeft =
			position === 'left'
				? menuItemRect.left - padding
				: `calc(100% - ${outerMargin} - ${subRect.width}px - ${padding}px)`;
		const marginTop = bottom
			? `calc(100vh - var(--navbar-height) - ${outerMargin} - ${subRect.height}px - ${padding}px)`
			: 'var(--navbar-height)';

		setSubStyle({ marginLeft, marginTop });
	}, [selected, bottom, innerHeight, innerWidth]);

	return (
		<>
			<nav className={cn(s.navbar, bottom && s.bottom)}>
				<figure className={s.logo}>
					{!bottom && (
						<Link href={'/'}>
							<img src='/images/logo.svg' alt='Logo' ref={logoRef} />
						</Link>
					)}
				</figure>

				<ul className={s.menu} onMouseLeave={handleLeave}>
					{menu.map(({ id, title, href, slug, sub, hideSub, position }, idx) => (
						<li
							id={`${id}-menu`}
							key={`${id}-menu`}
							data-position={position}
							className={cn(sub && !hideSub && s.dropdown, pathname.startsWith(slug) && s.active)}
							onMouseEnter={() => handleEnter(sub ? id : null)}
						>
							{sub && !hideSub ? <span>{title}</span> : <Link href={slug ?? href}>{title}</Link>}
						</li>
					))}
				</ul>
			</nav>
			<nav
				id='menu-sub'
				className={cn(s.sub, !parent?.hideSub && sub && s.open, selected === member.id && s.right)}
				style={subStyle}
				onMouseEnter={() => handleEnter(parent?.id ?? null)}
				onMouseLeave={handleLeave}
			>
				<ul>
					{sub
						?.filter(({ hideInDesktop }) => !hideInDesktop)
						.map(({ id, title, href, slug }) => (
							<li key={id} className={cn(slug === pathname && s.active)}>
								<Link href={slug ?? href} onClick={() => setSelected(null)}>
									{title}
								</Link>
							</li>
						))}
				</ul>
			</nav>
		</>
	);
}
