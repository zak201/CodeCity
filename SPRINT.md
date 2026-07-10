# Sprint de finalisation — CodeCity

> Objectif : stabiliser le jeu et corriger les fonctionnalités critiques **avant le playtest (séance 10)**.
> Méthode : audit complet du code (4 revues croisées : gameplay, état/persistance, données, onboarding/backend) → priorisation MoSCoW → corrections + vérification `tsc`.

---

## 1. Résumé exécutif

- **Aucun bug bloquant.** Le jeu est jouable de bout en bout (onboarding → 8 quartiers → boss).
- **Contenu sain :** 94 niveaux, `totalLevels` cohérent partout → fin de quartier, badges et déblocages fiables.
- **8 corrections livrées** ce sprint (intégrité XP/progression, hydratation, UI/UX, robustesse serveur).
- **2 ajouts livrés dans la foulée** (hors MoSCoW initial) : authentification **JWT** (bcrypt, rôles user/admin, comptes de démo) et bouton **« Recommencer depuis le début »** au Profil ; la synchro de la progression est désormais **authentifiée** (voir §5).
- Compilation **frontend + backend** : `tsc --noEmit` **sans erreur** (revérifié).

---

## 2. État des lieux

### ✅ Fonctionnalités majeures terminées
| Domaine | Statut |
|---|---|
| Onboarding narratif + test de placement (8 questions → quartier de départ) | ✅ |
| Carte de la ville (8 quartiers, états verrouillé / en cours / complété) | ✅ |
| 4 mécaniques de jeu (QCM, prédiction, remise en ordre, glisser-déposer) | ✅ |
| Verrouillage séquentiel + déblocage en chaîne des quartiers | ✅ |
| Étoiles (1–3) + XP → niveau de joueur | ✅ |
| Badges (1 / quartier) + écran de victoire animé | ✅ |
| Écran Profil (badges, étoiles, XP, série) | ✅ |
| Série quotidienne (streak) | ✅ |
| Persistance locale **offline-first** (AsyncStorage) | ✅ |
| Boss final (Tour Centrale) | ✅ |
| API REST (Express + Prisma) : `/api/auth`, `/api/me` (protégé JWT), `/api/users` (admin), `/api/log` | ✅ |
| **Authentification JWT** — inscription / connexion (bcrypt), rôles user/admin, comptes de démo — **optionnelle** | ✅ |
| Synchro de la progression **authentifiée** (best-effort) + réclamation des parties jouées hors-ligne | ✅ |
| Réinitialisation locale de la progression (« Recommencer depuis le début », Profil) | ✅ |
| **IA LOG** — Claude via proxy backend + repli base locale | ✅ |
| Contenu : 94 niveaux (Q1–Q7 + boss), thème jour/nuit | ✅ |

### 🟡 À finaliser (non bloquant)
- Barème d'étoiles : le palier **1 étoile** est aujourd'hui inatteignable (toujours 2 ou 3 à la 1re réussite).
- Notifications push (rappel de série).
- Migration BDD SQLite → PostgreSQL/Supabase (prod).
- Contenu « produit » affiné sur les quartiers avancés.

### 🔴 Bloquant
- **Aucun.**

---

## 3. Priorisation MoSCoW (tâches du sprint)

