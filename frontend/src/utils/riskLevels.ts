import type { WeatherData } from '@/services/weatherService'

// ─────────────────────────────────────────────
// Core types
// ─────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'
export type DisasterType = 'all' | 'flood' | 'landslide' | 'drought' | 'cold'
export type Period = '24h' | '48h' | '72h' | '7d'

/** Numeric weight for sorting risk severity */
const LEVEL_SCORE: Record<RiskLevel, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
}

// ─────────────────────────────────────────────
// Individual calculated risk
// ─────────────────────────────────────────────

export interface CalculatedRisk {
  type: DisasterType | 'storm'
  level: RiskLevel
  score: number
  label: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  description: string
  recommendations: string[]
}

// ─────────────────────────────────────────────
// Full result returned by computeRiskResult()
// ─────────────────────────────────────────────

export interface RiskMetrics {
  precip6h: number
  precip12h: number
  precip24h: number
  precip72h: number
  precip14d: number
  humidity: number
  windSpeed: number
  windGusts: number
  tempMax: number
  tempMin: number
  apparentTemp: number
  precipProbability: number
  uvIndex: number
}

export interface RiskResult {
  primaryRisk: CalculatedRisk
  secondaryRisks: CalculatedRisk[]
  allRisks: CalculatedRisk[]
  metrics: RiskMetrics
}

// ─────────────────────────────────────────────
// Slope risk options (prepared for future geo integration)
// ─────────────────────────────────────────────

export interface SlopeRiskOptions {
  /**
   * Whether the area has significant slopes/hillsides that increase landslide risk.
   * Defaults to false. Can be set manually by the user or automatically via GIS data.
   */
  hasSlopeRisk?: boolean
  /**
   * Indicates the source of the slope risk value.
   * - 'default': not set (false by default)
   * - 'user': manually toggled by the user in the UI
   * - 'geo': automatically detected via geographic/elevation data (future)
   */
  slopeRiskSource?: 'default' | 'user' | 'geo'
}

// ─────────────────────────────────────────────
// Color / style lookup per level
// ─────────────────────────────────────────────

const LEVEL_STYLE: Record<RiskLevel, {
  color: string
  bgColor: string
  borderColor: string
  textColor: string
}> = {
  low: {
    color: '#22c55e',
    bgColor: 'bg-green-500/15',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
  },
  moderate: {
    color: '#eab308',
    bgColor: 'bg-yellow-500/15',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
  },
  high: {
    color: '#f97316',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
  },
  critical: {
    color: '#ef4444',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
  },
}

// ─────────────────────────────────────────────
// Labels per disaster type
// ─────────────────────────────────────────────

const DISASTER_BASE_LABEL: Record<DisasterType | 'storm', string> = {
  all: 'Clima Estável',
  flood: 'Risco de Alagamento',
  landslide: 'Risco de Deslizamento',
  drought: 'Risco de Estiagem/Seca',
  storm: 'Tempestade/Ventos Fortes',
  cold: 'Frio Intenso',
}

const LEVEL_LABEL: Record<RiskLevel, string> = {
  low: 'Baixo',
  moderate: 'Moderado',
  high: 'Alto',
  critical: 'Crítico',
}

function makeLabel(type: DisasterType | 'storm', level: RiskLevel): string {
  if (level === 'low') return 'Baixo Risco'
  return `${DISASTER_BASE_LABEL[type]} - ${LEVEL_LABEL[level]}`
}

// ─────────────────────────────────────────────
// Descriptions & recommendations per type + level
// ─────────────────────────────────────────────

type RiskContent = Record<DisasterType | 'storm', {
  description: string
  recommendations: string[]
}>

