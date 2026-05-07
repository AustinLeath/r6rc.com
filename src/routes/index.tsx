import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type {
  CalculatorErrors,
  CalculatorInput,
  CalculatorMode,
  CalculatorResult,
} from '../lib/calculator'
import { calculateRankGoal, validateCalculatorInput } from '../lib/calculator'
import { OPERATOR_CUTOUTS } from '../lib/operatorCutouts'
import { PRESET_RANKS } from '../lib/ranks'

export const Route = createFileRoute('/')({ component: Home })

const emptyInput: CalculatorInput = {
  mmr: '',
  elo: '',
  goal: '',
}

const cycleMessages = [
  'Made with heart by Austin Leath',
  'Add the R6RC discord bot to your server!',
  'Take a quick poll about the future mobile version of R6RC.',
]

function Home() {
  const [mode, setMode] = useState<CalculatorMode>('preset')
  const [presetInput, setPresetInput] = useState<CalculatorInput>(emptyInput)
  const [customInput, setCustomInput] = useState<CalculatorInput>(emptyInput)
  const [presetErrors, setPresetErrors] = useState<CalculatorErrors>({})
  const [customErrors, setCustomErrors] = useState<CalculatorErrors>({})
  const [presetResult, setPresetResult] = useState<CalculatorResult | null>(null)
  const [customResult, setCustomResult] = useState<CalculatorResult | null>(null)
  const [cycleIndex, setCycleIndex] = useState(0)
  const [backgroundOperators] = useState(() => pickRandomOperators(4))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % cycleMessages.length)
    }, 9500)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  const activeInput = mode === 'preset' ? presetInput : customInput
  const activeErrors = mode === 'preset' ? presetErrors : customErrors
  const activeResult = mode === 'preset' ? presetResult : customResult

  function switchMode(nextMode: CalculatorMode) {
    if (nextMode === mode) {
      return
    }

    if (nextMode === 'custom') {
      setPresetInput(emptyInput)
      setCustomErrors({})
      setCustomResult(null)
    } else {
      setCustomInput(emptyInput)
      setPresetErrors({})
      setPresetResult(null)
    }

    setMode(nextMode)
  }

  function updateField(field: keyof CalculatorInput, value: string) {
    if (mode === 'preset') {
      setPresetInput((prev) => ({ ...prev, [field]: value }))
      return
    }

    setCustomInput((prev) => ({ ...prev, [field]: value }))
  }

  function onSubmit() {
    const input = activeInput
    const nextErrors = validateCalculatorInput(mode, input)
    const hasErrors = Object.keys(nextErrors).length > 0

    if (mode === 'preset') {
      setPresetErrors(nextErrors)
      setPresetResult(hasErrors ? null : calculateRankGoal(input))
      return
    }

    setCustomErrors(nextErrors)
    setCustomResult(hasErrors ? null : calculateRankGoal(input))
  }

  function onReset() {
    if (mode === 'preset') {
      setPresetInput(emptyInput)
      setPresetErrors({})
      setPresetResult(null)
      return
    }

    setCustomInput(emptyInput)
    setCustomErrors({})
    setCustomResult(null)
  }

  const showResult = activeResult !== null
  const showErrors = Object.keys(activeErrors).length > 0

  return (
    <main className="page-shell">
      {backgroundOperators.map((operator, index) => (
        <div
          key={`${operator.slug}-${index}`}
          className={`operator-bg-layer operator-bg-layer-${index + 1}`}
          style={{ backgroundImage: `url(${operator.file})` }}
          aria-hidden="true"
        />
      ))}
      <section className="page-card">
        <header className="hero">
          <p className="hero-kicker">Rainbow Six Rank Calculator</p>
          <h1>R6RC</h1>
          <p className="hero-subtitle">Now updated for the latest season.</p>
        </header>

        <div className="mode-switch" role="tablist" aria-label="Calculator mode">
          <button
            type="button"
            className={mode === 'preset' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => switchMode('preset')}
          >
            Go To Preset
          </button>
          <button
            type="button"
            className={mode === 'custom' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => switchMode('custom')}
          >
            Go To Custom
          </button>
        </div>

        <form
          className="calculator-form"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <label className="field">
            <span>Current MMR</span>
            <input
              type="number"
              min={1100}
              max={10000}
              placeholder="Enter your current MMR"
              value={activeInput.mmr}
              onChange={(event) => updateField('mmr', event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Current ELO per Match</span>
            <input
              type="number"
              min={1}
              max={500}
              placeholder="Enter your current ELO per match"
              value={activeInput.elo}
              onChange={(event) => updateField('elo', event.target.value)}
              required
            />
          </label>

          {mode === 'preset' ? (
            <label className="field">
              <span>Desired Rank</span>
              <select
                value={activeInput.goal}
                onChange={(event) => updateField('goal', event.target.value)}
                required
              >
                <option value="">Select a desired rank</option>
                {PRESET_RANKS.map((rank) => (
                  <option key={rank.label} value={rank.value}>
                    {rank.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="field">
              <span>Custom MMR Goal</span>
              <input
                type="number"
                min={1100}
                max={10000}
                placeholder="Enter a custom MMR goal"
                value={activeInput.goal}
                onChange={(event) => updateField('goal', event.target.value)}
                required
              />
            </label>
          )}

          <div className="actions">
            <button type="submit" className="action-btn primary">
              Submit
            </button>
            <button type="button" className="action-btn secondary" onClick={onReset}>
              Reset
            </button>
          </div>
        </form>

        {showErrors ? (
          <section className="output errors" aria-live="polite">
            {activeErrors.mmr ? <p>{activeErrors.mmr}</p> : null}
            {activeErrors.elo ? <p>{activeErrors.elo}</p> : null}
            {activeErrors.goal ? <p>{activeErrors.goal}</p> : null}
          </section>
        ) : null}

        {showResult ? (
          <section className="output result" aria-live="polite">
            <p>{renderDirection(activeResult)}</p>
            <p>{renderMatchCount(activeResult)}</p>
          </section>
        ) : null}

        <footer className="meta">
          <p key={cycleIndex} className="cycle-text">
            {renderCycleMessage(cycleIndex)}
          </p>
        </footer>
      </section>
    </main>
  )
}

function pickRandomOperators(count: number) {
  const shuffled = [...OPERATOR_CUTOUTS]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }
  return shuffled.slice(0, count)
}

function renderDirection(result: CalculatorResult): string {
  if (result.direction === 'win') {
    return 'You need to win'
  }
  if (result.direction === 'lose') {
    return 'You need to lose'
  }
  return 'You do not need to win or lose'
}

function renderMatchCount(result: CalculatorResult): string {
  if (result.direction === 'none') {
    return 'any matches to reach your rank goal'
  }

  if (result.matches === 1) {
    return '1 (+/- 1) match to reach your rank goal'
  }

  return `${result.matches} (+/- 1) matches to reach your rank goal`
}

function renderCycleMessage(index: number): JSX.Element {
  if (index === 0) {
    return (
      <>
        Made with heart by{' '}
        <a href="https://austinleath.com" target="_blank" rel="noreferrer">
          Austin Leath
        </a>
      </>
    )
  }

  if (index === 1) {
    return (
      <>
        Add the{' '}
        <a href="https://r6rc.com/discord" target="_blank" rel="noreferrer">
          R6RC discord bot
        </a>{' '}
        to your server!
      </>
    )
  }

  return (
    <>
      Take a quick poll about the future mobile version of R6RC at{' '}
      <a href="https://strawpoll.com/de7sg86a" target="_blank" rel="noreferrer">
        strawpoll.com
      </a>
      .
    </>
  )
}
