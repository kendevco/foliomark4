// src/app/(app)/_components/_about/AboutServer.tsx
import React from 'react'
import config from '../../../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import AboutClient from './AboutClient'
import { Page } from '../../../../payload-types'

export default async function AboutServer() {
  // Initialize payload
  const payload = await getPayloadHMR({ config })

  // Fetch the "About" page data
  const result = await payload.find({
    collection: 'pages',
    where: {
      title: {
        equals: 'About Me',
      },
    },
  })

  const aboutPage: Page = result.docs[0]

  // Render AboutClient component with the fetched data
  return <AboutClient content={aboutPage.content} />
}
