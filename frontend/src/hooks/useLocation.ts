import { useState, useEffect } from 'react'

export interface LocationCoords {
  lat: number
  lon: number
}

export function useLocation() {
  const [coords, setCoords] = useState<LocationCoords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { timeout: 10000 }
    )
  }, [])

  return { coords, error, loading }
}
