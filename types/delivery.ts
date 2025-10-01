export interface Delivery {
  id: string
  siteId: string
  photoUrl: string
  capturedAt: Date
  metadata?: string | null
}

export interface DeliveryWithSite extends Delivery {
  site: {
    id: string
    name: string
    address: string
    referenceCode: string
  }
}

export interface DeliveryMetadata {
  fileSize?: number
  mimeType?: string
  compressedSize?: number
  originalFileName?: string
}
