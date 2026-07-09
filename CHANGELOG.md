# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

Le format s’inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

> Les entrées sont **alignées sur l’historique Git** (`git log --oneline --reverse`).  
> *Note :* le socle **Express + Prisma** apparaît dès les premiers commits (**v0.1.0**), pas dans la dernière livraison.

## [0.5.0] - 2026-07-09

### Ajouté

- **Trois nouvelles mécaniques de jeu** (`components/game/`) en plus du QCM :
  - `Prediction` — prédire la sortie d'un bloc de code (mécanique `prediction`).
  - `OrderLines` — remettre des lignes de code dans le bon ordre (mécanique `construction`).
  - `FillBlanks` — compléter le code en plaçant des jetons dans les trous (mécanique `drag-drop`).
- **Boss final « Tour Centrale »** (`data/levels/boss.ts`) : 5 niveaux mêlant les 4 mécaniques, câblé dans le registry, `totalLevels` porté à 5.
- **Badges** (1 par quartier complété) dérivés de la progression + **écran de victoire animé** (médaille, finale spéciale « Ville sauvée » quand le boss est vaincu).
- LOG plus réactif : base de connaissances locale par concept dans `lib/claude.ts`.
- Variété introduite tôt : conversion de `q1-c2-l08` (remise en ordre), `q3-c1-l02` (prédiction) et `q2-c1-l05` (glisser-déposer).

### Vérifié

- Typecheck front + serveur (0 erreur), bundle Metro iOS (1121 modules) réussi.

## [0.4.0] - 2026-07-09

### Ajouté

- **Persistance locale** : les stores `user`, `progress` et `streak` utilisent désormais le middleware `persist` de Zustand + `AsyncStorage` ; garde d'hydratation (`_hasHydrated`) à l'entrée de l'app.
- **Déblocage dynamique des quartiers** (`data/progression.ts`) : dérivé du test de placement et de la progression réelle (déblocage en chaîne), en remplacement du `isLocked` statique.
- **XP → niveau de joueur** calculé automatiquement + **écran de fin de quartier** (`app/(game)/district/[id]/complete.tsx`) avec récap étoiles et déblocage du suivant.
- **Client API + synchronisation** best-effort et offline-first (`lib/api.ts`, `lib/sync.ts`) : création de compte au 1er lancement, envoi de la progression, de l'XP et du streak.
- **Contenu Q1 complété** : 10 niveaux ajoutés (5 → 15) répartis en 3 chapitres.
- Répliques de LOG centralisées dans `lib/claude.ts` (prêt pour le proxy Claude en V1) ; `LOGModal` ne contient plus de texte codé en dur.

### Modifié

- **Backend durci** : middleware CORS, route `GET /api/health`, `PATCH /api/users/:id` (xp/level/placementLevel), `PUT /api/users/:id/streak`, contrainte d'unicité `(userId, levelId)` sur `UserProgress` + upsert de la progression (plus de doublons au rejeu). Seed aligné sur les vrais `levelId`.
- **Thème** : `userInterfaceStyle` en `dark` et splash aligné sur le fond du jeu (`#080816`) — plus de flash blanc au lancement.

## [0.3.0] - 2026-04-23

### Ajouté

- Registre central des niveaux (`data/levels/registry.ts`) et jeux de données pour plusieurs quartiers (`data/levels/q2-conditions.ts` … `q7-recursivite.ts`).
- Titres de chapitres (`data/levels/chapterTitles.ts`).
- Ajustements des écrans quartier et niveau, et mises à jour de la documentation (commits associés : `c7823ce`).

## [0.2.0] - 2026-04-02

### Ajouté

- Documentation d’architecture et README ; mise à jour de la configuration serveur (`54760d5`).
- Refactorisation de la structure de l’application et implémentation du routage (`2ea23e2`).
- Mise à jour des dépendances ; refonte majeure de la **carte** (`map.tsx`), du **test de placement**, de l’**accueil** et des écrans **quartier / niveau** ; composants **QCM**, **LOGBubble**, **LOGModal** ; constantes de couleurs (`04f37eb`).

## [0.1.0] - 2026-04-02

### Ajouté

- Commit initial du dépôt (`ca6730a`).
- Projet **Expo** avec fichiers de configuration, structure d’application de base, assets et TypeScript ; serveur **Express** avec **Prisma** pour la gestion des utilisateurs et le suivi de la progression (`698ee2f`).

[0.5.0]: https://github.com/zak201/CodeCity/compare/c7823ce...HEAD
[0.4.0]: https://github.com/zak201/CodeCity/compare/c7823ce...HEAD
[0.3.0]: https://github.com/zak201/CodeCity/compare/04f37eb...c7823ce
[0.2.0]: https://github.com/zak201/CodeCity/compare/698ee2f...04f37eb
[0.1.0]: https://github.com/zak201/CodeCity/compare/ca6730a...698ee2f
