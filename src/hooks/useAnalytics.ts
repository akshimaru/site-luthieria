import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Generate or get session ID from localStorage
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Detect device type
const getDeviceType = (): string => {
  const width = window.innerWidth
  if (width <= 768) return 'mobile'
  if (width <= 1024) return 'tablet'
  return 'desktop'
}

// Extract browser info from user agent
const getBrowserInfo = (userAgent: string) => {
  const browsers = [
    { name: 'Chrome', pattern: /Chrome\/([0-9]+)/ },
    { name: 'Firefox', pattern: /Firefox\/([0-9]+)/ },
    { name: 'Safari', pattern: /Safari\/([0-9]+)/ },
    { name: 'Edge', pattern: /Edge\/([0-9]+)/ },
    { name: 'Opera', pattern: /Opera\/([0-9]+)/ }
  ]
  
  for (const browser of browsers) {
    if (browser.pattern.test(userAgent)) {
      return browser.name
    }
  }
  return 'Unknown'
}

// Extract OS info from user agent
const getOSInfo = (userAgent: string) => {
  if (/Windows/.test(userAgent)) return 'Windows'
  if (/Macintosh/.test(userAgent)) return 'macOS'
  if (/Linux/.test(userAgent)) return 'Linux'
  if (/Android/.test(userAgent)) return 'Android'
  if (/iPhone|iPad/.test(userAgent)) return 'iOS'
  return 'Unknown'
}

// Track page view
const trackPageView = async (sessionId: string, pagePath: string, pageTitle?: string) => {
  try {
    const userAgent = navigator.userAgent
    
    // Track page view
    const pageViewData = {
      session_id: sessionId,
      page_path: pagePath,
      page_title: pageTitle || document.title,
      referrer: document.referrer || null,
      user_agent: userAgent,
      device_type: getDeviceType(),
      browser: getBrowserInfo(userAgent),
      os: getOSInfo(userAgent),
    }

    await supabase.from('page_views').insert([pageViewData])

    // Update or create visitor record
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (existingVisitor) {
      // Update existing visitor
      await supabase
        .from('visitors')
        .update({
          last_visit: new Date().toISOString(),
          total_page_views: existingVisitor.total_page_views + 1,
          is_returning: true
        })
        .eq('session_id', sessionId)
    } else {
      // Create new visitor
      await supabase.from('visitors').insert([{
        session_id: sessionId,
        user_agent: userAgent,
        is_returning: false
      }])
    }
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// Hook to track page views
export const useAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    const sessionId = getSessionId()
    const pagePath = location.pathname + location.search
    
    // Track page view
    trackPageView(sessionId, pagePath)
    
    // Track time on page
    const startTime = Date.now()
    
    return () => {
      const duration = Math.round((Date.now() - startTime) / 1000)
      // Update duration (optional - could be done on page unload)
      if (duration > 5) { // Only track if spent more than 5 seconds
        supabase
          .from('page_views')
          .update({ duration_seconds: duration })
          .eq('session_id', sessionId)
          .eq('page_path', pagePath)
          .order('visited_at', { ascending: false })
          .limit(1)
      }
    }
  }, [location])
}

// Analytics data fetching functions for admin dashboard
export const getAnalyticsData = async (days: number = 7) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    // Get page views for the period
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('*')
      .gte('visited_at', startDate.toISOString())
      .order('visited_at', { ascending: false })

    if (pageViewsError) throw pageViewsError

    // Get unique visitors for the period
    const { data: visitors, error: visitorsError } = await supabase
      .from('visitors')
      .select('*')
      .gte('first_visit', startDate.toISOString())

    if (visitorsError) throw visitorsError

    // Calculate metrics
    const totalPageViews = pageViews?.length || 0
    const uniqueVisitors = visitors?.length || 0
    const returningVisitors = visitors?.filter(v => v.is_returning).length || 0
    const newVisitors = uniqueVisitors - returningVisitors

    // Top pages
    const pageStats = pageViews?.reduce((acc, view) => {
      acc[view.page_path] = (acc[view.page_path] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPages = Object.entries(pageStats || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    // Device breakdown
    const deviceStats = pageViews?.reduce((acc, view) => {
      acc[view.device_type] = (acc[view.device_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Daily breakdown
    const dailyStats = pageViews?.reduce((acc, view) => {
      const date = new Date(view.visited_at).toLocaleDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalPageViews,
      uniqueVisitors,
      newVisitors,
      returningVisitors,
      topPages,
      deviceStats,
      dailyStats,
      recentPageViews: pageViews?.slice(0, 50) || []
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return null
  }
}
