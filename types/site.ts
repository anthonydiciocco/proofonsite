export type SiteStatus = 'active' | 'archived'

export interface Site {
  id: string
  ownerId: string
  name: string
  address: string
  status: SiteStatus
  referenceCode: string
  captureToken: string
  notificationEmails: string[]
  createdAt: string
  updatedAt: string
}

export interface SiteInput {
  name: string
  address: string
  status?: SiteStatus
  notificationEmails?: string[]
}
