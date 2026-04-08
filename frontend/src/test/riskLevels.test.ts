import { describe, it, expect } from 'vitest'
import { computeRiskResult } from '../utils/riskLevels'
import type { WeatherData } from '../services/weatherService'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Fills an array with `value` repeated `n` times */
function fill(n: number, value: number): number[] {
  return Array(n).fill(value)
}

/** Creates a minimal WeatherData stub */
function makeWeather(overrides: {
  hourlyPrecip?: number[]
  hourlyHumidity?: number[]
  hourlyWind?: number[]
  hourlyGusts?: number[]
  hourlyApparent?: number[]
  dailyPrecipSum?: number[]
  dailyPrecipProbMax?: number[]
  dailyTempMax?: number[]
  dailyTempMin?: number[]
  dailyUvMax?: number[]
}): WeatherData {
  const {
    hourlyPrecip = fill(168, 0),
    hourlyHumidity = fill(168, 60),
    hourlyWind = fill(24, 10),
    hourlyGusts = fill(24, 15),
    hourlyApparent = fill(24, 20),
    dailyPrecipSum = fill(16, 0),
    dailyPrecipProbMax = fill(16, 10),
    dailyTempMax = [28],
    dailyTempMin = [18],
    dailyUvMax = [5],
  } = overrides

  return {
    latitude: -23.55,
    longitude: -46.63,
    hourly: {
      time: fill(168, 0).map((_, i) => `2026-01-01T${String(i % 24).padStart(2, '0')}:00`),
      precipitation: hourlyPrecip,
      relativeHumidity2m: hourlyHumidity,
      windSpeed10m: hourlyWind,
      precipitationProbability: fill(168, 30),
      windGusts10m: hourlyGusts,
      apparentTemperature: hourlyApparent,
    },
    daily: {
      time: fill(16, 0).map((_, i) => `2026-01-0${i + 1}`),
      precipitationSum: dailyPrecipSum,
      precipitationProbabilityMax: dailyPrecipProbMax,
      temperature2mMax: dailyTempMax,
      temperature2mMin: dailyTempMin,
      uvIndexMax: dailyUvMax,
    },
  }
}

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

