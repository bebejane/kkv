import { DatoCmsConfig } from 'next-dato-utils/config';
import client from './lib/client';

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
  sitemap: async () => {
    return []
  },
  routes: {
    "about": async ({ slug }) => [`/om/${slug}`],
    "city": async () => ['/verkstader'],
    "contact": async () => ['/kontakt'],
    "course": async ({ slug }) => [`/kurser/${slug}`, '/kurser'],
    "courses_start": async () => ['/kurser'],
    "knowledge_base": async ({ slug }) => [`/kunskapsbank/${slug}`, '/kunskapsbank'],
    "knowledgebase_start": async () => ['/kunskapsbank'],
    "start": async () => ['/'],
    "workshop": async ({ slug }) => [`/verkstader/${slug}`, '/verkstader'],
    "workshop_gear": async () => ['/verkstader'],
    "workshops_start": async () => ['/verkstader'],
  }
} satisfies DatoCmsConfig

async function productReferences(itemId: string): Promise<string[]> {
  if (!itemId) throw new Error('Missing reference: itemId')
  const paths: string[] = []
  const products = await client.items.references(itemId, { version: 'published', limit: 500 })
  if (products.length) {
    paths.push(`/products`)
    paths.push(`/professionals/downloads`)
    paths.push(`/support/manuals`)
    paths.push(`/`)
    paths.push.apply(paths, products.map(product => `/products/${product.slug}`))
  }
  return paths
}
