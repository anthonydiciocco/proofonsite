<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useToast, useRequestFetch } from '#imports'

import { refreshAuth } from '../../composables/useAuth'

definePageMeta({
  middleware: 'guest' as never
})

const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('meta.login.title'))
})

const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)
const requestFetch = useRequestFetch()

const getSchema = () => z.object({
  email: z.string().email(t('auth.login.validation.emailInvalid')),
  password: z.string().min(1, t('auth.login.validation.passwordRequired'))
})

type LoginForm = z.infer<ReturnType<typeof getSchema>>

const formState = reactive<LoginForm>({
  email: '',
  password: ''
})

async function onSubmit(event: { data?: LoginForm | null }) {
  if (!event.data) {
    return
  }

  isSubmitting.value = true

  try {
    await requestFetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })

    await refreshAuth({ force: true })
    toast.add({
      title: t('auth.login.successTitle'),
      description: t('auth.login.successDescription'),
      color: 'success'
    })
    await router.push(localePath('/dashboard'))
  } catch (error: unknown) {
    type FetchErrorLike = {
      data?: { message?: string }
      statusMessage?: string
    }

    const fetchError = error as FetchErrorLike
    const fallbackMessage = error instanceof Error ? error.message : null
    const message = fetchError.data?.message
      ?? fetchError.statusMessage
      ?? fallbackMessage
      ?? t('auth.login.errorDescription')
    toast.add({
      title: t('auth.login.errorTitle'),
      description: message,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UContainer class="py-16">
    <div class="mx-auto flex max-w-md flex-col gap-6">
      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-semibold text-[color:var(--ui-text-highlighted)]">
          {{ t('auth.login.title') }}
        </h1>
        <p class="text-sm text-[color:var(--ui-text-muted)]">
          {{ t('auth.login.fullSubtitle') }}
        </p>
      </div>

      <UCard class="bg-app-surface">
        <UForm :state="formState" :schema="getSchema()" class="space-y-6" @submit="onSubmit">
          <UFormField name="email" :label="t('auth.login.email.label')">
            <UInput v-model="formState.email" type="email" :placeholder="t('auth.login.email.placeholder')"
              autocomplete="email" />
          </UFormField>

          <UFormField name="password" :label="t('auth.login.password.label')">
            <UInput v-model="formState.password" type="password" :placeholder="t('auth.login.password.placeholder')"
              autocomplete="current-password" />
          </UFormField>

          <UButton type="submit" color="secondary" class="w-full" :loading="isSubmitting">
            {{ t('auth.login.submit') }}
          </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-[color:var(--ui-text-muted)]">
        {{ t('auth.login.noAccount') }}
        <NuxtLink :to="localePath('/register')" class="font-medium text-secondary hover:underline">
          {{ t('auth.login.createAccess') }}
        </NuxtLink>
      </p>
    </div>
  </UContainer>
</template>
