const USER_AGENT = 'AlertaClima/1.0'

export interface Address {
city_district: string
country: string
country_code: string
state: string
state_district: string
town?: string
village?: string
}

export interface GeoLocation {
  lat: number
  lon: number
  name: string
  address: Address

}

export async function searchCity(query: string): Promise<GeoLocation[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&accept-language=pt-BR`

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (!response.ok) {
    throw new Error(`Geocoding error: ${response.status}`)
  }

  const data = await response.json()

  const result = data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    name: item.name || item.display_name.split(',')[0],
    address: item.address
  }))

  return result
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt-BR`

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (!response.ok) return 'Localização desconhecida'

  const data = await response.json()
  const addr = data.address || {}
  return addr.city || addr.town || addr.municipality || addr.state || data.display_name || 'Localização desconhecida'
}
