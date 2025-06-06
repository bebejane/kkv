import { DatoCmsConfig } from 'next-dato-utils/config';
import { apiQuery } from 'next-dato-utils/api';
import { SitemapDocument } from '@/graphql';
import client from './lib/client';

const routes: DatoCmsConfig['routes'] = {
  "about": async ({ slug }) => [`/om/${slug}`],
  "city": async ({ id }) => ['/verkstader', ...await references(id), '/'],
  "contact": async () => ['/kontakt'],
  "course": async ({ slug }) => [`/kurser/${slug}`, '/kurser', '/'],
  "courses_start": async () => ['/kurser'],
  "knowledge_base": async ({ slug }) => [`/kunskapsbank/${slug}`, '/kunskapsbank', '/'],
  "knowledgebase_start": async () => ['/kunskapsbank'],
  "start": async () => ['/'],
  "workshop": async ({ slug }) => [`/verkstader/${slug}`, '/verkstader', '/'],
  "workshop_gear": async ({ id }) => ['/verkstader', ...await references(id)],
  "workshops_start": async () => ['/verkstader'],
}

export default {
  description: 'Kollektiva konstnärsverkstäders Riksorganisation, KKV-Riks, har som syfte att, på olika sätt, stödja sina kollektiva medlemsverkstäder runt om i Sverige.',
  name: 'KKV-Riks',
  url: {
    dev: 'http://localhost:3000',
    public: 'https://kkv-riks.vercel.app',
  },
  theme: {
    background: '#efefef',
    color: '#cd3a00',
  },
  routes,
  sitemap: async () => {
    const { allAbouts, allWorkshops, allCourses, allKnowledgeBases } = await apiQuery<SitemapQuery, SitemapQueryVariables>(SitemapDocument, {
      all: true,
      variables: {
        first: 100,
        skip: 0
      },
      tags: ['about', 'workshop', 'course', 'knowledge_base']
    })
    return [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/kontakt`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      }, {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/kunskapsbank`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/verkstader`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurser`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      ...allKnowledgeBases.map(({ slug, _publishedAt }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/kunskapsbank/${slug}`,
        lastmod: new Date(_publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      })),
      ...allAbouts.map(({ slug, _publishedAt }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/om/${slug}`,
        lastmod: new Date(_publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      })),
      ...allWorkshops.map(({ slug, _publishedAt }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/verkstader/${slug}`,
        lastmod: new Date(_publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      })),
      ...allCourses.map(({ slug, _publishedAt }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurser/${slug}`,
        lastmod: new Date(_publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      })),
    ]
  }

} satisfies DatoCmsConfig

async function references(itemId: string): Promise<string[]> {
  if (!itemId) throw new Error('Missing reference: itemId')
  const paths: string[] = []
  const itemTypes = await client.itemTypes.list()
  const items = await client.items.references(itemId, { version: 'published', limit: 500, nested: true })

  for (const item of items) {
    const itemType = itemTypes.find(({ id }) => id === item.item_type.id)
    if (!itemType) continue
    const p = await routes[itemType.api_key]?.(item)
    p && paths.push.apply(paths, p)
  }
  console.log('refs', paths)
  return paths
}
