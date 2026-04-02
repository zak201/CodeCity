# CodeCity 🏙️

> *"La ville de CodeCity est entièrement gouvernée par des algorithmes. Un bug mystérieux se propage. LOG, l'IA gardienne, t'a recruté comme Code Architect. À toi de sauver la ville."*

Jeu mobile éducatif qui apprend l'algorithmique aux débutants complets, à travers une histoire narrative et des puzzles progressifs. 5 à 15 minutes par jour.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Mobile | React Native + Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| State | Zustand + AsyncStorage |
| Backend | Express.js + Prisma |
| Base de données | SQLite (dev) → PostgreSQL/Supabase (prod) |
| IA (LOG) | Claude API — Anthropic |
| Animations | React Native Reanimated 2 + Lottie |

---

## Structure du projet

```
CodeCity/
├── app/                        # Écrans Expo Router
│   ├── (auth)/                 # Login, onboarding
│   ├── (game)/                 # Jeu principal
│   │   ├── index.tsx           # Carte de la ville
│   │   ├── placement-test.tsx  # Test de niveau initial
│   │   └── district/[id]/      # Quartiers + niveaux
│   └── _layout.tsx
├── components/
│   ├── ui/                     # Boutons, badges, cards
│   ├── game/                   # QCM, DragDrop, Prediction...
│   ├── log/                    # Bulle LOG, avatar, modal IA
│   └── city/                   # Carte, districts
├── store/
│   ├── userStore.ts            # XP, level, profil
│   ├── progressStore.ts        # Avancement par quartier
│   └── streakStore.ts          # Streak quotidien
├── data/
│   ├── districts.ts            # 8 quartiers de CodeCity
│   ├── placementTest.ts        # 8 questions + scoring
│   └── levels/                 # Niveaux par quartier
├── lib/
│   ├── claude.ts               # Wrapper Claude API (LOG IA)
│   └── supabase.ts             # Client Supabase
├── types/
│   └── game.ts                 # Types TypeScript globaux
└── server/                     # Backend API REST
    ├── prisma/
    │   ├── schema.prisma       # MPD : User, UserProgress, Streak
    │   └── seed.ts             # Données de test
    └── src/
        ├── routes/
        │   ├── users.ts        # CRUD utilisateurs
        │   └── progress.ts     # Progression en jeu
        ├── middlewares/
        │   └── errorHandler.ts # Gestion erreurs 400/404/500
        └── index.ts            # Serveur Express port 3050
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

### Utilisateurs

```
GET    /users              → Liste tous les users
GET    /users/:id          → Un user avec progress + streak
POST   /users              → Crée un user { username }
```

### Progression

```
GET    /progress/:userId   → Niveaux complétés d'un user
POST   /progress           → Enregistre un niveau { userId, districtId, levelId, stars }
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
| BOSS | La Tour Centrale | Défi final | 1 | V2 |

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

En production, LOG est alimentée par **Claude API** via `lib/claude.ts`. En MVP, les répliques sont pré-écrites.

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
- [x] Données : districts, test de placement, Q1
- [x] Stores Zustand (user, progress, streak)
- [x] Backend API REST (Express + Prisma + SQLite)
- [ ] Écran test de placement
- [ ] Carte de la ville (Q1-Q2 débloqués)
- [ ] Mécaniques de jeu : QCM, Drag & Drop
- [ ] Composant LOG (bulles, dialogues)

### V1.0
- [ ] Quartiers Q1 à Q4 complets
- [ ] LOG IA activée (Claude API)
- [ ] Système de badges
- [ ] Notifications push (streak)
- [ ] Mode hors-ligne

### V2.0
- [ ] Quartiers Q5 à Q8 + Boss
- [ ] Migration SQLite → PostgreSQL/Supabase
- [ ] Monétisation (Q5-Q8 premium)
- [ ] Mode défi entre amis

---

## Conventions

- TypeScript strict — pas de `any`
- Logique métier dans les hooks/stores, jamais dans les composants
- Claude API uniquement via `lib/claude.ts`, jamais en direct
- Données de jeu dans `data/`, jamais en dur dans les composants
- Mobile-first — zones de touch ≥ 44px
- `accessibilityLabel` sur tous les éléments interactifs

---

## Licence

MIT — voir `LICENSE`
