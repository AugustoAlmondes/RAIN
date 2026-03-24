import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Map, Home, Newspaper, BrainCircuit, BookOpen } from 'lucide-react'

const links = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/noticias', label: 'Notícias', icon: Newspaper },
  { to: '/analise', label: 'Análise IA', icon: BrainCircuit },
  { to: '/guia', label: 'Guia', icon: BookOpen },
]

export function Navbar() {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl flex items-center justify-center px-6 md:px-12"
    >

      <div className="flex items-center gap-1 ml-auto md:ml-0">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'text-white bg-white/8'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'} transition-colors`} />
              <span className="hidden md:inline">{label}</span>
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-linear-to-r from-blue-500 to-cyan-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
