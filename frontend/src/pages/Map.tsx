import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapView } from '@/components/map/MapView'
import { type MapMarker, type WeatherLayer } from '@/types/mapTypes'
import { RiskPanel } from '@/components/map/RiskPanel'
import { WeatherWidget } from '@/components/map/WeatherWidget'
import { SearchBar } from '@/components/map/SearchBar'
import { useWeather } from '@/hooks/useWeather'
import { computeRiskResult } from '@/utils/riskLevels'
import { reverseGeocode, type GeoLocation } from '@/services/geocodingService'
import { ArrowLeftIcon, CircleGauge, CloudRainIcon, CloudyIcon, Home, Loader2, Locate, NotepadText, PanelRight, ThermometerIcon, WindIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useTourStore } from '@/store/tourStore'
import { useLocationStore } from '@/store/locationStore'
import Spotlight from '@/components/map/Spotlight'
import { toast } from 'sonner'
import { Helmet } from 'react-helmet-async'


const BRAZIL_CENTER: [number, number] = [-14.235, -51.925]
const BRAZIL_ZOOM = 6
const DEFAULT_LOCATION = {
  lat: -23.5505,
  lon: -46.6333,
  name: 'São Paulo'
}

export const WEATHER_LAYERS: Record<WeatherLayer, React.ReactNode> = {
  clouds_new: <CloudyIcon className="w-4 h-4" />,
  precipitation_new: <CloudRainIcon className="w-4 h-4" />,
  pressure_new: <CircleGauge className="w-4 h-4" />,
  wind_new: <WindIcon className="w-4 h-4" />,
  temp_new: <ThermometerIcon className="w-4 h-4" />,
}

const MAP_STYLES = [
  {
    style: 'light_all',
    name: 'Claro',
    description: 'Mapa claro e equilibrado para uso geral'
  },
  {
    style: 'dark_all',
    name: 'Escuro',
    description: 'Mapa escuro ideal para destacar camadas e dados'
  },
  {
    style: 'voyager',
    name: 'Colorido',
    description: 'Mapa mais detalhado e colorido, próximo de mapas tradicionais'
  },
  {
    style: 'light_nolabels',
    name: 'Claro sem rótulos',
    description: 'Mapa claro sem nomes de ruas ou cidades'
  },
  {
    style: 'dark_nolabels',
    name: 'Escuro sem rótulos',
    description: 'Mapa escuro sem textos, útil para overlays'
  },
  {
    style: 'voyager_labels_under',
    name: 'Colorido com rótulos abaixo',
    description: 'Mantém os nomes abaixo das suas camadas e marcadores'
  }
]

