import { NextResponse } from 'next/server'

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge'

const TIKTOK_PIXEL_ID = 'D5M7DLBC77U27TJUP94G'
const TIKTOK_EVENTS_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'

interface TikTokEventData {
  event: string
  event_time?: number
  event_id?: string
  user?: {
    ip?: string
    user_agent?: string
    email?: string
    phone?: string
    external_id?: string
  }
  properties?: {
    content_id?: string
    content_type?: string
    content_name?: string
    value?: number
    currency?: string
    url?: string
  }
}

interface TikTokEventsPayload {
  event_source: string
  event_source_id: string
  data: Array<{
    event: string
    event_time: number
    event_id?: string
    user: {
      ip?: string
      user_agent?: string
      email?: string
      phone?: string
      external_id?: string
    }
    properties?: {
      content_id?: string
      content_type?: string
      content_name?: string
      value?: number
      currency?: string
      url?: string
    }
  }>
}

export async function POST(request: Request) {
  try {
    // Get access token from environment variable
    const accessToken = process.env.TIKTOK_EVENTS_API_TOKEN
    
    if (!accessToken) {
      console.error('TikTok Events API token not configured')
      return NextResponse.json(
        { error: 'TikTok Events API token not configured' },
        { status: 500 }
      )
    }

    // Get event data from request body
    const eventData: TikTokEventData = await request.json()
    
    // Get client IP and user agent from request headers
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const url = request.headers.get('referer') || 'unknown'

    // Build TikTok Events API payload
    const payload: TikTokEventsPayload = {
      event_source: 'web',
      event_source_id: TIKTOK_PIXEL_ID,
      data: [
        {
          event: eventData.event,
          event_time: eventData.event_time || Math.floor(Date.now() / 1000),
          event_id: eventData.event_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          user: {
            ip: eventData.user?.ip || clientIP.split(',')[0].trim(),
            user_agent: eventData.user?.user_agent || userAgent,
            ...(eventData.user?.email && { email: eventData.user.email }),
            ...(eventData.user?.phone && { phone: eventData.user.phone }),
            ...(eventData.user?.external_id && { external_id: eventData.user.external_id }),
          },
          ...(eventData.properties && {
            properties: {
              ...(eventData.properties.content_id && { content_id: eventData.properties.content_id }),
              ...(eventData.properties.content_type && { content_type: eventData.properties.content_type }),
              ...(eventData.properties.content_name && { content_name: eventData.properties.content_name }),
              ...(eventData.properties.value !== undefined && { value: eventData.properties.value }),
              ...(eventData.properties.currency && { currency: eventData.properties.currency }),
              ...(eventData.properties.url && { url: eventData.properties.url }),
              url: eventData.properties.url || url,
            },
          }),
        },
      ],
    }

    // Send POST request to TikTok Events API
    const response = await fetch(TIKTOK_EVENTS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('TikTok Events API error:', responseData)
      return NextResponse.json(
        { error: 'TikTok Events API error', details: responseData },
        { status: response.status }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event sent to TikTok Events API',
      data: responseData 
    })

  } catch (err) {
    console.error('TikTok Events API route error:', err)
    return NextResponse.json(
      { error: 'Server error', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
