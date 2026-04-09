import { motion, AnimatePresence } from 'motion/react'
import { X, AlertTriangle, Droplets, Wind, Thermometer, CloudRain, Zap, Sun, Mountain, ChevronDown, Info, Snowflake, BookOpen } from 'lucide-react'
import type { RiskResult, CalculatedRisk } from '@/utils/riskLevels'
import type { WeatherData } from '@/services/weatherService'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Card, CardContent, CardDescription } from '../ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface RiskPanelProps {
  risk: RiskResult | null
  weather: WeatherData | null
  locationName: string
  loading?: boolean
  onClose?: () => void
}

function Chart({ values, labels, color, label = 'Precipitação (mm)', max }: { values: number[]; labels: string[]; color: string; label?: string; max?: number }) {
  const data = {
    labels: labels.map(l => l.slice(5)),
    datasets: [
      {
        label: label,
        data: values,
        backgroundColor: `${color}cc`,
        borderRadius: 4,
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: max,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 9 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } },
      },
    },
  }

  return (
    <div className="h-40">
      <Bar data={data} options={options} />
    </div>
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

/** Small badge for secondary risks */
function SecondaryRiskBadge({ risk }: { risk: CalculatedRisk }) {
  const Icon = getDisasterIcon(risk.type)
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${risk.bgColor} ${risk.borderColor} ${risk.textColor}`}>
      <Icon className="w-3 h-3" />
      {risk.label}
    </div>
  )
}

export function RiskPanel({ risk, weather, locationName, loading, onClose }: RiskPanelProps) {
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate()

  const dailyLabels = weather?.daily.time ?? []
  const dailyPrecip = weather?.daily.precipitationSum ?? []
  const dailyProb = weather?.daily.precipitationProbabilityMax ?? []

  const primary = risk?.primaryRisk
  const secondary = risk?.secondaryRisks ?? []
  const metrics = risk?.metrics

  const DisasterIcon = primary ? getDisasterIcon(primary.type) : AlertTriangle

  const getChartTitle = () => {
    if (!primary) return 'Precipitação (mm)'
    switch (primary.type) {
      case 'drought': return 'Temperatura Máxima (°C)'
      case 'storm': return 'Velocidade do Vento (km/h)'
      default: return 'Precipitação (mm)'
    }
  }

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
            ) : primary ? (
              <div className="p-5 flex flex-col gap-6">

                {/* Primary Risk Badge */}
                <div className={`flex items-center gap-3 p-4 border ${primary.bgColor} ${primary.borderColor}`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 animate-pulse" style={{ background: `${primary.color}22`, border: `1.5px solid ${primary.color}55` }}>
                    <DisasterIcon className="w-5 h-5" style={{ color: primary.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Risco Principal</p>
                    <p className={`text-lg font-bold ${primary.textColor}`}>{primary.label}</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{primary.description}</p>
                  </div>
                </div>

                {/* Secondary Risks */}
                {secondary.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Outros Riscos</p>
                    <div className="flex flex-wrap gap-2">
                      {secondary.map(r => (
                        <SecondaryRiskBadge key={r.type} risk={r} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Key stats */}
                {metrics && (
                  <div className="flex items-center flex-col gap-2 mb-3">
                    <div className='flex gap-2 w-full mb-3'>
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Principais Métricas</p>
                      <HoverCard>
                        <HoverCardContent className='bg-gray-800 mb-1 border border-border-custom rounded shadow-lg text-slate-400 w-100'>
                          <ul className='flex flex-col gap-2'>
                            <li><span className="font-semibold">Precipitação 24h:</span> Chuva acumulada nas próximas 24 horas (mm).</li>
                            <li><span className="font-semibold">Precipitação 72h:</span> Chuva acumulada nas próximas 72 horas (mm). Importante para deslizamentos.</li>
                            <li><span className="font-semibold">Umidade:</span> Umidade relativa do ar nas próximas 24h (%).</li>
                            <li><span className="font-semibold">Vento:</span> Velocidade máxima do vento nas próximas 24h (km/h).</li>
                            <li><span className="font-semibold">Rajadas:</span> Velocidade máxima das rajadas de vento (km/h).</li>
                            <li><span className="font-semibold">Temp. máx:</span> Temperatura máxima do dia (°C).</li>
                            <li><span className="font-semibold">Sensação mín:</span> Menor sensação térmica prevista nas próximas 24h (°C).</li>
                          </ul>
                        </HoverCardContent>
                        <HoverCardTrigger>
                          <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
                        </HoverCardTrigger>
                      </HoverCard>
                    </div>

                    <div className="grid grid-cols-[1fr_1fr] w-full gap-3">
                      {[
                        { icon: CloudRain, label: 'Precip. 24h', value: `${metrics.precip24h} mm` },
                        { icon: CloudRain, label: 'Precip. 72h', value: `${metrics.precip72h} mm` },
                        { icon: Droplets, label: 'Umidade', value: `${metrics.humidity}%` },
                        { icon: Wind, label: 'Vento', value: `${metrics.windSpeed} km/h` },
                        { icon: Wind, label: 'Rajadas', value: `${metrics.windGusts} km/h` },
                        { icon: Thermometer, label: 'Temp. máx', value: `${metrics.tempMax}°C` },
                        { icon: Thermometer, label: 'Sensação mín', value: `${metrics.apparentTemp}°C` },
                        { icon: Sun, label: 'Índice UV', value: `${metrics.uvIndex}` },
                      ].map(({ icon: Icon, label, value }) => (
                        <Card key={label} className='bg-bg/60 rounded gap-1 p-3 border flex flex-col justify-between border-border-custom'>
                          <CardDescription>
                            <div className="flex items-center justify-between gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-1.5">
                              <Icon className="w-4 h-4" />{label}
                            </div>
                          </CardDescription>
                          <CardContent>
                            <p className="text-white font-semibold text-xl">{value}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precipitation chart */}
                {dailyPrecip.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{getChartTitle()} — Próximos dias</p>
                      <HoverCard>
                        <HoverCardContent className='bg-gray-800 mb-1 border border-border-custom rounded shadow-lg text-slate-400 w-100'>
                          Precipitação é o volume estimado de água que pode cair. Quando a previsão indica milímetros, mostra a quantidade acumulada esperada por dia.
                        </HoverCardContent>
                        <HoverCardTrigger>
                          <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
                        </HoverCardTrigger>
                      </HoverCard>
                    </div>
                    <div className="bg-bg/60 rounded p-3 border border-border-custom">
                      <Chart
                        values={
                          primary.type === 'drought'
                            ? (weather?.daily.temperature2mMax ?? [])
                            : primary.type === 'storm'
                              ? (weather?.hourly.windSpeed10m.slice(0, 168) ?? [])
                              : dailyPrecip
                        }
                        labels={
                          primary.type === 'storm'
                            ? (weather?.hourly.time.slice(0, 168) ?? dailyLabels)
                            : dailyLabels
                        }
                        color={
                          primary.type === 'drought' ? '#f97316'
                          : primary.type === 'storm' ? '#a855f7'
                          : '#3b82f6'
                        }
                        label={getChartTitle()}
                      />
                    </div>
                  </div>
                )}

                {/* Probability chart */}
                {dailyProb.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Prob. de Chuva (%)</p>
                      <HoverCard>
                        <HoverCardContent className='bg-gray-800 mb-1 border border-border-custom rounded shadow-lg text-slate-400 w-100'>
                          Probabilidade de chuva é a chance de ocorrer precipitação em um local durante um determinado período, expressa em porcentagem.
                        </HoverCardContent>
                        <HoverCardTrigger>
                          <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
                        </HoverCardTrigger>
                      </HoverCard>
                    </div>
                    <div className="bg-bg/60 rounded p-3 border border-border-custom">
                      <Chart values={dailyProb} labels={dailyLabels} color="#06b6d4" max={100} label="Prob. de Chuva (%)" />
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recomendações</p>
                  <ul className="flex flex-col gap-2.5">
                    {primary.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guide Button */}
                <div className="pt-2 mt-2 border-t border-border-custom">
                  <button
                    id="tour-guide-btn"
                    onClick={() => navigate('/guia')}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 rounded text-blue-400 font-bold transition-all cursor-pointer group"
                  >
                    <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Ver Guia de Proteção</span>
                  </button>
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
