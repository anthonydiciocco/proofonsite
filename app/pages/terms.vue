<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: t('meta.terms.title'),
  description: t('meta.terms.description')
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
              {{ t('legal.terms.title') }}
            </h1>
            <p class="text-sm text-muted">
              {{ t('legal.terms.lastUpdated') }}
            </p>
            <p class="text-lg text-toned">
              {{ t('legal.terms.intro') }}
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
                  {{ t('legal.terms.sections.acceptance.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.acceptance.content') }}
                </p>
              </section>

              <!-- Section 2 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.description.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.description.content') }}
                </p>
              </section>

              <!-- Section 3 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.beta.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.beta.content') }}
                </p>
              </section>

              <!-- Section 4 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.accounts.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.accounts.content') }}
                </p>
              </section>

              <!-- Section 5 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.data.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.data.content') }}
                </p>
              </section>

              <!-- Section 6 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.prohibited.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.prohibited.content') }}
                </p>
              </section>

              <!-- Section 7 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.termination.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.termination.content') }}
                </p>
              </section>

              <!-- Section 8 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.liability.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.liability.content') }}
                </p>
              </section>

              <!-- Section 9 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.changes.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.changes.content') }}
                </p>
              </section>

              <!-- Section 10 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.governing.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.governing.content') }}
                </p>
              </section>

              <!-- Section 11 -->
              <section>
                <h2 class="text-2xl font-semibold text-highlighted mb-3">
                  {{ t('legal.terms.sections.contact.title') }}
                </h2>
                <p class="text-base text-toned leading-relaxed whitespace-pre-line">
                  {{ t('legal.terms.sections.contact.content') }}
                </p>
              </section>
            </div>
          </div>
        </UCard>

        <!-- Footer Navigation -->
        <UCard>
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <UButton :to="localePath('/privacy')" variant="soft" color="secondary" trailing-icon="i-lucide-arrow-right">
              {{ t('legal.navigation.viewPrivacy') }}
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
