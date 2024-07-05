// src/app/(app)/_components/MapComponent.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'

interface MapComponentProps {
  center: LatLngExpression
  restrictedZones: LatLngExpression[][]
  userLocation: LatLngExpression | null
}

const MapComponent: React.FC<MapComponentProps> = ({ center, restrictedZones, userLocation }) => {
  const mapRef = useRef<L.Map | null>(null)
  const [isMapInitialized, setIsMapInitialized] = useState(false)

  useEffect(() => {
    console.log('MapComponent useEffect - map initialization')
    if (!isMapInitialized && typeof window !== 'undefined') {
      try {
        mapRef.current = L.map('map').setView(center, 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current)
        setIsMapInitialized(true)
        console.log('Map initialized successfully')
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        setIsMapInitialized(false)
        console.log('Map cleanup on component unmount')
      }
    }
  }, [])

  useEffect(() => {
    console.log('MapComponent useEffect - update map', { center, isMapInitialized })
    if (mapRef.current && isMapInitialized) {
      try {
        mapRef.current.setView(center)
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polygon) {
            mapRef.current!.removeLayer(layer)
          }
        })

        L.marker(center).addTo(mapRef.current)

        if (userLocation) {
          L.marker(userLocation).addTo(mapRef.current)
        }

        restrictedZones.forEach((zone) => {
          L.polygon(zone).addTo(mapRef.current!)
        })

        console.log('Map updated successfully')
      } catch (error) {
        console.error('Error updating map:', error)
      }
    }
  }, [center, restrictedZones, userLocation, isMapInitialized])

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>
}

export default React.memo(MapComponent)
