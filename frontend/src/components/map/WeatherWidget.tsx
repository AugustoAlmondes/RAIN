import { motion } from 'motion/react'
import { Droplets, Wind, Thermometer, CloudRain, Loader2 } from 'lucide-react'
import type { RiskInfo } from '@/utils/riskLevels'

interface WeatherWidgetProps {
  risk: RiskInfo | null
  locationName: string
  loading?: boolean
}

function Stat({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: string | number; unit: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-white font-semibold text-sm">
        {value}<span className="text-slate-500 text-xs font-normal ml-0.5">{unit}</span>
      </div>
    </div>
  )
}

export function WeatherWidget({ risk, locationName, loading }: WeatherWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-surface/90 backdrop-blur-xl border border-border-custom rounded-2xl p-4 shadow-xl shadow-black/30 min-w-[220px]"
    >
      {/* Location header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400 font-medium truncate max-w-[130px]">{locationName || 'Localização'}</p>
        {loading && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
      </div>

      {risk ? (
        <>
          {/* Risk badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold mb-4 ${risk.bgColor} ${risk.borderColor} ${risk.textColor}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: risk.color }} />
            {risk.label}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={CloudRain} label="Precip." value={risk.precipNext24h} unit="mm" />
            <Stat icon={Droplets} label="Umidade" value={risk.humidity} unit="%" />
            <Stat icon={Wind} label="Vento" value={risk.windSpeed} unit="km/h" />
            <Stat icon={Thermometer} label="Temp. max" value={risk.tempMax} unit="°C" />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-4 gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-xs">Carregando dados...</p>
        </div>
      )}
    </motion.div>
  )
}
