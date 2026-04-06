import { motion } from 'motion/react'
import { 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  CloudLightning,
  Sun
} from 'lucide-react'
import type { RiskInfo } from '@/utils/riskLevels'

interface WeatherDataCardsProps {
  data: RiskInfo
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  unit?: string
  delay?: number
}

function StatCard({ icon, label, value, unit, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface/40 backdrop-blur-3xl border border-white/10 rounded p-5 flex flex-col gap-3 hover:bg-surface/60 transition-colors duration-200 group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-500/10 rounded text-blue-400 group-hover:bg-blue-500/20 transition-colors">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-slate-500">
          {label}
        </span>
      </div>
      
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function WeatherDataCards({ data }: WeatherDataCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<CloudRain className="w-5 h-5" />}
        label="Precipitação (24h)"
        value={data.precipNext24h}
        unit="mm"
        delay={0.1}
      />
      <StatCard
        icon={<CloudLightning className="w-5 h-5" />}
        label="Prob. de Chuva"
        value={data.precipProbability}
        unit="%"
        delay={0.2}
      />
      <StatCard
        icon={<Droplets className="w-5 h-5" />}
        label="Umidade do Ar"
        value={data.humidity}
        unit="%"
        delay={0.3}
      />
      <StatCard
        icon={<Wind className="w-5 h-5" />}
        label="Vel. do Vento"
        value={data.windSpeed}
        unit="km/h"
        delay={0.4}
      />
      <StatCard
        icon={<Thermometer className="w-5 h-5" />}
        label="Temp. Máxima"
        value={data.tempMax}
        unit="°C"
        delay={0.5}
      />
      <StatCard
        icon={<Thermometer className="w-5 h-5 opacity-70" />}
        label="Temp. Mínima"
        value={data.tempMin}
        unit="°C"
        delay={0.6}
      />
      <StatCard
        icon={<Sun className="w-5 h-5" />}
        label="Índice UV"
        value={data.uvIndex}
        delay={0.7}
      />
      <StatCard
        icon={<Wind className="w-5 h-5 opacity-70" />}
        label="Rajadas"
        value={data.windGusts}
        unit="km/h"
        delay={0.8}
      />
    </div>
  )
}
