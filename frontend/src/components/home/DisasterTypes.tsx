import { Droplets, MountainSnow, SunMedium, Tornado } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const disasters = [
  {
    title: "Enchentes e Alagamentos",
    description: "Elevação do nível de rios e riachos que transbordam, inundando áreas urbanas e rurais.",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Deslizamentos de Terra",
    description: "Movimento rápido de solo e rochas em encostas, frequentemente desencadeado por chuvas intensas.",
    icon: MountainSnow,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Secas Severas",
    description: "Períodos prolongados de precipitação abaixo do normal, causando escassez de água e impactos agrícolas.",
    icon: SunMedium,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Ciclones e Vendavais",
    description: "Ventos em altíssima velocidade capazes de destruir infraestruturas e causar interrupção de serviços.",
    icon: Tornado,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
]

export function DisasterTypes() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 w-full" id="desastres">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Tipos de <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400">Desastres Monitorados</span>
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
              <Card className="bg-surface/50 backdrop-blur-md border-border-custom h-full hover:border-slate-600 transition-colors duration-300">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${disaster.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${disaster.color}`} />
                  </div>
                  <CardTitle className="text-xl text-white">{disaster.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-base leading-relaxed">
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
