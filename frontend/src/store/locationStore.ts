import { create } from "zustand"
import { type GeoLocation } from "../services/geocodingService"

interface LocationStore {
    searchLocation: GeoLocation | null
    setSearchLocation: (location: GeoLocation | null) => void
}

export const useLocationStore = create<LocationStore>((set) => ({
    searchLocation: null,
    setSearchLocation: (location) => set({ searchLocation: location }),
}))
