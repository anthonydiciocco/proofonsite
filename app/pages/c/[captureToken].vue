<template>
  <div class="min-h-screen bg-black flex flex-col">
    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-white animate-spin mx-auto mb-3" />
        <p class="text-white text-lg font-medium">{{ t('capture.loading') }}</p>
      </div>
    </div>

    <!-- Archived State -->
    <div v-else-if="isArchived" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center max-w-md bg-orange-600 p-8 rounded-2xl">
        <UIcon name="i-lucide-archive-x" class="w-16 h-16 text-white mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ t('capture.archivedSite') }}
        </h2>
        <p class="text-orange-100 text-lg">
          {{ t('capture.archivedSiteDescription') }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center max-w-md bg-red-600 p-8 rounded-2xl">
        <UIcon name="i-lucide-alert-circle" class="w-16 h-16 text-white mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ t('capture.invalidCode') }}
        </h2>
        <p class="text-red-100 text-lg">
          {{ t('capture.invalidCodeDescription') }}
        </p>
      </div>
    </div>

    <!-- Success State -->
    <div v-else-if="success" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center max-w-md bg-green-600 p-8 rounded-2xl">
        <UIcon name="i-lucide-check-circle" class="w-20 h-20 text-white mx-auto mb-4" />
        <h2 class="text-3xl font-bold text-white mb-3">
          {{ t('capture.sent') }}
        </h2>
        <p class="text-green-100 text-lg mb-8">
          {{ t('capture.successDescription') }}
        </p>
        <button
          class="w-full bg-white text-green-600 font-bold text-xl py-5 px-6 rounded-xl hover:bg-green-50 active:scale-95 transition-all shadow-lg"
          @click="resetCapture">
          {{ t('capture.newDelivery') }}
        </button>
      </div>
    </div>

    <!-- Capture Form -->
    <div v-else class="flex-1 flex flex-col p-4 gap-4">
      <!-- Photo Preview -->
      <div v-if="photoPreview" class="flex-1 flex flex-col gap-3">
        <div class="flex-1 bg-white rounded-2xl p-2 shadow-2xl">
          <img :src="photoPreview" alt="Aperçu" class="w-full h-full object-contain rounded-xl">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            class="bg-white/20 backdrop-blur text-white font-bold text-lg py-5 rounded-xl hover:bg-white/30 active:scale-95 transition-all"
            @click="clearPhoto">
            {{ t('capture.cancelButton') }}
          </button>
          <button :disabled="uploading"
            class="bg-green-500 text-white font-bold text-lg py-5 rounded-xl hover:bg-green-600 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            @click="uploadPhoto">
            {{ uploading ? t('capture.sendingButton') : t('capture.sendButton') }}
          </button>
        </div>
      </div>

      <!-- Camera Input (high contrast, no border) -->
      <div v-else class="flex-1 flex items-center justify-center">
        <label for="photo-input" class="cursor-pointer w-full h-full flex items-center justify-center">
          <div class="text-center active:scale-95 transition-transform">
            <div class="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-12 mb-6 shadow-2xl">
              <UIcon name="i-lucide-camera" class="w-32 h-32 text-black" />
            </div>
            <p class="text-white text-4xl font-black mb-3 tracking-tight">
              {{ t('capture.photoButton') }}
            </p>
            <p class="text-white/80 text-xl font-semibold">
              {{ t('capture.tapToCapture') }}
            </p>
          </div>
        </label>
        <input id="photo-input" ref="photoInput" type="file" accept="image/*" capture="environment" class="hidden"
          @change="handlePhotoSelect">
      </div>
    </div>

    <!-- Watermark footer -->
    <footer class="fixed bottom-0 left-0 right-0 py-4 flex items-center justify-center gap-2 pointer-events-none">
      <svg viewBox="0 0 270 256" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/20" fill="currentColor"
        aria-hidden="true">
        <path
          d="m113.9 50.05q0 0.07 0.05 0.13 0.05 0.05 0.12 0.07 0.07 0.01 0.13-0.02 0.07-0.03 0.1-0.1 5.9-13.62 16.85-25 18.51-19.25 44.96-23.48 4.53-0.73 13.39-1.16 2.01-0.1 12.1 1.45c18.94 2.91 37.13 14.72 49.04 29q11.88 14.24 16.04 31.42c7.08 29.27-1.99 57.37-20.25 80.42q-0.06 0.08-0.07 0.18-0.01 0.1 0.03 0.19 0.04 0.09 0.13 0.14 0.08 0.05 0.18 0.05h21.38q0.16 0 0.3 0.06 0.14 0.06 0.25 0.17 0.11 0.11 0.17 0.25 0.06 0.14 0.06 0.3 0.09 58.93-0.01 98.65c-0.02 7.76-4.96 12.95-12.73 12.95q-51.84 0.03-105.69 0.04-0.15 0-0.29-0.06-0.14-0.06-0.25-0.16-0.1-0.11-0.16-0.25-0.06-0.14-0.06-0.29v-54.77q0-0.17 0.1-0.3 0.09-0.14 0.25-0.2 0.15-0.06 0.32-0.02 0.16 0.04 0.27 0.16l25.7 28.01q0.25 0.27 0.56 0.49 0.3 0.22 0.64 0.37 0.34 0.15 0.71 0.22 0.36 0.08 0.73 0.08 23.86-0.04 53.29 0.05c9.49 0.02 9.88-4.85 9.96-12.75q0.27-26.74 0.09-45.22 0-0.12-0.05-0.23-0.04-0.11-0.13-0.19-0.08-0.09-0.2-0.13-0.11-0.05-0.23-0.05h-18.47q-0.2 0-0.4 0.04-0.2 0.05-0.38 0.13-0.19 0.08-0.35 0.21-0.16 0.12-0.29 0.27l-33.01 37.84q-0.2 0.23-0.47 0.36-0.27 0.13-0.57 0.15-0.31 0.02-0.59-0.09-0.29-0.1-0.51-0.31-2.77-2.58-4.59-4.63c-18.06-20.37-37.85-43.27-54.31-65.98q-8.26-11.42-13.53-24.26-0.06-0.14-0.15-0.25-0.09-0.11-0.21-0.19-0.12-0.09-0.26-0.13-0.14-0.04-0.29-0.04h-111.54q-0.2 0-0.38-0.07-0.18-0.08-0.32-0.22-0.14-0.13-0.21-0.31-0.08-0.18-0.08-0.38-0.15-75.01-0.04-98.37 0.03-7.96 6.4-11.58 2.66-1.51 10.42-1.42 10.31 0.13 95.59 0.03 0.15 0 0.29 0.06 0.14 0.06 0.25 0.16 0.1 0.11 0.16 0.25 0.06 0.14 0.06 0.29zm74.17 120.06c14.62-17.36 21.39-24.75 30.64-37.17 6.88-9.23 12.51-16.55 17.55-26.17 12.74-24.32 4.15-55.51-18.94-70.15-13.63-8.65-29.86-11.22-45.53-6.42q-21.01 6.45-31.73 27.83c-8.69 17.33-6.97 37.8 2.96 54.3q5.59 9.28 12.04 17.71 13.94 18.24 32.31 40.07 0.07 0.08 0.16 0.12 0.09 0.04 0.19 0.04 0.1 0 0.19-0.04 0.09-0.04 0.16-0.12zm-101.5-140.73q0-0.18-0.07-0.36-0.07-0.17-0.2-0.3-0.13-0.13-0.3-0.2-0.18-0.07-0.36-0.07h-56.88q-0.18 0-0.36 0.07-0.17 0.07-0.3 0.2-0.13 0.13-0.2 0.3-0.07 0.18-0.07 0.36v56.14q0 0.18 0.07 0.36 0.07 0.17 0.2 0.3 0.13 0.13 0.3 0.2 0.18 0.07 0.36 0.07h56.88q0.18 0 0.36-0.07 0.17-0.07 0.3-0.2 0.13-0.13 0.2-0.3 0.07-0.18 0.07-0.36z" />
        <path
          d="m182.62 122.28l-30.98-30.98q-0.13-0.13-0.19-0.29-0.07-0.16-0.07-0.34 0-0.18 0.07-0.34 0.06-0.16 0.19-0.29l15.17-15.17q0.13-0.13 0.29-0.19 0.16-0.07 0.34-0.07 0.18 0 0.34 0.07 0.16 0.06 0.29 0.19l14.76 14.76q0.13 0.13 0.29 0.19 0.16 0.07 0.34 0.07 0.18 0 0.34-0.07 0.16-0.06 0.29-0.19l29.16-29.16q0.13-0.13 0.29-0.19 0.16-0.07 0.34-0.07 0.18 0 0.34 0.07 0.16 0.06 0.29 0.19l14.96 14.96q0.13 0.13 0.19 0.29 0.07 0.16 0.07 0.34 0 0.18-0.07 0.34-0.06 0.16-0.19 0.29l-45.59 45.59q-0.13 0.13-0.29 0.19-0.16 0.07-0.34 0.07-0.18 0-0.34-0.07-0.16-0.06-0.29-0.19z" />
        <path
          d="m0.69 143.96q0-0.12 0.05-0.23 0.04-0.12 0.13-0.2 0.08-0.09 0.19-0.13 0.11-0.05 0.23-0.05h111.85q0.16 0 0.31 0.06 0.15 0.06 0.26 0.18 0.12 0.11 0.18 0.26 0.06 0.15 0.06 0.31v110.28q0 0.25-0.09 0.47-0.1 0.23-0.27 0.4-0.17 0.18-0.4 0.27-0.22 0.1-0.47 0.1-47.89 0.22-95.97 0-3.76-0.01-7.41-0.62-0.14-0.02-0.27-0.06-0.14-0.03-0.27-0.07-0.13-0.05-0.26-0.1-0.13-0.06-0.25-0.12-7.67-3.89-7.65-12.46 0.09-69.83 0.05-98.29zm85.94 27.47q0-0.17-0.07-0.33-0.06-0.16-0.18-0.29-0.13-0.12-0.29-0.18-0.16-0.07-0.33-0.07h-57.06q-0.17 0-0.33 0.07-0.16 0.06-0.29 0.18-0.12 0.13-0.18 0.29-0.07 0.16-0.07 0.33v57.06q0 0.17 0.07 0.33 0.06 0.16 0.18 0.29 0.13 0.12 0.29 0.18 0.16 0.07 0.33 0.07h57.06q0.17 0 0.33-0.07 0.16-0.06 0.29-0.18 0.12-0.13 0.18-0.29 0.07-0.16 0.07-0.33z" />
      </svg>
      <p class="text-white/20 text-xs font-medium tracking-wide">
        ProofOnSite
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Site } from '../../../types/site'
import { compressImage } from '../../../composables/useImageCompression'

