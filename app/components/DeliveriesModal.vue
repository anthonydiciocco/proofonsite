<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' }">
    <template #content>
      <UCard :ui="{ body: 'max-h-[calc(90vh-120px)] overflow-y-auto' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">
                {{ t('deliveries.title') }} - {{ site.name }}
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
          <p class="text-gray-600">{{ t('deliveries.loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!deliveries.length" class="py-12 text-center">
          <UIcon name="i-lucide-package-x" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-gray-600">{{ t('deliveries.noDeliveries') }}</p>
        </div>

        <!-- Deliveries Grid -->
        <div v-else>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="delivery in paginatedDeliveries" :key="delivery.id"
              class="group border border-gray-200 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform relative">
              <div class="relative cursor-pointer aspect-[3/4]" @click="openPhoto(delivery.photoUrl)">
                <img :src="delivery.photoUrl"
                  :alt="t('deliveries.deliveryFrom', { date: formatDate(delivery.capturedAt) })"
                  class="absolute inset-0 w-full h-full object-cover" @load="loadedImages.add(delivery.id)">
                <div v-if="!loadedImages.has(delivery.id)"
                  class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <UIcon name="i-lucide-image" class="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div class="p-3">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                      <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                      {{ formatDate(delivery.capturedAt) }}
                    </div>
                    <div v-if="delivery.metadata?.fileSize" class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <UIcon name="i-lucide-file" class="w-3 h-3" />
                      {{ formatFileSize(delivery.metadata.fileSize) }}
                    </div>
                  </div>
                  <UButton color="error" variant="ghost" icon="i-lucide-trash-2" size="xs" square
                    :loading="deletingDeliveryId === delivery.id" @click.stop="confirmDelete(delivery)" />
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-6 flex justify-center">
            <UPagination v-model="currentPage" :total="deliveries.length" :page-size="itemsPerPage" />
          </div>
        </div>
      </UCard>
    </template>
  </UModal>

  <!-- Delete Confirmation Modal -->
  <UModal v-model:open="deleteModalOpen">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-error" />
            <h3 class="text-lg font-semibold">{{ t('deliveries.delete.title') }}</h3>
          </div>
        </template>

        <p class="text-gray-600">{{ t('deliveries.delete.description') }}</p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" :label="t('common.cancel')" @click="deleteModalOpen = false" />
            <UButton color="error" :label="t('deliveries.delete.confirm') " :loading="deletingDeliveryId !== null"
              @click="deleteDelivery" />
          </div>
        </template>
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

const { t, locale } = useI18n()

const isOpen = defineModel<boolean>({ required: true })
const deliveries = ref<DeliveryDisplay[]>([])
const loading = ref(false)
const loadedImages = ref<Set<string>>(new Set())
const deletingDeliveryId = ref<string | null>(null)
const deliveryToDelete = ref<DeliveryDisplay | null>(null)
const deleteModalOpen = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20

const toast = useToast()

// Paginated deliveries
const paginatedDeliveries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return deliveries.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(deliveries.value.length / itemsPerPage))

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
  return new Date(date).toLocaleString(locale.value, {
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

function confirmDelete(delivery: DeliveryDisplay) {
  deliveryToDelete.value = delivery
  deleteModalOpen.value = true
}

async function deleteDelivery() {
  if (!deliveryToDelete.value) return

  deletingDeliveryId.value = deliveryToDelete.value.id
  try {
    await $fetch(`/api/sites/${props.site.id}/deliveries/${deliveryToDelete.value.id}`, {
      method: 'DELETE' as any
    })

    // Remove from local state
    deliveries.value = deliveries.value.filter(d => d.id !== deliveryToDelete.value!.id)

    toast.add({
      title: t('deliveries.toast.deleted'),
      icon: 'i-lucide-check-circle',
      color: 'success'
    })

    deleteModalOpen.value = false
    deliveryToDelete.value = null
  }
  catch (error) {
    console.error('Failed to delete delivery:', error)
    toast.add({
      title: t('deliveries.toast.errorDelete'),
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
  finally {
    deletingDeliveryId.value = null
  }
}
</script>