export default function MapPage() {
  const [mapCenter, setMapCenter] = useState<[number, number]>(BRAZIL_CENTER)
  const [mapZoom, setMapZoom] = useState(BRAZIL_ZOOM)
  const [selectedLat, setSelectedLat] = useState<number | null>(null)
  const [selectedLon, setSelectedLon] = useState<number | null>(null)
  const [locationName, setLocationName] = useState('')
  const [layer, setLayer] = useState<WeatherLayer>('temp_new')
  const [mapStyle, setMapStyle] = useState<string>('dark_all')
  const [panelOpen, setPanelOpen] = useState(false)
  // const { openTour } = useTourStore()
  const openTour = useTourStore(state => state.openTour)
  const { searchLocation, setSearchLocation } = useLocationStore()
  const { data: weatherData, loading: weatherLoading } = useWeather({ lat: selectedLat, lon: selectedLon })

  const risk = weatherData ? computeRiskResult(weatherData) : null
  const navigate = useNavigate()

  const markers: MapMarker[] = selectedLat && selectedLon && risk ? [
    { lat: selectedLat, lon: selectedLon, label: locationName || 'Selecionado', risk: risk.primaryRisk.level },
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
      selectLocation(position.coords.latitude, position.coords.longitude)
    },
      () => {
        toast("Erro ao obter localização", {
          description: "Seu navegador bloqueou essa ação!"
        })
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
      selectLocation(searchLocation.lat, searchLocation.lon, searchLocation.name)
      setSearchLocation(null)
    }
    else {
      selectLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name)
    }
  }, [])

  return (
    <>
    <Helmet>
      <title>RAIN - Mapa</title>
      <meta name="description" content="Mapa de monitoramento de desastres naturais em tempo real com dados de satélite, radares meteorológicos e sensores em campo. Layers de chuva, vento, temperatura e pressão. Mapas de calor e alertas de desastres" />
    </Helmet>
      <div className="fixed inset-0 bg-bg flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 pt-10 pb-4 pointer-events-none">
          <HoverCard>
            <HoverCardTrigger>
              <motion.button
                id="tour-home"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="pointer-events-auto flex items-center justify-center px-3 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                <Home className="w-4 h-4" />
              </motion.button>
            </HoverCardTrigger>
            <HoverCardContent
              side='bottom'
              className='bg-gray-800 mt-1 backdrop-blur-xl rounded shadow-lg text-slate-400 w-max'>
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
                className="pointer-events-auto flex items-center justify-center w-11 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <Locate className="w-4 h-4" />
              </motion.button>
            </HoverCardTrigger>
            <HoverCardContent
              side='bottom'
              className='bg-gray-800 backdrop-blur-xl mt-1 rounded shadow-lg text-slate-400 w-max'>
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
                className="pointer-events-auto flex items-center justify-center px-3 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <NotepadText className="w-4 h-4" />
              </motion.button>
            </HoverCardTrigger>
            <HoverCardContent
              side='bottom'
              className='bg-gray-800 mt-1 backdrop-blur-xl rounded shadow-lg text-slate-400 w-max'>
              <p>Notícias</p>
            </HoverCardContent>
          </HoverCard>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPanelOpen(o => !o)}
            title="Painel de risco"
            className="pointer-events-auto md:hidden flex items-center justify-center w-11 h-11 bg-surface/90 backdrop-blur-xl border border-border-custom rounded shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all cursor-pointer"
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
              mapStyle={mapStyle}
            />

            <div id='tour-weather-widget' className="hidden md:block absolute top-4 right-4 z-20">
              <WeatherWidget risk={risk} locationName={locationName} loading={weatherLoading} />
            </div>

            <div className='absolute bottom-4 left-4 z-20 flex flex-row gap-4 items-end'>
              <div id="tour-map-layers" className='bg-surface/90 backdrop-blur-xl border border-border-custom rounded p-2 shadow-xl shadow-black/30 flex flex-col gap-2'>
                <h1 className='text-[14px] uppercase tracking-widest font-semibold px-1 text-slate-400 font-mono'>Ver:</h1>
                {Object.entries(WEATHER_LAYERS).map(([layerObj, icon]) => (
                  <HoverCard key={layerObj} openDelay={300} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <button
                        onClick={() => setLayer(layerObj as WeatherLayer)}
                        className={`relative flex items-center justify-center w-10 h-10 rounded transition-all duration-200 cursor-pointer
                          ${layer === layerObj
                            ? 'text-white'
                            : 'bg-white/3 border border-border-custom text-slate-400 hover:text-slate-200 hover:bg-white/6 hover:border-blue-500/50'}`}
                      >
                        {layer === layerObj && (
                          <motion.div
                            layoutId="active-layer"
                            className="absolute inset-0 bg-blue-600/30 border border-blue-500/50 rounded"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{icon}</span>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent side='right' className='bg-gray-800 ml-2 backdrop-blur-xl border border-border-custom rounded shadow-lg text-slate-400 w-max'>
                      <p className="capitalize text-xs leading-none"> {
                        layerObj === 'clouds_new' ? 'Nuvens' :
                          layerObj === 'precipitation_new' ? 'Precipitação' :
                            layerObj === 'pressure_new' ? 'Pressão' :
                              layerObj === 'wind_new' ? 'Vento' :
                                layerObj === 'temp_new' ? 'Temperatura' : layerObj
                      }</p>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>

              <div id="tour-map-styles" className='bg-surface backdrop-blur-xl border border-border-custom rounded p-4 shadow-xl shadow-black/30 max-w-[340px] font-mono'>
                <div className="flex items-center justify-between mb-3 text-slate-400">
                  <p className="text-[14px] uppercase tracking-widest font-semibold px-1">Estilo do mapa</p>
                  {weatherLoading && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  {MAP_STYLES.map(({ style, name, description }) => (
                    <HoverCard key={style} openDelay={300} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <button
                          onClick={() => setMapStyle(style)}
                          className={`relative flex items-center justify-center px-3 py-2 w-full h-full min-h-[40px] rounded text-xs font-medium transition-all duration-200 cursor-pointer text-center
                            ${mapStyle === style
                              ? 'text-white'
                              : 'text-slate-400 hover:text-slate-200 bg-white/3 hover:bg-white/6 border border-border-custom hover:border-blue-500/50'}`}
                        >
                          {mapStyle === style && (
                            <motion.div
                              layoutId="active-style"
                              className="absolute inset-0 bg-blue-600/30 border border-blue-500/50 rounded"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                          <span className="relative z-10">{name}</span>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent side='top' className='bg-gray-800 mb-1 border border-border-custom rounded shadow-lg text-slate-400 w-56'>
                        <p className="text-xs">{description}</p>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
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
