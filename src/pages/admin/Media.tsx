import React, { useState, useEffect } from 'react'
import { Upload, Image, Video, File, Trash2, Download, Copy, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase, MediaFile } from '../../lib/supabase'
import { validateFile, formatFileSize, getUploadErrorMessage, UPLOAD_CONFIG } from '../../lib/uploadConfig'

export const AdminMedia = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const categories = [
    { value: 'all', label: 'Todos os Arquivos' },
    { value: 'services', label: 'Serviços' },
    { value: 'gallery', label: 'Galeria' },
    { value: 'general', label: 'Geral' },
  ]

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) setMediaFiles(data)
    } catch (error) {
      console.error('Error fetching media files:', error)
      toast.error('Erro ao carregar arquivos de mídia')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Validate each file before upload
    const validationErrors: string[] = []
    const validFiles: File[] = []
    
    Array.from(files).forEach((file, index) => {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        validationErrors.push(`${file.name}: ${validation.error}`)
      }
    })
    
    if (validationErrors.length > 0) {
      toast.error(`Arquivos inválidos:\n${validationErrors.join('\n')}`)
      return
    }
    
    if (validFiles.length === 0) {
      toast.error('Nenhum arquivo válido para upload')
      return
    }

    setUploading(true)

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`
        const filePath = `${selectedCategory}/${fileName}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('general')
          .upload(filePath, file)

        if (uploadError) {
          throw new Error(getUploadErrorMessage(uploadError))
        }

        // Get public URL
        const { data: publicURLData } = supabase.storage
          .from('general')
          .getPublicUrl(filePath)

        // Save file record to database
        const { error: insertError } = await supabase
          .from('media_files')
          .insert([{
            filename: fileName,
            original_name: file.name,
            file_url: publicURLData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            category: selectedCategory === 'all' ? 'general' : selectedCategory,
            is_public: true
          }])

        if (insertError) {
          throw new Error(`Erro ao salvar informações do arquivo: ${insertError.message}`)
        }

        return { fileName, originalName: file.name }
      })

      const results = await Promise.all(uploadPromises)
      
      toast.success(`${results.length} arquivo(s) enviado(s) com sucesso!`)
      fetchMediaFiles()
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.error(`Erro durante o upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setUploading(false)
      // Reset input
      event.target.value = ''
    }
  }

  const deleteFile = async (mediaFile: MediaFile) => {
    if (!confirm(`Tem certeza que deseja excluir "${mediaFile.original_name}"?`)) {
      return
    }

    try {
      // Delete from storage
      const fileName = mediaFile.file_url.split('/').pop()
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('general')
          .remove([`${mediaFile.category}/${fileName}`])
        
        if (storageError) console.warn('Error deleting from storage:', storageError)
      }

      // Delete from database
      const { error } = await supabase
        .from('media_files')
        .delete()
        .eq('id', mediaFile.id)
      
      if (error) throw error
      
      toast.success('Arquivo excluído com sucesso!')
      fetchMediaFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Erro ao excluir arquivo')
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('URL copiada para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar URL')
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image
    if (mimeType.startsWith('video/')) return Video
    return File
  }

  // Remove the duplicate formatFileSize function since we're importing it
  // const formatFileSize = (bytes: number) => { ... }

  const filteredFiles = selectedCategory === 'all' 
    ? mediaFiles 
    : mediaFiles.filter(file => file.category === selectedCategory)

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Mídia</h1>
        <p className="text-gray-600 mt-2">Gerencie todos os arquivos de mídia do site</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload de Arquivos</h2>
        
        <div className="flex items-center space-x-4 mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            {categories.filter(cat => cat.value !== 'all').map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept={UPLOAD_CONFIG.ACCEPTED_EXTENSIONS.join(',')}
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {uploading ? 'Fazendo upload...' : 'Clique para fazer upload'}
            </p>
            <p className="text-gray-500">ou arraste e solte arquivos aqui</p>
            <p className="text-sm text-gray-400 mt-2">
              Imagens, vídeos e documentos até {formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)}
            </p>
          </label>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  selectedCategory === category.value
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category.label}
                <span className="ml-2 text-xs text-gray-400">
                  ({category.value === 'all' ? mediaFiles.length : mediaFiles.filter(f => f.category === category.value).length})
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map((file) => {
          const FileIcon = getFileIcon(file.mime_type || '')
          const isImage = file.mime_type?.startsWith('image/')
          const isVideo = file.mime_type?.startsWith('video/')

          return (
            <div key={file.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {isImage ? (
                  <img
                    src={file.file_url}
                    alt={file.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : isVideo ? (
                  <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                    <Video className="h-12 w-12 text-white" />
                    <video
                      src={file.file_url}
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                      muted
                    />
                  </div>
                ) : (
                  <FileIcon className="h-12 w-12 text-gray-400" />
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex items-center space-x-2">
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => copyUrl(file.file_url)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-green-600"
                      title="Copiar URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={file.file_url}
                      download={file.original_name}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => deleteFile(file)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate mb-1">
                  {file.original_name}
                </h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span className="capitalize">{file.category}</span>
                    {file.file_size && (
                      <span>{formatFileSize(file.file_size)}</span>
                    )}
                  </div>
                  <div className="text-xs">
                    {new Date(file.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {selectedCategory === 'all' 
              ? 'Nenhum arquivo ainda'
              : `Nenhum arquivo na categoria "${categories.find(cat => cat.value === selectedCategory)?.label}"`
            }
          </p>
          <p className="text-gray-400 mb-4">
            Faça upload de imagens e vídeos para começar
          </p>
        </div>
      )}
    </div>
  )
}