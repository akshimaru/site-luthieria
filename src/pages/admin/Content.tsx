import { useState, useEffect } from 'react'
import { Save, Edit, Eye, Image, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { supabase, ContentSection } from '../../lib/supabase'

export const AdminContent = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [bannerImageUrl, setBannerImageUrl] = useState('')
  const [sectionImageUrl, setSectionImageUrl] = useState('')

  const { register, handleSubmit, reset, watch } = useForm()

  useEffect(() => {
    fetchContentSections()
  }, [])

  useEffect(() => {
    const currentSection = contentSections.find(section => section.section_key === selectedSection)
    if (currentSection) {
      reset({
        title: currentSection.title,
        content: currentSection.content,
        content_type: currentSection.content_type,
        is_active: currentSection.is_active
      })
      
      // Set section image URL if available
      setSectionImageUrl(currentSection.image_url || '')
      
      // Extract banner image URL if it's hero_banner section
      if (selectedSection === 'hero_banner' && currentSection.content) {
        const imgMatch = currentSection.content.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/)
        if (imgMatch) {
          setBannerImageUrl(imgMatch[1])
        }
      }
    }
  }, [selectedSection, contentSections, reset])

  const fetchContentSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('section_key')
      
      if (error) throw error
      if (data) {
        setContentSections(data)
        if (data.length > 0 && !selectedSection) {
          setSelectedSection(data[0].section_key)
        }
      }
    } catch (error) {
      console.error('Error fetching content sections:', error)
      toast.error('Erro ao carregar seções de conteúdo')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    if (!selectedSection) return

    try {
      const currentSection = contentSections.find(section => section.section_key === selectedSection)
      
      let content = data.content

      // Special handling for hero_banner with image
      if (selectedSection === 'hero_banner' && bannerImageUrl) {
        content = `
          <div class="relative">
            <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('${bannerImageUrl}')"></div>
            <div class="relative z-10">
              ${content}
            </div>
          </div>
        `
      }

      const updateData = {
        title: data.title,
        content: content,
        content_type: data.content_type,
        image_url: selectedSection === 'hero_banner' ? bannerImageUrl : sectionImageUrl,
        is_active: data.is_active
      }

      const { error } = currentSection
        ? await supabase
            .from('content_sections')
            .update(updateData)
            .eq('id', currentSection.id)
        : await supabase
            .from('content_sections')
            .insert([{
              ...updateData,
              section_key: selectedSection
            }])

      if (error) throw error

      toast.success('Conteúdo salvo com sucesso!')
      setIsEditing(false)
      fetchContentSections()
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Erro ao salvar conteúdo')
    }
  }

  const predefinedSections = [
    { key: 'hero_banner', label: 'Banner Principal (Home)', hasImage: true },
    { key: 'about_section', label: 'Sobre Nós', hasImage: true },
    { key: 'contact_info', label: 'Informações de Contato', hasImage: false },
    { key: 'services_intro', label: 'Introdução dos Serviços', hasImage: false },
    { key: 'gallery_intro', label: 'Introdução da Galeria', hasImage: false },
    { key: 'testimonials_intro', label: 'Introdução dos Depoimentos', hasImage: false },
  ]

  const currentSection = contentSections.find(section => section.section_key === selectedSection)
  const currentSectionConfig = predefinedSections.find(s => s.key === selectedSection)
  const contentType = watch('content_type') || 'html'

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Conteúdo</h1>
        <p className="text-gray-600 mt-2">Edite as seções de conteúdo do site</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Section List */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Seções Disponíveis</h2>
          
          <div className="space-y-2">
            {predefinedSections.map((section) => {
              const hasContent = contentSections.find(cs => cs.section_key === section.key)
              
              return (
                <button
                  key={section.key}
                  onClick={() => {
                    setSelectedSection(section.key)
                    setIsEditing(false)
                    setBannerImageUrl('')
                    setSectionImageUrl('')
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedSection === section.key
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{section.label}</span>
                    <div className="flex items-center space-x-1">
                      {section.hasImage && (
                        <Image className="h-3 w-3 text-gray-400" />
                      )}
                      {hasContent && (
                        <div className={`w-2 h-2 rounded-full ${
                          hasContent.is_active ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedSection ? (
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {predefinedSections.find(s => s.key === selectedSection)?.label}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Seção: <code className="bg-gray-100 px-2 py-1 rounded">{selectedSection}</code>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentSection && (
                      <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
                        title="Visualizar no site"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`p-2 rounded-lg ${
                        isEditing
                          ? 'bg-amber-100 text-amber-600'
                          : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                      title={isEditing ? 'Cancelar edição' : 'Editar conteúdo'}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        {...register('title', { required: true })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Título da seção"
                      />
                    </div>

                    {/* Image field for sections that support images */}
                    {currentSectionConfig?.hasImage && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedSection === 'hero_banner' ? 'Imagem de Fundo do Banner' : 'Imagem da Seção'}
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            value={selectedSection === 'hero_banner' ? bannerImageUrl : sectionImageUrl}
                            onChange={(e) => {
                              if (selectedSection === 'hero_banner') {
                                setBannerImageUrl(e.target.value)
                              } else {
                                setSectionImageUrl(e.target.value)
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                            title="Upload de imagem"
                          >
                            <Upload className="h-4 w-4" />
                          </button>
                        </div>
                        {(selectedSection === 'hero_banner' ? bannerImageUrl : sectionImageUrl) && (
                          <div className="mt-2">
                            <img
                              src={selectedSection === 'hero_banner' ? bannerImageUrl : sectionImageUrl}
                              alt="Preview da imagem"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Conteúdo
                      </label>
                      <select
                        {...register('content_type')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="html">HTML</option>
                        <option value="text">Texto</option>
                        <option value="markdown">Markdown</option>
                      </select>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conteúdo
                      </label>
                      <textarea
                        {...register('content', { required: true })}
                        rows={contentType === 'html' ? 12 : 8}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                        placeholder={
                          contentType === 'html'
                            ? '<div>Seu conteúdo HTML aqui...</div>'
                            : contentType === 'markdown'
                            ? '# Título\n\nSeu conteúdo em Markdown...'
                            : 'Seu texto aqui...'
                        }
                      />
                      {currentSectionConfig?.hasImage && (
                        <p className="text-xs text-gray-500 mt-1">
                          A imagem de fundo será aplicada automaticamente se especificada acima.
                        </p>
                      )}
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('is_active')}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Seção ativa (visível no site)
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Conteúdo
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {currentSection ? (
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {currentSection.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              currentSection.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {currentSection.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {currentSection.content_type.toUpperCase()}
                            </span>
                            {currentSectionConfig?.hasImage && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Com Imagem
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          {currentSection.content_type === 'html' ? (
                            <div 
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{ __html: currentSection.content }}
                            />
                          ) : currentSection.content_type === 'markdown' ? (
                            <div className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                              {currentSection.content}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap text-gray-700">
                              {currentSection.content}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-500">
                          Última atualização: {new Date(currentSection.updated_at).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                          Esta seção ainda não tem conteúdo configurado.
                        </p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-amber-600 hover:text-amber-800 font-medium"
                        >
                          Criar conteúdo para esta seção
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <p className="text-gray-500">Selecione uma seção para editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}