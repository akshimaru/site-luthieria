import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'
import { supabase, SiteConfig } from '../lib/supabase'

export const Footer = () => {
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

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-amber-400 mb-4">
              {siteConfig?.site_name || 'Prime Luthieria'}
            </h3>
            <p className="text-gray-300 mb-4">
              Especialistas em manutenção e conserto de instrumentos musicais há 7 anos. 
              Tradição, qualidade e paixão pela música em cada serviço.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              {siteConfig?.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{siteConfig.address}</span>
                </div>
              )}
              {siteConfig?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-amber-400" />
                  <span className="text-gray-300">{siteConfig.phone}</span>
                </div>
              )}
              {siteConfig?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-amber-400" />
                  <span className="text-gray-300">{siteConfig.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servicos" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Galeria
                </Link>
              </li>
              <li>
                <Link to="/depoimentos" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours & Social */}
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-4">Horário de Funcionamento</h3>
            <div className="text-gray-300 space-y-1 mb-6">
              {siteConfig?.business_hours?.seg_sex && (
                <p>Seg-Sex: {siteConfig.business_hours.seg_sex}</p>
              )}
              {siteConfig?.business_hours?.sab && (
                <p>Sábado: {siteConfig.business_hours.sab}</p>
              )}
              {siteConfig?.business_hours?.dom && (
                <p>Domingo: {siteConfig.business_hours.dom}</p>
              )}
            </div>

            {/* Social Media */}
            <h4 className="text-lg font-semibold text-amber-400 mb-3">Redes Sociais</h4>
            <div className="flex space-x-4">
              {siteConfig?.social_media?.facebook && (
                <a
                  href={siteConfig.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {siteConfig?.social_media?.instagram && (
                <a
                  href={siteConfig.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {siteConfig?.social_media?.whatsapp && (
                <a
                  href={`https://wa.me/${siteConfig.social_media.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {siteConfig?.site_name || 'Prime Luthieria'}. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Desenvolvido com ❤️ para amantes da música</p>
        </div>
      </div>
    </footer>
  )
}