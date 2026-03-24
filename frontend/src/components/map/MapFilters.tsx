import { motion } from 'motion/react'
import type { DisasterType, Period } from '@/utils/riskLevels'

interface Filter<T extends string> {
  value: T
  label: string
}

const typeFilters: Filter<DisasterType>[] = [
  { value: 'all', label: 'Todos' },
  { value: 'flood', label: 'Enchentes' },
  { value: 'landslide', label: 'Deslizamentos' },
  { value: 'drought', label: 'Seca' },
]

const periodFilters: Filter<Period>[] = [
  { value: '24h', label: '24h' },
  { value: '48h', label: '48h' },
  { value: '72h', label: '72h' },
  { value: '7d', label: '7 dias' },
]

interface MapFiltersProps {
  selectedType: DisasterType
  selectedPeriod: Period
  onTypeChange: (type: DisasterType) => void
  onPeriodChange: (period: Period) => void
}

function FilterGroup<T extends string>({
  label,
  filters,
  selected,
  onChange,
}: {
  label: string
  filters: Filter<T>[]
  selected: T
  onChange: (v: T) => void
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1.5 px-1">
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer
              ${selected === value
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200 bg-white/3 hover:bg-white/6 border border-border-custom'
              }
            `}
          >
            {selected === value && (
              <motion.div
                layoutId={`filter-active-${label}`}
                className="absolute inset-0 bg-blue-600/30 border border-blue-500/50 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function MapFilters({ selectedType, selectedPeriod, onTypeChange, onPeriodChange }: MapFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-surface/90 backdrop-blur-xl border border-border-custom rounded-2xl p-4 shadow-xl shadow-black/30 flex flex-col gap-4"
    >
      <FilterGroup<DisasterType>
        label="Tipo"
        filters={typeFilters}
        selected={selectedType}
        onChange={onTypeChange}
      />
      <FilterGroup<Period>
        label="Período"
        filters={periodFilters}
        selected={selectedPeriod}
        onChange={onPeriodChange}
      />
    </motion.div>
  )
}
