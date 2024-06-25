// src/app/(app)/_components/_experiences/ExperiencesServer.tsx
import React from 'react'
import config from '../../../../payload.config'
import ExperiencesClient from './ExperiencesClient'
import { Experience } from '../../../../payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export default async function ExperiencesServer() {
  // Initialize payload
  const payload = await getPayloadHMR({ config })

  // Fetch experiences
  const experiences = await payload.find({ collection: 'experiences' })

  // Format experiences
  const formattedExperiences: Experience[] = experiences.docs.map((experience) => {
    return {
      id: experience.id,
      title: experience.title,
      location: experience.location || undefined, // Ensure 'location' is of type 'string | undefined'
      date: experience.date,
      description: experience.description,
      icon: experience.icon,
      createdAt: experience.createdAt,
      updatedAt: experience.updatedAt,
    } as Experience
  })

  // Render ExperiencesClient component with the fetched data
  return <ExperiencesClient experiences={formattedExperiences} />
}
