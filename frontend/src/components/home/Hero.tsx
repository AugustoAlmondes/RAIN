import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

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
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/mapa?cidade=${encodeURIComponent(query.trim())}`)
        } else {
            mapRef.current?.scrollIntoView({ behavior: "smooth" })
        }
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
            leading-[1.1] mb-5
          "
                >
                    Antecipe o amanhã,{" "}
                    <span
                        className="
              font-medium
              text-transparent bg-clip-text
              bg-linear-to-r from-gradient-text-primary to-[#6ba3d6]
            "
                    >
                        proteja o agora
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="
            text-slate-400 text-sm md:text-base
            font-mono max-w-xl leading-relaxed mb-10
          "
                >
                    Alertas meteorológicos, áreas de risco e previsões de chuva —
                    tudo em um único painel de monitoramento.
                </motion.p>

                {/* Search */}
                <motion.form
                    variants={itemVariants}
                    onSubmit={handleSearch}
                    className="w-full max-w-lg group"
                >
                    <div
                        className="
              relative flex items-center
              rounded border border-white/10
              bg-white/5 backdrop-blur-xl
              shadow-[0_0_40px_-10px_rgba(66,119,192,0.3)]
              hover:border-gradient-text-primary/40 hover:shadow-[0_0_60px_-10px_rgba(66,119,192,0.4)]
              focus-within:border-gradient-text-primary/60 focus-within:shadow-[0_0_80px_-5px_rgba(66,119,192,0.5)]
              transition-all duration-500
            "
                    >
                        <Search
                            className="absolute left-5 w-4 h-4 text-slate-500 group-focus-within:text-gradient-text-primary transition-colors duration-300 shrink-0"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Digite o nome da cidade..."
                            className="
                flex-1 bg-transparent pl-12 pr-4 py-4
                text-sm text-white placeholder:text-slate-500
                font-mono outline-none
              "
                        />
                        <button
                            type="submit"
                            className="
                mr-2 px-5 py-2.5 rounded
                bg-[#03285B] hover:bg-gradient-text-primary
                text-white text-sm font-medium
                border border-gradient-text-primary/20 hover:border-gradient-text-primary/60
                transition-all duration-300 cursor-pointer
                active:scale-95
                shrink-0
              "
                        >
                            Pesquisar
                        </button>
                    </div>
                </motion.form>

                {/* Scroll hint */}
                {/* <motion.button
                    variants={itemVariants}
                    onClick={() => mapRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="mt-10 flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors duration-300 cursor-pointer group"
                    aria-label="Rolar para o mapa"
                >
                    <span className="text-xs font-mono tracking-widest uppercase">ou explore o mapa</span>
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="w-5 h-5 border border-slate-600 group-hover:border-slate-400 rounded-full flex items-center justify-center transition-colors"
                    >
                        <div className="w-1 h-1 bg-slate-600 group-hover:bg-slate-400 rounded-full transition-colors" />
                    </motion.div>
                </motion.button> */}
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
                className="w-full max-w-5xl my-40 relative z-10 group"
            >
                <div className="relative rounded overflow-hidden shadow-[0_0_100px_-20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_300px_20px_rgba(59,130,246,0.4)] border border-border-custom hover:border-slate-500/50 transition-all duration-700 aspect-video bg-surface animate-glow-pulse">

                    <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent z-10 pointer-events-none"></div>
                    <video src="/video/map2.mp4" autoPlay loop muted className="w-full h-full object-cover transition-transform duration-700 ease-in-out"></video>


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