<script setup lang="ts">
import type {
  AccordionItem,
  ButtonProps,
  PageLink,
  TimelineItem
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

const heroChecklist = [
  {
    icon: 'i-lucide-qr-code',
    title: 'Print the site QR code',
    description: 'Stick it at the gate and the trailer. Everyone scans — no logins, no app store friction.'
  },
  {
    icon: 'i-lucide-camera',
    title: 'Snap delivery proof in 30 seconds',
    description: 'The form opens instantly, compresses photos, and works even on a weak LTE signal.'
  },
  {
    icon: 'i-lucide-badge-check',
    title: 'Notify the office automatically',
    description: 'Timestamped photos and slips land in the manager’s inbox and dashboard in real time.'
  }
]

const painPoints = [
  {
    icon: 'i-lucide-file-warning',
    title: 'Paper slips disappear',
    description: 'Suppliers hand over carbon copies that end up soaked, misplaced, or forgotten in the glovebox.'
  },
  {
    icon: 'i-lucide-message-square-warning',
    title: 'Photos lost in chat apps',
    description: 'WhatsApp and SMS threads mix in jokes, emojis, and off-topic chatter. Nothing is searchable when a dispute shows up.'
  },
  {
    icon: 'i-lucide-alarm-clock',
    title: 'Managers chase confirmations',
    description: 'Two hours per week wasted on “Did the rebar arrive?” phone calls because there’s no shared log.'
  }
]

const workflowItems = [
  {
    date: 'Step 1',
    title: 'Generate & print the QR pack',
    description: 'Each site gets a unique PDF with bilingual instructions and large-format codes ready for lamination.',
    icon: 'i-lucide-printer'
  },
  {
    date: 'Step 2',
    title: 'Drivers scan on arrival',
    description: 'They land on the ProofOnSite PWA, branded for your site, with big controls designed for gloved hands.',
    icon: 'i-lucide-smartphone'
  },
  {
    date: 'Step 3',
    title: 'Capture proof offline-first',
    description: 'Take photos, add notes, and sync automatically once the phone regains a connection — no duplicate typing.',
    icon: 'i-lucide-cloud-off'
  },
  {
    date: 'Step 4',
    title: 'Office notified instantly',
    description: 'Managers receive an email summary, searchable dash entry, and exports for suppliers or auditors.',
    icon: 'i-lucide-inbox'
  }
] satisfies TimelineItem[]

const benefitFeatures = [
  {
    icon: 'i-lucide-scan',
    title: 'Zero training for crews',
    description: 'Two buttons, clear French/English instructions, and automatic photo compression keep the flow under 30 seconds.'
  },
  {
    icon: 'i-lucide-database',
    title: 'Structured evidence archive',
    description: 'Filter by supplier, trade, or pour sequence. Export CSV/PDF when it is time to reconcile invoices.'
  },
  {
    icon: 'i-lucide-bell',
    title: 'Instant alerts for stakeholders',
    description: 'Site managers choose who gets notified — foremen, PMs, clients — all without adding extra seats.'
  }
]
const realityHighlights = [
  {
    icon: 'i-lucide-wifi-off',
    title: 'Offline capture',
    detail: 'Workers can log deliveries in basements or remote lots; the data syncs automatically later.'
  },
  {
    icon: 'i-lucide-thermometer',
    title: 'Built for Quebec winters',
    detail: 'Large tap targets, dark mode by default, and compressed uploads to handle -20 °C work gloves.'
  },
  {
    icon: 'i-lucide-message-square-text',
    title: 'Bilingual by design',
    detail: 'Interface and notifications ship in French/English so suppliers and subcontractors stay aligned.'
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
    description: 'Print-ready bilingual instructions, refreshed whenever you activate a site.'
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
      <section>
        <UPageHero headline="Field-tested on Quebec construction sites"
          title="Visual proof of every delivery, captured in 30 seconds"
          description="ProofOnSite replaces paper slips and disorganized texts with a structured, timestamped log the whole team can consult. Generate one QR per site, capture photos even on a weak connection, and notify the office instantly."
          orientation="horizontal" :links="heroLinks">
          <template #default>
            <UCard
              class="max-w-xl border border-app-card bg-app-surface shadow-app-glow backdrop-blur ring-1 ring-[rgba(225,173,1,0.18)]">
              <template #header>
                <p class="text-sm font-semibold text-muted">
                  Capture checklist
                </p>
              </template>

              <ul class="space-y-4">
                <li v-for="item in heroChecklist" :key="item.title" class="flex items-start gap-3">
                  <div
                    class="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <UIcon :name="item.icon" class="size-4" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-highlighted">
                      {{ item.title }}
                    </p>
                    <p class="text-sm text-muted">
                      {{ item.description }}
                    </p>
                  </div>
                </li>
              </ul>

              <template #footer>
                <div class="flex items-center gap-2 text-xs text-muted">
                  <UIcon name="i-lucide-waves" class="size-4" />
                  Works offline: captures sync as soon as a connection is available.
                </div>
              </template>
            </UCard>
          </template>
        </UPageHero>
      </section>

      <UPageSection id="product" title="Why delivery tracking breaks down on site"
        description="ProofOnSite eliminates the time wasted on paper slips and scattered texts by offering a simple, structured, bilingual flow."
        :features="painPoints" />

      <UPageSection id="workflow" title="A four-step workflow tailored to site realities"
        description="Everyone starts from the same QR code. No heavy training, just immediate traceability that reassures the office and suppliers.">
        <UTimeline class="mt-12" color="secondary" size="lg" :items="workflowItems" />
      </UPageSection>

      <UPageSection id="benefits" title="What ProofOnSite delivers to your team"
        description="Simple for crews, powerful for managers. No per-user licenses, no complex deployments."
        :features="benefitFeatures" />

      <UPageSection title="Designed with jobsite constraints in mind"
        description="We co-designed the experience with site managers — every detail addresses a real pain observed on the jobsite.">
        <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="highlight in realityHighlights" :key="highlight.title" class="h-full bg-app-surface">
            <div class="flex items-start gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <UIcon :name="highlight.icon" class="size-5" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-highlighted">
                  {{ highlight.title }}
                </h3>
                <p class="mt-2 text-sm text-muted">
                  {{ highlight.detail }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </UPageSection>

      <UPageSection id="pricing" title="Simple, per-site pricing"
        description="Activate ProofOnSite when the site starts, then pause it when the project wraps up — no paying for unused licenses.">
        <div class="mt-12 flex justify-center">
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
                    $49
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
              <li v-for="feature in pricingEssentials" :key="feature.title" class="pricing-feature">
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
              </li>
            </ul>

            <div class="mt-8 space-y-3">
              <UButton to="#cta" size="lg" color="secondary" class="w-full justify-between" icon="i-lucide-mail"
                trailing-icon="i-lucide-arrow-right">
                Start a 30-day pilot
              </UButton>
              <p class="text-xs text-muted">
                Billed monthly for active sites only. Cancel or pause anytime — we send a reminder before each renewal.
              </p>
            </div>
          </UCard>
        </div>
      </UPageSection>

      <UPageSection id="faq" title="Frequently asked questions"
        description="Everything happens by email — schedule a personalized demo and receive documentation for your team.">
        <UAccordion class="mt-12" :items="faqItems" />
      </UPageSection>

      <section id="cta">
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
      </section>
    </div>

    <footer>
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
    </footer>
  </div>
</template>
