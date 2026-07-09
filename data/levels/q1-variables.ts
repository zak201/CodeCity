import type { Level } from '../../types/game';

/** Quinze niveaux QCM — variables & données, répartis sur 3 chapitres (chapitre 1 : découvrir les variables ; chapitre 2 : manipuler les valeurs ; chapitre 3 : types et conversions). */
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
  {
    id: 'q1-c2-l06',
    districtId: 'q1',
    chapter: 2,
    order: 6,
    mechanic: 'qcm',
    title: 'Calculer un total',
    story:
      "Au marché de CodeCity, la caisse doit additionner ta commande. LOG te montre comment une variable peut naître d’un calcul.",
    question:
      'Si prix = 3 et quantite = 4, que vaut la variable total après total = prix * quantite ?',
    answers: [
      { id: 'q1-c2-l06-a', label: '7', isCorrect: false },
      { id: 'q1-c2-l06-b', label: '12', isCorrect: true },
      { id: 'q1-c2-l06-c', label: '34', isCorrect: false },
      { id: 'q1-c2-l06-d', label: 'La lettre « prix »', isCorrect: false },
    ],
    correctAnswer: 'q1-c2-l06-b',
    explanation:
      'Le programme remplace d’abord prix et quantite par leurs valeurs (3 et 4), multiplie, puis range le résultat 12 dans total.',
    xpReward: 10,
    hint: 'Le symbole * veut dire « multiplié par », pas « collé à côté ».',
  },
  {
    id: 'q1-c2-l07',
    districtId: 'q1',
    chapter: 2,
    order: 7,
    mechanic: 'qcm',
    title: 'Incrémenter un compteur',
    question:
      'compteur vaut 5. Après la ligne compteur = compteur + 1, que vaut compteur ?',
    answers: [
      { id: 'q1-c2-l07-a', label: '5, la ligne ne change rien', isCorrect: false },
      { id: 'q1-c2-l07-b', label: '6', isCorrect: true },
      { id: 'q1-c2-l07-c', label: '51', isCorrect: false },
      { id: 'q1-c2-l07-d', label: 'Une erreur, on ne peut pas s’auto-référencer', isCorrect: false },
    ],
    correctAnswer: 'q1-c2-l07-b',
    explanation:
      'On lit d’abord la valeur actuelle (5), on ajoute 1 pour obtenir 6, puis on range 6 dans la même variable : c’est ainsi qu’on compte.',
    xpReward: 10,
    hint: 'La partie à droite du = est calculée avant d’être rangée à gauche.',
  },
  {
    id: 'q1-c2-l08',
    districtId: 'q1',
    chapter: 2,
    order: 8,
    mechanic: 'construction',
    title: 'Échanger deux valeurs',
    story:
      "Deux drones portent chacun un colis. LOG veut qu’ils s’échangent leur chargement sans en perdre un seul.",
    question:
      'a vaut 1 et b vaut 2. Remets les lignes dans l’ordre pour échanger leurs valeurs sans en perdre.',
    orderedLines: ['temp = a', 'a = b', 'b = temp'],
    correctAnswer: ['temp = a', 'a = b', 'b = temp'],
    explanation:
      'On met a de côté dans temp, on copie b dans a, puis on remet la valeur sauvegardée (temp) dans b : rien n’est écrasé par erreur.',
    xpReward: 10,
    hint: 'Sans variable de secours, la première affectation efface une des deux valeurs.',
  },
  {
    id: 'q1-c2-l09',
    districtId: 'q1',
    chapter: 2,
    order: 9,
    mechanic: 'qcm',
    title: 'Coller du texte',
    question:
      'prenom vaut "Léa". Que produit "Bonjour " + prenom ?',
    answers: [
      { id: 'q1-c2-l09-a', label: '"Bonjour Léa"', isCorrect: true },
      { id: 'q1-c2-l09-b', label: '"BonjourLéa" sans espace', isCorrect: false },
      { id: 'q1-c2-l09-c', label: 'Une addition de nombres', isCorrect: false },
      { id: 'q1-c2-l09-d', label: '"Bonjour prenom"', isCorrect: false },
    ],
    correctAnswer: 'q1-c2-l09-a',
    explanation:
      'Entre deux textes, le + fait de la concaténation : il colle les chaînes bout à bout. L’espace après « Bonjour » est conservé.',
    xpReward: 10,
    hint: 'Le + entre deux chaînes ne calcule pas, il assemble.',
  },
  {
    id: 'q1-c2-l10',
    districtId: 'q1',
    chapter: 2,
    order: 10,
    mechanic: 'qcm',
    title: 'Affecter ou comparer ?',
    story:
      "Sur le terminal de LOG, deux symboles se ressemblent dangereusement. Confondre = et == est l’erreur préférée des débutants.",
    question:
      'Quelle est la différence entre = et == ?',
    answers: [
      {
        id: 'q1-c2-l10-a',
        label: '= range une valeur dans une variable, == vérifie si deux valeurs sont égales',
        isCorrect: true,
      },
      {
        id: 'q1-c2-l10-b',
        label: 'Les deux font exactement la même chose',
        isCorrect: false,
      },
      {
        id: 'q1-c2-l10-c',
        label: '= compare, == range une valeur',
        isCorrect: false,
      },
      {
        id: 'q1-c2-l10-d',
        label: '== additionne deux nombres',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q1-c2-l10-a',
    explanation:
      'Le simple = est une affectation (« deviens »), le double == est une comparaison qui répond vrai ou faux (« est-il égal à ? »).',
    xpReward: 10,
    hint: 'Un seul signe pour donner une valeur, deux signes pour poser une question.',
  },
  {
    id: 'q1-c3-l11',
    districtId: 'q1',
    chapter: 3,
    order: 11,
    mechanic: 'qcm',
    title: 'Entier ou décimal ?',
    question:
      'Parmi ces valeurs, laquelle est un nombre décimal (à virgule) plutôt qu’un entier ?',
    answers: [
      { id: 'q1-c3-l11-a', label: '7', isCorrect: false },
      { id: 'q1-c3-l11-b', label: '3.14', isCorrect: true },
      { id: 'q1-c3-l11-c', label: '-2', isCorrect: false },
      { id: 'q1-c3-l11-d', label: '0', isCorrect: false },
    ],
    correctAnswer: 'q1-c3-l11-b',
    explanation:
      'Un entier n’a pas de partie après la virgule (7, -2, 0). 3.14 possède une partie décimale : c’est un nombre à virgule (flottant).',
    xpReward: 10,
    hint: 'Cherche le point ou la virgule qui sépare la partie entière de la partie fractionnaire.',
  },
  {
    id: 'q1-c3-l12',
    districtId: 'q1',
    chapter: 3,
    order: 12,
    mechanic: 'qcm',
    title: 'Vrai ou faux',
    story:
      "Les portes de CodeCity ne connaissent que deux réponses : ouvert ou fermé. LOG appelle ça un booléen.",
    question:
      'Quelles sont les deux seules valeurs possibles d’un booléen ?',
    answers: [
      { id: 'q1-c3-l12-a', label: 'vrai (true) et faux (false)', isCorrect: true },
      { id: 'q1-c3-l12-b', label: '0 et n’importe quel texte', isCorrect: false },
      { id: 'q1-c3-l12-c', label: 'oui, non et peut-être', isCorrect: false },
      { id: 'q1-c3-l12-d', label: 'tous les nombres entiers', isCorrect: false },
    ],
    correctAnswer: 'q1-c3-l12-a',
    explanation:
      'Un booléen ne peut valoir que vrai ou faux. Il sert à représenter une condition, comme « le joueur est-il connecté ? ».',
    xpReward: 10,
    hint: 'Pense à un interrupteur : deux positions, pas trois.',
  },
  {
    id: 'q1-c3-l13',
    districtId: 'q1',
    chapter: 3,
    order: 13,
    mechanic: 'qcm',
    title: 'Convertir un texte en nombre',
    question:
      'Une saisie clavier arrive sous forme de texte "12". Que faut-il faire avant de l’utiliser dans un calcul ?',
    answers: [
      {
        id: 'q1-c3-l13-a',
        label: 'La convertir en nombre (par ex. 12) avant de calculer',
        isCorrect: true,
      },
      {
        id: 'q1-c3-l13-b',
        label: 'Rien, un texte se calcule comme un nombre',
        isCorrect: false,
      },
      {
        id: 'q1-c3-l13-c',
        label: 'Supprimer la variable et recommencer',
        isCorrect: false,
      },
      {
        id: 'q1-c3-l13-d',
        label: 'Ajouter des guillemets supplémentaires',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q1-c3-l13-a',
    explanation:
      'Le texte "12" et le nombre 12 sont de types différents. Pour additionner ou multiplier, on convertit d’abord le texte en nombre.',
    xpReward: 10,
    hint: 'Les guillemets trahissent un texte ; les calculs veulent un nombre.',
  },
  {
    id: 'q1-c3-l14',
    districtId: 'q1',
    chapter: 3,
    order: 14,
    mechanic: 'qcm',
    title: 'Additionner sans convertir',
    story:
      "Un débutant tape 2 + \"3\" dans la console de LOG et s’attend à 5. L’écran affiche autre chose…",
    question:
      'Que risque-t-il de se passer si on fait "3" + 2 sans convertir le texte "3" en nombre ?',
    answers: [
      {
        id: 'q1-c3-l14-a',
        label: 'On obtient un résultat inattendu comme le texte "32", ou une erreur',
        isCorrect: true,
      },
      {
        id: 'q1-c3-l14-b',
        label: 'On obtient toujours 5, la machine devine',
        isCorrect: false,
      },
      {
        id: 'q1-c3-l14-c',
        label: 'L’ordinateur se met à jour tout seul',
        isCorrect: false,
      },
      {
        id: 'q1-c3-l14-d',
        label: 'Le texte "3" devient automatiquement un entier',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q1-c3-l14-a',
    explanation:
      'Mélanger texte et nombre est ambigu : selon le langage, le + colle les caractères ("32") ou déclenche une erreur. D’où l’intérêt de convertir avant.',
    xpReward: 10,
    hint: 'Rappelle-toi : entre deux textes, le + colle au lieu d’additionner.',
  },
  {
    id: 'q1-c3-l15',
    districtId: 'q1',
    chapter: 3,
    order: 15,
    mechanic: 'qcm',
    title: 'La notion de constante',
    question:
      'Une constante comme PI ou le taux de TVA, c’est une valeur qui :',
    answers: [
      {
        id: 'q1-c3-l15-a',
        label: 'ne doit pas changer pendant l’exécution du programme',
        isCorrect: true,
      },
      {
        id: 'q1-c3-l15-b',
        label: 'change à chaque ligne de code',
        isCorrect: false,
      },
      {
        id: 'q1-c3-l15-c',
        label: 'n’a pas de nom, contrairement à une variable',
        isCorrect: false,
      },
      {
        id: 'q1-c3-l15-d',
        label: 'ne peut contenir que du texte',
        isCorrect: false,
      },
    ],
    correctAnswer: 'q1-c3-l15-a',
    explanation:
      'Une constante est comme une variable dont la valeur est fixée une fois pour toutes : la protéger évite de modifier par erreur un nombre censé rester stable.',
    xpReward: 10,
    hint: 'Le mot « constant » signifie « qui ne varie pas ».',
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