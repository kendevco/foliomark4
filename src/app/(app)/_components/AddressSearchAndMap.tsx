// src/app/(app)/_components/AddressSearchAndMap.tsx
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import AddressVerifier from './addressverifier'
import DynamicMap from './DynamicMap'
import { LatLngExpression, LatLngTuple } from 'leaflet'
import fetchRestrictedZones from '../../hooks/fetchRestrictedZones'

interface AddressSearchAndMapProps {
  layout: 'responsive'
  onSelectLocation: (location: any) => void
  distance: number
}

const AddressSearchAndMap: React.FC<AddressSearchAndMapProps> = ({
  layout,
  onSelectLocation,
  distance,
}) => {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([])
  const [failingItems, setFailingItems] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setIsLoading(false)
        },
        (error) => {
          console.error('Error getting user location:', error)
          setIsLoading(false)
        },
      )
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleLocationSelect = useCallback(
    async (item: any) => {
      console.log('Location selected:', item)
      setSelectedItem(item)
      onSelectLocation(item)
      try {
        const { nearbyPlaces, failingItems } = await fetchRestrictedZones(item, distance)
        setNearbyPlaces(nearbyPlaces)
        setFailingItems(failingItems)
      } catch (error) {
        console.error('Error fetching restricted zones:', error)
        setNearbyPlaces([])
        setFailingItems([])
      }
    },
    [onSelectLocation, distance],
  )

  const mapCenter: LatLngTuple | null = useMemo(() => {
    if (selectedItem && typeof selectedItem.y === 'number' && typeof selectedItem.x === 'number') {
      return [selectedItem.y, selectedItem.x]
    }
    return userLocation
  }, [selectedItem, userLocation])

  console.log('Rendering AddressSearchAndMap', { mapCenter, isLoading, nearbyPlaces })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col w-full gap-6 lg:flex-row">
      <div className="w-full space-y-6 lg:w-1/2">
        <AddressVerifier onSelectLocation={handleLocationSelect} />

        {nearbyPlaces.length > 0 && (
          <div className="overflow-hidden bg-gray-100 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="px-4 py-3 font-semibold text-blue-700 border-b border-blue-100 bg-blue-50 dark:bg-gray-700 dark:text-blue-300 dark:border-gray-600">
              Nearby Places (within 2500 feet)
            </h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {nearbyPlaces.map((item, index) => (
                <li
                  key={index}
                  className="p-4 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.types.join(', ')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.distance <= distance
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {item.distance.toFixed(2)} feet
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {failingItems.length > 0 && (
          <div className="overflow-hidden bg-red-100 border border-red-200 rounded-lg shadow-sm dark:bg-red-900 dark:border-red-700">
            <h2 className="px-4 py-3 font-semibold text-red-700 border-b border-red-100 bg-red-50 dark:bg-red-800 dark:text-red-200 dark:border-red-600">
              Non-compliant Items
            </h2>
            <ul className="divide-y divide-red-100 dark:divide-red-700">
              {failingItems.map((item, index) => (
                <li
                  key={index}
                  className="p-4 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-800"
                >
                  <h3 className="font-medium text-red-900 dark:text-red-100">{item.name}</h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-200">
                    {item.types.join(', ')}
                  </p>
                  <p className="mt-2 text-sm font-medium text-red-900 dark:text-red-100">
                    Distance: {item.distance.toFixed(2)} feet
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2">
        {mapCenter ? (
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden h-[600px]">
            <DynamicMap
              key={`${mapCenter[0]}-${mapCenter[1]}`}
              center={mapCenter}
              restrictedZones={nearbyPlaces}
              userLocation={userLocation}
              distance={distance}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[600px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Select a location to view the map</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressSearchAndMap
