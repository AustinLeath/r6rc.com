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

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const Route = createFileRoute('/')({ component: Home })

const emptyInput: CalculatorInput = {
  mmr: '',
  elo: '',
  goal: '',
}

const cycleMessages = [
  'Made with love by Austin Leath',
  'Add the R6RC discord bot to your server!',
  'Take a quick poll about the future mobile version of R6RC.',
]

const FAQ_ITEMS = [
  {
    question: 'How does the R6RC rank calculator work?',
    answer:
      'R6RC compares your current MMR to your target MMR and divides the difference by your average ELO change per match.',
  },
  {
    question: 'Can I use custom MMR goals?',
    answer: 'Yes. Custom mode supports any target between 1100 and 10000 MMR.',
  },
  {
    question: 'Why is there a plus/minus one match margin?',
    answer:
      'Match-to-match ELO changes can vary, so R6RC includes a small margin of error in match count messaging.',
  },
  {
    question: 'Can I share my exact calculation with friends?',
    answer:
      'Yes. After submitting, use the Copy share link button to generate a URL that includes your mode and input values.',
  },
  {
    question: 'Does this tool support both preset ranks and custom goals?',
    answer: 'Yes. Preset mode uses rank tier thresholds and Custom mode supports direct MMR targets.',
  },
] as const

const OPERATOR_LAYER_COUNT = 4
const OPERATOR_ROTATE_INTERVAL_MS = 10000
const OPERATOR_STAGGER_MS = 850
const OPERATOR_FADE_MS = 420

type InitialState = {
  mode: CalculatorMode
  presetInput: CalculatorInput
  customInput: CalculatorInput
}

