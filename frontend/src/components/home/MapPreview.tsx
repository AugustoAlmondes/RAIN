import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Map, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function MapPreview() {
  return (
    <section className="py-24 px-6 md:px-12 relative w-full overflow-hidden flex flex-col items-center">
      {/* Decorative gradient blur behind the map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-600/20 rounded-[100px] blur-[120px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Monitoramento <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400">Interativo</span>
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
        <div className="relative rounded-2xl overflow-hidden border border-border-custom shadow-2xl shadow-blue-900/20 aspect-video bg-surface">
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
          <img 
            src="/image_map.png" 
            alt="Preview do Mapa Interativo" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />

          {/* Centered Overlay & CTA */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-bg/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 flex flex-col items-center pointer-events-auto hover:bg-bg/60 transition-colors shadow-2xl shadow-black">
              <Map className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-6">Acesse a Visão Completa</h3>
              <Link to="/mapa" tabIndex={-1}>
                <Button className="font-semibold px-8 py-6 text-base bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] group/btn transition-all">
                  Acessar Mapa Interativo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
