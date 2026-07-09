import type { Level } from '../../types/game';

import { getQ1Level, getQ1LevelIdsInOrder, q1VariablesLevels } from './q1-variables';
import { getQ2Level, getQ2LevelIdsInOrder, q2ConditionsLevels } from './q2-conditions';
import { getQ3Level, getQ3LevelIdsInOrder, q3BouclesLevels } from './q3-boucles';
import { getQ4Level, getQ4LevelIdsInOrder, q4FonctionsLevels } from './q4-fonctions';
import { getQ5Level, getQ5LevelIdsInOrder, q5ListesLevels } from './q5-listes';
import { getQ6Level, getQ6LevelIdsInOrder, q6TriLevels } from './q6-tri';
import { getQ7Level, getQ7LevelIdsInOrder, q7RecursiviteLevels } from './q7-recursivite';
import { bossLevels, getBossLevel, getBossLevelIdsInOrder } from './boss';

/** Quartiers pour lesquels du contenu niveau existe dans l’app. */
export const DISTRICT_IDS_WITH_LEVELS = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'boss',
] as const;

export type DistrictIdWithLevels = (typeof DISTRICT_IDS_WITH_LEVELS)[number];

export function isDistrictWithLevels(id: string): id is DistrictIdWithLevels {
  return (DISTRICT_IDS_WITH_LEVELS as readonly string[]).includes(id);
}

export function getLevelsForDistrict(districtId: string): Level[] {
  switch (districtId) {
    case 'q1':
      return q1VariablesLevels;
    case 'q2':
      return q2ConditionsLevels;
    case 'q3':
      return q3BouclesLevels;
    case 'q4':
      return q4FonctionsLevels;
    case 'q5':
      return q5ListesLevels;
    case 'q6':
      return q6TriLevels;
    case 'q7':
      return q7RecursiviteLevels;
    case 'boss':
      return bossLevels;
    default:
      return [];
  }
}

export function getLevelForDistrict(
  districtId: string,
  levelId: string
): Level | undefined {
  switch (districtId) {
    case 'q1':
      return getQ1Level(levelId);
    case 'q2':
      return getQ2Level(levelId);
    case 'q3':
      return getQ3Level(levelId);
    case 'q4':
      return getQ4Level(levelId);
    case 'q5':
      return getQ5Level(levelId);
    case 'q6':
      return getQ6Level(levelId);
    case 'q7':
      return getQ7Level(levelId);
    case 'boss':
      return getBossLevel(levelId);
    default:
      return undefined;
  }
}

export function getLevelIdsInOrderForDistrict(districtId: string): string[] {
  switch (districtId) {
    case 'q1':
      return getQ1LevelIdsInOrder();
    case 'q2':
      return getQ2LevelIdsInOrder();
    case 'q3':
      return getQ3LevelIdsInOrder();
    case 'q4':
      return getQ4LevelIdsInOrder();
    case 'q5':
      return getQ5LevelIdsInOrder();
    case 'q6':
      return getQ6LevelIdsInOrder();
    case 'q7':
      return getQ7LevelIdsInOrder();
    case 'boss':
      return getBossLevelIdsInOrder();
    default:
      return [];
  }
}
