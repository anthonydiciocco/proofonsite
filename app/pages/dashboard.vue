<script setup lang="ts">
import { h, reactive, ref, computed, resolveComponent } from 'vue'
import { z } from 'zod'
import { useClipboard } from '@vueuse/core'
import { useRequestFetch, useToast } from '#imports'

import { useAuthUser } from '../../composables/useAuth'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Site, SiteStatus } from '~~/types/site'

definePageMeta({
  middleware: 'protected' as never
})

useHead({
  title: 'Dashboard — ProofOnSite'
})

const user = useAuthUser()
const { t } = useI18n()

const greeting = computed(() => user.value?.displayName ?? user.value?.email ?? t('dashboard.welcome'))

const { data: sitesData, error: sitesError, status: sitesStatus, refresh: refreshSites } = await useFetch<Site[]>(
  '/api/sites',
  {
    key: 'sites-dashboard',
    default: () => []
  }
)

const toast = useToast()
const requestFetch = useRequestFetch()
const { copy } = useClipboard({ legacy: true })

const searchTerm = ref('')
const statusFilter = ref<'all' | SiteStatus>('all')
const busySiteIds = ref<string[]>([])

const statusOptions = computed(() => [
  { label: t('dashboard.sites.status.all'), value: 'all' },
  { label: t('dashboard.sites.status.active'), value: 'active' },
  { label: t('dashboard.sites.status.archived'), value: 'archived' }
])

const sites = computed(() => sitesData.value ?? [])

