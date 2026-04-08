import { motion, AnimatePresence } from 'motion/react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react'
import { CitySearchBar } from '@/components/analysis/CitySearchBar'
import { AnalysisLoading } from '@/components/analysis/AnalysisLoading'
import { RiskReport } from '@/components/analysis/RiskReport'
import { AnalysisHistory } from '@/components/analysis/AnalysisHistory'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useLocationStore } from '@/store/locationStore'
import Spotlight from '@/components/map/Spotlight'

export default function Analysis() {
  const {
    loading,
    error,
    result,
    city,
    location,
    step,
    analyze,
    history,
    clearHistory
  } = useAnalysis()

  const navigate = useNavigate()
  const setSearchLocation = useLocationStore(state => state.setSearchLocation)

  const handleViewOnMap = () => {
    if (location) {
      setSearchLocation(location)
      navigate('/mapa')
    }
  }

  return (
    <>
      <Helmet>
        <title>RAIN - Análise de Risco com IA</title>
        <meta name="description" content="Análise avançada de risco climático em tempo real. Descubra os riscos de enchentes, deslizamentos e secas em qualquer cidade do mundo através de algoritmos de processamento de dados do AlertaClima. Além disso, receba recomendações personalizadas para se proteger e proteger sua comunidade." />
        <link rel="canonical" href="https://rain-weather-forecast.netlify.app/analise" />
      </Helmet>

      <main className="relative min-h-screen bg-black text-foreground pt-32 pb-20 px-4 flex flex-col items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full animate-pulse" />
        </div>

        <div className="w-full max-w-4xl relative z-10 space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 mt-20"
            >
              <h1 className="text-5xl md:text-5xl font-medium text-white tracking-tight leading-tight">
                Análise Detalhada de
                <span className="bg-linear-to-r from-gradient-text-primary to-[#6ba3d6] bg-clip-text text-transparent"> Risco Climático</span>
              </h1>
              <p className="text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
                Insira o nome de uma cidade para receber um relatório instantâneo sobre riscos de desastres naturais baseados em dados meteorológicos de alta precisão.
              </p>
            </motion.div>
          </section>

          {/* Search Section */}
          <section className="space-y-8">
            <CitySearchBar onSearch={analyze} isLoading={loading} />

            <AnimatePresence>
              {!loading && !result && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="py-4"
                >
                  <AnalysisHistory
                    history={history}
                    onHistoryClick={analyze}
                    onClear={clearHistory}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Results Section */}
          <section className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {loading && step !== 'idle' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnalysisLoading step={step} city={city} />
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Ocorreu um erro</h3>
                    <p className="text-slate-400 max-w-md mx-auto">{error}</p>
                  </div>
                  <button
                    onClick={() => city && analyze(city)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all mx-auto cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Tentar novamente</span>
                  </button>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center justify-between px-2 mb-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-mono">
                      Relatório de Análise
                    </h3>
                  </div>
                  <RiskReport
                    data={result}
                    city={city || ""}
                    location={location}
                    onViewOnMap={handleViewOnMap}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <Spotlight />
      </main>
    </>
  )
}
