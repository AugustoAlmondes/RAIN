import { detectCategory } from "@/utils/newsManager";


export interface Source {
  id: string | null;
  name: string;
}

export interface Articles {
  source: Source;
  author: string | null;
  title: string | null;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface Main {
  status: string;
  totalResults: number;
  articles: Articles[];
}

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
        const response = await fetch('/.netlify/functions/news');
        const data: Main = await response.json();

        if (!response.ok) {
            throw new Error((data as any).error || "Failed to fetch news");
        }

        return data.articles.map((article: Articles) => ({
            title: article.title || "",
            description: article.description || "",
            image: article.urlToImage || "",
            url: article.url || "",
            publishedAt: article.publishedAt || "",
            source: { name: article.source.name || "Desconhecido" },
            reference: article.source.name || "",
            category: detectCategory(article.title || "")
        })) as Article[];
    } catch (error) {
        console.error(error)
        return [];
    }
}