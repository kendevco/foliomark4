'use client'
import { useTheme } from '@/context/theme-context'
import React, { useState } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'
import { FaArrowUp, FaUser, FaUserAlt } from 'react-icons/fa'

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const signIn = async () => {
    // Replace with your actual login endpoint and credentials
    const response = null

    if (response) {
      setIsLoggedIn(true)
    }
  }

  const signOut = async () => {
    // Replace with your actual logout endpoint
    const response = null

    if (response) {
      setIsLoggedIn(false)
    }
  }

  const handleExtractData = async () => {
    try {
      const response = await fetch('/api/extract-data')
      const result = await response.json()
      if (response.ok) {
        console.log(result.message)
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error('Error extracting data:', error)
    }
  }

  return (
    <>
      <div className="fixed flex gap-4 bottom-5 right-5">
        <button
          title="Toggle theme"
          className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <BsSun /> : <BsMoon />}
        </button>

        <button
          title="Scroll to top"
          className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          onClick={scrollToTop}
        >
          <FaArrowUp />
        </button>

        {isLoggedIn ? (
          <button
            title="Sign out"
            onClick={signOut}
            className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          >
            <FaUserAlt />
          </button>
        ) : (
          <button
            title="Sign in"
            onClick={signIn}
            className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          >
            <FaUser />
          </button>
        )}
      </div>
    </>
  )
}
