<script setup lang="ts">
import type {
  AccordionItem,
  ButtonProps,
  PageLink,
  StepperItem
} from '@nuxt/ui'
import { createNavigationItems } from '~/constants/navigation'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const navigationItems = computed(() => createNavigationItems(t))

const heroLinks = computed(() => {
  // Force recomputation when locale changes
  const _locale = locale.value
  return [
    {
      label: t('hero.cta.signup'),
      to: localePath('/register'),
      size: 'xl' as const,
      color: 'secondary' as const,
      trailingIcon: 'i-lucide-arrow-right',
      icon: 'i-lucide-sparkles'
    },
    {
      label: t('hero.cta.demo'),
      to: '#workflow',
      size: 'xl' as const,
      color: 'secondary' as const,
      variant: 'soft' as const,
      icon: 'i-lucide-play-circle'
    }
  ] satisfies ButtonProps[]
})

const painPoints = computed(() => [
  {
    icon: 'i-lucide-file-warning',
    title: t('problem.painPoints.lostSlips.title'),
    description: t('problem.painPoints.lostSlips.description')
  },
  {
    icon: 'i-lucide-message-square-warning',
    title: t('problem.painPoints.chatPhotos.title'),
    description: t('problem.painPoints.chatPhotos.description')
  },
  {
    icon: 'i-lucide-clock',
    title: t('problem.painPoints.chasingConfirmations.title'),
    description: t('problem.painPoints.chasingConfirmations.description')
  }
])

const benefitFeatures = computed(() => [
  {
    icon: 'i-lucide-scan',
    title: t('benefits.features.zeroTraining.title'),
    description: t('benefits.features.zeroTraining.description')
  },
  {
    icon: 'i-lucide-archive',
    title: t('benefits.features.structuredArchive.title'),
    description: t('benefits.features.structuredArchive.description')
  },
  {
    icon: 'i-lucide-bell-ring',
    title: t('benefits.features.instantAlerts.title'),
    description: t('benefits.features.instantAlerts.description')
  }
])

const realityHighlights = computed(() => [
  {
    icon: 'i-lucide-wifi-off',
    title: t('reality.highlights.offline.title'),
    detail: t('reality.highlights.offline.detail')
  },
  {
    icon: 'i-lucide-hard-hat',
    title: t('reality.highlights.toughConditions.title'),
    detail: t('reality.highlights.toughConditions.detail')
  },
  {
    icon: 'i-lucide-globe',
    title: t('reality.highlights.globalReady.title'),
    detail: t('reality.highlights.globalReady.detail')
  }
])

const pricingEssentials = computed(() => [
  {
    icon: 'i-lucide-hard-hat',
    title: t('pricing.features.unlimitedUploads.title'),
    description: t('pricing.features.unlimitedUploads.description')
  },
  {
    icon: 'i-lucide-qr-code',
    title: t('pricing.features.qrPacks.title'),
    description: t('pricing.features.qrPacks.description')
  },
  {
    icon: 'i-lucide-smartphone',
    title: t('pricing.features.offlineFirst.title'),
    description: t('pricing.features.offlineFirst.description')
  },
  {
    icon: 'i-lucide-mail',
    title: t('pricing.features.instantNotifications.title'),
    description: t('pricing.features.instantNotifications.description')
  },
  {
    icon: 'i-lucide-file-text',
    title: t('pricing.features.structuredExports.title'),
    description: t('pricing.features.structuredExports.description')
  },
  {
    icon: 'i-lucide-shield-check',
    title: t('pricing.features.support.title'),
    description: t('pricing.features.support.description')
  }
])

const faqItems = computed(() => [
  {
    label: t('faq.q1.question'),
    icon: 'i-lucide-smartphone',
    content: t('faq.q1.answer')
  },
  {
    label: t('faq.q2.question'),
    icon: 'i-lucide-rocket',
    content: t('faq.q2.answer')
  },
  {
    label: t('faq.q3.question'),
    icon: 'i-lucide-bell',
    content: t('faq.q3.answer')
  },
  {
    label: t('faq.q4.question'),
    icon: 'i-lucide-download',
    content: t('faq.q4.answer')
  }
] satisfies AccordionItem[])

