import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import { SEO } from '../components/SEO'
import { supabase, SiteConfig, ContentSection, MetaTag } from '../lib/supabase'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  service: z.string().optional(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

export const Contact = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [contactContent, setContactContent] = useState<ContentSection | null>(null)
  const [metaTag, setMetaTag] = useState<MetaTag | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch meta tags
      const { data: metaData } = await supabase
        .from('meta_tags')
        .select('*')
        .eq('page_slug', 'contato')
        .single()
      
      if (metaData) setMetaTag(metaData)

      // Fetch site config
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (configData) setSiteConfig(configData)

      // Fetch contact content
      const { data: contentData } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', 'contact_info')
        .eq('is_active', true)
        .single()
      
      if (contentData) setContactContent(contentData)

    } catch (error) {
      console.error('Error fetching contact data:', error)
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Here you would typically send the email via Supabase Edge Function
      // For now, we'll just show a success message
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      reset()
      
      // In a real implementation, you would call your edge function:
      // const { error } = await supabase.functions.invoke('send-contact-email', {
      //   body: data
      // })
      
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
      console.error('Error sending message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const serviceOptions = [
    'Manutenção de Violão',
    'Regulagem de Guitarra',
    'Conserto de Baixo',
    'Restauração de Violino',
    'Instrumentos de Sopro',
    'Construção Personalizada',
    'Outro serviço'
  ]

  return (
    <>
      <SEO metaTag={metaTag} />
      <Toaster position="top-center" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-6">Entre em Contato</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Estamos prontos para cuidar do seu instrumento com o carinho e profissionalismo que ele merece. 
              Entre em contato para agendar uma avaliação ou esclarecer suas dúvidas.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-8">
                {contactContent ? (
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: contactContent.content }}
                  />
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-amber-900 mb-6">Informações de Contato</h2>
                    <p className="text-gray-700 mb-6">
                      Estamos localizados no coração da Vila Madalena, em São Paulo. 
                      Nossa oficina está preparada para receber seu instrumento e oferecer o melhor atendimento.
                    </p>
                  </div>
                )}

                {/* Contact Details */}
                <div className="space-y-6 mt-8">
                  {siteConfig?.address && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-amber-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
                        <p className="text-gray-600">{siteConfig.address}</p>
                      </div>
                    </div>
                  )}

                  {siteConfig?.phone && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-amber-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Telefone</h3>
                        <p className="text-gray-600">{siteConfig.phone}</p>
                      </div>
                    </div>
                  )}

                  {siteConfig?.email && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-amber-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600">{siteConfig.email}</p>
                      </div>
                    </div>
                  )}

                  {siteConfig?.business_hours && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-amber-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Horário de Funcionamento</h3>
                        <div className="text-gray-600 space-y-1">
                          {siteConfig.business_hours.seg_sex && (
                            <p>Segunda a Sexta: {siteConfig.business_hours.seg_sex}</p>
                          )}
                          {siteConfig.business_hours.sab && (
                            <p>Sábado: {siteConfig.business_hours.sab}</p>
                          )}
                          {siteConfig.business_hours.dom && (
                            <p>Domingo: {siteConfig.business_hours.dom}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp CTA */}
                {siteConfig?.social_media?.whatsapp && (
                  <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                      <h3 className="font-semibold text-green-900">Atendimento via WhatsApp</h3>
                    </div>
                    <p className="text-green-700 mb-4">
                      Para um atendimento mais rápido, entre em contato conosco pelo WhatsApp!
                    </p>
                    <a
                      href={`https://wa.me/${siteConfig.social_media.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Conversar no WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-6">Solicite um Orçamento</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      Serviço de Interesse
                    </label>
                    <select
                      id="service"
                      {...register('service')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="">Selecione um serviço</option>
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      {...register('message')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                      placeholder="Descreva seu instrumento, o problema identificado ou o tipo de serviço que você precisa..."
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>

                <p className="text-gray-500 text-sm mt-4 text-center">
                  * Campos obrigatórios. Responderemos em até 24 horas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Placeholder) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-8 text-center">Nossa Localização</h2>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {siteConfig?.address || 'Rua dos Músicos, 123 - Vila Madalena, São Paulo - SP'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Mapa interativo será carregado aqui
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}