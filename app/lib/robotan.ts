export type Message = {
  role: 'user' | 'robot'
  text: string
}

export type RobotanMode = 'STANDBY' | 'ACTIVE' | 'PROTECT'

export type RobotanStatus = 'ACTIVE' | 'NORMAL' | 'RECOVERY' | 'LOW_POWER' | 'SHUTDOWN'

export const STATUS_THRESHOLDS = {
  SHUTDOWN:  5,
  LOW_POWER: 30,
  RECOVERY:  50,  // LOW_POWER(30) + 20
  NORMAL:    80,
} as const

export function getStatus(fuel: number): RobotanStatus {
  if (fuel <= STATUS_THRESHOLDS.SHUTDOWN)  return 'SHUTDOWN'
  if (fuel <= STATUS_THRESHOLDS.LOW_POWER) return 'LOW_POWER'
  if (fuel <= STATUS_THRESHOLDS.RECOVERY)  return 'RECOVERY'
  if (fuel <= STATUS_THRESHOLDS.NORMAL)    return 'NORMAL'
  return 'ACTIVE'
}

export type RobotanEmotion = 'HAPPY' | 'NORMAL' | 'RELAX' | 'WORRIED' | 'DETERMINED' | 'SLEEPY'

export const EMOTION_IMAGE: Record<RobotanEmotion, string> = {
  HAPPY:      '/robotan/robotan-happy.png',
  NORMAL:     '/robotan/robotan-normal.png',
  RELAX:      '/robotan/robotan-smile.png',
  WORRIED:    '/robotan/robotan-worried.png',
  DETERMINED: '/robotan/robotan-protect.png',
  SLEEPY:     '/robotan/robotan-sleep.png',
}

export type RobotanState = {
  power: number
  fuel: number
  status: RobotanStatus
  mode: RobotanMode
  emotion: RobotanEmotion
}

export type RobotanEffect = {
  reply: string
  stateDelta?: Partial<RobotanState>
}

export const INITIAL_FUEL = 62
export const INITIAL_STATE: RobotanState = {
  power: 87,
  fuel: INITIAL_FUEL,
  status: getStatus(INITIAL_FUEL),
  mode: 'STANDBY',
  emotion: 'NORMAL',
}

// Replace this function with an LLM call when ready.
// Return stateDelta alongside the reply to drive UI state changes.
export function getRobotanEffect(input: string, state: RobotanState): RobotanEffect {
  const t = input.trim()
  if (t.includes('おはよう')) return { reply: '🤖 おはようございます。本日も保護任務を開始するでござる。' }
  if (t.includes('疲れた')) return { reply: '🤖 出力を少し下げるでござる。', stateDelta: { power: Math.max(0, state.power - 8) } }
  if (t.includes('不安')) return { reply: '🤖 焦りを検知。Protect Modeへ移行するでござる。', stateDelta: { mode: 'PROTECT' } }
  if (t.includes('ありがとう')) return { reply: '🤖 任務継続でござる。' }
  return { reply: '🤖 受信したでござる。' }
}
