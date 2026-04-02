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
