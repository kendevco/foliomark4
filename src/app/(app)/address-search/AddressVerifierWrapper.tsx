// src/app/(app)/address-search/AddressVerifierWrapper.tsx
'use client'

import React from 'react'
import AddressVerifier from '../_components/addressverifier'

const AddressVerifierWrapper: React.FC = () => {
  const handleSelectLocation = (location: any) => {
    console.log(location)
    // Handle the selected location as needed
  }

  return <AddressVerifier onSelectLocation={handleSelectLocation} />
}

export default AddressVerifierWrapper
