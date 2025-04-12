import { MetadataRoute } from 'next'

const routes = ['/', '/kurser', '/verkstader', '/kontakt', '/om', '/aktuellt']

const staticRoutes: MetadataRoute.Sitemap = [
  ...routes.map((route) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }))]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  return [
    ...staticRoutes
  ]
}