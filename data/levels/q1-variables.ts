import type { Level } from '../../types/game';

/** Cinq premiers niveaux QCM — variables & données (chapitre 1). */
export const q1VariablesLevels: Level[] = [
  {
    id: 'q1-c1-l01',
    districtId: 'q1',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Qu’est-ce qu’une variable ?',
    story:
      "Ici, les panneaux affichent des valeurs qui changent. LOG t'explique comment les lire.",
    question:
      'Dans un programme, une variable sert principalement à :',
    answers: [
      {
        id: 'q1-c1-l01-a',
        label: 'Afficher obligatoirement du texte à l’écran',
        isCorrect: false,
      },
      {
        id: 'q1-c1-l01-b',
        label: 'Stocker une valeur en mémoire avec un nom',
        isCorrect: true,
      },
      {
        id: 'q1-c1-l01-c',
        label: 'Créer une connexion Internet',
        isCorrect: false,
      },
      {
        id: 'q1-c1-l01-d',
        label: 'Remplacer le système d’exploitation',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q1-c1-l01-b',
    explanation:
      "Une variable associe un nom à une valeur en mémoire, pour pouvoir la réutiliser et la modifier sans tout réécrire.",
    xpReward: 10,
    hint: 'Pense à un « étiquette » collée sur une boîte qui contient une valeur.',
  },
  {
    id: 'q1-c1-l02',
    districtId: 'q1',
    chapter: 1,
    order: 2,
    mechanic: 'qcm',
    title: 'Types de données',
    question:
      'Le nombre entier 42 et la chaîne "42" sont-ils la même chose pour la machine ?',
    answers: [
      { id: 'q1-c1-l02-a', label: 'Oui, toujours identiques', isCorrect: false },
      { id: 'q1-c1-l02-b', label: 'Non, le type diffère (nombre vs texte)', isCorrect: true },
      { id: 'q1-c1-l02-c', label: 'Oui, mais seulement en Python', isCorrect: false },
      { id: 'q1-c1-l02-d', label: 'Non, 42 est illégal en programmation', isCorrect: false },
    ],
    correctAnswer: 'q1-c1-l02-b',
    explanation:
      "Un entier et une chaîne ont souvent des représentations différentes ; les opérations permises ne sont pas les mêmes (ex. addition vs concaténation).",
    xpReward: 10,
    hint: 'Les guillemets autour de 42 indiquent souvent du texte, pas un nombre pur.',
  },
  {
    id: 'q1-c1-l03',
    districtId: 'q1',
    chapter: 1,
    order: 3,
    mechanic: 'qcm',
    title: 'Déclarer une variable',
    question:
      'Quelle idée correspond le mieux à « déclarer » une variable ?',
    answers: [
      {
        id: 'q1-c1-l03-a',
        label: 'Supprimer toutes les données du disque',
        isCorrect: false,
      },
      {
        id: 'q1-c1-l03-b',
        label: 'Réserver un nom pour une valeur (souvent avec une première valeur)',
        isCorrect: true,
      },
      {
        id: 'q1-c1-l03-c',
        label: 'Compiler le programme vers du binaire',
        isCorrect: false,
      },
      {
        id: 'q1-c1-l03-d',
        label: 'Afficher la documentation du langage',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q1-c1-l03-b',
    explanation:
      'Déclarer une variable, c’est introduire un identifiant que le programme pourra utiliser pour lire ou modifier une valeur.',
    xpReward: 10,
  },
  {
    id: 'q1-c1-l04',
    districtId: 'q1',
    chapter: 1,
    order: 4,
    mechanic: 'qcm',
    title: 'Réassignation',
    question:
      'Si tu écris : age = 20 puis plus tard age = 21, que se passe-t-il pour la variable age ?',
    answers: [
      {
        id: 'q1-c1-l04-a',
        label: 'Le programme crée deux variables différentes nommées age',
        isCorrect: false,
      },
      {
        id: 'q1-c1-l04-b',
        label: 'La même variable pointe vers une nouvelle valeur (21)',
        isCorrect: true,
      },
      {
        id: 'q1-c1-l04-c',
        label: 'La première valeur reste figée à 20 pour toujours',
        isCorrect: false,
      },
      {
        id: 'q1-c1-l04-d',
        label: 'L’ordinateur redémarre automatiquement',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q1-c1-l04-b',
    explanation:
      'Une variable mutable peut changer de valeur au fil du temps : le nom reste, c’est la valeur associée qui est mise à jour.',
    xpReward: 10,
    hint: 'Un même « casier » peut recevoir un nouveau contenu.',
  },
  {
    id: 'q1-c1-l05',
    districtId: 'q1',
    chapter: 1,
    order: 5,
    mechanic: 'qcm',
    title: 'Nommage',
    question:
      'Parmi ces noms de variable, lequel est généralement le plus lisible pour du code ?',
    answers: [
      { id: 'q1-c1-l05-a', label: 'x', isCorrect: false },
      { id: 'q1-c1-l05-b', label: 'nb', isCorrect: false },
      { id: 'q1-c1-l05-c', label: 'nombreDeJoueurs', isCorrect: true },
      { id: 'q1-c1-l05-d', label: 'data123', isCorrect: false },
    ],
    correctAnswer: 'q1-c1-l05-c',
    explanation:
      'Un nom explicite réduit les erreurs et aide les humains (et toi dans six mois) à comprendre le rôle de la variable.',
    xpReward: 10,
  },
];

export function getQ1Level(levelId: string): Level | undefined {
  return q1VariablesLevels.find((l) => l.id === levelId);
}

export function getQ1LevelIdsInOrder(): string[] {
  return [...q1VariablesLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}