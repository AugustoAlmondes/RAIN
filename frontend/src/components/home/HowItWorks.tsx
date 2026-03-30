import { motion } from "motion/react"
import { MapPin, Activity, BellRing } from "lucide-react"
import WorldMap from "/images/map.jpg"

const steps = [
  {
    icon: MapPin,
    title: "Seleção de Região",
    description: "Escolha sua cidade ou ative a localização automática para identificar áreas de risco na sua região.",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: Activity,
    title: "Análise em Tempo Real",
    description: "Nossa IA cruza dados meteorológicos atuais com históricos de ocorrências para avaliar os perigos.",
    gradient: "from-cyan-400 to-teal-400"
  },
  {
    icon: BellRing,
    title: "Receber Alertas",
    description: "Seja notificado proativamente com instruções claras de como agir em caso de emergência ou atenção.",
    gradient: "from-teal-400 to-blue-500"
  }
]

export function HowItWorks() {
  return (
    <>

      <section
        style={{
          backgroundImage: `url(${WorldMap})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay"
        }}
        className="py-20 relative overflow-hidden bg-surface">
        {/* Decorative background gradients */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Como Funciona
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl">
                Entenda seu risco de forma simples. Nós processamos os dados complexos e disponibilizamos informações que protegem sua família e comunidade.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-linear-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 z-0" />

            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 mb-8 rounded-full bg-surface border border-border-custom flex items-center justify-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] relative">
                    <div className={`absolute inset-0 rounded-full bg-linear-to-tr ${step.gradient} opacity-20 blur-md`} />
                    <Icon className="w-10 h-10 text-white relative z-10" />

                    {/* Step number badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 border-4 border-bg text-white font-bold flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-slate-400 max-w-sm leading-relaxed">
                    {step.description}
                  </p>
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
