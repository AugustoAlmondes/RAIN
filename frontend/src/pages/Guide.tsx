import { Helmet } from 'react-helmet-async'
import { Waves, Mountain, Sun as SunIcon, ShieldCheck, Phone, Droplets, BookOpen, ExternalLink, ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CallToAction } from '@/components/layout/CallToAction'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Protocol = {
  id: string
  label: string
  icon: React.ElementType
  color: string
  borderColor: string
  bgColor: string
  textColor: string
  tag: string
  phases: {
    title: string
    items: string[]
  }[]
}

const protocols: Protocol[] = [
  {
    id: 'floods',
    label: 'Enchentes',
    icon: Waves,
    color: 'bg-blue-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    textColor: 'text-blue-400',
    tag: 'INUNDAÇÃO',
    phases: [
      {
        title: 'Antes',
        items: [
          'Mantenha calhas, bueiros e ralos desobstruídos',
          'Guarde documentos e objetos de valor em sacos plásticos lacrados',
          'Identifique as rotas de fuga mais seguras do seu bairro',
          'Tenha um kit de emergência pronto com suprimentos para 72h',
        ]
      },
      {
        title: 'Durante',
        items: [
          'Desligue imediatamente o disjuntor geral da rede elétrica',
          'Não atravesse ruas alagadas — 15 cm de água em movimento derruba um adulto',
          'Vá para pontos elevados; evite subsolos, garagens e viadutos',
          'Ouça apenas informações oficiais (Defesa Civil, rádio local)',
        ]
      },
      {
        title: 'Depois',
        items: [
          'Só retorne ao imóvel após liberação oficial',
          'Use luvas e botas ao manusear objetos molhados',
          'Cuidado com cobras e animais peçonhentos deslocados pela água',
          'Lave e desinfete tudo que teve contato com a água da enchente',
        ]
      }
    ]
  },
  {
    id: 'landslides',
    label: 'Deslizamentos',
    icon: Mountain,
    color: 'bg-amber-500',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
    textColor: 'text-amber-400',
    tag: 'DESLIZAMENTO',
    phases: [
      {
        title: 'Sinais de Alerta',
        items: [
          'Rachaduras ou fissuras em paredes, muros e no solo',
          'Inclinação anormal de árvores, postes ou muros',
          'Água barrenta, escura ou turva descendo a encosta',
          'Ruídos subterrâneos estranhos ou tremores no solo',
        ]
      },
      {
        title: 'Ação Imediata',
        items: [
          'Abandone o imóvel imediatamente ao identificar os sinais',
          'Leve apenas documentos e o kit de emergência — nada mais',
          'Não se abrigue sob árvores, taludes ou encostas',
          'Ligue para a Defesa Civil (199) e alerte vizinhos',
        ]
      },
      {
        title: 'Prevenção',
        items: [
          'Não construa em áreas de encosta sem licença e projeto técnico',
          'Evite desmatamento e remoção da vegetação em morros',
          'Não jogue lixo ou entulho em áreas de encosta',
          'Consulte o plano diretor e mapas de risco da sua cidade',
        ]
      }
    ]
  },
  {
    id: 'drought',
    label: 'Secas Severas',
    icon: SunIcon,
    color: 'bg-orange-500',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/5',
    textColor: 'text-orange-400',
    tag: 'SECA',
    phases: [
      {
        title: 'Saúde e Hidratação',
        items: [
          'Beba pelo menos 2 litros de água por dia, mesmo sem sede',
          'Evite exposição ao sol das 10h às 16h',
          'Use roupas leves, preferindo cores claras',
          'Verifique idosos e crianças frequentemente — são mais vulneráveis',
        ]
      },
      {
        title: 'Prevenção de Incêndios',
        items: [
          'É proibido fazer queimadas — o risco de incêndio florestal é extremo',
          'Não jogue bitucas de cigarro em áreas abertas',
          'Mantenha vegetação aparada próxima a residências',
          'Tenha extintor de incêndio em casa e no carro',
        ]
      },
      {
        title: 'Uso Consciente da Água',
        items: [
          'Reduza banhos para no máximo 5 minutos',
          'Reutilize água da máquina de lavar para outros fins',
          'Cubra reservatórios e caixas d\'água para evitar evaporação',
          'Reporte vazamentos e desperdícios ao serviço de água local',
        ]
      }
    ]
  }
]

