import type { Article } from "@/services/newsService";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export default function NewsCard({ article }: { article: Article }) {
    function formatDate(dateString?: string) {
        if (!dateString) return "";
        const d = new Date(dateString);
        return d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    return (
            <Card className="flex flex-col rounded bg-surface/30 backdrop-blur-xl border border-white/10 overflow-hidden w-full text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                {article.image && (
                    <div className="relative aspect-video w-full overflow-hidden">
                        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        <img
                            src={article.image}
                            alt={article.title || "News image"}
                            className="relative z-0 h-full w-full object-cover transition-transform duration-700 ease-out"
                        />
                    </div>
                )}
                <CardHeader className="flex-1 pb-4 pt-6 px-6 relative z-20">
                    {article.source?.name && (
                        <CardAction className="mb-2">
                            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none rounded backdrop-blur-md">
                                {article.source.name}
                            </Badge>
                        </CardAction>
                    )}
                    <div className="flex flex-col gap-1.5">
                        {article.publishedAt && (
                            <span className="text-xs text-blue-400 font-mono tracking-wide">{formatDate(article.publishedAt)}</span>
                        )}
                        <CardTitle className="text-xl line-clamp-2 leading-snug font-semibold text-white/90 group-hover:text-white transition-colors">{article.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3 text-slate-400 mt-2 text-sm leading-relaxed">
                        {article.description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="px-6 pb-6 pt-0">
                    <Button
                        className="w-full rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-300 hover:text-white hover:border-white/20 cursor-pointer shadow-lg shadow-black/20"
                        variant="outline"
                        onClick={() => window.open(article.url, "_blank")}
                    >
                        Ler relato
                        <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardFooter>
            </Card>
    );
}