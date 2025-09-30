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
const greeting = computed(() => user.value?.displayName ?? user.value?.email ?? 'team member')

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

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' }
]

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
      site.referenceCode,
      site.contactName ?? '',
      site.contactPhone ?? ''
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
  header: 'Site',
  cell: ({ row }) => {
    const site = row.original
    return h('div', { class: 'space-y-1' }, [
      h('p', { class: 'font-medium text-[color:var(--ui-text-highlighted)]' }, site.name),
      h('p', { class: 'text-sm text-[color:var(--ui-text-muted)]' }, site.address)
    ])
  }
}, {
  accessorKey: 'referenceCode',
  header: 'Site code',
  cell: ({ row }) => {
    const site = row.original
    return h('div', { class: 'flex items-center gap-2' }, [
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
        'aria-label': 'Copy site code'
      })
    ])
  }
}, {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const site = row.original
    const variant = site.status === 'active' ? 'success' : 'neutral'
    const label = site.status === 'active' ? 'Active' : 'Archived'
    return h(
      UBadge,
      { color: variant, variant: 'subtle', class: 'capitalize' },
      () => label
    )
  }
}, {
  accessorKey: 'contactName',
  header: 'On-site contact',
  cell: ({ row }) => {
    const site = row.original
    if (!site.contactName && !site.contactPhone) {
      return h('span', { class: 'text-sm text-[color:var(--ui-text-muted)]' }, 'Not specified')
    }

    return h('div', { class: 'space-y-0.5' }, [
      site.contactName
        ? h('p', { class: 'text-sm font-medium text-[color:var(--ui-text-highlighted)]' }, site.contactName)
        : null,
      site.contactPhone
        ? h('p', { class: 'text-xs text-[color:var(--ui-text-muted)]' }, site.contactPhone)
        : null
    ])
  }
}, {
  accessorKey: 'createdAt',
  header: 'Created on',
  cell: ({ row }) => dateFormatter.format(new Date(row.original.createdAt))
}, {
  id: 'actions',
  header: '',
  enableSorting: false,
  enableHiding: false,
  cell: ({ row }) => {
    const site = row.original
    const busy = siteIsBusy(site.id)
    const items: DropdownMenuItem[][] = [[
      {
        label: 'Edit',
        icon: 'i-lucide-pencil',
        disabled: busy,
        onSelect() {
          openEditSite(site)
        }
      },
      {
        label: site.status === 'active' ? 'Archive' : 'Reactivate',
        icon: site.status === 'active' ? 'i-lucide-archive' : 'i-lucide-undo',
        disabled: busy,
        onSelect() {
          toggleSiteStatus(site)
        }
      }
    ], [
      {
        label: 'Delete',
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
        'aria-label': 'Actions'
      }))
    ])
  }
}]

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(120, 'Le nom doit contenir 120 caractères ou moins')
    .transform(value => value.trim()),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(240, 'Address must be 240 characters or less')
    .transform(value => value.trim()),
  status: z.enum(['active', 'archived'] as const),
  contactName: z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (typeof value !== 'string') {
        return null
      }

      const trimmed = value.trim()
      if (!trimmed) {
        return null
      }

      if (trimmed.length > 120) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: 120,
          type: 'string',
          inclusive: true,
          message: '120 character limit'
        })
        return z.NEVER
      }

      return trimmed
    }),
  contactPhone: z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (typeof value !== 'string') {
        return null
      }

      const trimmed = value.trim()
      if (!trimmed) {
        return null
      }

      if (trimmed.length > 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: 32,
          type: 'string',
          inclusive: true,
          message: '32 character limit'
        })
        return z.NEVER
      }

      return trimmed
    }),
  notes: z
    .string()
    .optional()
    .transform((value, ctx) => {
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
          message: '1000 character limit'
        })
        return z.NEVER
      }

      return trimmed
    })
})

type SiteForm = z.infer<typeof formSchema>
type SiteFormInput = z.input<typeof formSchema>

