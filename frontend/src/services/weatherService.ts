const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export interface HourlyWeather {
  time: string[]
  precipitation: number[]
  relativeHumidity2m: number[]
  windSpeed10m: number[]
  precipitationProbability: number[]
  windGusts10m: number[]
  apparentTemperature: number[]
}

export interface DailyWeather {
  time: string[]
  precipitationSum: number[]
  precipitationProbabilityMax: number[]
  temperature2mMax: number[]
  temperature2mMin: number[]
  uvIndexMax: number[]
}

export interface WeatherData {
  hourly: HourlyWeather
  daily: DailyWeather
  latitude: number
  longitude: number
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: 'precipitation,relative_humidity_2m,wind_speed_10m,precipitation_probability,wind_gusts_10m,apparent_temperature',
    daily: 'precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,uv_index_max',
    timezone: 'America/Sao_Paulo',
    forecast_days: '7',
  })

  const response = await fetch(`${BASE_URL}?${params}`)

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  const data = await response.json()

  console.log(data);

  return {
    latitude: data.latitude,
    longitude: data.longitude,  
    hourly: {
      time: data.hourly.time,
      precipitation: data.hourly.precipitation,
      relativeHumidity2m: data.hourly.relative_humidity_2m,
      windSpeed10m: data.hourly.wind_speed_10m,
      precipitationProbability: data.hourly.precipitation_probability,
      windGusts10m: data.hourly.wind_gusts_10m,
      apparentTemperature: data.hourly.apparent_temperature,
    },
    daily: {
      time: data.daily.time,
      precipitationSum: data.daily.precipitation_sum,
      precipitationProbabilityMax: data.daily.precipitation_probability_max,
      temperature2mMax: data.daily.temperature_2m_max,
      temperature2mMin: data.daily.temperature_2m_min,
      uvIndexMax: data.daily.uv_index_max,
    },
  }
}
