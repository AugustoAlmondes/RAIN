import { motion, AnimatePresence } from 'motion/react'
import { X, AlertTriangle, Droplets, Wind, Thermometer, CloudRain, TrendingUp, ChevronDown } from 'lucide-react'
import type { RiskInfo } from '@/utils/riskLevels'
import type { WeatherData } from '@/services/weatherService'
import { useState } from 'react'

interface RiskPanelProps {
  risk: RiskInfo | null
  weather: WeatherData | null
  locationName: string
  loading?: boolean
  onClose?: () => void
}

function BarChart({ values, labels, color }: { values: number[]; labels: string[]; color: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-1.5 h-16">
      {values.slice(0, 7).map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${(v / max) * 52}px`,
              minHeight: 2,
              background: `${color}99`,
            }}
          />
          <span className="text-[9px] text-slate-600 truncate">{labels[i]?.slice(5)}</span>
        </div>
      ))}
    </div>
  )
}

export function RiskPanel({ risk, weather, locationName, loading, onClose }: RiskPanelProps) {
  const [expanded, setExpanded] = useState(true)

  const dailyLabels = weather?.daily.time ?? []
  const dailyPrecip = weather?.daily.precipitationSum ?? []
  const dailyProb = weather?.daily.precipitationProbabilityMax ?? []

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full h-full bg-surface/95 backdrop-blur-xl border-l border-border-custom flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-custom shrink-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-white truncate">Painel de Risco</h2>
          <p className="text-xs text-slate-500 truncate mt-0.5">{locationName || 'Selecione uma localização'}</p>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer">
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? '' : '-rotate-90'}`} />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto flex-1 scrollbar-thin"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm">Analisando dados...</p>
              </div>
            ) : risk ? (
              <div className="p-5 flex flex-col gap-6">
                {/* Risk Badge */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${risk.bgColor} ${risk.borderColor}`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${risk.color}22`, border: `1.5px solid ${risk.color}55` }}>
                    <AlertTriangle className="w-5 h-5" style={{ color: risk.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Nível de Risco</p>
                    <p className={`text-lg font-bold ${risk.textColor}`}>{risk.label}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed">{risk.description}</p>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: CloudRain, label: 'Precipitação 24h', value: `${risk.precipNext24h} mm` },
                    { icon: Droplets, label: 'Umidade', value: `${risk.humidity}%` },
                    { icon: Wind, label: 'Vento', value: `${risk.windSpeed} km/h` },
                    { icon: Thermometer, label: 'Temp. máx', value: `${risk.tempMax}°C` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-bg/60 rounded-xl p-3 border border-border-custom">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-1.5">
                        <Icon className="w-3 h-3" />{label}
                      </div>
                      <p className="text-white font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Precipitation chart */}
                {dailyPrecip.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Precipitação — Próximos 7 dias</p>
                    </div>
                    <div className="bg-bg/60 rounded-xl p-3 border border-border-custom">
                      <BarChart values={dailyPrecip} labels={dailyLabels} color="#3b82f6" />
                    </div>
                  </div>
                )}

                {/* Probability chart */}
                {dailyProb.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CloudRain className="w-4 h-4 text-cyan-400" />
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Prob. de Chuva (%)</p>
                    </div>
                    <div className="bg-bg/60 rounded-xl p-3 border border-border-custom">
                      <BarChart values={dailyProb} labels={dailyLabels} color="#06b6d4" />
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recomendações</p>
                  <ul className="flex flex-col gap-2.5">
                    {risk.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <p className="text-sm">Clique em um marcador no mapa ou busque uma cidade para ver a análise de risco.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
