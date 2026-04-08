import { motion } from 'motion/react'
import { Droplets, Wind, Thermometer, CloudRain, Loader2, Zap, Sun, Mountain, Snowflake, AlertTriangle } from 'lucide-react'
import type { RiskResult, CalculatedRisk } from '@/utils/riskLevels'
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'

interface WeatherWidgetProps {
  risk: RiskResult | null
  locationName: string
  loading?: boolean
}

function Stat({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: string | number; unit: string }) {
  return (
    <Card className="bg-surface/90 backdrop-blur-xl py-2 gap-2 w-40 border border-border-custom rounded shadow-xl shadow-black/30">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5 text-slate-500 uppercase text-sm tracking-wider font-semibold">
          <Icon className="w-5 h-5" />
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-white font-semibold text-xl">
          {value}<span className="text-slate-500 text-xs font-normal ml-0.5"> {unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function getDisasterIcon(type: CalculatedRisk['type']) {
  switch (type) {
    case 'flood': return CloudRain
    case 'landslide': return Mountain
    case 'storm': return Zap
    case 'drought': return Sun
    case 'cold': return Snowflake
    default: return AlertTriangle
  }
}

export function WeatherWidget({ risk, locationName, loading }: WeatherWidgetProps) {
  const primary = risk?.primaryRisk
  const DisasterIcon = primary ? getDisasterIcon(primary.type) : CloudRain

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-surface/90 backdrop-blur-xl border border-border-custom rounded p-4 shadow-xl shadow-black/30 min-w-[320px]"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400 font-medium truncate max-w-[130px]">{locationName || 'Localização'}</p>
        {loading && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
      </div>

      {primary && risk ? (
        <>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold mb-4 ${primary.bgColor} ${primary.borderColor} ${primary.textColor}`}>
            <DisasterIcon className="w-3.5 h-3.5" />
            {primary.label}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat icon={CloudRain} label="Precip." value={risk.metrics.precip24h} unit="mm" />
            <Stat icon={Droplets} label="Umidade" value={risk.metrics.humidity} unit="%" />
            <Stat icon={Wind} label="Vento" value={risk.metrics.windSpeed} unit="km/h" />
            <Stat icon={Thermometer} label="Temp. max" value={risk.metrics.tempMax} unit="°C" />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-4 gap-2 text-slate-500">
          {loading
            ? <p className="text-xs">Carregando dados...</p>
            : <p className="text-xs">Selecione uma localização</p>
          }
        </div>
      )}
    </motion.div>
  )
}
