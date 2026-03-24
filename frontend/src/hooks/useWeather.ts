import { useState, useEffect, useCallback } from 'react'
import { fetchWeather, type WeatherData } from '@/services/weatherService'

interface UseWeatherOptions {
  lat: number | null
  lon: number | null
}

export function useWeather({ lat, lon }: UseWeatherOptions) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchWeather(latitude, longitude)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados climáticos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetch(lat, lon)
    }
  }, [lat, lon, fetch])

  return { data, loading, error, refetch: fetch }
}
