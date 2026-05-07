import { describe, expect, it } from 'vitest'
import { calculateRankGoal, validateCalculatorInput } from './calculator'

describe('calculateRankGoal', () => {
  it('returns win direction when goal is above mmr', () => {
    expect(calculateRankGoal({ mmr: '2500', elo: '25', goal: '2600' })).toEqual({
      direction: 'win',
      matches: 4,
    })
  })

  it('returns lose direction when goal is below mmr', () => {
    expect(calculateRankGoal({ mmr: '2600', elo: '25', goal: '2500' })).toEqual({
      direction: 'lose',
      matches: 4,
    })
  })

  it('returns none direction when goal equals mmr', () => {
    expect(calculateRankGoal({ mmr: '2600', elo: '25', goal: '2600' })).toEqual({
      direction: 'none',
      matches: 0,
    })
  })
})

describe('validateCalculatorInput', () => {
  it('validates mmr/elo bounds', () => {
    expect(validateCalculatorInput('preset', { mmr: '1099', elo: '0', goal: '2600' })).toEqual({
      mmr: 'Enter player MMR',
      elo: 'Enter player ELO',
    })
  })

  it('requires preset goal selection', () => {
    expect(validateCalculatorInput('preset', { mmr: '2600', elo: '25', goal: '' })).toEqual({
      goal: 'Select a rank from the dialogue above.',
    })
  })

  it('validates custom goal bounds', () => {
    expect(validateCalculatorInput('custom', { mmr: '2600', elo: '25', goal: '10001' })).toEqual({
      goal: 'Enter a valid Goal',
    })
  })
})
