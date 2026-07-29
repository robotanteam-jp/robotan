'use client'

type Props = {
  onOpen: () => void
  onDismiss?: () => void
}

export default function WelcomeCard({ onOpen, onDismiss }: Props) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3 text-center relative">
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 text-stone-300 hover:text-stone-400 transition-colors leading-none"
          aria-label="閉じる"
        >
          ✕
        </button>
      )}
      <p className="text-xs text-stone-400 tracking-widest">🤖 はじめてのロボタン</p>
      <div className="space-y-1 text-sm text-stone-600 leading-relaxed">
        <p>ロボタンは</p>
        <p className="text-stone-800 font-semibold">「頑張らせるAI」ではありません。</p>
        <p className="mt-2">「今日を安全に終える」</p>
        <p>そのお手伝いをする相棒です。</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="text-xs px-4 py-2 rounded-full border border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors"
      >
        📖 はじめて使う
      </button>
    </div>
  )
}