const metrics = computed(() => {
  const all = sites.value.length
  const active = sites.value.filter(site => site.status === 'active').length
  const archived = sites.value.filter(site => site.status === 'archived').length

  const lastCreated = sites.value[0]?.createdAt
  const formattedLastCreated = lastCreated
    ? new Intl.DateTimeFormat('en-CA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(lastCreated))
    : 'No sites'

  return {
    total: all,
    active,
    archived,
    lastCreated: formattedLastCreated
  }
})

const filteredSites = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  const status = statusFilter.value

  return sites.value.filter((site) => {
    const matchesStatus = status === 'all' ? true : site.status === status
    if (!matchesStatus) {
      return false
    }

    if (!term) {
      return true
    }

    const haystack = [
      site.name,
      site.address,
      site.referenceCode
    ].join(' ').toLowerCase()

    return haystack.includes(term)
  })
})

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<Site>[] = [{
  accessorKey: 'name',
  header: () => t('dashboard.sites.columns.site'),
  meta: {
    style: {
      th: { width: '360px', minWidth: '360px', maxWidth: '360px' },
      td: { width: '360px', minWidth: '360px', maxWidth: '360px' }
    }
  },
  cell: ({ row }) => {
    const site = row.original
    return h('div', { class: 'space-y-1' }, [
      h('p', { class: 'font-medium text-[color:var(--ui-text-highlighted)] truncate' }, site.name),
      h('p', { class: 'text-sm text-[color:var(--ui-text-muted)] truncate' }, site.address)
    ])
  }
}, {
  accessorKey: 'referenceCode',
  header: () => t('dashboard.sites.columns.code'),
  meta: {
    style: {
      th: { width: '140px', minWidth: '140px' },
      td: { width: '140px', minWidth: '140px' }
    }
  },
  cell: ({ row }) => {
    const site = row.original
    return h('div', { class: 'flex items-center gap-1.5' }, [
      h('span', { class: 'font-semibold tracking-widest text-[color:var(--ui-text-highlighted)]' }, site.referenceCode),
      h(UButton, {
        ...{
          color: 'neutral',
          variant: 'ghost',
          size: 'xs',
          icon: 'i-lucide-copy',
          onClick: async () => {
            await copyReferenceCode(site)
          }
        },
        'aria-label': t('dashboard.sites.ariaLabels.copySiteCode')
      })
    ])
  }
}, {
  accessorKey: 'status',
  header: () => t('dashboard.sites.columns.status'),
  meta: {
    style: {
      th: { width: '100px', minWidth: '100px' },
      td: { width: '100px', minWidth: '100px' }
    }
  },
  cell: ({ row }) => {
    const site = row.original
    const variant = site.status === 'active' ? 'success' : 'neutral'
    const label = site.status === 'active' ? t('dashboard.sites.statusLabels.active') : t('dashboard.sites.statusLabels.archived')
    return h(
      UBadge,
      { color: variant, variant: 'subtle', class: 'capitalize' },
      () => label
    )
  }
}, {
  id: 'qrcode',
  header: () => t('dashboard.sites.columns.qrCode'),
  enableSorting: false,
  meta: {
    style: {
      th: { width: '110px', minWidth: '110px' },
      td: { width: '110px', minWidth: '110px' }
    }
  },
  cell: ({ row }) => {
    const site = row.original
    const busy = siteIsBusy(site.id)
    return h(UButton, {
      ...{
        color: 'primary',
        variant: 'outline',
        size: 'sm',
        icon: 'i-lucide-qr-code',
        loading: busy,
        disabled: busy,
        onClick: () => downloadQRCodePDF(site)
      },
      'aria-label': `Download QR code for ${site.name}`
    }, () => t('dashboard.sites.actions.downloadQR'))
  }
}, {
  id: 'deliveries',
  header: () => t('dashboard.sites.columns.deliveries'),
  enableSorting: false,
  meta: {
    style: {
      th: { width: '110px', minWidth: '110px' },
      td: { width: '110px', minWidth: '110px' }
    }
  },
  cell: ({ row }) => {
    const site = row.original
    const busy = siteIsBusy(site.id)
    return h(UButton, {
      ...{
        color: 'secondary',
        variant: 'outline',
        size: 'sm',
        icon: 'i-lucide-package',
        loading: busy,
        disabled: busy,
        onClick: () => openDeliveriesModal(site)
      },
      'aria-label': `View deliveries for ${site.name}`
    }, () => t('dashboard.sites.actions.view'))
  }
}, {
  id: 'actions',
  header: '',
  enableSorting: false,
  enableHiding: false,
  meta: {
    style: {
      th: { width: '60px', minWidth: '60px' },
      td: { width: '60px', minWidth: '60px' }
    }
  },
  cell: ({ row }) => {
    const site = row.original
    const busy = siteIsBusy(site.id)
    const items: DropdownMenuItem[][] = [[
      {
        label: t('dashboard.sites.actions.edit'),
        icon: 'i-lucide-pencil',
        disabled: busy,
        onSelect() {
          openEditSite(site)
        }
      },
      {
        label: site.status === 'active' ? t('dashboard.sites.actions.archive') : t('dashboard.sites.actions.reactivate'),
        icon: site.status === 'active' ? 'i-lucide-archive' : 'i-lucide-undo',
        disabled: busy,
        onSelect() {
          toggleSiteStatus(site)
        }
      }
    ], [
      {
        label: t('dashboard.sites.actions.delete'),
        icon: 'i-lucide-trash-2',
        color: 'error',
        disabled: busy,
        onSelect() {
          askDeleteSite(site)
        }
      }
    ]]

    return h('div', { class: 'flex justify-end' }, [
      h(UDropdownMenu, {
        items,
        content: { align: 'end', sideOffset: 6 }
      }, () => h(UButton, {
        ...{
          color: 'neutral',
          variant: 'ghost',
          icon: 'i-lucide-ellipsis-vertical',
          square: true,
          loading: busy,
          disabled: busy
        },
        'aria-label': t('dashboard.sites.ariaLabels.moreActions')
      }))
    ])
  }
}]

const getFormSchema = () => z.object({
  name: z
    .string()
    .min(2, t('dashboard.sites.validation.nameMin'))
    .max(120, t('dashboard.sites.validation.nameMax'))
    .transform(value => value.trim()),
  address: z
    .string()
    .min(5, t('dashboard.sites.validation.addressMin'))
    .max(240, t('dashboard.sites.validation.addressMax'))
    .transform(value => value.trim()),
  status: z.enum(['active', 'archived'] as const)
})

type SiteForm = z.infer<ReturnType<typeof getFormSchema>>
type SiteFormInput = z.input<ReturnType<typeof getFormSchema>>

const isFormOpen = ref(false)
const formSubmitting = ref(false)
const editingSite = ref<Site | null>(null)

// Deliveries modal
const deliveriesModalOpen = ref(false)
const selectedSite = ref<Site | null>(null)

