'use client'

import { useState } from 'react'

export default function ChatInput() {
  const [message, setMessage] = useState('')

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="今日の状況を教えてでござる。"
        className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all"
      />
      <button
        type="button"
        disabled
        className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-800 text-white opacity-40 cursor-not-allowed transition-opacity"
        aria-label="送信"
      >
        <span className="text-base leading-none">▶</span>
      </button>
    </div>
  )
}
