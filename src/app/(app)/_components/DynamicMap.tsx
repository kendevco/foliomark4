// src/app/(app)/_components/DynamicMap.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'

interface RestrictedZone {
  lat: number
  lng: number
  name: string
  types: string[]
  distance: number
}

interface DynamicMapProps {
  center: LatLngExpression
  restrictedZones: RestrictedZone[]
  userLocation: LatLngExpression | null
  distance: number
}

const DynamicMap: React.FC<DynamicMapProps> = ({
  center,
  restrictedZones,
  userLocation,
  distance,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const [isMapInitialized, setIsMapInitialized] = useState(false)

  useEffect(() => {
    console.log('DynamicMap useEffect - map initialization')
    if (!isMapInitialized && typeof window !== 'undefined') {
      try {
        mapRef.current = L.map('map').setView(center, 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current)

        // Set default icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

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
    console.log('DynamicMap useEffect - update map', { center, isMapInitialized, restrictedZones })
    if (mapRef.current && isMapInitialized) {
      try {
        mapRef.current.setView(center)
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Circle) {
            mapRef.current!.removeLayer(layer)
          }
        })

        // Add marker for the selected location
        L.marker(center).addTo(mapRef.current).bindTooltip('Selected Location').openTooltip()

        // Add marker for user location if available
        if (userLocation) {
          L.marker(userLocation).addTo(mapRef.current).bindTooltip('Your Location').openTooltip()
        }

        // Add circles for restricted zones
        restrictedZones.forEach((zone) => {
          L.circle([zone.lat, zone.lng], {
            color: zone.distance <= distance ? 'red' : 'green',
            fillColor: zone.distance <= distance ? '#f03' : '#0f3',
            fillOpacity: 0.2,
            radius: 304.8, // 1000 feet in meters
          })
            .bindTooltip(`${zone.name} - ${zone.distance.toFixed(2)} feet`)
            .addTo(mapRef.current!)
        })

        // Add legend
        const legend = L.control({ position: 'bottomright' })
        legend.onAdd = (map) => {
          const div = L.DomUtil.create('div', 'info legend')
          div.innerHTML = `
            <div style="background-color: white; padding: 5px; border-radius: 5px;">
              <div><span style="color: red;">●</span> Non-compliant</div>
              <div><span style="color: green;">●</span> Compliant</div>
            </div>
          `
          return div
        }
        legend.addTo(mapRef.current)

        console.log('Map updated successfully')
      } catch (error) {
        console.error('Error updating map:', error)
      }
    }
  }, [center, restrictedZones, userLocation, isMapInitialized, distance])

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>
}

export default React.memo(DynamicMap)
