import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapView, type MapMarker } from '@/components/map/MapView'
import { MapFilters } from '@/components/map/MapFilters'
import { RiskPanel } from '@/components/map/RiskPanel'
import { WeatherWidget } from '@/components/map/WeatherWidget'
import { SearchBar } from '@/components/map/SearchBar'
import { useLocation } from '@/hooks/useLocation'
import { useWeather } from '@/hooks/useWeather'
import { computeRisk, type DisasterType, type Period } from '@/utils/riskLevels'
import { reverseGeocode, type GeoLocation } from '@/services/geocodingService'
import { Locate, PanelRight } from 'lucide-react'

// Default: Brazil center
const BRAZIL_CENTER: [number, number] = [-14.235, -51.925]
const BRAZIL_ZOOM = 4

export default function MapPage() {
  const [mapCenter, setMapCenter] = useState<[number, number]>(BRAZIL_CENTER)
  const [mapZoom, setMapZoom] = useState(BRAZIL_ZOOM)
  const [selectedLat, setSelectedLat] = useState<number | null>(null)
  const [selectedLon, setSelectedLon] = useState<number | null>(null)
  const [locationName, setLocationName] = useState('')
  const [selectedType, setSelectedType] = useState<DisasterType>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('24h')
  const [panelOpen, setPanelOpen] = useState(false)

  const { coords } = useLocation()
  const { data: weatherData, loading: weatherLoading } = useWeather({ lat: selectedLat, lon: selectedLon })

  const risk = weatherData ? computeRisk(weatherData, selectedPeriod) : null

  // Markers: selected location + simulated region markers around it
  const markers: MapMarker[] = selectedLat && selectedLon && risk ? [
    { lat: selectedLat, lon: selectedLon, label: locationName || 'Selecionado', risk: risk.level },
  ] : []

  const selectLocation = useCallback(async (lat: number, lon: number, name?: string) => {
    setSelectedLat(lat)
    setSelectedLon(lon)
    setMapCenter([lat, lon])
    setMapZoom(12)
    setPanelOpen(true)
    if (name) {
      setLocationName(name)
    } else {
      try {
        const resolved = await reverseGeocode(lat, lon)
        setLocationName(resolved)
      } catch {
        setLocationName('Localização')
      }
    }
  }, [])

  const handleLocationSelect = useCallback((loc: GeoLocation) => {
    selectLocation(loc.lat, loc.lon, loc.name)
  }, [selectLocation])

  const handleGeolocate = useCallback(() => {
    if (coords) {
      selectLocation(coords.lat, coords.lon)
    }
  }, [coords, selectLocation])

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setLocationName(marker.label)
    setPanelOpen(true)
  }, [])

  return (
    <div className="fixed inset-0 bg-bg flex flex-col">
      {/* Top overlay bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 pt-20 pb-4 pointer-events-none">
        <div className="flex-1 max-w-sm pointer-events-auto">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>

        {/* Geolocate button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGeolocate}
          title="Usar minha localização"
          className="pointer-events-auto flex items-center justify-center w-10 h-10 bg-surface/90 backdrop-blur-xl border border-border-custom rounded-xl shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
        >
          <Locate className="w-4 h-4" />
        </motion.button>

        {/* Toggle panel (mobile) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPanelOpen(o => !o)}
          title="Painel de risco"
          className="pointer-events-auto md:hidden flex items-center justify-center w-10 h-10 bg-surface/90 backdrop-blur-xl border border-border-custom rounded-xl shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
        >
          <PanelRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Map fills remaining space */}
        <div className="relative flex-1 overflow-hidden">
          <MapView
            center={mapCenter}
            zoom={mapZoom}
            markers={markers}
            onMarkerClick={handleMarkerClick}
          />

          {/* Filters — bottom-left overlay */}
          <div className="absolute bottom-6 left-4 z-20">
            <MapFilters
              selectedType={selectedType}
              selectedPeriod={selectedPeriod}
              onTypeChange={setSelectedType}
              onPeriodChange={setSelectedPeriod}
            />
          </div>

          {/* WeatherWidget — top-right overlay (inside map, only on desktop) */}
          <div className="hidden md:block absolute top-4 right-4 z-20">
            <WeatherWidget risk={risk} locationName={locationName} loading={weatherLoading} />
          </div>
        </div>

        {/* Risk Panel — right column on desktop, bottom sheet on mobile */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="hidden md:flex h-full overflow-hidden flex-shrink-0"
            >
              <RiskPanel
                risk={risk}
                weather={weatherData}
                locationName={locationName}
                loading={weatherLoading}
                onClose={() => setPanelOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden absolute bottom-0 left-0 right-0 z-40 h-[65vh] rounded-t-2xl overflow-hidden"
          >
            <RiskPanel
              risk={risk}
              weather={weatherData}
              locationName={locationName}
              loading={weatherLoading}
              onClose={() => setPanelOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
