import { Droplets, MountainSnow, SunMedium, Tornado } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ALAGAMENTO_IMAGE from "/images/alagamento2.jpeg"
import SECA from "/images/seca2.jpg"
import CALOR from "/images/calor.jpg"
import TORNADO from "/images/tornado2.jpg"
import DESLIZAMENTO from "/images/deslizamento2.jpg"
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
  {
    title: "Ondas de Calor Extremas",
    description: "Períodos de temperaturas muito acima da média, capazes de causar impactos na saúde, energia e abastecimento de água.",
    icon: SunMedium,
    color: "text-red-500",
    image: CALOR,
  },
]

export function DisasterTypes() {
  return (
    <>
    
    <section className="py-24 px-6 md:px-12 relative z-10 w-full bg-radial from-bg to-gradient-text-secondary/20" id="desastres">
      {/* Decorative background gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />


      <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto px-4 md:px-0">
        <motion.div 
          className="mb-10 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h2 className="text-3xl md:text-7xl tracking-tight text-white mb-4">
            Monitoramos os mais{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gradient-text-primary to-gradient-text-secondary inline-block">
              variados tipos de desastres
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Acompanhamos e analisamos constantemente as ameaças naturais para fornecer as informações que podem salvar vidas.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-6 gap-6 w-full">
          {disasters.map((disaster, index) => {
            // const Icon = disaster.icon
            const gridAreas = [
              "md:col-start-4 md:col-end-6 md:row-start-3 md:row-end-5",
              "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3",
              "md:col-start-1 md:col-end-4 md:row-start-3 md:row-end-5",
              "md:col-start-3 md:col-end-6 md:row-start-1 md:row-end-3",
              "md:col-start-1 md:col-end-6 md:row-start-5 md:row-end-7",
            ]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)", scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={gridAreas[index]}
              >
                <motion.div
                  // whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card className="bg-surface/70 backdrop-blur-2xl shadow-xl shadow-black/10 border-border-custom hover:border-slate-500/40 hover:bg-surface/90 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 relative overflow-hidden group h-full flex flex-col rounded">
                    {/* Inner subtle glow overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

                    {/* Image */}
                    <div className="relative overflow-hidden h-52 md:h-64 shrink-0">
                      <img
                        src={disaster.image}
                        alt={disaster.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out"
                      />

                      {/* Overlays for smooth gradient fade into content */}
                      <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/60 to-transparent transition-opacity duration-700" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />

                      {/* Extends the surface color downwards seamlessly */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-surface translate-y-px" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10 bg-surface -mt-1 group-hover:bg-transparent transition-colors duration-500">
                      {/* Gradient bleed to fix harsh edges */}
                      <div className="absolute top-[-30px] left-0 right-0 h-[30px] bg-linear-to-t from-surface to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-500" />

                      <CardHeader className="p-0 mb-4 z-10 relative">
                        <CardTitle className="text-2xl md:text-3xl font-medium tracking-tight text-slate-100 group-hover:text-white transition-colors duration-300">
                          {disaster.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-0 flex flex-col flex-1 justify-between z-10 relative">
                        <CardDescription className="text-slate-400 text-base md:text-lg leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                          {disaster.description}
                        </CardDescription>

                        <button className="pt-6 flex items-center gap-2 text-blue-400 font-semibold group/btn cursor-pointer hover:text-blue-300 transition-colors">
                          Saiba mais
                          <span className="group-hover/btn:translate-x-1 transition-transform">
                            →
                          </span>
                        </button>
                      </CardContent>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-gradient-surface via-gradient-text-primary to-gradient-text-surface scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-center z-20" />
                  </Card>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
    <div className="w-full border-gradient-bottom"></div>
    </>
  )
}
