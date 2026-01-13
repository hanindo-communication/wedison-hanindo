import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Get Google Sheets Web App URL from environment variable
    const webAppUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL

    if (!webAppUrl) {
      console.error('❌ GOOGLE_SHEETS_WEB_APP_URL is not configured')
      console.error('Please add NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL to .env.local')
      return NextResponse.json(
        { 
          error: 'Server configuration error: Google Sheets URL not configured',
          details: 'Please set NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL in environment variables'
        },
        { status: 500 }
      )
    }

    console.log('📤 Sending data to Google Sheets:', {
      url: webAppUrl,
      data: { ...formData, phone: formData.phone ? '[REDACTED]' : '' }
    })

    // Send data to Google Apps Script Web App
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    // Try to parse JSON response
    let result
    const responseText = await response.text()
    try {
      result = responseText ? JSON.parse(responseText) : { success: false }
    } catch (parseError) {
      console.error('❌ Failed to parse Google Sheets response:', parseError)
      console.error('Response text:', responseText)
      return NextResponse.json(
        { error: 'Invalid response from Google Sheets', details: responseText },
        { status: 500 }
      )
    }

    if (!response.ok || !result.success) {
      console.error('❌ Google Sheets API error:', {
        status: response.status,
        statusText: response.statusText,
        result
      })
      return NextResponse.json(
        { 
          error: result.error || 'Failed to save data to Google Sheets',
          details: result
        },
        { status: response.status || 500 }
      )
    }

    console.log('✅ Data successfully saved to Google Sheets')
    return NextResponse.json(
      { success: true, message: 'Data berhasil disimpan' },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Lead form submission error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
