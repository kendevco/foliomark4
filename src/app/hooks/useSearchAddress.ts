import { useState, useCallback, useEffect } from 'react'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import type { RawResult } from 'leaflet-geosearch/dist/providers/bingProvider.js'
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js'

import { useDebounce } from './useDebounce'

interface UseSearchAddressResult {
  query: string
  results: Record<string, Array<SearchResult<RawResult>>>
  loading: boolean
  handleSearch: (value: string) => void
  selectedItem: SearchResult<RawResult> | null
  setSelectedItem: (item: SearchResult<RawResult> | null) => void
}

export const useSearchAddress = (): UseSearchAddressResult => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, Array<SearchResult<RawResult>>>>({})
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SearchResult<RawResult> | null>(null)

  const debouncedQuery = useDebounce(query, 500)

  const groupByType = useCallback(
    (data: Array<SearchResult<RawResult>>): Record<string, Array<SearchResult<RawResult>>> => {
      return data.reduce((acc, item) => {
        const { raw } = item
        const rawData = raw as unknown as any
        const type = rawData.class

        if (!acc[type]) {
          acc[type] = []
        }
        acc[type]?.push(item)
        return acc
      }, {} as Record<string, Array<SearchResult<RawResult>>>)
    },
    [],
  )

  const handleSearch = (value: string): void => {
    setQuery(value)
  }

  useEffect(() => {
    const fetchResults = async (): Promise<void> => {
      if (debouncedQuery.length > 2) {
        setLoading(true)
        try {
          const provider = new OpenStreetMapProvider()
          const searchResults = await provider.search({ query: debouncedQuery })
          setResults(groupByType(searchResults as unknown as Array<SearchResult<RawResult>>))
        } catch (error) {
          console.error('Error fetching address search results:', error)
          setResults({})
        } finally {
          setLoading(false)
        }
      } else {
        setResults({})
      }
    }

    fetchResults()
  }, [debouncedQuery, groupByType])

  return {
    query,
    results,
    loading,
    handleSearch,
    selectedItem,
    setSelectedItem,
  }
}