const CONTENT: Record<RiskLevel, RiskContent> = {
  low: {
    all: {
      description: 'Condições climáticas estáveis. Nenhuma ameaça imediata identificada.',
      recommendations: ['Mantenha-se informado.', 'Verifique drenagens.'],
    },
    flood: { description: 'Risco baixo de alagamento.', recommendations: [] },
    landslide: { description: 'Solo estável no momento.', recommendations: [] },
    drought: { description: 'Condições normais de umidade.', recommendations: [] },
    storm: { description: 'Ventos calmos.', recommendations: [] },
    cold: { description: 'Temperatura amena.', recommendations: [] },
  },
  moderate: {
    all: { description: 'Atenção redobrada.', recommendations: ['Fique atento às atualizações.'] },
    flood: {
      description: 'Chuvas moderadas previstas. Possíveis alagamentos em áreas baixas.',
      recommendations: ['Evite áreas baixas.', 'Não atravesse vias alagadas.', 'Ligue 199 se necessário.'],
    },
    landslide: {
      description: 'Solo úmido com risco moderado em encostas.',
      recommendations: ['Observe sinais de rachaduras no solo.', 'Ligue 199 se notar algo estranho.'],
    },
    drought: {
      description: 'Temperaturas elevadas e baixa precipitação prevista.',
      recommendations: ['Beba bastante água.', 'Evite exposição ao sol.', 'Economize água.'],
    },
    storm: {
      description: 'Ventos moderados. Evite ficar sob árvores.',
      recommendations: ['Evite áreas com árvores e painéis.', 'Cuidado com quedas de energia.'],
    },
    cold: {
      description: 'Frio intenso previsto. Há risco de desconforto e agravamento de problemas respiratórios.',
      recommendations: ['Use roupas adequadas.', 'Evite permanecer muito tempo ao ar livre.', 'Proteja crianças e idosos.'],
    },
  },
  high: {
    all: { description: 'Risco elevado de desastres.', recommendations: ['Fique em casa.', 'Evite deslocamentos.', 'Ligue 199.'] },
    flood: {
      description: 'Precipitação acumulada elevada. Risco real de enchentes.',
      recommendations: ['Prepare-se para evacuar.', 'Coloque móveis em locais altos.', 'Desligue energia.'],
    },
    landslide: {
      description: 'Solo saturado. Risco alto de deslizamentos.',
      recommendations: ['Saia de casa ao primeiro sinal de risco.', 'Vá para um abrigo.', 'Mantenha mochila de emergência.'],
    },
    drought: {
      description: 'Onda de calor severa e baixa precipitação prolongada. Risco de incêndios.',
      recommendations: ['Umidifique ambientes.', 'Evite qualquer tipo de fogo.', 'Priorize hidratação.'],
    },
    storm: {
      description: 'Rajadas de vento perigosas. Risco de queda de árvores e destelhamentos.',
      recommendations: ['Fique longe de janelas.', 'Guarde objetos soltos no quintal.', 'Não estacione perto de árvores.'],
    },
    cold: {
      description: 'Temperaturas muito baixas. Permanência prolongada ao ar livre pode ser perigosa.',
      recommendations: ['Redobre os cuidados com pessoas vulneráveis.', 'Evite exposição ao vento e chuva.', 'Mantenha ambientes aquecidos.'],
    },
  },
  critical: {
    all: { description: 'SITUAÇÃO DE EMERGÊNCIA.', recommendations: ['EVACUE IMEDIATAMENTE.', 'Ligue 193 ou 199.', 'Siga ordens das autoridades.'] },
    flood: {
      description: 'Volume de chuva extremo. Alagamentos generalizados iminentes.',
      recommendations: ['Não tente atravessar águas.', 'Procure o ponto mais alto.'],
    },
    landslide: {
      description: 'Alto risco de deslizamentos de terra catastróficos.',
      recommendations: ['Abandone a área de risco imediatamente.', 'Alerte os vizinhos.'],
    },
    drought: {
      description: 'Escassez crítica de água e calor extremo.',
      recommendations: ['Siga plano de racionamento.', 'Proteja-se do calor extremo.'],
    },
    storm: {
      description: 'Ciclone ou ventos destrutivos. Grande risco à vida.',
      recommendations: ['Procure abrigo sólido imediatamente.', 'Fique longe de redes elétricas.'],
    },
    cold: {
      description: 'Frio extremo. Há risco elevado para pessoas vulneráveis e exposição prolongada.',
      recommendations: ['Procure abrigo aquecido imediatamente.', 'Evite sair de casa sem necessidade.', 'Verifique idosos, crianças e animais.'],
    },
  },
}

