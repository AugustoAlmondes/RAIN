import type { Handler } from "@netlify/functions";

const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY || "eccad9977dcb49b2acb4150a730ac551";
const NEWS_URL =
    "https://newsapi.org/v2/everything?q=terremoto OR chuva OR alagamento OR desmoronamento&language=pt&page=1&pageSize=20&apiKey=";

export const handler: Handler = async () => {
    if (!NEWS_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API key not configured on server." }),
        };
    }

    try {
        const response = await fetch(NEWS_URL + NEWS_API_KEY);

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Failed to fetch news from NewsAPI." }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=300", // cache por 5 minutos
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("[news function] Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error." }),
        };
    }
};
