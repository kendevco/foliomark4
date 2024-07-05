// src/app/hooks/fetchRestrictedZones.ts
export default async function fetchRestrictedZones(item: any, distance: number) {
  try {
    const response = await fetch(
      `/api/restrictedZones?lat=${item.y}&lng=${item.x}&distance=${distance}`,
      {
        method: 'GET',
      },
    )
    if (!response.ok) {
      console.error('Failed to fetch restricted zones', response)
      return { nearbyPlaces: [], failingItems: [] }
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching restricted zones:', error)
    return { nearbyPlaces: [], failingItems: [] }
  }
}
