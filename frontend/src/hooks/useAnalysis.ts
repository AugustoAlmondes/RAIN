import { useState, useCallback } from 'react'
import { searchCity, type GeoLocation } from '@/services/geocodingService'
import { fetchWeather } from '@/services/weatherService'
import { computeRisk, type RiskInfo } from '@/utils/riskLevels'

const HISTORY_KEY = 'alertaclima_history'
const MAX_HISTORY = 5

export interface AnalysisState {
  loading: boolean
  error: string | null
  result: RiskInfo | null
  city: string | null
  location: GeoLocation | null
  step: 'idle' | 'searching' | 'fetching_weather' | 'analyzing'
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    result: null,
    city: null,
    location: null,
    step: 'idle',
  })

  const [history, setHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  })

  const saveToHistory = useCallback((cityName: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cityName.toLowerCase())
      const newHistory = [cityName, ...filtered].slice(0, MAX_HISTORY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  const analyze = useCallback(async (query: string) => {
    if (!query.trim()) return

    setState((prev) => ({ ...prev, loading: true, error: null, step: 'searching', city: query }))

    try {
      // 1. Search city
      const locations = await searchCity(query)
      if (locations.length === 0) {
        throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.')
      }

      const location = locations[0]
      const cityName = location.name

      // 2. Fetch weather
      setState((prev) => ({ ...prev, step: 'fetching_weather', city: cityName }))
      const weather = await fetchWeather(location.lat, location.lon)

      // 3. Compute Risk (Deterministic local analysis)
      setState((prev) => ({ ...prev, step: 'analyzing' }))
      
      // Simulate a small delay for better UX (so the user can see the steps)
      await new Promise((resolve) => setTimeout(resolve, 800))

      const riskInfo = computeRisk(weather)

      setState({
        loading: false,
        error: null,
        result: riskInfo,
        city: cityName,
        location: location,
        step: 'idle',
      })

      saveToHistory(cityName)
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Ocorreu um erro inesperado.',
        step: 'idle',
      }))
    }
  }, [saveToHistory])

  return {
    ...state,
    analyze,
    history,
    clearHistory,
  }
}
