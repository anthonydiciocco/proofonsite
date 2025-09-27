<script setup lang="ts">
import { computed } from 'vue'

import { useAuthUser } from '../../composables/useAuth'

definePageMeta({
  middleware: 'protected' as never
})

useHead({
  title: 'Tableau de bord — ProofOnSite'
})

const user = useAuthUser()
const greeting = computed(() => user.value?.displayName ?? user.value?.email ?? 'membre de l’équipe')
</script>

<template>
  <UContainer class="py-16">
    <div class="space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl font-semibold text-[color:var(--ui-text-highlighted)]">
          Bonjour {{ greeting }}
        </h1>
        <p class="text-sm text-[color:var(--ui-text-muted)]">
          Ce tableau de bord affichera vos chantiers actifs, les preuves de livraison et les notifications entrantes.
        </p>
      </div>

      <UCard class="bg-app-surface">
        <div class="space-y-3">
          <h2 class="text-lg font-semibold text-[color:var(--ui-text-highlighted)]">
            Prochaines étapes
          </h2>
          <ul class="list-disc space-y-2 pl-5 text-sm text-[color:var(--ui-text-toned)]">
            <li>Ajoutez vos premiers chantiers via l’intégration Neon lorsque la structure sera prête.</li>
            <li>Imprimez les codes QR générés automatiquement pour chaque site.</li>
            <li>Invitez vos contremaîtres à tester le flux de capture de preuves sur le terrain.</li>
          </ul>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
