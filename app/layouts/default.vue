<script setup lang="ts">
// Navigation items are now computed inside ProofSiteHeader using i18n
</script>

<template>
  <div class="min-h-screen bg-app-surface text-app-foreground">
    <ProofSiteHeader />
    <UMain class="pb-24">
      <slot />
    </UMain>
  </div>
</template>
