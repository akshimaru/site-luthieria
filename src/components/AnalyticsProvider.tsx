import { useAnalytics } from '../hooks/useAnalytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  // Track analytics for all pages
  useAnalytics()
  
  return <>{children}</>
}
