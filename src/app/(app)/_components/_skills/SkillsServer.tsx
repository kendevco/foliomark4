// src/app/(app)/_components/_skills/SkillsServer.tsx
import React from 'react'
import config from '../../../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Skill } from '../../../../payload-types'
import SkillsClient from './SkillsClient'

export default async function SkillsServer() {
  // Initialize payload
  const payload = await getPayloadHMR({ config })

  // Fetch skills with pagination
  const limit = 100 // Set a reasonable limit for the number of documents to fetch per page
  let skills: Skill[] = []
  let page = 1

  while (true) {
    const result = await payload.find({
      collection: 'skills',
      limit,
      page,
    })

    // Add the fetched documents to the skills array
    skills = [...skills, ...result.docs]

    // Break the loop if the number of documents returned is less than the limit
    if (result.docs.length < limit) {
      break
    }

    // Increment the page number
    page += 1

    // Safeguard: break the loop if we have fetched a very large number of documents
    if (skills.length > 10000) {
      console.warn(
        'Fetched more than 10,000 documents, breaking the loop to avoid potential infinite loop.',
      )
      break
    }
  }

  // Render SkillsClient component with the fetched data
  return <SkillsClient skills={skills} />
}
