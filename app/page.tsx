'use client'

import Image from 'next/image'
import { useState } from 'react'
import Chat from './components/Chat'
import { INITIAL_STATE, type RobotanEffect, type RobotanMode, type RobotanState } from './lib/robotan'

function fuelLamp(v: number) {
  if (v > 50) return { dot: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.95)]' }
  if (v > 25) return { dot: 'bg-amber-700', glow: 'shadow-[0_0_6px_rgba(180,100,0,0.6)]' }
  return { dot: 'bg-red-500', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.9)]' }
}

function RobotImage({ fuel, className }: { fuel: number; className: string }) {
  const lamp = fuelLamp(fuel)
  return (
    <div className="relative inline-block">
      <Image
        src="/robotan-front.png"
        alt="Robotan"
        width={435}
        height={615}
        className={className}
      />
      <span
        className={`lamp-glow absolute w-5 h-3.5 rounded-full ${lamp.dot} ${lamp.glow} blur-[3px] pointer-events-none`}
        style={{ left: '36%', top: '63%', transform: 'translate(-50%, -50%)' }}
      />
    </div>
  )
}

const MODE_STYLE: Record<RobotanMode, string> = {
  STANDBY: 'border-stone-200 text-stone-300',
  ACTIVE:  'border-amber-400 text-amber-500 bg-amber-50',
  PROTECT: 'border-blue-400 text-blue-500 bg-blue-50',
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

function StatusSection({ state }: { state: RobotanState }) {
  const lamp = fuelLamp(state.fuel)
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-stone-400 tracking-widest">
          <span>POWER OUTPUT</span>
          <span className="text-stone-600 font-semibold">
            {state.power}% <span className="text-stone-400 font-normal">ONLINE</span>
          </span>
        </div>
        <div className="h-1.5 w-full bg-stone-100 rounded-full">
          <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${state.power}%` }} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-stone-400 tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${lamp.dot} ${lamp.glow}`} />
            FUEL CELL
          </span>
          <span className="text-stone-600 font-semibold">{state.fuel}%</span>
        </div>
        <div className="h-1.5 w-full bg-stone-100 rounded-full">
          <div className="h-full rounded-full bg-stone-600 transition-all duration-700" style={{ width: `${state.fuel}%` }} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-stone-400 tracking-widest">
          <span>FASTENER</span>
          <span className="text-stone-500 font-semibold tracking-widest">SEALED</span>
        </div>
        <div className="flex gap-0.5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-1 h-1.5 bg-stone-800 rounded-sm" />
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs text-stone-400 tracking-widest">
        <span>SPRING</span>
        <span className="text-amber-500 font-semibold tracking-widest">READY</span>
      </div>
    </div>
  )
}

function MissionCard({ padded }: { padded?: boolean }) {
  return (
    <div className={`rounded-xl border border-stone-200 bg-stone-50 space-y-2 ${padded ? 'p-5' : 'p-4'}`}>
      <p className="text-xs text-stone-400 tracking-widest uppercase">MISSION</p>
      <p className="text-sm text-stone-700 leading-relaxed">
        あなたは今日も内側にいてください。<br />
        外のことは全部、私が引き受けます。
      </p>
      <div className="flex gap-1.5 flex-wrap pt-1">
        {['防御: ON', '共感: ON', '焦り吸収: ON'].map((t) => (
          <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200/70 text-stone-500">{t}</span>
        ))}
      </div>
    </div>
  )
}

const MOBILE_MODE_STYLE: Record<RobotanMode, { dot: string; label: string }> = {
  STANDBY: { dot: 'bg-stone-400',                                               label: 'text-stone-500' },
  ACTIVE:  { dot: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',        label: 'text-stone-500' },
  PROTECT: { dot: 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]',         label: 'text-blue-500'  },
}

export default function Home() {
  const [state, setState] = useState<RobotanState>(INITIAL_STATE)

  function handleEffect(effect: RobotanEffect) {
    if (effect.stateDelta) {
      setState((prev) => ({ ...prev, ...effect.stateDelta }))
    }
  }

  const mobileMode = MOBILE_MODE_STYLE[state.mode]

  return (
    <div className="min-h-screen bg-white font-mono flex flex-col items-center px-5 py-8 relative overflow-hidden">

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
          <span>ROBOTAN OS v0.1</span>
          <span className="flex flex-col items-end gap-0.5">
            <span className={`flex items-center gap-1.5 transition-colors duration-500 ${mobileMode.label}`}>
              <span className={`w-2 h-2 rounded-full transition-all duration-500 ${mobileMode.dot}`} />
              {state.mode}
            </span>
            <span className="text-[10px] text-stone-400 tracking-widest normal-case">Protect Mode</span>
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <RobotImage fuel={state.fuel} className="w-48 drop-shadow-sm" />
          <div className="text-center mt-1">
            <h1 className="text-3xl font-bold tracking-tight text-stone-800">ROBOTAN</h1>
            <p className="text-xs tracking-[0.25em] text-stone-400 uppercase mt-0.5">Protect the Henachoko.</p>
          </div>
        </div>

        <MissionCard />
        <StatusSection state={state} />
        <Chat state={state} onEffect={handleEffect} />

        <p className="text-center text-xs text-stone-300 tracking-widest pb-2">
          Robotan v0.1 — Powered by Henachoko Spirit
        </p>
      </div>

      {/* ── Desktop / two-column layout ── */}
      <div className="relative z-10 w-full max-w-4xl hidden lg:flex lg:items-start lg:gap-12 lg:pt-4">

        {/* left: robot standing */}
        <div className="flex flex-col items-center gap-3 shrink-0 pt-8">
          <div className="text-xs text-stone-400 tracking-widest uppercase self-start">ROBOTAN OS v0.1</div>
          <RobotImage fuel={state.fuel} className="mt-6 w-[275px] drop-shadow-md" />
          <ActiveBadge mode={state.mode} />
        </div>

        {/* right: content */}
        <div className="flex-1 space-y-6 pt-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-stone-800">ROBOTAN</h1>
            <p className="text-sm tracking-[0.3em] text-stone-400 uppercase mt-1">Protect the Henachoko.</p>
          </div>

          <MissionCard padded />
          <StatusSection state={state} />
          <Chat state={state} onEffect={handleEffect} />

          <p className="text-xs text-stone-300 tracking-widest">
            Robotan v0.1 — Powered by Henachoko Spirit
          </p>
        </div>
      </div>

    </div>
  )
}
