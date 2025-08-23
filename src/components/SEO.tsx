import { useEffect } from 'react'
import { MetaTag } from '../lib/supabase'

interface SEOProps {
  metaTag?: MetaTag
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonical?: string
  schemaMarkup?: any
}

export const SEO = ({ 
  metaTag, 
  title, 
  description, 
  keywords, 
  ogImage, 
  canonical,
  schemaMarkup 
}: SEOProps) => {
  useEffect(() => {
    const finalTitle = metaTag?.page_title || title || 'Prime Luthieria'
    const finalDescription = metaTag?.meta_description || description || 'Especialistas em manutenção e conserto de instrumentos musicais'
    const finalKeywords = metaTag?.meta_keywords || keywords
    const finalOgImage = metaTag?.og_image || ogImage
    const finalCanonical = metaTag?.canonical_url || canonical
    const finalSchema = metaTag?.schema_json || schemaMarkup

    // Set title
    document.title = finalTitle

    // Set meta tags
    setMetaTag('description', finalDescription)
    setMetaTag('keywords', finalKeywords)
    setMetaTag('robots', metaTag?.robots || 'index,follow')

    // Set Open Graph tags
    setMetaTag('og:title', metaTag?.og_title || finalTitle, 'property')
    setMetaTag('og:description', metaTag?.og_description || finalDescription, 'property')
    setMetaTag('og:type', metaTag?.og_type || 'website', 'property')
    setMetaTag('og:url', window.location.href, 'property')
    
    if (finalOgImage) {
      setMetaTag('og:image', finalOgImage, 'property')
    }

    // Set canonical URL
    if (finalCanonical) {
      setCanonicalTag(finalCanonical)
    }

    // Set schema markup
    if (finalSchema) {
      setSchemaMarkup(finalSchema)
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image', 'name')
    setMetaTag('twitter:title', finalTitle, 'name')
    setMetaTag('twitter:description', finalDescription, 'name')
    
    if (finalOgImage) {
      setMetaTag('twitter:image', finalOgImage, 'name')
    }

  }, [metaTag, title, description, keywords, ogImage, canonical, schemaMarkup])

  const setMetaTag = (name: string, content?: string, attribute = 'name') => {
    if (!content) return

    let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute(attribute, name)
      document.head.appendChild(tag)
    }
    tag.content = content
  }

  const setCanonicalTag = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }

  const setSchemaMarkup = (schema: any) => {
    // Remove existing schema
    const existing = document.querySelector('script[type="application/ld+json"]')
    if (existing) {
      existing.remove()
    }

    // Add new schema
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  }

  return null
}