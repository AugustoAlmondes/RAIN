import { Link } from 'react-router-dom'
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhone,
  FaCloudShowersHeavy
} from 'react-icons/fa'
import { 
  ArrowUpRight
} from 'lucide-react'

const footerLinks = {
  navigation: [
    { name: 'Início', href: '/' },
    { name: 'Mapa de Riscos', href: '/mapa' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Análise IA', href: '/analise' },
    { name: 'Guia de Segurança', href: '/guia' },
  ],
  support: [
    { name: 'Sobre o Projeto', href: '#' },
    { name: 'Termos de Uso', href: '#' },
    { name: 'Privacidade', href: '#' },
    { name: 'Contato', href: '#' },
  ],
  social: [
    { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/augusto_almondes/' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/augusto-almondes/' },
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com/AugustoAlmondes' },
  ]
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-bg pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30 group-hover:border-blue-500/60 transition-colors">
                <FaCloudShowersHeavy className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                RAIN
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Monitoramento meteorológico em tempo real e análise de riscos climáticos com inteligência artificial para sua segurança.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-6">Navegação</h3>
            <ul className="space-y-4">
              {footerLinks.navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-1 group"
                  >
                    {item.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Fale Conosco</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Picos, Piauí</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FaEnvelope className="w-5 h-5 text-blue-500 shrink-0" />
                <span>almondesaugusto@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <FaPhone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>(89) 9 8808-3671</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {currentYear} RAIN - Sistema de Alerta e Monitoramento Climático. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sistemas Operantes
            </span>
          </div>
        </div>
      </div>

      {/* Aesthetic Gradients */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-blue-500/5 to-transparent pointer-events-none" />
    </footer>
  )
}
