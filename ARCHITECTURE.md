# CodeCity — Documentation d'Architecture Technique v1.0

---

## 1. Présentation du projet

**CodeCity** est une application mobile éducative gamifiée dont l'objectif est d'apprendre l'algorithmique et la logique de programmation à des débutants complets, à travers une expérience narrative immersive et des puzzles progressifs.

**Concept narratif :** La ville de CodeCity est gouvernée par des algorithmes. Un bug mystérieux se propage. L'IA tutrice LOG recrute le joueur comme "Code Architect" pour réparer la ville quartier par quartier, en apprenant un concept algorithmique à chaque étape.

**Public cible :** Débutants complets, aucun prérequis technique. Sessions de 5 à 15 minutes par jour.

---

## 2. Environnement de développement

### Prérequis

| Outil | Version minimale | Usage |
|---|---|---|
| Node.js | 18.x LTS | Runtime JS frontend + backend |
| npm | 9.x | Gestionnaire de paquets |
| Expo CLI | SDK 54 | Toolchain mobile |
| Expo Go | Dernière version | Test sur device physique |
| Git | 2.x | Versioning |
| VSCode | Dernière version | Éditeur principal |

### Extensions VSCode recommandées
- **REST Client** — exécution des fichiers `.http` pour tester l'API
- **Prisma** — coloration syntaxique des schémas `.prisma`
- **ESLint + Prettier** — linting et formatage TypeScript
- **Expo Tools** — support Expo Router dans l'éditeur

### Variables d'environnement

**`server/.env`**
```env
PORT=3050
DATABASE_URL="file:./dev.db"
```

**`.env` (racine — à créer pour la prod)**
```env
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
```

---

## 3. Architecture globale

CodeCity suit une architecture **client-serveur découplée** :

```
┌─────────────────────────────────────────────────────┐
│                  APP MOBILE (Expo)                  │
│  Expo Router  │  Zustand  │  React Native           │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP REST
┌──────────────────────▼──────────────────────────────┐
│               BACKEND API (Express.js)               │
│  Routes REST  │  Prisma ORM  │  SQLite → PostgreSQL  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              SERVICES EXTERNES                       │
│  Claude API (Anthropic)  │  Supabase Auth (prod)    │
└─────────────────────────────────────────────────────┘
```

### Principes architecturaux

- **Séparation des responsabilités** : logique métier dans les hooks/stores, jamais dans les composants UI
- **Data-driven** : toutes les données de jeu (niveaux, questions, districts) sont déclarées en JSON dans `data/`, pas en dur dans le code
- **API-first** : le backend est indépendant du front, testable séparément
- **TypeScript strict** : typage fort sur l'ensemble de la codebase, zéro `any`

---

## 4. Stack technique détaillée

### Frontend — Application mobile

**React Native + Expo SDK 54**
Expo permet de cibler iOS et Android depuis une seule codebase JavaScript/TypeScript, avec un toolchain simplifié (pas besoin de Xcode/Android Studio pour le développement).

**Expo Router**
Système de navigation basé sur la structure des fichiers (file-based routing), similaire à Next.js. Chaque fichier dans `app/` correspond à une route.

```
app/
├── _layout.tsx          → Layout racine (SafeAreaProvider, Stack)
├── index.tsx            → Redirection vers /(game)/
├── (auth)/
│   ├── login.tsx        → /login
│   └── onboarding.tsx   → /onboarding
└── (game)/
    ├── _layout.tsx      → Layout du jeu
    ├── index.tsx        → /game (carte de la ville)
    ├── placement-test.tsx
    └── district/[id]/
        ├── index.tsx    → /game/district/q1
        └── level/[levelId].tsx
```

**Zustand**
Gestion du state global. Léger, sans boilerplate Redux. Trois stores :
- `userStore` — profil, XP, niveau joueur
- `progressStore` — avancement par quartier/niveau
- `streakStore` — streak quotidien

Tous les stores sont persistés via `AsyncStorage` (équivalent mobile de localStorage).

**React Native Reanimated 2**
Animations performantes exécutées sur le thread UI natif (pas sur le thread JS), indispensable pour les mécaniques Drag & Drop fluides.

### Backend — API REST

**Express.js**
Framework minimaliste Node.js pour construire l'API REST. Choisi pour sa compatibilité totale avec TypeScript et l'écosystème Node.js déjà utilisé côté front.

