# TikTok Events API Setup Guide

## Overview
TikTok Events API memungkinkan server-side event tracking yang lebih reliable dibanding client-side pixel tracking saja. Setup ini menggunakan hybrid approach: client-side pixel untuk real-time tracking dan server-side API untuk reliability.

## Configuration

### Required Information
- **Pixel ID:** `D5M7DLBC77U27TJUP94G`
- **Access Token:** `64ac2424439fdb5e9650453f09da0744d2af4569`
- **API Endpoint:** `https://business-api.tiktok.com/open_api/v1.3/event/track/`
- **Test Event Code:** `TEST37883` (untuk testing Events API)

## Environment Variables Setup

### Local Development (.env.local)

Create atau update file `.env.local` di root project:

```env
# TikTok Events API Access Token
TIKTOK_EVENTS_API_TOKEN=64ac2424439fdb5e9650453f09da0744d2af4569

# TikTok Test Mode (optional - set to 'true' to enable test event code for all events)
TIKTOK_TEST_MODE=false
```

**Important:** 
- Jangan commit file `.env.local` ke Git (sudah ada di `.gitignore`)
- Access token harus dirahasiakan dan tidak boleh exposed ke client-side

### Cloudflare Pages (Production)

1. **Login ke Cloudflare Dashboard**
   - Buka [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pilih "Pages" → Project `wedison-hanindo`

2. **Add Environment Variable**
   - Klik "Settings" → "Environment variables"
   - Klik "Add variable"
   - **Variable name:** `TIKTOK_EVENTS_API_TOKEN`
   - **Value:** `64ac2424439fdb5e9650453f09da0744d2af4569`
   - **Environment:** Pilih "Production" (dan "Preview" jika perlu)
   - Klik "Save"

3. **Redeploy**
   - Setelah add environment variable, trigger deployment baru
   - Environment variable akan tersedia di API routes

## Events Tracked

### 1. ViewContent (Page Views)
- **Trigger:** Automatic pada setiap page load
- **Implementation:** `TikTokPageView` component di `app/layout.tsx`
- **Event:** `ViewContent`
- **Parameters:** `content_type: 'page'`, `content_name: document.title`, `url: current URL`

### 2. ClickButton (WhatsApp Clicks)
- **Trigger:** Saat user klik WhatsApp button
- **Implementation:** `trackWhatsAppClick()` function
- **Event:** `ClickButton`
- **Parameters:** `content_type: 'whatsapp_click'`, `content_name: source location`

### 3. Lead (Form Submissions)
- **Trigger:** Saat user submit lead form
- **Implementation:** `trackLeadFormSubmit()` function
- **Event:** `Lead`
- **Parameters:** `content_type: 'form_submission'`, `content_name: program`, `content_id: model (if selected)`

## API Route

### Endpoint
```
POST /api/tiktok-events
```

### Request Body
```json
{
  "event": "ViewContent" | "ClickButton" | "Lead",
  "event_time": 1234567890,
  "event_id": "unique-event-id",
  "test_event_code": "TEST37883",
  "user": {
    "email": "hashed_email",
    "phone": "hashed_phone",
    "external_id": "user_id"
  },
  "properties": {
    "content_id": "product-id",
    "content_type": "product",
    "content_name": "Product Name",
    "value": 100.00,
    "currency": "IDR",
    "url": "https://wedison.co/page"
  }
}
```

**Note:** `test_event_code` adalah optional. Jika disertakan, event akan muncul di TikTok Event Manager sebagai test event untuk verifikasi.

### Response
```json
{
  "success": true,
  "message": "Event sent to TikTok Events API",
  "test_mode": false,
  "test_event_code": "TEST37883",
  "data": { ... }
}
```

## Testing with Test Event Code

### Test Event Code: `TEST37883`

Test event code memungkinkan Anda test Events API dan melihat events muncul di TikTok Event Manager untuk verifikasi.

### Cara Menggunakan Test Event Code

#### Option 1: Via Environment Variable (Global Test Mode)
Set `TIKTOK_TEST_MODE=true` di environment variables untuk enable test mode untuk semua events.

**Local Development (.env.local):**
```env
TIKTOK_TEST_MODE=true
```

**Cloudflare Pages:**
- Add environment variable: `TIKTOK_TEST_MODE` = `true`
- Semua events akan otomatis include test event code

#### Option 2: Via Function Parameter (Per-Event)
Pass `testMode: true` ke tracking functions:

```typescript
// Test WhatsApp click
trackWhatsAppClick('navbar', true)

// Test form submission
trackLeadFormSubmit('cash', 'edpower', true)

// Test page view
trackPageViewAPI(undefined, true)
```

#### Option 3: Via API Request (Direct)
Include `test_event_code` di request body:

```json
{
  "event": "ViewContent",
  "test_event_code": "TEST37883",
  "properties": {
    "content_type": "page",
    "content_name": "Test Page"
  }
}
```

### Verify Test Events

1. **Send test event** dengan test event code
2. **Buka TikTok Event Manager** → Events → Test Events
3. **Events dengan test code** akan muncul di section "Test Events"
4. **Verify** bahwa event structure dan parameters sudah benar

**Important:** 
- Test events hanya muncul di "Test Events" section, tidak di "Recent Activities"
- Test events tidak akan mempengaruhi campaign optimization atau reporting
- Setelah testing selesai, disable test mode untuk production

## Testing

### 1. Test API Route Locally

```bash
# Start dev server
npm run dev

# Test in another terminal (normal mode)
curl -X POST http://localhost:3000/api/tiktok-events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ViewContent",
    "properties": {
      "content_type": "page",
      "content_name": "Test Page",
      "url": "http://localhost:3000"
    }
  }'

# Test with test event code
curl -X POST http://localhost:3000/api/tiktok-events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ViewContent",
    "test_event_code": "TEST37883",
    "properties": {
      "content_type": "page",
      "content_name": "Test Page",
      "url": "http://localhost:3000"
    }
  }'
```

### 2. Test in Browser

1. Buka website di browser
2. Open Developer Tools (F12) → Console
3. Klik WhatsApp button
4. Check Network tab → filter "tiktok-events" → verify request terkirim
5. Check TikTok Event Manager → Events → Recent Activities (tunggu max 30 menit)

### 3. Verify Events in TikTok Event Manager

1. Login ke TikTok Ads Manager
2. Go to Events → Manage
3. Check "Recent Activities" tab
4. Events seharusnya muncul dengan:
   - **ViewContent** - untuk page views
   - **ClickButton** - untuk WhatsApp clicks
   - **Lead** - untuk form submissions

## Troubleshooting

### Events Tidak Muncul di TikTok Event Manager

1. **Check Environment Variable**
   - Pastikan `TIKTOK_EVENTS_API_TOKEN` sudah di-set di Cloudflare Pages
   - Pastikan value token benar

2. **Check API Route**
   - Test API route langsung: `curl -X POST https://your-domain.com/api/tiktok-events`
   - Check Cloudflare Pages Functions logs untuk errors

3. **Check Browser Console**
   - Pastikan tidak ada JavaScript errors
   - Check Network tab untuk failed requests

4. **Delay**
   - TikTok Events API bisa delay hingga 30 menit sebelum muncul di dashboard
   - Tunggu dan cek lagi setelah beberapa menit

### API Route Returns 500 Error

1. **Check Access Token**
   - Pastikan token valid dan tidak expired
   - Generate new token di TikTok Event Manager jika perlu

2. **Check Payload Structure**
   - Pastikan payload sesuai dengan TikTok Events API format
   - Check API route logs untuk error details

## Security Notes

- **Never expose access token** di client-side code
- Access token hanya digunakan di server-side API route
- Token disimpan sebagai environment variable (tidak di commit ke Git)
- API route berfungsi sebagai proxy untuk keep token secure

## References

- [TikTok Events API Documentation](https://ads.tiktok.com/help/article/standard-events-api)
- [TikTok Events API Payload Helper](https://ads.tiktok.com/help/article/payload-helper)
