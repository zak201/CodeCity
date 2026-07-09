# Mockups et captures d’écran — CodeCity

Ce dossier accueille les **captures d’écran** du rendu pédagogique. Les fichiers ci-dessous sont des **cibles à produire** (depuis Expo Go ou émulateur), pas encore versionnés tant que tu ne les ajoutes pas au dépôt.

## Liste des fichiers à générer

| Fichier | Écran dans le code | Description courte |
|--------|---------------------|---------------------|
| `01-onboarding.png` | `app/(game)/welcome.tsx` | Accueil « CODECITY » avec overlay scanlines CRT, texte d’intro et bulle LOG ; boutons pour lancer le **test de placement** ou aller à la **carte** si le placement est déjà fait (`placementLevel` dans `userStore`). |
| `02-placement-test.png` | `app/(game)/placement-test.tsx` | Mission de recrutement : 8 questions issues de `placementQuestions`, barre de progression, répliques LOG par question (`LOG_PER_QUESTION`), feedback correct/incorrect. |
| `03-carte-cyberpunk.png` | `app/(game)/map.tsx` | **Capture hero** : carte SVG des quartiers (nœuds, liaisons orthogonales, halos « en cours »), en-tête avec marque **CODECITY**, **XP** et **streak** (`HeaderBar`). |
| `04-quartier-niveau.png` | `app/(game)/district/[id]/index.tsx` | Vue d’un quartier : titre, concept, bulle LOG avec `district.story`, liste des niveaux (`getLevelsForDistrict`) ou carte « Bientôt disponible » si aucun niveau. |
| `05-qcm-en-cours.png` | `app/(game)/district/[id]/level/[levelId].tsx` + `components/game/QCM.tsx` | Niveau actif : titre de chapitre (`chapterTitles`), consigne, **QCM** à 4 choix, bulle LOG / modal d’aide selon l’état. |
| `06-progression-xp.png` | `app/(game)/map.tsx` (en-tête) ou après une bonne réponse niveau | Mise en avant du **compteur XP** et de la **flamme streak** dans la barre du haut de la carte, ou état du store après complétion d’un niveau (`addXP`, `completeLevel`). |

## Conseils pratiques

- Résolution : largeur type **390 × 844** pt (iPhone 13) ou équivalent Android, PNG.
- Pour réinitialiser le parcours « premier lancement » (welcome → placement), repartir d’une session fraîche ou vider le state selon ta méthode de test.
- Place les PNG dans ce dossier (`docs/mockups/`) puis référence `03-carte-cyberpunk.png` dans le `README.md` racine (bloc **Aperçu**).
