import { defineEventHandler, getRouterParam, createError, setHeader } from 'h3'
import { eq } from 'drizzle-orm'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'

import { useDb } from '../../../db'
import { sites } from '../../../db/schema'
import { requireAuthUser } from '../../../utils/auth'

/**
 * Generate a minimalist printable PDF with QR code for site delivery capture
 *
 * Design philosophy: Simple, black & white, only essential information
 * Security: Validates site ownership before generation
 * Accessibility: High contrast, large text, clear hierarchy
 * UX: One-click download, descriptive filename
 */
export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const siteId = getRouterParam(event, 'id')

  if (!siteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Site ID is required'
    })
  }

  const db = useDb(event)

  // Security: Verify site ownership
  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.id, siteId))
    .limit(1)

  if (!site) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Site not found'
    })
  }

  if (site.ownerId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied'
    })
  }

  // Build secure capture URL with secret token
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig.public.appUrl || process.env.APP_URL || 'http://localhost:3000'
  const captureUrl = `${baseUrl}/c/${site.captureToken}`

  // Generate QR code with highest error correction (H = 30% recovery)
  // This allows the QR to work even if logo covers center or if damaged
  const qrCodeDataUrl = await QRCode.toDataURL(captureUrl, {
    width: 1000,
    margin: 1,
    errorCorrectionLevel: 'H', // Highest error correction for logo overlay
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  })

  // Create PDF with ultra-minimalist black & white design
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter' // 8.5" x 11"
  })

  const pageWidth = 8.5
  const centerX = pageWidth / 2

  // Instructions at top (clear, action-oriented, in French for Quebec)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('SCANNEZ POUR ENREGISTRER', centerX, 1.5, { align: 'center' })
  doc.text('UNE LIVRAISON', centerX, 2, { align: 'center' })

  // QR Code centered and extra large (6" x 6" for easy scanning from distance)
  const qrSize = 6
  const qrX = (pageWidth - qrSize) / 2
  const qrY = 2.5
  doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)

  // Site code (reference for verbal communication)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`Code: ${site.referenceCode}`, centerX, 9, { align: 'center' })

  // Branding (subtle, bottom of page)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text('ProofOnSite', centerX, 10.2, { align: 'center' })

  // Generate PDF buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

  // Set headers for secure download
  // Security: Prevent caching of PDF with sensitive tokens
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="QR-${site.referenceCode}.pdf"`)
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  return pdfBuffer
})
