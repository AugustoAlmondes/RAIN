import { motion } from 'motion/react'
import { History, MapPin } from 'lucide-react'

interface AnalysisHistoryProps {
  history: string[]
  onHistoryClick: (city: string) => void
  onClear: () => void
}

export function AnalysisHistory({ history, onHistoryClick, onClear }: AnalysisHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-slate-400">
          <History className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-widest font-mono">
            Histórico Recente
          </h4>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase tracking-wider font-bold"
        >
          Limpar Tudo
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((city, index) => (
          <motion.div
            key={`${city}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center pl-3 bg-surface/40 backdrop-blur-3xl rounded hover:bg-white/10 transition-all border border-white/10 group cursor-pointer"
            onClick={() => onHistoryClick(city)}
          >
            <MapPin className="w-3 h-3 text-blue-500 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-blue-100 transition-colors py-2 pr-6">
              {city}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
