// src/app/(app)/_components/AddressVerifier.tsx
'use client'

import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { useSearchAddress } from '../../hooks/useSearchAddress'

const AddressVerifier: React.FC<{ onSelectLocation: (location: any) => void }> = ({
  onSelectLocation,
}) => {
  const { query, results, loading, handleSearch, selectedItem, setSelectedItem } =
    useSearchAddress()

  const handleSelect = useCallback(
    (item: any) => {
      setSelectedItem(item)
      onSelectLocation(item)
    },
    [onSelectLocation, setSelectedItem],
  )

  return (
    <div>
      <Input
        type="text"
        placeholder="Search for an address..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="box-border w-full p-2 mb-2"
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="relative p-2 overflow-y-auto border border-gray-300 rounded-md max-h-50">
          {Object.keys(results).map((type) => (
            <div key={type} className="mb-2">
              <h4 className="m-0 mb-1">{type}</h4>
              <ul className="p-0 m-0 list-none">
                {results[type].map((item: any) => (
                  <li
                    key={item.label}
                    onClick={() => handleSelect(item)}
                    className="p-1 cursor-pointer"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(AddressVerifier)
