import { buildClient } from "@datocms/cma-client-browser"

const client = buildClient({
  apiToken: process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN,
  environment: process.env.DATOCMS_ENVIRONMENT
})

type Routes = {
  [key: string]: Route
}

type Route = {
  path: ((item?: any) => string[] | null)
  typeName: string
}

const routes: Routes = {
  "workshop": {
    typeName: "WorkshopRecord",
    path: (item) => ['/']
  },
  "course": {
    typeName: "CourseRecord",
    path: (item) => [`/kurser/${item.slug}`, '/kurser', `/medlem/kurser/${item.id}`, '/medlem', `/kurser/${item.slug}/utkast`]
  },
  "workshop_gear": {
    typeName: "WorkshopGearRecord",
    path: (item) => [`/verkstader`]
  },
  "about": {
    typeName: "AboutRecord",
    path: (item) => [`/om/${item.slug}`]
  },
  "contact": {
    typeName: "ContactRecord",
    path: (item) => [`/kontakt`]
  },
  "news": {
    typeName: "NewsRecord",
    path: (item) => [`/aktuellt/${item.slug}`]
  },
}

export const buildRoute = (model: string, item?: any): string[] | null => {
  if (!routes[model]) throw new Error(`Invalid model: ${model}`)
  return routes[model].path(item)
}

export const recordToRoute = (record: any): string[] => {
  const { __typename } = record
  const model = Object.keys(routes).find(key => routes[key].typeName === __typename)
  if (!model) throw new Error(`Invalid record: ${__typename}`)
  return buildRoute(model, record)
}

export default routes