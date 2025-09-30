<script setup lang="ts">
import type {
  AccordionItem,
  ButtonProps,
  PageLink,
  StepperItem
} from '@nuxt/ui'
import { siteNavigationItems } from '~/constants/navigation'

const navigationItems = siteNavigationItems

const heroLinks = [
  {
    label: 'See it in action',
    to: '#cta',
    size: 'xl',
    color: 'secondary',
    trailingIcon: 'i-lucide-arrow-right'
  },
  {
    label: 'Contact us by email',
    to: 'mailto:hello@proofonsite.com?subject=ProofOnSite%20Pilot',
    size: 'xl',
    color: 'secondary',
    variant: 'soft',
    icon: 'i-lucide-mail'
  }
] satisfies ButtonProps[]

const painPoints = [
  {
    icon: 'i-lucide-file-warning',
    title: 'Paper slips get lost',
    description: 'Delivery slips are easily damaged or misplaced, creating gaps in accountability and billing.'
  },
  {
    icon: 'i-lucide-message-square-warning',
    title: 'Photos buried in chat',
    description: 'Images and messages in chat threads are hard to find and unreliable when you need proof.'
  },
  {
    icon: 'i-lucide-clock',
    title: 'Managers chase confirmations',
    description: 'Managers spend 2 hours a week on calls and messages to confirm deliveries because there’s no shared log.'
  }
]

const benefitFeatures = [
  {
    icon: 'i-lucide-scan',
    title: 'Zero training for crews',
    description: 'Crew-ready in seconds: two large buttons and clear on-screen prompts. No accounts or installs — just scan and submit.'
  },
  {
    icon: 'i-lucide-archive',
    title: 'Structured evidence archive',
    description: 'Filter by supplier, trade, or pour. Export CSV or PDF for reconciliations and audits.'
  },
  {
    icon: 'i-lucide-bell-ring',
    title: 'Instant alerts for stakeholders',
    description: 'Notify foremen, PMs, or clients automatically. No extra user licenses required.'
  }
]
const realityHighlights = [
  {
    icon: 'i-lucide-wifi-off',
    title: 'Offline capture',
    detail: 'Capture deliveries offline. Submissions sync automatically when a connection is available.'
  },
  {
    icon: 'i-lucide-hard-hat',
    title: 'Built for tough conditions',
    detail: 'Large touch targets, a high-contrast UI, and upload optimizations to perform on low bandwidth.'
  },
  {
    icon: 'i-lucide-globe',
    title: 'Global-ready',
    detail: 'Interface and notifications support multiple locales so teams and suppliers stay aligned.'
  }
]

const pricingEssentials = [
  {
    icon: 'i-lucide-hard-hat',
    title: 'Unlimited crew uploads',
    description: 'Capture proof from any trade without adding seats or licenses.'
  },
  {
    icon: 'i-lucide-qr-code',
    title: 'QR packs for each site',
    description: 'Print-ready, localized instructions, refreshed whenever you activate a site.'
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Offline-first mobile flow',
    description: '30-second capture with automatic compression and background sync.'
  },
  {
    icon: 'i-lucide-mail',
    title: 'Instant notifications',
    description: 'Timestamped email digests sent to managers, PMs, suppliers and clients.'
  },
  {
    icon: 'i-lucide-file-text',
    title: 'Structured evidence archive',
    description: 'Searchable log with CSV/PDF exports for reconciliations and audits.'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Secure by default',
    description: 'Scoped access per site, automatic timestamps, and internal-only data retention.'
  }
]

const faqItems = [
  {
    label: 'Do crews need accounts or logins?',
    icon: 'i-lucide-user-round',
    content: 'No accounts, passwords, or downloads. The QR opens a secure form scoped to that site. We capture the caller ID and timestamp automatically.'
  },
  {
    label: 'What happens with spotty connectivity?',
    icon: 'i-lucide-cloud-off',
    content: 'ProofOnSite caches the submission locally, compresses media, then syncs as soon as the device sees a signal again. A banner confirms once it is delivered.'
  },
  {
    label: 'Can we notify suppliers or clients automatically?',
    icon: 'i-lucide-bell-ring',
    content: 'Yes. Each site lets you add optional CC emails so stakeholders receive the same log without being added as users.'
  },
  {
    label: 'How fast can we get started?',
    icon: 'i-lucide-rocket',
    content: 'We create your QR packs and onboarding checklist within 3 business days. Pilot sites typically launch the same week.'
  }
] satisfies AccordionItem[]

