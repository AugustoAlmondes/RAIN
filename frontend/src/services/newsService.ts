import { detectCategory } from "@/utils/newsManager";

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4/search?q=chuva OR enchente OR vendaval OR temporal OR alagamento OR desmoronamento OR deslizamento OR inundação&lang=pt&country=br&max=200&apikey="

export interface Article {
    title: string,
    description: string,
    image: string,
    url: string,
    publishedAt: string,
    source: {
        name: string
    },
    reference: string,
    category: string,
}

export async function fetchNews() {
    try {
        const response = await fetch(BASE_URL + API_KEY)
        const data = await response.json();

        return data.articles.map((article: Article) => ({
            title: article.title,
            description: article.description,
            image: article.image,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source.name,
            reference: article.source.name,
            category: detectCategory(article.title)
        }));
    } catch (error) {
        console.error(error)
    }
}