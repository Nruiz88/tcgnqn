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

export const DEFAULT_RARITY = {
  border: 'from-neutral-400 to-neutral-500',
  gem: 'bg-neutral-400',
  holo: false,
}

export const CARD_RARITY: Record<
  string,
  { border: string; gem: string; holo: boolean }
> = {
  Común: {
    border: 'from-neutral-300 to-neutral-500',
    gem: 'bg-neutral-400',
    holo: false,
  },
  'Poco común': {
    border: 'from-neutral-200 to-neutral-400',
    gem: 'bg-neutral-200',
    holo: false,
  },
  Rara: {
    border: 'from-sky-400 to-blue-600',
    gem: 'bg-sky-500',
    holo: false,
  },
  'Ultra Rara': {
    border: 'from-amber-300 to-yellow-600',
    gem: 'bg-amber-400',
    holo: true,
  },
  Holo: {
    border: 'from-fuchsia-400 via-sky-400 to-emerald-400',
    gem: 'bg-gradient-to-r from-fuchsia-400 to-sky-400',
    holo: true,
  },
  'Reverse Holo': {
    border: 'from-emerald-400 via-sky-400 to-fuchsia-400',
    gem: 'bg-gradient-to-r from-emerald-400 to-sky-400',
    holo: true,
  },
  'Full Art': {
    border: 'from-violet-400 via-fuchsia-400 to-amber-300',
    gem: 'bg-gradient-to-r from-violet-400 to-amber-300',
    holo: true,
  },
  'Secret Rara': {
    border: 'from-red-500 via-rose-400 to-amber-400',
    gem: 'bg-gradient-to-r from-red-500 to-rose-400',
    holo: true,
  },
}

export function rarityFor(cardType: string | null) {
  return cardType ? CARD_RARITY[cardType] ?? DEFAULT_RARITY : DEFAULT_RARITY
}

export function isCard(p: { category?: { slug?: string | null } | null }) {
  return p.category?.slug === 'cartas'
}