**Prisma ORM**
ORM TypeScript-first avec un schéma déclaratif (`schema.prisma`) et une CLI qui génère les migrations SQL automatiquement. Avantages :
- Types générés automatiquement depuis le schéma → zéro désynchronisation entre BDD et code
- Migrations versionnées
- Seed scriptable en TypeScript

**SQLite (développement) → PostgreSQL/Supabase (production)**
SQLite est utilisé en local pour sa simplicité (pas de serveur à lancer). La migration vers PostgreSQL est transparente avec Prisma : seule la `DATABASE_URL` dans `.env` change.

### Modèle de données (MPD)

```
┌─────────────────────┐
│        User         │
├─────────────────────┤
│ id (PK, cuid)       │
│ username (unique)   │
│ xp                  │
│ level               │
│ placementLevel      │
│ createdAt           │
└────────┬────────────┘
         │ 1
         │
    ─────┼──────────────────────────
         │                          │
         │ N                        │ 1
┌────────▼────────────┐  ┌──────────▼──────────┐
│    UserProgress     │  │       Streak        │
├─────────────────────┤  ├─────────────────────┤
│ id (PK, cuid)       │  │ id (PK, cuid)       │
│ userId (FK)         │  │ userId (FK, unique) │
│ districtId          │  │ currentStreak       │
│ levelId             │  │ longestStreak       │
│ stars (1-3)         │  │ lastPlayedDate      │
│ completedAt         │  └─────────────────────┘
└─────────────────────┘
```

### Service IA — LOG

LOG, l'IA tutrice du jeu, est alimentée par **Claude API** (Anthropic, modèle `claude-sonnet-4-20250514`). Toutes les interactions passent par le wrapper `lib/claude.ts` — jamais d'appel direct à l'API dans les composants.

```typescript
// lib/claude.ts
export async function askLOG(question: string, concept: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: `Tu es LOG, IA tutrice de CodeCity. Tu aides des débutants.
               Analogies simples. Maximum 3 phrases. Concept actuel : ${concept}`,
      messages: [{ role: 'user', content: question }]
    })
  })
  const data = await response.json()
  return data.content[0].text
}
```

---

## 5. Définition du MVP

### Périmètre fonctionnel MVP

Le MVP couvre les fonctionnalités minimales pour valider le concept avec de vrais utilisateurs.

| Fonctionnalité | Description | Statut |
|---|---|---|
| Test de placement | 8 questions → détermine le quartier de départ | 🔄 En cours |
| Profil utilisateur | Création de compte, XP, niveau | ✅ Store prêt |
| Carte de la ville | Affichage des quartiers Q1-Q2 débloqués | 🔄 En cours |
| Quartier Q1 complet | 15 niveaux sur les Variables | 🔄 En cours |
| Mécanique QCM | Question + 4 choix + feedback | 🔄 En cours |
| Mécanique Drag & Drop | Glisser les bons éléments | 🔄 En cours |
| LOG statique | Bulles de dialogue pré-écrites | 🔄 En cours |
| Streak quotidien | Flamme + compteur de jours consécutifs | ✅ Store prêt |
| API REST | CRUD users + progression | ✅ Fonctionnel |

### Hors scope MVP
- LOG IA (Claude API) → V1
- Notifications push → V1
- Quartiers Q3 à Q8 → V1/V2
- Monétisation → V2
- Mode multijoueur → V2

---

## 6. Prototype et mockups

### Parcours utilisateur principal (User Flow)

```
Lancement app
     │
     ▼
Onboarding (nom d'avatar)
     │
     ▼
Test de placement LOG (8 questions)
     │
     ▼
Résultat → Quartier attribué
     │
     ▼
Carte de CodeCity (districts)
     │
     ▼
Sélection d'un niveau
     │
     ▼
Gameplay (QCM / Drag&Drop / Prédiction)
     │
     ├── Bonne réponse → Feedback vert → Niveau suivant
     └── Mauvaise réponse → Explication → Réessayer
          │
          ▼
     Fin de quartier → Cinématique texte → Badge
```

### Écrans MVP identifiés

1. **Onboarding** — choix du nom d'avatar, intro narrative de LOG
2. **Test de placement** — 8 questions, barre de progression, feedback immédiat
3. **Résultat placement** — niveau attribué, réplique LOG, CTA "Commencer"
4. **Carte de la ville** — districts avec état (débloqué / verrouillé / en cours / complété)
5. **Vue quartier** — chapitres, niveaux, progression
6. **Niveau QCM** — bulle LOG + question + 4 réponses
7. **Niveau Drag & Drop** — zone source + zone cible
8. **Feedback niveau** — étoiles obtenues, XP gagné, bouton suivant
9. **Profil** — nom, level, XP, badges, streak

