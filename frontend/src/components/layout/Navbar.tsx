import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Home, Newspaper, BrainCircuit, BookOpen, Map } from 'lucide-react'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'

const links = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/analise', label: 'AI Análise', icon: BrainCircuit },
  { to: '/noticias', label: 'Notícias', icon: Newspaper },
  { to: '/guia', label: 'Guia', icon: BookOpen },
]

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none font-mono"
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-500 ease-in-out pointer-events-auto
          ${isScrolled ? 'h-16 bg-black/50 backdrop-blur-md' : 'h-24 bg-transparent'}
        `}
      >
        <div className="flex items-center justify-between w-full max-w-7xl px-6 md:px-12 gap-8">
          <div className="relative w-40 flex items-center h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={isScrolled ? 'logo-scrolled' : 'logo-full'}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 0.6, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                src={isScrolled ? '/logo_one.svg' : '/logo2.svg'}
                alt="logo"
                onClick={() => navigate('/')}
                className={`cursor-pointer transition-all ${isScrolled ? 'w-5 h-5 md:h-8 md:w-8' : 'w-32 h-8'}`}
              />
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 md:gap-4 bg-white/5 backdrop-blur-sm rounded p-1 border border-white/10 relative">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors duration-300 group
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}
                  `}
                >
                  {isActive && (
                    <motion.span
                      // layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/20 rounded z-0"
                      // transition={springTransition}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <AnimatePresence mode="wait">
                      {isScrolled ? (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon size={18} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="label"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center"
                        >
                          <Icon size={18} className="block md:hidden" />
                          <span className="hidden md:block">{label}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Action Button */}
          <div className="flex items-center justify-end w-auto md:w-40">
            <Button
              onClick={() => navigate('/mapa')}
              className={`group overflow-hidden rounded transition-all duration-500 ease-in-out border border-white/30
                ${isScrolled ? 'w-11 h-11 p-0 justify-center bg-white/10' : 'w-11 md:w-44 px-0 md:px-6 justify-center md:justify-start h-11 bg-white/5'}
                hover:bg-white/20 hover:border-white/60 text-white cursor-pointer
              `}
            >
              <motion.div layout className="flex items-center md:gap-3">
                <Map size={18} className="shrink-0" />
                <AnimatePresence>
                  {!isScrolled && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, x: 10 }}
                      animate={{ opacity: 1, width: 'auto', x: 0 }}
                      exit={{ opacity: 0, width: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="hidden md:block whitespace-nowrap font-mono text-xs tracking-wider"
                    >
                      IR AO MAPA
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
