import NewsCard from "@/components/news/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNews } from "@/hooks/useNews"
import type { Article } from "@/services/newsService";
import { useNewStore } from "@/store/newsStore";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import { detectCategory, filteredNews, formatDate } from "@/utils/newsManager";

export default function News() {
    const { data, isLoading } = useNews();
    const { category, search } = useNewStore();
    const [lastNews, setLastNews] = useState<Article | null>(null);

    useEffect(() => {
        if (data && data.length > 0) {
            setLastNews(data[0]);
        }
    }, [data]);



    if (isLoading) return (<div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-lg">Carregando notícias...</div>)

    return (
        <section className="min-h-screen bg-background-primary flex flex-col pb-20">
            {lastNews && (
                <div className="relative w-full h-[60vh] min-h-[400px]">
                    {lastNews.image && (
                        <div
                            className="absolute inset-0 bg-no-repeat bg-cover bg-center"
                            style={{ backgroundImage: `url(${lastNews.image})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background-primary via-background-primary/60 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 w-full">
                        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {lastNews.title &&
                                    <Badge variant="secondary" className="bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-500/30 rounded">{detectCategory(lastNews.title).toUpperCase()}</Badge>
                                }
                                {lastNews.source?.name &&
                                    <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none rounded">{lastNews.source.name}</Badge>
                                }
                                {lastNews.publishedAt && !lastNews.source?.name &&
                                    <Badge variant="secondary" className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border border-blue-500/30 rounded">{formatDate(lastNews.publishedAt)}</Badge>
                                }
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl tracking-tight leading-tight">
                                {lastNews.title}
                            </h1>
                            {lastNews.description && (
                                <p className="text-base md:text-lg text-white/70 max-w-3xl line-clamp-2 md:line-clamp-3 mt-2">
                                    {lastNews.description}
                                </p>
                            )}
                            <div className="mt-8">
                                <Button
                                    onClick={() => window.open(lastNews.url, "_blank")}
                                    className="bg-gradient-text-primary text-white hover:bg-white/90 rounded px-6 py-5 text-base transition-colors cursor-pointer hover:text-black"
                                >
                                    Ler notícia completa
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-12 md:mt-20">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/20">
                    <h2 className="text-2xl font-semibold text-white">Últimas notícias</h2>
                    {filteredNews(data, category, search)?.length > 0 && (
                        <span className="text-sm text-white/50">{filteredNews(data, category, search)?.length} resultados</span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews(data, category, search)?.map((item: Article, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex"
                        >
                            <NewsCard article={item} />
                        </motion.div>
                    ))}
                </div>

                {filteredNews?.length === 0 && (
                    <div className="text-center py-20 text-white/50 border border-white/5 rounded">
                        Nenhuma notícia encontrada para esta categoria ou busca.
                    </div>
                )}
            </div>
        </section>
    )
}