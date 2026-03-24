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
}

export function MapView({ center, zoom = 11, markers = [], onMarkerClick }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={19}
      />

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
          <Popup>
            <div className="text-sm font-medium">{marker.label}</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
