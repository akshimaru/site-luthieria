import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Save, Globe, Phone, Mail, MapPin, Clock, Palette } from 'lucide-react'
import { supabase, SiteConfig, MetaTag } from '../../lib/supabase'
import adminToast from '../../lib/adminToast'

const siteConfigSchema = z.object({
  site_name: z.string().min(1, 'Nome do site é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  seg_sex: z.string().min(1, 'Horário seg-sex é obrigatório'),
  sab: z.string().min(1, 'Horário sábado é obrigatório'),
  dom: z.string().min(1, 'Horário domingo é obrigatório'),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
})

const metaTagSchema = z.object({
  page_title: z.string().min(1, 'Título da página é obrigatório'),
  meta_description: z.string().min(1, 'Descrição é obrigatória'),
  meta_keywords: z.string().optional(),
})

const themeSchema = z.object({
  primary_color: z.string().default('#92400e'),
  secondary_color: z.string().default('#f59e0b'),
  accent_color: z.string().default('#d97706'),
  text_color: z.string().default('#1f2937'),
  background_color: z.string().default('#ffffff'),
  border_color: z.string().default('#e5e7eb'),
})

type SiteConfigFormData = z.infer<typeof siteConfigSchema>
type MetaTagFormData = z.infer<typeof metaTagSchema>
type ThemeFormData = z.infer<typeof themeSchema>

export const AdminSettings = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [metaTags, setMetaTags] = useState<MetaTag[]>([])
  const [selectedPage, setSelectedPage] = useState('home')
  const [activeTab, setActiveTab] = useState('site')
  const [loading, setLoading] = useState(true)

  const {
    register: registerSite,
    handleSubmit: handleSubmitSite,
    reset: resetSite,
    formState: { errors: siteErrors }
  } = useForm<SiteConfigFormData>({
    resolver: zodResolver(siteConfigSchema)
  })

  const {
    register: registerMeta,
    handleSubmit: handleSubmitMeta,
    reset: resetMeta,
    formState: { errors: metaErrors }
  } = useForm<MetaTagFormData>({
    resolver: zodResolver(metaTagSchema)
  })

  const {
    register: registerTheme,
    handleSubmit: handleSubmitTheme,
    watch: watchTheme,
    reset: resetTheme
  } = useForm<ThemeFormData>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      primary_color: '#92400e',
      secondary_color: '#f59e0b',
      accent_color: '#d97706',
      text_color: '#1f2937',
      background_color: '#ffffff',
      border_color: '#e5e7eb'
    }
  })

  const themeColors = watchTheme()

  const pages = [
    { value: 'home', label: 'Página Inicial' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'galeria', label: 'Galeria' },
    { value: 'depoimentos', label: 'Depoimentos' },
    { value: 'sobre', label: 'Sobre' },
    { value: 'contato', label: 'Contato' },
  ]

  const tabs = [
    { id: 'site', label: 'Site', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'theme', label: 'Cores', icon: Palette },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const currentMeta = metaTags.find(meta => meta.page_slug === selectedPage)
    if (currentMeta) {
      resetMeta({
        page_title: currentMeta.page_title,
        meta_description: currentMeta.meta_description,
        meta_keywords: currentMeta.meta_keywords || '',
      })
    } else {
      resetMeta({
        page_title: '',
        meta_description: '',
        meta_keywords: '',
      })
    }
  }, [selectedPage, metaTags, resetMeta])

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (themeColors) {
      const root = document.documentElement
      root.style.setProperty('--color-primary', themeColors.primary_color)
      root.style.setProperty('--color-secondary', themeColors.secondary_color)
      root.style.setProperty('--color-accent', themeColors.accent_color)
      root.style.setProperty('--color-text', themeColors.text_color)
      root.style.setProperty('--color-background', themeColors.background_color)
      root.style.setProperty('--color-border', themeColors.border_color)
    }
  }, [themeColors])

  const fetchData = async () => {
    try {
      // Fetch site config
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .single()
      
      if (configData) {
        setSiteConfig(configData)
        resetSite({
          site_name: configData.site_name,
          phone: configData.phone,
          email: configData.email,
          address: configData.address,
          seg_sex: configData.business_hours?.seg_sex || '',
          sab: configData.business_hours?.sab || '',
          dom: configData.business_hours?.dom || '',
          facebook: configData.social_media?.facebook || '',
          instagram: configData.social_media?.instagram || '',
          whatsapp: configData.social_media?.whatsapp || '',
        })

        // Load theme colors if available
        if (configData.theme_colors) {
          resetTheme(configData.theme_colors)
        }
      }

      // Fetch meta tags
      const { data: metaData } = await supabase
        .from('meta_tags')
        .select('*')
        .order('page_slug')
      
      if (metaData) {
        setMetaTags(metaData)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const onSubmitSiteConfig = async (data: SiteConfigFormData) => {
    try {
      const updateData = {
        site_name: data.site_name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        business_hours: {
          seg_sex: data.seg_sex,
          sab: data.sab,
          dom: data.dom,
        },
        social_media: {
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          whatsapp: data.whatsapp || '',
        }
      }

      const { error } = siteConfig
        ? await supabase
            .from('site_config')
            .update(updateData)
            .eq('id', siteConfig.id)
        : await supabase
            .from('site_config')
            .insert([updateData])

      if (error) throw error

      adminToast.save('Configurações do site')
      fetchData()
    } catch (error) {
      console.error('Error saving site config:', error)
      adminToast.error.save('configurações do site')
    }
  }

  const onSubmitMetaTag = async (data: MetaTagFormData) => {
    try {
      const currentMeta = metaTags.find(meta => meta.page_slug === selectedPage)
      
      const updateData = {
        page_slug: selectedPage,
        page_title: data.page_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords || null,
      }

      const { error } = currentMeta
        ? await supabase
            .from('meta_tags')
            .update(updateData)
            .eq('id', currentMeta.id)
        : await supabase
            .from('meta_tags')
            .insert([updateData])

      if (error) throw error

      toast.success('Meta tags salvas com sucesso!')
      fetchData()
    } catch (error) {
      console.error('Error saving meta tags:', error)
      toast.error('Erro ao salvar meta tags')
    }
  }

  const onSubmitTheme = async (data: ThemeFormData) => {
    try {
      const updateData = {
        theme_colors: data
      }

      const { error } = siteConfig
        ? await supabase
            .from('site_config')
            .update(updateData)
            .eq('id', siteConfig.id)
        : await supabase
            .from('site_config')
            .insert([{ ...updateData, site_name: siteConfig?.site_name || 'Prime Luthieria' }])

      if (error) throw error

      toast.success('Cores do tema salvas com sucesso!')
      fetchData()
    } catch (error) {
      console.error('Error saving theme:', error)
      toast.error('Erro ao salvar cores do tema')
    }
  }

  const resetToDefaultTheme = () => {
    resetTheme({
      primary_color: '#92400e',
      secondary_color: '#f59e0b',
      accent_color: '#d97706',
      text_color: '#1f2937',
      background_color: '#ffffff',
      border_color: '#e5e7eb'
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações gerais do site, SEO e aparência</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Site Configuration */}
      {activeTab === 'site' && (
        <div className="max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Configurações do Site</h2>
            </div>
            
            <form onSubmit={handleSubmitSite(onSubmitSiteConfig)} className="space-y-6">
              {/* Site Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Site
                </label>
                <input
                  type="text"
                  {...registerSite('site_name')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder={siteConfig?.site_name || 'Prime Luthieria'}
                />
                {siteErrors.site_name && (
                  <p className="text-red-600 text-sm mt-1">{siteErrors.site_name.message}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="text"
                    {...registerSite('phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="(11) 99999-9999"
                  />
                  {siteErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{siteErrors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    {...registerSite('email')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="contato@primeluthieria.com.br"
                  />
                  {siteErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{siteErrors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Endereço
                </label>
                <input
                  type="text"
                  {...registerSite('address')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Rua dos Músicos, 123 - São Paulo, SP"
                />
                {siteErrors.address && (
                  <p className="text-red-600 text-sm mt-1">{siteErrors.address.message}</p>
                )}
              </div>

              {/* Business Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Horário de Funcionamento
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Segunda a Sexta</label>
                    <input
                      type="text"
                      {...registerSite('seg_sex')}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="09:00 às 18:00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Sábado</label>
                    <input
                      type="text"
                      {...registerSite('sab')}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="09:00 às 13:00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Domingo</label>
                    <input
                      type="text"
                      {...registerSite('dom')}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Fechado"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Redes Sociais</label>
                <div className="space-y-3">
                  <input
                    type="url"
                    {...registerSite('facebook')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="https://facebook.com/primeluthieria"
                  />
                  <input
                    type="url"
                    {...registerSite('instagram')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="https://instagram.com/primeluthieria"
                  />
                  <input
                    type="text"
                    {...registerSite('whatsapp')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="5511999999999"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-800 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SEO Configuration */}
      {activeTab === 'seo' && (
        <div className="max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações SEO</h2>
            <p className="text-sm text-gray-600 mb-6">Configure meta tags por página</p>
            
            {/* Page Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione a Página
              </label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {pages.map((page) => (
                  <option key={page.value} value={page.value}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSubmitMeta(onSubmitMetaTag)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Página
                </label>
                <input
                  type="text"
                  {...registerMeta('page_title')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Título que aparecerá na aba do browser"
                />
                {metaErrors.page_title && (
                  <p className="text-red-600 text-sm mt-1">{metaErrors.page_title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Descrição
                </label>
                <textarea
                  {...registerMeta('meta_description')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Descrição que aparecerá nos resultados de busca"
                />
                {metaErrors.meta_description && (
                  <p className="text-red-600 text-sm mt-1">{metaErrors.meta_description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Palavras-chave
                </label>
                <input
                  type="text"
                  {...registerMeta('meta_keywords')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="luthieria, conserto, instrumentos, separadas, por, vírgula"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-800 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Meta Tags
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Theme Configuration */}
      {activeTab === 'theme' && (
        <div className="max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Palette className="h-6 w-6 text-gray-400 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">Personalização de Cores</h2>
              </div>
              <button
                type="button"
                onClick={resetToDefaultTheme}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Restaurar Padrão
              </button>
            </div>
            
            <form onSubmit={handleSubmitTheme(onSubmitTheme)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Primária
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      {...registerTheme('primary_color')}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      {...registerTheme('primary_color')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Secundária
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      {...registerTheme('secondary_color')}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      {...registerTheme('secondary_color')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor de Destaque
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      {...registerTheme('accent_color')}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      {...registerTheme('accent_color')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Texto
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      {...registerTheme('text_color')}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      {...registerTheme('text_color')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor de Fundo
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      {...registerTheme('background_color')}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      {...registerTheme('background_color')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor das Bordas
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      {...registerTheme('border_color')}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      {...registerTheme('border_color')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Pré-visualização</h3>
                <div 
                  className="p-6 rounded-lg border-2"
                  style={{ 
                    backgroundColor: themeColors.background_color,
                    borderColor: themeColors.border_color,
                    color: themeColors.text_color
                  }}
                >
                  <h4 
                    className="text-xl font-bold mb-2"
                    style={{ color: themeColors.primary_color }}
                  >
                    {siteConfig?.site_name || 'Prime Luthieria'}
                  </h4>
                  <p className="mb-4">
                    Especialistas em manutenção e conserto de instrumentos musicais.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg font-semibold"
                      style={{ 
                        backgroundColor: themeColors.primary_color,
                        color: themeColors.background_color
                      }}
                    >
                      Botão Primário
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg font-semibold"
                      style={{ 
                        backgroundColor: themeColors.secondary_color,
                        color: themeColors.background_color
                      }}
                    >
                      Botão Secundário
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg font-semibold"
                      style={{ 
                        backgroundColor: themeColors.accent_color,
                        color: themeColors.background_color
                      }}
                    >
                      Destaque
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-800 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Cores do Tema
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}