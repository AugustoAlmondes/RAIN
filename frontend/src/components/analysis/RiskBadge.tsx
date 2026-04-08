import { motion } from 'motion/react'
import { AlertCircle, AlertTriangle, CheckCircle2, Skull } from 'lucide-react'
import type { RiskLevel } from '@/utils/riskLevels'

interface RiskBadgeProps {
  level: RiskLevel
  showIcon?: boolean
  className?: string
}

const riskConfig = {
  low: {
    label: "Baixo Risco",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-risk-low",
    textColor: "text-risk-low",
    borderColor: "border-risk-low/30",
    shadow: "shadow-risk-low/20"
  },
  moderate: {
    label: "Risco Moderado",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "bg-risk-moderate",
    textColor: "text-risk-moderate",
    borderColor: "border-risk-moderate/30",
    shadow: "shadow-risk-moderate/20"
  },
  high: {
    label: "Risco Alto",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "bg-risk-high",
    textColor: "text-risk-high",
    borderColor: "border-risk-high/30",
    shadow: "shadow-risk-high/20"
  },
  critical: {
    label: "Risco Crítico",
    icon: <Skull className="w-4 h-4" />,
    color: "bg-risk-critical",
    textColor: "text-risk-critical",
    borderColor: "border-risk-critical/30",
    shadow: "shadow-risk-critical/20"
  }
}

export function RiskBadge({ level, showIcon = true, className = "" }: RiskBadgeProps) {
  const config = riskConfig[level] || riskConfig.low
  const isHighRisk = level === 'high' || level === 'critical'

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        ...(isHighRisk ? {
          scale: [1, 1.05, 1],
        } : {})
      }}
      transition={{ 
        duration: 0.3,
        ...(isHighRisk ? {
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {})
      }}
      className={`
        inline-flex items-center gap-2 px-4 py-1.5 rounded border-2 font-bold text-sm tracking-wide 
        ${config.color}/10 ${config.borderColor} ${config.textColor} ${config.shadow} backdrop-blur-xl
        ${className}
      `}
    >
      {showIcon && config.icon}
      <span>{config.label.toUpperCase()}</span>
    </motion.div>
  )
}
