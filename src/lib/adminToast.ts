import toast from 'react-hot-toast'

// Custom toast utility with predefined styles and messages
export const adminToast = {
  // Success toasts
  save: (item?: string) => 
    toast.success(`✅ ${item ? `${item} salvo` : 'Salvo'} com sucesso!`),
  
  update: (item?: string) => 
    toast.success(`✅ ${item ? `${item} atualizado` : 'Atualizado'} com sucesso!`),
  
  create: (item?: string) => 
    toast.success(`✅ ${item ? `${item} criado` : 'Criado'} com sucesso!`),
  
  delete: (item?: string) => 
    toast.success(`🗑️ ${item ? `${item} excluído` : 'Excluído'} com sucesso!`),
  
  activate: (item?: string) => 
    toast.success(`✅ ${item ? `${item} ativado` : 'Ativado'} com sucesso!`),
  
  deactivate: (item?: string) => 
    toast.success(`⏸️ ${item ? `${item} desativado` : 'Desativado'} com sucesso!`),
  
  feature: (item?: string) => 
    toast.success(`⭐ ${item ? `${item} destacado` : 'Destacado'} com sucesso!`),
  
  unfeature: (item?: string) => 
    toast.success(`📌 ${item ? `${item} removido dos destaques` : 'Removido dos destaques'} com sucesso!`),

  // Loading toasts
  loading: {
    save: (item?: string, id?: string) => 
      toast.loading(`💾 Salvando ${item ? item.toLowerCase() : ''}...`, { id }),
    
    update: (item?: string, id?: string) => 
      toast.loading(`🔄 Atualizando ${item ? item.toLowerCase() : ''}...`, { id }),
    
    create: (item?: string, id?: string) => 
      toast.loading(`➕ Criando ${item ? item.toLowerCase() : ''}...`, { id }),
    
    delete: (item?: string, id?: string) => 
      toast.loading(`🗑️ Excluindo ${item ? item.toLowerCase() : ''}...`, { id }),
    
    upload: (item?: string, id?: string) => 
      toast.loading(`⬆️ Enviando ${item ? item.toLowerCase() : ''}...`, { id }),
    
    processing: (action?: string, id?: string) => 
      toast.loading(`⚙️ ${action ? `${action}...` : 'Processando...'}`, { id }),
  },

  // Error toasts
  error: {
    save: (item?: string, id?: string) => 
      toast.error(`❌ Erro ao salvar ${item ? item.toLowerCase() : ''}`, { id }),
    
    update: (item?: string, id?: string) => 
      toast.error(`❌ Erro ao atualizar ${item ? item.toLowerCase() : ''}`, { id }),
    
    create: (item?: string, id?: string) => 
      toast.error(`❌ Erro ao criar ${item ? item.toLowerCase() : ''}`, { id }),
    
    delete: (item?: string, id?: string) => 
      toast.error(`❌ Erro ao excluir ${item ? item.toLowerCase() : ''}`, { id }),
    
    load: (item?: string, id?: string) => 
      toast.error(`❌ Erro ao carregar ${item ? item.toLowerCase() : ''}`, { id }),
    
    upload: (item?: string, id?: string) => 
      toast.error(`❌ Erro ao enviar ${item ? item.toLowerCase() : ''}`, { id }),
    
    generic: (message: string, id?: string) => 
      toast.error(`❌ ${message}`, { id }),
  },

  // Info/Warning toasts
  info: (message: string, id?: string) => 
    toast(`ℹ️ ${message}`, { id }),
  
  warning: (message: string, id?: string) => 
    toast(`⚠️ ${message}`, { 
      id,
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: 'white',
      },
    }),

  // Logout specific
  logout: {
    loading: () => toast.loading('🚪 Saindo...', { id: 'logout' }),
    success: () => toast.success('✅ Desconectado com sucesso!', { id: 'logout' }),
    error: () => toast.error('❌ Erro ao desconectar', { id: 'logout' }),
  },

  // Validation errors
  validation: (message: string) => 
    toast.error(`⚠️ ${message}`, {
      style: {
        background: '#f59e0b',
        color: 'white',
      },
    }),
}

// Export the original toast for custom cases
export { toast }
export default adminToast
