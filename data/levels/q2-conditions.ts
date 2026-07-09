import type { Level } from '../../types/game';

/**
 * Quartier Q2 — Conditions (if / else).
 * Arc : les feux de CodeCity ; LOG envoie réparer le système de décision.
 * story : uniquement au premier niveau de chaque chapitre (orders 1, 6, 11).
 */
export const q2ConditionsLevels: Level[] = [
  {
    id: 'q2-c1-l01',
    districtId: 'q2',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Sens de la condition',
    story:
      'Le premier feu est tombé en panne. Il ne sait plus quand passer au vert.',
    question: "Qu'est-ce qu'une condition en programmation ?",
    answers: [
      {
        id: 'q2-c1-l01-a',
        label: 'Une valeur affichée en boucle sans arrêt',
        isCorrect: false,
      },
      {
        id: 'q2-c1-l01-b',
        label: 'Une instruction qui exécute du code SI quelque chose est vrai',
        isCorrect: true,
      },
      {
        id: 'q2-c1-l01-c',
        label: 'Un nom réservé pour créer un tableau',
        isCorrect: false,
      },
      {
        id: 'q2-c1-l01-d',
        label: 'Une fonction qui ne retourne jamais de valeur',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q2-c1-l01-b',
    explanation:
      'Une condition teste si une situation est vraie ou fausse ; seule la branche qui correspond est suivie, comme un feu qui choisit la voie selon les capteurs.',
    xpReward: 10,
    hint: 'Pense au « si… alors » du quotidien.',
  },
  {
    id: 'q2-c1-l02',
    districtId: 'q2',
    chapter: 1,
    order: 2,
    mechanic: 'qcm',
    title: 'Condition vraie',
    question: 'si (5 > 3) que se passe-t-il ?',
    answers: [
      {
        id: 'q2-c1-l02-a',
        label: 'La condition est fausse, le bloc est ignoré',
        isCorrect: false,
      },
      {
        id: 'q2-c1-l02-b',
        label: 'La condition est vraie, le bloc s’exécute',
        isCorrect: true,
      },
      {
        id: 'q2-c1-l02-c',
        label: 'Le programme signale toujours une erreur de syntaxe',
        isCorrect: false,
      },
      {
        id: 'q2-c1-l02-d',
        label: 'Les deux branches s’exécutent dans le même tour',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q2-c1-l02-b',
    explanation:
      'Ici 5 > 3 est vrai : le bloc du si est exécuté.',
    xpReward: 10,
  },
  {
    id: 'q2-c1-l03',
    districtId: 'q2',
    chapter: 1,
    order: 3,
    mechanic: 'qcm',
    title: 'Branche sinon',
    question: "si (2 > 8) affiche 'Oui' sinon affiche 'Non' — résultat ?",
    answers: [
      { id: 'q2-c1-l03-a', label: 'Oui', isCorrect: false },
      { id: 'q2-c1-l03-b', label: 'Non', isCorrect: true },
      { id: 'q2-c1-l03-c', label: 'Rien', isCorrect: false },
      { id: 'q2-c1-l03-d', label: 'Oui puis Non', isCorrect: false },
    ],
    correctAnswer: 'q2-c1-l03-b',
    explanation:
      '2 > 8 est faux : c’est la branche sinon qui s’applique, donc « Non ».',
    xpReward: 10,
  },
  {
    id: 'q2-c1-l04',
    districtId: 'q2',
    chapter: 1,
    order: 4,
    mechanic: 'qcm',
    title: 'Égalité',
    question: "Quel opérateur signifie « est égal à » (souvent en pseudo-code) ?",
    answers: [
      { id: 'q2-c1-l04-a', label: '=', isCorrect: false },
      { id: 'q2-c1-l04-b', label: '==', isCorrect: true },
      { id: 'q2-c1-l04-c', label: '=>', isCorrect: false },
      { id: 'q2-c1-l04-d', label: '!=', isCorrect: false },
    ],
    correctAnswer: 'q2-c1-l04-b',
    explanation:
      'En pseudo-code, == compare deux valeurs. Attention : = sert souvent à assigner une valeur.',
    xpReward: 10,
    hint: 'Comparer n’est pas assigner.',
  },
  {
    id: 'q2-c1-l05',
    districtId: 'q2',
    chapter: 1,
    order: 5,
    mechanic: 'drag-drop',
    title: 'Test sur une variable',
    question:
      'x vaut 10. Complète la condition pour afficher « Exact » quand x est égal à 10.',
    fillTemplate: 'si (x ___ 10) { afficher("Exact") }',
    fillTokens: ['==', '=', '!=', '>'],
    fillSolution: ['=='],
    correctAnswer: ['=='],
    explanation:
      'x vaut 10, donc (x == 10) est vrai : le message du bloc si s’affiche. On compare avec ==, pas avec = qui sert à assigner.',
    xpReward: 10,
    hint: 'Comparer une égalité utilise deux signes égal, pas un seul.',
  },
  {
    id: 'q2-c2-l01',
    districtId: 'q2',
    chapter: 2,
    order: 6,
    mechanic: 'qcm',
    title: 'Rôle du else',
    story:
      'Trois carrefours en cascade. Chaque feu dépend du précédent.',
    question: "Que signifie 'else' ?",
    answers: [
      {
        id: 'q2-c2-l01-a',
        label: 'Sinon — s’exécute si la condition est fausse',
        isCorrect: true,
      },
      {
        id: 'q2-c2-l01-b',
        label: 'Sinon — s’exécute avant le if',
        isCorrect: false,
      },
      {
        id: 'q2-c2-l01-c',
        label: 'Une boucle qui compte à rebours',
        isCorrect: false,
      },
      {
        id: 'q2-c2-l01-d',
        label: 'Un raccourci pour déclarer une constante',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q2-c2-l01-a',
    explanation:
      'else couvre le cas où la condition du if n’est pas remplie.',
    xpReward: 10,
  },
  {
    id: 'q2-c2-l02',
    districtId: 'q2',
    chapter: 2,
    order: 7,
    mechanic: 'qcm',
    title: 'Petit ou grand',
    question:
      "si (x > 5) affiche 'Grand' sinon affiche 'Petit'. x = 3 → ?",
    answers: [
      { id: 'q2-c2-l02-a', label: 'Grand', isCorrect: false },
      { id: 'q2-c2-l02-b', label: 'Petit', isCorrect: true },
      { id: 'q2-c2-l02-c', label: 'Erreur', isCorrect: false },
      { id: 'q2-c2-l02-d', label: 'Les deux', isCorrect: false },
    ],
    correctAnswer: 'q2-c2-l02-b',
    explanation: '3 > 5 est faux : branche else, donc « Petit ».',
    xpReward: 10,
  },
  {
    id: 'q2-c2-l03',
    districtId: 'q2',
    chapter: 2,
    order: 8,
    mechanic: 'qcm',
    title: 'Différent de',
    question: "Quel opérateur signifie « différent de » ?",
    answers: [
      { id: 'q2-c2-l03-a', label: '!=', isCorrect: true },
      { id: 'q2-c2-l03-b', label: '==', isCorrect: false },
      { id: 'q2-c2-l03-c', label: '>=', isCorrect: false },
      { id: 'q2-c2-l03-d', label: '&&', isCorrect: false },
    ],
    correctAnswer: 'q2-c2-l03-a',
    explanation: '!= teste l’inégalité ; == l’égalité ; && combine deux conditions.',
    xpReward: 10,
  },
  {
    id: 'q2-c2-l04',
    districtId: 'q2',
    chapter: 2,
    order: 9,
    mechanic: 'qcm',
    title: 'Double condition (ET)',
    question: 'si (x > 0 && x < 10) — que vérifie cette condition ?',
    answers: [
      {
        id: 'q2-c2-l04-a',
        label: 'Que x est strictement entre 0 et 10 (souvent 1 à 9 pour des entiers)',
        isCorrect: true,
      },
      {
        id: 'q2-c2-l04-b',
        label: 'Que x vaut 0 ou 10 exactement',
        isCorrect: false,
      },
      {
        id: 'q2-c2-l04-c',
        label: 'Que x est supérieur ou égal à 10',
        isCorrect: false,
      },
      {
        id: 'q2-c2-l04-d',
        label: 'Qu’une seule des deux comparaisons compte',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q2-c2-l04-a',
    explanation:
      'Les deux parties reliées par && doivent être vraies : x est à la fois positif et strictement inférieur à 10.',
    xpReward: 10,
  },
  {
    id: 'q2-c2-l05',
    districtId: 'q2',
    chapter: 2,
    order: 10,
    mechanic: 'qcm',
    title: 'OU logique',
    question:
      'si (x == 5 || x == 10) avec x = 7 — la condition est-elle vraie ou fausse ?',
    answers: [
      { id: 'q2-c2-l05-a', label: 'Vrai', isCorrect: false },
      { id: 'q2-c2-l05-b', label: 'Faux', isCorrect: true },
      { id: 'q2-c2-l05-c', label: 'Indéfinie', isCorrect: false },
      { id: 'q2-c2-l05-d', label: 'Vrai seulement si x est pair', isCorrect: false },
    ],
    correctAnswer: 'q2-c2-l05-b',
    explanation:
      'Avec ||, il suffirait que x soit 5 ou 10 ; 7 ne satisfait aucune des deux égalités.',
    xpReward: 10,
  },
  {
    id: 'q2-c3-l01',
    districtId: 'q2',
    chapter: 3,
    order: 11,
    mechanic: 'qcm',
    title: 'Chaîne if / else if',
    story:
      'LOG : Le système principal est en ligne. Maintenant les cas limites.',
    question:
      'Dans une chaîne si / sinon si / sinon, que se passe-t-il en général dès qu’une condition est vraie ?',
    answers: [
      {
        id: 'q2-c3-l01-a',
        label: 'Les branches suivantes du même bloc ne sont pas testées',
        isCorrect: true,
      },
      {
        id: 'q2-c3-l01-b',
        label: 'Toutes les branches sont toujours exécutées',
        isCorrect: false,
      },
      {
        id: 'q2-c3-l01-c',
        label: 'Seul le dernier sinon peut s’exécuter',
        isCorrect: false,
      },
      {
        id: 'q2-c3-l01-d',
        label: 'Le premier sinon si est ignoré',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q2-c3-l01-a',
    explanation:
      'Comme une liste de règles : on s’arrête à la première qui correspond.',
    xpReward: 10,
  },
  {
    id: 'q2-c3-l02',
    districtId: 'q2',
    chapter: 3,
    order: 12,
    mechanic: 'qcm',
    title: 'Sinon si',
    question:
      'vitesse = 45. si (vitesse > 80) alerte "rapide" sinon si (vitesse > 40) alerte "modéré" sinon alerte "lent". Résultat ?',
    answers: [
      { id: 'q2-c3-l02-a', label: 'rapide', isCorrect: false },
      { id: 'q2-c3-l02-b', label: 'modéré', isCorrect: true },
      { id: 'q2-c3-l02-c', label: 'lent', isCorrect: false },
      { id: 'q2-c3-l02-d', label: 'Aucune alerte', isCorrect: false },
    ],
    correctAnswer: 'q2-c3-l02-b',
    explanation:
      'Pas > 80, mais > 40 : la deuxième condition gagne.',
    xpReward: 10,
  },
  {
    id: 'q2-c3-l03',
    districtId: 'q2',
    chapter: 3,
    order: 13,
    mechanic: 'qcm',
    title: 'Chaînes de caractères',
    question: 'mot = "STOP". si (mot == "STOP") que fait le programme ?',
    answers: [
      {
        id: 'q2-c3-l03-a',
        label: 'Il entre dans le bloc si (comparaison de texte possible)',
        isCorrect: true,
      },
      {
        id: 'q2-c3-l03-b',
        label: 'Il refuse toujours de comparer des chaînes',
        isCorrect: false,
      },
      {
        id: 'q2-c3-l03-c',
        label: 'Il convertit STOP en nombre sans te prévenir',
        isCorrect: false,
      },
      {
        id: 'q2-c3-l03-d',
        label: 'Il inverse les lettres du mot',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q2-c3-l03-a',
    explanation:
      'Les langages permettent souvent de comparer des chaînes ; attention à la casse selon le contexte.',
    xpReward: 10,
  },
  {
    id: 'q2-c3-l04',
    districtId: 'q2',
    chapter: 3,
    order: 14,
    mechanic: 'qcm',
    title: 'Booléen',
    question:
      'routeLibre = vrai. si (routeLibre) passerVert — que représente routeLibre ?',
    answers: [
      {
        id: 'q2-c3-l04-a',
        label: 'Une valeur vrai/faux qui pilote la décision',
        isCorrect: true,
      },
      {
        id: 'q2-c3-l04-b',
        label: 'Une couleur RGB',
        isCorrect: false,
      },
      {
        id: 'q2-c3-l04-c',
        label: 'Un nombre entier obligatoirement négatif',
        isCorrect: false,
      },
      {
        id: 'q2-c3-l04-d',
        label: 'Une boucle bornée',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q2-c3-l04-a',
    explanation:
      'Un booléen résume une condition : prêt oui/non à enchaîner une action.',
    xpReward: 10,
  },
  {
    id: 'q2-c3-l05',
    districtId: 'q2',
    chapter: 3,
    order: 15,
    mechanic: 'qcm',
    title: 'Carrefour final',
    story: 'Dernier feu. Le plus critique.',
    question:
      'a = 2, b = 3. si (a + b > 5) si (b == 3) action "X" sinon action "Y" sinon action "Z". Quelle action ?',
    answers: [
      { id: 'q2-c3-l05-a', label: '"X"', isCorrect: false },
      { id: 'q2-c3-l05-b', label: '"Y"', isCorrect: false },
      { id: 'q2-c3-l05-c', label: '"Z"', isCorrect: true },
      { id: 'q2-c3-l05-d', label: 'Aucune', isCorrect: false },
    ],
    correctAnswer: 'q2-c3-l05-c',
    explanation:
      'a + b vaut 5 : (a + b > 5) est faux, le bloc interne ne s’exécute pas ; c’est la branche sinon du premier si : "Z".',
    xpReward: 15,
  },
];

export function getQ2Level(levelId: string): Level | undefined {
  return q2ConditionsLevels.find((l) => l.id === levelId);
}

export function getQ2LevelIdsInOrder(): string[] {
  return [...q2ConditionsLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}
