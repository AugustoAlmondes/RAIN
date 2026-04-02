import type { RiskLevel } from "@/utils/riskLevels"

export const RISK_COLORS: Record<RiskLevel, string> = {
    low: '#22c55e',
    moderate: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
}

export type WeatherLayer =
    | 'clouds_new'
    | 'precipitation_new'
    | 'pressure_new'
    | 'wind_new'
    | 'temp_new'

export interface MapMarker {
    lat: number
    lon: number
    label: string
    risk: RiskLevel
}