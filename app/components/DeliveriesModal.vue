<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'max-w-4xl' }">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">
                Livraisons - {{ site.name }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ site.address }}
              </p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" square @click="isOpen = false" />
          </div>
        </template>

        <!-- Loading -->
        <div v-if="loading" class="py-12 text-center">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
          <p class="text-gray-600">Chargement des livraisons...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!deliveries.length" class="py-12 text-center">
          <UIcon name="i-lucide-package-x" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-gray-600">Aucune livraison enregistrée</p>
        </div>

        <!-- Deliveries Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="delivery in deliveries" :key="delivery.id"
            class="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
            @click="openPhoto(delivery.photoUrl)">
            <img :src="delivery.photoUrl" :alt="`Livraison du ${formatDate(delivery.capturedAt)}`"
              class="w-full h-48 object-cover">
            <div class="p-3">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                {{ formatDate(delivery.capturedAt) }}
              </div>
              <div v-if="delivery.metadata?.fileSize" class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <UIcon name="i-lucide-file" class="w-3 h-3" />
                {{ formatFileSize(delivery.metadata.fileSize) }}
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Site } from '../../types/site'
import type { DeliveryMetadata } from '../../types/delivery'

interface Props {
  site: Site
}

interface DeliveryDisplay {
  id: string
  photoUrl: string
  capturedAt: Date | string
  metadata: DeliveryMetadata | null
}

const props = defineProps<Props>()

const isOpen = defineModel<boolean>({ required: true })
const deliveries = ref<DeliveryDisplay[]>([])
const loading = ref(false)

// Load deliveries when modal opens (always refresh)
watch(isOpen, async (open) => {
  if (open) {
    await loadDeliveries()
  }
}, { immediate: true })

async function loadDeliveries() {
  loading.value = true
  try {
    const response = await $fetch<{ deliveries: DeliveryDisplay[] }>(`/api/sites/${props.site.id}/deliveries`)
    deliveries.value = response.deliveries
  }
  catch (error) {
    console.error('Failed to load deliveries:', error)
  }
  finally {
    loading.value = false
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString('fr-CA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function openPhoto(url: string) {
  window.open(url, '_blank')
}
</script>