// ─────────────────────────────────────────────
// Helper: build a CalculatedRisk object
// ─────────────────────────────────────────────

function buildRisk(
  type: DisasterType | 'storm',
  level: RiskLevel,
): CalculatedRisk {
  const style = LEVEL_STYLE[level]
  const content = CONTENT[level][type] ?? CONTENT[level].all
  return {
    type,
    level,
    score: LEVEL_SCORE[level],
    label: makeLabel(type, level),
    ...style,
    description: content.description,
    recommendations: content.recommendations,
  }
}

// ─────────────────────────────────────────────
// Individual risk calculators
// ─────────────────────────────────────────────

function calcFlood(precip6h: number, precip24h: number): CalculatedRisk {
  let level: RiskLevel = 'low'
  if (precip24h >= 100 || precip6h >= 60) level = 'critical'
  else if (precip24h >= 50 || precip6h >= 35) level = 'high'
  else if (precip24h >= 20 || precip6h >= 15) level = 'moderate'
  return buildRisk('flood', level)
}

function calcLandslide(
  precip72h: number,
  precip24h: number,
  slopes: SlopeRiskOptions,
): CalculatedRisk {
  // Only calculate landslide risk when slope data is available
  if (!slopes.hasSlopeRisk) {
    return buildRisk('landslide', 'low')
  }
  let level: RiskLevel = 'low'
  if (precip72h >= 150 && precip24h >= 60) level = 'critical'
  else if (precip72h >= 100 && precip24h >= 40) level = 'high'
  else if (precip72h >= 60 && precip24h >= 20) level = 'moderate'
  return buildRisk('landslide', level)
}

function calcStorm(maxWind: number, maxGusts: number): CalculatedRisk {
  let level: RiskLevel = 'low'
  if (maxWind >= 80 || maxGusts >= 90) level = 'critical'
  else if (maxWind >= 60 || maxGusts >= 70) level = 'high'
  else if (maxWind >= 40 || maxGusts >= 50) level = 'moderate'
  return buildRisk('storm', level)
}

function calcDrought(tempMax: number, precip14d: number, avgHumidity: number): CalculatedRisk {
  // precip14d is forecast-based only, not historical rainfall.
  // Do not classify drought as critical without longer-term or historical data.
  let level: RiskLevel = 'low'
  if (tempMax >= 37 && precip14d <= 5) level = 'high'
  else if (tempMax >= 35 && precip14d <= 10) level = 'moderate'

  // Low humidity can boost severity by one level (but never to critical, per policy)
  if (level === 'moderate' && avgHumidity <= 35) level = 'high'

  return buildRisk('drought', level)
}

function calcCold(tempMin: number, minApparentTemp: number, maxWind: number): CalculatedRisk {
  let level: RiskLevel = 'low'
  if (tempMin <= 0 || minApparentTemp <= -2) level = 'critical'
  else if (tempMin <= 5 || minApparentTemp <= 3) level = 'high'
  else if (tempMin <= 10 || minApparentTemp <= 8) level = 'moderate'

  // Strong wind worsens perceived cold — bump up one level (cap at critical)
  if (level === 'moderate' && maxWind >= 30) level = 'high'
  else if (level === 'high' && maxWind >= 30) level = 'critical'

  return buildRisk('cold', level)
}

// ─────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────

