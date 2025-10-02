---
applyTo: '**'
---
# Project Memory: SaaS "ProofOnSite"

This document summarizes the key decisions and context for the SaaS project validation phase.

## 1. Project Overview
- **Project Name:** "ProofOnSite"
- **Goal:** Validate a SaaS idea targeting the construction industry in Quebec.
- **Core Idea:** A simple tool to solve the chaotic tracking of material deliveries on construction sites.
- **Mantra:** "One feature only" - scan QR → take photo → view in dashboard. Everything else is scope creep.

## 2. Target Audience & Problem
- **Target Customer:** Small to medium-sized construction companies (5-50 employees) in Quebec (will maybe expand).
- **Target User:** Site managers, project managers.
- **Core Problem:** The process of tracking deliveries is manual, time-consuming, and error-prone, relying on paper slips, phone calls, and disorganized photos. This leads to lost time and potential project delays.

## 3. Product Specifications

### 3.1 Réalité terrain et fragmentation
- **Fragmentation du secteur :** Chaque entreprise (chantier, livraison, sous-traitant) gère ses propres opérations. Il n'existe pas de système informatique partagé entre tous les acteurs ; le bon de livraison papier reste le seul document commun et officiel. C'est ce point de contact universel que le SaaS vient fiabiliser.

### 3.2 Format & Architecture
- **Format:** Progressive Web App (PWA). **Strictly no native mobile app** to avoid App Store friction and development overhead.
- **Access:** PWA accessed via QR code scan (URL: `/c/[captureToken]`)
- **Tech Stack:**
  - Framework: Nuxt 4.1.2 with Nitro 2.12.6
  - Database: Neon PostgreSQL via Drizzle ORM
  - Storage: Vercel Blob (for delivery photos)
  - UI: Nuxt UI components
  - Auth: Custom session-based with @oslojs/crypto
  - Deployment: Vercel

### 3.3 Core Feature Flow
1. **Site Setup:** Each construction site gets a unique QR code generated as a printable PDF. Multiple copies can be placed at strategic locations (site office, main entrance, delivery zones).
2. **Capture:** Upon delivery, anyone on-site scans the QR code with their phone.
3. **Upload:** PWA opens, allowing them to take a photo of the delivery slip and materials.
4. **Notification:** Site manager receives instant notification and has access to a timestamped, visual log of all deliveries.

### 3.4 MVP Scope (Ultra-Minimal)
**Sites Table (Neon PostgreSQL):**
- `id`, `ownerId`, `name`, `address`, `status` (active/archived), `referenceCode`, `captureToken`, timestamps
- **Removed fields:** `contactName`, `contactPhone`, `notes` - Cut for MVP simplicity

**Deliveries Table (Neon PostgreSQL):**
- `id`, `siteId`, `photoUrl` (link to Vercel Blob), `capturedAt`, `metadata` (JSON)
- Photos stored in Vercel Blob, metadata stored in Neon

**QR Code PDF:**
- 6"×6" QR code with H-level error correction (30% damage tolerance)
- Minimalist black/white design (no colors, no emojis for PDF compatibility)
- Instructions in French: "SCANNEZ POUR ENREGISTRER UNE LIVRAISON"
- Security: validates site ownership, no-cache headers

**Dashboard:**
- Metrics cards: Active/Archived/Total sites (clickable for filtering)
- Table columns: Site (name+address), Code (copy button), Status badge, QR download button, Actions menu
- Form: 3 fields only (name, address, status)
- Search: filters by name, address, referenceCode
- All toast notifications have icons (accessibility)

**Expérience mobile ouvrier (PWA):**
- UX ultra-simple: scan → photo → send in <30 seconds
- Works with slow connections
- Client-side photo compression (before upload)
- Big buttons, clear instructions
- Network error handling with retry

### 3.5 Value Proposition
- **Headline:** "Stop wasting hours chasing delivery slips. Get instant, visual proof of every delivery."
- **vs Complex Tools (ClickUp):** Extreme simplicity + per-site pricing (not per-user)
- **vs Basic Tools (WhatsApp):** Structure, searchability, reliable timestamped log
- **Pricing Hypothesis:** $49 CAD/month per active construction site

