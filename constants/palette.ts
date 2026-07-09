/**
 * Palettes thématiques (mêmes clés que l'ancien COLORS) pour un thème réactif.
 * - `nightColors` = valeurs identiques au mode nuit actuel (zéro régression).
 * - `dayColors`   = équivalent clair, ajouté par-dessus.
 *
 * Les composants consomment ces couleurs via `hooks/useThemeColors`.
 */
export interface ThemePalette {
  bg: string;
  bgCard: string;
  bgTrack: string;
  neonPurple: string;
  neonBlue: string;
  neonGreen: string;
  neonAmber: string;
  trackOn: string;
  trackOff: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  logBg: string;
}

export const nightColors: ThemePalette = {
  bg: '#0B0A1E',
  bgCard: '#141334',
  bgTrack: '#1A1842',
  neonPurple: '#8B83F0',
  neonBlue: '#4AA3F0',
  neonGreen: '#22C08A',
  neonAmber: '#F5A623',
  trackOn: '#5B54C9',
  trackOff: '#242150',
  textPrimary: '#F5F4FF',
  textSecondary: '#B9B4E8',
  textMuted: '#6E6A99',
  logBg: '#141334',
};

export const dayColors: ThemePalette = {
  bg: '#F4F3FB',
  bgCard: '#FFFFFF',
  bgTrack: '#ECEAF8',
  neonPurple: '#6C63D9',
  neonBlue: '#2F7FD1',
  neonGreen: '#12A374',
  neonAmber: '#C97A0E',
  trackOn: '#C9C4EC',
  trackOff: '#E4E1F2',
  textPrimary: '#1B1A2E',
  textSecondary: '#4A4770',
  textMuted: '#8A87A8',
  logBg: '#FFFFFF',
};

export type ThemeMode = 'night' | 'day' | 'system';
