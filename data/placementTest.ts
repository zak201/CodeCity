import type { DifficultyLevel, PlacementQuestion } from '../types/game';

export const placementQuestions: PlacementQuestion[] = [
  {
    id: 'placement-q1',
    block: 1,
    text: 'Tu as 5 pommes et tu en manges 2. Combien en reste-t-il ?',
    concept: 'variable-calcul',
    answers: [
      { id: 'placement-q1-a', label: '5', isCorrect: false },
      { id: 'placement-q1-b', label: '2', isCorrect: false },
      { id: 'placement-q1-c', label: '3', isCorrect: true },
      { id: 'placement-q1-d', label: '7', isCorrect: false },
    ],
  },
  {
    id: 'placement-q2',
    block: 1,
    text: "Une machine donne un café SI tu mets 1€. Tu mets 0,50€. Que se passe-t-il ?",
    concept: 'condition',
    answers: [
      { id: 'placement-q2-a', label: 'Tu obtiens un demi-café', isCorrect: false },
      { id: 'placement-q2-b', label: 'La machine te rend la monnaie', isCorrect: false },
      { id: 'placement-q2-c', label: 'Rien ne se passe', isCorrect: true },
      { id: 'placement-q2-d', label: "Le café coule mais s'arrête au milieu", isCorrect: false },
    ],
  },
  {
    id: 'placement-q3',
    block: 1,
    text: "Tu dis 'bonjour' 3 fois de suite. Combien de fois l'as-tu dit ?",
    concept: 'boucle',
    answers: [
      { id: 'placement-q3-a', label: '1', isCorrect: false },
      { id: 'placement-q3-b', label: '2', isCorrect: false },
      { id: 'placement-q3-c', label: '3', isCorrect: true },
      { id: 'placement-q3-d', label: '6', isCorrect: false },
    ],
  },
  {
    id: 'placement-q4',
    block: 2,
    text: "Que signifie x = 5 dans un programme ?",
    concept: 'variable-assignation',
    answers: [
      {
        id: 'placement-q4-a',
        label: 'On stocke la valeur 5 dans x',
        isCorrect: true,
      },
      {
        id: 'placement-q4-b',
        label: 'On vérifie si x est égal à 5',
        isCorrect: false,
      },
      { id: 'placement-q4-c', label: 'On affiche le chiffre 5', isCorrect: false },
      { id: 'placement-q4-d', label: 'x devient impossible à modifier', isCorrect: false },
    ],
  },
  {
    id: 'placement-q5',
    block: 2,
    text: 'Quel mot représente une répétition ?',
    concept: 'boucle-vocabulaire',
    answers: [
      { id: 'placement-q5-a', label: 'for', isCorrect: true },
      { id: 'placement-q5-b', label: 'table', isCorrect: false },
      { id: 'placement-q5-c', label: 'imprime', isCorrect: false },
      { id: 'placement-q5-d', label: 'couleur', isCorrect: false },
    ],
  },
  {
    id: 'placement-q6',
    block: 2,
    text: "si (5 > 3) alors affiche 'Oui' sinon affiche 'Non' — que s'affiche-t-il ?",
    concept: 'condition-lecture',
    answers: [
      { id: 'placement-q6-a', label: 'Oui', isCorrect: true },
      { id: 'placement-q6-b', label: 'Non', isCorrect: false },
      { id: 'placement-q6-c', label: 'Rien', isCorrect: false },
      { id: 'placement-q6-d', label: 'Erreur', isCorrect: false },
    ],
  },
  {
    id: 'placement-q7',
    block: 3,
    text: 'Une boucle tourne tant que x < 5. x commence à 0 et augmente de 1. Combien de tours ?',
    concept: 'boucle-comptage',
    answers: [
      { id: 'placement-q7-a', label: '4', isCorrect: false },
      { id: 'placement-q7-b', label: '5', isCorrect: true },
      { id: 'placement-q7-c', label: '6', isCorrect: false },
      { id: 'placement-q7-d', label: 'Une infinité', isCorrect: false },
    ],
  },
  {
    id: 'placement-q8',
    block: 3,
    text: "Qu'est-ce qu'une fonction ?",
    concept: 'fonction-definition',
    answers: [
      {
        id: 'placement-q8-a',
        label: 'Un bloc de code réutilisable qu’on appelle par son nom',
        isCorrect: true,
      },
      {
        id: 'placement-q8-b',
        label: 'Une sorte de variable qui ne peut contenir qu’un chiffre',
        isCorrect: false,
      },
      {
        id: 'placement-q8-c',
        label: 'Un message d’erreur affiché par le programme',
        isCorrect: false,
      },
      {
        id: 'placement-q8-d',
        label: 'Une condition toujours vraie ou toujours fausse',
        isCorrect: false,
      },
    ],
  },
];

export function computePlacementLevel(
  score: number,
  total: number
): DifficultyLevel {
  const pct = score / total;
  if (pct <= 0.25) return 'absolute-beginner';
  if (pct <= 0.625) return 'beginner';
  if (pct <= 0.875) return 'intermediate';
  return 'advanced';
}

export function getStartingDistrict(level: DifficultyLevel): string {
  const map: Record<DifficultyLevel, string> = {
    'absolute-beginner': 'q1',
    beginner: 'q2',
    intermediate: 'q3',
    advanced: 'q4',
  };
  return map[level];
}
