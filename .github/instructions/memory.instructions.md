---
applyTo: '**'
---
# Project Memory: SaaS "ProofOnSite"

This document summarizes the key decisions and context for the SaaS project validation phase.

## 1. Project Overview
- **Project Name:** "ProofOnSite"
- **Goal:** Validate a SaaS idea targeting the construction industry in Quebec.
- **Core Idea:** A simple tool to solve the chaotic tracking of material deliveries on construction sites.

## 2. Target Audience & Problem
- **Target Customer:** Small to medium-sized construction companies (5-50 employees) in Quebec (will maybe expand).
- **Target User:** Site managers, project managers.
- **Core Problem:** The process of tracking deliveries is manual, time-consuming, and error-prone, relying on paper slips, phone calls, and disorganized photos. This leads to lost time and potential project delays.

- **Expérience mobile ouvrier :** L'adoption dépend d'une UX ultra-simple et robuste. L'interface mobile doit permettre de scanner, prendre une photo et envoyer en moins de 30 secondes, même avec une connexion lente. Compression automatique des photos, gros boutons, instructions claires et gestion des erreurs réseau sont prioritaires.
## 3.1 Réalité terrain et fragmentation

- **Fragmentation du secteur :** Chaque entreprise (chantier, livraison, sous-traitant) gère ses propres opérations. Il n'existe pas de système informatique partagé entre tous les acteurs ; le bon de livraison papier reste le seul document commun et officiel. C'est ce point de contact universel que le SaaS vient fiabiliser.
- **Format:** A Progressive Web App (PWA). **Strictly no native mobile app** to avoid App Store friction and development overhead. The PWA is accessed via a simple URL (e.g., through a QR code on-site) and can use the phone's camera.
- **Core Feature:**
    1. A unique QR code is generated for each construction site as a printable PDF. This allows for multiple copies to be placed at strategic, fixed locations (e.g., site office, main entrance, delivery zones).
    2. Upon delivery, anyone on-site scans a QR code with their phone.
    3. The PWA opens, allowing them to take a photo of the delivery slip and materials.
    4. The site manager receives an instant notification and has access to a timestamped, visual log of all deliveries.
- **Value Proposition:** "Stop wasting hours chasing delivery slips. Get instant, visual proof of every delivery." Your key differentiator against complex tools (like ClickUp) is extreme simplicity and a "per-site" pricing model, not "per-user". Your advantage against basic tools (like WhatsApp) is structure, searchability, and creating a reliable, timestamped log.
- **Pricing Hypothesis:** $49 CAD/month per active construction site.

## Pistes V2 et évolutions futures
- **OCR automatique des bons de livraison** : extraction des informations clés (matériaux, quantités, fournisseur) pour affichage dans le dashboard et dans les notifications.
- **Notifications aux ouvriers** : possibilité de notifier certains membres de l’équipe lorsqu’une livraison est validée (optionnel, à activer par le chef de chantier).
- **Exports avancés** : export CSV/PDF des livraisons, filtres par fournisseur, par type de matériaux, etc.
- **Archivage longue durée** : stockage des photos et données au-delà de la période standard.
- **Intégration ERP/API** : synchronisation avec d’autres outils de gestion de chantier ou de facturation.
- **Rapports avancés** : statistiques sur la fiabilité des fournisseurs, délais de livraison, etc.
- **Gestion multi-utilisateurs** : gestion de droits d’accès plus fins pour les membres de l’équipe.
- **Demande de matériel** : ajout d'un deuxième bouton sur la PWA pour permettre aux équipes sur le terrain de faire des demandes de matériel simples et structurées, remplaçant les textos. (Inspiré par la validation avec Melissa).

## 4. Validation Strategy
- **Method:** 100% via email. **The user is not comfortable with phone calls and this is a hard constraint.**
- **Contact List:** Use the provided list of construction projects and contacts in Quebec (`liste-chantiers-necessitant-rss-temps-plein-2025_.pdf`).
- **Communication Persona:**
    - **Identity:** "A developer conducting research on operational challenges in the construction sector."
    - **Tone:** Professional, direct, but natural. The goal is an equilibrium between "too chill" and "too corporate".
    - **Key Exclusions:** Do NOT mention the user's young age or specific city of residence to maintain professional credibility.