| Priorité | Tâche | Statut |
|---|---|---|
| 🔴 Must | Créditer l'XP **une seule fois** (niveaux rejouables → XP farmable) | ✅ Corrigé |
| 🔴 Must | Ne jamais **sauter un niveau non validé** (mauvaise réponse « Continuer ») | ✅ Corrigé |
| 🔴 Must | **Garde d'hydratation** progress/streak (série perdue + XP quartiers sautés re-créditée au démarrage à froid) | ✅ Corrigé |
| 🟡 Should | QCM : bouton **« Réessayer »** sur mauvaise réponse (cohérence + confort) | ✅ Corrigé |
| 🟡 Should | Test de placement : indicateur d'étape (fin « x/8 » trompeuse quand le test s'arrête à 6) | ✅ Corrigé |
| 🟢 Could | `onRehydrateStorage` défensif (pas de blocage sur le splash) | ✅ Corrigé |
| 🟢 Could | Serveur : sortie propre si le port est occupé (au lieu d'une exception) | ✅ Corrigé |
| 🟢 Could | Nettoyage du timer d'auto-avance (placement) | ✅ Corrigé |
| 🟢 Could | Palier 1 étoile atteignable (compter les tentatives) | ⏳ Reporté |
| 🟢 Could | Garde `fillSolution.length === blankCount` (glisser-déposer, latent) | ⏳ Reporté |
| ⚪ Won't (ce sprint) | Push, migration Postgres, contenu premium Q5–Q8, monétisation | — |

> **Hors MoSCoW initial (ajoutés la même journée, après le sprint) :** authentification JWT + synchro authentifiée, et bouton de réinitialisation de la progression. Détaillés en **§5**.

---

## 4. Corrections livrées ce sprint

1. **XP créditée une seule fois** — `app/(game)/district/[id]/level/[levelId].tsx` : l'XP n'est accordée qu'à la 1re complétion d'un niveau (les niveaux restent rejouables sans farm).
2. **Intégrité de la progression** — même fichier : `goNextOrDistrict` ne passe au niveau suivant **que si le niveau courant est validé** ; sinon retour au quartier. Fin du « trou » de progression / contournement du verrou.
3. **Garde d'hydratation** — `store/progressStore.ts`, `store/streakStore.ts` : ajout de `_hasHydrated` + `onRehydrateStorage`. La carte (`app/(game)/map.tsx`) n'exécute `recordPlay()` et `creditSkippedDistricts()` **qu'après** rehydratation des 3 stores → série fiable, plus de re-crédit d'XP.
4. **QCM « Réessayer »** — `components/game/QCM.tsx` : sur mauvaise réponse, le joueur peut réessayer sur place (comme les autres mécaniques) ou continuer.
5. **Test de placement** — `app/(game)/placement-test.tsx` : indicateur « Question N » (au lieu de « N / 8 » alors que le test peut s'arrêter à 6) + nettoyage du timer au démontage.
6. **Robustesse hydratation** — `store/userStore.ts` : `onRehydrateStorage` marque l'état hydraté même en cas d'échec (plus de blocage possible sur le splash).
7. **Serveur** — `server/src/index.ts` : sortie propre (`process.exit(1)`) si le port est déjà utilisé.

Vérification : `npx tsc --noEmit` **OK** (app + serveur).

---

## 5. Ajouts post-sprint (même journée, hors périmètre MoSCoW)

Deux fonctionnalités livrées juste après les corrections de stabilisation.

### 5.1 Authentification JWT (optionnelle)
- **Serveur** — `server/src/auth.ts` : émission / vérification de jetons **JWT (HS256)** portant l'id et le rôle (`signToken`, `requireAuth`, `requireRole`), secret via `JWT_SECRET`, TTL 7 jours.
- **Routes** — `server/src/routes/auth.ts` (`POST /api/auth/register`, `/login`, `GET /api/auth/me`) : mots de passe hachés avec **bcrypt**, messages d'erreur génériques (pas de fuite d'existence d'email). `server/src/routes/users.ts` réservé au rôle **admin**. `server/src/routes/me.ts` : données dérivées du token (jamais d'un id fourni par le client).
- **Base** — `server/prisma/schema.prisma` + migration `add_auth` (`passwordHash`, `role`). Seed (`server/prisma/seed.ts`) : comptes de démo `admin@codecity.dev` et `player@codecity.dev`, mot de passe **`codecity123`**.
- **Client** — écran `app/(game)/auth.tsx` (connexion / inscription, accessible depuis le Profil), `store/authStore.ts` (session persistée, offline-first), `lib/auth.ts` (appels register / login).
- **Principe** — l'auth est **optionnelle** : le jeu reste 100 % jouable sans compte ; se connecter sert uniquement à **synchroniser la progression** avec le backend.

### 5.2 Synchro authentifiée
- `lib/sync.ts` / `lib/api.ts` : la synchro (XP, progression, série) passe désormais par `/api/me` avec le **jeton JWT** ; sans jeton, elle est simplement ignorée (best-effort, silencieuse). Réclamation des parties jouées hors-ligne au moment du login (`pushLocalToServer`).

### 5.3 Réinitialisation de la progression
- `app/(game)/profile.tsx` : bouton **« Recommencer depuis le début »** — remet à zéro progression, série, XP et profil **sur l'appareil** (confirmation native ; `window.confirm` sur le web où `Alert` n'est pas fiable), puis retour à l'accueil.

Vérification : `npx tsc --noEmit` **OK** (app + serveur).

---

## 6. Checklist playtest (séance 10)

- [ ] Le build démarre sans erreur (`npx expo start`).
- [ ] Nouveau joueur : accueil → placement → quartier de départ correct.
- [ ] Jouer 3 niveaux : étoiles + XP corrects ; **rejouer** un niveau ne re-crédite pas l'XP.
- [ ] Mauvaise réponse → pas de saut de niveau (le niveau reste « en cours »).
- [ ] Fin de quartier → badge + écran de victoire + quartier suivant débloqué.
- [ ] Profil : badges / étoiles / XP / série cohérents (y compris joueur vierge).
- [ ] Série : relancer l'app → la série est conservée (pas de reset).
- [ ] LOG : poser une question (avec `ANTHROPIC_API_KEY` → Claude ; sans clé → repli local).
- [ ] Auth (optionnelle) : créer un compte / se connecter (`player@codecity.dev` / `codecity123`) → synchro OK, puis se déconnecter.
- [ ] Profil : « Recommencer depuis le début » → progression, étoiles, XP et série remises à zéro.
- [ ] Bascule thème jour / nuit.
- [ ] Mode avion : l'app reste jouable (offline-first).

---

## 7. Scénario de démo (~6 min)

1. **Concept & narratif** (30 s) — CodeCity, ville gouvernée par des algorithmes ; LOG recrute le joueur comme « Code Architect ».
2. **Onboarding + placement** (1 min) — test de recrutement → quartier attribué.
3. **Gameplay** (2 min) — carte, puis un niveau de 2–3 mécaniques (QCM, prédiction, glisser-déposer) ; étoiles + XP.
4. **IA LOG** (1 min) — poser une question dans un niveau ; réponse contextuelle (quartier / concept).
5. **Fin de quartier** (1 min) — badge + écran de victoire + profil.
6. **Architecture & choix techniques** (1 min) — client-serveur découplé, offline-first, **API sécurisée par JWT** (bcrypt, rôles user/admin, comptes de démo), Claude via proxy.

---

*Rapport de sprint — CodeCity. Voir aussi `ARCHITECTURE.md` (technique) et `README.md` (lancement).*
