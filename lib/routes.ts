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
  "home": {
    typeName: "HomeRecord",
    path: (item) => ['/']
  },
  "about": {
    typeName: "AboutRecord",
    path: (item) => [`/om/${item.slug}`]
  },
  "education": {
    typeName: "EducationRecord",
    path: (item) => [`/utbildning/${item.slug}`]
  },
  "project": {
    typeName: "ProjectRecord",
    path: (item) => [`/kurser/${item.slug}`]
  },
  "research": {
    typeName: "ResearchRecord",
    path: (item) => [`/forskning/kunskapsbank`]
  },
  "research_about": {
    typeName: "ResearchAboutRecord",
    path: (item) => [`/forskning/om`]
  },
  "research_category": {
    typeName: "ResearchCategoryRecord",
    path: (item) => [`/forskning/kunskapsbank`]
  },
  "press": {
    typeName: "PressRecord",
    path: (item) => [`/aktuellt/press/${item.slug}`]
  },
  "news": {
    typeName: "NewsRecord",
    path: (item) => [`/aktuellt/aktuellt/${item.slug}`]
  },
  "contact": {
    typeName: "ContactRecord",
    path: (item) => [`/kontakt`]
  },
  "english": {
    typeName: "EnglishRecord",
    path: (item) => [`/english`]
  },
  "sound": {
    typeName: "SoundRecord",
    path: (item) => [`/`]
  },
  "support": {
    typeName: "SupportRecord",
    path: (item) => [`/`]
  },
  "presskit": {
    typeName: "PresskitRecord",
    path: (item) => [`/aktuellt/press`]
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