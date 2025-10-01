<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useRequestFetch, useToast } from '#imports'

import { refreshAuth } from '../../composables/useAuth'

definePageMeta({
  middleware: 'guest' as never
})

const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('meta.register.title'))
})

const router = useRouter()
const toast = useToast()
const requestFetch = useRequestFetch()
const isSubmitting = ref(false)

const getSchema = () => z
  .object({
    name: z
      .string()
      .min(2, t('auth.register.validation.nameMin'))
      .max(120, t('auth.register.validation.nameMax'))
      .transform(value => value.trim()),
    email: z.string().email(t('auth.register.validation.emailInvalid')),
    password: z
      .string()
      .min(8, t('auth.register.validation.passwordMin'))
      .max(72, t('auth.register.validation.passwordMax')),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: t('auth.register.validation.passwordMismatch'),
    path: ['confirmPassword']
  })

type RegisterForm = z.infer<ReturnType<typeof getSchema>>

const formState = reactive<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function onSubmit(event: { data?: RegisterForm | null }) {
  if (!event.data) {
    return
  }

  isSubmitting.value = true

  try {
    await requestFetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: event.data.name,
        email: event.data.email,
        password: event.data.password
      }
    })

    await refreshAuth({ force: true })
    toast.add({
      title: t('auth.register.successTitle'),
      description: t('auth.register.successDescription'),
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
      ?? t('auth.register.errorDescription')
    toast.add({
      title: t('common.error'),
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
          {{ t('auth.register.heading') }}
        </h1>
        <p class="text-sm text-[color:var(--ui-text-muted)]">
          {{ t('auth.register.fullSubtitle') }}
        </p>
      </div>

      <UCard class="bg-app-surface">
        <UForm :state="formState" :schema="getSchema()" class="space-y-6" @submit="onSubmit">
          <UFormField name="name" :label="t('auth.register.displayName.label')">
            <UInput v-model="formState.name" :placeholder="t('auth.register.displayName.placeholder')"
              autocomplete="name" />
          </UFormField>

          <UFormField name="email" :label="t('auth.register.email.label')">
            <UInput v-model="formState.email" type="email" :placeholder="t('auth.register.email.placeholder')"
              autocomplete="email" />
          </UFormField>

          <UFormField name="password" :label="t('auth.register.password.label')">
            <UInput v-model="formState.password" type="password" :placeholder="t('auth.register.password.placeholder')"
              autocomplete="new-password" />
          </UFormField>

          <UFormField name="confirmPassword" :label="t('auth.register.confirmPassword.label')">
            <UInput v-model="formState.confirmPassword" type="password"
              :placeholder="t('auth.register.confirmPassword.placeholder')" autocomplete="new-password" />
          </UFormField>

          <UButton type="submit" color="secondary" class="w-full" :loading="isSubmitting">
            {{ t('auth.register.submit') }}
          </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-[color:var(--ui-text-muted)]">
        {{ t('auth.register.hasAccount') }}
        <NuxtLink :to="localePath('/login')" class="font-medium text-secondary hover:underline">
          {{ t('auth.register.login') }}
        </NuxtLink>
      </p>
    </div>
  </UContainer>
</template>
