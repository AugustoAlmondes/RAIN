import { motion } from 'motion/react'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import type { RiskLevel } from '@/utils/riskLevels'

interface RecommendationsListProps {
  recommendations: string[]
  level: RiskLevel
}

export function RecommendationsList({ recommendations, level }: RecommendationsListProps) {
  const getIcon = () => {
    if (level === 'critical' || level === 'high') return <AlertCircle className="w-5 h-5 text-risk-high" />
    if (level === 'moderate') return <Info className="w-5 h-5 text-risk-moderate" />
    return <CheckCircle2 className="w-5 h-5 text-risk-low" />
  }

  const getBadgeColor = () => {
    if (level === 'critical' || level === 'high') return 'bg-risk-high/10 border-risk-high/20 text-risk-high'
    if (level === 'moderate') return 'bg-risk-moderate/10 border-risk-moderate/20 text-risk-moderate'
    return 'bg-risk-low/10 border-risk-low/20 text-risk-low'
  }

  if (recommendations.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border ${getBadgeColor()}`}>
          {getIcon()}
        </div>
        <h3 className="text-xl font-bold text-white">Recomendações Práticas</h3>
      </div>

      <div className="grid gap-3">
        {recommendations.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded bg-surface/40 backdrop-blur-3xl border border-white/10 hover:bg-white/5 transition-colors group"
          >
            <div className="mt-1 shrink-0">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${level === 'critical' ? 'bg-risk-critical' :
                  level === 'high' ? 'bg-risk-high' :
                    level === 'moderate' ? 'bg-risk-moderate' : 'bg-risk-low'
                } shadow-lg shadow-current`} />
            </div>
            <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">
              {item}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
