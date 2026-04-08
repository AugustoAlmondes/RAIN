import 'leaflet/dist/leaflet.css'
import { MapPin, ExternalLink } from 'lucide-react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'

interface MapPreviewProps {
  lat: number
  lon: number
  city: string
  onViewOnMap: () => void
}

/** Flyto helper — must be a top-level component, not nested inside another component */
function FlyTo({ lat, lon, zoom }: { lat: number; lon: number; zoom: number }) {
  const map = useMap()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      map.setView([lat, lon], zoom)
      initialized.current = true
    } else {
      map.flyTo([lat, lon], zoom, { duration: 0.8 })
    }
  }, [lat, lon, zoom, map])

  return null
}

/**
 * Non-interactive map preview using react-leaflet.
 * All interaction is disabled — it only shows the location visually.
 */
export function MapPreview({ lat, lon, city, onViewOnMap }: MapPreviewProps) {
  const zoom = 10

  return (
    <div className="rounded overflow-hidden border border-white/10 relative group">
      {/* Fixed-height container — Leaflet needs explicit px height to render */}
      <div className="relative" style={{ height: '280px' }}>
        <MapContainer
          center={[lat, lon]}
          zoom={zoom}
          zoomControl={false}
          attributionControl={false}
          dragging={false}
          touchZoom={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
          />
          <FlyTo lat={lat} lon={lon} zoom={zoom} />
        </MapContainer>

        {/* Dark vignette to blend edges with the dark UI */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
            zIndex: 400,
          }}
        />

        {/* Crosshair pin at center */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 500 }}
        >
          <div className="flex flex-col items-center drop-shadow-lg">
            <div
              className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.95)' }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <div className="w-px h-3 bg-blue-400" />
          </div>
        </div>

        {/* City label */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded border border-white/10"
          style={{ zIndex: 500 }}
        >
          <MapPin className="w-3 h-3 text-blue-400" />
          {city}
        </div>
      </div>

      {/* CTA button below the map */}
      <button
        onClick={onViewOnMap}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface/80 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border-t border-white/10 transition-all duration-200 font-semibold text-sm cursor-pointer"
      >
        <ExternalLink className="w-4 h-4" />
        Abrir mapa interativo
      </button>
    </div>
  )
}
