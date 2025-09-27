<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useToast, useRequestFetch } from '#imports'

import { refreshAuth } from '../../composables/useAuth'

definePageMeta({
  middleware: 'guest' as never
})

useHead({
  title: 'Connexion — ProofOnSite'
})

const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)
const requestFetch = useRequestFetch()

const schema = z.object({
  email: z.string().email('Adresse courriel invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
})

type LoginForm = z.infer<typeof schema>

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
      title: 'Connexion réussie',
      description: 'Bienvenue sur ProofOnSite.',
      color: 'success'
    })
    await router.push('/dashboard')
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
      ?? 'Impossible de vous connecter.'
    toast.add({
      title: 'Erreur de connexion',
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
          Connexion à ProofOnSite
        </h1>
        <p class="text-sm text-[color:var(--ui-text-muted)]">
          Accédez au tableau de bord des chantiers et aux journaux de livraisons.
        </p>
      </div>

      <UCard class="bg-app-surface">
        <UForm :state="formState" :schema="schema" class="space-y-6" @submit="onSubmit">
          <UFormField name="email" label="Adresse courriel">
            <UInput v-model="formState.email" type="email" placeholder="chef@chantier.com" autocomplete="email" />
          </UFormField>

          <UFormField name="password" label="Mot de passe">
            <UInput v-model="formState.password" type="password" placeholder="••••••••"
              autocomplete="current-password" />
          </UFormField>

          <UButton type="submit" color="secondary" class="w-full" :loading="isSubmitting">
            Se connecter
          </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-[color:var(--ui-text-muted)]">
        Pas encore de compte ?
        <NuxtLink to="/register" class="font-medium text-secondary hover:underline">
          Créer un accès
        </NuxtLink>
      </p>
    </div>
  </UContainer>
</template>
