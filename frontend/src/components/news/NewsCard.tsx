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
            <Card className="flex flex-col rounded bg-surface border-border-custom overflow-hidden w-full text-white">
                {article.image && (
                    <div className="relative aspect-video w-full">
                        <div className="absolute inset-0 z-10 bg-black/20" />
                        <img
                            src={article.image}
                            alt={article.title || "News image"}
                            className="relative z-0 h-full w-full object-cover"
                        />
                    </div>
                )}
                <CardHeader className="flex-1 pb-4 pt-6 px-6">
                    {article.source?.name && (
                        <CardAction>
                            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none rounded">
                                {article.source.name}
                            </Badge>
                        </CardAction>
                    )}
                    <div className="flex flex-col gap-1">
                        {article.publishedAt && (
                            <span className="text-xs text-white/50">{formatDate(article.publishedAt)}</span>
                        )}
                        <CardTitle className="text-xl line-clamp-2 leading-tight">{article.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-3 text-white/60 mt-2">
                        {article.description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="px-6 pb-6 pt-0">
                    <Button
                        className="w-full rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors hover:text-white cursor-pointer"
                        variant="outline"
                        onClick={() => window.open(article.url, "_blank")}
                    >
                        Ler mais
                        <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                    </Button>
                </CardFooter>
            </Card>
    );
}