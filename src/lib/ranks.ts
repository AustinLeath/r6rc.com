export type PresetRank = {
  label: string
  value: number
}

export const PRESET_RANKS: readonly PresetRank[] = [
  { label: 'COPPER V', value: 1100 },
  { label: 'COPPER IV', value: 1200 },
  { label: 'COPPER III', value: 1300 },
  { label: 'COPPER II', value: 1400 },
  { label: 'COPPER I', value: 1500 },
  { label: 'BRONZE V', value: 1600 },
  { label: 'BRONZE IV', value: 1700 },
  { label: 'BRONZE III', value: 1800 },
  { label: 'BRONZE II', value: 1900 },
  { label: 'BRONZE I', value: 2000 },
  { label: 'SILVER V', value: 2100 },
  { label: 'SILVER IV', value: 2200 },
  { label: 'SILVER III', value: 2300 },
  { label: 'SILVER II', value: 2400 },
  { label: 'SILVER I', value: 2500 },
  { label: 'GOLD III', value: 2600 },
  { label: 'GOLD II', value: 2800 },
  { label: 'GOLD I', value: 3000 },
  { label: 'PLATINUM III', value: 3200 },
  { label: 'PLATINUM II', value: 3500 },
  { label: 'PLATINUM I', value: 3800 },
  { label: 'DIAMOND III', value: 4100 },
  { label: 'DIAMOND II', value: 4400 },
  { label: 'DIAMOND I', value: 4700 },
  { label: 'CHAMPIONS', value: 5000 },
] as const
