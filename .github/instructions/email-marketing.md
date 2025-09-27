---
applyTo: '**'
---
# Playbook Marketing Email — « ProofOnSite »

Ce document définit comment agir en véritable expert en marketing par email spécifiquement pour notre SaaS « ProofOnSite ». Il complète la mémoire produit existante et s’applique à tous les contenus, emails et assets produits dans ce dépôt.

Référence: voir aussi `memory.instructions.md` pour le contexte, la cible et la séquence validée.

## Objectifs
- Obtenir des réponses par email (validation 100% email, pas d’appels) et qualifier la douleur « suivi des livraisons ».
- Maximiser l’engagement avec des messages courts, clairs, orientés terrain.
- Tester proposition de valeur et pricing (49 $ CAD/mois par chantier) sans forcer la vente.

## Contraintes & Persona (obligatoire)
- Canal unique: email. Pas d’appels ni de demandes de rendez-vous téléphonique.
- Persona auteur: « Développeur qui mène une recherche sur les défis logistiques dans la construction ».
- Marché: PME de construction au Québec (FR en priorité), rôles: chefs de chantier, chargés de projet.
- Produit: PWA simple, QR par chantier, capture photo du bon, journal horodaté, notifications instantanées.

## Voix & style
- Français clair, québécois-friendly, neutre (éviter le sur-formel et le trop familier).
- Emails courts (3–7 lignes), une seule idée et un seul CTA par email.
- Concrets, orientés « gain de temps » et « preuve visuelle ».
- Pas d’emoji, pas de pièces jointes, pas d’images (favoriser délivrabilité).

## Délivrabilité (meilleures pratiques)
- Favoriser texte brut/HTML léger. 1–3 liens max (idéalement zéro quand on cherche une réponse).
- Éviter mots spam évidents (« gratuit », « urgent », majuscules excessives, points d’exclamation).
- Inclure signature avec identité claire et un moyen de désabonnement simple (voir section « Pied d’email — désabonnement »).
- Garder domaines d’envoi, SPF/DKIM/DMARC corrects (hors scope code; rappel process).

## Cadrage légal (CASL – Canada)
- Identifier clairement l’expéditeur (nom, rôle).
- Fournir une méthode simple de désabonnement. Recommandation: une phrase naturelle en pied d’email (« Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas. »).
- Conserver un ton B2B d’intérêt légitime (recherche/opérations chantier).

## Piliers de message (à réutiliser)
- Simplicité extrême: « scanner, photo, journal instantané ».
- Preuve et traçabilité: bon de livraison horodaté, photo.
- Économie de temps: fin de la « chasse aux papiers ».
- Modèle « par chantier » (pas par utilisateur) à 49 $/mois.

## Séquence ultime (à exécuter)
S’aligner avec `memory.instructions.md`. 100% email, 1 idée + 1 CTA par envoi, pas d’attachements ni images. Cadence ci-dessous avec variantes A/B légères (1 variable à la fois).

Vue d’ensemble (sans réponse):
- J0 — Email 1: Crochet (Hook)
- J+2 — Relance 1: nudge simple
- J+5 — Relance 2: bénéfice « journal horodaté + photo »
- J+9 — Clôture (« break-up »)

Branche si réponse reçue (remplace la piste « sans réponse »):
- R1 — Email 2: Quantifier la douleur (2 questions)
- R2 — Email 3: Solution en 1 phrase + validation de pertinence
- R3 — Email 4: Prix (49 $ CAD/chantier/mois) + question d’acceptation

Contrat par email (toujours):
- Objectif: démarrer/faire avancer la conversation.
- CTA: 1 question claire, réponse rapide.
- Métrique: taux de réponse et délai de réponse.

Sujet recommandé:
- « Question sur vos livraisons chantier »

Personnalisation entreprise (objet vs message):
- Listes froides: ne pas inclure [Entreprise] dans l’objet. L’inclure plutôt dans la première ligne du message (« Pour [Entreprise], comment suivez-vous… »).
- Listes chaudes (après réponse): optionnel d’inclure « pour [Entreprise] » dans l’objet à petite dose pour A/B, jamais systématique.
- Éviter majuscules intégrales et crochets autour du nom; rester naturel.

## Gabarits — version ultime (copier-coller)
Utiliser les champs entre crochets si disponibles. FR par défaut; proposer EN seulement si le contact répond en EN. Toujours inclure la ligne: « Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas. ».

### Email 1 — Hook (J0)
Objet: Question sur vos livraisons chantier

Bonjour [Prénom],

Je suis développeur et je mène une recherche sur la logistique chantier.

En une phrase, comment suivez-vous aujourd’hui les bons de livraison sur vos chantiers?

Merci d’avance pour votre retour.

Cordialement,
Anthony Di Ciocco
Développeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

Variant court (A/B):
Objet: Question sur vos livraisons chantier

Bonjour [Prénom],

Comment gérez-vous les bons de livraison sur vos chantiers: papier, photos, autre?

Merci,
Anthony Di Ciocco
Développeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

