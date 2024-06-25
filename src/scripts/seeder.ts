import { Payload } from 'payload'
import seedData from './seed' // Adjust the path if needed

const collections = ['experiences', 'projects', 'skills', 'media', 'pages'] as const
type Collection = (typeof collections)[number]

const getUniqueField = (collection: string) => {
  switch (collection) {
    case 'users':
      return 'email' // Example unique field for users
    case 'experiences':
      return 'title' // Example unique field for experiences
    case 'projects':
      return 'title' // Example unique field for projects
    case 'skills':
      return 'name' // Example unique field for skills
    case 'media':
      return 'text' // Example unique field for media
    case 'pages':
      return 'title' // Example unique field for pages
    default:
      return 'id' // Default unique field
  }
}

export const seedDatabase = async (payload: Payload) => {
  const data: Record<Collection, any[]> = seedData as Record<Collection, any[]>

  for (const collection of collections) {
    const documents = data[collection]
    const uniqueField = getUniqueField(collection)

    for (const document of documents) {
      const existingDocument = await payload.find({
        collection,
        where: {
          [uniqueField]: {
            equals: document[uniqueField],
          },
        },
      })

      if (existingDocument.docs.length === 0) {
        await payload.create({
          collection,
          data: document,
        })
      } else {
        console.log(
          `Document in ${collection} with ${uniqueField} ${document[uniqueField]} already exists. Skipping creation.`,
        )
      }
    }
  }

  console.log('Database seeded successfully.')
}

export default seedDatabase
