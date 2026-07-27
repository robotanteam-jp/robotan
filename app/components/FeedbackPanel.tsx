'use client'

import { useState } from 'react'
import { type Message, type RobotanState } from '../lib/robotan'

type Rating = 'helpful' | 'neutral' | 'improve'

const RATINGS: { key: Rating; label: string }[] = [
  { key: 'helpful', label: '💛 助かった' },
  { key: 'neutral', label: '🙂 ふつう' },
  { key: 'improve', label: '🛠 改善してほしい' },
]

type Props = {
  messages: Message[]
  state: RobotanState
  mission?: { title: string; tags: string[] }
  version: string
  onDismiss: () => void
}

export default function FeedbackPanel({ messages, state, mission, version, onDismiss }: Props) {
  const [rating, setRating] = useState<Rating | null>(null)
  const [comment, setComment] = useState('')
  const [includeConversation, setIncludeConversation] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submit() {
    if (!rating || sending) return
    setSending(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version,
          rating,
          comment,
          includeConversation,
          conversation: includeConversation
            ? {
                messages,
                state: {
                  status:      state.status,
                  mode:        state.mode,
                  emotion:     state.emotion,
                  zipperState: state.zipperState,
                },
                mission: mission?.title ?? null,
              }
            : null,
        }),
      })
      setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center space-y-2">
        <p className="text-xs text-stone-400 tracking-widest">TRANSMISSION COMPLETE</p>
        <p className="text-sm text-stone-600">受信したでござる。開発者へ届けるでござる。</p>
        <button
          onClick={onDismiss}
          className="text-xs text-stone-400 tracking-widest underline underline-offset-2"
        >
          とじる
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
      <p className="text-xs text-stone-500 tracking-widest">🤖 ロボタンを育てるでござるか？</p>

      <div className="flex gap-2 flex-wrap">
        {RATINGS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRating(key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              rating === key
                ? 'border-amber-400 bg-amber-50 text-amber-600'
                : 'border-stone-200 text-stone-500 hover:border-stone-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {rating && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeConversation}
              onChange={(e) => setIncludeConversation(e.target.checked)}
              className="accent-amber-500"
            />
            この会話も改善のために送る
          </label>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ロボタンへの感想を書いてほしいでござる。"
            rows={3}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 placeholder-stone-300 outline-none focus:border-stone-300 focus:ring-2 focus:ring-stone-100 resize-none transition-all"
          />

          <button
            type="button"
            onClick={submit}
            disabled={sending}
            className="w-full rounded-full bg-stone-800 text-white text-xs tracking-widest py-2.5 transition-opacity disabled:opacity-40"
          >
            {sending ? '送信中...' : '📡 開発者へ送る'}
          </button>
        </div>
      )}
    </div>
  )
}
