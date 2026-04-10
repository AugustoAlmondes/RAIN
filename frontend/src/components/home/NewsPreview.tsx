import { motion } from "motion/react"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNewStore } from "@/store/newsStore"
import { useNews } from "@/hooks/useNews"
import { filteredNews, formatDate, detectCategory } from "@/utils/newsManager"
import type { Article } from "@/services/newsService"
import { Card, CardContent } from "../ui/card"
import { useNavigate } from "react-router-dom"

export function NewsPreview() {

  const { data, isLoading } = useNews();
  const { category, search } = useNewStore();
  const navigate = useNavigate();

  return (
    <section className="py-24 md:px-12 w-full bg-radial from-bg to-gradient-text-secondary/20 relative">

      <div className="mx-auto w-full max-w-4xl flex flex-col items-center gap-3">
      <div className="flex flex-col w-full md:flex-row md:items-end justify-between">
        <div className="w-full">
          <h2 className="text-3xl px-5 w-full md:text-4xl font-medium font-mono tracking-tight text-white mb-2">
            Últimas Notícias
          </h2>
        </div>
      </div>
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded mt-10 h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {filteredNews(data, category, search)?.slice(0, 3).map((article: Article, index: number) => (
                <Card
                  key={index}
                  className="w-full group border border-white/5 rounded bg-surface/20 hover:bg-surface/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-black/40 hover:border-white/10 overflow-hidden relative"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                          {article.category || detectCategory(article.title)}
                        </Badge>
                      </div>

                      <div className="flex items-center text-xs text-slate-500 font-mono bg-black/20 px-3 py-1.5 rounded border border-white/5">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-blue-400/70" />
                        {formatDate(article.publishedAt)}
                      </div>
                    </div>

                    {/* Título */}
                    <a href={article.url} target="_blank" className="block relative z-10 w-fit">
                      <h3 className="text-xl font-semibold text-white/90 group-hover:text-blue-400 transition-colors duration-300 tracking-tight leading-snug">
                        {article.title}
                      </h3>
                    </a>

                    <p className="text-slate-400 font-medium line-clamp-2 mt-3 md:line-clamp-none text-sm leading-relaxed max-w-3xl">
                      {article.description}
                    </p>

                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          whileHover={{ scale: 1.01 }}
          className='relative px-30 py-3 text-white/40 font-medium rounded-md overflow-hidden transition-all cursor-pointer active:scale-95 group max-w-100 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:text-white mt-5'
          // @ts-ignore
          onClick={() => { navigate("/noticias") }}
        >
          Ver mais notícias
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-black via-blue-500 to-black translate-y-px group-hover:translate-y-0 transition-transform"></div>
        </motion.button>

      </div>

      {/* Decorative blurry spot below */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  )
}
