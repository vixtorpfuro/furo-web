import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

const token = process.env.SANITY_API_WRITE_TOKEN

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})
