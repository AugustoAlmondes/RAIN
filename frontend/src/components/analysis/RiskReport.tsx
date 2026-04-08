import { motion } from 'motion/react'
import { Calendar, MapPin, Wind, CloudRain, Droplets, ArrowRight } from 'lucide-react'
import type { RiskResult, CalculatedRisk } from '@/utils/riskLevels'
import { RiskBadge } from './RiskBadge'
import { WeatherDataCards } from './WeatherDataCards'
import { RecommendationsList } from './RecommendationsList'

interface RiskReportProps {
  data: RiskResult
  city: string
  onViewOnMap?: () => void
}

export function RiskReport({ data, city, onViewOnMap }: RiskReportProps) {
  const currentDate = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const { primaryRisk, metrics, secondaryRisks } = data
  const isCritical = primaryRisk.level === 'critical' || primaryRisk.level === 'high'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header do Relatório */}
      <div className="bg-surface/40 backdrop-blur-3xl border border-white/10 rounded p-8 relative overflow-hidden group">
        {/* Efeito de brilho de fundo se for crítico */}
        {isCritical && (
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 blur-[100px] rounded group-hover:bg-red-600/15 transition-all duration-700" />
        )}

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold tracking-widest uppercase">
                <Calendar className="w-4 h-4" />
                <span>Análise atualizada em {currentDate}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-2xl text-blue-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h2 className="text-5xl font-bold text-white">
                    {city}
                  </h2>
                </div>
                <p className="text-slate-400 text-sm font-mono flex items-center gap-1">
                  Relatório gerado pelas API públicas.
                  <span className="text-blue-500 text-sm underline cursor-pointer">
                    Clique aqui
                  </span>
                  para saber mais.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <RiskBadge level={primaryRisk.level} className="text-lg py-2.5 px-6" />
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status de Alerta</p>
                <p className={`text-xl font-bold tracking-tight ${primaryRisk.textColor}`}>
                  {primaryRisk.label}
                </p>
              </div>

              {onViewOnMap && (
                <button
                  onClick={onViewOnMap}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded transition-all duration-300 font-bold text-sm cursor-pointer shadow-lg shadow-blue-900/10"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Ver no Mapa</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-8 pt-8 border-t border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <ArrowRight className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">Resumo da Análise</h4>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed font-mono">
                {primaryRisk.description}
              </p>
            </div>

            {secondaryRisks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">Riscos Secundários</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {secondaryRisks.map((risk: CalculatedRisk) => (
                    <div 
                      key={risk.type} 
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.bgColor} ${risk.borderColor} ${risk.textColor}`}
                    >
                      {risk.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center p-6 rounded bg-surface/40 backdrop-blur-3xl border border-white/10 space-x-6">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Precipitação</p>
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <CloudRain className="w-5 h-5 text-blue-400" />
                  <span>{metrics.precip24h}mm</span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vento Máx.</p>
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  <span>{metrics.windSpeed}km/h</span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Umidade</p>
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  <Droplets className="w-5 h-5 text-blue-300" />
                  <span>{metrics.humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Dados Brutos */}
      <div className="space-y-4 px-2">
        <h3 className="text-2xl font-mono text-white flex items-center gap-3">
          Dados Climáticos Utilizados
        </h3>
        <WeatherDataCards data={data} />
      </div>

      {/* Seção de Recomendações */}
      <div className="px-2">
        <RecommendationsList
          recommendations={primaryRisk.recommendations}
          level={primaryRisk.level}
        />
      </div>

      {/* Footer do Relatório */}
      <div className="p-6 bg-white/3 border border-white/5 rounded text-center space-y-2">
        <p className="text-sm text-slate-500 italic">
          "Esta análise é baseada em modelos matemáticos e dados de terceiros. Sempre siga as orientações oficiais da Defesa Civil de sua região."
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-2">
          <span>Data Source: OpenMeteo</span>
          <div className="w-1 h-1 rounded bg-slate-700" />
          <span>Algorithm: AlertaClima v1.0</span>
        </div>
      </div>
    </motion.div>
  )
}
