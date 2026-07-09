# CodeCity — Documentation d'Architecture Technique v1.0

---

## 1. Présentation du projet

**CodeCity** est une application mobile éducative gamifiée dont l'objectif est d'apprendre l'algorithmique et la logique de programmation à des débutants complets, à travers une expérience narrative immersive et des puzzles progressifs.

**Concept narratif :** La ville de CodeCity est gouvernée par des algorithmes. Un bug mystérieux se propage. L'IA tutrice LOG recrute le joueur comme "Code Architect" pour réparer la ville quartier par quartier, en apprenant un concept algorithmique à chaque étape.

**Public cible :** Débutants complets, aucun prérequis technique. Sessions de 5 à 15 minutes par jour.

### Méthodologie de conception

- **Itérations courtes** : livrer des lots utilisables (carte → sélection de quartier → niveau QCM) plutôt que d’attendre le jeu complet.
- **Spécification par les données** : niveaux et questions dans `data/` pour faire évoluer le contenu sans retoucher en profondeur les écrans.
- **API-first pour le socle** : modèle Prisma et routes REST testables (`server/test.http`) avant couplage fort avec l’app mobile.
- **Prototype sur device** : Expo Go pour valider parcours, lisibilité et zones tactiles (≥ 44 px) avec de vrais usages.

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
├── _layout.tsx                 → Layout racine
├── index.tsx                   → Redirection welcome ou map selon placement
└── (game)/
    ├── _layout.tsx             → Stack jeu (header masqué)
    ├── welcome.tsx             → Accueil CRT + intro LOG
    ├── map.tsx                 → Carte SVG des quartiers
    ├── placement-test.tsx      → Test de placement (8 questions)
    └── district/[id]/
        ├── index.tsx           → Liste des niveaux du quartier
        └── level/[levelId].tsx → Niveau (QCM, LOG, progression locale)
```

**Zustand**
Gestion du state global. Léger, sans boilerplate Redux. Trois stores :
- `userStore` — profil, XP, niveau joueur
- `progressStore` — avancement par quartier/niveau
- `streakStore` — streak quotidien

La persistance est assurée par le middleware `persist` de Zustand adossé à `AsyncStorage` (équivalent mobile de localStorage) : profil, progression et streak sont conservés entre les sessions sans dépendre du backend. Une garde d'hydratation (`_hasHydrated` dans `userStore`) évite tout flash de redirection au démarrage.

**React Native Reanimated**
Animations sur le thread UI natif (effets sur la carte, halos, etc.). Les futures mécaniques type drag-and-drop s’appuieront sur la même stack.

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

**État actuel (MVP) :** les réponses de LOG proviennent d'une **base de connaissances locale** centralisée dans `lib/claude.ts` (mots-clés → explication par concept), consommée par `components/log/*`. Aucun appel réseau.

**Cible V1 :** intégration **Claude API** (Anthropic). Les appels réseau seront centralisés dans un module dédié (`lib/claude.ts`, à ajouter) — jamais directement depuis les composants d’écran.

---

## 5. Définition du MVP

### Périmètre fonctionnel MVP

Le MVP couvre les fonctionnalités minimales pour valider le concept avec de vrais utilisateurs.

| Fonctionnalité | Description | Statut |
|---|---|---|
| Test de placement | 8 questions → détermine le quartier de départ | ✅ Écran implémenté |
| Profil utilisateur | Création de compte, XP, niveau | ✅ Store prêt (UI / API à finaliser) |
| Carte de la ville | Affichage des quartiers, états débloqué / verrouillé | ✅ `map.tsx` |
| Quartier Q1 complet | 15 niveaux sur les Variables (3 chapitres) | ✅ Contenu + parcours complets |
| Déblocage des quartiers | Dérivé du placement + progression (`data/progression.ts`) | ✅ Dynamique, en chaîne |
| Persistance locale | Profil, progression, streak entre sessions | ✅ AsyncStorage (Zustand persist) |
| Mécanique QCM | Question + 4 choix + feedback | ✅ Composant + intégration niveau |
| Mécaniques de jeu | QCM, prédiction, remise en ordre, glisser-déposer | ✅ 4 mécaniques (`components/game/*`) |
| Boss final | Tour Centrale, 5 niveaux à mécaniques mixtes | ✅ `data/levels/boss.ts` |
| Badges + victoire | 1 badge/quartier, écran de fin animé | ✅ dérivés de la progression |
| LOG statique | Bulles de dialogue pré-écrites | ✅ Bulles + modal MVP |
| Streak quotidien | Flamme + compteur | ✅ Store + affichage dans l’en-tête de la carte |
| API REST | Utilisateurs (CRUD partiel) + progression + streak | ✅ Serveur testable **et branché** à l’app (best-effort, offline-first — `lib/api.ts`, `lib/sync.ts`) |

### Hors scope MVP
- LOG IA (Claude API) → V1
- Notifications push → V1
- Déblocage et parcours « produit » complets sur tous les quartiers (au-delà du périmètre carte actuel) → V1/V2
- Monétisation → V2
- Mode multijoueur → V2

*Note : des fichiers de données de niveaux existent déjà pour plusieurs quartiers (`data/levels/`) ; le jeu MVP se concentre surtout sur Q1–Q2 débloqués dans `districts.ts`.*

---

## 6. Prototype et mockups

### Parcours utilisateur principal (User Flow)

```
Lancement app
     │
     ▼
Accueil (`welcome`) — intro LOG (pas de création de compte in-app à ce stade)
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
Gameplay (**QCM** implémenté ; Drag & Drop / prédiction → prévus)
     │
     ├── Bonne réponse → Feedback vert → Niveau suivant
     └── Mauvaise réponse → Explication → Réessayer
          │
          ▼
     Fin de quartier → *(cinématique / badges : objectifs V1+, non implémentés)*
```

### Écrans MVP identifiés

1. **Accueil** — marque CODECITY, effet CRT/scanlines, intro LOG, accès test ou carte (`welcome.tsx`)
2. **Test de placement** — 8 questions, barre de progression, feedback immédiat
3. **Résultat placement** — niveau attribué, réplique LOG, CTA "Commencer"
4. **Carte de la ville** — districts avec état (débloqué / verrouillé / en cours / complété)
5. **Vue quartier** — chapitres, niveaux, progression
6. **Niveau QCM** — bulle LOG + question + 4 réponses
7. **Niveau Drag & Drop** — *non implémenté* (maquette / V1)
8. **Feedback niveau** — partie couverte dans l’écran niveau (étoiles selon indice, XP via store) ; pas d’écran dédié « récap » séparé
9. **Profil dédié** — *non implémenté* ; XP et streak visibles sur la **carte** (`map.tsx`)

---

## 7. Structure du code — Conventions

### Organisation des fichiers

```
Règle : un fichier = une responsabilité

components/   → Uniquement de l'UI, zéro logique métier lourde
store/        → State global Zustand (userStore, progressStore, streakStore)
constants/    → Palette et constantes UI partagées
hooks/        → *(Dossier optionnel / à venir pour factoriser la logique réutilisable.)*
lib/          → *(À créer : clients Claude, Supabase, etc.)*
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
- ❌ Pas d'appel Claude API dispersé dans l’UI (module `lib/claude.ts` une fois ajouté)
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
git clone https://github.com/zak201/CodeCity.git
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
