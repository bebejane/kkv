import { buildClient } from '@datocms/cma-client-browser'

export default buildClient({
  apiToken: process.env.DATOCMS_API_TOKEN,
  environment: process.env.DATOCMS_ENVIRONMENT,
});