const isFormOpen = ref(false)
const formSubmitting = ref(false)
const editingSite = ref<Site | null>(null)

const formState = reactive<SiteFormInput>({
  name: '',
  address: '',
  status: 'active',
  contactName: '',
  contactPhone: '',
  notes: ''
})

function resetForm(site?: Site) {
  Object.assign(formState, {
    name: site?.name ?? '',
    address: site?.address ?? '',
    status: site?.status ?? 'active',
    contactName: site?.contactName ?? '',
    contactPhone: site?.contactPhone ?? '',
    notes: site?.notes ?? ''
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
    title: 'Error',
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
    status: event.data.status,
    contactName: event.data.contactName,
    contactPhone: event.data.contactPhone,
    notes: event.data.notes
  }

  try {
    if (editingSite.value) {
      await requestFetch(`/api/sites/${editingSite.value.id}`, {
        method: 'PUT',
        body: payload
      })
      toast.add({
        title: 'Site updated',
        description: 'Information saved.',
        color: 'success'
      })
    } else {
      await requestFetch('/api/sites', {
        method: 'POST',
        body: payload
      })
      toast.add({
        title: 'Site created',
        description: 'Print the QR code and share it with your team.',
        color: 'success'
      })
    }

    closeForm()
    await refreshSites()
  } catch (error) {
    handleRequestError(error, 'Unable to save the site.')
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
        status: nextStatus,
        contactName: site.contactName,
        contactPhone: site.contactPhone,
        notes: site.notes
      }
    })

    toast.add({
      title: nextStatus === 'active' ? 'Site reactivated' : 'Site archived',
      description: nextStatus === 'active'
        ? 'The site reappears in your active lists.'
        : 'You can reactivate it at any time.',
      color: 'success'
    })

    await refreshSites()
  } catch (error) {
    handleRequestError(error, 'Unable to update status.')
  } finally {
    setSiteBusy(site.id, false)
  }
}

const deleteModalOpen = ref(false)
const deleteInProgress = ref(false)
const sitePendingDeletion = ref<Site | null>(null)

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
      title: 'Site deleted',
      description: 'Site data has been removed.',
      color: 'success'
    })

    closeDeleteModal()
    await refreshSites()
  } catch (error) {
    handleRequestError(error, 'Unable to delete the site.')
  } finally {
    deleteInProgress.value = false
  }
}

const isLoading = computed(() => sitesStatus.value === 'pending')
const emptyMessage = computed(() => {
  if (searchTerm.value) {
    return 'No sites match your search.'
  }

  if (statusFilter.value === 'archived') {
    return 'No archived sites.'
  }

  return 'Add your first site to start collecting evidence.'
})

const isFormEditing = computed(() => Boolean(editingSite.value))

const filterHasResults = computed(() => filteredSites.value.length > 0)

