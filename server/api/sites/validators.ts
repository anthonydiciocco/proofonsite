import { z } from 'zod'

const statusValues = ['active', 'archived'] as const

const optionalContactField = (maxLength: number) => z.string().optional().transform((value, ctx) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (trimmed.length > maxLength) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: maxLength,
      type: 'string',
      inclusive: true,
      message: `Must be ${maxLength} characters or fewer`
    })
    return z.NEVER
  }

  return trimmed
})

const optionalNotesField = z.string().optional().transform((value, ctx) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (trimmed.length > 1000) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 1000,
      type: 'string',
      inclusive: true,
      message: 'Must be 1000 characters or fewer'
    })
    return z.NEVER
  }

  return trimmed
})

export const sitePayloadSchema = z.object({
  name: z.string().trim().min(2, 'Site name is required').max(120, 'Keep the name under 120 characters'),
  address: z.string().trim().min(5, 'Address is required').max(240, 'Keep the address under 240 characters'),
  status: z.enum(statusValues, { description: 'Site status' }).default('active'),
  contactName: optionalContactField(120),
  contactPhone: optionalContactField(32),
  notes: optionalNotesField
})

export type SitePayload = z.infer<typeof sitePayloadSchema>
