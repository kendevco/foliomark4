// src/app/(app)/_components/Map.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
})

interface MapProps {
  center: L.LatLngExpression
  restrictedZones?: L.LatLngExpression[][]
}

const Map: React.FC<MapProps> = ({ center, restrictedZones }) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      L.marker(center).addTo(mapRef.current)

      if (restrictedZones) {
        restrictedZones.forEach((zone, index) => {
          L.polygon(zone, { color: 'grey', fillOpacity: 0.5 }).addTo(mapRef.current!)
        })
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [center, restrictedZones])

  return <div ref={mapContainerRef} className="h-[35vh] rounded-lg" />
}

export default React.memo(Map)
