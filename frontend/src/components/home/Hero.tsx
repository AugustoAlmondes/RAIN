import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Loader2, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { searchCity, type GeoLocation } from "@/services/geocodingService"
import { useLocationStore } from "@/store/locationStore"

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" as const },
    },
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
}

export default function Hero({ mapRef }: { mapRef: any }) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<GeoLocation[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    
    const navigate = useNavigate()
    const { setSearchLocation } = useLocationStore()

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handleSearchChange = (value: string) => {
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
        setSearchLocation(loc)
        navigate('/mapa')
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            if (results.length > 0) {
                handleSelect(results[0])
            } else {
                setLoading(true)
                try {
                    const data = await searchCity(query)
                    if (data.length > 0) {
                        handleSelect(data[0])
                    } else {
                        navigate('/mapa')
                    }
                } catch {
                    navigate('/mapa')
                } finally {
                    setLoading(false)
                }
            }
        } else {
            mapRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleClear = () => {
        setQuery('')
        setResults([])
        setOpen(false)
    }

    return (
        <section
            className="
        relative flex flex-col items-center justify-center
        w-full min-h-screen pt-16 mt-[-64px]
        bg-[url('/images/mapa-bg.png')] bg-cover bg-center
        overflow-hidden border-b-2 border-border-custom"
        >
            {/* Dark overlay to improve text legibility over the map image */}
            <div className="absolute inset-0 bg-black/10 z-0" />

            {/* Bottom fade to blend seamlessly into MapPreview aurora */}
            <div
                className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 60%, #000000 100%)",
                }}
            />

            {/* Content */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col items-center text-center px-6 pt-30 max-w-4xl mx-auto"
            >
                {/* Badge */}
                <motion.div variants={itemVariants}>
                    <span
                        className=" inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-gradient-text-primary/30 bg-gradient-text-primary/10 backdrop-blur-md text-gradient-text-primary text-xs font-mono tracking-widest uppercase"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-text-primary animate-pulse" />
                        Monitoramento em tempo real
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="
            text-4xl md:text-6xl lg:text-7xl
            font-light tracking-tight text-white
            leading-[1.1] mb-5"
                >
                    Antecipe o amanhã,{" "}
                    <span
                        className="font-medium text-transparent bg-clip-text bg-linear-to-r from-gradient-text-primary to-[#6ba3d6]"
                    >
                        proteja o agora
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-slate-400 text-sm md:text-base font-mono max-w-xl leading-relaxed mb-10"
                >
                    Alertas meteorológicos, áreas de risco e previsões de chuva —
                    tudo em um único painel de monitoramento.
                </motion.p>

                {/* Search */}
                <motion.div
                    variants={itemVariants}
                    className="w-full max-w-lg relative group"
                    ref={containerRef}
                >
                    <form onSubmit={handleSearch} className="w-full">
                        <div
                            className="relative flex items-center rounded border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(66,119,192,0.3)] hover:border-gradient-text-primary/40 hover:shadow-[0_0_60px_-10px_rgba(66,119,192,0.4)] focus-within:border-gradient-text-primary/60 focus-within:shadow-[0_0_80px_-5px_rgba(66,119,192,0.5)] transition-all duration-500"
                        >
                            <Search
                                className="absolute left-5 w-4 h-4 text-slate-500 group-focus-within:text-gradient-text-primary transition-colors duration-300 shrink-0"
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onFocus={() => results.length > 0 && setOpen(true)}
                                placeholder="Digite o nome da cidade..."
                                className="flex-1 bg-transparent pl-12 pr-12 py-4 text-sm text-white placeholder:text-slate-500 font-mono outline-none"
                            />
                            
                            {loading && (
                                <Loader2 className="absolute right-32 w-4 h-4 text-slate-500 animate-spin" />
                            )}
                            
                            {query && !loading && (
                                <button 
                                    type="button"
                                    onClick={handleClear} 
                                    className="absolute right-32 cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
                                </button>
                            )}

                            <button
                                type="submit"
                                className="mr-2 px-5 py-2.5 rounded bg-gradient-text-secondary hover:bg-gradient-text-primary text-white text-sm font-medium border border-gradient-text-primary/20 hover:border-gradient-text-primary/60 transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
                            >
                                Pesquisar
                            </button>
                        </div>
                    </form>

                    {/* Autocomplete Dropdown */}
                    <AnimatePresence>
                        {open && results.length > 0 && (
                            <motion.ul
                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-3 p-1 bg-surface/90 backdrop-blur-2xl border border-white/10 rounded overflow-hidden shadow-2xl z-100 text-left"
                            >
                                {results.map((loc, i) => (
                                    <li key={i}>
                                        <button
                                            onClick={() => handleSelect(loc)}
                                            className="w-full text-left flex items-start gap-4 px-4 py-3 hover:bg-white/5 transition-colors group rounded overflow-hidden"
                                        >
                                            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                                <MapPin className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-white font-medium truncate group-hover:text-blue-100 transition-colors">
                                                    {loc.name}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                                    {loc.address.state ? `${loc.address.state}, ` : ''}{loc.address.country}
                                                </p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Scroll hint omitted as per original code comment out */}
            </motion.div>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center opacity-30">
                {/* Deep Blue Element */}
                <motion.div
                    animate={{
                        x: ["-20%", "20%", "-10%", "-20%"],
                        y: ["-10%", "10%", "20%", "-10%"],
                        scale: [1, 1.2, 0.9, 1],
                        rotate: [0, 45, -45, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute w-[50vw] h-[50vh] rounded-[100px] blur-[100px] mix-blend-screen opacity-50 bg-gradient-text-secondary"
                />

                {/* Accent Light Blue Element */}
                <motion.div
                    animate={{
                        x: ["20%", "-15%", "10%", "20%"],
                        y: ["15%", "-20%", "5%", "15%"],
                        scale: [0.9, 1.1, 1, 0.9],
                        rotate: [0, -30, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                    className="absolute w-[30vw] h-[30vh] rounded-[100px] blur-[100px] mix-blend-screen opacity-60 bg-gradient-text-primary"
                />

                {/* Supporting Mixed Grad Element */}
                <motion.div
                    animate={{
                        x: ["-10%", "15%", "-5%", "-10%"],
                        y: ["20%", "-5%", "-15%", "20%"],
                        scale: [1.1, 0.9, 1.2, 1.1],
                        rotate: [45, 0, -45, 45],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5,
                    }}
                    className="absolute w-[60vw] h-[30vh] rounded-[100px] blur-[120px] mix-blend-screen opacity-40 bg-linear-to-r from-gradient-text-secondary to-gradient-text-primary"
                />
            </div>


            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-5xl my-40 relative z-1 group"
            >
                <div className="relative rounded overflow-hidden shadow-[0_0_100px_-20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_300px_20px_rgba(59,130,246,0.4)] border border-border-custom hover:border-slate-500/50 transition-all duration-700 aspect-video bg-surface animate-glow-pulse">

                    <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent z-10 pointer-events-none"></div>
                    <video src="/video/map2.mp4" autoPlay loop muted className="relative z-10 w-full h-full object-cover transition-transform duration-700 ease-in-out"></video>

                </div>

                <div className="flex items-center justify-center">
                    <Link to="/mapa">
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className='mt-10 relative px-10 py-3.5 bg-surface text-slate-300 font-medium rounded overflow-hidden transition-all cursor-pointer active:scale-95 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 border border-border-custom hover:border-blue-500/50 hover:text-white flex items-center gap-2 group'
                        >
                            <span className="relative z-10">Explorar Mapa em Tempo Real</span>
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </section>
    )
}