## 4. Technical Decisions & Architecture

### 4.1 Database + Storage Pattern
```
Architecture: Neon PostgreSQL (metadata) + Vercel Blob (binary files)

Flow:
1. User uploads photo via PWA
2. Server uploads photo to Vercel Blob → returns public URL
3. Server inserts delivery record in Neon with photoUrl
4. Dashboard queries Neon, displays photos via blob URLs

Benefits:
- Neon = structured data, relations, SQL queries
- Vercel Blob = optimized for large files, CDN delivery
- Cost-effective separation of concerns
```

### 4.2 Key Implementation Details
**QR Code PDF Generation:**
- Library: jsPDF + qrcode
- Issue discovered: jsPDF has poor UTF-8/emoji support
- Solution: Use plain ASCII text only
- Output: 8.5"×11" PDF with centered 6"×6" QR code

**Photo Compression:**
- Location: Client-side (before upload) to save bandwidth
- Target: <500KB per photo
- Fallback: Server-side validation rejects >5MB files

**Security:**
- Capture endpoint: Rate limiting per captureToken
- Auth: Session-based with secure cookies
- File validation: MIME type check, size limits

### 4.3 Database Schema Evolution
**Initial Schema:** Had `contactName`, `contactPhone`, `notes` in sites table
**Decision:** Removed these fields for MVP simplicity
**Reason:** "One feature only" - tracking deliveries, not managing contacts
**Migration:** Applied via `pnpm drizzle-kit push --force`

### 4.4 Beta mode & short-term releases (important notes)

- **Beta mode is enabled** via a simple feature flag located at `server/utils/features.ts`. Toggle `IS_BETA` to `false` when preparing for public launch.
- **DB changes:** Added `joinedDuringBeta` (boolean) and `betaJoinedAt` (timestamp) to `users` to track beta participants. The migration was generated in `drizzle/0001_shallow_logan.sql` and pushed to the DB.
- **Signup flow:** `server/api/auth/register.post.ts` now auto-marks new signups as beta users when the flag is active.
- **Banner & UI:** A minimal, dismissible beta banner (`app/components/BetaBanner.vue`) is shown while beta is active. It uses `localePath()` for locale-aware navigation, stores dismissal in `sessionStorage`, and the banner is wired into the default layout (`app/layouts/default.vue`).
- **Landing & Register:** The landing and register pages were updated to highlight the beta (badges, CTA) and to ensure locale-aware links (`app/pages/index.vue`, `app/pages/register.vue`).

### 4.5 i18n & translations

- Added `beta` copy keys and `hero.betaBadge` / beta CTA keys across all locale files to keep messages consistent: `i18n/locales/en.json`, `fr.json`, `es.json`, `pt.json`, `de.json`, `zh.json`.
- Fixed a malformed `zh.json` and ensured every locale contains `beta.bannerMessage` and `beta.signupCta` so the banner and CTAs render correctly in all languages.

### 4.6 Quick file map (recent changes)

- `server/utils/features.ts` — feature flag & beta config
- `server/api/features.get.ts` — exposes flags to the client
- `server/api/auth/register.post.ts` — auto-mark signups as beta users
- `server/db/schema.ts` — added `joinedDuringBeta`, `betaJoinedAt`
- `drizzle/0001_shallow_logan.sql` — migration to add beta columns
- `app/components/BetaBanner.vue` — compact green dismissible banner
- `app/layouts/default.vue` — banner inserted into layout
- `app/pages/index.vue` — hero + CTA updated to emphasize beta and use `localePath`
- `app/pages/register.vue` — beta badge added on the register page
- `i18n/locales/*.{en,fr,es,pt,de,zh}.json` — added beta copy and CTA keys

## 5. UX/Accessibility Decisions

### 5.1 Design Philosophy
- **Minimalism:** Remove anything not essential for core flow
- **Accessibility:** All actions have clear labels + icons
- **Mobile-first:** PWA must work on construction site conditions
- **Speed:** Every interaction <30 seconds on slow networks

### 5.2 Dashboard UX Iterations
1. **Metrics cards made clickable** - Quick filtering by status
2. **QR Code download moved to primary button** - Was hidden in dropdown
3. **Icons added to all toasts** - Visual feedback (check-circle, copy, download)
4. **Form simplified to 3 fields** - Removed contact/notes inputs
5. **Search placeholder updated** - Removed mention of deleted "contact" field

