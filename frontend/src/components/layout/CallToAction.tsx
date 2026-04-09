import { Link } from 'react-router-dom'
import { BrainCircuit, Map, BookOpen, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PageType = 'home' | 'analise' | 'mapa' | 'noticias' | 'guia'

interface CallToActionProps {
  current: PageType
}

export function CallToAction({ current }: CallToActionProps) {
  const allCards = [
    {
      id: 'analise',
      title: 'Visão de IA',
      description: 'Saiba o nível de risco exato para a sua cidade com nossa Inteligência Artificial.',
      icon: BrainCircuit,
      href: '/analise',
      iconStyle: 'bg-blue-500/10 text-blue-400'
    },
    {
      id: 'mapa',
      title: 'Mapa Interativo',
      description: 'Observe as nuvens de chuva em tempo real e verifique áreas de risco.',
      icon: Map,
      href: '/mapa',
      iconStyle: 'bg-indigo-500/10 text-indigo-400'
    },
    {
      id: 'guia',
      title: 'Guia de Prevenção',
      description: 'Descubra como se preparar e proteger sua família de desastres climáticos.',
      icon: BookOpen,
      href: '/guia',
      iconStyle: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'noticias',
      title: 'Últimas Notícias',
      description: 'Mantenha-se informado sobre os eventos climáticos mais recentes.',
      icon: Newspaper,
      href: '/noticias',
      iconStyle: 'bg-orange-500/10 text-orange-400'
    }
  ]

  // Filter out the current page
  let visibleCards = allCards.filter(c => c.id !== current)
  // Ensure "mapa" is always one of the suggestions if we are not on the map page
  if (current !== 'mapa') {
      const mapaCardIndex = visibleCards.findIndex(c => c.id === 'mapa')
      if (mapaCardIndex > -1) {
          const mapaCard = visibleCards.splice(mapaCardIndex, 1)[0]
          visibleCards.unshift(mapaCard)
      }
  }
  
  // Pick the top 2
  visibleCards = visibleCards.slice(0, 2)

  return (
    <section className="py-16 md:py-24 border-t bg-background-primary border-white/5 relative z-20 flex justify-center w-full mt-auto">
      <div className="max-w-5xl w-full px-6 md:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-3">Explore mais recursos</h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Aprofunde-se nos recursos do sistema para ficar sempre atualizado e preparado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleCards.map(card => {
            const Icon = card.icon
            return (
              <div key={card.id} className="bg-surface/30 border border-white/5 hover:border-white/10 transition-colors p-8 rounded flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-6 ${card.iconStyle}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{card.title}</h3>
                <p className="text-white/60 text-sm mb-8 grow">{card.description}</p>
                <Link to={card.href} className="w-full">
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white hover:text-white transition-colors cursor-pointer bg-transparent">
                    Acessar {card.title}
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
