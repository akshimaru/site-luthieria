import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface Alert {
  id: string
  type: AlertType
  title: string
  message?: string
  duration?: number // em milissegundos, 0 = não remove automaticamente
}

interface AlertProps {
  alert: Alert
  onClose: (id: string) => void
}

const AlertComponent = ({ alert, onClose }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Entrada com animação
    const timer = setTimeout(() => setIsVisible(true), 10)
    
    // Auto-close se duration especificado
    let autoCloseTimer: NodeJS.Timeout
    if (alert.duration && alert.duration > 0) {
      autoCloseTimer = setTimeout(() => {
        handleClose()
      }, alert.duration)
    }

    return () => {
      clearTimeout(timer)
      if (autoCloseTimer) clearTimeout(autoCloseTimer)
    }
  }, [alert.duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(alert.id)
    }, 300) // Duração da animação de saída
  }

  const getAlertStyles = () => {
    switch (alert.type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        }
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        }
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600'
        }
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: Info,
          iconColor: 'text-blue-600'
        }
    }
  }

  const styles = getAlertStyles()
  const Icon = styles.icon

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out mb-4 last:mb-0
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        ${styles.container}
        relative overflow-hidden
      `}>
        {/* Barra de progresso para auto-close */}
        {alert.duration && alert.duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 animate-pulse">
            <div 
              className="h-full bg-current opacity-60 animate-shrink"
              style={{ 
                animation: `shrink ${alert.duration}ms linear forwards` 
              }}
            />
          </div>
        )}
        
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${styles.iconColor}`} />
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold">
              {alert.title}
            </h3>
            {alert.message && (
              <p className="text-sm mt-1 opacity-80">
                {alert.message}
              </p>
            )}
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={handleClose}
              className="inline-flex text-current opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AlertContainerProps {
  alerts: Alert[]
  onCloseAlert: (id: string) => void
}

export const AlertContainer = ({ alerts, onCloseAlert }: AlertContainerProps) => {
  if (!alerts.length) return null

  return (
    <div className="fixed top-20 right-4 z-50 w-96 max-w-full">
      <div className="space-y-2">
        {alerts.map((alert) => (
          <AlertComponent
            key={alert.id}
            alert={alert}
            onClose={onCloseAlert}
          />
        ))}
      </div>
    </div>
  )
}

// Hook para gerenciar alertas
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = (alertData: Omit<Alert, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const alert: Alert = {
      id,
      duration: 5000, // 5 segundos por padrão
      ...alertData
    }
    
    setAlerts(prev => [alert, ...prev])
    return id
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  // Métodos de conveniência
  const showSuccess = (title: string, message?: string, duration?: number) => {
    return addAlert({ type: 'success', title, message, duration })
  }

  const showError = (title: string, message?: string, duration?: number) => {
    return addAlert({ type: 'error', title, message, duration: duration || 8000 })
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    return addAlert({ type: 'warning', title, message, duration })
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    return addAlert({ type: 'info', title, message, duration })
  }

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
