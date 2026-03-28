import { lazy, Suspense } from 'react'
import {
  Route,
  Routes,
  BrowserRouter as Router
} from 'react-router-dom'
import Home from "./pages/Home"
import { Layout } from './Layout'
import News from './pages/News'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const MapPage = lazy(() => import('./pages/Map'))

const queryClient = new QueryClient();

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>

      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/noticias' element={<News />} />
          </Route>
          <Route path="mapa" element={
            <Suspense fallback={
              <div className="fixed inset-0 bg-bg flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            }>
              <MapPage />
            </Suspense>
          } />
        </Routes>
      </Router>
          </QueryClientProvider>
    </>
  )
}

export default App
