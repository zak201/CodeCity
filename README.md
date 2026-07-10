# CodeCity 🏙️

> 🔗 Repository : https://github.com/zak201/CodeCity

[![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5-433E38?style=flat)](https://github.com/pmndrs/zustand)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

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
| Auth | JWT (bcrypt + jsonwebtoken), rôles user / admin |
| Base de données | SQLite (dev) → PostgreSQL/Supabase (prod) |
| IA (LOG) | **Claude API** (`@anthropic-ai/sdk`) via proxy backend `POST /api/log/ask` ; repli sur base locale si hors-ligne ou clé absente |
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
│       ├── profile.tsx         # Profil : badges + statistiques
│       └── district/[id]/    # Quartiers + niveaux
│           ├── index.tsx
│           ├── complete.tsx   # Fin de quartier (badge + victoire)
│           └── level/[levelId].tsx
├── components/
│   ├── game/                   # QCM, Prediction, OrderLines, FillBlanks
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
├── lib/
│   ├── claude.ts               # askLog : IA LOG (backend + repli local)
│   ├── api.ts                  # Client HTTP backend (offline-first)
│   └── sync.ts                 # Synchro best-effort
├── types/
│   └── game.ts                 # Types TypeScript globaux
└── server/                     # Backend API REST (testable à part)
    ├── prisma/
    │   ├── schema.prisma       # MPD : User, UserProgress, Streak
    │   └── seed.ts             # Données de test
    └── src/
        ├── routes/
        │   ├── users.ts        # GET liste/détail, POST / PATCH
        │   ├── progress.ts     # GET / POST progression
        │   └── log.ts          # POST /log/ask → IA LOG (Claude)
        ├── middlewares/
        │   ├── cors.ts
        │   └── errorHandler.ts # Gestion erreurs 400/404/500
        ├── anthropic.ts        # Client Claude (clé côté serveur)
        └── index.ts            # Serveur Express (port .env, ex. 3050)
```

---

## 🚀 Démarrage rapide (voir l'app en 2 min)

L'app est **jouable seule, sans backend ni clé** — les données sont stockées localement. Le plus simple pour la découvrir :

```bash
git clone https://github.com/zak201/CodeCity.git
cd CodeCity
npm install
npx expo start
```

Dans le terminal Expo, choisis un mode :

| Touche | Ouvre l'app dans… | Prérequis |
|---|---|---|
| **`w`** | le **navigateur** | rien (le plus rapide) |
| QR code | **Expo Go** sur ton téléphone | app Expo Go + même Wi-Fi |
| **`i`** / **`a`** | simulateur iOS / émulateur Android | Xcode / Android Studio |

> Le backend et l'IA LOG sont **optionnels** (voir ci-dessous). Sans eux, le jeu tourne (progression locale) et LOG répond via une base de connaissances embarquée.

---

## Installation complète

### Prérequis
- **Node.js 20 LTS** ou plus, et **npm** — https://nodejs.org (vérifier avec `node -v`)
- **Git**
- Pour tester sur mobile : l'app **Expo Go** (App Store / Play Store). Sinon le mode **web** (`w`) suffit.
- *(Optionnel — IA LOG)* une **clé API Anthropic** — https://console.anthropic.com

### 1) Front-end — l'app (obligatoire)

```bash
npm install
npx expo start
```

Puis `w` (web), QR code (Expo Go) ou `i`/`a` (simulateur/émulateur).

### 2) Back-end — API REST (optionnel)

Utile pour la **synchro** (multi-appareils) et l'**IA LOG en temps réel**.

```bash
cd server
npm install

# 1. Fichier d'environnement (PORT, DATABASE_URL, clé IA…)
cp .env.example .env

# 2. Base SQLite : applique les migrations + génère le client Prisma
npx prisma migrate dev

# 3. (optionnel) données de démonstration
npx prisma db seed

# 4. Démarre l'API sur http://localhost:3050
npm run dev
```

Vérifier que l'API répond : ouvrir **http://localhost:3050/api/health** → `{"status":"ok"}`.

> **Auth JWT & comptes de démo.** Le seed crée deux comptes (mot de passe
> `codecity123`) : **`admin@codecity.dev`** (rôle **admin** — peut lister
> `/api/users`) et **`player@codecity.dev`** (rôle **user**). Le secret de
> signature se règle via `JWT_SECRET` dans `server/.env` (un défaut de dev
> existe si absent).

### 3) IA LOG — Claude (optionnel)

Sans clé, LOG répond déjà (base locale). Pour activer les **réponses génératives de Claude** :

1. Ajouter la clé dans **`server/.env`** :
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   LOG_MODEL=claude-haiku-4-5   # optionnel — modèle par défaut
   ```
2. Relancer `npm run dev` dans `server/`.
3. Dans l'app : ouvrir un niveau → bouton **?** → poser une question à LOG.

> La clé reste **strictement côté serveur**, jamais embarquée dans l'app.

### 4) Relier l'app au backend depuis un téléphone

Par défaut l'app cible `http://localhost:3050/api` (`app.json` → `expo.extra.apiUrl`).

- **Web** ou **simulateur iOS** : `localhost` fonctionne, rien à changer.
- **Téléphone (Expo Go)** / **émulateur Android** : `localhost` désigne l'appareil lui-même. Mettre l'**IP LAN** de la machine dans `app.json` :
  ```json
  "extra": { "apiUrl": "http://192.168.1.20:3050/api" }
  ```
  (IP : `ipconfig` sous Windows, `ip a` sous macOS/Linux. Téléphone et PC sur le **même Wi-Fi**.)

---

## 🛠️ Dépannage

| Problème | Solution |
|---|---|
| `Port 3050 déjà utilisé` | Changer `PORT=` dans `server/.env`, ou arrêter l'autre processus. |
| L'app ne joint pas l'API (téléphone) | Mettre l'**IP LAN** dans `app.json` (§4) + même Wi-Fi. |
| LOG donne des réponses génériques | Normal sans clé : ajouter `ANTHROPIC_API_KEY` (§3). Le repli local est volontaire (offline-first). |
| Prisma : *client not generated* | Relancer `npx prisma generate` dans `server/`. |
| `npx expo start` échoue | Vérifier **Node 20+** (`node -v`), puis supprimer `node_modules` et refaire `npm install`. |

---

## API REST

Base URL : `http://localhost:3050/api`

> **Offline-first.** L'app fonctionne entièrement sans serveur : la source de
> vérité est locale (Zustand + AsyncStorage). La synchronisation (`lib/sync.ts`)
> est best-effort — chaque appel a un timeout court et échoue silencieusement.
> L'URL de l'API se configure dans `app.json` → `expo.extra.apiUrl` ; sur un
> **device physique**, remplace `localhost` par l'IP LAN de la machine.

### Santé

```
GET    /health             → { status: "ok" } (sonde de disponibilité)
```

### Auth (JWT)

```
POST   /auth/register      → { email, username, password } → { token, user }
POST   /auth/login         → { email, password }           → { token, user }
GET    /auth/me            → profil du user connecté (Authorization: Bearer <token>)
```

Mots de passe hachés avec **bcrypt** ; jeton **JWT** (HS256) renvoyé au client.

### Données du joueur connecté — `/me` (token requis)

```
PATCH  /me                 → { xp?, level?, placementLevel? }
GET    /me/progress        → niveaux complétés du user connecté
POST   /me/progress        → upsert d'un niveau { districtId, levelId, stars }
PUT    /me/streak          → { currentStreak, longestStreak, lastPlayedDate }
```

> L'utilisateur est **dérivé du token**, jamais d'un id fourni par le client.

### Admin (rôle `admin` requis)

```
GET    /users              → liste des utilisateurs (sans le hash de mot de passe)
GET    /users/:id          → un utilisateur + progression + série
```

### IA — LOG (tuteur)

```
POST   /log/ask            → { concept, question } → { answer } (relais vers Claude, clé côté serveur)
                             503 si ANTHROPIC_API_KEY absente → l'app bascule sur sa base locale
```

### Codes d'erreur

| Code | Signification |
|---|---|
| 400 | Champ requis manquant ou invalide |
| 401 | Token absent, invalide ou expiré |
| 403 | Rôle insuffisant (route réservée, ex. admin) |
| 404 | Utilisateur ou ressource introuvable |
| 409 | Email ou nom d'utilisateur déjà pris |
| 500 | Erreur serveur interne |

### Tester les routes

Ouvrir `server/test.http` dans VSCode avec l'extension **REST Client**.

---

## Modèle de données

```prisma
model User {
  id             String         @id @default(cuid())
  username       String         @unique
  email          String?        @unique
  passwordHash   String?
  role           String         @default("user")
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

Les réponses de LOG proviennent de l’**API Claude** (modèle `claude-haiku-4-5` par défaut, configurable via `LOG_MODEL`), appelée **uniquement côté serveur** via `POST /api/log/ask` — la clé `ANTHROPIC_API_KEY` n’est jamais embarquée dans l’app. Tout passe par le module `lib/claude.ts`. Si le serveur est injoignable ou la clé absente, l’app retombe automatiquement sur une base de connaissances locale (offline-first).

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
- [x] LOG IA activée (Claude API via proxy backend `POST /api/log/ask`, repli local offline-first)
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
- Appels IA (Claude) : uniquement via `lib/claude.ts` (front) et le proxy backend `/api/log/ask` — jamais en direct depuis les écrans, jamais de clé dans l'app
- Données de jeu dans `data/`, jamais en dur dans les composants
- Mobile-first — zones de touch ≥ 44px
- `accessibilityLabel` sur tous les éléments interactifs

---

## Licence

MIT — voir `LICENSE`
