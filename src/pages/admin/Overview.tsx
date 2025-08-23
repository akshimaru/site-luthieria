import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Image, 
  Star, 
  MessageSquare, 
  TrendingUp,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Stats {
  services: number
  galleryItems: number
  testimonials: number
  contentSections: number
}

export const AdminOverview = () => {
  const [siteConfig, setSiteConfig] = useState(null)

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
  const [stats, setStats] = useState<Stats>({
    services: 0,
    galleryItems: 0,
    testimonials: 0,
    contentSections: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [
        { count: servicesCount },
        { count: galleryCount },
        { count: testimonialsCount },
        { count: contentCount }
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('content_sections').select('*', { count: 'exact', head: true })
      ])

      setStats({
        services: servicesCount || 0,
        galleryItems: galleryCount || 0,
        testimonials: testimonialsCount || 0,
        contentSections: contentCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Serviços',
      value: stats.services,
      icon: FileText,
      color: 'bg-blue-50 text-blue-700',
      iconBg: 'bg-blue-100'
    },
    {
      name: 'Itens da Galeria',
      value: stats.galleryItems,
      icon: Image,
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-100'
    },
    {
      name: 'Depoimentos',
      value: stats.testimonials,
      icon: Star,
      color: 'bg-yellow-50 text-yellow-700',
      iconBg: 'bg-yellow-100'
    },
    {
      name: 'Seções de Conteúdo',
      value: stats.contentSections,
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-700',
      iconBg: 'bg-purple-100'
    }
  ]

  const recentActivities = [
    { action: 'Novo serviço adicionado', item: 'Restauração de Violino', time: '2 horas atrás' },
    { action: 'Imagem adicionada à galeria', item: 'Guitarra Restaurada', time: '4 horas atrás' },
    { action: 'Novo depoimento', item: 'Carlos Silva', time: '1 dia atrás' },
    { action: 'Configuração atualizada', item: 'Informações de contato', time: '2 dias atrás' },
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
  <p className="text-gray-600 mt-2">Bem-vindo ao sistema de gerenciamento da {siteConfig?.site_name || 'Prime Luthieria'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <stat.icon className="h-6 w-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
          </div>
          <div className="p-6 space-y-4">
            <a
              href="/admin/services"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Gerenciar Serviços</h3>
                <p className="text-sm text-gray-500">Adicionar, editar ou remover serviços</p>
              </div>
            </a>
            
            <a
              href="/admin/gallery"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Image className="h-5 w-5 text-green-700" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Upload de Mídia</h3>
                <p className="text-sm text-gray-500">Adicionar fotos e vídeos à galeria</p>
              </div>
            </a>
            
            <a
              href="/admin/settings"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-700" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Configurações SEO</h3>
                <p className="text-sm text-gray-500">Otimizar meta tags e conteúdo</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.item}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Status do Sistema</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="font-medium text-gray-900">Performance</h3>
              <p className="text-sm text-gray-500 mt-1">Site carregando rapidamente</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-medium text-gray-900">SEO Score</h3>
              <p className="text-sm text-gray-500 mt-1">Otimização excelente</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="font-medium text-gray-900">Backup</h3>
              <p className="text-sm text-gray-500 mt-1">Último backup: hoje</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}