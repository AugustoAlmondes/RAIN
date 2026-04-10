import { create } from 'zustand'
import { searchCity, type GeoLocation } from '@/services/geocodingService'
import { fetchWeather } from '@/services/weatherService'
import { computeRiskResult, type RiskResult } from '@/utils/riskLevels'

const HISTORY_KEY = 'alertaclima_history'
const MAX_HISTORY = 5

export interface AnalysisState {
  loading: boolean
  error: string | null
  result: RiskResult | null
  city: string | null
  location: GeoLocation | null
  step: 'idle' | 'searching' | 'fetching_weather' | 'analyzing'
  history: string[]
  analyze: (query: string) => Promise<void>
  clearHistory: () => void
}

export const useAnalysis = create<AnalysisState>((set, get) => ({
  loading: false,
  error: null,
  result: null,
  city: null,
  location: null,
  step: 'idle',
  history: (() => {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  })(),
  clearHistory: () => {
    set({ history: [] })
    localStorage.removeItem(HISTORY_KEY)
  },
  analyze: async (query: string) => {
    if (!query.trim()) return

    set({ loading: true, error: null, step: 'searching', city: query })

    try {
      // 1. Search city
      const locations = await searchCity(query)
      if (locations.length === 0) {
        throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.')
      }

      const location = locations[0]
      const cityName = location.name

      // 2. Fetch weather
      set({ step: 'fetching_weather', city: cityName })
      const weather = await fetchWeather(location.lat, location.lon)

      // 3. Compute Risk (Deterministic local analysis)
      set({ step: 'analyzing' })
      
      // Simulate a small delay for better UX (so the user can see the steps)
      await new Promise((resolve) => setTimeout(resolve, 800))

      const riskInfo = computeRiskResult(weather)

      set({
        loading: false,
        error: null,
        result: riskInfo,
        city: cityName,
        location: location,
        step: 'idle',
      })

      // History logic
      const { history } = get()
      const filtered = history.filter((item) => item.toLowerCase() !== cityName.toLowerCase())
      const newHistory = [cityName, ...filtered].slice(0, MAX_HISTORY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      set({ history: newHistory })
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || 'Ocorreu um erro inesperado.',
        step: 'idle',
      })
    }
  }
}))
