import { put } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { useDb } from '../../db'
import { deliveries, sites, users } from '../../db/schema'
import type { DeliveryMetadata } from '../../../types/delivery'
import { sendDeliveryNotification } from '../../utils/email'

// Validation schema
const captureSchema = z.object({
  photo: z.instanceof(Blob).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB max
    'Photo must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Photo must be JPEG, PNG, or WebP'
  )
})

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  const captureToken = getRouterParam(event, 'captureToken')

  if (!captureToken) {
    throw createError({
      statusCode: 400,
      message: 'Capture token is required'
    })
  }

  // 1. Find the site by captureToken
  const site = await db.query.sites.findFirst({
    where: eq(sites.captureToken, captureToken)
  })

  if (!site) {
    throw createError({
      statusCode: 404,
      message: 'Invalid capture token'
    })
  }

  // 🔒 Block archived sites
  if (site.status === 'archived') {
    throw createError({
      statusCode: 403,
      message: 'This site is archived. Contact your site manager to reactivate it.'
    })
  }

  // 2. Parse multipart form data
  const formData = await readFormData(event)
  const photoFile = formData.get('photo')

  if (!photoFile || !(photoFile instanceof Blob)) {
    throw createError({
      statusCode: 400,
      message: 'Photo file is required'
    })
  }

  // 3. Validate photo file
  const validation = captureSchema.safeParse({ photo: photoFile })

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: validation.error.errors[0].message
    })
  }

  try {
    // 4. Upload to Vercel Blob
    const filename = `site-${site.id}/${Date.now()}-${nanoid(8)}.jpg`
    const blob = await put(filename, photoFile, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    // 5. Prepare metadata
    const metadata: DeliveryMetadata = {
      fileSize: photoFile.size,
      mimeType: photoFile.type,
      originalFileName: photoFile instanceof File ? photoFile.name : undefined
    }

    // 6. Insert delivery record in database
    const deliveryId = nanoid()
    const [delivery] = await db.insert(deliveries).values({
      id: deliveryId,
      siteId: site.id,
      photoUrl: blob.url,
      metadata: JSON.stringify(metadata)
    }).returning()

    // 7. Send email notification (async, non-blocking)
    const owner = await db.query.users.findFirst({
      where: eq(users.id, site.ownerId)
    })

    if (owner?.email) {
      // Fire and forget - don't block the response
      sendDeliveryNotification({
        siteName: site.name,
        siteAddress: site.address,
        siteCode: site.referenceCode,
        photoUrl: blob.url,
        capturedAt: delivery.capturedAt,
        ownerEmail: owner.email,
        ccEmails: site.notificationEmails ?? []
      }).catch((error) => {
        console.error('Failed to send notification email:', error)
        // Don't fail the request if email fails
      })
    }

    return {
      success: true,
      delivery: {
        id: delivery.id,
        photoUrl: delivery.photoUrl,
        capturedAt: delivery.capturedAt
      }
    }
  }
  catch (error) {
    console.error('Error uploading delivery photo:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to upload photo'
    })
  }
})
