import React, { useState, useEffect } from 'react'
import { Play, Eye, Filter } from 'lucide-react'
import { SEO } from '../components/SEO'
import { supabase, GalleryItem, MetaTag } from '../lib/supabase'

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [metaTag, setMetaTag] = useState<MetaTag | null>(null)
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
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'todos') {
      setFilteredItems(galleryItems)
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, galleryItems])

  const fetchData = async () => {
    try {
      // Fetch meta tags
      const { data: metaData } = await supabase
        .from('meta_tags')
        .select('*')
        .eq('page_slug', 'galeria')
        .single()
      
      if (metaData) setMetaTag(metaData)

      // Fetch gallery items
      const { data: galleryData } = await supabase
        .from('gallery_items')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('display_order')
        .order('created_at', { ascending: false })
      
      if (galleryData) {
        setGalleryItems(galleryData)
        setFilteredItems(galleryData)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item)
  }

  const closeLightbox = () => {
    setSelectedItem(null)
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
      <SEO metaTag={metaTag} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-6">Galeria de Trabalhos</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Veja alguns dos trabalhos que já realizamos. Cada instrumento tem sua história 
              e recebe nosso cuidado especializado.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 mr-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium">Filtrar por:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Nenhum item encontrado para esta categoria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                    onClick={() => openLightbox(item)}
                  >
                    {/* Featured Badge */}
                    {item.is_featured && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Destaque
                        </span>
                      </div>
                    )}

                    {/* Media Container */}
                    <div className="relative aspect-square bg-gray-200 overflow-hidden">
                      <img
                        src={item.thumbnail_url || item.media_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.media_type === 'video' ? (
                            <Play className="h-12 w-12 text-white" />
                          ) : (
                            <Eye className="h-12 w-12 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500 capitalize">
                          {categories.find(cat => cat.value === item.category)?.label || item.category}
                        </span>
                        {item.media_type === 'video' && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            Vídeo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl font-light"
              >
                ×
              </button>
              
              {selectedItem.media_type === 'video' ? (
                <video
                  src={selectedItem.media_url}
                  controls
                  className="max-w-full max-h-[80vh] rounded-lg"
                  autoPlay
                />
              ) : (
                <img
                  src={selectedItem.media_url}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[80vh] rounded-lg object-contain"
                />
              )}
              
              {/* Media Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
                <h3 className="text-lg font-semibold mb-1">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="text-gray-300 text-sm">{selectedItem.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}