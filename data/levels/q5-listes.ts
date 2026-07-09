import type { Level } from '../../types/game';

/**
 * Quartier Q5 — Listes / tableaux.
 * Arc : bibliothèque en chaos ; rangement par structure.
 */
export const q5ListesLevels: Level[] = [
  {
    id: 'q5-c1-l01',
    districtId: 'q5',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Étagères',
    story:
      'La bibliothécaire de CodeCity a abandonné. 10 000 livres par terre. À toi.',
    question: 'Un tableau (liste ordonnée) sert avant tout à :',
    answers: [
      { id: 'q5-c1-l01-a', label: 'Regrouper plusieurs valeurs dans un ordre indexé', isCorrect: true },
      { id: 'q5-c1-l01-b', label: 'Remplacer toutes les conditions', isCorrect: false },
      { id: 'q5-c1-l01-c', label: 'Stocker un seul caractère', isCorrect: false },
      { id: 'q5-c1-l01-d', label: 'Exécuter du code sur le processeur graphique uniquement', isCorrect: false },
    ],
    correctAnswer: 'q5-c1-l01-a',
    explanation:
      'Comme des étagères numérotées : case 0, case 1, case 2…',
    xpReward: 10,
  },
  {
    id: 'q5-c1-l02',
    districtId: 'q5',
    chapter: 1,
    order: 2,
    mechanic: 'drag-drop',
    title: 'Index',
    question: 'Complète pour lire le premier élément (« pain »).',
    fillTemplate: `tab = ["pain", "lait", "pommes"]
premier = tab[___]`,
    fillTokens: ['0', '1', '2', '-1'],
    fillSolution: ['0'],
    correctAnswer: ['0'],
    explanation:
      'L’index commence souvent à 0 : tab[0] vaut « pain », le tout premier élément.',
    xpReward: 10,
  },
  {
    id: 'q5-c1-l03',
    districtId: 'q5',
    chapter: 1,
    order: 3,
    mechanic: 'prediction',
    title: 'Longueur',
    code: `scores = [10, 20, 30]
afficher(longueur(scores))`,
    question: 'Qu’affiche ce code ?',
    answers: [
      { id: 'q5-c1-l03-a', label: '3', isCorrect: true },
      { id: 'q5-c1-l03-b', label: '60', isCorrect: false },
      { id: 'q5-c1-l03-c', label: '2', isCorrect: false },
      { id: 'q5-c1-l03-d', label: '10', isCorrect: false },
    ],
    correctAnswer: 'q5-c1-l03-a',
    explanation:
      'longueur compte les cases (3 éléments), pas la somme des valeurs.',
    xpReward: 10,
  },
  {
    id: 'q5-c1-l04',
    districtId: 'q5',
    chapter: 1,
    order: 4,
    mechanic: 'qcm',
    title: 'Accès invalide',
    question: 't a 5 éléments (indices 0 à 4). Que se passe-t-il souvent si tu lis t[10] ?',
    answers: [
      { id: 'q5-c1-l04-a', label: 'Erreur ou valeur indéfinie selon le langage', isCorrect: true },
      { id: 'q5-c1-l04-b', label: 'Le programme crée automatiquement des cases vides', isCorrect: false },
      { id: 'q5-c1-l04-c', label: 'On obtient toujours zéro sans avertissement', isCorrect: false },
      { id: 'q5-c1-l04-d', label: 'Le premier élément est renvoyé', isCorrect: false },
    ],
    correctAnswer: 'q5-c1-l04-a',
    explanation:
      'Hors limites = risque d’erreur : comme prendre un livre sur une étagère inexistante.',
    xpReward: 10,
  },
  {
    id: 'q5-c2-l01',
    districtId: 'q5',
    chapter: 2,
    order: 5,
    mechanic: 'qcm',
    title: 'Modifications',
    story: 'LOG : Les étagères bougent. Suit les règles du dépôt.',
    question: 'push en fin de tableau ajoute en général un élément :',
    answers: [
      { id: 'q5-c2-l01-a', label: 'À la fin de la liste', isCorrect: true },
      { id: 'q5-c2-l01-b', label: 'Au milieu uniquement', isCorrect: false },
      { id: 'q5-c2-l01-c', label: 'Au début systématiquement', isCorrect: false },
      { id: 'q5-c2-l01-d', label: 'Dans un fichier texte séparé', isCorrect: false },
    ],
    correctAnswer: 'q5-c2-l01-a',
    explanation:
      'push empile souvent à la droite / fin de la liste dynamique.',
    xpReward: 10,
  },
  {
    id: 'q5-c2-l02',
    districtId: 'q5',
    chapter: 2,
    order: 6,
    mechanic: 'qcm',
    title: 'pop',
    question: 'pop enlève souvent le dernier élément et :',
    answers: [
      { id: 'q5-c2-l02-a', label: 'Réduit la taille du tableau d’une unité', isCorrect: true },
      { id: 'q5-c2-l02-b', label: 'Duplique le tableau', isCorrect: false },
      { id: 'q5-c2-l02-c', label: 'Trie automatiquement', isCorrect: false },
      { id: 'q5-c2-l02-d', label: 'Ajoute deux zéros', isCorrect: false },
    ],
    correctAnswer: 'q5-c2-l02-a',
    explanation:
      'pop = dépile la fin : la collection rétrécit.',
    xpReward: 10,
  },
  {
    id: 'q5-c2-l03',
    districtId: 'q5',
    chapter: 2,
    order: 7,
    mechanic: 'qcm',
    title: 'Recherche',
    question: 'indexOf("orange") dans une liste renvoie en général :',
    answers: [
      { id: 'q5-c2-l03-a', label: 'La position de la première occurrence ou -1 si absent', isCorrect: true },
      { id: 'q5-c2-l03-b', label: 'Toujours 0', isCorrect: false },
      { id: 'q5-c2-l03-c', label: 'Le double de la longueur', isCorrect: false },
      { id: 'q5-c2-l03-d', label: 'Une copie du tableau trié', isCorrect: false },
    ],
    correctAnswer: 'q5-c2-l03-a',
    explanation:
      'indexOf cherche une aiguille dans la liste et donne l’index ou « pas trouvé ».',
    xpReward: 10,
  },
  {
    id: 'q5-c2-l04',
    districtId: 'q5',
    chapter: 2,
    order: 8,
    mechanic: 'qcm',
    title: 'Tranche',
    question: 'slice(1, 3) sur [10,20,30,40] donne souvent :',
    answers: [
      { id: 'q5-c2-l04-a', label: '[20, 30]', isCorrect: true },
      { id: 'q5-c2-l04-b', label: '[10, 20, 30]', isCorrect: false },
      { id: 'q5-c2-l04-c', label: '[30, 40]', isCorrect: false },
      { id: 'q5-c2-l04-d', label: '[]', isCorrect: false },
    ],
    correctAnswer: 'q5-c2-l04-a',
    explanation:
      'slice début inclus, fin exclus : indices 1 et 2 → 20 et 30.',
    xpReward: 10,
  },
  {
    id: 'q5-c3-l01',
    districtId: 'q5',
    chapter: 3,
    order: 9,
    mechanic: 'construction',
    title: 'Parcours',
    story: 'LOG : Inventaire complet : il faut tout scanner sans perdre une case.',
    question: 'Remets les lignes dans l’ordre pour additionner tous les scores.',
    orderedLines: [
      'total = 0',
      'pour chaque x dans scores:',
      '  total = total + x',
      'afficher(total)',
    ],
    correctAnswer: [
      'total = 0',
      'pour chaque x dans scores:',
      '  total = total + x',
      'afficher(total)',
    ],
    explanation:
      'On part de 0, on ajoute chaque élément pendant le parcours, puis on affiche la somme.',
    xpReward: 10,
  },
  {
    id: 'q5-c3-l02',
    districtId: 'q5',
    chapter: 3,
    order: 10,
    mechanic: 'qcm',
    title: 'find (idée)',
    question: 'find cherche un élément qui satisfait un critère. Si aucun ne convient :',
    answers: [
      { id: 'q5-c3-l02-a', label: 'On obtient souvent une valeur « rien / undefined / null »', isCorrect: true },
      { id: 'q5-c3-l02-b', label: 'On obtient toujours le dernier élément', isCorrect: false },
      { id: 'q5-c3-l02-c', label: 'Le tableau double de taille', isCorrect: false },
      { id: 'q5-c3-l02-d', label: 'Le programme formate le disque', isCorrect: false },
    ],
    correctAnswer: 'q5-c3-l02-a',
    explanation:
      'Pas de match = pas de résultat utile ; il faut tester après coup.',
    xpReward: 10,
  },
  {
    id: 'q5-c3-l03',
    districtId: 'q5',
    chapter: 3,
    order: 11,
    mechanic: 'qcm',
    title: 'filter (idée)',
    question: 'filter garde :',
    answers: [
      { id: 'q5-c3-l03-a', label: 'Un nouveau tableau avec seulement les éléments qui passent le test', isCorrect: true },
      { id: 'q5-c3-l03-b', label: 'Le premier élément seulement', isCorrect: false },
      { id: 'q5-c3-l03-c', label: 'Un nombre entier aléatoire', isCorrect: false },
      { id: 'q5-c3-l03-d', label: 'Le tableau original toujours inchangé sans copie', isCorrect: false },
    ],
    correctAnswer: 'q5-c3-l03-a',
    explanation:
      'filter ne garde que ce qui t’intéresse, comme retirer les livres abîmés du lot.',
    xpReward: 10,
  },
  {
    id: 'q5-c3-l04',
    districtId: 'q5',
    chapter: 3,
    order: 12,
    mechanic: 'qcm',
    title: 'Défi bibliothèque',
    question: 's = [1,2,3]; on ajoute 4 en fin puis on retire le dernier. État final ?',
    answers: [
      { id: 'q5-c3-l04-a', label: '[1,2,3]', isCorrect: true },
      { id: 'q5-c3-l04-b', label: '[1,2,3,4]', isCorrect: false },
      { id: 'q5-c3-l04-c', label: '[4,1,2,3]', isCorrect: false },
      { id: 'q5-c3-l04-d', label: '[]', isCorrect: false },
    ],
    correctAnswer: 'q5-c3-l04-a',
    explanation:
      'push 4 → [1,2,3,4] ; pop → [1,2,3].',
    xpReward: 15,
  },
];

export function getQ5Level(levelId: string): Level | undefined {
  return q5ListesLevels.find((l) => l.id === levelId);
}

export function getQ5LevelIdsInOrder(): string[] {
  return [...q5ListesLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}
