import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import fs from 'fs'

const collections = ['users', 'experiences', 'projects', 'skills', 'media', 'pages'] as const
type Collection = (typeof collections)[number]

export const extractData = async () => {
  const payload = await getPayloadHMR({ config: configPromise })

  const data: Record<Collection, any[]> = {} as Record<Collection, any[]>

  for (const collection of collections) {
    const result = await payload.find({
      collection,
      limit: 1000, // Adjust as necessary
    })
    data[collection] = result.docs
  }

  fs.writeFileSync('seed.ts', `export default ${JSON.stringify(data, null, 2)};`, 'utf-8')

  console.log('Data extraction complete.')
}

extractData().catch((err) => {
  console.error(err)
  process.exit(1)
})
