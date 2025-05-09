'use client';

import s from './Navbar.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Menu } from '@/lib/menu';

import { Session } from 'next-auth';
export type NavbarProps = {
	menu: Menu;
	session: Session;
};

export default function Navbar({ menu, session }: NavbarProps) {
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [selected, setSelected] = useState<string | null>(null);
	const parent = menu.find(({ id }) => id === selected);
	const sub = parent?.sub;
	const member = menu.find(({ id }) => id === 'member');

	return (
		<>
			<nav className={s.navbar}>
				<figure className={s.logo}>
					<Link href={'/'}>
						<img src='/images/logo.webp' alt='Logo' />
					</Link>
				</figure>

				<ul className={s.menu}>
					{menu
						.filter(({ id }) => id !== 'member')
						.map(({ id, title, href, slug, sub, hideSub }) => (
							<li
								key={id}
								className={cn(
									s.item,
									sub && !hideSub && s.dropdown,
									pathname.startsWith(slug) && s.active
								)}
								onMouseEnter={() => setSelected(sub ? id : null)}
							>
								{sub && !hideSub ? <span>{title}</span> : <Link href={slug ?? href}>{title}</Link>}
							</li>
						))}
				</ul>
				<ul className={s.login}>
					<li
						className={cn(member.slug === pathname && s.active)}
						onMouseEnter={() => session?.user && setSelected(session?.user ? member.id : null)}
					>
						<Link href={session?.user ? '/medlem' : '/logga-in'}>{member.title}</Link>
					</li>
				</ul>
			</nav>
			<nav
				className={cn(s.sub, !parent?.hideSub && sub && s.open, selected === member.id && s.right)}
				onMouseLeave={() => setSelected(null)}
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
