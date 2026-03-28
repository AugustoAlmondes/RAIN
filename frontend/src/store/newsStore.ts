import { create } from "zustand";

interface NewsStore {
    category: string;
    setCategory: (category: string) => void;
    search: string;
    setSearch: (search: string) => void;
}

export const useNewStore = create<NewsStore>((set) => ({
    category: "all",
    setCategory: (category: string) => set({ category }),

    search: "",
    setSearch: (search: string) => set({ search }),
}))
