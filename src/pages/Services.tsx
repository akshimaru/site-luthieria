import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Clock, DollarSign, CheckCircle } from 'lucide-react'
import { SEO } from '../components/SEO'
import { supabase, Service, MetaTag, SiteConfig } from '../lib/supabase'

export const Services = () => {
  const { slug } = useParams()
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [metaTag, setMetaTag] = useState<MetaTag | null>(null)
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchServiceBySlug(slug)
    } else {
      fetchAllServices()
    }
  }, [slug])

  const fetchAllServices = async () => {
    try {
      // Fetch meta tags
      const { data: metaData } = await supabase
        .from('meta_tags')
        .select('*')
        .eq('page_slug', 'servicos')
        .single()
      
      if (metaData) setMetaTag(metaData)

      // Fetch site config
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (configData) setSiteConfig(configData)

      // Fetch all active services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (servicesData) setServices(servicesData)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceBySlug = async (slug: string) => {
    try {
      // Fetch site config
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (configData) setSiteConfig(configData)

      const { data: serviceData } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
      
      if (serviceData) {
        setSelectedService(serviceData)
        // Create dynamic meta tag for service page
        setMetaTag({
          id: '',
          page_slug: slug,
          page_title: serviceData.meta_title || `${serviceData.title} - ${configData?.site_name || 'Prime Luthieria'}`,
          meta_description: serviceData.meta_description || serviceData.short_description,
          meta_keywords: `${serviceData.title}, luthieria, conserto, manutenção`,
          og_title: serviceData.title,
          og_description: serviceData.short_description,
          og_image: serviceData.image_url,
          og_type: 'article',
          schema_json: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": serviceData.title,
            "description": serviceData.short_description,
            "provider": {
              "@type": "LocalBusiness",
              "name": `Serviços ${configData?.site_name || 'Prime Luthieria'}`
            }
          },
          canonical_url: `${window.location.origin}/servicos/${slug}`,
          robots: 'index,follow',
          created_at: '',
          updated_at: ''
        })
      }
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    )
  }

  if (selectedService) {
    return (
      <>
        <SEO metaTag={metaTag || undefined} />
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-6">{selectedService.title}</h1>
                  <p className="text-xl opacity-90 mb-8">{selectedService.short_description}</p>
                  
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-6 w-6" />
                      <span className="text-lg font-semibold">{selectedService.price_text}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-6 w-6" />
                      <span>Orçamento rápido</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/contato"
                      className="bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                    >
                      Solicitar Orçamento
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    {siteConfig?.social_media?.whatsapp && (
                      <a
                        href={`https://wa.me/${siteConfig.social_media.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition-colors text-center"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {selectedService.image_url && (
                  <div className="lg:order-first">
                    <img
                      src={selectedService.image_url}
                      alt={selectedService.title}
                      className="w-full h-96 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Service Details */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {selectedService.full_description && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">Descrição Detalhada</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedService.full_description}
                    </p>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {selectedService.gallery_images.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">Galeria do Serviço</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedService.gallery_images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`${selectedService.title} - Imagem ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:shadow-lg transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="bg-amber-50 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">
                  Interessado neste serviço?
                </h3>
                <p className="text-gray-700 mb-6">
                  Entre em contato conosco para receber um orçamento personalizado e sem compromisso.
                </p>
                <Link
                  to="/contato"
                  className="bg-amber-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center"
                >
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO metaTag={metaTag || undefined} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-6">Nossos Serviços</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Oferecemos uma gama completa de serviços especializados para manutenção, 
              conserto e restauração de instrumentos musicais
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {service.image_url && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {service.is_featured && (
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-semibold mb-3">
                        Destaque
                      </span>
                    )}
                    
                    <h3 className="text-xl font-semibold text-amber-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.short_description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-amber-800 font-semibold text-lg">{service.price_text}</span>
                      {service.is_featured && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    
                    <Link
                      to={`/servicos/${service.slug}`}
                      className="w-full bg-amber-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center justify-center"
                    >
                      Ver Detalhes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-amber-900 mb-6">
              Não encontrou o serviço que procura?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Entre em contato conosco! Temos experiência com diversos tipos de instrumentos 
              e podemos atender necessidades específicas.
            </p>
            <Link
              to="/contato"
              className="bg-amber-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center"
            >
              Falar com Especialista
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}