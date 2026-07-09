import { useColorScheme } from 'react-native';

import { dayColors, nightColors, type ThemePalette } from '../constants/palette';
import { useThemeStore } from '../store/themeStore';

/**
 * Renvoie la palette active selon le mode choisi par le joueur.
 * En mode 'system', on suit le thème de l'appareil.
 * Les styles doivent être construits via une fabrique memoïsée sur ce résultat.
 */
export function useThemeColors(): ThemePalette {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme();

  const effective =
    mode === 'system' ? (system === 'light' ? 'day' : 'night') : mode;

  return effective === 'day' ? dayColors : nightColors;
}
