'use client';

import s from './NavbarMobile.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, getSelectedMenuItem } from '@/lib/menu';
import Hamburger from './Hamburger';
import { Session } from 'next-auth';

export type NavbarMobileProps = {
	menu: Menu;
	session: Session;
};

export default function NavbarMobile({ menu, session }: NavbarMobileProps) {
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [selected, setSelected] = useState<string | null>(
		getSelectedMenuItem(menu, path, qs)?.id ?? null
	);
	const [open, setOpen] = useState(false);
	const member = menu.find(({ id }) => id === 'member');

	useEffect(() => {
		setOpen(false);
		setSelected(getSelectedMenuItem(menu, path, qs)?.id ?? null);
	}, [path, qs]);

	return (
		<>
			<div className={cn(s.topbar, open && s.open)}>
				<figure className={s.logo}>
					<Link href={'/'}>
						<img src={open ? '/images/logo.webp' : '/images/logo.webp'} alt='Logo' />
					</Link>
				</figure>
				<div className={s.hamburger}>
					<Hamburger
						toggled={open}
						color={open ? 'white' : 'black'}
						size={36}
						onToggle={(state) => setOpen(state)}
					/>
				</div>
			</div>
			<nav className={cn(s.navbarMobile, open && s.open)}>
				<ul className={s.menu}>
					{menu
						.filter(({ id }) => id !== 'member')
						.map(({ id, title, href, slug, sub }) => (
							<li
								key={id}
								className={cn(sub && s.dropdown, pathname.startsWith(slug) && s.active)}
								onClick={() => setSelected(selected === id ? null : id)}
							>
								{sub ? <span>{title}</span> : <Link href={slug ?? href}>{title}</Link>}
								{selected === id && sub && (
									<ul onClick={(e) => e.stopPropagation()}>
										{sub.map(({ id, title, href, slug }) => (
											<li key={id} className={cn(pathname === slug && s.active)}>
												<Link href={slug ?? href}>{title}</Link>
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					<li
						className={cn(member.slug === pathname && s.active)}
						onMouseEnter={() => session?.user && setSelected(member.id)}
					>
						<Link href={session?.user ? '/medlem' : '/logga-in'}>{member.title}</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}