const kitItems = [
  { label: 'Água potável', detail: '4L por pessoa (2 dias)', icon: Droplets },
  { label: 'Alimentos não-perecíveis', detail: 'Para 72 horas', icon: BookOpen },
  { label: 'Kit de primeiros socorros', detail: 'Curativos, antisséptico', icon: ShieldCheck },
  { label: 'Lanterna e pilhas', detail: 'Com reserva extra', icon: null },
  { label: 'Documentos pessoais', detail: 'Em sacos plásticos', icon: null },
  { label: 'Rádio a pilha', detail: 'Para alertas oficiais', icon: null },
  { label: 'Medicamentos', detail: 'Uso contínuo + básicos', icon: null },
  { label: 'Roupas e agasalho', detail: 'Kit por 3 dias', icon: null },
  { label: 'Dinheiro em espécie', detail: 'Caixas eletrônicos podem falhar', icon: null },
  { label: 'Canivete ou multitools', detail: 'Ferramenta de sobrevivência', icon: null },
]

const riskLevels = [
  { level: 'Observação', color: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/20', desc: 'Condições normais. Acompanhe a previsão do tempo regularmente.' },
  { level: 'Atenção', color: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-400/20', desc: 'Possibilidade de chuva ou evento. Prepare seu kit e fique atento.' },
  { level: 'Alerta', color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/20', desc: 'Alta chance de evento severo. Tome precauções e evite áreas de risco.' },
  { level: 'Alerta Máximo', color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/20', desc: 'Desastre iminente ou em curso. Evacue imediatamente se em área de risco.' },
]

const cardBase = 'rounded border border-white/10 bg-white/4'

export default function Guide() {
  const [activeProtocol, setActiveProtocol] = useState<string>('floods')
  const [checkedItems, setCheckedItems] = useState<number[]>([])

  const current = protocols.find(p => p.id === activeProtocol)!

  const toggleKitItem = (idx: number) => {
    setCheckedItems(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])
  }

  return (
    <>
      <Helmet>
        <title>RAIN - Guia de Prevenção</title>
        <meta name="description" content="Protocolos de emergência, checklist do kit de emergência, central de contatos e glossário de alertas para desastres naturais." />
      </Helmet>

      <main className="min-h-screen bg-background-primary text-white">

        {/* Hero */}
        <section className="relative pt-24 pb-14 px-6 overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />
          <div className="relative max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-blue-500/60" />
              <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Guia de Prevenção</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              Informação que<br />
              <span className="text-blue-300">salva vidas.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl leading-relaxed font-light">
              Protocolos de emergência, kit de sobrevivência e contatos essenciais — tudo que você precisa saber antes que seja necessário.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-20 space-y-16 lg:space-y-20">

          {/* ── Protocolos de Emergência ── */}
          <section>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-1">Protocolos de Emergência</h2>
              <p className="text-white/60 text-sm">Selecione o tipo de desastre para ver as instruções detalhadas.</p>
            </div>

            {/* Tab selector */}
            <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/4 border border-white/10 rounded w-full sm:w-fit" role="tablist" aria-label="Tipos de desastres">
              {protocols.map(p => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={activeProtocol === p.id}
                  aria-controls={`panel-${p.id}`}
                  id={`tab-${p.id}`}
                  onClick={() => setActiveProtocol(p.id)}
                  className={`flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-2 min-h-[44px] rounded text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                    ${activeProtocol === p.id
                      ? 'bg-blue-500/15 border border-blue-400/30 text-blue-100 shadow-sm'
                      : 'text-white/70 hover:text-white/90 hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <p.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {p.label}
                </button>
              ))}
            </div>

            {/* Protocol content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                id={`panel-${current.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${current.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header */}
                <div className={`flex items-center gap-4 p-5 rounded border ${current.borderColor} ${current.bgColor} mb-6`}>
                  <div className={`p-2.5 rounded border ${current.borderColor}`}>
                    <current.icon className={`w-5 h-5 ${current.textColor}`} aria-hidden="true" />
                  </div>
                  <div>
                    <Badge variant="secondary" className={`${current.bgColor} border ${current.borderColor} ${current.textColor} text-xs font-mono rounded mb-1`}>
                      {current.tag}
                    </Badge>
                    <p className="text-white/70 text-sm">
                      {current.phases.length} fases · {current.phases.reduce((a, p) => a + p.items.length, 0)} orientações
                    </p>
                  </div>
                </div>

                {/* Phases grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {current.phases.map((phase, phaseIdx) => (
                    <div
                      key={phase.title}
                      className={`${cardBase} p-6`}
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-4">
                        <span className={`text-xs font-mono ${current.textColor} opacity-60`} aria-hidden="true">0{phaseIdx + 1}</span>
                        <h3 className="text-sm font-semibold text-white">{phase.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {phase.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-white/75 leading-7">
                            <div className={`w-1.5 h-1.5 rounded mt-2.5 shrink-0 ${current.color} opacity-80`} aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          {/* ── Checklist ── */}
          <section>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight mb-1">Kit de Emergência</h2>
              <p className="text-white/60 text-sm">Itens essenciais para se manter preparado para 72 horas autônomas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kitItems.map((item, idx) => {
                const isChecked = checkedItems.includes(idx)
                return (
                  <button
                    key={idx}
                    onClick={() => toggleKitItem(idx)}
                    className={`w-full flex items-center justify-between min-h-[44px] gap-4 px-5 py-4 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 group ${cardBase} ${isChecked ? 'bg-white/8' : 'hover:bg-white/6'}`}
                  >
                    <div>
                      <p className={`text-sm font-medium transition-colors ${isChecked ? 'text-white/55 line-through' : 'text-white/80'}`}>{item.label}</p>
                      <p className={`text-xs mt-0.5 transition-colors ${isChecked ? 'text-white/40' : 'text-white/60'}`}>{item.detail}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-white/20 bg-white/5'}`} aria-hidden="true">
                      {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <p className="text-xs text-white/55 mt-5 font-mono">
              RECOMENDAÇÃO: Verifique e renove o kit a cada 6 meses
            </p>
          </section>

          {/* ── Two-col Section: Contatos + Glossário ── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Contatos */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Central de Contatos</h2>
                <p className="text-white/60 text-sm">Funcionam 24h, inclusive sem crédito no celular.</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { num: '199', name: 'Defesa Civil', role: 'Resgates e desastres', iconColor: 'text-red-400' },
                  { num: '193', name: 'Corpo de Bombeiros', role: 'Incêndios e salvamento', iconColor: 'text-amber-400' },
                  { num: '192', name: 'SAMU', role: 'Emergências médicas', iconColor: 'text-blue-400' },
                  { num: '190', name: 'Polícia Militar', role: 'Segurança e ordem pública', iconColor: 'text-slate-400' },
                ].map((contact, i) => (
                  <div key={contact.num} className={`flex items-center justify-between px-5 py-4 ${cardBase} ${i !== 0 ? 'bg-white/2' : ''}`}>
                    <div>
                      <p className={`text-xl font-bold font-mono tabular-nums ${contact.iconColor} mb-1`}>{contact.num}</p>
                      <p className="text-sm font-medium text-white/80">{contact.name}</p>
                      <p className="text-xs text-white/55 mt-0.5">{contact.role}</p>
                    </div>
                    <Phone className="w-5 h-5 text-white/40 shrink-0" aria-hidden="true" />
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-2">
                <p className="text-xs font-mono text-white/55 uppercase tracking-wider mb-4 px-3">Links Oficiais</p>
                {[
                  { label: 'Defesa Civil Nacional', href: 'https://www.gov.br/mdr/pt-br/assuntos/protecao-e-defesa-civil' },
                  { label: 'INMET — Alertas Meteorológicos', href: 'https://inmet.gov.br/' },
                  { label: 'CEMADEN — Mapa de Riscos', href: 'https://www.cemaden.gov.br/' },
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${link.label} (abre em nova aba)`}
                    className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded text-sm text-blue-400/80 hover:text-blue-400 hover:bg-white/5 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 shrink-0" aria-hidden="true" />
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Glossário */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Glossário de Alertas</h2>
                <p className="text-white/60 text-sm">O que cada nível de risco significa e como agir.</p>
              </div>

              <div className="space-y-3">
                {riskLevels.map((r) => (
                  <div key={r.level} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-5 ${cardBase}`}>
                    <div className="flex items-center gap-3 shrink-0 sm:w-36">
                      <div className={`w-2 h-2 rounded-full ${r.color} shrink-0`} aria-hidden="true" />
                      <span className={`text-sm font-semibold ${r.text}`}>{r.level}</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>

              {/* Risk index */}
              <div className={`mt-6 p-5 ${cardBase}`}>
                <p className="text-xs font-mono text-white/55 uppercase tracking-wider mb-4">Escala Visual de Risco</p>
                <div className="flex items-center gap-1 h-3 rounded-sm overflow-hidden border border-white/10">
                  <div className="flex-1 bg-green-500 h-full" />
                  <div className="flex-1 bg-yellow-400 h-full" />
                  <div className="flex-1 bg-orange-500 h-full" />
                  <div className="flex-1 bg-red-500 h-full" />
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-white/55 font-mono font-medium">Seguro</span>
                  <span className="text-xs text-white/55 font-mono font-medium">Crítico</span>
                </div>
              </div>
            </div>

          </section>
        </div>

        <CallToAction current="guia" />
      </main>
    </>
  )
}
