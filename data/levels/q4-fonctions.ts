import type { Level } from '../../types/game';

/**
 * Quartier Q4 — Fonctions.
 * Arc : maintenance ; automatiser avec des fonctions réutilisables.
 */
export const q4FonctionsLevels: Level[] = [
  {
    id: 'q4-c1-l01',
    districtId: 'q4',
    chapter: 1,
    order: 1,
    mechanic: 'qcm',
    title: 'Pourquoi une fonction',
    story:
      'Chaque réparation prend 2h parce que personne ne documente rien. LOG a une idée.',
    question: 'Une fonction sert surtout à :',
    answers: [
      { id: 'q4-c1-l01-a', label: 'Regrouper et nommer une série d’instructions réutilisables', isCorrect: true },
      { id: 'q4-c1-l01-b', label: 'Effacer automatiquement le disque', isCorrect: false },
      { id: 'q4-c1-l01-c', label: 'Remplacer le besoin de variables', isCorrect: false },
      { id: 'q4-c1-l01-d', label: 'Afficher une erreur à chaque ligne', isCorrect: false },
    ],
    correctAnswer: 'q4-c1-l01-a',
    explanation:
      'Une fonction est un bloc nommé qu’on peut rappeler partout : même recette, moins de duplication.',
    xpReward: 10,
  },
  {
    id: 'q4-c1-l02',
    districtId: 'q4',
    chapter: 1,
    order: 2,
    mechanic: 'qcm',
    title: 'Appel',
    question: 'Tu as défini fonction saluer() { affiche "LOG" }. Que fais saluer() dans le programme ?',
    answers: [
      { id: 'q4-c1-l02-a', label: 'Exécute le corps de la fonction une fois', isCorrect: true },
      { id: 'q4-c1-l02-b', label: 'Supprime la fonction de la mémoire', isCorrect: false },
      { id: 'q4-c1-l02-c', label: 'Compile le langage', isCorrect: false },
      { id: 'q4-c1-l02-d', label: 'Ne fait rien sans paramètre', isCorrect: false },
    ],
    correctAnswer: 'q4-c1-l02-a',
    explanation:
      'Appeler une fonction, c’est demander d’exécuter son bloc maintenant.',
    xpReward: 10,
  },
  {
    id: 'q4-c1-l03',
    districtId: 'q4',
    chapter: 1,
    order: 3,
    mechanic: 'qcm',
    title: 'return',
    question: 'Que fait return dans une fonction ?',
    answers: [
      { id: 'q4-c1-l03-a', label: 'Renvoie une valeur au point d’appel et stoppe souvent la fonction', isCorrect: true },
      { id: 'q4-c1-l03-b', label: 'Redémarre l’ordinateur', isCorrect: false },
      { id: 'q4-c1-l03-c', label: 'Affiche toujours zéro', isCorrect: false },
      { id: 'q4-c1-l03-d', label: 'Déclare une boucle infinie', isCorrect: false },
    ],
    correctAnswer: 'q4-c1-l03-a',
    explanation:
      'return permet de donner un résultat à qui a appelé la fonction ; après return, on sort en général de la fonction.',
    xpReward: 10,
  },
  {
    id: 'q4-c1-l04',
    districtId: 'q4',
    chapter: 1,
    order: 4,
    mechanic: 'qcm',
    title: 'Valeur retournée',
    question: 'fonction double(x) { return x * 2 }. double(7) vaut ?',
    answers: [
      { id: 'q4-c1-l04-a', label: '14', isCorrect: true },
      { id: 'q4-c1-l04-b', label: '72', isCorrect: false },
      { id: 'q4-c1-l04-c', label: '9', isCorrect: false },
      { id: 'q4-c1-l04-d', label: '0', isCorrect: false },
    ],
    correctAnswer: 'q4-c1-l04-a',
    explanation:
      'L’appel passe 7 ; le corps renvoie 7×2 = 14.',
    xpReward: 10,
  },
  {
    id: 'q4-c2-l01',
    districtId: 'q4',
    chapter: 2,
    order: 5,
    mechanic: 'qcm',
    title: 'Paramètres',
    story: 'LOG : Une fonction sans paramètre est un outil sans réglage. Passons au niveau supérieur.',
    question: 'Un paramètre de fonction, c’est :',
    answers: [
      { id: 'q4-c2-l01-a', label: 'Une valeur d’entrée que l’appelant peut fournir', isCorrect: true },
      { id: 'q4-c2-l01-b', label: 'Une erreur de compilation obligatoire', isCorrect: false },
      { id: 'q4-c2-l01-c', label: 'Le nom du fichier source', isCorrect: false },
      { id: 'q4-c2-l01-d', label: 'Un compteur interne inaccessible', isCorrect: false },
    ],
    correctAnswer: 'q4-c2-l01-a',
    explanation:
      'Les paramètres permettent d’adapter le même outil à des situations différentes.',
    xpReward: 10,
  },
  {
    id: 'q4-c2-l02',
    districtId: 'q4',
    chapter: 2,
    order: 6,
    mechanic: 'qcm',
    title: 'Arguments',
    question: 'fonction addition(a, b) { return a + b }. addition(3, 5) ?',
    answers: [
      { id: 'q4-c2-l02-a', label: '8', isCorrect: true },
      { id: 'q4-c2-l02-b', label: '35', isCorrect: false },
      { id: 'q4-c2-l02-c', label: '53', isCorrect: false },
      { id: 'q4-c2-l02-d', label: '2', isCorrect: false },
    ],
    correctAnswer: 'q4-c2-l02-a',
    explanation:
      '3 est passé en a, 5 en b ; la somme est 8.',
    xpReward: 10,
  },
  {
    id: 'q4-c2-l03',
    districtId: 'q4',
    chapter: 2,
    order: 7,
    mechanic: 'qcm',
    title: 'Portée intuitive',
    question: 'Une variable déclarée à l’intérieur d’une fonction est en général :',
    answers: [
      { id: 'q4-c2-l03-a', label: 'Visible seulement dans cette fonction (locale)', isCorrect: true },
      { id: 'q4-c2-l03-b', label: 'Toujours globale dans tout le programme', isCorrect: false },
      { id: 'q4-c2-l03-c', label: 'Partagée automatiquement par tous les fichiers du disque', isCorrect: false },
      { id: 'q4-c2-l03-d', label: 'Lecture seule pour toujours', isCorrect: false },
    ],
    correctAnswer: 'q4-c2-l03-a',
    explanation:
      'Les variables locales évitent les collisions et clarifient le rôle des données temporaires.',
    xpReward: 10,
  },
  {
    id: 'q4-c2-l04',
    districtId: 'q4',
    chapter: 2,
    order: 8,
    mechanic: 'qcm',
    title: 'Plusieurs params',
    question: 'fonction max3(x, y, z) retourne le plus grand des trois. max3(2, 9, 4) ?',
    answers: [
      { id: 'q4-c2-l04-a', label: '9', isCorrect: true },
      { id: 'q4-c2-l04-b', label: '3', isCorrect: false },
      { id: 'q4-c2-l04-c', label: '24', isCorrect: false },
      { id: 'q4-c2-l04-d', label: '2', isCorrect: false },
    ],
    correctAnswer: 'q4-c2-l04-a',
    explanation:
      'Parmi 2, 9 et 4, le maximum est 9.',
    xpReward: 10,
  },
  {
    id: 'q4-c3-l01',
    districtId: 'q4',
    chapter: 3,
    order: 9,
    mechanic: 'qcm',
    title: 'Composition',
    story: 'LOG : Tu maîtrises les outils. Maintenant, construis une boîte à outils.',
    question: 'carre(x)=return x*x ; sommeCarres(a,b)=return carre(a)+carre(b). sommeCarres(2,3) ?',
    answers: [
      { id: 'q4-c3-l01-a', label: '13', isCorrect: true },
      { id: 'q4-c3-l01-b', label: '25', isCorrect: false },
      { id: 'q4-c3-l01-c', label: '5', isCorrect: false },
      { id: 'q4-c3-l01-d', label: '36', isCorrect: false },
    ],
    correctAnswer: 'q4-c3-l01-a',
    explanation:
      'carre(2)=4, carre(3)=9, somme 4+9=13.',
    xpReward: 10,
  },
  {
    id: 'q4-c3-l02',
    districtId: 'q4',
    chapter: 3,
    order: 10,
    mechanic: 'qcm',
    title: 'Effet de bord vs pure',
    question: 'Une fonction « pure » (même entrées → même sortie, sans modifier l’extérieur) aide surtout à :',
    answers: [
      { id: 'q4-c3-l02-a', label: 'Raisonner et tester plus facilement', isCorrect: true },
      { id: 'q4-c3-l02-b', label: 'Éviter tout return', isCorrect: false },
      { id: 'q4-c3-l02-c', label: 'Désactiver les boucles', isCorrect: false },
      { id: 'q4-c3-l02-d', label: 'Supprimer les paramètres', isCorrect: false },
    ],
    correctAnswer: 'q4-c3-l02-a',
    explanation:
      'Moins de surprises = débogage plus simple, comme une checklist maintenance claire.',
    xpReward: 10,
  },
  {
    id: 'q4-c3-l03',
    districtId: 'q4',
    chapter: 3,
    order: 11,
    mechanic: 'qcm',
    title: 'Récursion ? non ici',
    question: 'Pour calculer le prix TTC sans boucle ni récursion, quelle structure est adaptée ?',
    answers: [
      { id: 'q4-c3-l03-a', label: 'Une fonction qui prend prix HT et taux et retourne HT × (1+taux)', isCorrect: true },
      { id: 'q4-c3-l03-b', label: 'Uniquement un fichier image', isCorrect: false },
      { id: 'q4-c3-l03-c', label: 'Une variable jamais utilisée', isCorrect: false },
      { id: 'q4-c3-l03-d', label: 'Une boucle while obligatoire sur 1 million d’itérations', isCorrect: false },
    ],
    correctAnswer: 'q4-c3-l03-a',
    explanation:
      'Une formule simple dans une fonction suffit : c’est le cœur du « outil réutilisable ».',
    xpReward: 10,
  },
  {
    id: 'q4-c3-l04',
    districtId: 'q4',
    chapter: 3,
    order: 12,
    mechanic: 'qcm',
    title: 'Mission atelier',
    question: 'fonction a() { return 1 } ; fonction b() { return a() + a() }. b() vaut ?',
    answers: [
      { id: 'q4-c3-l04-a', label: '2', isCorrect: true },
      { id: 'q4-c3-l04-b', label: '1', isCorrect: false },
      { id: 'q4-c3-l04-c', label: '11', isCorrect: false },
      { id: 'q4-c3-l04-d', label: '0', isCorrect: false },
    ],
    correctAnswer: 'q4-c3-l04-a',
    explanation:
      'Chaque a() renvoie 1 ; b fait 1+1 = 2.',
    xpReward: 15,
  },
];

export function getQ4Level(levelId: string): Level | undefined {
  return q4FonctionsLevels.find((l) => l.id === levelId);
}

export function getQ4LevelIdsInOrder(): string[] {
  return [...q4FonctionsLevels]
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);
}
