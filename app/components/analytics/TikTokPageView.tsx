'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageViewAPI } from '@/utils/analytics'

export default function TikTokPageView() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view via TikTok Events API
    trackPageViewAPI()
  }, [pathname])

  return null
}
