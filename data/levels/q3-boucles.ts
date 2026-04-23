import type { Level } from '../../types/game';

/**
 * Quartier Q3 — Boucles.
 * Arc : l'usine répète en boucle ; les robots ne s'arrêtent plus.
 */
export const q3BouclesLevels: Level[] = [
  {
    id: 'q3-c1-l01',
    districtId: 'q3',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Idée de boucle',
    story:
      "Le robot de l'usine repeint le même mur depuis 6 heures. Il ne sait pas s'arrêter.",
    question: 'En programmation, une boucle sert surtout à :',
    answers: [
      { id: 'q3-c1-l01-a', label: 'Exécuter plusieurs fois un bloc d’instructions', isCorrect: true },
      { id: 'q3-c1-l01-b', label: 'Déclarer une variable une seule fois', isCorrect: false },
      { id: 'q3-c1-l01-c', label: 'Comparer deux fichiers sur le disque', isCorrect: false },
      { id: 'q3-c1-l01-d', label: 'Afficher un message sans jamais le modifier', isCorrect: false },
    ],
    correctAnswer: 'q3-c1-l01-a',
    explanation:
      'Une boucle revient au même point du programme pour refaire un travail, comme un robot qui recommence la tâche tant qu’on ne lui dit pas d’arrêter.',
    xpReward: 10,
  },
  {
    id: 'q3-c1-l02',
    districtId: 'q3',
    chapter: 1,
    order: 2,
    mechanic: 'qcm',
    title: 'Compter les tours',
    question:
      'for i de 1 à 3 (inclus) — combien de fois le corps de la boucle s’exécute-t-il en général ?',
    answers: [
      { id: 'q3-c1-l02-a', label: '3 fois', isCorrect: true },
      { id: 'q3-c1-l02-b', label: '2 fois', isCorrect: false },
      { id: 'q3-c1-l02-c', label: '4 fois', isCorrect: false },
      { id: 'q3-c1-l02-d', label: 'Une infinite de fois', isCorrect: false },
    ],
    correctAnswer: 'q3-c1-l02-a',
    explanation:
      'De 1 à 3 inclus, la boucle parcourt trois valeurs : trois itérations.',
    xpReward: 10,
  },
  {
    id: 'q3-c1-l03',
    districtId: 'q3',
    chapter: 1,
    order: 3,
    mechanic: 'qcm',
    title: 'for en mots',
    question: 'Dans « for i de 0 à n-1 », que représente souvent i ?',
    answers: [
      { id: 'q3-c1-l03-a', label: 'Un compteur d’itération (indice)', isCorrect: true },
      { id: 'q3-c1-l03-b', label: 'Le nombre total d’éléments du disque dur', isCorrect: false },
      { id: 'q3-c1-l03-c', label: 'Une adresse mémoire en hexadécimal', isCorrect: false },
      { id: 'q3-c1-l03-d', label: 'Le type de la variable n', isCorrect: false },
    ],
    correctAnswer: 'q3-c1-l03-a',
    explanation:
      'i est typiquement le compteur qui avance à chaque tour pour savoir « où on en est ».',
    xpReward: 10,
  },
  {
    id: 'q3-c1-l04',
    districtId: 'q3',
    chapter: 1,
    order: 4,
    mechanic: 'qcm',
    title: 'Pas de boucle',
    question: 'Que risquent ces deux situations ? (1) Boucle sans fin utile (2) Oubli de mettre à jour le compteur dans un while',
    answers: [
      { id: 'q3-c1-l04-a', label: 'Boucle infinie ou programme qui « gèle » la tâche', isCorrect: true },
      { id: 'q3-c1-l04-b', label: 'Compilation instantanée plus rapide', isCorrect: false },
      { id: 'q3-c1-l04-c', label: 'Les variables disparaissent toutes', isCorrect: false },
      { id: 'q3-c1-l04-d', label: 'Le programme trie automatiquement les données', isCorrect: false },
    ],
    correctAnswer: 'q3-c1-l04-a',
    explanation:
      'Sans progression vers une sortie, une boucle peut tourner indéfiniment comme un robot qui ne reçoit jamais l’ordre d’arrêt.',
    xpReward: 10,
  },
  {
    id: 'q3-c1-l05',
    districtId: 'q3',
    chapter: 1,
    order: 5,
    mechanic: 'qcm',
    title: 'Synthèse chapitre 1',
    question:
      'Tu veux afficher « tour » exactement 5 fois. Quelle idée colle le mieux à un for ?',
    answers: [
      { id: 'q3-c1-l05-a', label: 'Fixer le nombre de tours à l’avance (ex. 5 itérations)', isCorrect: true },
      { id: 'q3-c1-l05-b', label: 'Écrire le mot cinq fois à la main sans structure', isCorrect: false },
      { id: 'q3-c1-l05-c', label: 'Utiliser uniquement un if sans répétition', isCorrect: false },
      { id: 'q3-c1-l05-d', label: 'Attendre que l’utilisateur devine', isCorrect: false },
    ],
    correctAnswer: 'q3-c1-l05-a',
    explanation:
      'Le for excelle quand le nombre d’itérations est connu ou calculable dès le départ.',
    xpReward: 10,
  },
  {
    id: 'q3-c2-l01',
    districtId: 'q3',
    chapter: 2,
    order: 6,
    mechanic: 'qcm',
    title: 'While',
    story: 'LOG : Le robot sait répéter. Mais peut-il décider quand s’arrêter ?',
    question: 'Un while exécute son bloc tant que :',
    answers: [
      { id: 'q3-c2-l01-a', label: 'La condition reste vraie', isCorrect: true },
      { id: 'q3-c2-l01-b', label: 'La condition est fausse dès le départ, toujours', isCorrect: false },
      { id: 'q3-c2-l01-c', label: 'Le programme a fini toutes les fonctions', isCorrect: false },
      { id: 'q3-c2-l01-d', label: 'Une seule fois, même si la condition reste vraie', isCorrect: false },
    ],
    correctAnswer: 'q3-c2-l01-a',
    explanation:
      'while = « tant que » : le bloc tourne jusqu’à ce que la condition devienne fausse.',
    xpReward: 10,
  },
  {
    id: 'q3-c2-l02',
    districtId: 'q3',
    chapter: 2,
    order: 7,
    mechanic: 'qcm',
    title: 'Condition d’arrêt',
    question: 'n = 0. while (n < 3) { affiche n ; n = n + 1 } — combien d’affichages de n ?',
    answers: [
      { id: 'q3-c2-l02-a', label: '3 affichages (0, 1, 2)', isCorrect: true },
      { id: 'q3-c2-l02-b', label: '4 affichages', isCorrect: false },
      { id: 'q3-c2-l02-c', label: 'Aucun', isCorrect: false },
      { id: 'q3-c2-l02-d', label: 'Infini', isCorrect: false },
    ],
    correctAnswer: 'q3-c2-l02-a',
    explanation:
      'n part à 0 ; tant que n < 3, on affiche puis on incrémente. À n = 3, on sort : trois tours.',
    xpReward: 10,
  },
  {
    id: 'q3-c2-l03',
    districtId: 'q3',
    chapter: 2,
    order: 8,
    mechanic: 'qcm',
    title: 'break',
    question: 'À quoi sert souvent break dans une boucle ?',
    answers: [
      { id: 'q3-c2-l03-a', label: 'Sortir immédiatement de la boucle courante', isCorrect: true },
      { id: 'q3-c2-l03-b', label: 'Dupliquer la boucle deux fois', isCorrect: false },
      { id: 'q3-c2-l03-c', label: 'Passer à la ligne suivante du clavier', isCorrect: false },
      { id: 'q3-c2-l03-d', label: 'Créer une nouvelle variable globale', isCorrect: false },
    ],
    correctAnswer: 'q3-c2-l03-a',
    explanation:
      'break coupe la répétition : utile dès qu’on a trouvé ce qu’on cherchait.',
    xpReward: 10,
  },
  {
    id: 'q3-c2-l04',
    districtId: 'q3',
    chapter: 2,
    order: 9,
    mechanic: 'qcm',
    title: 'continue',
    question: 'continue dans une boucle signifie en général :',
    answers: [
      { id: 'q3-c2-l04-a', label: 'Passer au tour suivant sans finir le corps courant', isCorrect: true },
      { id: 'q3-c2-l04-b', label: 'Arrêter tout le programme', isCorrect: false },
      { id: 'q3-c2-l04-c', label: 'Effacer toutes les variables', isCorrect: false },
      { id: 'q3-c2-l04-d', label: 'Répéter le corps une seconde fois dans le même tour', isCorrect: false },
    ],
    correctAnswer: 'q3-c2-l04-a',
    explanation:
      'continue saute la fin de l’itération en cours et revient au test de la boucle.',
    xpReward: 10,
  },
  {
    id: 'q3-c2-l05',
    districtId: 'q3',
    chapter: 2,
    order: 10,
    mechanic: 'qcm',
    title: 'for vs while',
    question: 'Quand préfère-t-on souvent un while plutôt qu’un for ?',
    answers: [
      { id: 'q3-c2-l05-a', label: 'Quand on ne connaît pas le nombre exact de tours à l’avance', isCorrect: true },
      { id: 'q3-c2-l05-b', label: 'Quand on veut obligatoirement parcourir un tableau par index', isCorrect: false },
      { id: 'q3-c2-l05-c', label: 'Jamais : le while est déprécié partout', isCorrect: false },
      { id: 'q3-c2-l05-d', label: 'Quand on veut éviter toute condition', isCorrect: false },
    ],
    correctAnswer: 'q3-c2-l05-a',
    explanation:
      'while brille quand la sortie dépend d’un événement ou d’une donnée lue au fil de l’eau.',
    xpReward: 10,
  },
  {
    id: 'q3-c3-l01',
    districtId: 'q3',
    chapter: 3,
    order: 11,
    mechanic: 'qcm',
    title: 'Boucles imbriquées',
    story: "L'usine a deux chaînes de production. Chacune tourne dans l'autre.",
    question:
      'Deux boucles imbriquées : la extérieure fait 2 tours, la intérieure 3 tours par tour extérieur. Combien d’exécutions totales du corps intérieur ?',
    answers: [
      { id: 'q3-c3-l01-a', label: '6 (2 × 3)', isCorrect: true },
      { id: 'q3-c3-l01-b', label: '5 (2 + 3)', isCorrect: false },
      { id: 'q3-c3-l01-c', label: '9 (3 au carré)', isCorrect: false },
      { id: 'q3-c3-l01-d', label: '1', isCorrect: false },
    ],
    correctAnswer: 'q3-c3-l01-a',
    explanation:
      'Pour chaque tour de la boucle externe, la interne fait 3 passages : 2 × 3 = 6.',
    xpReward: 10,
  },
  {
    id: 'q3-c3-l02',
    districtId: 'q3',
    chapter: 3,
    order: 12,
    mechanic: 'qcm',
    title: 'Grille 3×3',
    question:
      'for ligne de 0 à 2, for colonne de 0 à 2 : une action dans le corps intérieur. Combien d’actions ?',
    answers: [
      { id: 'q3-c3-l02-a', label: '9', isCorrect: true },
      { id: 'q3-c3-l02-b', label: '6', isCorrect: false },
      { id: 'q3-c3-l02-c', label: '3', isCorrect: false },
      { id: 'q3-c3-l02-d', label: '27', isCorrect: false },
    ],
    correctAnswer: 'q3-c3-l02-a',
    explanation:
      '3 lignes × 3 colonnes = 9 cases visitées, comme une grille dans l’usine.',
    xpReward: 10,
  },
  {
    id: 'q3-c3-l03',
    districtId: 'q3',
    chapter: 3,
    order: 13,
    mechanic: 'qcm',
    title: 'Complexité intuitive',
    question: 'Ajouter une boucle intérieure qui dépend de n (elle fait n tours) à une boucle extérieure qui fait n tours donne en gros combien d’itérations du corps intérieur ?',
    answers: [
      { id: 'q3-c3-l03-a', label: 'De l’ordre de n × n (n²)', isCorrect: true },
      { id: 'q3-c3-l03-b', label: 'Toujours n', isCorrect: false },
      { id: 'q3-c3-l03-c', label: 'Toujours 2n', isCorrect: false },
      { id: 'q3-c3-l03-d', label: 'Log₂(n) seulement', isCorrect: false },
    ],
    correctAnswer: 'q3-c3-l03-a',
    explanation:
      'Deux niveaux qui « vont jusqu’à n » multiplient souvent le travail : n × n pour le corps le plus profond.',
    xpReward: 10,
  },
  {
    id: 'q3-c3-l04',
    districtId: 'q3',
    chapter: 3,
    order: 14,
    mechanic: 'qcm',
    title: 'Simulation',
    question:
      'somme = 0. for k de 1 à 4 { somme = somme + k }. Valeur finale de somme ?',
    answers: [
      { id: 'q3-c3-l04-a', label: '10', isCorrect: true },
      { id: 'q3-c3-l04-b', label: '4', isCorrect: false },
      { id: 'q3-c3-l04-c', label: '24', isCorrect: false },
      { id: 'q3-c3-l04-d', label: '0', isCorrect: false },
    ],
    correctAnswer: 'q3-c3-l04-a',
    explanation:
      '1+2+3+4 = 10 ; la boucle cumule chaque tour.',
    xpReward: 10,
  },
  {
    id: 'q3-c3-l05',
    districtId: 'q3',
    chapter: 3,
    order: 15,
    mechanic: 'qcm',
    title: 'Défi usine',
    question:
      'i = 0 ; while (i < 4) { i = i + 1 ; if (i == 2) continue ; affiche i } — combien de fois affiche est-il appelé ?',
    answers: [
      { id: 'q3-c3-l05-a', label: '3 fois', isCorrect: true },
      { id: 'q3-c3-l05-b', label: '4 fois', isCorrect: false },
      { id: 'q3-c3-l05-c', label: '2 fois', isCorrect: false },
      { id: 'q3-c3-l05-d', label: '0 fois', isCorrect: false },
    ],
    correctAnswer: 'q3-c3-l05-a',
    explanation:
      'i parcourt 1,2,3,4. Pour i=2, continue saute l’affichage. Affichages pour i=1,3,4 : trois fois.',
    xpReward: 15,
  },
];

export function getQ3Level(levelId: string): Level | undefined {
  return q3BouclesLevels.find((l) => l.id === levelId);
}

export function getQ3LevelIdsInOrder(): string[] {
  return [...q3BouclesLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}
