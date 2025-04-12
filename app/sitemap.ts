import { MetadataRoute } from 'next'
import { apiQuery } from 'next-dato-utils/api'
import { SitemapDocument } from '@/graphql'

const routes = ['/', '/kurser', '/verkstader', '/kontakt', '/om', '/aktuellt']

const staticRoutes = [
  ...routes.map((route) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }))
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const { allAbouts, allWorkshops, allCourses, allNews } = await apiQuery<SitemapQuery, SitemapQueryVariables>(
    SitemapDocument,
    {
      variables: {
        first: 100,
        skip: 0,
      },
      all: true,
    }
  )

  const abouts = allAbouts.map(({ slug, _publishedAt }) => ({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/om/${slug}`, lastModified: new Date(_publishedAt), changeFrequency: 'monthly', priority: 0.9 }))
  const workshops = allWorkshops.map(({ slug, _publishedAt }) => ({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/verkstader/${slug}`, lastModified: new Date(_publishedAt), changeFrequency: 'monthly', priority: 0.9 }))
  const courses = allCourses.map(({ slug, _publishedAt }) => ({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurser/${slug}`, lastModified: new Date(_publishedAt), changeFrequency: 'weekly', priority: 0.9 }))
  const news = allNews.map(({ slug, _publishedAt }) => ({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/aktuellt/${slug}`, lastModified: new Date(_publishedAt), changeFrequency: 'daily', priority: 0.9 }))
  const sitemap = [
    ...staticRoutes,
    ...abouts,
    ...workshops,
    ...courses,
    ...news,
  ]

  return sitemap as MetadataRoute.Sitemap
}
