import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { SEO } from '../components/SEO'
import { supabase, Testimonial, MetaTag, SiteConfig } from '../lib/supabase'

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [metaTag, setMetaTag] = useState<MetaTag | null>(null)
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch meta tags
      const { data: metaData } = await supabase
        .from('meta_tags')
        .select('*')
        .eq('page_slug', 'depoimentos')
        .single()
      
      if (metaData) setMetaTag(metaData)

      // Fetch site config
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (configData) setSiteConfig(configData)

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('display_order')
        .order('created_at', { ascending: false })
      
      if (testimonialsData) {
        setTestimonials(testimonialsData)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getAverageRating = () => {
    if (testimonials.length === 0) return 0
    const sum = testimonials.reduce((acc, testimonial) => acc + testimonial.rating, 0)
    return (sum / testimonials.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
      </div>
    )
  }

  return (
    <>
      <SEO metaTag={metaTag || undefined} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-6">Depoimentos de Clientes</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              A satisfação dos nossos clientes é o nosso maior orgulho. Veja o que eles falam sobre nossos serviços.
            </p>
            
            {/* Rating Summary */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(5)}
                <span className="text-2xl font-bold">{getAverageRating()}</span>
              </div>
              <p className="opacity-90">
                Baseado em {testimonials.length} avaliações de clientes
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {testimonials.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Nenhum depoimento encontrado no momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className={`relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                      testimonial.is_featured ? 'ring-2 ring-amber-200 border-amber-200' : ''
                    }`}
                  >
                    {/* Featured Badge */}
                    {testimonial.is_featured && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          Destaque
                        </span>
                      </div>
                    )}

                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <Quote className="h-8 w-8 text-amber-200" />
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-gray-700 text-center mb-6 italic leading-relaxed">
                      "{testimonial.testimonial_text}"
                    </blockquote>

                    {/* Client Info */}
                    <div className="flex items-center justify-center">
                      {testimonial.client_photo && (
                        <img
                          src={testimonial.client_photo}
                          alt={testimonial.client_name}
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                      )}
                      <div className="text-center">
                        <h4 className="font-semibold text-amber-900">
                          {testimonial.client_name}
                        </h4>
                        <p className="text-gray-500 text-sm">Cliente</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Números que Falam por Si
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Anos de dedicação ao cuidado de instrumentos musicais
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-900 mb-2">7+</div>
                <p className="text-gray-600">Anos de Experiência</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-900 mb-2">1500+</div>
                <p className="text-gray-600">Instrumentos Restaurados</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-900 mb-2">98%</div>
                <p className="text-gray-600">Clientes Satisfeitos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-900 mb-2">{getAverageRating()}</div>
                <p className="text-gray-600">Avaliação Média</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Quer fazer parte desta família?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Traga seu instrumento para receber o mesmo cuidado especializado que estes clientes experimentaram
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contato"
                className="bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Entrar em Contato
              </a>
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
      </div>
    </>
  )
}