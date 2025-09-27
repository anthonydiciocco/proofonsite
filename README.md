# ProofOnSite

ProofOnSite est une application SaaS en cours de validation qui simplifie le suivi des livraisons sur les chantiers de construction. L’interface marketing côté client est propulsée par Nuxt 4 + Nuxt UI, et un backend light basé sur Neon (PostgreSQL), Drizzle ORM et un système d’authentification inspiré de Lucia complète désormais l’expérience.

## Prérequis

- [Bun](https://bun.sh) 1.2+
- Compte Neon PostgreSQL (ou toute base Postgres compatible HTTP)
- Node 18+ (inclus avec Bun)

## Installation

```bash
# Installer les dépendances avec Bun
bun install

# Dupliquer le fichier d’environnement et renseigner les variables
cp .env.example .env
```

Variables requises :

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
SESSION_COOKIE_NAME="pos_session"        # optionnel
SESSION_COOKIE_DOMAIN=""                # optionnel
SESSION_MAX_AGE="2592000"               # optionnel (secondes)
```

## Base de données

Les schémas Drizzle se trouvent dans `server/db/schema.ts`. Pour générer ou pousser les migrations :

```bash
# Générer les migrations SQL depuis le schéma
bun run db:generate

# Appliquer le schéma sur la base (push sans fichier SQL)
bun run db:push

# Accéder au studio Drizzle
bun run db:studio
```

> Drizzle utilise la connexion HTTP de Neon (`@neondatabase/serverless`). Assurez-vous que `DATABASE_URL` pointe vers le pooler Neon (`...-pooler...`).

## Lancement en développement

```bash
bun run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000). Les pages `/login`, `/register` et `/dashboard` utilisent le nouveau flux d’authentification (sessions persistées en base, cookie signé serveur-side, rafraîchissement automatique).

## Pile technique

- **Nuxt 4** + **Nuxt UI 4**
- **Drizzle ORM** + **Neon** (PostgreSQL serverless)
- **BcryptJS** pour le hash des mots de passe
- **@oslojs/crypto** pour la génération et le hachage des secrets de session (inspiré de Lucia v3)
- **Zod** pour la validation côté serveur et client

## Scripts utiles

| Commande | Description |
| --- | --- |
| `bun run lint` | Linting ESLint |
| `bun run typecheck` | Vérification TypeScript/Nuxt |
| `bun run build` | Build de production |
| `bun run preview` | Prévisualisation du build |
| `bun run db:generate` | Génère les migrations à partir du schéma |
| `bun run db:push` | Applique le schéma sur la base cible |
| `bun run db:studio` | Lance Drizzle Studio |

## Prochaines étapes

- Finaliser la gestion des sites chantiers et des QR codes
- Stockage des médias (photos de livraisons) avec compression côté client
- Notifications e-mail ciblées pour les chefs de chantier et fournisseurs
- Tableau de bord enrichi avec filtres et exports

Toute contribution ou retour d’expérience sur le flux d’authentification est le bienvenu pour préparer la prochaine itération produit.
