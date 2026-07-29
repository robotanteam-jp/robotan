'use client'

import { useEffect, useRef, useState } from 'react'
import { type Message, type RobotanEffect, type RobotanEmotion, type RobotanMode, type RobotanState, type RobotanStatus, type ZipperState, ROBOTAN_VERSION } from '../lib/robotan'
import { debugTurn } from '../lib/debug'
import FeedbackPanel from './FeedbackPanel'
import WelcomeCard from './WelcomeCard'

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'robot',
    text: '起動完了でござる。\n\n今日もへなちょこを保護対象として認識したでござる。\n\n今日の状況を教えてでござる。',
  },
]

const MAX_HISTORY_MESSAGES = 20

const END_SIGNALS = ['ありがとう', 'わかった', 'またね', 'おやすみ', '休む', 'ご飯', '行ってくる', 'バイバイ', 'ばいばい']
const hasEndSignal = (text: string) => END_SIGNALS.some((s) => text.includes(s))

type Props = {
  state: RobotanState
  mission?: { title: string; tags: string[] }
  onEffect?: (effect: RobotanEffect) => void
  logClassName?: string
  inputLocked?: boolean
  slot?: React.ReactNode
  onOpenGuide?: () => void
}

export default function Chat({ state, mission, onEffect, logClassName, inputLocked, slot, onOpenGuide }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [hasInput, setHasInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [welcomeDismissed, setWelcomeDismissed] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    // uncontrolled input — native events only, React never resets DOM value
    const sync = () => setHasInput(el.value.trim().length > 0)
    el.addEventListener('input', sync)
    el.addEventListener('compositionend', sync)
    if (el.offsetParent !== null) el.focus()
    return () => {
      el.removeEventListener('input', sync)
      el.removeEventListener('compositionend', sync)
    }
  }, [])

  useEffect(() => {
    if (!loading && !inputLocked) inputRef.current?.focus()
  }, [loading, inputLocked])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await send()
  }

  async function send() {
    // form submit commits IME first; read directly from DOM
    const text = (inputRef.current?.value ?? '').trim()
    if (!text || loading || inputLocked) return

    const beforeState = { ...state }
    const beforeMission = mission
    const triggerFeedback = hasEndSignal(text)
    const history = messages.slice(-MAX_HISTORY_MESSAGES)
    if (inputRef.current) { inputRef.current.value = ''; setHasInput(false) }
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          context: { status: state.status, lowPowerLock: state.lowPowerLock, mission },
        }),
      })
      const data = await res.json()
      const replyText = res.ok
        ? (data.reply ?? '応答を取得できなかったでござる。')
        : (data.error ?? '通信エラーが発生したでござる。')
      const VALID_STATUSES: RobotanStatus[] = ['ACTIVE', 'NORMAL', 'RECOVERY', 'LOW_POWER', 'SHUTDOWN']
      const status: RobotanStatus | undefined = VALID_STATUSES.includes(data.status) ? (data.status as RobotanStatus) : undefined
      const lowPowerLock: boolean | undefined = typeof data.lowPowerLock === 'boolean' ? data.lowPowerLock : undefined
      const VALID_MODES: RobotanMode[] = ['STANDBY', 'ACTIVE', 'PROTECT']
      const mode = VALID_MODES.includes(data.mode) ? (data.mode as RobotanMode) : undefined
      const VALID_EMOTIONS: RobotanEmotion[] = ['HAPPY', 'NORMAL', 'RELAX', 'WORRIED', 'DETERMINED', 'SLEEPY']
      const emotion: RobotanEmotion | undefined = !res.ok
        ? 'SLEEPY'
        : VALID_EMOTIONS.includes(data.emotion) ? (data.emotion as RobotanEmotion) : undefined
      const VALID_ZIPPER: ZipperState[] = ['CLOSED', 'HALF_OPEN', 'FULL_OPEN']
      const zipperState: ZipperState = !res.ok
        ? 'CLOSED'
        : VALID_ZIPPER.includes(data.zipperState) ? data.zipperState : (state.zipperState ?? 'CLOSED')
      const effect: RobotanEffect = {
        reply: replyText,
        ...(status && { status }),
        ...(lowPowerLock !== undefined && { lowPowerLock }),
        ...((mode || emotion) && { stateDelta: { ...(mode && { mode }), ...(emotion && { emotion }) } }),
        ...(typeof data.powerChange === 'number' && { powerChange: data.powerChange }),
        ...(typeof data.fuelChange  === 'number' && { fuelChange:  data.fuelChange  }),
        zipperState,
        missionCompleted: data.missionCompleted === true,
        ...(data.newMission && { newMission: data.newMission }),
      }
      debugTurn({
        userMessage: text,
        before: {
          status:       beforeState.status,
          mode:         beforeState.mode,
          power:        beforeState.power,
          fuel:         beforeState.fuel,
          missionTitle: beforeMission?.title,
          emotion:      beforeState.emotion,
          zipperState:  beforeState.zipperState,
        },
        llm: {
          status:      data.status,
          mode:        data.mode,
          powerChange: data.powerChange,
          fuelChange:  data.fuelChange,
          newMission:  data.newMission,
          emotion:     data.emotion,
          zipperState: data.zipperState,
        },
        reply: replyText,
      })
      setMessages((prev) => [...prev, { role: 'robot', text: effect.reply }])
      if (triggerFeedback) setShowFeedback(true)
      onEffect?.(effect)
    } catch {
      const errorText = '通信エラーが発生したでござる。'
      setMessages((prev) => [...prev, { role: 'robot', text: errorText }])
      onEffect?.({ reply: errorText, zipperState: 'CLOSED' })
    } finally {
      setLoading(false)
    }
  }

  const hasUserMessages = messages.some((m) => m.role === 'user')

  return (
    <div className="flex flex-col gap-3">
      {!hasUserMessages && !welcomeDismissed && onOpenGuide && (
        <WelcomeCard onOpen={onOpenGuide} onDismiss={() => setWelcomeDismissed(true)} />
      )}

      <div
        className={`rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm space-y-2 overflow-y-auto overscroll-contain ${logClassName ?? 'max-h-44'}`}
      >
        {messages.map((m, i) => (
          <div key={i}>
            {m.role === 'user' ? (
              <div className="text-stone-400">
                <span className="text-stone-300 select-none">&gt; </span>{m.text}
              </div>
            ) : (
              <div className="text-stone-700 whitespace-pre-line">
                <span className="text-amber-500 select-none">🤖 </span>{m.text.replace(/^🤖\s*/, '')}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-stone-400 animate-pulse">
            <span className="text-amber-500 select-none">&gt; </span>🤖 ...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showFeedback && (
        <FeedbackPanel
          messages={messages}
          state={state}
          mission={mission}
          version={ROBOTAN_VERSION}
          onDismiss={() => setShowFeedback(false)}
        />
      )}

      {slot}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          disabled={loading || !!inputLocked}
          ref={inputRef}
          placeholder="今日の状況を教えてでござる。"
          className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!hasInput || loading || !!inputLocked}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-800 text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="送信"
        >
          <span className="text-base leading-none">▶</span>
        </button>
      </form>
    </div>
  )
}
