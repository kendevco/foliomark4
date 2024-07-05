// src/app/(app)/address-search/page.tsx
'use client'

import React from 'react'
import AddressSearchAndMap from '../_components/AddressSearchAndMap'
import styles from './AddressSearch.module.css'

export default function AddressSearchPage() {
  const handleSelectLocation = (location: any) => {
    console.log(location)
    // Handle the selected location as needed
  }

  return (
    <main
      className={`flex flex-grow flex-col items-center w-full h-full max-w-6xl mx-auto ${styles.addressSearchMain}`}
    >
      <h1 className="mb-4 text-2xl font-bold">Address Search</h1>
      <div className="flex-grow w-full overflow-hidden">
        <AddressSearchAndMap
          layout="responsive"
          onSelectLocation={handleSelectLocation}
          distance={1000}
        />
      </div>
    </main>
  )
}
