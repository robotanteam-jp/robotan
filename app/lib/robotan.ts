export type Message = {
  role: 'user' | 'robot'
  text: string
}

export type RobotanMode = 'STANDBY' | 'ACTIVE' | 'PROTECT'

export type RobotanState = {
  power: number
  fuel: number
  mode: RobotanMode
}

export type RobotanEffect = {
  reply: string
  stateDelta?: Partial<RobotanState>
}

export const INITIAL_STATE: RobotanState = { power: 87, fuel: 62, mode: 'ACTIVE' }

// Replace this function with an LLM call when ready.
// Return stateDelta alongside the reply to drive UI state changes.
export function getRobotanEffect(input: string, state: RobotanState): RobotanEffect {
  const t = input.trim()
  if (t.includes('おはよう')) return { reply: 'おはようございます。本日も保護任務を開始するでござる。' }
  if (t.includes('疲れた')) return { reply: '出力を少し下げるでござる。', stateDelta: { power: Math.max(0, state.power - 8) } }
  if (t.includes('不安')) return { reply: '焦りを検知。Protect Modeへ移行するでござる。', stateDelta: { mode: 'PROTECT' } }
  if (t.includes('ありがとう')) return { reply: '任務継続でござる。' }
  return { reply: '受信したでござる。' }
}
