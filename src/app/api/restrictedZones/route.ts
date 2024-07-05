// src/app/api/restrictedZones/route.ts
import { NextResponse, NextRequest } from 'next/server'

interface GooglePlace {
  location: {
    latitude: number
    longitude: number
  }
  displayName: {
    text: string
    languageCode: string
  }
  types: string[]
}

type RestrictedZone = {
  lat: number
  lng: number
  name: string
  types: string[]
  distance: number
}

// Function to calculate distance between two points in feet using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance * 3280.84 // Convert to feet
}

// List of keywords to exclude (you can expand this list as needed)
const exclusionKeywords = ['pier', 'amusement_park', 'tourist_attraction', 'landmark']

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const distance = searchParams.get('distance') ? parseFloat(searchParams.get('distance')!) : 1000

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    console.error('Google Maps API key is not set in environment variables')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'places.displayName,places.location,places.types',
  })

  const googleUrl = 'https://places.googleapis.com/v1/places:searchNearby'

  try {
    const googleResponse = await fetch(googleUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationRestriction: {
          circle: {
            center: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
            },
            radius: 2500, // 762.0 = 2500 feet in meters
          },
        },
        includedTypes: [
          'playground',
          'child_care_agency',
          'preschool',
          'primary_school',
          'secondary_school',
          'community_center',
        ],
        maxResultCount: 20,
      }),
    }).then((response) => response.json())

    console.log('Google Places API response:', JSON.stringify(googleResponse.places, null, 2))

    const allPlaces = ((googleResponse.places || []) as GooglePlace[])
      .map((item) => {
        if (item.location) {
          return {
            lat: item.location.latitude,
            lng: item.location.longitude,
            name: item.displayName.text,
            types: item.types,
            distance: calculateDistance(
              parseFloat(lat),
              parseFloat(lng),
              item.location.latitude,
              item.location.longitude,
            ),
          }
        } else {
          return null
        }
      })
      .filter((zone): zone is RestrictedZone => zone !== null)
      .filter(
        (zone) =>
          !zone.types.some((type) => exclusionKeywords.includes(type)) &&
          !exclusionKeywords.some((keyword) =>
            zone.name.toLowerCase().includes(keyword.toLowerCase()),
          ),
      )

    const failingItems = allPlaces.filter((zone) => zone.distance <= distance)
    const isCompliant = failingItems.length === 0

    return NextResponse.json({
      isCompliant,
      nearbyPlaces: allPlaces.sort((a, b) => a.distance - b.distance),
      failingItems,
    })
  } catch (error) {
    console.error('Error in restrictedZones API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