export function computeRiskResult(
  weather: WeatherData,
  slopes: SlopeRiskOptions = { hasSlopeRisk: false, slopeRiskSource: 'default' },
): RiskResult {
  // ── Raw hourly arrays (safe slices) ───────────────
  const hourlyPrecip = weather.hourly.precipitation
  const hourlyHumidity = weather.hourly.relativeHumidity2m
  const hourlyWind = weather.hourly.windSpeed10m.slice(0, 24)
  const hourlyGusts = weather.hourly.windGusts10m.slice(0, 24)
  const hourlyApparent = weather.hourly.apparentTemperature.slice(0, 24)

  // ── Accumulated precipitation (safe Math operations) ──
  const precip6h = hourlyPrecip.slice(0, 6).reduce((a, b) => a + b, 0)
  const precip12h = hourlyPrecip.slice(0, 12).reduce((a, b) => a + b, 0)
  const precip24h = hourlyPrecip.slice(0, 24).reduce((a, b) => a + b, 0)
  const precip72h = hourlyPrecip.slice(0, 72).reduce((a, b) => a + b, 0)

  // precip14d: uses daily forecast sums (first 14 days) as a proxy.
  // This is forecast-based, not historical. See drought logic for severity cap.
  const dailyPrecip14d = weather.daily.precipitationSum.slice(0, 14)
  const precip14d = dailyPrecip14d.reduce((a, b) => a + b, 0)

  // ── Climate stats (safe for empty arrays) ─────────
  const humidity24h = hourlyHumidity.slice(0, 24)
  const avgHumidity = humidity24h.length
    ? humidity24h.reduce((a, b) => a + b, 0) / humidity24h.length
    : 0

  const maxWind = hourlyWind.length ? Math.max(...hourlyWind) : 0
  const maxGusts = hourlyGusts.length ? Math.max(...hourlyGusts) : 0

  const tempMax = weather.daily.temperature2mMax[0] ?? 0
  const tempMin = weather.daily.temperature2mMin[0] ?? 0

  // Use minimum apparent temperature over next 24h (captures late-night cold)
  const minApparentTemp = hourlyApparent.length
    ? Math.min(...hourlyApparent)
    : tempMin

  const precipProbability = weather.daily.precipitationProbabilityMax.length
    ? Math.max(...weather.daily.precipitationProbabilityMax.slice(0, 1))
    : 0

  const uvIndex = weather.daily.uvIndexMax[0] ?? 0

  // ── Calculate each risk independently ─────────────
  const flood = calcFlood(precip6h, precip24h)
  const landslide = calcLandslide(precip72h, precip24h, slopes)
  const storm = calcStorm(maxWind, maxGusts)
  const drought = calcDrought(tempMax, precip14d, avgHumidity)
  const cold = calcCold(tempMin, minApparentTemp, maxWind)

  // ── Sort all risks by severity (descending) ────────
  const allRisks = [flood, landslide, storm, drought, cold].sort(
    (a, b) => b.score - a.score,
  )

  // Filter out 'low' risks from secondary (only meaningful risks shown)
  const significantRisks = allRisks.filter(r => r.score > 0)

  const primaryRisk = significantRisks.length > 0
    ? significantRisks[0]
    : buildRisk('all', 'low')

  const secondaryRisks = significantRisks.slice(1)

  // ── Compose metrics ───────────────────────────────
  const metrics: RiskMetrics = {
    precip6h: Math.round(precip6h * 10) / 10,
    precip12h: Math.round(precip12h * 10) / 10,
    precip24h: Math.round(precip24h * 10) / 10,
    precip72h: Math.round(precip72h * 10) / 10,
    precip14d: Math.round(precip14d * 10) / 10,
    humidity: Math.round(avgHumidity),
    windSpeed: Math.round(maxWind),
    windGusts: Math.round(maxGusts),
    tempMax: Math.round(tempMax),
    tempMin: Math.round(tempMin),
    apparentTemp: Math.round(minApparentTemp),
    precipProbability,
    uvIndex: Math.round(uvIndex * 10) / 10,
  }

  return { primaryRisk, secondaryRisks, allRisks, metrics }
}

// ─────────────────────────────────────────────
// Legacy compatibility (kept for any existing usages)
// ─────────────────────────────────────────────

/** @deprecated Use computeRiskResult() instead */
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
  windGusts: number
  tempMax: number
  tempMin: number
  apparentTemp: number
  precipProbability: number
  uvIndex: number
}
