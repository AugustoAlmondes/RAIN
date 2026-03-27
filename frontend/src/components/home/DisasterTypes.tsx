import { Droplets, Image, MountainSnow, SunMedium, Tornado } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ALAGAMENTO_IMAGE from "/images/alagamento.png"
import SECA from "/images/seca.png"
import TORNADO from "/images/tornado.png"
import DESLIZAMENTO from "/images/deslizamento.png"
const disasters = [
  {
    title: "Enchentes e Alagamentos",
    description: "Elevação do nível de rios e riachos que transbordam, inundando áreas urbanas e rurais.",
    icon: Droplets,
    color: "text-blue-500",
    image: ALAGAMENTO_IMAGE,
  },
  {
    title: "Deslizamentos de Terra",
    description: "Movimento rápido de solo e rochas em encostas, frequentemente desencadeado por chuvas intensas.",
    icon: MountainSnow,
    color: "text-orange-500",
    image: DESLIZAMENTO,
  },
  {
    title: "Secas Severas",
    description: "Períodos prolongados de precipitação abaixo do normal, causando escassez de água e impactos agrícolas.",
    icon: SunMedium,
    color: "text-yellow-500",
    image: SECA,
  },
  {
    title: "Ciclones e Vendavais",
    description: "Ventos em altíssima velocidade capazes de destruir infraestruturas e causar interrupção de serviços.",
    icon: Tornado,
    color: "text-cyan-500",
    image: TORNADO,
  },
]

export function DisasterTypes() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 w-full" id="desastres">
      {/* Decorative background gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Tipos de <span className="text-transparent bg-clip-text bg-linear-to-r from-gradient-text-primary to-gradient-text-secondary">Desastres Monitorados</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Acompanhamos e analisamos constantemente as ameaças naturais para fornecer as informações que podem salvar vidas.
        </p>
      </div>

      <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto px-4 md:px-0">
        {disasters.map((disaster, index) => {
          const Icon = disaster.icon
          const isReversed = index % 2 !== 0

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, x: isReversed ? 20 : -20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="w-full"
            >
              <Card className={`bg-surface/30 backdrop-blur-xl border-border-custom hover:border-slate-500/50 hover:bg-surface/40 transition-all duration-500 relative overflow-hidden group flex flex-col md:flex-row min-h-[400px] ${isReversed ? 'md:flex-row-reverse' : ''}`}>
                {/* Image Section */}
                <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                  <div className="absolute inset-0 bg-linear-to-t from-surface/80 to-transparent z-10 md:hidden" />
                  <img 
                    src={disaster.image} 
                    alt={disaster.title} 
                    className="w-full h-full object-cover transition-transform duration-700" 
                  />
                  <div className={`absolute top-6 ${isReversed ? 'left-6' : 'right-6'} z-20 md:hidden`}>
                    <div className={`w-12 h-12 rounded-xl bg-surface/80 backdrop-blur-md border border-border-custom flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${disaster.color}`} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
                  
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl md:text-3xl text-white group-hover:text-blue-100 transition-colors duration-300">
                      {disaster.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <CardDescription className="text-slate-400 text-lg md:text-xl leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                      {disaster.description}
                    </CardDescription>
                    
                    <button className="mt-8 flex items-center gap-2 text-blue-400 font-semibold group/btn cursor-pointer hover:text-blue-300 transition-colors">
                      Saiba mais 
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </CardContent>
                </div>

                {/* Hover decorative element */}
                <div className={`absolute bottom-0 ${isReversed ? 'left-0' : 'right-0'} w-1/2 h-1 bg-linear-to-r from-gradient-text-tertiary via-gradient-text-primary to-gradient-text-tertiary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-${isReversed ? 'left' : 'right'}`} />
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
