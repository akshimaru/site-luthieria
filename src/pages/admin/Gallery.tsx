import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { Upload, Filter, Eye, Edit, Trash2, Play, Star, Save, ArrowLeft, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase, GalleryItem } from '../../lib/supabase'

const gallerySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  media_url: z.string().url('URL da mídia é obrigatória'),
  thumbnail_url: z.string().url().optional(),
  media_type: z.enum(['image', 'video']),
  category: z.enum(['violao', 'guitarra', 'baixo', 'violino', 'instrumentos_sopro', 'outros']),
  is_featured: z.boolean().default(false),
  display_order: z.number().default(0)
})

type GalleryFormData = z.infer<typeof gallerySchema>

const GalleryForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      media_type: 'image',
      category: 'outros',
      is_featured: false,
      display_order: 0
    }
  })

  const categories = [
    { value: 'violao', label: 'Violão' },
    { value: 'guitarra', label: 'Guitarra' },
    { value: 'baixo', label: 'Baixo' },
    { value: 'violino', label: 'Violino' },
    { value: 'instrumentos_sopro', label: 'Instrumentos de Sopro' },
    { value: 'outros', label: 'Outros' }
  ]

  useEffect(() => {
    if (isEdit) {
      fetchGalleryItem()
    }
  }, [id, isEdit])

  const fetchGalleryItem = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (data) {
        reset({
          title: data.title,
          description: data.description || '',
          media_url: data.media_url,
          thumbnail_url: data.thumbnail_url || '',
          media_type: data.media_type,
          category: data.category,
          is_featured: data.is_featured,
          display_order: data.display_order
        })
      }
    } catch (error) {
      console.error('Error fetching gallery item:', error)
      toast.error('Erro ao carregar item da galeria')
      navigate('/admin/gallery')
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data: GalleryFormData) => {
    setLoading(true)
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('gallery_items')
          .update(data)
          .eq('id', id)
        
        if (error) throw error
        toast.success('Item da galeria atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('gallery_items')
          .insert([data])
        
        if (error) throw error
        toast.success('Item da galeria criado com sucesso!')
      }
      
      navigate('/admin/gallery')
    } catch (error) {
      console.error('Error saving gallery item:', error)
      toast.error('Erro ao salvar item da galeria')
    } finally {
      setLoading(false)
    }
  }

  const mediaType = watch('media_type')

  if (initialLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
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
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/admin/gallery"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Item da Galeria' : 'Novo Item da Galeria'}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Título do item"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Descrição opcional do item"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Mídia *
              </label>
              <select
                {...register('media_type')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="image">Imagem</option>
                <option value="video">Vídeo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da {mediaType === 'image' ? 'Imagem' : 'Vídeo'} *
            </label>
            <input
              type="url"
              {...register('media_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder={`https://exemplo.com/${mediaType === 'image' ? 'imagem.jpg' : 'video.mp4'}`}
            />
            {errors.media_url && (
              <p className="text-red-600 text-sm mt-1">{errors.media_url.message}</p>
            )}
          </div>

          {mediaType === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Thumbnail (opcional)
              </label>
              <input
                type="url"
                {...register('thumbnail_url')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="https://exemplo.com/thumbnail.jpg"
              />
            </div>
          )}

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
              Item em destaque
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to="/admin/gallery"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? 'Atualizar' : 'Criar'} Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const GalleryList = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [loading, setLoading] = useState(true)

  const categories = [
    { value: 'todos', label: 'Todos' },
    { value: 'violao', label: 'Violão' },
    { value: 'guitarra', label: 'Guitarra' },
    { value: 'baixo', label: 'Baixo' },
    { value: 'violino', label: 'Violino' },
    { value: 'instrumentos_sopro', label: 'Instrumentos de Sopro' },
    { value: 'outros', label: 'Outros' }
  ]

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('display_order')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) setGalleryItems(data)
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      toast.error('Erro ao carregar galeria')
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({ is_featured: !item.is_featured })
        .eq('id', item.id)
      
      if (error) throw error
      
      toast.success(`Item ${!item.is_featured ? 'destacado' : 'removido dos destaques'}!`)
      fetchGalleryItems()
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Erro ao alterar destaque do item')
    }
  }

  const deleteItem = async (item: GalleryItem) => {
    if (!confirm(`Tem certeza que deseja excluir "${item.title}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', item.id)
      
      if (error) throw error
      
      toast.success('Item excluído com sucesso!')
      fetchGalleryItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Erro ao excluir item')
    }
  }

  const filteredItems = selectedCategory === 'todos' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Galeria</h1>
          <p className="text-gray-600 mt-2">Gerencie as imagens e vídeos da galeria</p>
        </div>
        <Link
          to="/admin/gallery/new"
          className="bg-amber-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700 font-medium">Filtrar por:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-amber-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-amber-100 hover:text-amber-900'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Media Container */}
            <div className="relative aspect-square bg-gray-200 overflow-hidden">
              {item.is_featured && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Destaque
                  </span>
                </div>
              )}
              
              <img
                src={item.thumbnail_url || item.media_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {item.media_type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <Play className="h-12 w-12 text-white" />
                </div>
              )}
              
              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-amber-900"
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/admin/gallery/edit/${item.id}`}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-amber-900"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => toggleFeatured(item)}
                    className={`p-2 bg-white rounded-full ${
                      item.is_featured ? 'text-yellow-600' : 'text-gray-700'
                    } hover:text-yellow-700`}
                    title={item.is_featured ? 'Remover destaque' : 'Destacar'}
                  >
                    <Star className={`h-4 w-4 ${item.is_featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Item Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
              )}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="capitalize">
                  {categories.find(cat => cat.value === item.category)?.label || item.category}
                </span>
                {item.media_type === 'video' && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    Vídeo
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {selectedCategory === 'todos' 
              ? 'Nenhum item na galeria ainda.' 
              : `Nenhum item encontrado na categoria "${categories.find(cat => cat.value === selectedCategory)?.label}".`
            }
          </p>
          <Link
            to="/admin/gallery/new"
            className="text-amber-600 hover:text-amber-800 font-medium mt-2 inline-block"
          >
            Criar primeiro item
          </Link>
        </div>
      )}
    </div>
  )
}

export const AdminGallery = () => {
  return (
    <Routes>
      <Route path="/" element={<GalleryList />} />
      <Route path="/new" element={<GalleryForm />} />
      <Route path="/edit/:id" element={<GalleryForm />} />
    </Routes>
  )
}