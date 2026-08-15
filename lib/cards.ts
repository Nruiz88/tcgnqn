export const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'] as const

export const CONDITION_LABELS: Record<string, string> = {
  NM: 'Near Mint',
  LP: 'Lightly Played',
  MP: 'Moderately Played',
  HP: 'Heavily Played',
  DMG: 'Damaged',
}

export const LANGUAGES = ['EN', 'JP', 'ES', 'PT', 'IT', 'DE', 'FR'] as const

export const LANGUAGE_LABELS: Record<string, string> = {
  EN: 'Inglés',
  JP: 'Japonés',
  ES: 'Español',
  PT: 'Portugués',
  IT: 'Italiano',
  DE: 'Alemán',
  FR: 'Francés',
}

export const CARD_TYPES = [
  'Común',
  'Poco común',
  'Rara',
  'Ultra Rara',
  'Holo',
  'Reverse Holo',
  'Full Art',
  'Secret Rara',
] as const

export function conditionColor(condition: string | null): string {
  switch (condition) {
    case 'NM':
      return 'bg-emerald-100 text-emerald-700'
    case 'LP':
      return 'bg-sky-100 text-sky-700'
    case 'MP':
      return 'bg-amber-100 text-amber-700'
    case 'HP':
      return 'bg-orange-100 text-orange-700'
    case 'DMG':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-neutral-100 text-neutral-600'
  }
}