// src/app/(app)/_components/_about/AboutClient.tsx
'use client'

import React from 'react'
import SectionHeading from '../section-heading'
import { motion, HTMLMotionProps } from 'framer-motion'
import { useSectionInView } from '@/lib/hooks'

declare module 'framer-motion' {
  export interface HTMLMotionProps<T> extends React.HTMLAttributes<T> {
    className?: string
  }
}

type Content = {
  root: {
    type: string
    children: Array<{
      type: string
      children: Array<{ mode: string; text: string }>
    }>
  }
}

export default function AboutClient({ content }: { content: any }) {
  const { ref } = useSectionInView('About')

  return (
    <motion.section
      ref={ref}
      className="mb-12 max-w-[45rem] text-center leading-8 sm:mb-15 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <div className="inline-block w-full text-justify text-gray-950 dark:text-gray-300">
        {content.root.children.map((paragraph: any, index: number) => (
          <p key={index} className="mb-1 text-gray-950 dark:text-gray-300">
            {paragraph.children.map((line: { text: string }) => line.text).join(' ')}
          </p>
        ))}
      </div>
      {false && <div className="inline-block w-full text-justify">Vapi Bot Here</div>}
    </motion.section>
  )
}
