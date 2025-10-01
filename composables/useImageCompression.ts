/**
 * Fast image compression optimized for speed
 * Single-pass compression for minimal latency
 */
export async function compressImage(file: File, maxSizeKB = 500): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { alpha: false })

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Faster dimensions: max 1600px
        const maxWidth = 1600
        const maxHeight = 1600
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }

        canvas.width = width
        canvas.height = height

        // High quality draw
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Single-pass compression (0.8 quality = good balance)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          'image/jpeg',
          0.8
        )
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

export function useImageCompression() {
  const compress = async (file: File, maxSizeKB = 500) => {
    try {
      // Skip compression if already small
      if (file.size <= maxSizeKB * 1024) {
        return file
      }

      return await compressImage(file, maxSizeKB)
    }
    catch (error) {
      console.error('Compression failed:', error)
      // Fallback to original file
      return file
    }
  }

  return {
    compress
  }
}
