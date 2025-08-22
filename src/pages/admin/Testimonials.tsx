import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit, Star, Trash2, Save, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { supabase, Testimonial } from '../../lib/supabase'
import GoogleIntegration from '../../components/GoogleIntegration'

const testimonialSchema = z.object({
  client_name: z.string().min(1, 'Nome do cliente é obrigatório'),
  client_photo: z.string().url().optional(),
  testimonial_text: z.string().min(10, 'Depoimento deve ter pelo menos 10 caracteres'),
  rating: z.number().min(1).max(5).default(5),
  is_featured: z.boolean().default(false),
  display_order: z.number().default(0)
})

type TestimonialFormData = z.infer<typeof testimonialSchema>

const TestimonialForm = () => {
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
    setValue,
    formState: { errors }
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      rating: 5,
      is_featured: false,
      display_order: 0
    }
  })

  const rating = watch('rating')

  useEffect(() => {
    if (isEdit) {
      fetchTestimonial()
    }
  }, [id, isEdit])

  const fetchTestimonial = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (data) {
        reset({
          client_name: data.client_name,
          client_photo: data.client_photo || '',
          testimonial_text: data.testimonial_text,
          rating: data.rating,
          is_featured: data.is_featured,
          display_order: data.display_order
        })
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error)
      toast.error('Erro ao carregar depoimento')
      navigate('/admin/testimonials')
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data: TestimonialFormData) => {
    setLoading(true)
    try {
      const testimonialData = {
        ...data,
        client_photo: data.client_photo || null
      }

      if (isEdit) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', id)
        
        if (error) throw error
        toast.success('Depoimento atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData])
        
        if (error) throw error
        toast.success('Depoimento criado com sucesso!')
      }
      
      navigate('/admin/testimonials')
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Erro ao salvar depoimento')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (currentRating: number) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setValue('rating', i + 1)}
        className={`h-8 w-8 ${
          i < currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
      >
        <Star className="h-full w-full" />
      </button>
    ))
  }

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
            to="/admin/testimonials"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Depoimento' : 'Novo Depoimento'}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Cliente *
            </label>
            <input
              type="text"
              {...register('client_name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Nome completo do cliente"
            />
            {errors.client_name && (
              <p className="text-red-600 text-sm mt-1">{errors.client_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto do Cliente
            </label>
            <input
              type="url"
              {...register('client_photo')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depoimento *
            </label>
            <textarea
              {...register('testimonial_text')}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="O depoimento do cliente sobre o serviço..."
            />
            {errors.testimonial_text && (
              <p className="text-red-600 text-sm mt-1">{errors.testimonial_text.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Avaliação *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars(rating)}
              <span className="ml-3 text-sm text-gray-600">
                {rating}/5 estrelas
              </span>
            </div>
          </div>

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
              Depoimento em destaque
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to="/admin/testimonials"
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
                  {isEdit ? 'Atualizar' : 'Criar'} Depoimento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('display_order')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) setTestimonials(data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast.error('Erro ao carregar depoimentos')
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: !testimonial.is_featured })
        .eq('id', testimonial.id)
      
      if (error) throw error
      
      toast.success(`Depoimento ${!testimonial.is_featured ? 'destacado' : 'removido dos destaques'}!`)
      fetchTestimonials()
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Erro ao alterar destaque do depoimento')
    }
  }

  const deleteTestimonial = async (testimonial: Testimonial) => {
    if (!confirm(`Tem certeza que deseja excluir o depoimento de "${testimonial.client_name}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonial.id)
      
      if (error) throw error
      
      toast.success('Depoimento excluído com sucesso!')
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Erro ao excluir depoimento')
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Depoimentos</h1>
          <p className="text-gray-600 mt-2">Gerencie os depoimentos dos clientes</p>
        </div>
        <Link
          to="/admin/testimonials/new"
          className="bg-amber-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-800 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Depoimento
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-2xl font-bold text-gray-900">
            {testimonials.length}
          </div>
          <p className="text-gray-600">Total de Depoimentos</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-2xl font-bold text-gray-900">
            {testimonials.filter(t => t.is_featured).length}
          </div>
          <p className="text-gray-600">Em Destaque</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-2xl font-bold text-gray-900">
            {testimonials.length > 0 
              ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
              : '0.0'
            }
          </div>
          <p className="text-gray-600">Avaliação Média</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-2xl font-bold text-gray-900">
            {testimonials.filter(t => t.rating === 5).length}
          </div>
          <p className="text-gray-600">5 Estrelas</p>
        </div>
      </div>

      {/* Google My Business Integration */}
      <div className="mb-8">
        <GoogleIntegration onReviewsUpdated={fetchTestimonials} />
      </div>

      {/* Testimonials List */}
      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`bg-white rounded-lg shadow-sm border p-6 ${
              testimonial.is_featured ? 'ring-2 ring-amber-200 border-amber-200' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {testimonial.client_photo && (
                      <img
                        src={testimonial.client_photo}
                        alt={testimonial.client_name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        {testimonial.client_name}
                        {testimonial.is_featured && (
                          <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                            Destaque
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center mt-1">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {testimonial.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFeatured(testimonial)}
                      className={`p-2 rounded-lg ${
                        testimonial.is_featured 
                          ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                      title={testimonial.is_featured ? 'Remover destaque' : 'Destacar'}
                    >
                      <Star className={`h-4 w-4 ${testimonial.is_featured ? 'fill-current' : ''}`} />
                    </button>
                    
                    <Link
                      to={`/admin/testimonials/edit/${testimonial.id}`}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => deleteTestimonial(testimonial)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 italic leading-relaxed">
                  "{testimonial.testimonial_text}"
                </blockquote>

                {/* Footer */}
                <div className="mt-4 text-sm text-gray-500">
                  Adicionado em {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum depoimento cadastrado ainda.</p>
          <Link
            to="/admin/testimonials/new"
            className="text-amber-600 hover:text-amber-800 font-medium mt-2 inline-block"
          >
            Adicionar o primeiro depoimento
          </Link>
        </div>
      )}
    </div>
  )
}

export const AdminTestimonials = () => {
  return (
    <Routes>
      <Route path="/" element={<TestimonialsList />} />
      <Route path="/new" element={<TestimonialForm />} />
      <Route path="/edit/:id" element={<TestimonialForm />} />
    </Routes>
  )
}