'use client'

/**
 * MetaPixel — FURŌ / Noki
 * Pixel ID: 946261648306071
 *
 * INSTALACIÓN:
 * 1. Este archivo ya está en: components/MetaPixel.tsx ✓
 * 2. <MetaPixel /> ya está en app/layout.tsx ✓
 * 3. NEXT_PUBLIC_META_PIXEL_ID=946261648306071 ya está en Vercel env vars ✓
 * 4. Para trackear leads: importa trackLead() y llámala al enviar el formulario Noki
 *
 * Ejemplo en el handler del formulario:
 *   import { trackLead } from '@/components/MetaPixel'
 *   await enviarFormulario(data)
 *   trackLead({ content_name: 'Formulario Noki' })
 */

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

type FbqEvent =
  | 'PageView'
  | 'Lead'
  | 'Contact'
  | 'Schedule'
  | 'ViewContent'
  | 'InitiateCheckout'

declare global {
  interface Window {
    fbq: (action: string, event: FbqEvent | string, params?: object) => void
    _fbq: unknown
  }
}

export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

export function trackLead(params?: { content_name?: string; content_category?: string }) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', params)
  }
}

export function trackSchedule() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Schedule')
  }
}

export function trackContact() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact')
  }
}

export function MetaPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

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
    </>
  )
}
