import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// ── Types ─────────────────────────────────────────────────────────────────────

export type FeedbackPayload = {
  version: string
  timestamp: string
  rating: string
  comment: string
  includeConversation: boolean
  conversation: unknown | null
}

// ── JSON generation (pure — no I/O) ──────────────────────────────────────────

export function createFeedbackJson(
  body: {
    version?: string
    rating: string
    comment?: string
    includeConversation?: boolean
    conversation?: unknown
  },
  now: Date
): FeedbackPayload {
  const p = (n: number) => String(n).padStart(2, '0')
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const timestamp =
    `${jst.getUTCFullYear()}-${p(jst.getUTCMonth() + 1)}-${p(jst.getUTCDate())}` +
    `T${p(jst.getUTCHours())}:${p(jst.getUTCMinutes())}:${p(jst.getUTCSeconds())}+09:00`

  return {
    version:             body.version ?? 'unknown',
    timestamp,
    rating:              body.rating,
    comment:             body.comment ?? '',
    includeConversation: body.includeConversation ?? false,
    conversation:        body.conversation ?? null,
  }
}

// ── Save implementation (swap this for DB in future) ─────────────────────────

async function saveFeedback(payload: FeedbackPayload, now: Date): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return

  const p = (n: number) => String(n).padStart(2, '0')
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const filename =
    `${jst.getUTCFullYear()}-${p(jst.getUTCMonth() + 1)}-${p(jst.getUTCDate())}` +
    `-${p(jst.getUTCHours())}${p(jst.getUTCMinutes())}${p(jst.getUTCSeconds())}.json`

  const dir = join(process.cwd(), 'feedback')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), JSON.stringify(payload, null, 2), 'utf-8')
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json()
  const now = new Date()

  const payload = createFeedbackJson(body, now)

  try {
    await saveFeedback(payload, now)
  } catch (err) {
    console.error('feedback save error:', err)
    return Response.json({ ok: false, error: 'save failed' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
