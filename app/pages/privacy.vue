<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: t('meta.privacy.title'),
  description: t('meta.privacy.description')
})
</script>

<template>
  <div class="min-h-screen bg-app-background py-16">
    <UContainer>
      <div class="mx-auto max-w-4xl">
        <!-- Header -->
        <div class="mb-12">
          <UButton :to="localePath('/')" variant="ghost" color="secondary" icon="i-lucide-arrow-left" class="mb-6">
            {{ t('legal.navigation.backToHome') }}
          </UButton>

          <div class="space-y-4">
            <h1 class="text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
              {{ t('legal.privacy.title') }}
            </h1>
            <p class="text-sm text-muted">
              {{ t('legal.privacy.lastUpdated') }}
            </p>
            <p class="text-lg text-toned">
              {{ t('legal.privacy.intro') }}
            </p>
          </div>
        </div>

        <!-- Content -->
        <UCard class="mb-8">
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <div class="space-y-8">
              <!-- Section 1 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.collection.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.collection.content') }}
                </p>
              </section>

              <!-- Section 2 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.usage.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.usage.content') }}
                </p>
              </section>

              <!-- Section 3 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.storage.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.storage.content') }}
                </p>
              </section>

              <!-- Section 4 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.sharing.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.sharing.content') }}
                </p>
              </section>

              <!-- Section 5 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.retention.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.retention.content') }}
                </p>
              </section>

              <!-- Section 6 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.rights.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.rights.content') }}
                </p>
              </section>

              <!-- Section 7 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.cookies.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.cookies.content') }}
                </p>
              </section>

              <!-- Section 8 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.international.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.international.content') }}
                </p>
              </section>

              <!-- Section 9 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.children.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.children.content') }}
                </p>
              </section>

              <!-- Section 10 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.changes.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.changes.content') }}
                </p>
              </section>

              <!-- Section 11 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.privacy.sections.contact.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.privacy.sections.contact.content') }}
                </p>
              </section>
            </div>
          </div>
        </UCard>

        <!-- Footer Navigation -->
        <UCard>
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <UButton :to="localePath('/terms')" variant="soft" color="secondary" trailing-icon="i-lucide-arrow-right">
              {{ t('legal.navigation.viewTerms') }}
            </UButton>
            <UButton to="mailto:hello@proofonsite.com" variant="ghost" color="secondary" icon="i-lucide-mail">
              {{ t('footer.support.contact') }}
            </UButton>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
