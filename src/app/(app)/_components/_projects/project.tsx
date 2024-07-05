// src\app\(app)\_components\_projects\project.tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { Project } from '../../../../payload-types'

interface ProjectProps extends Project {}

export default function ProjectCard({
  title,
  description,
  tags,
  image,
  href,
  updatedAt,
  createdAt,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['0 1', '1.33 1'],
  })
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1])

  // Extract description text
  const descriptionText =
    description?.root.children
      .map((paragraph) => {
        if (Array.isArray(paragraph.children)) {
          return paragraph.children.map((line: { text: string }) => line.text).join(' ')
        }
        return ''
      })
      .join(' ') || ''

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
      }}
      className="mb-2 group sm:mb-4 last:mb-0"
    >
      <CardContainer containerClassName="w-full h-full grid grid-cols-1" className="h-full">
        <CardBody className="h-full">
          <CardItem translateZ={60} className="relative w-full h-64">
            {typeof image === 'object' && image && 'url' in image && (
              <Image
                src={image.url as string}
                alt={image.text ?? ''}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg shadow-2xl"
              />
            )}
          </CardItem>
          <CardItem className="flex flex-col w-full h-full px-5 pt-4 pb-7">
            <h3 className="text-2xl font-semibold dark:text-white">{title}</h3>
            <p className="mt-2 leading-relaxed text-gray-700 dark:text-white">{descriptionText}</p>
            <ul className="flex flex-wrap gap-2 mt-4">
              {tags?.map((tag) => (
                <li
                  className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:bg-white/10 dark:text-white"
                  key={tag?.id ?? tag.tag} // Ensure each tag has a unique key
                >
                  {tag?.tag}
                </li>
              ))}
            </ul>
            {href && (
              <a
                href={href}
                className="px-4 py-2 mt-4 text-white transition bg-blue-500 rounded-md hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
              >
                Visit Website
              </a>
            )}
          </CardItem>
        </CardBody>
      </CardContainer>
    </motion.div>
  )
}