definePageMeta({
  layout: 'minimal'
})

const { t, locale, setLocale, availableLocales } = useI18n()
const route = useRoute()
const captureToken = route.params.captureToken as string

// State
const site = ref<Site | null>(null)
const loading = ref(true)
const error = ref(false)
const isArchived = ref(false)
const success = ref(false)
const uploading = ref(false)
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const photoInput = ref<HTMLInputElement>()

// Detect and set browser language on mount
onMounted(async () => {
  // Auto-detect browser language for PWA
  detectAndSetBrowserLanguage()

  // Load site info
  try {
    const response = await $fetch<{ site: Site }>(`/api/capture/${captureToken}/info`)
    site.value = response.site
  }
  catch (err: any) {
    console.error('Failed to load site:', err)
    // Check if site is archived (403 error)
    if (err.statusCode === 403) {
      isArchived.value = true
    } else {
      error.value = true
    }
  }
  finally {
    loading.value = false
  }
})

/**
 * Detect browser language and set locale automatically
 * Priority: Cookie → Browser Language → Default
 */
function detectAndSetBrowserLanguage() {
  const cookie = useCookie('i18n_redirected', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax'
  })

  type LocaleCode = 'en' | 'fr' | 'es' | 'zh' | 'de' | 'pt'
  const locales = availableLocales as unknown as Array<{ code: LocaleCode; name: string }>
  const supportedCodes: LocaleCode[] = ['en', 'fr', 'es', 'zh', 'de', 'pt']

  // Priority 1: Check cookie
  if (cookie.value && supportedCodes.includes(cookie.value as LocaleCode)) {
    if (locale.value !== cookie.value) {
      setLocale(cookie.value as LocaleCode)
    }
    return
  }

  // Priority 2: Detect browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const parts = navigator.language.split('-')
    if (parts.length > 0 && parts[0]) {
      const browserLang = parts[0].toLowerCase() as LocaleCode

      if (supportedCodes.includes(browserLang)) {
        setLocale(browserLang)
        cookie.value = browserLang
      }
    }
  }
}

// Handle photo selection
async function handlePhotoSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert(t('capture.photoTooLarge'))
    return
  }

  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    alert(t('capture.unsupportedFormat'))
    return
  }

  // Compress image (target: <500KB)
  const compressedFile = await compressImage(file, 500)
  photoFile.value = compressedFile

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(compressedFile)
}

// Clear photo
function clearPhoto() {
  photoFile.value = null
  photoPreview.value = null
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

// Upload photo
async function uploadPhoto() {
  if (!photoFile.value) return

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('photo', photoFile.value)

    await $fetch(`/api/capture/${captureToken}`, {
      method: 'POST',
      body: formData
    })

    success.value = true
    clearPhoto()
  }
  catch (err: any) {
    console.error('Upload failed:', err)

    // Check if site was archived during upload
    if (err.statusCode === 403) {
      isArchived.value = true
    } else {
      alert(t('capture.uploadFailed'))
    }
  }
  finally {
    uploading.value = false
  }
}

// Reset capture state
function resetCapture() {
  success.value = false
  clearPhoto()
}
</script>