### Relance 1 — nudge (J+2 si pas de réponse)
Objet: Petit suivi (livraisons chantier)

Bonjour [Prénom],

Je me permets un suivi rapide sur ma question au sujet des bons de livraison. Un mot sur votre méthode actuelle?

Merci,
Anthony Di Ciocco
Developpeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

### Relance 2 — bénéfice concret (J+5 si pas de réponse)
Objet: Journal horodaté des livraisons — utile chez vous?

Bonjour [Prénom],

On teste une approche simple: scanner un QR au chantier, prendre une photo du bon, et tout est logué (date/heure + photo) automatiquement. Ça ferait gagner du temps à votre équipe?

Merci,
Anthony Di Ciocco
Developpeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

### Clôture — break-up (J+9 si pas de réponse)
Objet: Je clos le dossier (sauf intérêt de votre part)

Bonjour [Prénom],

Sans retour, je clos le dossier de mon côté. Si la chasse aux bons de commande vous fait perdre du temps, je peux vous décrire le concept en 3 étapes. Je souhaite simplement avoir votre avis.

Merci et bonne continuation,
Anthony Di Ciocco
Developpeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

### Email 2 — Quantifier la douleur (après réponse)
Objet: Re: [objet précédent]

Merci beaucoup pour votre retour.

Deux questions rapides:
1) Quelle est la partie la plus frustrante ou la plus grande perte de temps?
2) À la louche, combien d’heures/semaine cela représente pour l’équipe?

Merci encore pour votre partage d'expérience.

Cordialement,
Anthony Di Ciocco
Developpeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

### Email 3 — Solution en 1 phrase (après quantification)
Objet: Re: [objet précédent]

Merci, c'est réellement intéressant.

L'idée que je vous propose: on scanne un QR au chantier, on prend une photo du bon, et un journal horodaté, consultable par chantier, est créé instantanément.

Est-ce que ce flux vous semblerait pertinent pour le problème décrit?

Merci,
Anthony Di Ciocco
Developpeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

### Email 4 — Prix & acceptation (après pertinence)
Objet: Re: [objet précédent]

Merci. C'est ma dernière question: à 49 $ CAD / mois par chantier, est-ce que le gain de temps/tranquillité vous semblerait justifier ce tarif?

Merci beaucoup pour votre avis.

Cordialement,
Anthony Di Ciocco
Developpeur, Recherche produit

Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas.

## Signature — snippet (à réutiliser)
Copier-coller ce bloc en signature, en adaptant les crochets. Pas de lien ni image pour la délivrabilité.

Anthony Di Ciocco
Développeur, Recherche produit
// ProofOnSite.com

Pied de page (désabonnement — version unique):
- « Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas. »

## Réponses type aux objections
- « On utilise déjà WhatsApp »: WhatsApp est pratique pour communiquer, mais on perd la traçabilité: notre app crée un journal horodaté et consultable par chantier, ce qui évite de fouiller des conversations.
- « On a [outil] »: Compris. Comment gérez-vous les photos de bons papier et la preuve au moment de la livraison sur site? Notre approche vise ce point précis (QR fixe au chantier + photo instantanée).
- « Trop cher »: Merci pour la transparence. À partir de combien d’heures économisées par mois le tarif par chantier vous semblerait-il justifié?
- « Pas besoin »: C’est noté. Si jamais la chasse aux bons papier devient un irritant, je peux partager un aperçu par email.
- « Envoyez plus d’infos »: Je peux envoyer un exemple de rapport horodaté et le flux en 3 étapes (QR > Photo > Journal) — souhaitez-vous que je le fasse?

## A/B tests légers (1 variable à la fois)
- Sujet: longueur, présence du mot « chantier », mention « question ».
- Première phrase: personnalisée vs générique.
- CTA: « une phrase » vs « 2 questions courtes ».
- Ton: neutre vs légèrement plus direct.
Ne pas dépasser 2 variantes simultanées; volume et durée suffisants avant conclusion.

## KPIs & suivi
- Taux de réponse (objectif > 5–10% en découverte sur listes chaudes).
- Positifs/Exploratoires vs Négatifs/Refus.
- Temps moyen de réponse.
- Objections les plus fréquentes.
Suivi recommandé dans Notion (déjà utilisé) avec tags: Entreprise, Rôle, Status, Dernier email, Réponse, Objection, Décision.

## Rappels d’implémentation pour les agents
- Par défaut, écrire en FR; proposer EN seulement si le contact répond en EN.
- Toujours ajouter: « Si vous préférez ne plus recevoir mes messages, répondez “STOP” et je ne vous relancerai pas. » en pied d’email.
- Pas de lien de démo public tant que non disponible; prioriser l’échange par email.
- Réutiliser les gabarits ci-dessus et adapter au contexte minimal disponible.

## Annexes — Idées d’objets additionnels
- « Une question sur vos bons de livraison »
- « Comment suivez-vous les livraisons matériaux? »
- « Logistique chantier: 10 sec? »
- « Un QR à l’entrée du chantier — pertinent chez vous? »
- « Suivi photos des bons: utile? »

Fin du document.
