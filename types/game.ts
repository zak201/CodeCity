export type DifficultyLevel =
  | 'absolute-beginner'
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export type MechanicType =
  | 'qcm'
  | 'drag-drop'
  | 'prediction'
  | 'construction'
  | 'debug'
  | 'speed';

export interface District {
  id: string;
  name: string;
  concept: string;
  story: string;
  icon: string;
  color: string;
  totalLevels: number;
  isLocked: boolean;
}

export interface Level {
  id: string;
  districtId: string;
  chapter: 1 | 2 | 3;
  order: number;
  mechanic: MechanicType;
  title: string;
  story?: string;
  question: string;
  answers?: Answer[];
  correctAnswer: string | string[];
  explanation: string;
  xpReward: number;
  hint?: string;
  /** Bloc de code affiché au-dessus de la question (mécanique `prediction`). */
  code?: string;
  /**
   * Mécanique `construction` : lignes de code dans le BON ordre.
   * Elles sont mélangées à l'affichage ; le joueur doit les remettre en ordre.
   */
  orderedLines?: string[];
  /**
   * Mécanique `drag-drop` : gabarit de code avec des trous notés `___`.
   * Ex. : `si (age ___ 18) { ... }`
   */
  fillTemplate?: string;
  /** Mécanique `drag-drop` : jetons proposés (bonne réponse + distracteurs). */
  fillTokens?: string[];
  /**
   * Mécanique `drag-drop` : suite EXACTE des jetons attendus, dans l'ordre des
   * trous `___` du gabarit.
   */
  fillSolution?: string[];
}

export interface Answer {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface PlacementQuestion {
  id: string;
  block: 1 | 2 | 3;
  text: string;
  visual?: string;
  answers: Answer[];
  concept: string;
}

export interface UserProgress {
  userId: string;
  districtId: string;
  completedLevels: string[];
  stars: Record<string, 1 | 2 | 3>;
  lastPlayedAt: Date;
}
