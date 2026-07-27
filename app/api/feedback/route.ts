import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(req: Request) {
  const body = await req.json()

  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  const filename = `${jst.getUTCFullYear()}-${p(jst.getUTCMonth() + 1)}-${p(jst.getUTCDate())}-${p(jst.getUTCHours())}${p(jst.getUTCMinutes())}${p(jst.getUTCSeconds())}.json`
  const timestamp = `${jst.getUTCFullYear()}-${p(jst.getUTCMonth() + 1)}-${p(jst.getUTCDate())}T${p(jst.getUTCHours())}:${p(jst.getUTCMinutes())}:${p(jst.getUTCSeconds())}+09:00`

  const payload = {
    version:             body.version ?? 'unknown',
    timestamp,
    rating:              body.rating,
    comment:             body.comment ?? '',
    includeConversation: body.includeConversation ?? false,
    conversation:        body.conversation ?? null,
  }

  try {
    const dir = join(process.cwd(), 'feedback')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, filename), JSON.stringify(payload, null, 2), 'utf-8')
  } catch (err) {
    console.error('feedback write error:', err)
    return Response.json({ ok: false, error: 'save failed' }, { status: 500 })
  }

  return Response.json({ ok: true, filename })
}
