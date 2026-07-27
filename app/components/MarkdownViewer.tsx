'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Props = {
  doc: string
  onClose: () => void
}

export default function MarkdownViewer({ doc, onClose }: Props) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setContent(null)
    setError(false)
    fetch(`/api/guide?doc=${encodeURIComponent(doc)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.content) setContent(data.content)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [doc])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 shrink-0">
          <span className="text-xs text-stone-400 tracking-widest">📖 GUIDE</span>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-stone-400 transition-colors"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 flex-1">
          {!content && !error && (
            <p className="text-sm text-stone-300 animate-pulse">読み込み中でござる...</p>
          )}
          {error && (
            <p className="text-sm text-stone-400">読み込めなかったでござる。</p>
          )}
          {content && (
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold text-stone-800 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-bold text-stone-600 tracking-wide mt-6 mb-2">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-stone-700 leading-relaxed mb-2">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-stone-800">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1.5 pl-4 mb-2">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-sm text-stone-600 list-disc leading-relaxed">{children}</li>
                ),
                hr: () => <hr className="border-stone-100 my-4" />,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}