async function copyReferenceCode(site: Site) {
  await copy(site.referenceCode)
  toast.add({
    title: 'Code copied',
    description: `The code ${site.referenceCode} is ready to be pasted.`,
    color: 'success'
  })
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
            Hello {{ greeting }}
          </h1>
          <p class="max-w-2xl text-sm text-[color:var(--ui-text-muted)]">
            Keep control of your sites, photo evidence and delivery tracking.
            Use personalized QR codes to speed up work on site.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton color="neutral" variant="outline" icon="i-lucide-rotate-cw" :loading="isLoading"
            @click="refreshSites">
            Refresh
          </UButton>
          <UButton color="secondary" icon="i-lucide-plus" @click="startCreateSite">
            New site
          </UButton>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UCard class="bg-app-surface/90">
          <div class="space-y-2">
            <p class="text-sm text-[color:var(--ui-text-muted)]">
              Active sites
            </p>
            <p class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
              {{ metrics.active }}
            </p>
          </div>
        </UCard>

        <UCard class="bg-app-surface/90">
          <div class="space-y-2">
            <p class="text-sm text-[color:var(--ui-text-muted)]">
              Archived sites
            </p>
            <p class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
              {{ metrics.archived }}
            </p>
          </div>
        </UCard>

        <UCard class="bg-app-surface/90">
          <div class="space-y-2">
            <p class="text-sm text-[color:var(--ui-text-muted)]">
              Tracked sites
            </p>
            <p class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
              {{ metrics.total }}
            </p>
          </div>
        </UCard>

        <UCard class="bg-app-surface/90">
          <div class="space-y-2">
            <p class="text-sm text-[color:var(--ui-text-muted)]">
              Latest addition
            </p>
            <p class="text-base font-medium text-[color:var(--ui-text-highlighted)]">
              {{ metrics.lastCreated }}
            </p>
          </div>
        </UCard>
      </div>

      <UCard class="bg-app-surface/90">
        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-1 flex-wrap items-center gap-3">
              <UInput v-model="searchTerm" placeholder="Search for a site (name, address, contact...)"
                icon="i-lucide-search" class="min-w-[240px] flex-1" />

              <URadioGroup v-model="statusFilter" :items="statusOptions" orientation="horizontal" variant="table"
                size="sm" />
            </div>

            <UButton v-if="searchTerm || statusFilter !== 'all'" color="neutral" variant="ghost" icon="i-lucide-eraser"
              @click="refreshFilters">
              Reset
            </UButton>
          </div>

          <div class="space-y-4">
            <UAlert v-if="sitesError" color="error" variant="subtle" title="Unable to load your sites"
              description="Refresh the page or try again later." />

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
                {{ isFormEditing ? 'Edit site' : 'New site' }}
              </h2>
              <p class="text-sm text-[color:var(--ui-text-muted)]">
                The information will be visible in the on-site capture PWA.
              </p>
            </div>

            <UForm :state="formState" :schema="formSchema" class="space-y-5" @submit="submitSite">
              <UFormField name="name" label="Site name">
                <UInput v-model="formState.name" placeholder="Downtown Site" autofocus />
              </UFormField>

              <UFormField name="address" label="Address">
                <UTextarea v-model="formState.address" placeholder="123 Worker St, Montreal" auto-resize />
              </UFormField>

              <UFormField name="status" label="Status">
                <URadioGroup v-model="formState.status" orientation="horizontal" variant="table" size="sm" :items="[
                  { label: 'Active', value: 'active' },
                  { label: 'Archived', value: 'archived' }
                ]" />
              </UFormField>

              <div class="grid gap-4 md:grid-cols-2">
                <UFormField name="contactName" label="Primary contact">
                  <UInput v-model="formState.contactName" placeholder="Foreman name" />
                </UFormField>

                <UFormField name="contactPhone" label="Contact phone">
                  <UInput v-model="formState.contactPhone" placeholder="(514) 555-1234" />
                </UFormField>
              </div>

              <UFormField name="notes" label="Internal notes">
                <UTextarea v-model="formState.notes" placeholder="Logistics info, client requirements..." :rows="3" />
              </UFormField>

              <div class="flex justify-end gap-3">
                <UButton color="neutral" variant="ghost" @click.prevent="closeForm">
                  Cancel
                </UButton>
                <UButton type="submit" color="secondary" :loading="formSubmitting">
                  {{ isFormEditing ? 'Save' : 'Create site' }}
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
            <UAlert color="error" variant="subtle" icon="i-lucide-alert-triangle" title="Delete this site?"
              :description="`The site ${sitePendingDeletion?.name ?? ''} will be permanently removed.`" />

            <p class="text-sm text-[color:var(--ui-text-muted)]">
              This action is irreversible. Captured evidence will remain accessible via your Aurora archives if you
              exported them previously.
            </p>

            <div class="flex justify-end gap-3">
              <UButton color="neutral" variant="ghost" @click="closeDeleteModal">
                Cancel
              </UButton>
              <UButton color="error" :loading="deleteInProgress" icon="i-lucide-trash-2" @click="deleteSite">
                Delete permanently
              </UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
