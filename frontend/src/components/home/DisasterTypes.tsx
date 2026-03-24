import { Droplets, MountainSnow, SunMedium, Tornado } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const disasters = [
  {
    title: "Enchentes e Alagamentos",
    description: "Elevação do nível de rios e riachos que transbordam, inundando áreas urbanas e rurais.",
    icon: Droplets,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Deslizamentos de Terra",
    description: "Movimento rápido de solo e rochas em encostas, frequentemente desencadeado por chuvas intensas.",
    icon: MountainSnow,
    color: "text-orange-500",
    gradient: "from-orange-500 to-yellow-400",
  },
  {
    title: "Secas Severas",
    description: "Períodos prolongados de precipitação abaixo do normal, causando escassez de água e impactos agrícolas.",
    icon: SunMedium,
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-orange-400",
  },
  {
    title: "Ciclones e Vendavais",
    description: "Ventos em altíssima velocidade capazes de destruir infraestruturas e causar interrupção de serviços.",
    icon: Tornado,
    color: "text-cyan-500",
    gradient: "from-cyan-500 to-blue-400",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {disasters.map((disaster, index) => {
          const Icon = disaster.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-surface/30 backdrop-blur-xl border-border-custom h-full hover:border-slate-500/50 hover:bg-surface/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl bg-surface border border-border-custom flex items-center justify-center mb-4 relative shadow-[0_0_20px_-5px_rgba(59,130,246,0.1)]`}>
                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-tr ${disaster.gradient} opacity-20 blur-md`} />
                    <Icon className={`w-7 h-7 ${disaster.color} relative z-10`} />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-100 transition-colors delay-75">{disaster.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors delay-75">
                    {disaster.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
