// src\app\(app)\_components\_experiences\ExperiencesClient.tsx

'use client'

import React from 'react'
import SectionHeading from '../section-heading'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { useSectionInView } from '@/lib/hooks'
import { useTheme } from '@/context/theme-context'
import Image from 'next/image'
import { Experience } from '../../../../payload-types'

export default function ExperiencesClient({ experiences }: { experiences: Experience[] }) {
  const { ref } = useSectionInView('Experience')
  const { theme } = useTheme()

  const getBackground = (isLightTheme: boolean): string => {
    return isLightTheme ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)'
  }

  const lineColor = theme === 'light' ? '#e5e7eb' : 'rgba(229, 231, 235, 0.2)'

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <section id="experience" ref={ref} className="mb-12 scroll-mt-28 sm:mb-15">
      <SectionHeading>My experience</SectionHeading>
      <VerticalTimeline lineColor={lineColor}>
        {experiences.map((item, index) => {
          let descriptionText = ''
          if (item.description && item.description.root && item.description.root.children) {
            descriptionText = item.description.root.children
              .map((paragraph: any) =>
                paragraph.children.map((line: { text: string }) => line.text).join(' '),
              )
              .join(' ')
          }

          return (
            <VerticalTimelineElement
              key={index}
              className={`vertical-timeline-element--work custom-timeline-element ${
                index === 0
                  ? 'first-element'
                  : index === experiences.length - 1
                  ? 'last-element'
                  : ''
              }`}
              contentStyle={{
                background: getBackground(theme === 'light'),
                boxShadow: 'none',
                border: `1px solid ${
                  theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.5)'
                }`,
                textAlign: 'left',
                padding: '1.3rem 2rem',
                color: theme === 'light' ? 'black' : 'white',
              }}
              contentArrowStyle={{
                borderRight: `7px solid ${
                  theme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.5)'
                }`,
              }}
              date={item.date || 'Unknown Date'}
              icon={
                typeof item.icon === 'object' && item.icon && 'url' in item.icon ? (
                  <Image
                    src={item.icon.url as string}
                    alt={item.title || 'Experience Icon'}
                    className="rounded-full object-cover w-10 h-10 lg:w-[70px] lg:h-[60px]"
                    width={80}
                    height={80}
                  />
                ) : (
                  <Image
                    src={
                      typeof item.icon === 'string' && isValidUrl(item.icon)
                        ? item.icon
                        : 'https://via.placeholder.com/40'
                    }
                    alt={item.title || 'Experience Icon'}
                    className="object-cover w-10 h-10 rounded-full lg:w-20 lg:h-20"
                    width={80}
                    height={80}
                  />
                )
              }
              visible={true}
            >
              <h3 className="text-lg font-bold text-black vertical-timeline-element-title dark:text-white">
                {item.title}
              </h3>
              <h4 className="text-gray-700 vertical-timeline-element-subtitle text-md dark:text-gray-300">
                {item.location}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{descriptionText}</p>
            </VerticalTimelineElement>
          )
        })}
      </VerticalTimeline>
    </section>
  )
}
