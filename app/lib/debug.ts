const SESSION = Math.random().toString(36).slice(2, 8).toUpperCase()
let turn = 0

type BeforeState = {
  status: string
  mode: string
  power: number
  fuel: number
  missionTitle?: string
  emotion: string
  zipperState: string
}

type LLMDecision = {
  status?: string | null
  mode?: string | null
  powerChange?: number
  fuelChange?: number
  newMission?: { title: string } | null
  emotion?: string | null
  zipperState?: string | null
}

export function debugTurn(params: {
  userMessage: string
  before: BeforeState
  llm: LLMDecision
  reply: string
}) {
  if (process.env.NODE_ENV !== 'development') return

  const { userMessage, before, llm, reply } = params
  turn++

  const LINE = '=============================='
  const delta = (n?: number | null) =>
    n == null ? '-' : n > 0 ? `+${n}` : n < 0 ? `${n}` : '0'

  console.log(`\n${LINE}`)
  console.log('🤖 ROBOTAN DEBUG')
  console.log(LINE)
  console.log('')
  console.log(`Turn:    ${turn}`)
  console.log(`Session: ${SESSION}`)
  console.log('')
  console.log('User:')
  console.log(`"${userMessage}"`)
  console.log('')
  console.log('Before')
  console.log('------')
  console.log(`Status:     ${before.status}`)
  console.log(`Mode:       ${before.mode}`)
  console.log(`Power:      ${before.power}`)
  console.log(`Fuel:       ${before.fuel}`)
  console.log(`Mission:    ${before.missionTitle ?? '-'}`)
  console.log(`Expression: ${before.emotion}`)
  console.log(`Zipper:     ${before.zipperState}`)
  console.log('')
  console.log('LLM Decision')
  console.log('------------')
  console.log(`Status:     ${llm.status ?? '-'}`)
  console.log(`Mode:       ${llm.mode ?? '-'}`)
  console.log(`Power:      ${delta(llm.powerChange)}`)
  console.log(`Fuel:       ${delta(llm.fuelChange)}`)
  console.log(`Mission:    ${llm.newMission?.title ?? '-'}`)
  console.log(`Expression: ${llm.emotion ?? '-'}`)
  console.log(`Zipper:     ${llm.zipperState ?? '-'}`)
  console.log('')
  console.log('Assistant')
  console.log('---------')
  console.log(`"${reply}"`)
  console.log('')
  console.log(LINE)

  if (llm.newMission && llm.newMission.title !== before.missionTitle) {
    console.log('\nMission\n\nChanged\n\nOld\n')
    console.log(before.missionTitle ?? '-')
    console.log('\n↓\n\nNew\n')
    console.log(llm.newMission.title)
  }

  if (llm.powerChange != null && llm.powerChange !== 0) {
    const next = Math.min(100, Math.max(0, before.power + llm.powerChange))
    console.log(`\nPower\n\n${before.power} → ${next}`)
  }

  if (llm.fuelChange != null && llm.fuelChange !== 0) {
    const next = Math.min(100, Math.max(0, before.fuel + llm.fuelChange))
    console.log(`\nFuel\n\n${before.fuel} → ${next}`)
  }

  if (llm.status && llm.status !== before.status) {
    console.log(`\nStatus\n\n${before.status} → ${llm.status}`)
  }
}
