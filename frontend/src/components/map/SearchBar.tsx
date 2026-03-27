import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, MapPin, Loader2, X } from 'lucide-react'
import { searchCity, type GeoLocation } from '@/services/geocodingService'

interface SearchBarProps {
  onLocationSelect: (location: GeoLocation) => void
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchCity(value)
        setResults(data)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  const handleSelect = (loc: GeoLocation) => {
    setQuery(loc.name)
    setOpen(false)
    setResults([])
    onLocationSelect(loc)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      {/* Input */}
      <div className="relative flex items-center bg-surface/90 backdrop-blur-xl border border-border-custom rounded-xl overflow-hidden shadow-lg shadow-black/30 focus-within:border-blue-500/50 transition-colors">
        <Search className="absolute left-3 w-4 h-4 text-slate-500 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar cidade..."
          className="w-full bg-transparent pl-9 pr-8 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
        />
        {loading ? (
          <Loader2 className="absolute right-3 w-4 h-4 text-slate-500 animate-spin" />
        ) : query ? (
          <button onClick={handleClear} className="absolute right-3 cursor-pointer">
            <X className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
          </button>
        ) : null}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-surface/95 backdrop-blur-xl border border-border-custom rounded-xl overflow-hidden shadow-xl shadow-black/40 z-10"
          >
            {results.map((loc, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate group-hover:text-blue-100 transition-colors">
                      {loc.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{loc.address.state} - {loc.address.country}</p>
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
