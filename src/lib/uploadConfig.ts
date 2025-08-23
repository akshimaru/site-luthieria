// Upload configuration and validation utilities

export const UPLOAD_CONFIG = {
  // File size limits (in bytes)
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: 50 * 1024 * 1024,  // 50MB for images
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB for videos
  
  // Accepted file types
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ACCEPTED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
  
  // File extensions
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.avi', '.mov', '.wmv', '.pdf', '.txt'],
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)}`
    }
  }
  
  // Check specific limits for images and videos
  if (file.type.startsWith('image/') && file.size > UPLOAD_CONFIG.MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Imagem muito grande. Tamanho máximo para imagens: ${formatFileSize(UPLOAD_CONFIG.MAX_IMAGE_SIZE)}`
    }
  }
  
  if (file.type.startsWith('video/') && file.size > UPLOAD_CONFIG.MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Vídeo muito grande. Tamanho máximo para vídeos: ${formatFileSize(UPLOAD_CONFIG.MAX_VIDEO_SIZE)}`
    }
  }
  
  // Check file type
  const allAcceptedTypes = [
    ...UPLOAD_CONFIG.ACCEPTED_IMAGE_TYPES,
    ...UPLOAD_CONFIG.ACCEPTED_VIDEO_TYPES,
    ...UPLOAD_CONFIG.ACCEPTED_DOCUMENT_TYPES
  ]
  
  if (!allAcceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não suportado: ${file.type}`
    }
  }
  
  return { valid: true }
}

export const getUploadErrorMessage = (error: any): string => {
  // Supabase storage errors
  if (error?.message?.includes('file_size_exceeded')) {
    return 'Arquivo muito grande para o plano atual do Supabase'
  }
  
  if (error?.message?.includes('storage_quota_exceeded')) {
    return 'Cota de armazenamento excedida'
  }
  
  if (error?.message?.includes('invalid_file_type')) {
    return 'Tipo de arquivo não suportado'
  }
  
  if (error?.message?.includes('network')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.'
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Upload demorou muito. Tente com um arquivo menor ou verifique sua conexão.'
  }
  
  // Generic errors
  if (error?.message) {
    return error.message
  }
  
  return 'Erro desconhecido durante o upload'
}

export const getFileCategory = (mimeType: string): 'image' | 'video' | 'document' | 'other' => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.includes('pdf') || mimeType.includes('text')) return 'document'
  return 'other'
}
