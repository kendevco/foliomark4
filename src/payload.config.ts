import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3' // New S3 storage package

import Seeder from './scripts/seeder' // Import the seeder

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || ''
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || ''
const S3_REGION = process.env.S3_REGION || ''
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || ''
const S3_ENDPOINT = process.env.S3_ENDPOINT || ''

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    {
      slug: 'users',
      admin: {
        useAsTitle: 'email',
      },
      auth: true,
      access: {
        delete: () => false,
        update: () => false,
      },
      fields: [],
    },
    {
      slug: 'experiences',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'location', type: 'text' },
        { name: 'description', type: 'richText' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'date', type: 'text' },
      ],
    },
    {
      slug: 'projects',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'richText' },
        { name: 'tags', type: 'array', label: 'Tags', fields: [{ name: 'tag', type: 'text' }] },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'href', type: 'text', label: 'Website Link' },
      ],
    },
    {
      slug: 'skills',
      fields: [{ name: 'name', type: 'text', required: true, unique: true }],
    },
    {
      slug: 'media',
      upload: true,
      access: {
        read: () => true, // Allow anyone to read from the media collection
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true, // Enable S3 storage for the media collection
      },
      bucket: S3_BUCKET_NAME,
      config: {
        credentials: {
          accessKeyId: S3_ACCESS_KEY,
          secretAccessKey: S3_SECRET_KEY,
        },
        region: S3_REGION,
        endpoint: S3_ENDPOINT,
        forcePathStyle: true, // Ensure the endpoint is used as is
        // Other S3 configurations...
      },
    }),
  ],
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
        },
      })
    }

    if (process.env.PAYLOAD_SEED === 'true') {
      await Seeder(payload) // Run seeder if PAYLOAD_SEED is set
    }
  },
})
