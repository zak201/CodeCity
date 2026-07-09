/**
 * CodeCity — Design tokens « Néon Bienveillant / Aurora City ».
 *
 * Système à 3 couches : primitives -> sémantique (mode nuit + jour) -> concepts.
 * Additif et non-cassant : `constants/colors.ts` (COLORS) reste valide pendant
 * la migration progressive des écrans vers ces tokens.
 *
 * Objectif : garder l'ADN ville-de-code néon, mais plus chaleureux, plus lisible
 * et adapté aux enfants COMME aux adultes.
 */

// ---------------------------------------------------------------------------
// 1. PRIMITIVES — la palette brute, jamais utilisée directement dans l'UI.
// ---------------------------------------------------------------------------

export const palette = {
  // Grounds nocturnes (indigo profond, plus chaud que le noir pur)
  night900: '#0B0A1E',
  night800: '#121130',
  night700: '#1A1842',
  night600: '#232052',
  night500: '#2E2A63',

  // Accents « aurore »
  violet: '#8B83F0',
  violetDeep: '#6C63D9',
  blue: '#4AA3F0',
  mint: '#22C08A',
  mintDeep: '#12A374',
  amber: '#F5A623',
  amberDeep: '#C97A0E',
  coral: '#FF6B6B',
  coralDeep: '#E05555',
  pink: '#F472B6',
  teal: '#2DD4BF',
  gold: '#FFD166',

  // Neutres à biais violet (choisis, pas gris par défaut)
  white: '#FFFFFF',
  mist100: '#F5F4FF',
  mist300: '#B9B4E8',
  mist500: '#6E6A99',
  mist700: '#3A3766',

  // Grounds diurnes
  day50: '#F4F3FB',
  border100: '#E4E1F2',
  ink900: '#1B1A2E',
  ink600: '#4A4770',
  ink400: '#8A87A8',
} as const;

// ---------------------------------------------------------------------------
// 2. SÉMANTIQUE — ce que l'UI consomme. Deux modes : nuit (défaut) et jour.
// ---------------------------------------------------------------------------

export interface SemanticColors {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  primary: string;
  onPrimary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  focus: string;
  /** Fond des blocs de code. */
  codeBg: string;
}

export const dark: SemanticColors = {
  bg: palette.night900,
  surface: palette.night800,
  surfaceElevated: palette.night700,
  border: palette.night500,
  primary: palette.violet,
  onPrimary: palette.night900,
  success: palette.mint,
  danger: palette.coral,
  warning: palette.amber,
  info: palette.blue,
  text: palette.mist100,
  textSecondary: palette.mist300,
  textMuted: palette.mist500,
  focus: palette.violet,
  codeBg: '#07061A',
};

export const light: SemanticColors = {
  bg: palette.day50,
  surface: palette.white,
  surfaceElevated: palette.white,
  border: palette.border100,
  primary: palette.violetDeep,
  onPrimary: palette.white,
  success: palette.mintDeep,
  danger: palette.coralDeep,
  warning: palette.amberDeep,
  info: palette.blue,
  text: palette.ink900,
  textSecondary: palette.ink600,
  textMuted: palette.ink400,
  focus: palette.violetDeep,
  codeBg: '#12113022',
};

// ---------------------------------------------------------------------------
// 3. CONCEPTS — une couleur par quartier = un langage visuel à apprendre.
// ---------------------------------------------------------------------------

export const conceptColor: Record<string, string> = {
  q1: palette.mint, // Variables
  q2: palette.blue, // Conditions
  q3: palette.violet, // Boucles
  q4: palette.amber, // Fonctions
  q5: palette.coral, // Listes
  q6: palette.pink, // Tri
  q7: palette.teal, // Récursivité
  boss: palette.gold, // Tour Centrale
};

// ---------------------------------------------------------------------------
// 4. TYPOGRAPHIE — sans arrondie pour l'UI, mono UNIQUEMENT pour le code.
// ---------------------------------------------------------------------------

export const fontFamily = {
  /** Titres / UI : Nunito arrondie et chaleureuse (bundlée via @expo-google-fonts). */
  display: 'Nunito_800ExtraBold',
  displayBold: 'Nunito_700Bold',
  body: 'Nunito_600SemiBold',
  bodyRegular: 'Nunito_400Regular',
  /** Réservé au code affiché dans les niveaux. */
  code: 'monospace',
} as const;

/** Échelle de type (taille / interligne / graisse). */
export const typeScale = {
  display: { size: 32, lineHeight: 38, weight: '800' as const },
  h1: { size: 26, lineHeight: 32, weight: '800' as const },
  h2: { size: 20, lineHeight: 26, weight: '700' as const },
  title: { size: 17, lineHeight: 24, weight: '700' as const },
  body: { size: 15, lineHeight: 22, weight: '500' as const },
  label: { size: 13, lineHeight: 18, weight: '700' as const },
  caption: { size: 12, lineHeight: 16, weight: '600' as const },
} as const;

// ---------------------------------------------------------------------------
// 5. ESPACEMENT / RAYONS / MOTION — généreux et ludiques.
// ---------------------------------------------------------------------------

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const motion = {
  /** Durées (ms). */
  instant: 90,
  fast: 140,
  base: 220,
  slow: 400,
  celebrate: 700,
  /** Zones tactiles minimales (Apple HIG). */
  minTouch: 44,
} as const;

/** Lueur néon (halo) — à mapper sur shadow* en RN. */
export const glow = {
  color: palette.violet,
  radius: 16,
  opacity: 0.5,
} as const;

// ---------------------------------------------------------------------------
// Agrégat pratique.
// ---------------------------------------------------------------------------

export const theme = {
  palette,
  dark,
  light,
  conceptColor,
  fontFamily,
  typeScale,
  spacing,
  radius,
  motion,
  glow,
} as const;

export type Theme = typeof theme;
