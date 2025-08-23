import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, CheckCircle, Guitar, Music } from 'lucide-react'
import { SEO } from '../components/SEO'
import { supabase, Service, Testimonial, ContentSection, MetaTag, SiteConfig } from '../lib/supabase'

export const Home = () => {
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [heroBanner, setHeroBanner] = useState<ContentSection | null>(null)
  const [metaTag, setMetaTag] = useState<MetaTag | null>(null)
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch meta tags
      const { data: metaData } = await supabase
        .from('meta_tags')
        .select('*')
        .eq('page_slug', 'home')
        .single()
      
      if (metaData) setMetaTag(metaData)

      // Fetch site config
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (configData) setSiteConfig(configData)

      // Fetch featured services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('display_order')
        .limit(3)
      
      if (servicesData) setServices(servicesData)

      // Fetch featured testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('display_order')
        .limit(3)
      
      if (testimonialsData) setTestimonials(testimonialsData)

      // Fetch hero banner content
      const { data: bannerData } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', 'hero_banner')
        .eq('is_active', true)
        .single()
      
      if (bannerData) setHeroBanner(bannerData)

    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const features = [
    {
      icon: CheckCircle,
      title: 'Diagnóstico Preciso',
      description: 'Avaliação completa do seu instrumento com orçamento transparente'
    },
    {
      icon: Guitar,
      title: 'Técnicas Tradicionais',
      description: 'Métodos centenários de luthieria preservados e aperfeiçoados'
    },
    {
      icon: Music,
      title: 'Qualidade Garantida',
      description: 'Todos os serviços com garantia e acompanhamento pós-entrega'
    }
  ]

  return (
    <>
      <SEO metaTag={metaTag || undefined} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 py-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {heroBanner ? (
              <div dangerouslySetInnerHTML={{ __html: heroBanner.content }} />
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
                  Serviços {siteConfig?.site_name || 'Prime Luthieria'}
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                  Especialistas em manutenção e conserto de instrumentos musicais há mais de 20 anos. 
                  Tradição, qualidade e paixão pela música em cada serviço.
                </p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/contato"
                className="bg-amber-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center justify-center"
              >
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/servicos"
                className="border-2 border-amber-900 text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-900 hover:text-white transition-colors"
              >
                Nossos Serviços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Por que escolher a {siteConfig?.site_name || 'Prime Luthieria'}?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combinamos tradição e modernidade para oferecer o melhor cuidado para seus instrumentos musicais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-amber-900" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Nossos Principais Serviços</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma gama completa de serviços especializados para todos os tipos de instrumentos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.short_description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-800 font-semibold">{service.price_text}</span>
                    <Link
                      to={`/servicos/${service.slug}`}
                      className="text-amber-900 hover:text-amber-700 font-medium inline-flex items-center"
                    >
                      Saiba mais
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/servicos"
              className="bg-amber-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center"
            >
              Ver todos os serviços
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">O que nossos clientes dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A satisfação dos nossos clientes é o nosso maior orgulho
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.testimonial_text}"</p>
                <div className="flex items-center">
                  {testimonial.client_photo && (
                    <img
                      src={testimonial.client_photo}
                      alt={testimonial.client_name}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-amber-900">{testimonial.client_name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/depoimentos"
              className="text-amber-900 hover:text-amber-700 font-medium inline-flex items-center"
            >
              Ver todos os depoimentos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Seu instrumento merece o melhor cuidado</h2>
          <p className="text-xl mb-8 opacity-90">
            Entre em contato conosco e descubra como podemos ajudar a manter seu instrumento sempre perfeito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Entrar em Contato
            </Link>
            {siteConfig?.social_media?.whatsapp && (
              <a
                href={`https://wa.me/${siteConfig.social_media.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}