function Home() {
  const [mode, setMode] = useState<CalculatorMode>(() => getInitialState().mode)
  const [presetInput, setPresetInput] = useState<CalculatorInput>(
    () => getInitialState().presetInput,
  )
  const [customInput, setCustomInput] = useState<CalculatorInput>(
    () => getInitialState().customInput,
  )
  const [presetErrors, setPresetErrors] = useState<CalculatorErrors>({})
  const [customErrors, setCustomErrors] = useState<CalculatorErrors>({})
  const [presetResult, setPresetResult] = useState<CalculatorResult | null>(null)
  const [customResult, setCustomResult] = useState<CalculatorResult | null>(null)
  const [cycleIndex, setCycleIndex] = useState(0)
  const [backgroundOperators, setBackgroundOperators] = useState(() =>
    pickRandomOperators(OPERATOR_LAYER_COUNT),
  )
  const [fadingLayers, setFadingLayers] = useState<boolean[]>(() =>
    Array(OPERATOR_LAYER_COUNT).fill(false),
  )
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % cycleMessages.length)
    }, 9500)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const timers: number[] = []

    const runStaggeredOperatorRefresh = () => {
      const order = shuffleIndices(OPERATOR_LAYER_COUNT)

      order.forEach((layerIndex, sequenceIndex) => {
        const fadeStartTimer = window.setTimeout(() => {
          setFadingLayers((prev) =>
            prev.map((value, index) => (index === layerIndex ? true : value)),
          )

          const swapTimer = window.setTimeout(() => {
            setBackgroundOperators((prev) => {
              const reserved = new Set(
                prev
                  .map((operator, index) => (index === layerIndex ? '' : operator.slug))
                  .filter(Boolean),
              )

              const next = pickReplacementOperator(reserved, prev[layerIndex]?.slug ?? '')
              const updated = [...prev]
              updated[layerIndex] = next
              return updated
            })

            setFadingLayers((prev) =>
              prev.map((value, index) => (index === layerIndex ? false : value)),
            )
          }, OPERATOR_FADE_MS)

          timers.push(swapTimer)
        }, sequenceIndex * OPERATOR_STAGGER_MS)

        timers.push(fadeStartTimer)
      })
    }

    const interval = window.setInterval(() => {
      runStaggeredOperatorRefresh()
    }, OPERATOR_ROTATE_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
      timers.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [])

  const activeInput = mode === 'preset' ? presetInput : customInput
  const activeErrors = mode === 'preset' ? presetErrors : customErrors
  const activeResult = mode === 'preset' ? presetResult : customResult

  function switchMode(nextMode: CalculatorMode) {
    if (nextMode === mode) {
      return
    }

    trackEvent('mode_switch', { mode: nextMode })
    setShareMessage('')

    if (nextMode === 'custom') {
      setPresetInput(emptyInput)
      setCustomErrors({})
      setCustomResult(null)
      syncUrl(nextMode, customInput)
    } else {
      setCustomInput(emptyInput)
      setPresetErrors({})
      setPresetResult(null)
      syncUrl(nextMode, presetInput)
    }

    setMode(nextMode)
  }

  function updateField(field: keyof CalculatorInput, value: string) {
    setShareMessage('')

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
      if (hasErrors) {
        setPresetResult(null)
        return
      }

      const result = calculateRankGoal(input)
      setPresetResult(result)
      syncUrl(mode, input)
      trackEvent('calculator_submit', {
        mode,
        direction: result.direction,
        matches: result.matches,
      })
      return
    }

    setCustomErrors(nextErrors)
    if (hasErrors) {
      setCustomResult(null)
      return
    }

    const result = calculateRankGoal(input)
    setCustomResult(result)
    syncUrl(mode, input)
    trackEvent('calculator_submit', {
      mode,
      direction: result.direction,
      matches: result.matches,
    })
  }

  function onReset() {
    setShareMessage('')

    if (mode === 'preset') {
      setPresetInput(emptyInput)
      setPresetErrors({})
      setPresetResult(null)
      syncUrl(mode, emptyInput)
      return
    }

    setCustomInput(emptyInput)
    setCustomErrors({})
    setCustomResult(null)
    syncUrl(mode, emptyInput)
  }

  async function copyShareLink() {
    if (typeof window === 'undefined') {
      return
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareMessage('Share link copied.')
      trackEvent('share_link_copy', { mode })
    } catch {
      setShareMessage('Unable to copy link. Please copy the URL manually.')
    }
  }

  const showResult = activeResult !== null
  const showErrors = Object.keys(activeErrors).length > 0

  return (
    <main className="page-shell">
      {backgroundOperators.map((operator, index) => (
        <div
          key={`${operator.slug}-${index}`}
          className={`operator-bg-layer operator-bg-layer-${index + 1}${fadingLayers[index] ? ' is-fading' : ''}`}
          style={{ backgroundImage: `url(${operator.file})` }}
          aria-hidden="true"
        />
      ))}
      <section className="page-card">
        <header className="hero">
          <img className="hero-logo" src="/logo.png" alt="R6RC logo" />
          <p className="hero-kicker">Rainbow Six Rank Calculator</p>
          <h1>R6RC</h1>
          <p className="hero-subtitle">Now updated for the latest season!</p>
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
            <div className="share-row">
              <button type="button" className="action-btn secondary" onClick={copyShareLink}>
                Copy share link
              </button>
              {shareMessage ? <span className="share-feedback">{shareMessage}</span> : null}
            </div>
          </section>
        ) : null}

        <footer className="meta">
          <p key={cycleIndex} className="cycle-text">
            {renderCycleMessage(cycleIndex)}
          </p>
        </footer>
      </section>

      <section className="seo-card" aria-label="R6RC guide">
        <div className="seo-content">
          <h2>How R6RC Works</h2>
          <p>
            R6RC is a Rainbow Six Siege rank calculator that estimates how many matches you need
            to reach a specific MMR target based on your current rating and typical ELO change.
          </p>

          <h3>Rank Thresholds</h3>
          <p>
            Preset mode uses fixed rank thresholds from the current R6RC release. Custom mode lets
            you set any MMR target between 1100 and 10000.
          </p>

          <h3>FAQ</h3>
          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    trackEvent('faq_expand', { question: item.question })
                  }
                }}
              >
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function getInitialState(): InitialState {
  if (typeof window === 'undefined') {
    return {
      mode: 'preset',
      presetInput: emptyInput,
      customInput: emptyInput,
    }
  }

  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode') === 'custom' ? 'custom' : 'preset'
  const candidate: CalculatorInput = {
    mmr: sanitizeNumeric(params.get('mmr')),
    elo: sanitizeNumeric(params.get('elo')),
    goal: sanitizeNumeric(params.get('goal')),
  }

  return {
    mode,
    presetInput: mode === 'preset' ? candidate : emptyInput,
    customInput: mode === 'custom' ? candidate : emptyInput,
  }
}

function sanitizeNumeric(value: string | null): string {
  if (!value) {
    return ''
  }

  const trimmed = value.trim()
  return /^-?\d+(\.\d+)?$/.test(trimmed) ? trimmed : ''
}

function syncUrl(mode: CalculatorMode, input: CalculatorInput) {
  if (typeof window === 'undefined') {
    return
  }

  const params = new URLSearchParams()
  params.set('mode', mode)

  if (input.mmr) {
    params.set('mmr', input.mmr)
  }
  if (input.elo) {
    params.set('elo', input.elo)
  }
  if (input.goal) {
    params.set('goal', input.goal)
  }

  const nextUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState(null, '', nextUrl)
}

function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
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

function shuffleIndices(count: number) {
  const values = Array.from({ length: count }, (_, index) => index)
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = values[index]
    values[index] = values[swapIndex]
    values[swapIndex] = current
  }
  return values
}

function pickReplacementOperator(reservedSlugs: Set<string>, currentSlug: string) {
  const candidates = OPERATOR_CUTOUTS.filter(
    (operator) => operator.slug !== currentSlug && !reservedSlugs.has(operator.slug),
  )

  if (candidates.length === 0) {
    const fallback = OPERATOR_CUTOUTS.filter((operator) => operator.slug !== currentSlug)
    return fallback[Math.floor(Math.random() * fallback.length)] ?? OPERATOR_CUTOUTS[0]
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
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
        Made with love by{' '}
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