const workflowItems = computed(() => [
  {
    title: t('solution.howItWorks.steps.setup.title'),
    description: t('solution.howItWorks.steps.setup.description'),
    icon: 'i-lucide-printer'
  },
  {
    title: t('solution.howItWorks.steps.scan.title'),
    description: t('solution.howItWorks.steps.scan.description'),
    icon: 'i-lucide-smartphone'
  },
  {
    title: t('solution.howItWorks.steps.capture.title'),
    description: t('solution.howItWorks.steps.capture.description'),
    icon: 'i-lucide-camera'
  },
  {
    title: t('solution.howItWorks.steps.notify.title'),
    description: t('solution.howItWorks.steps.notify.description'),
    icon: 'i-lucide-archive'
  }
] satisfies StepperItem[])

const footerProductLinks = computed(() => [
  { label: t('footer.product.howItWorks'), to: '#workflow', icon: 'i-lucide-workflow' },
  { label: t('footer.product.features'), to: '#benefits', icon: 'i-lucide-sparkles' },
  { label: t('footer.product.pricing'), to: '#pricing', icon: 'i-lucide-credit-card' }
] satisfies PageLink[])

const footerSupportLinks = computed(() => [
  { label: t('footer.support.faq'), to: '#faq', icon: 'i-lucide-help-circle' },
  { label: t('footer.support.contact'), to: 'mailto:hello@proofonsite.com', icon: 'i-lucide-mail' }
] satisfies PageLink[])

const footerLegalLinks = computed(() => {
  // Force recomputation when locale changes
  const _locale = locale.value
  return [
    { label: t('footer.legal.terms'), to: localePath('/terms'), icon: 'i-lucide-file-text' },
    { label: t('footer.legal.privacy'), to: localePath('/privacy'), icon: 'i-lucide-shield-check' }
  ] satisfies PageLink[]
})

