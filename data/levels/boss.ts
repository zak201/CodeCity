import type { Level } from '../../types/game';

/**
 * Quartier BOSS — Tour Centrale.
 * La grande finale : chaque concept appris (variables, conditions, boucles,
 * fonctions, listes, tri, récursivité) se rejoue ici, sous les néons.
 * LOG t’accompagne : enjeux élevés, mais tu es prêt·e.
 */
export const bossLevels: Level[] = [
  {
    id: 'boss-l01',
    districtId: 'boss',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Le cœur de la Tour',
    story:
      'LOG : Nous y sommes. La Tour Centrale bourdonne, le bug se répand dans les circuits. Tout ce que tu as appris va compter. Respire.',
    question:
      'Un programme lit une liste de scores, garde ceux au-dessus de 50, puis calcule leur moyenne. Quels concepts combine-t-il ?',
    answers: [
      { id: 'boss-l01-a', label: 'Liste + condition (filtrer) + boucle + variable (accumuler)', isCorrect: true },
      { id: 'boss-l01-b', label: 'Uniquement une variable, rien d’autre', isCorrect: false },
      { id: 'boss-l01-c', label: 'Seulement une fonction récursive infinie', isCorrect: false },
      { id: 'boss-l01-d', label: 'Aucun concept : c’est du hasard', isCorrect: false },
    ],
    correctAnswer: 'boss-l01-a',
    explanation:
      'On parcourt la liste (boucle), on teste chaque score (condition), on cumule les valeurs retenues (variable) : les briques s’assemblent.',
    xpReward: 25,
    hint: 'Pense à chaque étape : parcourir, tester, garder, additionner.',
  },
  {
    id: 'boss-l02',
    districtId: 'boss',
    chapter: 1,
    order: 2,
    mechanic: 'prediction',
    title: 'Prédis la sortie',
    story:
      'LOG : Un module défend l’étage. Devine ce qu’il affiche avant de l’activer.',
    code: `let total = 0
pour i de 1 à 3:
  total = total + i
afficher(total)`,
    question: 'Qu’affiche ce code ?',
    answers: [
      { id: 'boss-l02-a', label: '6', isCorrect: true },
      { id: 'boss-l02-b', label: '3', isCorrect: false },
      { id: 'boss-l02-c', label: '9', isCorrect: false },
      { id: 'boss-l02-d', label: '0', isCorrect: false },
    ],
    correctAnswer: 'boss-l02-a',
    explanation:
      'La boucle additionne 1, puis 2, puis 3 : total = 0+1+2+3 = 6.',
    xpReward: 25,
    hint: 'Suis la variable total à chaque tour : 0 → 1 → 3 → 6.',
  },
  {
    id: 'boss-l03',
    districtId: 'boss',
    chapter: 1,
    order: 3,
    mechanic: 'construction',
    title: 'Reconstruis la fonction',
    question:
      'Remets les lignes dans l’ordre pour une fonction qui double un nombre.',
    orderedLines: [
      'fonction double(x) {',
      '  let r = x * 2',
      '  return r',
      '}',
    ],
    correctAnswer: [
      'fonction double(x) {',
      '  let r = x * 2',
      '  return r',
      '}',
    ],
    explanation:
      'On ouvre la fonction, on calcule le résultat dans une variable, on le retourne, puis on referme l’accolade.',
    xpReward: 25,
    hint: 'Une fonction s’ouvre, agit, retourne, puis se referme.',
  },
  {
    id: 'boss-l04',
    districtId: 'boss',
    chapter: 1,
    order: 4,
    mechanic: 'drag-drop',
    title: 'Verrouille la condition',
    question:
      'Complète la condition de victoire : gagner s’il reste des vies ET assez de points.',
    fillTemplate: 'si (score ___ 100 et vies ___ 0) { gagne() }',
    fillTokens: ['>=', '>', '<', '==', '+'],
    fillSolution: ['>=', '>'],
    correctAnswer: ['>=', '>'],
    explanation:
      'On veut score au moins égal à 100 (>=) et un nombre de vies strictement supérieur à 0 (>).',
    xpReward: 25,
  },
  {
    id: 'boss-l05',
    districtId: 'boss',
    chapter: 1,
    order: 5,
    mechanic: 'qcm',
    title: 'La dernière ligne',
    story:
      'LOG : Le bug reflue… les néons se stabilisent. Une dernière décision, et la Ville est sauvée.',
    question:
      'Après avoir tout appris, quelle est la meilleure attitude d’un·e développeur·se face à un nouveau problème ?',
    answers: [
      { id: 'boss-l05-a', label: 'Le découper en petites étapes simples et les assembler', isCorrect: true },
      { id: 'boss-l05-b', label: 'Tout écrire d’un bloc sans jamais tester', isCorrect: false },
      { id: 'boss-l05-c', label: 'Abandonner dès la première erreur', isCorrect: false },
      { id: 'boss-l05-d', label: 'Copier au hasard jusqu’à ce que ça marche', isCorrect: false },
    ],
    correctAnswer: 'boss-l05-a',
    explanation:
      'Décomposer, tester, recommencer : c’est ainsi qu’on résout n’importe quel problème. La Tour est à toi. Bravo !',
    xpReward: 25,
  },
];

export function getBossLevel(levelId: string): Level | undefined {
  return bossLevels.find((l) => l.id === levelId);
}

export function getBossLevelIdsInOrder(): string[] {
  return [...bossLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}
