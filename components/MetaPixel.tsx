'use client'

/**
 * MetaPixel — FURŌ / Noki
 * Pixel ID: 946261648306071
 *
 * Para trackear leads, importa trackLead() y llámala al enviar el formulario:
 *   import { trackLead } from '@/components/MetaPixel'
 *   trackLead({ content_name: 'Formulario Noki' })
 */

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

type FbqEvent = 'PageView' | 'Lead' | 'Contact' | 'Schedule' | 'ViewContent'

declare global {
  interface Window {
    fbq: (action: string, event: FbqEvent | string, params?: object) => void
    _fbq: unknown
  }
}

// ── Helpers exportables ───────────────────────────────────────────────────────

export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'PageView')
}

export function trackLead(params?: { content_name?: string; content_category?: string }) {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Lead', params)
}

export function trackSchedule() {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Schedule')
}

export function trackContact() {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Contact')
}

// ── Componente interno (usa useSearchParams — debe estar en Suspense) ─────────

function MetaPixelInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  return null
}

// ── Componente principal (exportado) ─────────────────────────────────────────

export function MetaPixel() {
  if (!PIXEL_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MetaPixel] NEXT_PUBLIC_META_PIXEL_ID no está definida.')
    }
    return null
  }

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;
              n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
              t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      {/* Suspense requerido por useSearchParams en Next.js App Router */}
      <Suspense fallback={null}>
        <MetaPixelInner />
      </Suspense>
    </>
  )
}
