import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '@/graphql';

export type MenuItem = {
	id: string;
	title: string;
	slug?: string;
	href?: string;
	sub?: MenuItem[];
	hideInDesktop?: boolean;
	hideSub?: boolean;
	position?: 'left' | 'right';
};

export type Menu = MenuItem[];

export const buildMenu = async (): Promise<Menu> => {
	const { allAbouts, allWorkshops } = await apiQuery(MenuDocument, {
		all: true,
		variables: {
			first: 100,
			skip: 0,
		},
		tags: ['about', 'education', 'general', 'project', 'research'],
	});

	const menu: Menu = [
		{
			id: 'about',
			title: 'Om',
			slug: '/om',
			position: 'left',
			sub: allAbouts.map(({ id, slug, title }) => ({
				id,
				title,
				slug: `/om/${slug}`,
			})),
		},
		{
			id: 'workshops',
			title: 'Verkstäder',
			slug: '/verkstader',
			position: 'left',
			hideSub: true,
		},
		{
			id: 'courses',
			title: 'Kurser',
			slug: '/kurser',
			position: 'left',
		},
		{
			id: 'knowledge-base',
			title: 'Kunskapsbank',
			slug: '/kunskapsbank',
			position: 'left',
		},
		{
			id: 'contact',
			title: 'Kontakt',
			slug: '/kontakt',
			position: 'right',
		},
		{
			id: 'member',
			title: 'Logga in',
			slug: '/logga-in',
			position: 'right',
			sub: [
				{ id: 'member-courses', title: 'Kurser', slug: '/medlem' },
				{ id: 'member-profile', title: 'Profil', slug: '/medlem/profil' },
				{ id: 'member-logout', title: 'Logga ut', slug: '/logga-ut' },
			],
		},
	];
	return menu;
};

export const getSelectedMenuItem = (menu: Menu, pathname: string, qs: string): MenuItem | null => {
	const fullPath = `${pathname}${qs ? `?${qs.toString()}` : ''}`;
	const selectedSubFromPathname = menu
		.map(({ sub }) => sub ?? [])
		.flat()
		.find(({ slug }) => fullPath === slug)?.id;
	return menu.find(({ sub }) => sub?.find(({ id }) => id === selectedSubFromPathname)) ?? null;
};
