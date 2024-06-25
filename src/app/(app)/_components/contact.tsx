'use client'

import React, { useEffect, useState } from 'react'
import SectionHeading from './section-heading'
import { motion } from 'framer-motion'
import { useSectionInView } from '@/lib/hooks'
import { sendEmail } from '@/actions/sendEmail'
import SubmitBtn from './submit-btn'
import { toast } from 'react-hot-toast'

export default function Contact() {
  const { ref } = useSectionInView('Contact')

  const [encodedEmail, setEncodedEmail] = useState('')

  useEffect(() => {
    const email = 'kenneth.courtney@gmail.com'
    const encoded = Array.from(email)
      .map((char) => `&#${char.charCodeAt(0)};`)
      .join('')
    setEncodedEmail(encoded)
  }, [])

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-12 w-[min(100%,38rem)] text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <SectionHeading>Contact me</SectionHeading>

      <p className="text-gray-700 -mt-6 dark:text-gray-300">
        Please contact me directly at{' '}
        <a
          className="underline text-blue-600 dark:text-blue-400"
          href={`mailto:${encodedEmail}`}
          dangerouslySetInnerHTML={{ __html: encodedEmail }}
        ></a>{' '}
        or through this form.
      </p>

      <form
        className="mt-10 flex flex-col text-gray-900 dark:text-gray-100"
        action={async (formData) => {
          const { data, error } = await sendEmail(formData)

          if (error) {
            toast.error(error)
            return
          }

          toast.success('Email sent successfully!')
        }}
      >
        <input
          className="h-14 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:focus:bg-gray-700 dark:focus:border-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          name="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
        />
        <textarea
          className="h-52 my-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:focus:bg-gray-700 dark:focus:border-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all outline-none p-4"
          name="message"
          placeholder="Your message"
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  )
}
