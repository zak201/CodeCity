# CodeCity 🏙️

> 🔗 Repository : https://github.com/zak201/CodeCity

[![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5-433E38?style=flat)](https://github.com/pmndrs/zustand)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

> *"La ville de CodeCity est entièrement gouvernée par des algorithmes. Un bug mystérieux se propage. LOG, l'IA gardienne, t'a recruté comme Code Architect. À toi de sauver la ville."*

Jeu mobile éducatif qui apprend l'algorithmique aux débutants complets, à travers une histoire narrative et des puzzles progressifs. 5 à 15 minutes par jour.

### 📸 Aperçu

<!-- Zak : après ta capture de la carte (style cyberpunk), enregistre-la en docs/mockups/03-carte-cyberpunk.png puis ajoute sous ce commentaire une ligne Markdown du type : ![Carte de CodeCity — aperçu hero](docs/mockups/03-carte-cyberpunk.png) -->

---


## Stack technique

| Couche | Technologie |
|---|---|
| Mobile | React Native + Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| State | Zustand + persistance AsyncStorage (profil, progression, streak) |
| Backend | Express.js + Prisma |
| Base de données | SQLite (dev) → PostgreSQL/Supabase (prod) |
| IA (LOG) | Base de connaissances locale (MVP, `lib/claude.ts`) ; Claude API via proxy backend en V1 |
| Animations | React Native Reanimated + Lottie |

---

## Structure du projet

```
CodeCity/
├── app/                        # Écrans Expo Router
│   ├── _layout.tsx
│   ├── index.tsx               # Redirection welcome | map
│   └── (game)/                 # Jeu principal
│       ├── _layout.tsx
│       ├── welcome.tsx         # Accueil + intro LOG
│       ├── map.tsx             # Carte SVG des quartiers
│       ├── placement-test.tsx  # Test de niveau initial
│       └── district/[id]/    # Quartiers + niveaux
│           ├── index.tsx
│           └── level/[levelId].tsx
├── components/
│   ├── game/                   # QCM (autres mécaniques : prévues)
│   └── log/                    # LOGBubble, LOGModal
├── constants/                  # Palette (ex. colors.ts)
├── store/
│   ├── userStore.ts            # XP, level, placement
│   ├── progressStore.ts        # Avancement par quartier
│   └── streakStore.ts          # Streak quotidien
├── data/
│   ├── districts.ts            # Quartiers (déblocage, méta)
│   ├── placementTest.ts        # 8 questions + scoring
│   └── levels/                 # Niveaux par quartier + registry
├── types/
│   └── game.ts                 # Types TypeScript globaux
└── server/                     # Backend API REST (testable à part)
    ├── prisma/
    │   ├── schema.prisma       # MPD : User, UserProgress, Streak
    │   └── seed.ts             # Données de test
    └── src/
        ├── routes/
        │   ├── users.ts        # GET liste/détail, POST création
        │   └── progress.ts     # GET / POST progression
        ├── middlewares/
        │   └── errorHandler.ts # Gestion erreurs 400/404/500
        └── index.ts            # Serveur Express (port .env, ex. 3050)
```

---

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo Go sur ton téléphone (iOS / Android)

### Front-end (app mobile)

```bash
# À la racine du projet
npm install
npx expo start
```

Scanner le QR code avec Expo Go.

### Back-end (API REST)

```bash
cd server
npm install

# Créer le fichier d'environnement
cp .env.example .env
# Éditer .env : PORT=3050

# Initialiser la base de données
npx prisma migrate dev --name init

# Insérer les données de test
npx prisma db seed

# Lancer le serveur
npm run dev
```

Le serveur tourne sur `http://localhost:3050`.

---

## API REST

Base URL : `http://localhost:3050/api`

> **Offline-first.** L'app fonctionne entièrement sans serveur : la source de
> vérité est locale (Zustand + AsyncStorage). La synchronisation (`lib/sync.ts`)
> est best-effort — chaque appel a un timeout court et échoue silencieusement.
> L'URL de l'API se configure dans `app.json` → `expo.extra.apiUrl` ; sur un
> **device physique**, remplace `localhost` par l'IP LAN de la machine.

### Utilisateurs

```
GET    /health             → { status: "ok" } (sonde de disponibilité)
GET    /users              → Liste tous les users
GET    /users/:id          → Un user avec progress + streak
POST   /users              → Crée un user { username }
PATCH  /users/:id          → Met à jour { xp?, level?, placementLevel? }
PUT    /users/:id/streak   → Met à jour { currentStreak, longestStreak, lastPlayedDate }
```

### Progression

```
GET    /progress/:userId   → Niveaux complétés d'un user
POST   /progress           → Enregistre/actualise un niveau { userId, districtId, levelId, stars }
                             (upsert sur (userId, levelId) : rejouer un niveau ne crée pas de doublon)
```

### Codes d'erreur

| Code | Signification |
|---|---|
| 400 | Champ requis manquant dans le body |
| 404 | Utilisateur ou ressource introuvable |
| 409 | Nom d'utilisateur déjà pris |
| 500 | Erreur serveur interne |

### Tester les routes

Ouvrir `server/test.http` dans VSCode avec l'extension **REST Client**.

---

## Modèle de données

```prisma
model User {
  id             String         @id @default(cuid())
  username       String         @unique
  xp             Int            @default(0)
  level          Int            @default(1)
  placementLevel String?
  createdAt      DateTime       @default(now())
  progresses     UserProgress[]
  streak         Streak?
}

model UserProgress {
  id          String   @id @default(cuid())
  userId      String
  districtId  String
  levelId     String
  stars       Int
  completedAt DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model Streak {
  id             String    @id @default(cuid())
  userId         String    @unique
  currentStreak  Int       @default(0)
  longestStreak  Int       @default(0)
  lastPlayedDate DateTime?
  user           User      @relation(fields: [userId], references: [id])
}
```

---

## La ville — Les 8 quartiers

| # | Quartier | Concept | Niveaux | Statut |
|---|---|---|---|---|
| Q1 | Marché des Variables | Variables & données | 15 | MVP |
| Q2 | Carrefour des Conditions | if / else | 15 | MVP |
| Q3 | Usine des Boucles | for / while | 15 | MVP |
| Q4 | Atelier des Fonctions | Fonctions | 12 | V1 |
| Q5 | Bibliothèque des Listes | Tableaux & listes | 12 | V1 |
| Q6 | Archives des Tris | Algorithmes de tri | 10 | V2 |
| Q7 | Quartier des Miroirs | Récursivité | 10 | V2 |
| BOSS | La Tour Centrale | Défi final (mécaniques mixtes) | 5 | MVP |

---

## Test de placement

Au premier lancement, le joueur passe un test de 8 questions (présenté comme une "mission de recrutement par LOG"). Le score détermine le quartier de départ.

| Score | Niveau | Quartier de départ |
|---|---|---|
| 0-2 / 8 | Débutant absolu | Q1 — Variables |
| 3-5 / 8 | Débutant avec intuition | Q2 — Conditions |
| 6-7 / 8 | Bases solides | Q3 — Boucles |
| 8 / 8 | Intermédiaire | Q4 — Fonctions |

---

## LOG — L'IA tutrice

LOG est l'intelligence artificielle gardienne de CodeCity. Elle guide le joueur, explique les concepts avec des analogies simples, et réagit à la progression.

En **MVP**, les répliques de LOG sont **pré-écrites** dans l’app. En **V1**, l’intégration **Claude API** passera par un module dédié (`lib/claude.ts`, à ajouter).

**Ton de LOG :** court, bienveillant, légèrement mystérieux. Jamais condescendant.

```
Bonne réponse   → "Exactement. Tu commences à penser comme une machine."
Mauvaise réponse → "Intéressant. Même les machines se trompent. On réessaie ?"
Retour après pause → "Bon retour. CodeCity t'attendait."
```

---

## Roadmap

### MVP (en cours)
- [x] Structure du projet + stack configurée
- [x] Types TypeScript globaux
- [x] Données : districts, test de placement, registre des niveaux (Q1–Q7 + chapitres)
- [x] Stores Zustand (user, progress, streak)
- [x] Backend API REST (Express + Prisma + SQLite)
- [x] Écran test de placement (`app/(game)/placement-test.tsx`)
- [x] Carte de la ville + navigation quartiers (`map.tsx`, `district/[id]/`)
- [x] Mécanique QCM + écran niveau end-to-end (`components/game/QCM.tsx`, `level/[levelId].tsx`)
- [x] Composant LOG (bulles, modal) — répliques centralisées (`lib/claude.ts`)
- [x] Persistance locale AsyncStorage (profil, progression, streak)
- [x] Déblocage dynamique des quartiers (placement + progression, `data/progression.ts`)
- [x] XP → niveau de joueur + écran de fin de quartier (`district/[id]/complete.tsx`)
- [x] Branchement app ↔ API best-effort (création user, sync progression/streak — `lib/api.ts`, `lib/sync.ts`)
- [x] Mécaniques variées : QCM, **prédiction** (sortie de code), **remise en ordre** de lignes, **glisser-déposer** (compléter le code)
- [x] Boss final « Tour Centrale » (5 niveaux à mécaniques mixtes)
- [x] Badges (1 par quartier) + écran de victoire animé

### V1.0
- [x] Quartiers Q1 à Q4 complets
- [x] Système de badges
- [x] Mode hors-ligne (persistance locale AsyncStorage)
- [ ] LOG IA activée (Claude API via proxy backend)
- [ ] Notifications push (streak)

### V2.0
- [ ] Quartiers Q5 à Q8 + Boss
- [ ] Migration SQLite → PostgreSQL/Supabase
- [ ] Monétisation (Q5-Q8 premium)
- [ ] Mode défi entre amis

---

## Conventions

- TypeScript strict — pas de `any`
- Logique métier dans les hooks/stores, jamais dans les composants
- Future intégration Claude API : uniquement via un module `lib/claude.ts` (à créer), jamais en direct depuis les écrans
- Données de jeu dans `data/`, jamais en dur dans les composants
- Mobile-first — zones de touch ≥ 44px
- `accessibilityLabel` sur tous les éléments interactifs

---

## Licence

MIT — voir `LICENSE`
