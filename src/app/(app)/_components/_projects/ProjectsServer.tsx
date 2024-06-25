// src/app/(app)/_components/ProjectsServer.tsx
import React from 'react'
import config from '../../../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Project } from '../../../../payload-types'
import ProjectsClient from './ProjectsClient'

export default async function ProjectsServer() {
  // Initialize payload
  const payload = await getPayloadHMR({ config })

  // Fetch projects with pagination
  const limit = 100 // Set a reasonable limit for the number of documents to fetch per page
  let projects: Project[] = []
  let page = 1

  while (true) {
    const result = await payload.find({
      collection: 'projects',
      limit,
      page,
    })

    // Add the fetched documents to the projects array
    projects = [...projects, ...result.docs]
    page += 1

    // Break the loop if the number of documents returned is less than the limit
    if (result.docs.length < limit) {
      break
    }

    // Safeguard: break the loop if we have fetched a very large number of documents
    if (page * limit > 10000) {
      console.warn(
        'Fetched more than 10,000 documents, breaking the loop to avoid potential infinite loop.',
      )
      break
    }
  }

  // Render ProjectsClient component with the fetched data
  return <ProjectsClient projects={projects} />
}