const formState = reactive<SiteFormInput>({
  name: '',
  address: '',
  status: 'active'
})

function resetForm(site?: Site) {
  Object.assign(formState, {
    name: site?.name ?? '',
    address: site?.address ?? '',
    status: site?.status ?? 'active'
  })
}

function startCreateSite() {
  editingSite.value = null
  resetForm()
  isFormOpen.value = true
}

function openEditSite(site: Site) {
  editingSite.value = site
  resetForm(site)
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingSite.value = null
}

function siteIsBusy(id: string) {
  return busySiteIds.value.includes(id)
}

function setSiteBusy(id: string, busy: boolean) {
  if (busy) {
    if (!busySiteIds.value.includes(id)) {
      busySiteIds.value = [...busySiteIds.value, id]
    }
  } else {
    busySiteIds.value = busySiteIds.value.filter(current => current !== id)
  }
}

function handleRequestError(error: unknown, fallbackMessage: string) {
  type FetchErrorLike = {
    data?: { message?: string }
    statusMessage?: string
  }

  const fetchError = error as FetchErrorLike
  const message = fetchError.data?.message
    ?? fetchError.statusMessage
    ?? (error instanceof Error ? error.message : null)
    ?? fallbackMessage

  toast.add({
    title: t('common.error'),
    description: message,
    color: 'error'
  })
}

