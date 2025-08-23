import { useState, useEffect } from 'react'
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Monitor,
  Smartphone,
  Tablet,
  Clock
} from 'lucide-react'
import { getAnalyticsData } from '../../hooks/useAnalytics'

interface AnalyticsData {
  totalPageViews: number
  uniqueVisitors: number
  newVisitors: number
  returningVisitors: number
  topPages: Array<{ path: string; views: number }>
  deviceStats: Record<string, number>
  dailyStats: Record<string, number>
  recentPageViews: Array<{
    page_path: string
    page_title: string
    visited_at: string
    device_type: string
    browser: string
    os: string
  }>
}

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(7)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    const analyticsData = await getAnalyticsData(period)
    setData(analyticsData as AnalyticsData)
    setLoading(false)
  }

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

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Erro ao carregar dados de analytics</p>
        </div>
      </div>
    )
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'tablet': return <Tablet className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  const formatPagePath = (path: string) => {
    const pathMap: Record<string, string> = {
      '/': 'Início',
      '/servicos': 'Serviços',
      '/galeria': 'Galeria',
      '/depoimentos': 'Depoimentos',
      '/sobre': 'Sobre',
      '/contato': 'Contato'
    }
    return pathMap[path] || path
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod(7)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              period === 7 
                ? 'bg-amber-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              period === 30 
                ? 'bg-amber-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 dias
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Eye className="h-6 w-6 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalPageViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Visitantes Únicos</p>
              <p className="text-2xl font-bold text-gray-900">{data.uniqueVisitors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Novos Visitantes</p>
              <p className="text-2xl font-bold text-gray-900">{data.newVisitors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-100">
              <Users className="h-6 w-6 text-amber-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Visitantes Recorrentes</p>
              <p className="text-2xl font-bold text-gray-900">{data.returningVisitors}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Páginas Mais Visitadas</h3>
          <div className="space-y-3">
            {data.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-amber-100 text-amber-900 rounded-full text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="ml-3 text-gray-900">{formatPagePath(page.path)}</span>
                </div>
                <span className="text-gray-500 font-medium">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispositivos</h3>
          <div className="space-y-3">
            {Object.entries(data.deviceStats || {}).map(([device, count]) => (
              <div key={device} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getDeviceIcon(device)}
                  <span className="ml-3 text-gray-900 capitalize">{device}</span>
                </div>
                <span className="text-gray-500 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="pb-3 font-medium text-gray-500">Página</th>
                  <th className="pb-3 font-medium text-gray-500">Dispositivo</th>
                  <th className="pb-3 font-medium text-gray-500">Browser</th>
                  <th className="pb-3 font-medium text-gray-500">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.recentPageViews.slice(0, 10).map((view, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <div className="font-medium text-gray-900">{formatPagePath(view.page_path)}</div>
                        <div className="text-gray-500 text-xs">{view.page_title}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {getDeviceIcon(view.device_type)}
                        <span className="ml-2 capitalize">{view.device_type}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{view.browser} / {view.os}</td>
                    <td className="py-3 text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(view.visited_at).toLocaleString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
