import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone, Mail, Menu, X } from 'lucide-react'
import { supabase, SiteConfig } from '../lib/supabase'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const location = useLocation()

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
    { name: 'Início', href: '/' },
    { name: 'Serviços', href: '/servicos' },
    { name: 'Galeria', href: '/galeria' },
    { name: 'Depoimentos', href: '/depoimentos' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ]

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-amber-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              {siteConfig?.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{siteConfig.phone}</span>
                </div>
              )}
              {siteConfig?.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{siteConfig.email}</span>
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              {siteConfig?.business_hours?.seg_sex && (
                <span>Seg-Sex: {siteConfig.business_hours.seg_sex}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-amber-900">
              {siteConfig?.site_name || 'Prime Luthieria'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-amber-900 border-b-2 border-amber-900'
                    : 'text-gray-700 hover:text-amber-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-amber-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-amber-900 bg-amber-50'
                      : 'text-gray-700 hover:text-amber-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}