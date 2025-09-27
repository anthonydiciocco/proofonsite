<script setup lang="ts">
import { siteNavigationItems } from '~/constants/navigation'
</script>

<template>
  <div class="min-h-screen bg-app-surface text-app-foreground">
    <ProofSiteHeader :items="siteNavigationItems" />
    <UMain class="pb-24">
      <slot />
    </UMain>
  </div>
</template>
