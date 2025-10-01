import { z } from 'zod'

const statusValues = ['active', 'archived'] as const

export const sitePayloadSchema = z.object({
  name: z.string().trim().min(2, 'Site name is required').max(120, 'Keep the name under 120 characters'),
  address: z.string().trim().min(5, 'Address is required').max(240, 'Keep the address under 240 characters'),
  status: z.enum(statusValues, { description: 'Site status' }).default('active')
})

export type SitePayload = z.infer<typeof sitePayloadSchema>
