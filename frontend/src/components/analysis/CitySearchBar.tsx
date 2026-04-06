import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, MapPin, Loader2, X, Sparkles } from 'lucide-react'
import { searchCity, type GeoLocation } from '@/services/geocodingService'
import { Button } from '@/components/ui/button'

interface CitySearchBarProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export function CitySearchBar({ onSearch, isLoading }: CitySearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [isSearching, setIsSearching] = useState(false)
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
      setIsSearching(true)
      try {
        const data = await searchCity(value)
        setResults(data)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500)
  }

  const handleSelect = (loc: GeoLocation) => {
    setQuery(loc.name)
    setOpen(false)
    setResults([])
    onSearch(loc.name)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setOpen(false)
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative group focus-within:ring-2 focus-within:ring-blue-500/20 rounded-2xl transition-all"
      >
        <div className="relative flex items-center rounded border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(66,119,192,0.3)] hover:border-gradient-text-primary/40 hover:shadow-[0_0_60px_-10px_rgba(66,119,192,0.4)] focus-within:border-gradient-text-primary/60 focus-within:shadow-[0_0_80px_-5px_rgba(66,119,192,0.5)] transition-all duration-500">

          <Search
            className="absolute left-5 w-4 h-4 text-slate-500 group-focus-within:text-gradient-text-primary transition-colors duration-300 shrink-0"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Digite o nome de uma cidade para analisar..."
            className="flex-1 bg-transparent pl-12 pr-12 py-4 text-sm text-white placeholder:text-slate-500 font-mono outline-none"
            disabled={isLoading}
          />


          {isSearching && (
            <Loader2 className="absolute right-32 w-4 h-4 text-slate-500 animate-spin" />
          )}

          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-32 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
            </button>
          )}

          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="mr-2 px-5 py-2.5 rounded bg-gradient-text-secondary hover:bg-gradient-text-primary text-white text-sm font-medium border border-gradient-text-primary/20 hover:border-gradient-text-primary/60 transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analisar</span>
          </Button>

        </div>

        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full mt-3 w-full bg-surface/95 backdrop-blur-3xl border border-white/10 rounded overflow-hidden shadow-2xl shadow-black/80 z-50 divide-y divide-white/5"
            >
              {results.map((loc, i) => (
                <li key={`${loc.lat}-${loc.lon}-${i}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left flex items-start gap-4 px-6 py-4 hover:bg-white/5 transition-colors group/item cursor-pointer"
                  >
                    <div className="p-2 bg-blue-500/10 rounded group-hover/item:bg-blue-500/20 transition-colors">
                      <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base text-white font-semibold truncate group-hover/item:text-blue-200 transition-colors">
                        {loc.name}
                      </p>
                      <p className="text-sm text-slate-400 truncate mt-0.5">
                        {loc.address.state ? `${loc.address.state}, ` : ''}
                        {loc.address.country}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
