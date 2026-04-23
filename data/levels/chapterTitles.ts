/** Titres de chapitre par quartier (affichage narratif). */
const TITLES: Record<string, Record<number, string>> = {
  q2: {
    1: 'La machine qui décide',
    2: 'Les carrefours complexes',
    3: 'Le protocole d’urgence',
  },
  q3: {
    1: 'La répétition',
    2: 'Contrôler la boucle',
    3: 'Boucles imbriquées',
  },
  q4: {
    1: 'Créer un outil',
    2: 'Les paramètres',
    3: 'Fonctions avancées',
  },
  q5: {
    1: 'Les étagères',
    2: 'Modifier la collection',
    3: 'Parcourir les données',
  },
  q6: {
    1: 'Trier à la main',
    2: 'Algorithmes connus',
    3: '',
  },
  q7: {
    1: 'La fonction qui s’appelle',
    2: 'Applications',
    3: '',
  },
};

/** Q1 : chapitre unique dans les données actuelles ; titre générique. */
const Q1_FALLBACK = 'Variables et données';

export function getChapterTitle(
  districtId: string,
  chapter: 1 | 2 | 3
): string {
  if (districtId === 'q1') {
    return Q1_FALLBACK;
  }
  const row = TITLES[districtId];
  const t = row?.[chapter];
  if (t && t.length > 0) return t;
  return `Chapitre ${chapter}`;
}
