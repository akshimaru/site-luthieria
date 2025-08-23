import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Image, 
  Star, 
  MessageSquare, 
  Upload,
  Menu,
  X,
  LogOut,
  Users,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, SiteConfig } from '../../lib/supabase'
import { AdminSettings } from './Settings'
import { AdminServices } from './Services'
import { AdminGallery } from './Gallery'
import { AdminTestimonials } from './Testimonials'
import { AdminContent } from './Content'
import { AdminMedia } from './Media'
import { AdminOverview } from './Overview'
import { AnalyticsDashboard } from './Analytics'
import adminToast from '../../lib/adminToast'
import { Toaster } from 'react-hot-toast'

export const AdminDashboard = () => {
  const { signOut, adminUser } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    fetchSiteConfig()
  }, [])

  const fetchSiteConfig = async () => {
    try {
      const { data } = await supabase
        .from('site_config')
        .select('*')
        .single()
      if (data) {
        setSiteConfig(data)
      }
    } catch (error) {
      console.error('Error fetching site config:', error)
    }
  }

  const navigation = [
    { name: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
    { name: 'Serviços', href: '/admin/services', icon: FileText },
    { name: 'Galeria', href: '/admin/gallery', icon: Image },
    { name: 'Depoimentos', href: '/admin/testimonials', icon: Star },
    { name: 'Conteúdo', href: '/admin/content', icon: MessageSquare },
    { name: 'Mídia', href: '/admin/media', icon: Upload },
  ]

  const handleSignOut = async () => {
    try {
      adminToast.logout.loading()
      await signOut()
      adminToast.logout.success()
    } catch (error) {
      console.error('Error signing out:', error)
      adminToast.logout.error()
    }
  }

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true
    if (path !== '/admin' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-amber-900">{siteConfig?.site_name || 'Prime Luthieria'}</h1>
                <p className="text-sm text-gray-600">Painel Admin</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t">
          {isSidebarOpen && adminUser && (
            <div className="mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-amber-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {adminUser.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {adminUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleSignOut}
            className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full ${
              !isSidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/services/*" element={<AdminServices />} />
            <Route path="/gallery/*" element={<AdminGallery />} />
            <Route path="/testimonials/*" element={<AdminTestimonials />} />
            <Route path="/content/*" element={<AdminContent />} />
            <Route path="/media/*" element={<AdminMedia />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
      </div>
    </>
  );
}