import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '@graphql';

export type MenuItem = {
  id: string,
  title: string,
  slug?: string,
  href?: string,
  sub?: MenuItem[],
  hideInDesktop?: boolean,
  hideSub?: boolean
}

export type Menu = MenuItem[]

export const buildMenu = async (): Promise<Menu> => {
  const { allAbouts, allWorkshops } = await apiQuery<MenuQuery, MenuQueryVariables>(MenuDocument, {
    all: true,
    variables: {
      first: 100,
      skip: 0
    },
    tags: ['about', 'education', 'general', 'project', 'research']
  })

  const menu: Menu = [{
    id: 'about',
    title: 'Om',
    slug: '/om',
    sub: allAbouts.map(({ id, slug, title }) => ({
      id,
      title,
      slug: `/om/${slug}`,
    })),
  }, {
    id: 'news',
    title: 'Aktuellt',
    slug: '/aktuellt',
  }, {
    id: 'workshops',
    title: 'Verkstäder',
    slug: '/verkstader',
  }, {
    id: 'courses',
    title: 'Kurser',
    slug: '/kurser',
    hideSub: true,
    sub: [
      {
        id: 'all',
        title: 'Alla',
        slug: `/kurser`,
        hideInDesktop: true,
      },
      {
        id: 'active',
        title: 'Pågående',
        slug: `/kurser?filter=active`,
      }, {
        id: 'finished',
        title: 'Avslutade',
        slug: `/kurser?filter=finished`,
      }],
  }, {
    id: 'contact',
    title: 'Kontakt',
    slug: '/kontakt',
    sub: [
      { id: 'contact-us', title: 'Kontakta oss', slug: '/kontakt' },
      { id: 'instagram', title: 'Instagram', href: 'https://www.instagram.com/pointofyou.se' },
    ]
  }]
  return menu
}

export const getSelectedMenuItem = (menu: Menu, pathname: string, qs: string): MenuItem | null => {
  const fullPath = `${pathname}${qs ? `?${qs.toString()}` : ""}`;
  const selectedSubFromPathname = menu
    .map(({ sub }) => sub ?? [])
    .flat()
    .find(({ slug }) => fullPath === slug)?.id;
  return menu.find(({ sub }) => sub?.find(({ id }) => id === selectedSubFromPathname)) ?? null;
}