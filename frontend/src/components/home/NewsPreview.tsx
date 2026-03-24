import { motion } from "motion/react"
import { ExternalLink, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const newsItems = [
  {
    title: "Alerta Vermelho para Tempestades Válido até Sexta-Feira",
    description: "Defesa civil emite comunicado urgente devido ao volume esperado de mais de 100mm nas próximas 24 horas. Famílias em áreas de risco devem evacuar.",
    reference: "G1 Natureza",
    date: "10 Jan 2026",
    subject: "Enchente",
    region: "Sul",
    url: "#"
  },
  {
    title: "Risco Alto de Deslizamentos em Encostas Urbanas",
    description: "Após três dias de chuvas contínuas, o solo encontra-se saturado. Especialistas recomendam atenção máxima aos sinais nas moradias irregulares.",
    reference: "Agência Brasil",
    date: "09 Jan 2026",
    subject: "Deslizamento",
    region: "Sudeste",
    url: "#"
  },
  {
    title: "Nível dos Rios Ultrapassa Cota de Inundação",
    description: "Principal bacia hidrográfica da região atinge marca histórica, forçando a interdição de pontes e rodovias federais.",
    reference: "Defesa Civil",
    date: "08 Jan 2026",
    subject: "Alagamento",
    region: "Norte",
    url: "#"
  },
  {
    title: "Ciclone Extratropical Aproxima-se da Costa",
    description: "Ventos podem passar de 90 km/h, trazendo rajadas e ressaca no litoral. Recomenda-se evitar navegação e atividades marítimas.",
    reference: "INMET",
    date: "07 Jan 2026",
    subject: "Ciclone",
    region: "Sul",
    url: "#"
  },
  {
    title: "Seca Severa Compromete Abastecimento e Agricultura",
    description: "Falta de chuvas atinge seu terceiro mês, forçando racionamento preventivo de água nos municípios do interior e afetando colheitas.",
    reference: "ANA",
    date: "05 Jan 2026",
    subject: "Seca",
    region: "Nordeste",
    url: "#"
  }
]

export function NewsPreview() {
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

      <div className="flex flex-col gap-6">
        {newsItems.map((news, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative"
          >
            <a href={news.url} className="block bg-surface border border-border-custom hover:border-slate-500 rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-black/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                    {news.subject}
                  </Badge>
                  <div className="flex items-center text-xs text-slate-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    {news.region}
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-slate-500 font-mono">
                  <Calendar className="w-3 h-3 mr-1" />
                  {news.date}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {news.title}
              </h3>
              
              <p className="text-slate-400 line-clamp-2 md:line-clamp-none text-sm leading-relaxed mb-4">
                {news.description}
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-custom">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Fonte: <span className="text-slate-300">{news.reference}</span>
                </span>
                <span className="text-blue-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center opacity-0 group-hover:opacity-100">
                  Ler matéria
                  <ExternalLink className="w-4 h-4 ml-1" />
                </span>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
      
      {/* Decorative blurry spot below */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  )
}
