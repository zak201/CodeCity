import type { Level } from '../../types/game';

/**
 * Quartier Q6 — Algorithmes de tri (vulgarisation).
 * Arc : podium des citoyens ; ordre corrompu.
 */
export const q6TriLevels: Level[] = [
  {
    id: 'q6-c1-l01',
    districtId: 'q6',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Ordre logique',
    story:
      'Le podium des meilleurs citoyens affiche des noms au hasard. La ville est en colère.',
    question: 'Trier une liste signifie en général :',
    answers: [
      { id: 'q6-c1-l01-a', label: 'Placer les éléments dans un ordre défini (croissant, décroissant…)', isCorrect: true },
      { id: 'q6-c1-l01-b', label: 'Supprimer la moitié des éléments', isCorrect: false },
      { id: 'q6-c1-l01-c', label: 'Mélanger deux fois pour annuler', isCorrect: false },
      { id: 'q6-c1-l01-d', label: 'Convertir tout en texte', isCorrect: false },
    ],
    correctAnswer: 'q6-c1-l01-a',
    explanation:
      'Comme un classement : on veut un ordre lisible et stable pour trouver vite.',
    xpReward: 10,
  },
  {
    id: 'q6-c1-l02',
    districtId: 'q6',
    chapter: 1,
    order: 2,
    mechanic: 'qcm',
    title: 'Comparaison',
    question: 'Pour trier par ordre croissant, la machine doit pouvoir :',
    answers: [
      { id: 'q6-c1-l02-a', label: 'Comparer deux éléments et savoir lequel doit venir avant', isCorrect: true },
      { id: 'q6-c1-l02-b', label: 'Ignorer totalement les paires', isCorrect: false },
      { id: 'q6-c1-l02-c', label: 'Toujours laisser le tableau vide', isCorrect: false },
      { id: 'q6-c1-l02-d', label: 'Divider par zéro', isCorrect: false },
    ],
    correctAnswer: 'q6-c1-l02-a',
    explanation:
      'Sans comparaison, impossible de savoir qui est « plus petit » ou « plus grand ».',
    xpReward: 10,
  },
  {
    id: 'q6-c1-l03',
    districtId: 'q6',
    chapter: 1,
    order: 3,
    mechanic: 'qcm',
    title: 'Bubble (idée)',
    question: 'Le tri à bulles fait souvent :',
    answers: [
      { id: 'q6-c1-l03-a', label: 'Repasser plusieurs fois pour échanger les voisins mal ordonnés jusqu’à ce qu’il n’y ait plus de swap', isCorrect: true },
      { id: 'q6-c1-l03-b', label: 'Un seul passage suffit toujours', isCorrect: false },
      { id: 'q6-c1-l03-c', label: 'Trie sans jamais comparer', isCorrect: false },
      { id: 'q6-c1-l03-d', label: 'Divise le tableau en deux listes triées par magie', isCorrect: false },
    ],
    correctAnswer: 'q6-c1-l03-a',
    explanation:
      'Les bulles « remontent » : on répète tant que des paires voisines sont encore dans le mauvais sens.',
    xpReward: 10,
  },
  {
    id: 'q6-c1-l04',
    districtId: 'q6',
    chapter: 1,
    order: 4,
    mechanic: 'qcm',
    title: 'Stable ?',
    question: 'Un tri « stable » préserve en général :',
    answers: [
      { id: 'q6-c1-l04-a', label: 'L’ordre relatif d’éléments égaux', isCorrect: true },
      { id: 'q6-c1-l04-b', label: 'La taille du disque dur', isCorrect: false },
      { id: 'q6-c1-l04-c', label: 'Le nombre de fichiers sur le bureau', isCorrect: false },
      { id: 'q6-c1-l04-d', label: 'L’ordre aléatoire imposé', isCorrect: false },
    ],
    correctAnswer: 'q6-c1-l04-a',
    explanation:
      'Utile quand deux personnes ont le même score : celui arrivé avant reste avant.',
    xpReward: 10,
  },
  {
    id: 'q6-c2-l01',
    districtId: 'q6',
    chapter: 2,
    order: 5,
    mechanic: 'qcm',
    title: 'Sélection',
    story: 'LOG : Passons des idées aux algorithmes classiques.',
    question: 'Le tri par sélection cherche souvent à chaque étape :',
    answers: [
      { id: 'q6-c2-l01-a', label: 'Le minimum (ou maximum) du reste et le placer à la bonne position', isCorrect: true },
      { id: 'q6-c2-l01-b', label: 'Deux médianes exactes', isCorrect: false },
      { id: 'q6-c2-l01-c', label: 'Rien, c’est aléatoire', isCorrect: false },
      { id: 'q6-c2-l01-d', label: 'Le produit de tous les éléments', isCorrect: false },
    ],
    correctAnswer: 'q6-c2-l01-a',
    explanation:
      'On repère le plus petit restant et on le range ; puis on recommence.',
    xpReward: 10,
  },
  {
    id: 'q6-c2-l02',
    districtId: 'q6',
    chapter: 2,
    order: 6,
    mechanic: 'qcm',
    title: 'Insertion',
    question: 'Le tri par insertion construit la partie triée en :',
    answers: [
      { id: 'q6-c2-l02-a', label: 'Insérant chaque nouvel élément à sa place dans la zone déjà triée', isCorrect: true },
      { id: 'q6-c2-l02-b', label: 'Vidant tout puis recréant aléatoirement', isCorrect: false },
      { id: 'q6-c2-l02-c', label: 'Ne regardant que le dernier élément', isCorrect: false },
      { id: 'q6-c2-l02-d', label: 'Divisant par la longueur sans comparer', isCorrect: false },
    ],
    correctAnswer: 'q6-c2-l02-a',
    explanation:
      'Comme ranger des cartes à la main : la gauche est triée, on insère la suivante.',
    xpReward: 10,
  },
  {
    id: 'q6-c2-l03',
    districtId: 'q6',
    chapter: 2,
    order: 7,
    mechanic: 'qcm',
    title: 'Nombre de comparaisons (ordre de grandeur)',
    question: 'Pour n éléments, des tris naïfs comparatifs ont souvent un coût en O(n²) dans le pire cas, ce qui signifie en pratique :',
    answers: [
      { id: 'q6-c2-l03-a', label: 'Le temps peut exploser quand n devient grand (proportionnel à n×n)', isCorrect: true },
      { id: 'q6-c2-l03-b', label: 'Toujours une seule comparaison suffit', isCorrect: false },
      { id: 'q6-c2-l03-c', label: 'Le coût est constant quel que soit n', isCorrect: false },
      { id: 'q6-c2-l03-d', label: 'n doit être inférieur à 3', isCorrect: false },
    ],
    correctAnswer: 'q6-c2-l03-a',
    explanation:
      'Quand n double, n² peut quadrupler : les longues listes méritent de meilleurs algorithmes.',
    xpReward: 10,
  },
  {
    id: 'q6-c2-l04',
    districtId: 'q6',
    chapter: 2,
    order: 8,
    mechanic: 'qcm',
    title: 'Invariant',
    question: 'Un invariant de tri est :',
    answers: [
      { id: 'q6-c2-l04-a', label: 'Une propriété qui reste vraie à chaque étape (ex. « tout à gauche est déjà trié »)', isCorrect: true },
      { id: 'q6-c2-l04-b', label: 'Une erreur de compilation', isCorrect: false },
      { id: 'q6-c2-l04-c', label: 'Un nombre toujours négatif', isCorrect: false },
      { id: 'q6-c2-l04-d', label: 'Un fichier système caché', isCorrect: false },
    ],
    correctAnswer: 'q6-c2-l04-a',
    explanation:
      'Raisonner par invariant aide à prouver qu’à la fin tout est trié.',
    xpReward: 10,
  },
  {
    id: 'q6-c2-l05',
    districtId: 'q6',
    chapter: 2,
    order: 9,
    mechanic: 'qcm',
    title: 'Meilleur pire cas',
    question: 'Pour de très grandes données, on préfère souvent éviter un algorithme uniquement en O(n²) et chercher par exemple :',
    answers: [
      { id: 'q6-c2-l05-a', label: 'Des approches plus efficaces comme O(n log n) dans le meilleur des cas (ex. merge sort)', isCorrect: true },
      { id: 'q6-c2-l05-b', label: 'O(n!) systématiquement', isCorrect: false },
      { id: 'q6-c2-l05-c', label: 'Ne jamais trier', isCorrect: false },
      { id: 'q6-c2-l05-d', label: 'Dupliquer chaque élément 1000 fois', isCorrect: false },
    ],
    correctAnswer: 'q6-c2-l05-a',
    explanation:
      'n log n grandit beaucoup plus lentement que n² pour n énorme.',
    xpReward: 10,
  },
  {
    id: 'q6-c2-l06',
    districtId: 'q6',
    chapter: 2,
    order: 10,
    mechanic: 'qcm',
    title: 'Podium réparé',
    question: '[4, 1, 3, 2] en ordre croissant strict donne :',
    answers: [
      { id: 'q6-c2-l06-a', label: '[1, 2, 3, 4]', isCorrect: true },
      { id: 'q6-c2-l06-b', label: '[4, 3, 2, 1]', isCorrect: false },
      { id: 'q6-c2-l06-c', label: '[1, 3, 2, 4]', isCorrect: false },
      { id: 'q6-c2-l06-d', label: '[2, 1, 4, 3]', isCorrect: false },
    ],
    correctAnswer: 'q6-c2-l06-a',
    explanation:
      'Ordre croissant : du plus petit au plus grand.',
    xpReward: 15,
  },
];

export function getQ6Level(levelId: string): Level | undefined {
  return q6TriLevels.find((l) => l.id === levelId);
}

export function getQ6LevelIdsInOrder(): string[] {
  return [...q6TriLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}
