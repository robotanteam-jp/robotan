'use client'

import { useEffect, useRef, useState } from 'react'
import { type Message, type RobotanEffect, type RobotanEmotion, type RobotanMode, type RobotanState, type RobotanStatus, type ZipperState } from '../lib/robotan'

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'robot',
    text: '起動完了でござる。\n\n今日もへなちょこを保護対象として認識したでござる。\n\n今日の状況を教えてでござる。',
  },
]

const MAX_HISTORY_MESSAGES = 20

type Props = {
  state: RobotanState
  mission?: { title: string; tags: string[] }
  onEffect?: (effect: RobotanEffect) => void
  logClassName?: string
  inputLocked?: boolean
  slot?: React.ReactNode
}

export default function Chat({ state, mission, onEffect, logClassName, inputLocked, slot }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (input && input.offsetParent !== null) {
      input.focus()
    }
  }, [])

  useEffect(() => {
    if (!loading && !inputLocked) {
      inputRef.current?.focus()
    }
  }, [loading, inputLocked])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading || inputLocked) return

    const history = messages.slice(-MAX_HISTORY_MESSAGES)
    setInput('')
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
      setMessages((prev) => [...prev, { role: 'robot', text: effect.reply }])
      onEffect?.(effect)
    } catch {
      const errorText = '通信エラーが発生したでござる。'
      setMessages((prev) => [...prev, { role: 'robot', text: errorText }])
      onEffect?.({ reply: errorText, zipperState: 'CLOSED' })
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) send()
  }

  return (
    <div className="flex flex-col gap-3">
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

      {slot}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || !!inputLocked}
          ref={inputRef}
          autoFocus
          placeholder="今日の状況を教えてでござる。"
          className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all disabled:opacity-50"
        />
        <button
          type="button"
          onClick={send}
          disabled={!input.trim() || loading || !!inputLocked}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-800 text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="送信"
        >
          <span className="text-base leading-none">▶</span>
        </button>
      </div>
    </div>
  )
}
