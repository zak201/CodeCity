import type { District } from '../types/game';

export const districts: District[] = [
  {
    id: 'q1',
    name: 'Quartier des Données',
    concept: 'Variables & Données',
    story:
      'Les panneaux affichent des chiffres incohérents : la ville a oublié ce qu’elle « retient ». Réapprendre à nommer et stocker une information remettra de l’ordre.',
    icon: 'variables',
    color: '#2D6A4F',
    totalLevels: 15,
    isLocked: false,
  },
  {
    id: 'q2',
    name: 'Carrefour des Si',
    concept: 'Conditions (if / else)',
    story:
      'Les feux et portillons hésitent entre ouvrir et fermer au mauvais moment. Sans conditions claires, plus personne ne sait quand passer.',
    icon: 'conditions',
    color: '#1B6CA8',
    totalLevels: 15,
    isLocked: false,
  },
  {
    id: 'q3',
    name: 'Boucle Sud & Nord',
    concept: 'Boucles (for / while)',
    story:
      'Certains services tournent en rond, d’autres s’arrêtent trop tôt. Remettre les répétitions au bon rythme stabilise tout le quartier.',
    icon: 'loops',
    color: '#B465DA',
    totalLevels: 15,
    isLocked: true,
  },
  {
    id: 'q4',
    name: 'Atelier des Procédures',
    concept: 'Fonctions',
    story:
      'Chaque artisan refait la même recette du début. Découper et nommer des blocs actionnable refermera l’atelier comme une horloge.',
    icon: 'functions',
    color: '#E07C3C',
    totalLevels: 12,
    isLocked: true,
  },
  {
    id: 'q5',
    name: 'Entrepôt Indexé',
    concept: 'Listes & Tableaux',
    story:
      'Les caisses sont mélangées : on cherche un objet comme dans une liste mal numérotée. Ranger par index et plage remettra la logistique.',
    icon: 'lists',
    color: '#C75146',
    totalLevels: 12,
    isLocked: true,
  },
  {
    id: 'q6',
    name: 'Trieur Central',
    concept: 'Algorithmes de tri',
    story:
      'Les lignes de bus et files d’attente ne sont plus ordonnées. Comprendre comment ranger une collection guérira les embouteillages.',
    icon: 'sort',
    color: '#5C4D7D',
    totalLevels: 10,
    isLocked: true,
  },
  {
    id: 'q7',
    name: 'Spirale Miroir',
    concept: 'Récursivité',
    story:
      'Des motifs se répètent à l’infini dans des miroirs défectueux. Voir le « tout » dans un « morceau » permettra de casser la boucle sans la casser.',
    icon: 'recursion',
    color: '#3D5A80',
    totalLevels: 10,
    isLocked: true,
  },
  {
    id: 'boss',
    name: 'Tour Centrale',
    concept: 'Défi final',
    story:
      'Le cœur de CodeCity pulse encore, mais le bug s’y est enfoui. Tout ce que tu as appris devra s’assembler en une seule mission.',
    icon: 'tower',
    color: '#212529',
    totalLevels: 1,
    isLocked: true,
  },
];
