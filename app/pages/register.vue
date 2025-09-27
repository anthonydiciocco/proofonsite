<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useRequestFetch, useToast } from '#imports'

import { refreshAuth } from '../../composables/useAuth'

definePageMeta({
  middleware: 'guest' as never
})

useHead({
  title: 'Création de compte — ProofOnSite'
})

const router = useRouter()
const toast = useToast()
const requestFetch = useRequestFetch()
const isSubmitting = ref(false)

const schema = z
  .object({
    name: z
      .string()
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(120, 'Le nom ne peut dépasser 120 caractères')
      .transform(value => value.trim()),
    email: z.string().email('Adresse courriel invalide'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .max(72, 'Le mot de passe ne peut dépasser 72 caractères'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword']
  })

type RegisterForm = z.infer<typeof schema>

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
      title: 'Compte créé',
      description: 'Votre accès ProofOnSite est prêt.',
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
      ?? 'La création du compte a échoué.'
    toast.add({
      title: 'Erreur',
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
          Activer ProofOnSite
        </h1>
        <p class="text-sm text-[color:var(--ui-text-muted)]">
          Créez un accès pour gérer vos chantiers et suivre les livraisons en temps réel.
        </p>
      </div>

      <UCard class="bg-app-surface">
        <UForm :state="formState" :schema="schema" class="space-y-6" @submit="onSubmit">
          <UFormField name="name" label="Nom complet">
            <UInput v-model="formState.name" placeholder="Alex Tremblay" autocomplete="name" />
          </UFormField>

          <UFormField name="email" label="Adresse courriel">
            <UInput v-model="formState.email" type="email" placeholder="chef@chantier.com" autocomplete="email" />
          </UFormField>

          <UFormField name="password" label="Mot de passe">
            <UInput v-model="formState.password" type="password" placeholder="••••••••" autocomplete="new-password" />
          </UFormField>

          <UFormField name="confirmPassword" label="Confirmer le mot de passe">
            <UInput v-model="formState.confirmPassword" type="password" placeholder="••••••••"
              autocomplete="new-password" />
          </UFormField>

          <UButton type="submit" color="secondary" class="w-full" :loading="isSubmitting">
            Créer mon compte
          </UButton>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-[color:var(--ui-text-muted)]">
        Vous avez déjà un compte ?
        <NuxtLink to="/login" class="font-medium text-secondary hover:underline">
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </UContainer>
</template>