---

## 7. Structure du code — Conventions

### Organisation des fichiers

```
Règle : un fichier = une responsabilité

components/   → Uniquement de l'UI, zéro logique métier
hooks/        → Logique réutilisable (useLOG, useProgress, useStreak)
store/        → State global Zustand (userStore, progressStore, streakStore)
lib/          → Clients externes (claude.ts, supabase.ts)
data/         → Données JSON du jeu (niveaux, questions, districts)
types/        → Interfaces TypeScript globales
```

### Convention de nommage

| Type | Convention | Exemple |
|---|---|---|
| Composants | PascalCase | `DistrictCard.tsx` |
| Hooks | camelCase + `use` | `useProgress.ts` |
| Stores | camelCase + `Store` | `userStore.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_STARS = 3` |
| Types/Interfaces | PascalCase | `interface Level {}` |
| Fichiers de données | kebab-case | `q1-variables.ts` |

### Pattern composant standard

```typescript
// Toujours : interface de props typée + export nommé
interface DistrictCardProps {
  district: District
  progress: number
  onPress: () => void
}

export function DistrictCard({ district, progress, onPress }: DistrictCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Quartier ${district.name}, ${progress}% complété`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* UI uniquement */}
    </Pressable>
  )
}
```

### Règles absolues

- ❌ Pas de `any` en TypeScript
- ❌ Pas de logique métier dans un composant
- ❌ Pas d'appel Claude API hors `lib/claude.ts`
- ❌ Pas de données de jeu en dur dans les composants
- ✅ `accessibilityLabel` sur tous les éléments interactifs
- ✅ Zones de touch ≥ 44px (standard Apple HIG)

---

## 8. Routes API — Référence complète

Base URL (développement) : `http://localhost:3050/api`

### Utilisateurs

| Méthode | Route | Description | Body | Réponse |
|---|---|---|---|---|
| GET | `/users` | Liste tous les users | — | `User[]` |
| GET | `/users/:id` | Un user + progress + streak | — | `User` avec relations |
| POST | `/users` | Créer un user | `{ username }` | `User` créé |

### Progression

| Méthode | Route | Description | Body | Réponse |
|---|---|---|---|---|
| GET | `/progress/:userId` | Niveaux complétés | — | `UserProgress[]` |
| POST | `/progress` | Enregistrer un niveau | `{ userId, districtId, levelId, stars }` | `UserProgress` créé |

### Gestion des erreurs

```json
// 400 — Champ manquant
{ "error": "Le champ username est requis" }

// 404 — Ressource introuvable
{ "error": "Utilisateur introuvable" }

// 409 — Conflit (username déjà pris)
{ "error": "Ce nom d'utilisateur est déjà pris" }

// 500 — Erreur interne
{ "error": "Erreur interne du serveur" }
```

---

## 9. Installation complète

### Frontend

```bash
git clone https://github.com/[username]/CodeCity.git
cd CodeCity
npm install
npx expo start
```

### Backend

```bash
cd server
npm install
cp .env.example .env      # Configurer PORT et DATABASE_URL
npx prisma migrate dev --name init
npx prisma db seed
npm run dev               # Démarre sur le port défini dans .env
```

### Tester l'API

Ouvrir `server/test.http` avec l'extension **REST Client** dans VSCode et exécuter les requêtes une par une.

---

## 10. Décisions techniques et justifications

| Décision | Alternative écartée | Raison |
|---|---|---|
| Expo Router | React Navigation | File-based routing + support web natif pour futures évolutions |
| Zustand | Redux Toolkit | Moins de boilerplate, API simple, suffisant pour ce projet |
| Prisma | Sequelize | TypeScript-first, meilleure DX, migrations automatiques |
| SQLite (dev) | PostgreSQL local | Zéro configuration, migration transparente via Prisma |
| Claude API pour LOG | GPT-4 / Gemini | Qualité pédagogique, ton plus adapté au contexte éducatif |
| Express.js | Fastify / NestJS | Légèreté, courbe d'apprentissage faible, suffisant pour le MVP |

---

*CodeCity — Architecture Technique v1.0 — Dernière mise à jour : Avril 2026*
