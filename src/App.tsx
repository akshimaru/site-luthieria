import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import { Layout } from './components/Layout'
import { AnalyticsProvider } from './components/AnalyticsProvider'
import { Home } from './pages/Home'
import { Services } from './pages/Services'
import { Gallery } from './pages/Gallery'
import { Testimonials } from './pages/Testimonials'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { AdminLogin } from './pages/admin/Login'
import { AdminDashboard } from './pages/admin/Dashboard'
import { AdminRoute } from './components/AdminRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/servicos" element={<Services />} />
                    <Route path="/servicos/:slug" element={<Services />} />
                    <Route path="/galeria" element={<Gallery />} />
                    <Route path="/depoimentos" element={<Testimonials />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/contato" element={<Contact />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </AnalyticsProvider>
      </Router>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: '#10b981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: 'white',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              color: 'white',
            },
          },
        }}
      />
    </AuthProvider>
  )
}

export default App