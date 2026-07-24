'use client'

const ROBOTAN_VERSION = 'v0.2'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import Chat from './components/Chat'
import { EMOTION_IMAGE, INITIAL_MISSION, INITIAL_STATE, type Mission, type RobotanEffect, type RobotanMode, type RobotanState, type RobotanStatus, type ZipperState } from './lib/robotan'

type LampStyle = { dot: string; glow: string; anim: string }

const STATUS_LAMP: Record<RobotanStatus, LampStyle> = {
  ACTIVE:    { dot: 'bg-green-400',  glow: 'shadow-[0_0_10px_rgba(74,222,128,0.95)]',  anim: 'lamp-solid'      },
  NORMAL:    { dot: 'bg-green-400',  glow: 'shadow-[0_0_8px_rgba(74,222,128,0.7)]',    anim: 'lamp-blink-slow' },
  RECOVERY:  { dot: 'bg-orange-400', glow: 'shadow-[0_0_8px_rgba(251,146,60,0.8)]',    anim: 'lamp-blink-slow' },
  LOW_POWER: { dot: 'bg-red-500',    glow: 'shadow-[0_0_10px_rgba(239,68,68,0.9)]',    anim: 'lamp-blink-fast' },
  SHUTDOWN:  { dot: 'bg-stone-600',  glow: '',                                          anim: 'lamp-off'        },
}

const BACK_IMAGE: Record<ZipperState, string> = {
  CLOSED:    '/robotan/robotan-back.png',
  HALF_OPEN: '/robotan/robotan-back-half-open.png',
  FULL_OPEN: '/robotan/robotan-back-full-open.png',
}

