import { View } from 'react-native';

import type { Answer } from '../../types/game';
import { CodeBlock } from './CodeBlock';
import { QCM } from './QCM';

export interface PredictionProps {
  code: string;
  question: string;
  answers: Answer[];
  explanation: string;
  hint?: string;
  onCorrect: () => void;
  onComplete: () => void;
  onHintUsed?: () => void;
}

/**
 * Mécanique « prédire la sortie » : un bloc de code, puis un choix multiple sur
 * ce que le programme affiche. On réutilise entièrement la logique de QCM.
 */
export function Prediction({ code, ...qcmProps }: PredictionProps) {
  return (
    <View>
      <CodeBlock code={code} />
      <QCM {...qcmProps} />
    </View>
  );
}
