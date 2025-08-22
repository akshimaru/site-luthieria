import { useState, useEffect } from 'react'
import { Award, Users, Clock, Heart } from 'lucide-react'
import { SEO } from '../components/SEO'
import { supabase, ContentSection, MetaTag, SiteConfig } from '../lib/supabase'

export const About = () => {
  const [aboutContent, setAboutContent] = useState<ContentSection | null>(null)
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
        .eq('page_slug', 'sobre')
        .single()
      
      if (metaData) setMetaTag(metaData)

      // Fetch site config
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (configData) setSiteConfig(configData)

      // Fetch about content
      const { data: contentData } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', 'about_section')
        .eq('is_active', true)
        .single()
      
      if (contentData) {
        setAboutContent(contentData)
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Award,
      title: 'Excelência Técnica',
      description: '7 anos de experiência em luthieria com técnicas tradicionais e conhecimento avançado.'
    },
    {
      icon: Users,
      title: 'Atendimento Personalizado',
      description: 'Cada instrumento é único e recebe cuidado personalizado conforme suas características específicas.'
    },
    {
      icon: Clock,
      title: 'Tradição & Modernidade',
      description: 'Combinamos métodos centenários de luthieria com ferramentas modernas para resultados superiores.'
    },
    {
      icon: Heart,
      title: 'Paixão pela Música',
      description: 'Nosso amor pela música nos motiva a devolver cada instrumento com sua melhor sonoridade possível.'
    }
  ]

  const timeline = [
    {
      year: '2018',
      title: 'Fundação',
      description: 'Abertura da primeira oficina especializada em manutenção de instrumentos de corda, instalados dentro da Loja Vibratho Instrumentos'
    },
    {
      year: '2019',
      title: 'Expansão dos Serviços',
      description: 'Ampliação para atender partes eletricas de instrumentos de cordas e reparos mais complexos.'
    },
    {
      year: '2020',
      title: 'Técnicas Avançadas',
      description: 'Criação de novas técnicas e modernas formas de restauração de instrumentos.'
    },
    {
      year: '2021',
      title: 'Digitalização',
      description: 'Implementação de sistema online para orçamentos e acompanhamento de serviços.'
    },
    {
      year: '2025',
      title: 'Presente',
      description: 'Consolidação como referência em luthieria em Brasília, com mais de 1500 instrumentos restaurados e mais de 1000 clientes satisfeitos, temos avaliação maxima de satisfação do Google'
    }
  ]

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
            <h1 className="text-4xl font-bold mb-6">Nossa História</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Tradição, experiência e paixão pela música se encontram na Serviços {siteConfig?.site_name || 'Prime Luthieria'}. 
              Conheça nossa jornada de mais de duas décadas dedicadas aos instrumentos musicais.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="bg-white rounded-lg shadow-md p-8">
                {aboutContent ? (
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: aboutContent.content }}
                  />
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-amber-900 mb-6">Nossa História</h2>
                    <p className="text-gray-700 mb-4">
                      A {siteConfig?.site_name || 'Prime Luthieria'} nasceu da paixão pela música e pelo artesanato tradicional. 
                      Com 7 anos de experiência, somos especializados em manutenção, 
                      conserto e restauração de instrumentos musicais.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Nossa oficina conta com ferramentas específicas e madeiras selecionadas para 
                      garantir que cada instrumento receba o tratamento adequado. Atendemos desde 
                      músicos iniciantes até profissionais renomados.
                    </p>
                    <p className="text-gray-700">
                      Nosso compromisso é devolver seu instrumento com a melhor sonoridade e 
                      tocabilidade possível, preservando suas características originais e valorizando sua história.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <img
                  src={aboutContent?.image_url || "https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=600"}
                  alt="Oficina de luthieria"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Nossos Diferenciais</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                O que nos torna únicos no cuidado com instrumentos musicais
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-amber-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Nossa Trajetória</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Marcos importantes da nossa jornada na luthieria
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-amber-200 h-full"></div>
              
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className="w-1/2 px-6">
                      <div className={`bg-white rounded-lg shadow-md p-6 ${
                        index % 2 === 0 ? 'text-right' : 'text-left'
                      }`}>
                        <div className="text-2xl font-bold text-amber-900 mb-2">{item.year}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="w-6 h-6 bg-amber-500 rounded-full border-4 border-white shadow-md relative z-10"></div>
                    
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Nossos Valores</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Os princípios que guiam nosso trabalho e relacionamento com os clientes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-amber-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Qualidade</h3>
                <p className="text-gray-700">
                  Comprometimento com a excelência em cada serviço realizado, 
                  usando apenas materiais de primeira qualidade.
                </p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Transparência</h3>
                <p className="text-gray-700">
                  Diagnósticos honestos e orçamentos claros, sempre explicando 
                  o que precisa ser feito e por que.
                </p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Respeito</h3>
                <p className="text-gray-700">
                  Cada instrumento tem sua história e valor sentimental, 
                  tratamos todos com o máximo cuidado e respeito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Traga seu instrumento para receber o cuidado especializado que ele merece. 
              Juntos, vamos preservar e valorizar sua música.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contato"
                className="bg-white text-amber-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Conhecer Nossa Oficina
              </a>
              {siteConfig?.social_media?.whatsapp && (
                <a
                  href={`https://wa.me/${siteConfig.social_media.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-900 transition-colors"
                >
                  Falar no WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}