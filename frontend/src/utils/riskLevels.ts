import type { WeatherData } from '@/services/weatherService'

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'
export type DisasterType = 'all' | 'flood' | 'landslide' | 'drought'
export type Period = '24h' | '48h' | '72h' | '7d'

export interface RiskInfo {
  level: RiskLevel
  label: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  description: string
  recommendations: string[]
  precipNext24h: number
  humidity: number
  windSpeed: number
  tempMax: number
  tempMin: number
  precipProbability: number
}

/** Compute risk level based on precipitation and humidity */
export function computeRisk(weather: WeatherData, period: Period = '24h'): RiskInfo {
  const hoursMap: Record<Period, number> = { '24h': 24, '48h': 48, '72h': 72, '7d': 168 }
  const sliceHours = hoursMap[period]

  const hourlyPrecip = weather.hourly.precipitation.slice(0, sliceHours)
  const hourlyHumidity = weather.hourly.relativeHumidity2m.slice(0, sliceHours)
  const hourlyWind = weather.hourly.windSpeed10m.slice(0, 24)

  const totalPrecip = hourlyPrecip.reduce((a, b) => a + b, 0)
  const avgHumidity = hourlyHumidity.reduce((a, b) => a + b, 0) / hourlyHumidity.length
  const maxWind = Math.max(...hourlyWind)
  const precipNext24h = weather.hourly.precipitation.slice(0, 24).reduce((a, b) => a + b, 0)
  const precipProbability = weather.daily.precipitationProbabilityMax[0] ?? 0
  const tempMax = weather.daily.temperature2mMax[0] ?? 0
  const tempMin = weather.daily.temperature2mMin[0] ?? 0

  // Scaled per-period total
  const dailyEquiv = totalPrecip / (sliceHours / 24)

  let level: RiskLevel
  if (dailyEquiv >= 50 || (dailyEquiv >= 30 && avgHumidity >= 85)) {
    level = 'critical'
  } else if (dailyEquiv >= 25 || (dailyEquiv >= 15 && avgHumidity >= 80)) {
    level = 'high'
  } else if (dailyEquiv >= 10 || avgHumidity >= 70) {
    level = 'moderate'
  } else {
    level = 'low'
  }

  const riskMeta: Record<RiskLevel, { label: string; color: string; bgColor: string; borderColor: string; textColor: string; description: string; recommendations: string[] }> = {
    low: {
      label: 'Baixo Risco',
      color: '#22c55e',
      bgColor: 'bg-green-500/15',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      description: 'Condições climáticas estáveis. Nenhuma ameaça imediata identificada para a região.',
      recommendations: [
        'Mantenha-se informado sobre previsões do tempo.',
        'Verifique as condições de drenagem em sua propriedade.',
        'Conheça os pontos de abrigo mais próximos.',
      ],
    },
    moderate: {
      label: 'Atenção',
      color: '#eab308',
      bgColor: 'bg-yellow-500/15',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      description: 'Chuvas moderadas previstas. Fique atento a possíveis alagamentos em áreas baixas.',
      recommendations: [
        'Evite áreas de baixada em caso de chuva intensa.',
        'Não traversse vias alagadas de carro ou a pé.',
        'Mantenha o número da Defesa Civil salvo: 199.',
        'Verifique calhas e ralos da residência.',
      ],
    },
    high: {
      label: 'Risco Alto',
      color: '#f97316',
      bgColor: 'bg-orange-500/15',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      description: 'Precipitação acumulada elevada. Há risco real de enchentes e deslizamentos em encostas.',
      recommendations: [
        'Fique em casa e evite deslocamentos desnecessários.',
        'Afaste-se de encostas e margens de córregos.',
        'Desligue aparelhos eletrônicos em caso de tempestade.',
        'Ligue 199 (Defesa Civil) ao primeiro sinal de risco.',
        'Tenha uma mochila de emergência pronta.',
      ],
    },
    critical: {
      label: 'Crítico',
      color: '#ef4444',
      bgColor: 'bg-red-500/15',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      description: 'Situação de emergência. Volume de chuva extremo com alto risco de desastres iminentes.',
      recommendations: [
        '⚠️ EVACUE a área se sua casa estiver em zona de risco.',
        'Ligue imediatamente 199 (Defesa Civil) ou 193 (Bombeiros).',
        'Dirija-se ao ponto de apoio mais próximo.',
        'Não entre em contato com água de enchente.',
        'Alerte vizinhos e familiares.',
      ],
    },
  }

  return {
    level,
    ...riskMeta[level],
    precipNext24h: Math.round(precipNext24h * 10) / 10,
    humidity: Math.round(avgHumidity),
    windSpeed: Math.round(maxWind),
    tempMax: Math.round(tempMax),
    tempMin: Math.round(tempMin),
    precipProbability,
  }
}
