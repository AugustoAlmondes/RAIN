import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapView } from '@/components/map/MapView'
import { type MapMarker, type WeatherLayer } from '@/types/mapTypes'
import { RiskPanel } from '@/components/map/RiskPanel'
import { WeatherWidget } from '@/components/map/WeatherWidget'
import { SearchBar } from '@/components/map/SearchBar'
import { useWeather } from '@/hooks/useWeather'
import { computeRisk } from '@/utils/riskLevels'
import { reverseGeocode, type GeoLocation } from '@/services/geocodingService'
import { ArrowLeftIcon, Home, Loader2, Locate, NotepadText, PanelRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useTourStore } from '@/store/tourStore'
import { useLocationStore } from '@/store/locationStore'
import Spotlight from '@/components/map/Spotlight'
import { toast } from 'sonner'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'

const BRAZIL_CENTER: [number, number] = [-14.235, -51.925]
const BRAZIL_ZOOM = 6

export const WEATHER_LAYERS: Record<WeatherLayer, string> = {
  clouds_new: 'Nuvens',
  precipitation_new: 'Precipitação',
  pressure_new: 'Pressão',
  wind_new: 'Vento',
  temp_new: 'Temperatura',
}

export default function MapPage() {
  const [mapCenter, setMapCenter] = useState<[number, number]>(BRAZIL_CENTER)
  const [mapZoom, setMapZoom] = useState(BRAZIL_ZOOM)
  const [selectedLat, setSelectedLat] = useState<number | null>(null)
  const [selectedLon, setSelectedLon] = useState<number | null>(null)
  const [locationName, setLocationName] = useState('')
  const [layer, setLayer] = useState<WeatherLayer>('temp_new')
  const [panelOpen, setPanelOpen] = useState(false)
  const selectedPeriod = '24h'
  const { openTour } = useTourStore()
  const { searchLocation, setSearchLocation } = useLocationStore()
  const { data: weatherData, loading: weatherLoading } = useWeather({ lat: selectedLat, lon: selectedLon })

  const risk = weatherData ? computeRisk(weatherData, selectedPeriod) : null
  const navigate = useNavigate()

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


  const handleGeolocate = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
      console.log('teste')
      selectLocation(position.coords.latitude, position.coords.longitude)
    },
      (error) => {
        toast("Erro ao obter localização", {
          description: "Seu navegador bloqueou essa ação!"
        })
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 4000,
        maximumAge: 0
      }
    )
  }

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setLocationName(marker.label)
    setPanelOpen(true)
  }, [])

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('rain_map_tour_seen');

    if (!hasSeenTour) {
      openTour();
      localStorage.setItem('rain_map_tour_seen', 'true')
    }
  }, [openTour])

  useEffect(() => {
    if (searchLocation) {
      console.log(searchLocation)
      selectLocation(searchLocation.lat, searchLocation.lon, searchLocation.name)
      setSearchLocation(null)
    }
  }, [])

  return (
    <>
      <div className="fixed inset-0 bg-bg flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 pt-10 pb-4 pointer-events-none">
          <HoverCard>
            <HoverCardTrigger>
              <motion.button
                id="tour-home"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="pointer-events-auto flex items-center justify-center px-3 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded-xl shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                <Home className="w-4 h-4" />
              </motion.button>
            </HoverCardTrigger>
            <HoverCardContent
              side='bottom'
              className='bg-surface/40 mt-1 backdrop-blur-xl rounded-xl shadow-lg text-slate-400 w-max'>
              <p>Voltar</p>
            </HoverCardContent>
          </HoverCard>

          <div className="flex-1 max-w-sm pointer-events-auto">
            <div id='tour-search' className='flex-1 pointer-events-auto'>
              <SearchBar onLocationSelect={handleLocationSelect} />
            </div>
          </div>

          <HoverCard openDelay={300} closeDelay={100} >
            <HoverCardTrigger>
              <motion.button
                id="tour-geolocate"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGeolocate}
                className="pointer-events-auto flex items-center justify-center w-11 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded-xl shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <Locate className="w-4 h-4" />
              </motion.button>
            </HoverCardTrigger>
            <HoverCardContent
              side='bottom'
              className='bg-surface/40 backdrop-blur-xl mt-1 rounded-xl shadow-lg text-slate-400 w-max'>
              <p>Usar minha localização</p>
            </HoverCardContent>
          </HoverCard>


          <HoverCard openDelay={300} closeDelay={100} >
            <HoverCardTrigger>
              <motion.button
                id="tour-news"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/noticias')}
                className="pointer-events-auto flex items-center justify-center px-3 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded-xl shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <NotepadText className="w-4 h-4" />
              </motion.button>
            </HoverCardTrigger>
            <HoverCardContent
              side='bottom'
              className='bg-surface/40 mt-1 backdrop-blur-xl rounded-xl shadow-lg text-slate-400 w-max'>
              <p>Notícias</p>
            </HoverCardContent>
          </HoverCard>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPanelOpen(o => !o)}
            title="Painel de risco"
            className="pointer-events-auto md:hidden flex items-center justify-center w-11 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded-xl shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
          >
            <PanelRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex-1 flex overflow-hidden bg-black">
          <div className="relative flex-1 overflow-hidden">
            <MapView
              center={mapCenter}
              zoom={mapZoom}
              markers={markers}
              onMarkerClick={handleMarkerClick}
              weatherLayer={layer}
            />

            <div id='tour-weather-widget' className="hidden md:block absolute top-4 right-4 z-20">
              <WeatherWidget risk={risk} locationName={locationName} loading={weatherLoading} />
            </div>

            <div className='absolute bottom-4 left-4 z-20'>
              <div className='bg-surface/90 backdrop-blur-xl border border-border-custom rounded p-4 shadow-xl shadow-black/30 min-w-[320px]'>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-400 font-medium truncate max-w-[130px]">Exibir</p>
                  {weatherLoading && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                </div>
                <ul className='grid grid-cols-2 gap-2'>
                  {Object.entries(WEATHER_LAYERS).map(([layerObj, label]) => (
                    <li key={layerObj}>
                      <Card
                        onClick={() => setLayer(layerObj as WeatherLayer)}
                        className={`bg-surface/90 backdrop-blur-xl py-2 gap-2 w-40 border border-border-custom rounded shadow-xl shadow-black/30 hover:bg-white/6 hover:border-blue-500/50 transitio-all duration-200 cursor-pointer ${layer === layerObj ? 'border-blue-500/50' : ''}`}>
                        <CardHeader>
                          <CardDescription className="flex items-center gap-1.5 text-slate-500 uppercase text-sm tracking-wider font-semibold">
                            {label}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>


          <AnimatePresence>
            {panelOpen && (
              <motion.div
                id='tour-risk-panel'
                initial={{ width: 'auto', opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 'auto', opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="hidden md:flex h-full overflow-hidden shrink-0 "
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
      <Spotlight />
    </>
  )
}