describe('computeRiskResult', () => {

  it('returns low risk for benign conditions', () => {
    const weather = makeWeather({})
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.level).toBe('low')
    expect(result.secondaryRisks).toHaveLength(0)
  })

  // ── Flood ─────────────────────────────────────

  it('detects critical flood when precip24h >= 100mm', () => {
    // 5mm/h × 24h = 120mm accumulated
    const weather = makeWeather({ hourlyPrecip: fill(168, 5) })
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.type).toBe('flood')
    expect(result.primaryRisk.level).toBe('critical')
    expect(result.metrics.precip24h).toBe(120)
  })

  it('detects high flood when precip24h >= 50mm', () => {
    // 2.5mm/h × 24h = 60mm
    const weather = makeWeather({ hourlyPrecip: fill(168, 2.5) })
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.type).toBe('flood')
    expect(result.primaryRisk.level).toBe('high')
  })

  it('detects moderate flood when precip24h >= 20mm', () => {
    // 1mm/h × 24h = 24mm
    const weather = makeWeather({ hourlyPrecip: fill(168, 1) })
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.type).toBe('flood')
    expect(result.primaryRisk.level).toBe('moderate')
  })

  it('detects critical flood via precip6h threshold (>= 60mm)', () => {
    // 12mm/h for first 6h, 0 after → only 6h sum = 72mm, 24h = 72mm (critical anyway)
    const heavy6 = [...fill(6, 12), ...fill(162, 0)]
    const weather = makeWeather({ hourlyPrecip: heavy6 })
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.type).toBe('flood')
    expect(result.primaryRisk.level).toBe('critical')
    expect(result.metrics.precip6h).toBe(72)
  })

  // ── Storm ────────────────────────────────────

  it('detects high storm when maxWind >= 60 km/h', () => {
    const weather = makeWeather({ hourlyWind: fill(24, 65) })
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.type).toBe('storm')
    expect(result.primaryRisk.level).toBe('high')
  })

  it('detects critical storm via gusts >= 90 km/h', () => {
    const weather = makeWeather({ hourlyGusts: fill(24, 95) })
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.type).toBe('storm')
    expect(result.primaryRisk.level).toBe('critical')
  })

  // ── Flood + Storm simultaneously ─────────────

  it('exposes flood (critical) as primary and storm (high) as secondary', () => {
    const weather = makeWeather({
      hourlyPrecip: fill(168, 5),   // 120mm/24h → flood critical
      hourlyWind: fill(24, 65),     // 65 km/h → storm high
    })
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.type).toBe('flood')
    expect(result.primaryRisk.level).toBe('critical')
    const stormRisk = result.secondaryRisks.find(r => r.type === 'storm')
    expect(stormRisk).toBeDefined()
    expect(stormRisk?.level).toBe('high')
  })

  // ── Landslide ────────────────────────────────

  it('does NOT trigger landslide when hasSlopeRisk is false (default)', () => {
    // 72h rain = 3mm/h × 72 = 216mm; 24h = 72mm — would be critical with slope
    const weather = makeWeather({ hourlyPrecip: fill(168, 3) })
    const result = computeRiskResult(weather) // no slope config passed
    const landslideRisk = result.allRisks.find(r => r.type === 'landslide')
    expect(landslideRisk?.level).toBe('low')
  })

  it('triggers landslide when hasSlopeRisk is true and thresholds met', () => {
    // precip72h = 3mm/h × 72 = 216mm; precip24h = 72mm → critical
    const weather = makeWeather({ hourlyPrecip: fill(168, 3) })
    const result = computeRiskResult(weather, { hasSlopeRisk: true, slopeRiskSource: 'user' })
    const landslideRisk = result.allRisks.find(r => r.type === 'landslide')
    expect(landslideRisk?.level).toBe('critical')
  })

  it('does NOT trigger landslide on heavy rain without slope (hasSlopeRisk false)', () => {
    const weather = makeWeather({ hourlyPrecip: fill(168, 5) }) // very heavy rain
    const result = computeRiskResult(weather, { hasSlopeRisk: false })
    const landslide = result.allRisks.find(r => r.type === 'landslide')
    expect(landslide?.level).toBe('low')
    // landslide should not appear in secondary risks
    expect(result.secondaryRisks.find(r => r.type === 'landslide')).toBeUndefined()
  })

  // ── Drought ──────────────────────────────────

  it('detects moderate drought when tempMax >= 35 and precip14d <= 10', () => {
    const weather = makeWeather({
      dailyTempMax: [36],
      dailyPrecipSum: fill(16, 0.3), // 16 × 0.3 = 4.8mm total, first 14 = 4.2mm
    })
    const result = computeRiskResult(weather)
    const droughtRisk = result.allRisks.find(r => r.type === 'drought')
    // 14d precip = 14 × 0.3 = 4.2, tempMax = 36 >= 35 and precip14d < 10 → at least moderate
    expect(droughtRisk?.level).toBe('moderate')
  })

  it('detects high drought when tempMax >= 37 and precip14d <= 5', () => {
    const weather = makeWeather({
      dailyTempMax: [38],
      dailyPrecipSum: fill(16, 0.1), // 14d total = 1.4mm
    })
    const result = computeRiskResult(weather)
    const droughtRisk = result.allRisks.find(r => r.type === 'drought')
    expect(droughtRisk?.level).toBe('high')
  })

  it('never classifies drought as critical (forecast-data limitation)', () => {
    // Extreme scenario: very hot + zero rain
    const weather = makeWeather({
      dailyTempMax: [45],
      dailyPrecipSum: fill(16, 0),
    })
    const result = computeRiskResult(weather)
    const droughtRisk = result.allRisks.find(r => r.type === 'drought')
    expect(droughtRisk?.level).not.toBe('critical')
  })

  it('bumps drought from moderate to high when humidity <= 35', () => {
    const weather = makeWeather({
      dailyTempMax: [36],
      dailyPrecipSum: fill(16, 0.3),
      hourlyHumidity: fill(168, 30), // avg humidity = 30 <= 35
    })
    const result = computeRiskResult(weather)
    const droughtRisk = result.allRisks.find(r => r.type === 'drought')
    expect(droughtRisk?.level).toBe('high')
  })

  // ── Cold ─────────────────────────────────────

  it('detects moderate cold when tempMin <= 10', () => {
    const weather = makeWeather({
      dailyTempMin: [8],
      hourlyApparent: fill(24, 12), // apparent > 8, no threshold
    })
    const result = computeRiskResult(weather)
    const coldRisk = result.allRisks.find(r => r.type === 'cold')
    expect(coldRisk?.level).toBe('moderate')
  })

  it('bumps cold from moderate to high when maxWind >= 30', () => {
    // tempMin=7 → moderate cold; wind=35 → bumps to high
    const weather = makeWeather({
      dailyTempMin: [7],
      hourlyApparent: fill(24, 9), // min apparent = 9 > 8 → starts moderate
      hourlyWind: fill(24, 35),    // wind >= 30 → upgrade
    })
    const result = computeRiskResult(weather)
    const coldRisk = result.allRisks.find(r => r.type === 'cold')
    expect(coldRisk?.level).toBe('high')
  })

  it('detects critical cold via minApparentTemp <= -2', () => {
    const weather = makeWeather({
      dailyTempMin: [2],
      hourlyApparent: fill(24, -3), // min apparent = -3 → critical
    })
    const result = computeRiskResult(weather)
    const coldRisk = result.allRisks.find(r => r.type === 'cold')
    expect(coldRisk?.level).toBe('critical')
  })

  it('uses minimum apparent temperature over 24h, not just first hour', () => {
    // First hour is fine (15°C) but worst is at hour 22 (-5°C)
    const apparent = [...fill(22, 15), -5, 15]
    const weather = makeWeather({
      dailyTempMin: [5],
      hourlyApparent: apparent,
    })
    const result = computeRiskResult(weather)
    expect(result.metrics.apparentTemp).toBe(-5)
    const coldRisk = result.allRisks.find(r => r.type === 'cold')
    expect(coldRisk?.level).toBe('critical')
  })

  // ── Empty arrays / edge cases ─────────────────

  it('does not crash when all hourly arrays are empty', () => {
    const weather = makeWeather({
      hourlyPrecip: [],
      hourlyHumidity: [],
      hourlyWind: [],
      hourlyGusts: [],
      hourlyApparent: [],
      dailyPrecipSum: [],
      dailyPrecipProbMax: [],
      dailyTempMax: [],
      dailyTempMin: [],
      dailyUvMax: [],
    })
    expect(() => computeRiskResult(weather)).not.toThrow()
  })

  it('returns metrics with zeros when all arrays are empty', () => {
    const weather = makeWeather({
      hourlyPrecip: [],
      hourlyHumidity: [],
      hourlyWind: [],
      hourlyGusts: [],
      hourlyApparent: [],
      dailyPrecipSum: [],
      dailyTempMax: [],
      dailyTempMin: [],
    })
    const result = computeRiskResult(weather)
    expect(result.metrics.precip24h).toBe(0)
    expect(result.metrics.windSpeed).toBe(0)
    expect(result.metrics.windGusts).toBe(0)
    expect(result.metrics.humidity).toBe(0)
  })

  // ── Tie-breaking ─────────────────────────────

  it('when two risks share the same level, both appear in allRisks', () => {
    // flood = critical (120mm/24h), storm = critical (gusts 95)
    const weather = makeWeather({
      hourlyPrecip: fill(168, 5),  // 24h = 120mm → flood critical
      hourlyGusts: fill(24, 95),   // gusts → storm critical
    })
    const result = computeRiskResult(weather)
    const criticals = result.allRisks.filter(r => r.level === 'critical')
    expect(criticals.length).toBeGreaterThanOrEqual(2)
    // primaryRisk must be one of the critical ones
    expect(result.primaryRisk.level).toBe('critical')
  })

  // ── Label format ─────────────────────────────

  it('formats label correctly as "Type - Level"', () => {
    const weather = makeWeather({ hourlyPrecip: fill(168, 5) }) // flood critical
    const result = computeRiskResult(weather)
    expect(result.primaryRisk.label).toBe('Risco de Alagamento - Crítico')
  })

  it('returns "Baixo Risco" label when all risks are low', () => {
    const result = computeRiskResult(makeWeather({}))
    expect(result.primaryRisk.label).toBe('Baixo Risco')
  })

  // ── slopeRiskSource metadata ──────────────────

  it('accepts slopeRiskSource metadata without affecting logic when hasSlopeRisk is false', () => {
    const weather = makeWeather({ hourlyPrecip: fill(168, 3) })
    const resultDefault = computeRiskResult(weather, { hasSlopeRisk: false, slopeRiskSource: 'default' })
    const resultUser = computeRiskResult(weather, { hasSlopeRisk: false, slopeRiskSource: 'user' })
    expect(resultDefault.allRisks.find(r => r.type === 'landslide')?.level)
      .toBe(resultUser.allRisks.find(r => r.type === 'landslide')?.level)
  })
})
