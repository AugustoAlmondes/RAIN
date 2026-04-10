import { create } from "zustand"

export interface TourStep {
    targetId: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourStore {
    isOpen: boolean;
    currentStep: number;
    steps: TourStep[];
    openTour: () => void;
    closeTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
}

export const useTourStore = create<TourStore>((set) => ({
    isOpen: false,
    currentStep: 0,
    steps: [
        {
            targetId: "tour-home",
            title: "Página Inicial",
            content: "Volte para a página inicial.",
            position: "right"
        },
        {
            targetId: "tour-search",
            title: "Busca de Cidades",
            content: "Digite o nome de uma cidade para ver as condições climáticas e riscos de desastres.",
            position: "bottom"
        },
        {
            targetId: "tour-geolocate",
            title: "Geolocalização",
            content: "Use sua localização atual para ver as condições climáticas e riscos de desastres.",
            position: "bottom"
        },
        {
            targetId: "tour-news",
            title: "Notícias",
            content: "Veja as notícias relacionadas à cidade selecionada.",
            position: "bottom"
        },
        {
            targetId: "tour-analysis-btn",
            title: "Análise AI",
            content: "Obtenha um relatório detalhado de riscos climáticos processado por inteligência artificial.",
            position: "bottom"
        },
        {
            targetId: "tour-weather-widget",
            title: "Widget de Tempo",
            content: "Veja as condições climáticas atuais na cidade selecionada.",
            position: "left"
        },
        {
            targetId: "tour-risk-panel",
            title: "Painel de Riscos",
            content: "Veja as condições climáticas e riscos de desastres na cidade selecionada.",
            position: "left"
        },
        {
            targetId: "tour-map-styles",
            title: "Estilos do Mapa",
            content: "Selecione os estilos que deseja visualizar no mapa.",
            position: "top"
        },
        {
            targetId: "tour-map-layers",
            title: "Camadas do Mapa",
            content: "Selecione as camadas que deseja visualizar no mapa.",
        },
    ],
    openTour: () => set({ isOpen: true, currentStep: 0 }),
    closeTour: () => set({ isOpen: false }),
    prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0)
    })),
    nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
    })),
}))