function RobotImage({ status, emotion, zipperState, className, rippleKey }: { status: RobotanStatus; emotion: RobotanState['emotion']; zipperState: ZipperState; className: string; rippleKey: number }) {
  const [showBack, setShowBack] = useState(false)
  const autoReturnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lamp = STATUS_LAMP[status]

  useEffect(() => {
    return () => { if (autoReturnTimer.current) clearTimeout(autoReturnTimer.current) }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const next = !showBack
    setShowBack(next)
    if (autoReturnTimer.current) clearTimeout(autoReturnTimer.current)
    if (next) {
      autoReturnTimer.current = setTimeout(() => setShowBack(false), 30000)
    }
  }

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setShowBack(true)}
      onMouseLeave={() => setShowBack(false)}
      onTouchStart={handleTouchStart}
    >
      <Image
        src={EMOTION_IMAGE[emotion]}
        alt="Robotan"
        width={350}
        height={450}
        className={`object-contain object-center transition-opacity duration-300 ${showBack ? 'opacity-0' : 'opacity-100'} ${className}`}
      />
      <Image
        src={BACK_IMAGE[zipperState]}
        alt="Robotan back"
        width={350}
        height={450}
        className={`absolute top-0 left-0 object-contain object-center transition-opacity duration-300 ${showBack ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
      <span
        className={`${lamp.anim} absolute w-5 h-3.5 rounded-full ${lamp.dot} ${lamp.glow} blur-[3px] pointer-events-none`}
        style={{ left: '36%', top: '63%', transform: 'translate(-50%, -50%)' }}
      />
      {rippleKey > 0 && (
        <span
          key={rippleKey}
          className={`lamp-ripple absolute w-5 h-3.5 rounded-full ${lamp.dot} blur-[3px] pointer-events-none`}
          style={{ left: '36%', top: '63%' }}
        />
      )}
    </div>
  )
}

const MODE_STYLE: Record<RobotanMode, string> = {
  STANDBY: 'border-cyan-400 text-cyan-500 bg-cyan-50',
  ACTIVE:  'border-amber-400 text-amber-500 bg-amber-50',
  PROTECT: 'border-red-400 text-red-500 bg-red-50',
}

function ActiveBadge({ mode }: { mode: RobotanMode }) {
  return (
    <div className="flex gap-1.5 text-xs tracking-widest">
      {(['STANDBY', 'ACTIVE', 'PROTECT'] as const).map((s) => (
        <span
          key={s}
          className={`px-2 py-0.5 rounded border transition-colors duration-500 ${
            s === mode ? MODE_STYLE[mode] : 'border-stone-200 text-stone-300'
          }`}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

const STATUS_LABEL: Record<RobotanStatus, { text: string; color: string }> = {
  ACTIVE:    { text: 'ACTIVE',    color: 'text-green-500'  },
  NORMAL:    { text: 'NORMAL',    color: 'text-stone-500'  },
  RECOVERY:  { text: 'RECOVERY',  color: 'text-orange-500' },
  LOW_POWER: { text: 'LOW POWER', color: 'text-red-500'    },
  SHUTDOWN:  { text: 'SHUTDOWN',  color: 'text-stone-400'  },
}

function StatusSection({ state }: { state: RobotanState }) {
  const lamp = STATUS_LAMP[state.status]
  const statusLabel = STATUS_LABEL[state.status]
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-stone-400 tracking-widest">
          <span>POWER OUTPUT</span>
          <span className="text-stone-600 font-semibold">{state.power}%</span>
        </div>
        <div className="h-1.5 w-full bg-stone-100 rounded-full">
          <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${state.power}%` }} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-stone-400 tracking-widest">
          <span>FUEL CELL</span>
          <span className="text-stone-600 font-semibold">{state.fuel}%</span>
        </div>
        <div className="h-1.5 w-full bg-stone-100 rounded-full">
          <div className="h-full rounded-full bg-stone-600 transition-all duration-700" style={{ width: `${state.fuel}%` }} />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-stone-400 tracking-widest">
        <span className="flex items-center gap-1.5">
          <span className={`${lamp.anim} w-2 h-2 rounded-full ${lamp.dot} ${lamp.glow}`} />
          STATUS
        </span>
        <span className={`font-semibold tracking-widest ${statusLabel.color}`}>{statusLabel.text}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-stone-400 tracking-widest">
          <span>FASTENER</span>
          <span className={`font-semibold tracking-widest transition-colors duration-1000 ${
            state.zipperState === 'FULL_OPEN' ? 'text-amber-500' :
            state.zipperState === 'HALF_OPEN' ? 'text-stone-400' :
            'text-stone-500'
          }`}>
            {state.zipperState === 'FULL_OPEN' ? 'OPEN' : state.zipperState === 'HALF_OPEN' ? 'HALF' : 'SEALED'}
          </span>
        </div>
        <div className="flex gap-0.5">
          {[...Array(10)].map((_, i) => {
            const openCount = state.zipperState === 'FULL_OPEN' ? 10 : state.zipperState === 'HALF_OPEN' ? 5 : 0
            const isOpen = i >= (10 - openCount)
            return (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-sm transition-all duration-1000 ${isOpen ? 'bg-stone-200' : 'bg-stone-800'}`}
              />
            )
          })}
        </div>
      </div>

      <div className="flex justify-between text-xs text-stone-400 tracking-widest">
        <span>SPRING</span>
        <span className="text-amber-500 font-semibold tracking-widest">READY</span>
      </div>
    </div>
  )
}

function MissionCard({ mission, missionCompleteFlash, padded }: { mission: Mission; missionCompleteFlash: boolean; padded?: boolean }) {
  return (
    <div className={`rounded-xl border border-stone-200 bg-stone-50 space-y-1.5 ${padded ? 'p-1.5' : 'p-2'}`}>
      <div className="flex items-center gap-1.5 flex-wrap">
        <p className="text-xs text-stone-400 tracking-widest uppercase shrink-0">MISSION</p>
        {!missionCompleteFlash && mission.tags.map((t) => (
          <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200/70 text-stone-500">{t}</span>
        ))}
      </div>
      {missionCompleteFlash ? (
        <p className="text-sm font-bold tracking-widest text-amber-500">MISSION COMPLETE</p>
      ) : (
        <p className="text-sm text-stone-700 leading-relaxed">{mission.title}</p>
      )}
    </div>
  )
}

const MOBILE_MODE_STYLE: Record<RobotanMode, { dot: string; label: string }> = {
  STANDBY: { dot: 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]',         label: 'text-cyan-500'  },
  ACTIVE:  { dot: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',        label: 'text-amber-500' },
  PROTECT: { dot: 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]',         label: 'text-red-500'   },
}

export default function Home() {
  const [state, setState] = useState<RobotanState>(INITIAL_STATE)
  const [displayEmotion, setDisplayEmotion] = useState<RobotanState['emotion']>(INITIAL_STATE.emotion)
  const [mission, setMission] = useState<Mission>(INITIAL_MISSION)
  const [missionCompleteFlash, setMissionCompleteFlash] = useState(false)
  const [rippleKey, setRippleKey] = useState(0)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const interval = setInterval(() => {
      if (stateRef.current.emotion === 'NORMAL') {
        setDisplayEmotion('BLINK')
        setTimeout(() => setDisplayEmotion('NORMAL'), 2000)
      }
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (state.emotion !== 'NORMAL') {
      setDisplayEmotion(state.emotion)
    } else {
      setDisplayEmotion('NORMAL')
    }
  }, [state.emotion])

  function handleEffect(effect: RobotanEffect) {
    setState((prev) => {
      const next = { ...prev, ...effect.stateDelta }

      // Power / Fuel デルタ適用（0〜100 クランプ）
      if (effect.powerChange) {
        next.power = Math.min(100, Math.max(0, prev.power + effect.powerChange))
      }
      if (effect.fuelChange) {
        next.fuel = Math.min(100, Math.max(0, prev.fuel + effect.fuelChange))
      }

      // lowPowerLock を更新
      if (effect.lowPowerLock !== undefined) {
        next.lowPowerLock = effect.lowPowerLock
      }

      // AI判定のstatusを反映（ロック中はLOW_POWERを強制）
      if (effect.status) {
        next.status = next.lowPowerLock ? 'LOW_POWER' : effect.status
      }

      // zipperState 更新
      if (effect.zipperState) {
        next.zipperState = effect.zipperState
      }

      // 顔が DETERMINED → mode を PROTECT に同期
      if (next.emotion === 'DETERMINED') {
        next.mode = 'PROTECT'
      }
      // mode が ACTIVE → 顔が DETERMINED のままなら NORMAL に戻す
      if (next.mode === 'ACTIVE' && next.emotion === 'DETERMINED') {
        next.emotion = 'NORMAL'
      }

      return next
    })

    // Mission Complete 演出
    if (effect.missionCompleted && effect.newMission) {
      setMissionCompleteFlash(true)
      setRippleKey((k) => k + 1)
      const next = effect.newMission
      setTimeout(() => {
        setMissionCompleteFlash(false)
        setMission({ ...next, completed: false })
      }, 1500)
    } else if (!effect.missionCompleted && effect.newMission) {
      setMission({ ...effect.newMission, completed: false })
    }
  }

  const mobileMode = MOBILE_MODE_STYLE[state.mode]

  return (
    <div className="min-h-screen bg-white font-mono flex flex-col items-center px-5 py-5 relative">

      {/* HUD corner frames */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-4 border rounded-3xl" style={{borderColor:'#f0eeec'}}/>
        <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-stone-300 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-stone-300 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-stone-300 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-stone-300 rounded-br-xl" />
      </div>

      {/* ── Mobile / single-column layout ── */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-6 lg:hidden">

        <div className="flex items-center justify-between text-xs text-stone-400 tracking-widest uppercase">
          <span>ROBOTAN OS {ROBOTAN_VERSION}</span>
          <span className="flex flex-col items-end gap-0.5">
            <span className={`flex items-center gap-1.5 transition-colors duration-500 ${mobileMode.label}`}>
              <span className={`w-2 h-2 rounded-full transition-all duration-500 ${mobileMode.dot}`} />
              {state.mode}
            </span>
            <span className="text-[10px] text-stone-400 tracking-widest normal-case">Protect Mode</span>
          </span>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-800">ROBOTAN</h1>
          <p className="text-xs tracking-[0.25em] text-stone-400 uppercase mt-0.5">Protect the Henachoko.</p>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">あなたは今日も内側にいてください。<br />外のことは全部、私が引き受けます。</p>
        </div>

        <StatusSection state={state} />
        <div className="flex flex-col items-center gap-3">
          <RobotImage status={state.status} emotion={displayEmotion} zipperState={state.zipperState} className="w-48 drop-shadow-sm" rippleKey={rippleKey} />
          <Chat state={state} onEffect={handleEffect} inputLocked={missionCompleteFlash} slot={<MissionCard mission={mission} missionCompleteFlash={missionCompleteFlash} />} mission={mission} />
        </div>

        <p className="text-center text-xs text-stone-300 tracking-widest pb-2">
          Robotan {ROBOTAN_VERSION} — Powered by Henachoko Spirit
        </p>
      </div>

      {/* ── Desktop / two-column layout ── */}
      <div className="relative z-10 w-full max-w-4xl hidden lg:flex lg:items-start lg:gap-10 lg:py-6">

        {/* left: robot + status */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-[230px]">
          <div className="text-xs text-stone-400 tracking-widest uppercase self-start">ROBOTAN OS {ROBOTAN_VERSION}</div>
          <RobotImage status={state.status} emotion={displayEmotion} zipperState={state.zipperState} className="mt-2 w-[230px] drop-shadow-md" rippleKey={rippleKey} />
          <ActiveBadge mode={state.mode} />
          <div className="w-full mt-2">
            <StatusSection state={state} />
          </div>
        </div>

        {/* right: title + mission + chat */}
        <div className="flex-1 flex flex-col gap-3">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-stone-800">ROBOTAN</h1>
            <p className="text-sm tracking-[0.3em] text-stone-400 uppercase mt-1">Protect the Henachoko.</p>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">あなたは今日も内側にいてください。<br />外のことは全部、私が引き受けます。</p>
          </div>

          <Chat state={state} onEffect={handleEffect} logClassName="max-h-72" inputLocked={missionCompleteFlash} slot={<MissionCard mission={mission} missionCompleteFlash={missionCompleteFlash} padded />} mission={mission} />

          <p className="text-xs text-stone-300 tracking-widest">
            Robotan {ROBOTAN_VERSION} — Powered by Henachoko Spirit
          </p>
        </div>
      </div>

    </div>
  )
}
