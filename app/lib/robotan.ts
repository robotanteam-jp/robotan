export type Message = {
  role: 'user' | 'robot'
  text: string
}

export type RobotanMode = 'STANDBY' | 'ACTIVE' | 'PROTECT'

export type RobotanStatus = 'ACTIVE' | 'NORMAL' | 'RECOVERY' | 'LOW_POWER' | 'SHUTDOWN'

export function getStatus(power: number, fuel: number): RobotanStatus {
  if (power <= 10 || fuel <= 5)  return 'SHUTDOWN'
  if (power <= 30 || fuel <= 20) return 'LOW_POWER'
  if (power <= 60 || fuel <= 40) return 'RECOVERY'
  if (power <= 85 || fuel <= 70) return 'NORMAL'
  return 'ACTIVE'
}

export type RobotanEmotion = 'HAPPY' | 'NORMAL' | 'BLINK' | 'RELAX' | 'WORRIED' | 'DETERMINED' | 'SLEEPY'

export const EMOTION_IMAGE: Record<RobotanEmotion, string> = {
  HAPPY:      '/robotan/robotan-happy.png',
  NORMAL:     '/robotan/robotan-normal.png',
  BLINK:      '/robotan/robotan-blink.png',
  RELAX:      '/robotan/robotan-smile.png',
  WORRIED:    '/robotan/robotan-worried.png',
  DETERMINED: '/robotan/robotan-protect.png',
  SLEEPY:     '/robotan/robotan-sleep.png',
}

export type ZipperState = 'CLOSED' | 'HALF_OPEN' | 'FULL_OPEN'

export type Mission = {
  title: string
  completed: boolean
  tags: string[]
}

export type RobotanState = {
  power: number
  fuel: number
  status: RobotanStatus
  lowPowerLock: boolean
  mode: RobotanMode
  emotion: RobotanEmotion
  zipperState: ZipperState
}

export type RobotanEffect = {
  reply: string
  status?: RobotanStatus
  lowPowerLock?: boolean
  stateDelta?: Partial<RobotanState>
  powerChange?: number
  fuelChange?: number
  zipperState?: ZipperState
  missionCompleted?: boolean
  newMission?: { title: string; tags: string[] } | null
}

export const INITIAL_MISSION: Mission = {
  title: '今日の様子を教えてください',
  completed: false,
  tags: ['見守り', '待機', '会話'],
}

export const INITIAL_FUEL = 62
export const INITIAL_POWER = 87
export const INITIAL_STATE: RobotanState = {
  power: INITIAL_POWER,
  fuel: INITIAL_FUEL,
  status: getStatus(INITIAL_POWER, INITIAL_FUEL),
  lowPowerLock: false,
  mode: 'STANDBY',
  emotion: 'NORMAL',
  zipperState: 'CLOSED',
}

// Replace this function with an LLM call when ready.
// Return stateDelta alongside the reply to drive UI state changes.
export function getRobotanEffect(input: string, state: RobotanState): RobotanEffect {
  const t = input.trim()
  if (t.includes('おはよう')) return { reply: '起動完了でござる。本日も保護任務を開始するでござる。' }
  if (t.includes('疲れた')) return { reply: '出力を少し下げるでござる。', stateDelta: { power: Math.max(0, state.power - 8) } }
  if (t.includes('不安')) return { reply: '焦りを検知。Protect Modeへ移行するでござる。', stateDelta: { mode: 'PROTECT' } }
  if (t.includes('ありがとう')) return { reply: '任務継続でござる。' }
  return { reply: '受信したでござる。' }
}
