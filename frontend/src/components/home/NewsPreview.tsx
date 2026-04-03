import { motion } from "motion/react"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNewStore } from "@/store/newsStore"
import { useNews } from "@/hooks/useNews"
import { filteredNews, formatDate } from "@/utils/newsManager"
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
          <h2 className="text-3xl w-full md:text-4xl font-medium font-mono tracking-tight text-white mb-2">
            Últimas Notícias
          </h2>
        </div>
      </div>
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full mt-10 h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            filteredNews(data, category, search)?.slice(0, 5).map((article: Article, index: number) => (
              <Card
                key={index}
                className="w-full max-w-4xl group border-border-custom rounded-none border-y bg-transparent hover:border-slate-500 transition-all pb-0 pt-2 duration-300 hover:shadow-lg shadow-black/20"
              >
                <CardContent className="p-none">

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 mb-2">
                        {article.category}
                      </Badge>
                    </div>

                    <div className="flex items-center text-xs text-slate-500 font-mono">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>

                  {/* Título */}
                  <a href={article.url} target="_blank">
                    <h3 className="text-lg font-bold text-white  group-hover:text-blue-400 transition-colors cursor-pointer">
                      {article.title}
                    </h3>
                  </a>

                  <p className="text-slate-400 font-mono line-clamp-2 md:line-clamp-none text-sm leading-relaxed mb-4">
                    {article.description}
                  </p>

                  {/* <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-custom">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Fonte: <span className="text-slate-300">{article.reference}</span>
                    </span>

                    <a href={article.url} target="_blank" className="text-blue-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center opacity-0 group-hover:opacity-100 cursor-pointer">
                      Ler matéria
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div> */}

                </CardContent>
              </Card>)
            ))}

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
