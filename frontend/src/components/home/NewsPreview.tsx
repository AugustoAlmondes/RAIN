import { motion } from "motion/react"
import { ExternalLink, Calendar, MapPin } from "lucide-react"
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
    <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto w-full relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border-custom pb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Últimas Notícias
          </h2>
          <p className="text-slate-400">
            Acompanhe os fatos recentes e alertas emitidos.
          </p>
        </div>
        <a href="/noticias" className="mt-4 md:mt-0 text-blue-400 hover:text-blue-300 font-medium inline-flex items-center transition-colors">
          Ver todas as notícias
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>

      <div className="flex flex-col items-center gap-6">
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full mt-10 h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            filteredNews(data, category, search)?.slice(0, 5).map((article: Article, index: number) => (
              <Card key={index} className=" w-full group border-border-custom bg-surface hover:border-slate-500 transition-all duration-300 hover:shadow-lg shadow-black/20">
                <CardContent className="p-6">

              {/* Topo */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
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
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors cursor-pointer">
                  {article.title}
                </h3>
              </a>

              {/* Descrição */}
              <p className="text-slate-400 line-clamp-2 md:line-clamp-none text-sm leading-relaxed mb-4">
                {article.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-custom">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Fonte: <span className="text-slate-300">{article.reference}</span>
                </span>

                <a href={article.url} target="_blank" className="text-blue-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center opacity-0 group-hover:opacity-100 cursor-pointer">
                  Ler matéria
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>

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
          onClick={() => {navigate("/noticias")}}
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
