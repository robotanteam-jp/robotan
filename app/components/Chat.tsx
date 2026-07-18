'use client'

import { useEffect, useRef, useState } from 'react'
import { getRobotanEffect, type Message, type RobotanEffect, type RobotanState } from '../lib/robotan'

const INITIAL_MESSAGES: Message[] = [
  { role: 'user', text: '今日もよろしく、ロボタン。' },
  { role: 'robot', text: '🤖 起動したでござる。へなちょこを保護対象として認識したでござる。今日の任務を開始するでござる。' },
]

type Props = {
  state: RobotanState
  onEffect?: (effect: RobotanEffect) => void
}

export default function Chat({ state, onEffect }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text) return
    const effect = getRobotanEffect(text, state)
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      { role: 'robot', text: effect.reply },
    ])
    onEffect?.(effect)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) send()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm space-y-1 max-h-60 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i}>
            {m.role === 'user' ? (
              <div className="text-stone-400">
                <span className="text-stone-300 select-none">&gt; </span>{m.text}
              </div>
            ) : (
              <div className="text-stone-700">
                <span className="text-amber-500 select-none">&gt; </span>{m.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="今日の状況を教えてでございます。"
          className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all"
        />
        <button
          type="button"
          onClick={send}
          disabled={!input.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-800 text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="送信"
        >
          <span className="text-base leading-none">▶</span>
        </button>
      </div>
    </div>
  )
}
