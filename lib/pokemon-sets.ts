export type PokemonSet = {
  code: string
  name: string
}

export type SetEra = {
  era: string
  sets: PokemonSet[]
}

export const POKEMON_ERAS: SetEra[] = [
  {
    era: 'Mega Evolution (ME)',
    sets: [
      { code: 'ME05', name: 'Pitch Black' },
      { code: 'ME04', name: 'Chaos Rising' },
      { code: 'ME03', name: 'Perfect Order' },
      { code: 'ME02', name: 'Ascended Heroes' },
      { code: 'ME01', name: 'Phantasmal Flames' },
    ],
  },
  {
    era: 'Scarlet & Violet (SV)',
    sets: [
      { code: 'SV8a', name: 'Prismatic Evolutions' },
      { code: 'SV8', name: 'Surging Sparks' },
      { code: 'SV7', name: 'Stellar Crown' },
      { code: 'SV6.5', name: 'Shrouded Fable' },
      { code: 'SV6', name: 'Twilight Masquerade' },
      { code: 'SV5', name: 'Temporal Forces' },
      { code: 'SV4.5', name: 'Paldean Fates' },
      { code: 'SV4', name: 'Paradox Rift' },
      { code: 'SV3.5', name: '151' },
      { code: 'SV3', name: 'Obsidian Flames' },
      { code: 'SV2', name: 'Paldea Evolved' },
      { code: 'SV1', name: 'Scarlet & Violet' },
    ],
  },
  {
    era: 'Sword & Shield (SWSH)',
    sets: [
      { code: 'SWSH12.5', name: 'Crown Zenith' },
      { code: 'SWSH12', name: 'Silver Tempest' },
      { code: 'SWSH11', name: 'Lost Origin' },
      { code: 'SWSH10.5', name: 'Pokémon GO' },
      { code: 'SWSH10', name: 'Astral Radiance' },
      { code: 'SWSH09', name: 'Brilliant Stars' },
      { code: 'SWSH08', name: 'Fusion Strike' },
      { code: 'SWSH07.5', name: 'Celebrations' },
      { code: 'SWSH07', name: 'Evolving Skies' },
      { code: 'SWSH06', name: 'Chilling Reign' },
      { code: 'SWSH05', name: 'Battle Styles' },
      { code: 'SWSH04.5', name: 'Shining Fates' },
      { code: 'SWSH04', name: 'Vivid Voltage' },
      { code: 'SWSH03.5', name: "Champion's Path" },
      { code: 'SWSH03', name: 'Darkness Ablaze' },
      { code: 'SWSH02', name: 'Rebel Clash' },
      { code: 'SWSH01', name: 'Sword & Shield' },
    ],
  },
  {
    era: 'Sun & Moon (SM)',
    sets: [
      { code: 'SM12', name: 'Cosmic Eclipse' },
      { code: 'SM11.5', name: 'Hidden Fates' },
      { code: 'SM11', name: 'Unified Minds' },
      { code: 'SM10', name: 'Unbroken Bonds' },
      { code: 'SM09', name: 'Team Up' },
      { code: 'SM08', name: 'Lost Thunder' },
      { code: 'SM07.5', name: 'Dragon Majesty' },
      { code: 'SM07', name: 'Celestial Storm' },
      { code: 'SM06', name: 'Forbidden Light' },
      { code: 'SM05', name: 'Ultra Prism' },
      { code: 'SM04', name: 'Crimson Invasion' },
      { code: 'SM03.5', name: 'Shining Legends' },
      { code: 'SM03', name: 'Burning Shadows' },
      { code: 'SM02', name: 'Guardians Rising' },
      { code: 'SM01', name: 'Sun & Moon' },
    ],
  },
  {
    era: 'XY',
    sets: [
      { code: 'XY12', name: 'Evolutions' },
      { code: 'XY11', name: 'Steam Siege' },
      { code: 'XY10', name: 'Fates Collide' },
      { code: 'XY09', name: 'BREAKpoint' },
      { code: 'XY08.5', name: 'Generations' },
      { code: 'XY08', name: 'BREAKthrough' },
      { code: 'XY07', name: 'Ancient Origins' },
      { code: 'XY06', name: 'Roaring Skies' },
      { code: 'XY05', name: 'Primal Clash' },
      { code: 'XY04', name: 'Phantom Forces' },
      { code: 'XY03', name: 'Furious Fists' },
      { code: 'XY02', name: 'Flashfire' },
      { code: 'XY01', name: 'XY' },
    ],
  },
  {
    era: 'Black & White (BW)',
    sets: [
      { code: 'BW11', name: 'Legendary Treasures' },
      { code: 'BW10', name: 'Plasma Blast' },
      { code: 'BW09', name: 'Plasma Freeze' },
      { code: 'BW08', name: 'Plasma Storm' },
      { code: 'BW07', name: 'Boundaries Crossed' },
      { code: 'BW06', name: 'Dragons Exalted' },
      { code: 'BW05', name: 'Dark Explorers' },
      { code: 'BW04', name: 'Next Destinies' },
      { code: 'BW03', name: 'Noble Victories' },
      { code: 'BW02', name: 'Emerging Powers' },
      { code: 'BW01', name: 'Black & White' },
    ],
  },
  {
    era: 'HeartGold & SoulSilver (HGSS)',
    sets: [
      { code: 'HGSS04', name: 'Triumphant' },
      { code: 'HGSS03', name: 'Undaunted' },
      { code: 'HGSS02', name: 'Unleashed' },
      { code: 'HGSS01', name: 'HeartGold & SoulSilver' },
    ],
  },
  {
    era: 'Platinum (PL)',
    sets: [
      { code: 'PL04', name: 'Arceus' },
      { code: 'PL03', name: 'Supreme Victors' },
      { code: 'PL02', name: 'Rising Rivals' },
      { code: 'PL01', name: 'Platinum' },
    ],
  },
  {
    era: 'Diamond & Pearl (DP)',
    sets: [
      { code: 'DP07', name: 'Stormfront' },
      { code: 'DP06', name: 'Legends Awakened' },
      { code: 'DP05', name: 'Majestic Dawn' },
      { code: 'DP04', name: 'Great Encounters' },
      { code: 'DP03', name: 'Secret Wonders' },
      { code: 'DP02', name: 'Mysterious Treasures' },
      { code: 'DP01', name: 'Diamond & Pearl' },
    ],
  },
  {
    era: 'EX · Ruby & Sapphire',
    sets: [
      { code: 'EX16', name: 'Power Keepers' },
      { code: 'EX15', name: 'Dragon Frontiers' },
      { code: 'EX14', name: 'Holon Phantoms' },
      { code: 'EX13', name: 'Legend Maker' },
      { code: 'EX12', name: 'Delta Species' },
      { code: 'EX11', name: 'Unseen Forces' },
      { code: 'EX10', name: 'Emerald' },
      { code: 'EX09', name: 'Deoxys' },
      { code: 'EX08', name: 'Team Rocket Returns' },
      { code: 'EX07', name: 'FireRed & LeafGreen' },
      { code: 'EX06', name: 'Hidden Legends' },
      { code: 'EX05', name: 'Team Magma vs Team Aqua' },
      { code: 'EX04', name: 'Dragon' },
      { code: 'EX03', name: 'Sandstorm' },
      { code: 'EX02', name: 'Ruby & Sapphire' },
    ],
  },
  {
    era: 'e-Series',
    sets: [
      { code: 'E3', name: 'Skyridge' },
      { code: 'E2', name: 'Aquapolis' },
      { code: 'E1', name: 'Expedition' },
    ],
  },
  {
    era: 'Neo',
    sets: [
      { code: 'NEO4', name: 'Neo Destiny' },
      { code: 'NEO3', name: 'Neo Revelation' },
      { code: 'NEO2', name: 'Neo Discovery' },
      { code: 'NEO1', name: 'Neo Genesis' },
    ],
  },
  {
    era: 'Classic (WOTC)',
    sets: [
      { code: 'WOTC07', name: 'Gym Challenge' },
      { code: 'WOTC06', name: 'Gym Heroes' },
      { code: 'WOTC05', name: 'Team Rocket' },
      { code: 'WOTC04', name: 'Base Set 2' },
      { code: 'WOTC03', name: 'Fossil' },
      { code: 'WOTC02', name: 'Jungle' },
      { code: 'WOTC01', name: 'Base Set' },
    ],
  },
]

export const ALL_POKEMON_SETS: PokemonSet[] = POKEMON_ERAS.flatMap(
  (e) => e.sets,
)

const byCode = new Map(ALL_POKEMON_SETS.map((s) => [s.code, s]))

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function findPokemonSet(name: string | null | undefined): PokemonSet | null {
  if (!name) return null
  const n = norm(name)
  for (const s of ALL_POKEMON_SETS) {
    if (norm(s.code) === n || n === norm(s.code)) return s
    if (n.includes(norm(s.name))) return s
  }
  return null
}

export function pokemonSetByCode(code: string): PokemonSet | undefined {
  return byCode.get(code)
}

export function isPokemonSetKey(key: string): boolean {
  return byCode.has(key)
}