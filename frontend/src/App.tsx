import { lazy, Suspense } from 'react'
import {
  Route,
  Routes,
  BrowserRouter as Router
} from 'react-router-dom'
import Home from "./pages/Home"
import { Layout } from './Layout'

const MapPage = lazy(() => import('./pages/Map'))

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
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
    </>
  )
}

export default App