const workflowItems = [
  {
    title: 'Generate QR',
    description: 'Generate and print the QR code.',
    icon: 'i-lucide-printer'
  },
  {
    title: 'Scan QR',
    description: 'Open your camera and scan the QR code.',
    icon: 'i-lucide-smartphone'
  },
  {
    title: 'Capture proof',
    description: 'Take a photo and submit.',
    icon: 'i-lucide-camera'
  },
  {
    title: 'Review logs',
    description: 'Search and review timestamped proof',
    icon: 'i-lucide-archive'
  }
] satisfies StepperItem[]

const footerProductLinks = [
  { label: 'Product demo', to: '#workflow', icon: 'i-lucide-monitor-play' },
  { label: 'Pricing', to: '#pricing', icon: 'i-lucide-credit-card' },
  { label: 'Roadmap', to: '#benefits', icon: 'i-lucide-compass' }
] satisfies PageLink[]

const footerSupportLinks = [
  { label: 'Implementation checklist', to: '#product', icon: 'i-lucide-list-checks' },
  { label: 'Pilot program', to: '#pricing', icon: 'i-lucide-flag' },
  { label: 'Email support', to: 'mailto:hello@proofonsite.com', icon: 'i-lucide-life-buoy' }
] satisfies PageLink[]

const footerLegalLinks = [
  { label: 'Terms', to: '#', icon: 'i-lucide-scale' },
  { label: 'Privacy', to: '#', icon: 'i-lucide-shield' },
  { label: 'Security', to: '#', icon: 'i-lucide-lock' }
] satisfies PageLink[]

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="space-y-24">
    <div class="space-y-24">
      <ScrollReveal as="section" animation="fade-up" :duration="700">
        <UPageHero headline="Field-tested on construction sites"
          title="Visual proof of every delivery, captured in 30 seconds"
          description="Scan the site QR, snap a photo, and instantly create a searchable log. No lost slips, no app downloads, no wasted time."
          orientation="horizontal" :links="heroLinks">
          <template #default>
            <div class="flex justify-center">
              <div class="relative inline-block">
                <!-- Decorative gradient background -->
                <div
                  class="absolute -inset-4 bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-60" />

                <!-- Main image card -->
                <UCard class="relative overflow-hidden border-2 border-secondary/20 shadow-2xl p-0">
                  <img src="~/assets/stock_1.png" alt="ProofOnSite capture in action" class="w-full h-auto rounded-lg">

                  <!-- Floating badge - top left -->
                  <div class="absolute top-4 left-4">
                    <UBadge color="secondary" variant="solid" size="lg" class="shadow-lg backdrop-blur-sm">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-shield-check" class="size-4" />
                        <span class="font-semibold">Live Capture</span>
                      </div>
                    </UBadge>
                  </div>

                  <!-- Floating badge - bottom right -->
                  <div class="absolute bottom-4 right-4">
                    <UBadge color="success" variant="solid" size="md" class="shadow-lg backdrop-blur-sm">
                      <div class="flex items-center gap-1.5">
                        <div class="size-2 bg-white rounded-full animate-pulse" />
                        <span class="font-medium">Field Ready</span>
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
              Why delivery tracking breaks down on site
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              ProofOnSite eliminates the time wasted on paper slips and scattered texts by offering a simple,
              structured flow that fits how teams actually work.
            </p>
          </div>

          <UPageColumns>
            <ScrollReveal v-for="(pain, index) in painPoints" :key="pain.title" as="div" animation="fade-up"
              :delay="index * 80"
              class="space-y-4 p-8 rounded-2xl bg-gradient-to-b from-red-50/30 to-transparent dark:from-red-950/20 dark:to-transparent border border-red-100/50 dark:border-red-900/30 hover:border-red-200/70 dark:hover:border-red-800/50 transition-colors duration-300">
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
          </UPageColumns>
        </UContainer>
      </ScrollReveal>

      <!-- Enhanced 4-step workflow with visual stepper -->
      <ScrollReveal id="workflow" as="section" class="py-16" animation="fade-up" :duration="650">
        <UContainer>
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-[color:var(--ui-text-highlighted)] sm:text-4xl mb-4">
              A simple 4-step workflow
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              One QR code, 4 quick actions. No training required, nor app download.
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
                  Complete workflow in under 2 minutes
                </h3>
              </div>
              <p class="text-muted max-w-2xl mx-auto">
                Scan the site QR, capture proof, and notify the office. Fast, reliable, and built for real site
                conditions.
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
              What ProofOnSite delivers to your team
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              Simple for crews, powerful for managers. No per-user licenses, no complex deployments.
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
                        Zero training for crews
                      </h3>
                      <div class="w-16 h-1 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  <p class="text-lg leading-relaxed text-muted mb-6">
                    Two large buttons and clear on-screen prompts make capture instant. No accounts, no installs — just
                    scan and submit. Submissions are optimized for slow connections and sync automatically.
                  </p>

                  <!-- Feature highlights -->
                  <div class="space-y-3">
                    <div class="flex items-center gap-3 text-sm text-highlighted">
                      <div class="size-2 bg-green-500 rounded-full" />
                      <span>Clear instructions</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-highlighted">
                      <div class="size-2 bg-green-500 rounded-full" />
                      <span>No app download</span>
                    </div>
                    <div class="flex items-center gap-3 text-sm text-highlighted">
                      <div class="size-2 bg-green-500 rounded-full" />
                      <span>Under 30-second workflow</span>
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
              Designed with jobsite constraints in mind
            </h2>
            <p class="text-xl text-[color:var(--ui-text-toned)] max-w-3xl mx-auto">
              We co-designed the experience with site managers — every detail addresses a real pain observed on the
              jobsite.
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
        <UPageSection id="pricing" title="Simple, per-site pricing"
          description="Activate ProofOnSite when the site starts, then pause it when the project wraps up — no paying for unused licenses.">
          <ScrollReveal as="div" class="mt-12 flex justify-center" animation="zoom-in" :delay="80">
            <UCard class="pricing-card w-full max-w-3xl border border-app-card bg-app-surface shadow-app-glow">
              <div class="space-y-6">
                <UBadge color="secondary" variant="soft" size="sm">
                  Pilot ready
                </UBadge>

                <div class="space-y-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                    Per active site
                  </p>

                  <div class="flex flex-wrap items-end gap-3">
                    <span class="pricing-price text-5xl font-semibold text-highlighted">
                      49$
                    </span>
                    <span class="text-sm font-medium text-muted">
                      / month
                    </span>
                  </div>

                  <p class="text-base text-toned">
                    Switch a site on only when materials are flowing. Pause and resume in seconds — no annual
                    commitments or hidden tiers.
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
                <UButton to="#cta" size="lg" color="secondary" class="w-full justify-between" icon="i-lucide-mail"
                  trailing-icon="i-lucide-arrow-right">
                  Start a 30-day pilot
                </UButton>
                <p class="text-xs text-muted">
                  Billed monthly for active sites only. Cancel or pause anytime — we send a reminder before each
                  renewal.
                </p>
              </div>
            </UCard>
          </ScrollReveal>
        </UPageSection>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" :duration="650">
        <UPageSection id="faq" title="Frequently asked questions"
          description="Everything happens by email — schedule a personalized demo and receive documentation for your team.">
          <ScrollReveal as="div" class="mt-12" animation="fade-up" :delay="80">
            <UAccordion :items="faqItems" />
          </ScrollReveal>
        </UPageSection>
      </ScrollReveal>

      <ScrollReveal id="cta" as="section" animation="zoom-in" :duration="650">
        <UPageCTA title="Schedule your pilot on a construction site"
          description="Answer three short questions and we'll prepare a printable QR kit, an adoption guide, and an onboarding video session — all within 72 hours."
          variant="subtle" :links="[{
            label: 'Book a meeting',
            to: 'mailto:hello@proofonsite.com?subject=I%20want%20to%20pilot%20ProofOnSite',
            color: 'secondary',
            icon: 'i-lucide-calendar-plus'
          }, {
            label: 'Download product sheet',
            to: '#',
            target: '_blank',
            color: 'secondary',
            variant: 'outline',
            icon: 'i-lucide-file-down'
          }]" />
      </ScrollReveal>
    </div>

    <ScrollReveal as="footer" animation="fade-up" :duration="600" :delay="120">
      <UFooter>
        <template #top>
          <UContainer class="grid gap-10 md:grid-cols-3">
            <UPageLinks title="Product" :links="footerProductLinks" />
            <UPageLinks title="Support" :links="footerSupportLinks" />
            <UPageLinks title="Trust" :links="footerLegalLinks" />
          </UContainer>
        </template>

        <template #left>
          <div class="space-y-2">
            <AppLogo class="text-sm sm:text-base" />
            <p class="text-xs text-muted">
              © {{ currentYear }} — All rights reserved.
            </p>
          </div>
        </template>

        <UNavigationMenu :items="navigationItems" orientation="horizontal" variant="link" />

        <template #right>
          <UButton color="secondary" variant="ghost" icon="i-lucide-mail" to="mailto:hello@proofonsite.com"
            aria-label="Send an email" />
          <UButton color="secondary" variant="soft" trailing-icon="i-lucide-arrow-right" to="#cta">
            Start a pilot
          </UButton>
        </template>
      </UFooter>
    </ScrollReveal>
  </div>
</template>
