import { motion } from "motion/react"
import { Map } from "lucide-react"
import { Link } from "react-router-dom"

export function MapPreview() {
  return (
    <section className="py-24 px-6 md:px-12 relative w-full h-screen overflow-hidden flex flex-col items-center">
      {/* Decorative gradient blur behind the map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-600/15 rounded-[100px] blur-[120px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Monitoramento <span className="text-transparent bg-clip-text bg-linear-to-r from-gradient-text-primary to-gradient-text-secondary">Interativo</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Explore o mapa e visualize em tempo real os alertas e previsões de acordo com os níveis de ameaça.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl relative z-10 group"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-[0_0_100px_-20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_300px_20px_rgba(59,130,246,0.4)] border border-border-custom hover:border-slate-500/50 transition-all duration-700 aspect-video bg-surface animate-glow-pulse">

          <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent z-10 pointer-events-none"></div>
          {/* Glassmorphism Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-surface/80 backdrop-blur-md border-b border-border-custom z-20 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto bg-black/50 rounded flex items-center px-3 py-1 text-xs text-slate-400 font-mono">
              <Map className="w-3 h-3 mr-2" />
              alertaclima.com.br/mapa
            </div>
          </div>

          {/* Fictitious Map Image */}
          {/* <img
            src="/image_map2.png"
            alt="Preview do Mapa Interativo"
            className="w-full h-full object-cover hover:scale-102 transition-transform duration-700 ease-in-out border"
          /> */}
          <video src="/video/map.mp4" autoPlay loop muted className="w-full h-full object-cover transition-transform duration-700 ease-in-out border"></video>


        </div>

        <div className="flex items-center justify-center">
          <Link to="/mapa">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              whileHover={{ scale: 1.02 }}
              className='mt-10 relative px-10 py-3.5 bg-surface text-slate-300 font-medium rounded-full overflow-hidden transition-all cursor-pointer active:scale-95 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 border border-border-custom hover:border-blue-500/50 hover:text-white flex items-center gap-2 group'
            >
              <span className="relative z-10">Explorar Mapa em Tempo Real</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section >
  )
}
