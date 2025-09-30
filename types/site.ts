export type SiteStatus = 'active' | 'archived'

export interface Site {
  id: string
  ownerId: string
  name: string
  address: string
  contactName: string | null
  contactPhone: string | null
  notes: string | null
  status: SiteStatus
  referenceCode: string
  captureToken: string
  createdAt: string
  updatedAt: string
}

export interface SiteInput {
  name: string
  address: string
  contactName?: string | null
  contactPhone?: string | null
  notes?: string | null
  status?: SiteStatus
}
