import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'

// Fix Leaflet default icon paths broken by Vite bundling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})
import type { RiskLevel } from '@/utils/riskLevels'

const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}

type WeatherLayer =
  | 'clouds_new'
  | 'precipitation_new'
  | 'pressure_new'
  | 'wind_new'
  | 'temp_new'

export interface MapMarker {
  lat: number
  lon: number
  label: string
  risk: RiskLevel
}

interface MapCenterProps {
  lat: number
  lon: number
  zoom?: number
}

function MapCenter({ lat, lon, zoom = 11 }: MapCenterProps) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lon], zoom, { duration: 1.2 })
  }, [lat, lon, zoom, map])
  return null
}

interface MapViewProps {
  center: [number, number]
  zoom?: number
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  weatherLayer?: WeatherLayer
}

export function MapView({ center, zoom = 11, markers = [], onMarkerClick, weatherLayer = 'temp_new' }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%', backgroundColor: '#272727' }}
      zoomControl={false}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
      /> {/* Mapa do fundo */}

      <TileLayer
        url={`https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`}
        attribution="&copy; OpenWeather"
        opacity={1}
      /> {/* Efeito do vento, nuvem, chuva, pressão e temperatura */}


      <MapCenter lat={center[0]} lon={center[1]} zoom={zoom} />

      {markers.map((marker, i) => (
        <CircleMarker
          key={i}
          center={[marker.lat, marker.lon]}
          radius={18}
          pathOptions={{
            color: RISK_COLORS[marker.risk],
            fillColor: RISK_COLORS[marker.risk],
            fillOpacity: 0.35,
            weight: 2,
          }}
          eventHandlers={{
            click: () => onMarkerClick?.(marker),
          }}
        >
          <Popup className='bg-surface/40 backdrop-blur-xl rounded-xl shadow-lg text-slate-400 w-max'>
            <div className="text-sm font-medium">{marker.label}</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
