import type { Article } from "@/services/newsService";

export function formatDate(date?: string) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export const filteredNews = (data: Article[], category: string, search: string) => data?.filter((item: Article) => {
    const matchesCategory =
        category === "all" || detectCategory(item.title) === category;

    const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
})

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
    enchente: ["chuva", "enchente", "alagamento", "inundação"],
    deslizamento: ["deslizamento", "desmoronamento", "encosta"],
    seca: ["seca", "estiagem", "calor extremo"],
    ciclone: ["ciclone", "furacão", "tempestade", "ventos", "vendaval"],
    granizo: ["granizo", "chuva de pedra"],
    geada: ["geada", "frio intenso", "onda de frio"],
};

export function detectCategory(title = "") {
    const t = title.toLowerCase();

    for (const category in CATEGORY_KEYWORDS) {
        const keywords = CATEGORY_KEYWORDS[category];

        if (keywords.some(word => t.includes(word))) {
            return category;
        }
    }
    return "geral";
}