const ctaLinks = computed(() => {
  // Force recomputation when locale changes
  const _locale = locale.value
  return [
    {
      label: t('cta.signupButton'),
      to: localePath('/register'),
      color: 'secondary' as const,
      icon: 'i-lucide-sparkles',
      size: 'xl' as const
    },
    {
      label: t('cta.learnMore'),
      to: '#workflow',
      color: 'secondary' as const,
      variant: 'outline' as const,
      icon: 'i-lucide-arrow-up',
      size: 'xl' as const
    }
  ] satisfies ButtonProps[]
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="space-y-24">
    <div class="space-y-24">
      <ScrollReveal as="section" animation="fade-up" :duration="700">
        <UPageHero :title="t('hero.title')" :description="t('hero.description')" orientation="horizontal"
          :links="heroLinks">
          <template #headline>
            <UBadge color="success" variant="subtle" size="lg" class="mb-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-sparkles" class="size-4 animate-pulse" />
                <span class="font-semibold">{{ t('hero.betaBadge') }}</span>
              </div>
            </UBadge>
          </template>
          <template #default>
            <div class="flex justify-center">
              <div class="relative inline-block">
                <!-- Decorative gradient background -->
                <div
                  class="absolute -inset-4 bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-60" />

                <!-- Main image card -->
                <UCard class="relative overflow-hidden border-2 border-secondary/20 shadow-2xl p-0">
                  <img src="~/assets/stock_1.png" :alt="t('hero.imageAlt')" class="w-full h-auto rounded-lg">

                  <!-- Floating badge - top left -->
                  <div class="absolute top-4 left-4">
                    <UBadge color="secondary" variant="solid" size="lg" class="shadow-lg backdrop-blur-sm">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-shield-check" class="size-4" />
                        <span class="font-semibold">{{ t('hero.badges.liveCapture') }}</span>
                      </div>
                    </UBadge>
                  </div>

                  <!-- Floating badge - bottom right -->
                  <div class="absolute bottom-4 right-4">
                    <UBadge color="success" variant="solid" size="md" class="shadow-lg backdrop-blur-sm">
                      <div class="flex items-center gap-1.5">
                        <div class="size-2 bg-white rounded-full animate-pulse" />
                        <span class="font-medium">{{ t('hero.badges.fieldReady') }}</span>
                      </div>
                    </UBadge>
                  </div>
                </UCard>
              </div>
            </div>
          </template>
        </UPageHero>
      </ScrollReveal>

      <!-- Pain Points with enhanced column layout -->
      <ScrollReveal id="product" as="section" class="py-16" animation="fade-up" :duration="650">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-[color:var(--ui-text-highlighted)] sm:text-4xl mb-4">
              {{ t('problem.title') }}
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              {{ t('problem.description') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal v-for="(pain, index) in painPoints" :key="pain.title" as="div" animation="fade-up"
              :delay="index * 80"
              class="flex flex-col space-y-4 p-8 rounded-2xl bg-gradient-to-b from-red-50/30 to-transparent dark:from-red-950/20 dark:to-transparent border border-red-100/50 dark:border-red-900/30 hover:border-red-200/70 dark:hover:border-red-800/50 transition-colors duration-300">
              <div class="flex size-16 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg">
                <UIcon :name="pain.icon" class="size-8" />
              </div>
              <h3 class="text-xl font-bold text-highlighted">
                {{ pain.title }}
              </h3>
              <p class="text-base leading-relaxed text-muted">
                {{ pain.description }}
              </p>
            </ScrollReveal>
          </div>
        </UContainer>
      </ScrollReveal>

      <!-- Enhanced 4-step workflow with visual stepper -->
      <ScrollReveal id="workflow" as="section" class="py-16" animation="fade-up" :duration="650">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-[color:var(--ui-text-highlighted)] sm:text-4xl mb-4">
              {{ t('solution.title') }}
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              {{ t('solution.description') }}
            </p>
          </div>

          <!-- Simplified visual stepper -->
          <ScrollReveal as="div" class="max-w-5xl mx-auto" animation="fade-up" :delay="100">
            <UStepper :items="workflowItems" color="secondary" size="lg" orientation="horizontal" disabled class="mb-12"
              :ui="{
                root: 'w-full',
                trigger: 'shadow-lg',
                title: 'text-base font-bold mt-3',
                description: 'text-sm text-muted mt-1 max-w-48 mx-auto leading-relaxed'
              }">
              <template #indicator="{ item }">
                <div class="flex size-16 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg">
                  <UIcon :name="item.icon" class="size-8" />
                </div>
              </template>
            </UStepper>

            <!-- Summary highlight -->
            <ScrollReveal as="div"
              class="text-center mt-12 p-8 bg-gradient-to-r from-secondary/5 via-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20"
              animation="fade-up" :delay="180">
              <div class="flex items-center justify-center gap-3 mb-4">
                <UIcon name="i-lucide-timer" class="size-6 text-secondary" />
                <h3 class="text-xl font-bold text-highlighted">
                  {{ t('solution.workflowSummary.title') }}
                </h3>
              </div>
              <p class="text-muted max-w-2xl mx-auto">
                {{ t('solution.workflowSummary.description') }}
              </p>
            </ScrollReveal>
          </ScrollReveal>
        </UContainer>
      </ScrollReveal>

      <!-- Benefits section with elegant split layout -->
      <ScrollReveal id="benefits" as="section" class="py-16" animation="fade-up" :duration="650">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-[color:var(--ui-text-highlighted)] sm:text-4xl mb-4">
              {{ t('benefits.title') }}
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              {{ t('benefits.subtitle') }}
            </p>
          </div>

          <!-- Split layout with main feature and supporting features -->
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Main feature card -->
            <ScrollReveal as="div" class="order-2 lg:order-1" animation="fade-right" :delay="100">
              <UCard
                class="relative overflow-hidden bg-gradient-to-br from-green-50/50 via-white to-green-50/30 dark:from-green-950/20 dark:via-gray-900 dark:to-green-950/10 border-green-200/30 dark:border-green-800/30 hover:border-green-300/50 dark:hover:border-green-700/50 transition-all duration-500 shadow-lg hover:shadow-xl">
                <!-- Background decoration -->
                <div class="absolute top-0 right-0 w-32 h-32 opacity-5 rotate-12">
                  <UIcon name="i-lucide-scan" class="size-full" />
                </div>

                <div class="relative z-10 p-8">
                  <div class="flex items-center gap-6 mb-6">
                    <div class="flex size-16 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg">
                      <UIcon name="i-lucide-scan" class="size-8" />
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-highlighted mb-2">
                        {{ t('benefits.features.zeroTraining.title') }}
                      </h3>
                      <div class="w-16 h-1 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  <p class="text-lg leading-relaxed text-muted mb-6">
                    {{ t('benefits.features.zeroTraining.extendedDescription') }}
                  </p>

                  <!-- Feature highlights -->
                  <div class="space-y-3">
                    <div class="flex items-center gap-3 text-sm text-highlighted">
                      <div class="size-2 bg-green-500 rounded-full" />
                      <span>{{ t('benefits.features.zeroTraining.highlights.clearInstructions') }}</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-highlighted">
                      <div class="size-2 bg-green-500 rounded-full" />
                      <span>{{ t('benefits.features.zeroTraining.highlights.noAppDownload') }}</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-highlighted">
                      <div class="size-2 bg-green-500 rounded-full" />
                      <span>{{ t('benefits.features.zeroTraining.highlights.fastWorkflow') }}</span>
                    </div>
                  </div>
                </div>
              </UCard>
            </ScrollReveal>

            <!-- Supporting features -->
            <div class="order-1 lg:order-2 space-y-6">
              <ScrollReveal v-for="(feature, index) in benefitFeatures.slice(1)" :key="feature.title" as="div"
                animation="fade-up" :delay="(index + 1) * 90">
                <UCard
                  class="group hover:shadow-app-glow transition-all duration-300 bg-app-surface border-app-card hover:border-secondary/30">
                  <div class="flex items-start gap-4 p-6">
                    <div
                      class="flex size-12 shrink-0 items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300 bg-secondary/10 text-secondary">
                      <UIcon :name="feature.icon" class="size-6" />
                    </div>
                    <div class="flex-1">
                      <h3
                        class="text-lg font-semibold text-highlighted mb-2 group-hover:text-secondary transition-colors duration-300">
                        {{ feature.title }}
                      </h3>
                      <p class="text-sm leading-relaxed text-muted">
                        {{ feature.description }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </ScrollReveal>
            </div>
          </div>
        </UContainer>
      </ScrollReveal>

      <!-- Jobsite realities section with enhanced visual hierarchy -->
      <ScrollReveal as="section" class="py-16" animation="fade-up" :duration="650">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-[color:var(--ui-text-highlighted)] sm:text-4xl mb-4">
              {{ t('reality.title') }}
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              {{ t('reality.subtitle') }}
            </p>
          </div>

          <div class="grid gap-8 md:grid-cols-3">
            <ScrollReveal v-for="(highlight, index) in realityHighlights" :key="highlight.title" as="div"
              animation="fade-up" :delay="index * 100">
              <UCard class="relative overflow-hidden group hover:shadow-app-glow transition-all duration-500" :class="[
                index === 0 ? 'bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-gray-900' : '',
                index === 1 ? 'bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-gray-900' : '',
                index === 2 ? 'bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-gray-900' : ''
              ]">
                <!-- Background decoration -->
                <div
                  class="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <UIcon :name="highlight.icon" class="size-full" />
                </div>

                <div class="relative z-10 p-6">
                  <div class="flex items-start gap-4 mb-4">
                    <div
                      class="flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 bg-secondary text-white">
                      <UIcon :name="highlight.icon" class="size-7" />
                    </div>
                    <div class="flex-1">
                      <h3
                        class="text-xl font-bold text-highlighted mb-3 group-hover:text-secondary transition-colors duration-300">
                        {{ highlight.title }}
                      </h3>
                    </div>
                  </div>
                  <p class="text-base leading-relaxed text-muted">
                    {{ highlight.detail }}
                  </p>
                </div>
              </UCard>
            </ScrollReveal>
          </div>
        </UContainer>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" :duration="650">
        <UPageSection id="pricing" :title="t('pricing.title')" :description="t('pricing.description')">
          <ScrollReveal as="div" class="mt-12 flex justify-center" animation="zoom-in" :delay="80">
            <UCard class="pricing-card w-full max-w-3xl border border-app-card bg-app-surface shadow-app-glow">
              <div class="space-y-6">
                <!-- Beta Badge + Original Badge -->
                <div class="flex items-center gap-2 flex-wrap">
                  <UBadge color="success" variant="subtle" size="md" class="animate-pulse">
                    <div class="flex items-center gap-1.5">
                      <UIcon name="i-lucide-sparkles" class="size-3.5" />
                      <span class="font-semibold">{{ t('pricing.betaBadge') }}</span>
                    </div>
                  </UBadge>

                  <!-- <UBadge color="secondary" variant="soft" size="sm">
                    {{ t('pricing.badge') }}
                  </UBadge> -->


                </div>

                <div class="space-y-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                    {{ t('pricing.perActiveSite') }}
                  </p>

                  <!-- Beta Pricing Display -->
                  <div class="space-y-3">
                    <div class="flex flex-wrap items-end gap-3">
                      <span class="pricing-price text-5xl font-semibold text-green-600 dark:text-green-400">
                        {{ t('pricing.betaPrice') }}
                      </span>
                      <span class="text-sm font-medium text-muted">
                        {{ t('pricing.duringBeta') }}
                      </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm text-muted">
                      <UIcon name="i-lucide-arrow-right" class="size-4" />
                      <span>{{ t('pricing.afterBeta') }}: <span class="font-semibold text-highlighted">49$</span> {{
                        t('pricing.perMonth') }}</span>
                    </div>
                  </div>

                  <p class="text-base text-toned">
                    {{ t('pricing.betaDescription') }}
                  </p>
                </div>
              </div>

              <ul class="mt-8 grid gap-4 sm:grid-cols-2">
                <ScrollReveal v-for="(feature, index) in pricingEssentials" :key="feature.title" as="li"
                  class="pricing-feature" animation="fade-up" :delay="index * 70">
                  <div class="flex items-start gap-3">
                    <div class="pricing-icon">
                      <UIcon :name="feature.icon" class="size-5" />
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-semibold text-highlighted">
                        {{ feature.title }}
                      </p>
                      <p class="text-sm text-muted">
                        {{ feature.description }}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </ul>

              <div class="mt-8 space-y-3">
                <UButton :to="localePath('/register')" size="lg" color="success" class="w-full justify-between"
                  icon="i-lucide-sparkles" trailing-icon="i-lucide-arrow-right">
                  {{ t('pricing.betaCtaButton') }}
                </UButton>
                <div class="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                  <UIcon name="i-lucide-check-circle" class="size-4 shrink-0" />
                  <span class="font-medium">{{ t('pricing.betaBillingNote') }}</span>
                </div>
              </div>
            </UCard>
          </ScrollReveal>
        </UPageSection>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" :duration="650">
        <UPageSection id="faq" :title="t('faq.title')" :description="t('faq.description')">
          <ScrollReveal as="div" class="mt-12" animation="fade-up" :delay="80">
            <UAccordion :items="faqItems" />
          </ScrollReveal>
        </UPageSection>
      </ScrollReveal>

      <ScrollReveal id="cta" as="section" animation="zoom-in" :duration="650">
        <UPageCTA :title="t('cta.titleBeta')" :description="t('cta.descriptionBeta')" variant="subtle"
          :links="ctaLinks" />
      </ScrollReveal>
    </div>

    <ScrollReveal as="footer" animation="fade-up" :duration="600" :delay="120">
      <UFooter>
        <template #top>
          <UContainer class="grid gap-12 md:grid-cols-3">
            <UPageLinks :title="t('footer.product.title')" :links="footerProductLinks" />
            <UPageLinks :title="t('footer.support.title')" :links="footerSupportLinks" />
            <UPageLinks :title="t('footer.legal.title')" :links="footerLegalLinks" />
          </UContainer>
        </template>

        <template #left>
          <div class="space-y-3">
            <AppLogo class="text-sm sm:text-base" />
            <p class="text-xs text-muted max-w-xs">
              {{ t('footer.tagline') }}
            </p>
            <p class="text-xs text-muted">
              © {{ currentYear }} ProofOnSite — {{ t('footer.rights') }}
            </p>
          </div>
        </template>

        <template #right>
          <div class="flex items-center gap-2">
            <UButton color="secondary" variant="ghost" icon="i-lucide-mail" to="mailto:hello@proofonsite.com"
              :aria-label="t('footer.emailAriaLabel')" />
            <UButton :to="localePath('/register')" color="secondary" variant="solid" icon="i-lucide-sparkles"
              :aria-label="t('footer.signupAriaLabel')">
              {{ t('footer.cta.signup') }}
            </UButton>
          </div>
        </template>
      </UFooter>
    </ScrollReveal>
  </div>
</template>
