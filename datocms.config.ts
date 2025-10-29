import { DatoCmsConfig, getItemReferenceRoutes, getUploadReferenceRoutes } from 'next-dato-utils/config';
import { apiQuery } from 'next-dato-utils/api';
import { SitemapDocument } from '@/graphql';
import { MetadataRoute } from 'next';

const routes: DatoCmsConfig['routes'] = {};

export default {
	routes: {
		about: async ({ slug }) => [`/om/${slug}`],
		city: async ({ id }) => ['/verkstader', ...(await getItemReferenceRoutes(id))],
		contact: async () => ['/kontakt'],
		course: async ({ slug }) => [`/kurser/${slug}`, '/kurser', '/'],
		courses_start: async () => ['/kurser'],
		knowledge_base: async ({ slug }) => [`/kunskapsbank/${slug}`, '/kunskapsbank', '/'],
		knowledgebase_start: async () => ['/kunskapsbank'],
		start: async () => ['/'],
		workshop: async ({ slug }) => [`/verkstader/${slug}`, '/verkstader', '/'],
		workshop_gear: async ({ id }) => ['/verkstader', ...(await getItemReferenceRoutes(id))],
		workshops_start: async () => ['/verkstader'],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async () => {
		const { allAbouts, allWorkshops, allCourses, allKnowledgeBases } = await apiQuery(SitemapDocument, {
			all: true,
			variables: {
				first: 100,
				skip: 0,
			},
		});
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
			},
			{
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
		];
	},
	manifest: async () => {
		return {
			name: 'KKV Riks',
			short_name: 'KKV Riks',
			description:
				'Kollektiva konstnärsverkstäders Riksorganisation, KKV-Riks, har som syfte att, på olika sätt, stödja sina kollektiva medlemsverkstäder runt om i Sverige',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
				disallow: '/medlem/',
			},
		};
	},
} satisfies DatoCmsConfig;