### 5.3 Color & Branding
- Primary color: Gold (#D4AF37) - matches construction industry aesthetic
- Logo: "ProofOnSite" with custom gold SVG
- Theme: Professional but approachable

## 6. Validation Strategy
- **Method:** 100% via email. **The user is not comfortable with phone calls and this is a hard constraint.**
- **Contact List:** Use the provided list of construction projects and contacts in Quebec (`liste-chantiers-necessitant-rss-temps-plein-2025_.pdf`).
- **Goal:** Validate with 100 contacts before building more features
- **Communication Persona:**
    - **Identity:** "A developer conducting research on operational challenges in the construction sector."
    - **Tone:** Professional, direct, but natural. The goal is an equilibrium between "too chill" and "too corporate".
    - **Key Exclusions:** Do NOT mention the user's young age or specific city of residence to maintain professional credibility.

## 7. Pistes V2 et évolutions futures
**Post-validation features (NOT for MVP):**
- **OCR automatique des bons de livraison** : extraction des informations clés (matériaux, quantités, fournisseur)
- **Notifications aux ouvriers** : notifier certains membres de l'équipe
- **Exports avancés** : CSV/PDF des livraisons, filtres par fournisseur
- **Archivage longue durée** : stockage au-delà de la période standard
- **Intégration ERP/API** : synchronisation avec autres outils de gestion
- **Rapports avancés** : statistiques fournisseurs, délais de livraison
- **Gestion multi-utilisateurs** : droits d'accès plus fins
- **Demande de matériel** : deuxième bouton PWA pour demandes structurées (inspiré par validation avec Melissa)

## 8. Development Timeline

### Phase 1: MVP Foundation ✅ COMPLETE
- [x] Database schema (users, sessions, sites)
- [x] Auth system (signup, login, sessions)
- [x] Sites CRUD (create, update, delete, archive)
- [x] QR code PDF generation
- [x] Dashboard with search/filters
- [x] UX polish (icons, toasts, accessibility)

### Phase 2: Photo Capture 🚧 IN PLANNING
- [ ] Deliveries table in Neon
- [ ] Vercel Blob integration
- [ ] API endpoint: POST /api/capture/[captureToken]
- [ ] PWA route: /c/[captureToken]
- [ ] Client-side photo compression
- [ ] Deliveries view in dashboard
- [ ] Rate limiting
- [ ] Error handling & retries

### Phase 3: Validation Launch 📋 PLANNED
- [ ] Email outreach to 100 contacts
- [ ] Feedback collection
- [ ] Iterate based on real user data

## 9. Critical Constraints & Rules

### 9.1 Hard Constraints
- ❌ **No phone calls** - User validation is 100% email-based
- ❌ **No native mobile app** - PWA only to avoid App Store friction
- ❌ **No feature creep** - "One feature only" until validated
- ✅ **Accessibility first** - WCAG compliance for all interactions
- ✅ **Security first** - Rate limiting, auth, file validation

### 9.2 Code Quality Rules
- All form fields must have clear labels + icons
- All API endpoints must validate inputs with Zod
- All database queries must handle errors gracefully
- All user actions must have toast feedback
- All timestamps must use consistent timezone (UTC)

### 9.3 Performance Targets
- Dashboard load: <2s on 3G
- PWA photo capture: <30s end-to-end on slow connection
- Photo compression: <500KB target size
- QR code PDF generation: <1s server-side

## 10. Lessons Learned

### 10.1 Technical Discoveries
- **jsPDF UTF-8 issue:** Poor emoji support → use ASCII only
- **Scope creep danger:** Initial schema had unused contact fields
- **UX > features:** Visible primary actions (Download QR) > hidden menus
- **Database separation:** Neon (metadata) + Blob (files) is optimal pattern

### 10.2 Decision Patterns
- When in doubt, remove the feature (MVP simplicity)
- Icons + labels > labels alone (accessibility)
- Clickable metrics > static numbers (discoverability)
- Explicit is better than implicit (clear placeholders, error messages)
