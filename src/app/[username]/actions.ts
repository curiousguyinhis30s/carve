'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function trackProfileView(profileId: string) {
  try {
    const supabase = await createClient()
    const headersList = await headers()

    // Get visitor info from headers
    const userAgent = headersList.get('user-agent') || ''
    const referer = headersList.get('referer') || null

    // Detect device type from user agent
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
    const device = isMobile ? 'mobile' : 'desktop'

    // Detect browser
    let browser = 'unknown'
    if (userAgent.includes('Chrome')) browser = 'chrome'
    else if (userAgent.includes('Firefox')) browser = 'firefox'
    else if (userAgent.includes('Safari')) browser = 'safari'
    else if (userAgent.includes('Edge')) browser = 'edge'

    // Create a hash of the IP for privacy (we don't store actual IPs)
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipHash = forwardedFor
      ? Buffer.from(forwardedFor.split(',')[0]).toString('base64').slice(0, 16)
      : null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('profile_views').insert({
      profile_id: profileId,
      visitor_ip_hash: ipHash,
      device,
      browser,
      referrer: referer,
    })
  } catch (error) {
    // Silently fail - we don't want tracking to break the page
    console.error('Failed to track profile view:', error)
  }
}

export async function captureLeadAction(
  profileId: string,
  formData: FormData
) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const company = formData.get('company') as string | null
  const notes = formData.get('notes') as string | null

  if (!name) {
    return { error: 'Name is required' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('lead_captures').insert({
    profile_id: profileId,
    name,
    email,
    phone,
    company,
    notes,
  })

  if (error) {
    return { error: 'Failed to save contact' }
  }

  return { success: true }
}
