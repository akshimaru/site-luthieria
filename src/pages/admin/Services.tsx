import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit, Eye, Trash2, Star, ToggleLeft, ToggleRight, Save, ArrowLeft, Image } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase, Service } from '../../lib/supabase'
import adminToast from '../../lib/adminToast'

const serviceSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  short_description: z.string().min(1, 'Descrição curta é obrigatória'),
  full_description: z.string().optional(),
  price_from: z.number().optional(),
  price_to: z.number().optional(),
  price_text: z.string().default('Consulte'),
  image_url: z.string().url().optional(),
  gallery_images: z.array(z.string().url()).default([]),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  display_order: z.number().default(0)
})

type ServiceFormData = z.infer<typeof serviceSchema>

const ServiceForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [galleryImageInput, setGalleryImageInput] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      price_text: 'Consulte',
      is_featured: false,
      is_active: true,
      display_order: 0,
      gallery_images: []
    }
  })

  const galleryImages = watch('gallery_images') || []

  useEffect(() => {
    if (isEdit) {
      fetchService()
    }
  }, [id, isEdit])

  // Generate slug from title
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title' && value.title && !isEdit) {
        const slug = value.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
        setValue('slug', slug)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, isEdit])

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (data) {
        reset({
          title: data.title,
          slug: data.slug,
          short_description: data.short_description,
          full_description: data.full_description || '',
          price_from: data.price_from || undefined,
          price_to: data.price_to || undefined,
          price_text: data.price_text,
          image_url: data.image_url || '',
          gallery_images: data.gallery_images || [],
          is_featured: data.is_featured,
          is_active: data.is_active,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          display_order: data.display_order
        })
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      toast.error('Erro ao carregar serviço')
      navigate('/admin/services')
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true)
    try {
      // Check if slug is unique (except for current service if editing)
      const { data: existingService } = await supabase
        .from('services')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', id || '')
        .single()

      if (existingService) {
        toast.error('Já existe um serviço com este slug. Escolha outro.')
        setLoading(false)
        return
      }

      const serviceData = {
        ...data,
        price_from: data.price_from || null,
        price_to: data.price_to || null,
        image_url: data.image_url || null,
        full_description: data.full_description || null,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null
      }

      if (isEdit) {
        adminToast.loading.update('serviço', 'save-service')
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', id)
        
        if (error) throw error
        adminToast.update('Serviço')
      } else {
        adminToast.loading.create('serviço', 'save-service')
        const { error } = await supabase
          .from('services')
          .insert([serviceData])
        
        if (error) throw error
        adminToast.create('Serviço')
      }
      
      navigate('/admin/services')
    } catch (error) {
      console.error('Error saving service:', error)
      adminToast.error.save('serviço', 'save-service')
    } finally {
      setLoading(false)
    }
  }

  const addGalleryImage = () => {
    if (galleryImageInput.trim()) {
      const currentImages = galleryImages || []
      setValue('gallery_images', [...currentImages, galleryImageInput.trim()])
      setGalleryImageInput('')
    }
  }

  const removeGalleryImage = (index: number) => {
    const currentImages = galleryImages || []
    setValue('gallery_images', currentImages.filter((_, i) => i !== index))
  }

  if (initialLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
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
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/admin/services"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Serviço' : 'Novo Serviço'}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Nome do serviço"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="url-amigavel-do-servico"
                />
                {errors.slug && (
                  <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Curta *
              </label>
              <textarea
                {...register('short_description')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Descrição resumida do serviço"
              />
              {errors.short_description && (
                <p className="text-red-600 text-sm mt-1">{errors.short_description.message}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Completa
              </label>
              <textarea
                {...register('full_description')}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Descrição detalhada do serviço"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preços</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Mínimo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price_from', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Máximo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price_to', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto do Preço
                </label>
                <input
                  type="text"
                  {...register('price_text')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Consulte"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagens</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem Principal
              </label>
              <input
                type="url"
                {...register('image_url')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Galeria de Imagens
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="url"
                  value={galleryImageInput}
                  onChange={(e) => setGalleryImageInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800"
                >
                  Adicionar
                </button>
              </div>
              
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Galeria ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Título
                </label>
                <input
                  type="text"
                  {...register('meta_title')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Título para SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Descrição
                </label>
                <textarea
                  {...register('meta_description')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Descrição para SEO"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  {...register('display_order', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Serviço em destaque
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Serviço ativo
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              to="/admin/services"
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? 'Atualizar' : 'Criar'} Serviço
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ServicesList = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id)
      
      if (error) throw error
      
      toast.success(
        `${!service.is_active ? '✅' : '⏸️'} Serviço ${!service.is_active ? 'ativado' : 'desativado'} com sucesso!`
      )
      fetchServices()
    } catch (error) {
      console.error('Error toggling service:', error)
      toast.error('❌ Erro ao alterar status do serviço')
    }
  }

  const toggleFeatured = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_featured: !service.is_featured })
        .eq('id', service.id)
      
      if (error) throw error
      
      toast.success(
        `${!service.is_featured ? '⭐' : '📌'} Serviço ${!service.is_featured ? 'destacado' : 'removido dos destaques'}!`
      )
      fetchServices()
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('❌ Erro ao alterar destaque do serviço')
    }
  }

  const deleteService = async (service: Service) => {
    if (!confirm(`Tem certeza que deseja excluir o serviço "${service.title}"?`)) {
      return
    }

    try {
      adminToast.loading.delete(service.title, 'delete-service')
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)
      
      if (error) throw error
      
      adminToast.delete(service.title)
      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      adminToast.error.delete('serviço', 'delete-service')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600 mt-2">Gerencie os serviços oferecidos pela luthieria</p>
        </div>
        <Link
          to="/admin/services/new"
          className="bg-amber-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Link>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {service.image_url && (
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="h-12 w-12 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {service.title}
                          </h3>
                          {service.is_featured && (
                            <Star className="h-4 w-4 text-yellow-400 ml-2 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {service.short_description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {service.price_text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                      {service.is_featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Destaque
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/services/edit/${service.id}`}
                        className="text-amber-600 hover:text-amber-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      <a
                        href={`/servicos/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      
                      <button
                        onClick={() => toggleFeatured(service)}
                        className={`${service.is_featured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-700`}
                        title={service.is_featured ? 'Remover destaque' : 'Destacar'}
                      >
                        <Star className={`h-4 w-4 ${service.is_featured ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => toggleActive(service)}
                        className={`${service.is_active ? 'text-green-600' : 'text-gray-400'} hover:text-green-700`}
                        title={service.is_active ? 'Desativar' : 'Ativar'}
                      >
                        {service.is_active ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => deleteService(service)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum serviço cadastrado ainda.</p>
            <Link
              to="/admin/services/new"
              className="text-amber-600 hover:text-amber-800 font-medium mt-2 inline-block"
            >
              Criar o primeiro serviço
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export const AdminServices = () => {
  return (
    <Routes>
      <Route path="/" element={<ServicesList />} />
      <Route path="/new" element={<ServiceForm />} />
      <Route path="/edit/:id" element={<ServiceForm />} />
    </Routes>
  )
}