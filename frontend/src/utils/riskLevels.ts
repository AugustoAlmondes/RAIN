import type { WeatherData } from '@/services/weatherService'

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'
export type DisasterType = 'all' | 'flood' | 'landslide' | 'drought'
export type Period = '24h' | '48h' | '72h' | '7d'

export interface RiskInfo {
  level: RiskLevel
  disasterType: DisasterType | 'storm'
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

/** Compute risk level based on various weather parameters */
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

  let level: RiskLevel = 'low'
  let disasterType: DisasterType | 'storm' = 'all'

  // 1. Check for FLOODING (high immediate rain)
  if (precipNext24h >= 100 || dailyEquiv >= 60) {
    level = 'critical'
    disasterType = 'flood'
  } else if (precipNext24h >= 50 || dailyEquiv >= 30) {
    level = 'high'
    disasterType = 'flood'
  } else if (precipNext24h >= 20 || dailyEquiv >= 10) {
    level = 'moderate'
    disasterType = 'flood'
  }

  // 2. Check for LANDSLIDE (cumulative rain + high humidity)
  const precip72h = weather.hourly.precipitation.slice(0, 72).reduce((a, b) => a + b, 0)
  if (precip72h >= 150 && avgHumidity >= 85) {
    if (level !== 'critical') {
      level = 'critical'
      disasterType = 'landslide'
    }
  } else if (precip72h >= 80 && avgHumidity >= 80) {
    if (level === 'low' || level === 'moderate') {
      level = 'high'
      disasterType = 'landslide'
    }
  }

  // 3. Check for STORM (high wind)
  if (maxWind >= 80) {
    level = 'critical'
    disasterType = 'storm'
  } else if (maxWind >= 50) {
    if (level !== 'critical') {
      level = 'high'
      disasterType = 'storm'
    }
  }

  // 4. Check for DROUGHT (high temp + no rain)
  const totalPrecip7d = weather.daily.precipitationSum.reduce((a, b) => a + b, 0)
  if (tempMax >= 35 && totalPrecip7d <= 5) {
    if (level === 'low') {
        level = 'moderate'
        disasterType = 'drought'
    }
  }

  const disasterLabels: Record<DisasterType | 'storm', string> = {
    all: 'Clima Estável',
    flood: 'Risco de Alagamento',
    landslide: 'Risco de Deslizamento',
    drought: 'Risco de Estiagem/Seca',
    storm: 'Tempestade/Ventos Fortes'
  }

  const riskMeta: Record<RiskLevel, {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    descriptions: Record<DisasterType | 'storm', string>;
    recommendations: Record<DisasterType | 'storm', string[]>;
  }> = {
    low: {
      color: '#22c55e',
      bgColor: 'bg-green-500/15',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      descriptions: {
        all: 'Condições climáticas estáveis. Nenhuma ameaça imediata identificada.',
        flood: 'Risco baixo de alagamento.',
        landslide: 'Solo estável no momento.',
        drought: 'Condições normais de umidade.',
        storm: 'Ventos calmos.'
      },
      recommendations: {
        all: ['Mantenha-se informado.', 'Verifique drenagens.'],
        flood: [], landslide: [], drought: [], storm: []
      }
    },
    moderate: {
      color: '#eab308',
      bgColor: 'bg-yellow-500/15',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      descriptions: {
        all: 'Atenção redobrada.',
        flood: 'Chuvas moderadas previstas. Possíveis alagamentos em áreas baixas.',
        landslide: 'Solo úmido com risco moderado em encostas.',
        drought: 'Temperaturas elevadas e baixa umidade do ar.',
        storm: 'Ventos moderados. Evite ficar sob árvores.'
      },
      recommendations: {
        all: ['Fique atento às atualizações.'],
        flood: ['Evite áreas baixas.', 'Não atravesse vias alagadas.', 'Ligue 199 se necessário.'],
        landslide: ['Observe sinais de rachaduras no solo.', 'Ligue 199 se notar algo estranho.'],
        drought: ['Beba bastante água.', 'Evite exposição ao sol.', 'Economize água.'],
        storm: ['Evite áreas com árvores e painéis.', 'Cuidado com quedas de energia.']
      }
    },
    high: {
      color: '#f97316',
      bgColor: 'bg-orange-500/15',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      descriptions: {
        all: 'Risco elevado de desastres.',
        flood: 'Precipitação acumulada elevada. Risco real de enchentes.',
        landslide: 'Solo saturado. Risco alto de deslizamentos.',
        drought: 'Onda de calor severa e seca prolongada. Risco de incêndios.',
        storm: 'Rajadas de vento perigosas. Risco de queda de árvores e destelhamentos.'
      },
      recommendations: {
        all: ['Fique em casa.', 'Evite deslocamentos.', 'Ligue 199.'],
        flood: ['Prepare-se para evacuar.', 'Coloque móveis em locais altos.', 'Desligue energia.'],
        landslide: ['Saia de casa ao primeiro sinal de risco.', 'Vá para um abrigo.', 'Mantenha mochila de emergência.'],
        drought: ['Umidifique ambientes.', 'Evite qualquer tipo de fogo.', 'Priorize hidratação.'],
        storm: ['Fique longe de janelas.', 'Guarde objetos soltos no quintal.', 'Não estacione perto de árvores.']
      }
    },
    critical: {
      color: '#ef4444',
      bgColor: 'bg-red-500/15',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      descriptions: {
        all: 'SITUAÇÃO DE EMERGÊNCIA.',
        flood: 'Volume de chuva extremo. Alagamentos generalizados iminentes.',
        landslide: 'Alto risco de deslizamentos de terra catastróficos.',
        drought: 'Escassez crítica de água e calor extremo insuportável.',
        storm: 'Ciclone ou ventos destrutivos. Grande risco à vida.'
      },
      recommendations: {
        all: ['EVACUE IMEDIATAMENTE.', 'Ligue 193 ou 199.', 'Siga ordens das autoridades.'],
        flood: ['Não tente atravessar águas.', 'Procure o ponto mais alto.'],
        landslide: ['Abandone a área de risco imediatamente.', 'Alerte os vizinhos.'],
        drought: ['Siga plano de racionamento.', 'Proteja-se do calor extremo.'],
        storm: ['Procure abrigo sólido imediatamente.', 'Fique longe de redes elétricas.']
      }
    },
  }

  const meta = riskMeta[level]
  const description = meta.descriptions[disasterType] || meta.descriptions.all
  const recommendations = [...meta.recommendations.all, ...(meta.recommendations[disasterType] || [])]

  return {
    level,
    disasterType,
    label: level === 'low' ? 'Baixo Risco' : disasterLabels[disasterType],
    color: meta.color,
    bgColor: meta.bgColor,
    borderColor: meta.borderColor,
    textColor: meta.textColor,
    description,
    recommendations,
    precipNext24h: Math.round(precipNext24h * 10) / 10,
    humidity: Math.round(avgHumidity),
    windSpeed: Math.round(maxWind),
    tempMax: Math.round(tempMax),
    tempMin: Math.round(tempMin),
    precipProbability,
  }
}
