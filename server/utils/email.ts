import { Resend } from 'resend'
import { FEATURES } from './features'

// Read and normalize the API key. Some dotenv setups keep surrounding quotes,
// so strip them and whitespace to avoid subtle "invalid key" issues.
const rawKey = process.env.RESEND_API_KEY ?? ''
const RESEND_API_KEY = rawKey.replace(/^"|"$/g, '').trim()
const isResendKeySet = RESEND_API_KEY.length > 0

if (!isResendKeySet) {
  // Log once at startup to make missing keys obvious in server logs
  console.error(
    '⚠️ RESEND_API_KEY is not set or empty. Email sending will be disabled. Set RESEND_API_KEY in your environment (.env) with your Resend API key.'
  )
}

const resend = isResendKeySet ? new Resend(RESEND_API_KEY) : null

export interface DeliveryNotificationData {
  siteName: string
  siteAddress: string
  siteCode: string
  photoUrl: string
  capturedAt: Date
  ownerEmail: string
  ccEmails: string[]
}

export async function sendDeliveryNotification(data: DeliveryNotificationData) {
  // Feature flag: Email notifications disabled for MVP
  if (!FEATURES.EMAIL_NOTIFICATIONS_ENABLED) {
    console.log('ℹ️ Email notifications are disabled (feature flag). Skipping notification.')
    return { success: false, error: new Error('Email notifications disabled via feature flag') }
  }

  if (!isResendKeySet || !resend) {
    const msg = 'RESEND_API_KEY is missing; cannot send email.'
    console.error('❌', msg)
    return { success: false, error: new Error(msg) }
  }
  const subject = `📦 Nouvelle livraison — ${data.siteName} (${data.siteCode})`

  const formattedDate = new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Toronto'
  }).format(data.capturedAt)

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Nouvelle livraison enregistrée</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2c3e50 0%, #1a2833 100%); border-radius: 12px; padding: 40px 24px; margin-bottom: 24px; text-align: center; box-shadow: 0 4px 20px rgba(44, 62, 80, 0.15);">
          <div style="margin-bottom: 16px;">
            <span style="font-size: 48px; line-height: 1;">📦</span>
          </div>
          <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
            Nouvelle livraison enregistrée
          </h1>
          <p style="margin: 0; color: #cbd5e1; font-size: 15px;">
            ${formattedDate}
          </p>
        </div>

        <!-- Site Information -->
        <div style="background: #ffffff; border-radius: 12px; padding: 28px; margin-bottom: 20px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
          <div style="border-left: 4px solid #2f66b0; padding-left: 16px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Chantier
            </h2>
            <p style="margin: 0 0 4px; font-size: 20px; color: #0f172a; font-weight: 600; line-height: 1.3;">
              ${data.siteName}
            </p>
            <p style="margin: 0 0 8px; font-size: 15px; color: #64748b; line-height: 1.5;">
              ${data.siteAddress}
            </p>
            <p style="margin: 0 0 20px; font-size: 14px; color: #94a3b8;">
              Code référence: <span style="font-weight: 600; font-family: 'Courier New', monospace; letter-spacing: 0.5px; color: #2c3e50;">${data.siteCode}</span>
            </p>
            <div style="text-align: left;">
              <a
                href="${process.env.APP_URL}/dashboard"
                style="display: inline-block; color: #ffffff; background-color: #2f66b0; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 6px;"
              >
                Voir la photo →
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e5e7eb; text-align: center;">
          <p style="margin: 0 0 16px; font-size: 14px; color: #64748b; font-weight: 500;">
            ProofOnSite — Preuve visuelle pour chaque livraison
          </p>
          <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
            Vous recevez cet email car vous êtes le gestionnaire du chantier <strong style="color: #2c3e50;">${data.siteName}</strong>.
          </p>
        </div>
      </body>
    </html>
  `

  // Plain text fallback
  const text = `
📦 Nouvelle livraison enregistrée

${formattedDate}

CHANTIER
${data.siteName}
${data.siteAddress}
Code référence: ${data.siteCode}

PHOTO DE LIVRAISON DISPONIBLE
Consultez la photo et les détails complets dans votre tableau de bord:
${process.env.APP_URL}/dashboard

---
ProofOnSite — Preuve visuelle pour chaque livraison
Vous recevez cet email car vous êtes le gestionnaire du chantier ${data.siteName}.
  `.trim()

  try {
    const response = await resend.emails.send({
      from: 'ProofOnSite <hello@notifications.proofonsite.com>',
      to: [data.ownerEmail],
      cc: data.ccEmails.length > 0 ? data.ccEmails : undefined,
      replyTo: data.ownerEmail,
      subject,
      html,
      text
    })

    if (response.error) {
      console.error('❌ Resend API error:', response.error)
      return { success: false, error: response.error }
    }

    console.log('✅ Email notification sent:', response.data?.id)
    return { success: true, id: response.data?.id }
  } catch (error) {
    console.error('❌ Failed to send delivery notification:', error)
    return { success: false, error }
  }
}
