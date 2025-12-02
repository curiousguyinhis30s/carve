import type { Profile, ProfileLink } from '@/types/database'

export function generateVCard(profile: Profile, links: ProfileLink[]): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name}`,
  ]

  // Add name parts if available
  const nameParts = profile.name.split(' ')
  if (nameParts.length >= 2) {
    lines.push(`N:${nameParts.slice(1).join(' ')};${nameParts[0]};;;`)
  } else {
    lines.push(`N:;${profile.name};;;`)
  }

  // Add title and organization
  if (profile.title) {
    lines.push(`TITLE:${profile.title}`)
  }
  if (profile.company) {
    lines.push(`ORG:${profile.company}`)
  }

  // Add bio as note
  if (profile.bio) {
    lines.push(`NOTE:${profile.bio.replace(/\n/g, '\\n')}`)
  }

  // Add photo URL if available
  if (profile.avatar_url) {
    lines.push(`PHOTO;TYPE=URI:${profile.avatar_url}`)
  }

  // Add links
  links.forEach(link => {
    switch (link.type) {
      case 'email':
        lines.push(`EMAIL;TYPE=WORK:${link.url.replace('mailto:', '')}`)
        break
      case 'phone':
        lines.push(`TEL;TYPE=CELL:${link.url.replace('tel:', '')}`)
        break
      case 'whatsapp':
        // Extract phone number from WhatsApp URL
        const waMatch = link.url.match(/wa\.me\/(\d+)/)
        if (waMatch) {
          lines.push(`TEL;TYPE=CELL:+${waMatch[1]}`)
        }
        break
      case 'website':
        lines.push(`URL:${link.url}`)
        break
      case 'linkedin':
        lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${link.url}`)
        break
      case 'twitter':
        lines.push(`X-SOCIALPROFILE;TYPE=twitter:${link.url}`)
        break
      case 'instagram':
        lines.push(`X-SOCIALPROFILE;TYPE=instagram:${link.url}`)
        break
      case 'facebook':
        lines.push(`X-SOCIALPROFILE;TYPE=facebook:${link.url}`)
        break
      default:
        if (link.url.startsWith('http')) {
          lines.push(`URL:${link.url}`)
        }
    }
  })

  // Add profile URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  lines.push(`URL:${appUrl}/${profile.username}`)

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export function downloadVCard(profile: Profile, links: ProfileLink[]): void {
  const vcard = generateVCard(profile, links)
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${profile.name.replace(/\s+/g, '_')}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
