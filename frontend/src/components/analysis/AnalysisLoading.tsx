import { motion } from 'motion/react'
import { Loader2, CloudLightning, Thermometer, Search } from 'lucide-react'

interface AnalysisLoadingProps {
  step: 'searching' | 'fetching_weather' | 'analyzing'
  city: string | null
}

const steps = {
  searching: {
    icon: <Search className="w-6 h-6" />,
    message: "Localizando cidade...",
    description: "Buscando coordenadas no OpenStreetMap",
    color: "text-blue-400"
  },
  fetching_weather: {
    icon: <CloudLightning className="w-6 h-6" />,
    message: "Coletando dados...",
    description: "Obtendo previsão de 72h do Open-Meteo",
    color: "text-cyan-400"
  },
  analyzing: {
    icon: <Thermometer className="w-6 h-6" />,
    message: "Calculando riscos...",
    description: "Aplicando algoritmos de análise de desastres",
    color: "text-orange-400"
  }
}

export function AnalysisLoading({ step, city }: AnalysisLoadingProps) {
  const currentStep = steps[step as keyof typeof steps] || steps.searching

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
        
        <div className="relative bg-surface/40 backdrop-blur-3xl border border-white/10 rounded-full p-8 shadow-2xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`p-4 rounded-full bg-surface/60 border border-white/5 shadow-inner ${currentStep.color}`}
          >
            {currentStep.icon}
          </motion.div>
          
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg shadow-blue-600/40">
              <Loader2 className="w-3 h-3 text-white animate-spin" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 text-center space-y-3"
      >
        <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
          {currentStep.message}
          {city && <span className="text-blue-400">em {city}</span>}
        </h3>
        <p className="text-slate-400 text-base max-w-sm mx-auto">
          {currentStep.description}
        </p>
      </motion.div>

      <div className="mt-12 w-full max-w-xs bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/10">
        <motion.div 
          className="h-full bg-linear-to-r from-blue-600 to-cyan-500"
          initial={{ width: "0%" }}
          animate={{ 
            width: step === 'searching' ? "33%" : step === 'fetching_weather' ? "66%" : "100%" 
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="mt-10 grid grid-cols-3 gap-6 max-w-md w-full opacity-50">
        <StepIndicator active={step === 'searching'} done={step !== 'searching'} />
        <StepIndicator active={step === 'fetching_weather'} done={step === 'analyzing'} />
        <StepIndicator active={step === 'analyzing'} done={false} />
      </div>
    </div>
  )
}

function StepIndicator({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div className={`h-1.5 rounded-full transition-all duration-500 ${
      done ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
      active ? 'bg-blue-500/50' : 'bg-white/10'
    }`} />
  )
}
