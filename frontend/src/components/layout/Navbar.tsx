import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, Newspaper, BrainCircuit, BookOpen, Sun, Globe, Map } from 'lucide-react'
import { Button } from '../ui/button'

const links = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/noticias', label: 'Notícias', icon: Newspaper },
  { to: '/analise', label: 'Análise IA', icon: BrainCircuit },
  { to: '/guia', label: 'Guia', icon: BookOpen },
]

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-32 pointer-events-none"
    >
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />

      {/* Conteúdo real da navbar — restaura pointer-events aqui */}
      <div className="relative h-16 flex items-center justify-start px-6 md:px-12 pointer-events-auto">
        <div className="flex items-center justify-between w-full px-40 gap-6 ml-auto md:ml-0">
          <div className="flex items-center gap-2">
            {links.map(({ to, label }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                `}
                >
                  <span className="hidden text-md font-extralight md:inline">{label}</span>
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                navigate("/mapa")
              }}
              className="bg-transparent border px-5 border-white/40 text-white hover:bg-white/10 cursor-pointer ">
              <Map />
              MAPA
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