async function submitSite(event: { data?: SiteForm | null }) {
  if (!event.data) {
    return
  }

  formSubmitting.value = true

  const payload = {
    name: event.data.name,
    address: event.data.address,
    status: event.data.status
  }

  try {
    if (editingSite.value) {
      await requestFetch(`/api/sites/${editingSite.value.id}`, {
        method: 'PUT',
        body: payload
      })
      toast.add({
        title: t('dashboard.sites.toast.updated'),
        description: t('dashboard.sites.toast.updatedDescription'),
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } else {
      await requestFetch('/api/sites', {
        method: 'POST',
        body: payload
      })
      toast.add({
        title: t('dashboard.sites.toast.created'),
        description: t('dashboard.sites.toast.createdDescription'),
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    }

    closeForm()
    await refreshSites()
  } catch (error) {
    handleRequestError(error, t('dashboard.sites.toast.errorSave'))
  } finally {
    formSubmitting.value = false
  }
}

async function toggleSiteStatus(site: Site) {
  if (siteIsBusy(site.id)) {
    return
  }

  setSiteBusy(site.id, true)

  try {
    const nextStatus: SiteStatus = site.status === 'active' ? 'archived' : 'active'
    await requestFetch(`/api/sites/${site.id}`, {
      method: 'PUT',
      body: {
        name: site.name,
        address: site.address,
        status: nextStatus
      }
    })

    toast.add({
      title: nextStatus === 'active' ? t('dashboard.sites.toast.reactivated') : t('dashboard.sites.toast.archived'),
      description: nextStatus === 'active'
        ? t('dashboard.sites.toast.reactivatedDescription')
        : t('dashboard.sites.toast.archivedDescription'),
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    await refreshSites()
  } catch (error) {
    handleRequestError(error, t('dashboard.sites.toast.errorStatus'))
  } finally {
    setSiteBusy(site.id, false)
  }
}

const deleteModalOpen = ref(false)
const deleteInProgress = ref(false)
const sitePendingDeletion = ref<Site | null>(null)

function openDeliveriesModal(site: Site) {
  selectedSite.value = site
  deliveriesModalOpen.value = true
}

function askDeleteSite(site: Site) {
  sitePendingDeletion.value = site
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  sitePendingDeletion.value = null
}

async function deleteSite() {
  if (!sitePendingDeletion.value) {
    return
  }

  deleteInProgress.value = true

  try {
    await requestFetch(`/api/sites/${sitePendingDeletion.value.id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: t('dashboard.sites.toast.deleted'),
      description: t('dashboard.sites.toast.deletedDescription'),
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    closeDeleteModal()
    await refreshSites()
  } catch (error) {
    handleRequestError(error, t('dashboard.sites.toast.errorDelete'))
  } finally {
    deleteInProgress.value = false
  }
}

const isLoading = computed(() => sitesStatus.value === 'pending')
const emptyMessage = computed(() => {
  if (searchTerm.value) {
    return t('dashboard.sites.empty.search')
  }

  if (statusFilter.value === 'archived') {
    return t('dashboard.sites.empty.archived')
  }

  return t('dashboard.sites.empty.default')
})

const isFormEditing = computed(() => Boolean(editingSite.value))

const filterHasResults = computed(() => filteredSites.value.length > 0)

async function copyReferenceCode(site: Site) {
  await copy(site.referenceCode)
  toast.add({
    title: t('dashboard.sites.toast.codeCopied'),
    description: t('dashboard.sites.toast.codeDescription', { code: site.referenceCode }),
    color: 'success',
    icon: 'i-lucide-copy'
  })
}

async function downloadQRCodePDF(site: Site) {
  if (siteIsBusy(site.id)) {
    return
  }

  setSiteBusy(site.id, true)

  try {
    // Fetch PDF as blob directly
    const response = await fetch(`/api/sites/${site.id}/qr-pdf`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to generate PDF')
    }

    // Create blob from response
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    // Create temporary download link with accessible attributes
    const link = document.createElement('a')
    link.href = url
    link.download = `ProofOnSite-QR-${site.referenceCode}.pdf`
    link.setAttribute('aria-label', `Download QR code PDF for site ${site.name}`)

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.add({
      title: t('dashboard.sites.toast.qrReady'),
      description: t('dashboard.sites.toast.qrReadyDescription', { name: site.name }),
      color: 'success',
      icon: 'i-lucide-download'
    })
  } catch (error) {
    handleRequestError(error, t('dashboard.sites.toast.errorQR'))
  } finally {
    setSiteBusy(site.id, false)
  }
}

function refreshFilters() {
  searchTerm.value = ''
  statusFilter.value = 'all'
}
</script>

<template>
  <div class="pb-24">
    <UContainer class="space-y-10 py-12">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="space-y-2">
          <h1 class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
            {{ t('dashboard.hello', { name: greeting }) }}
          </h1>
          <p class="max-w-2xl text-sm text-[color:var(--ui-text-muted)]">
            {{ t('dashboard.subtitle') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton color="neutral" variant="outline" icon="i-lucide-rotate-cw" :loading="isLoading"
            @click="refreshSites">
            {{ t('common.refresh') }}
          </UButton>
          <UButton color="secondary" icon="i-lucide-plus" @click="startCreateSite">
            {{ t('dashboard.newSite') }}
          </UButton>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UCard class="bg-app-surface/90 cursor-pointer transition-all hover:ring-2 hover:ring-primary"
          @click="statusFilter = 'active'">
          <div class="space-y-2">
            <p class="text-sm text-[color:var(--ui-text-muted)]">
              {{ t('dashboard.metrics.activeSites') }}
            </p>
            <p class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
              {{ metrics.active }}
            </p>
            <p class="text-xs text-[color:var(--ui-text-muted)]">
              {{ t('dashboard.metrics.clickToFilter') }}
            </p>
          </div>
        </UCard>

        <UCard class="bg-app-surface/90 cursor-pointer transition-all hover:ring-2 hover:ring-primary"
          @click="statusFilter = 'archived'">
          <div class="space-y-2">
            <p class="text-sm text-[color:var(--ui-text-muted)]">
              {{ t('dashboard.metrics.archivedSites') }}
            </p>
            <p class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
              {{ metrics.archived }}
            </p>
            <p class="text-xs text-[color:var(--ui-text-muted)]">
              {{ t('dashboard.metrics.clickToFilter') }}
            </p>
          </div>
        </UCard>

        <UCard class="bg-app-surface/90 cursor-pointer transition-all hover:ring-2 hover:ring-primary"
          @click="statusFilter = 'all'">
          <div class="space-y-2">
            <p class="text-sm text-[color:var(--ui-text-muted)]">
              {{ t('dashboard.metrics.totalSites') }}
            </p>
            <p class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
              {{ metrics.total }}
            </p>
            <p class="text-xs text-[color:var(--ui-text-muted)]">
              {{ t('dashboard.metrics.clickToShowAll') }}
            </p>
          </div>
        </UCard>
      </div>

      <UCard class="bg-app-surface/90">
        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-1 flex-wrap items-center gap-3">
              <UInput v-model="searchTerm" :placeholder="t('dashboard.sites.searchPlaceholder')" icon="i-lucide-search"
                class="min-w-[240px] flex-1" />

              <URadioGroup v-model="statusFilter" :items="statusOptions" orientation="horizontal" variant="table"
                size="sm" />
            </div>

            <UButton v-if="searchTerm || statusFilter !== 'all'" color="neutral" variant="ghost" icon="i-lucide-eraser"
              @click="refreshFilters">
              {{ t('dashboard.sites.resetFilters') }}
            </UButton>
          </div>
          <div class="space-y-4">
            <UAlert v-if="sitesError" color="error" variant="subtle" :title="t('dashboard.sites.errors.loadTitle')"
              :description="t('dashboard.sites.errors.loadDescription')" />

            <UTable :data="filteredSites" :columns="columns" sticky class="min-h-[360px]" :loading="isLoading"
              :empty="emptyMessage" />

            <div v-if="!isLoading && !filterHasResults" class="rounded-lg border border-dashed border-accented p-6">
              <p class="text-center text-sm text-[color:var(--ui-text-muted)]">
                {{ emptyMessage }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </UContainer>

    <UModal v-model:open="isFormOpen" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <UCard>
          <div class="space-y-6">
            <div class="space-y-1">
              <h2 class="text-xl font-semibold text-[color:var(--ui-text-highlighted)]">
                {{ isFormEditing ? t('dashboard.sites.form.titleEdit') : t('dashboard.sites.form.titleNew') }}
              </h2>
              <p class="text-sm text-[color:var(--ui-text-muted)]">
                {{ t('dashboard.sites.form.subtitle') }}
              </p>
            </div>

            <UForm :state="formState" :schema="getFormSchema()" class="space-y-5" @submit="submitSite">
              <UFormField name="name" :label="t('dashboard.sites.form.nameLabel')" required>
                <UInput v-model="formState.name" :placeholder="t('dashboard.sites.form.namePlaceholder')" autofocus />
              </UFormField>

              <UFormField name="address" :label="t('dashboard.sites.form.addressLabel')" required>
                <UTextarea v-model="formState.address" :placeholder="t('dashboard.sites.form.addressPlaceholder')"
                  auto-resize :rows="2" />
              </UFormField>

              <UFormField name="status" :label="t('dashboard.sites.form.statusLabel')">
                <URadioGroup v-model="formState.status" orientation="horizontal" variant="table" size="sm" :items="[
                  { label: t('dashboard.sites.form.statusOptions.active'), value: 'active' },
                  { label: t('dashboard.sites.form.statusOptions.archived'), value: 'archived' }
                ]" />
              </UFormField>

              <div class="flex justify-end gap-3">
                <UButton color="neutral" variant="ghost" @click.prevent="closeForm">
                  {{ t('common.cancel') }}
                </UButton>
                <UButton type="submit" color="secondary" :loading="formSubmitting">
                  {{ isFormEditing ? t('dashboard.sites.form.saveButton') : t('dashboard.sites.form.createButton') }}
                </UButton>
              </div>
            </UForm>
          </div>
        </UCard>
      </template>
    </UModal>

    <UModal v-model:open="deleteModalOpen" :ui="{ content: 'max-w-lg' }">
      <template #content>
        <UCard>
          <div class="space-y-5">
            <UAlert color="error" variant="subtle" icon="i-lucide-alert-triangle"
              :title="t('dashboard.sites.delete.title')"
              :description="t('dashboard.sites.delete.description', { name: sitePendingDeletion?.name ?? '' })" />

            <p class="text-sm text-[color:var(--ui-text-muted)]">
              {{ t('dashboard.sites.delete.warning') }}
            </p>

            <div class="flex justify-end gap-3">
              <UButton color="neutral" variant="ghost" @click="closeDeleteModal">
                {{ t('common.cancel') }}
              </UButton>
              <UButton color="error" :loading="deleteInProgress" icon="i-lucide-trash-2" @click="deleteSite">
                {{ t('dashboard.sites.delete.confirmButton') }}
              </UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>

    <DeliveriesModal v-if="selectedSite" v-model="deliveriesModalOpen" :site="selectedSite" />
  </div>
</template>
