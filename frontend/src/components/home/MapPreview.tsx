import { motion } from "motion/react"
import { Map } from "lucide-react"
import { Link } from "react-router-dom"

export function MapPreview({ref}: any) {
  return (
    <section ref={ref} className="bg-black py-16 px-6 md:px-12 relative w-full min-h-screen overflow-hidden flex flex-col items-center border-t border-gradient-top border-gradient-bottom">
      {/* Soft Aurora Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center">
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
        className="w-full max-w-5xl relative z-10 group"
      >
      <div className="mb-12 text-start w-full mx-auto relative z-10">
        <h2 className="text-3xl md:text-7xl font-light tracking-tight text-white mb-4">
          Monitoramento <span className="text-transparent bg-clip-text bg-linear-to-r from-gradient-text-primary to-gradient-text-secondary">Interativo</span>
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          Explore o mapa e visualize em tempo real os alertas e previsões de acordo com os níveis de ameaça.
        </p>
      </div>
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
          <video src="/video/map2.mp4" autoPlay loop muted className="w-full h-full object-cover transition-transform duration-700 ease-in-out"></video>


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
