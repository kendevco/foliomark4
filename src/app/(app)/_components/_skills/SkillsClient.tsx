// src/app/(app)/_components/_skills/SkillsClient.tsx
'use client'

import React from 'react'
import SectionHeading from '../section-heading'
import { motion } from 'framer-motion'
import { useSectionInView } from '@/lib/hooks'

type Skill = {
  id: string
  name: string
}

const fadeInAnimationVariants = {
  initial: { opacity: 0, y: 100 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * index },
  }),
}

export default function SkillsClient({ skills }: { skills: Skill[] }) {
  const { ref } = useSectionInView('Skills')

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-12 max-w-[53rem] scroll-mt-28 text-center sm:mb-15"
    >
      <SectionHeading>My skills</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800 dark:text-gray-100">
        {skills.map((skill, index) => (
          <motion.li
            className="px-5 py-3 bg-white border-black rounded-xl dark:bg-gray-800 dark:text-gray-200"
            key={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
          >
            {skill.name}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
