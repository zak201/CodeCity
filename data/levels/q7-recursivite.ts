import type { Level } from '../../types/game';

/**
 * Quartier Q7 — Récursivité.
 * Arc : quartier des miroirs ; la règle s'applique à elle-même.
 */
export const q7RecursiviteLevels: Level[] = [
  {
    id: 'q7-c1-l01',
    districtId: 'q7',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Idée récursive',
    story:
      'LOG : Ce quartier est différent. Ici, les règles s’appliquent à elles-mêmes.',
    question: 'Une fonction récursive, c’est une fonction qui :',
    answers: [
      { id: 'q7-c1-l01-a', label: 'S’appelle elle-même (directement ou indirectement)', isCorrect: true },
      { id: 'q7-c1-l01-b', label: 'Ne peut jamais retourner de valeur', isCorrect: false },
      { id: 'q7-c1-l01-c', label: 'Ignore les paramètres', isCorrect: false },
      { id: 'q7-c1-l01-d', label: 'S’exécute une fois sans condition', isCorrect: false },
    ],
    correctAnswer: 'q7-c1-l01-a',
    explanation:
      'La récursion découpe un problème en sous-problèmes du même type, jusqu’à un cas simple.',
    xpReward: 10,
  },
  {
    id: 'q7-c1-l02',
    districtId: 'q7',
    chapter: 1,
    order: 2,
    mechanic: 'qcm',
    title: 'Cas de base',
    question: 'Le cas de base en récursivité sert à :',
    answers: [
      { id: 'q7-c1-l02-a', label: 'Arrêter la récursion et renvoyer un résultat direct', isCorrect: true },
      { id: 'q7-c1-l02-b', label: 'Multiplier la profondeur sans limite', isCorrect: false },
      { id: 'q7-c1-l02-c', label: 'Trier un tableau en O(1)', isCorrect: false },
      { id: 'q7-c1-l02-d', label: 'Créer deux copies du programme', isCorrect: false },
    ],
    correctAnswer: 'q7-c1-l02-a',
    explanation:
      'Sans cas de base, les appels s’empilent à l’infini : stack overflow, comme un miroir face à un miroir sans fin.',
    xpReward: 10,
  },
  {
    id: 'q7-c1-l03',
    districtId: 'q7',
    chapter: 1,
    order: 3,
    mechanic: 'qcm',
    title: 'Pile d’appels',
    question: 'Chaque appel récursif en cours est en général mémorisé comme :',
    answers: [
      { id: 'q7-c1-l03-a', label: 'Une entrée sur la pile d’appels (call stack)', isCorrect: true },
      { id: 'q7-c1-l03-b', label: 'Un fichier sur le disque uniquement', isCorrect: false },
      { id: 'q7-c1-l03-c', label: 'Une couleur d’arrière-plan', isCorrect: false },
      { id: 'q7-c1-l03-d', label: 'Une erreur de compilation systématique', isCorrect: false },
    ],
    correctAnswer: 'q7-c1-l03-a',
    explanation:
      'Les appels imbriqués s’empilent ; quand le cas de base répond, on « dépile » pour agréger le résultat.',
    xpReward: 10,
  },
  {
    id: 'q7-c1-l04',
    districtId: 'q7',
    chapter: 1,
    order: 4,
    mechanic: 'qcm',
    title: 'Vers le cas de base',
    question: 'Si chaque appel rapproche n du cas de base (ex. n diminue jusqu’à 0), la récursivité :',
    answers: [
      { id: 'q7-c1-l04-a', label: 'Peut terminer correctement si le cas de base est atteint', isCorrect: true },
      { id: 'q7-c1-l04-b', label: 'Ne peut jamais terminer', isCorrect: false },
      { id: 'q7-c1-l04-c', label: 'Ignore n', isCorrect: false },
      { id: 'q7-c1-l04-d', label: 'Double n à chaque appel automatiquement', isCorrect: false },
    ],
    correctAnswer: 'q7-c1-l04-a',
    explanation:
      'Il faut que la progression mène forcément vers le cas de base.',
    xpReward: 10,
  },
  {
    id: 'q7-c1-l05',
    districtId: 'q7',
    chapter: 1,
    order: 5,
    mechanic: 'qcm',
    title: 'Somme 1..n',
    question:
      'fonction S(n): si n==0 retour 0 sinon retour n + S(n-1). S(3) ?',
    answers: [
      { id: 'q7-c1-l05-a', label: '6', isCorrect: true },
      { id: 'q7-c1-l05-b', label: '3', isCorrect: false },
      { id: 'q7-c1-l05-c', label: '9', isCorrect: false },
      { id: 'q7-c1-l05-d', label: '0', isCorrect: false },
    ],
    correctAnswer: 'q7-c1-l05-a',
    explanation:
      '3 + S(2) = 3 + 2 + S(1) = … = 3+2+1+0 = 6.',
    xpReward: 10,
  },
  {
    id: 'q7-c2-l01',
    districtId: 'q7',
    chapter: 2,
    order: 6,
    mechanic: 'qcm',
    title: 'Factorielle',
    story:
      'LOG : Tu comprends le principe. Maintenant les cas classiques que tout développeur connaît.',
    question: 'n! = n × (n-1)! avec 0! = 1. Que vaut 4! ?',
    answers: [
      { id: 'q7-c2-l01-a', label: '24', isCorrect: true },
      { id: 'q7-c2-l01-b', label: '16', isCorrect: false },
      { id: 'q7-c2-l01-c', label: '10', isCorrect: false },
      { id: 'q7-c2-l01-d', label: '4', isCorrect: false },
    ],
    correctAnswer: 'q7-c2-l01-a',
    explanation:
      '4×3×2×1 = 24.',
    xpReward: 10,
  },
  {
    id: 'q7-c2-l02',
    districtId: 'q7',
    chapter: 2,
    order: 7,
    mechanic: 'qcm',
    title: 'Fibonacci (déf)',
    question: 'F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2) pour n≥2. F(5) ?',
    answers: [
      { id: 'q7-c2-l02-a', label: '5', isCorrect: true },
      { id: 'q7-c2-l02-b', label: '8', isCorrect: false },
      { id: 'q7-c2-l02-c', label: '3', isCorrect: false },
      { id: 'q7-c2-l02-d', label: '13', isCorrect: false },
    ],
    correctAnswer: 'q7-c2-l02-a',
    explanation:
      'Suite : 0,1,1,2,3,5 → F(5)=5.',
    xpReward: 10,
  },
  {
    id: 'q7-c2-l03',
    districtId: 'q7',
    chapter: 2,
    order: 8,
    mechanic: 'qcm',
    title: 'Arbre récursif',
    question: 'Un dossier contient des sous-dossiers ; les parcourir « en profondeur » ressemble à :',
    answers: [
      { id: 'q7-c2-l03-a', label: 'Traiter le dossier puis appeler la même logique sur chaque enfant', isCorrect: true },
      { id: 'q7-c2-l03-b', label: 'Ignorer les sous-dossiers', isCorrect: false },
      { id: 'q7-c2-l03-c', label: 'Copier le disque entier une fois', isCorrect: false },
      { id: 'q7-c2-l03-d', label: 'Trier alphabétiquement sans visiter', isCorrect: false },
    ],
    correctAnswer: 'q7-c2-l03-a',
    explanation:
      'Structure d’arbre + récursion = pattern classique (comme des miroirs qui renvoient à d’autres miroirs).',
    xpReward: 10,
  },
  {
    id: 'q7-c2-l04',
    districtId: 'q7',
    chapter: 2,
    order: 9,
    mechanic: 'qcm',
    title: 'Récursion vs itération',
    question: 'Beaucoup d’algorithmes récursifs peuvent aussi s’écrire avec :',
    answers: [
      { id: 'q7-c2-l04-a', label: 'Une boucle et une pile explicite ou des variables d’état', isCorrect: true },
      { id: 'q7-c2-l04-b', label: 'Uniquement un second ordinateur', isCorrect: false },
      { id: 'q7-c2-l04-c', label: 'Aucun autre moyen', isCorrect: false },
      { id: 'q7-c2-l04-d', label: 'Un fichier binaire illisible', isCorrect: false },
    ],
    correctAnswer: 'q7-c2-l04-a',
    explanation:
      'Récursion et itération sont souvent interchangeables ; le choix dépend clarté et limites de pile.',
    xpReward: 10,
  },
  {
    id: 'q7-c2-l05',
    districtId: 'q7',
    chapter: 2,
    order: 10,
    mechanic: 'qcm',
    title: 'Miroir final',
    question:
      'Pour une fonction récursive, sans cas de base bien défini, le risque principal est :',
    answers: [
      { id: 'q7-c2-l05-a', label: 'Stack overflow / boucle infinie d’appels', isCorrect: true },
      { id: 'q7-c2-l05-b', label: 'Compilation toujours réussie et résultat toujours 0', isCorrect: false },
      { id: 'q7-c2-l05-c', label: 'Gain de mémoire illimité', isCorrect: false },
      { id: 'q7-c2-l05-d', label: 'Tri automatique du disque', isCorrect: false },
    ],
    correctAnswer: 'q7-c2-l05-a',
    explanation:
      'Les appels s’empilent jusqu’à la limite : d’où l’importance du cas d’arrêt.',
    xpReward: 15,
  },
];

export function getQ7Level(levelId: string): Level | undefined {
  return q7RecursiviteLevels.find((l) => l.id === levelId);
}

export function getQ7LevelIdsInOrder(): string[] {
  return [...q7RecursiviteLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}
