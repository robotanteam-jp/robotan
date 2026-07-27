import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const doc = searchParams.get('doc') ?? 'GETTING_STARTED'

  if (!/^[A-Z0-9_]+$/.test(doc)) {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }

  try {
    const content = await readFile(join(process.cwd(), 'doc', `${doc}.md`), 'utf-8')
    return Response.json({ content })
  } catch {
    return Response.json({ error: 'not found' }, { status: 404 })
  }
}
