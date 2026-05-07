export type CalculatorMode = 'preset' | 'custom'

export type CalculatorDirection = 'win' | 'lose' | 'none'

export type CalculatorResult = {
  direction: CalculatorDirection
  matches: number
}

export type CalculatorErrors = {
  mmr?: string
  elo?: string
  goal?: string
}

export type CalculatorInput = {
  mmr: string
  elo: string
  goal: string
}

const MMR_MIN = 1100
const MMR_MAX = 10000
const ELO_MIN = 1
const ELO_MAX = 500
const GOAL_MIN = 1100
const GOAL_MAX = 10000

function toNumber(value: string): number {
  return Number(value)
}

export function validateCalculatorInput(
  mode: CalculatorMode,
  input: CalculatorInput,
): CalculatorErrors {
  const errors: CalculatorErrors = {}
  const mmr = toNumber(input.mmr)
  const elo = toNumber(input.elo)
  const goal = toNumber(input.goal)

  if (!Number.isFinite(mmr) || mmr < MMR_MIN) {
    errors.mmr = 'Enter player MMR'
  } else if (mmr > MMR_MAX) {
    errors.mmr = 'Enter a valid MMR'
  }

  if (!Number.isFinite(elo) || elo < ELO_MIN) {
    errors.elo = 'Enter player ELO'
  } else if (elo > ELO_MAX) {
    errors.elo = 'Enter a valid ELO'
  }

  if (mode === 'preset') {
    if (input.goal.trim() === '') {
      errors.goal = 'Select a rank from the dialogue above.'
    }
  } else if (!Number.isFinite(goal) || goal < GOAL_MIN) {
    errors.goal = 'Select a rank from the dialogue above.'
  } else if (goal > GOAL_MAX) {
    errors.goal = 'Enter a valid Goal'
  }

  return errors
}

export function calculateRankGoal(input: CalculatorInput): CalculatorResult {
  const mmr = toNumber(input.mmr)
  const elo = toNumber(input.elo)
  const goal = toNumber(input.goal)

  const rounded = Math.ceil((goal - mmr) / elo)
  const matches = Math.abs(rounded)

  if (rounded > 0) {
    return { direction: 'win', matches }
  }

  if (rounded < 0) {
    return { direction: 'lose', matches }
  }

  return { direction: 'none', matches }
}
