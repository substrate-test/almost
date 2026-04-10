'use client'

type Tab = 'notifications' | 'moves' | 'settings'

interface Props {
  active: Tab | null
  onTab: (tab: Tab) => void
}

function BellIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
        fill={filled ? '#FE0155' : 'none'}
        stroke={filled ? '#FE0155' : '#2c2c2c'}
        strokeWidth={filled ? 0 : 1.5}
      />
    </svg>
  )
}

function MoveIcon({ filled }: { filled: boolean }) {
  const color = filled ? '#FE0155' : '#2c2c2c'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function GearIcon({ filled }: { filled: boolean }) {
  const color = filled ? '#FE0155' : '#2c2c2c'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}

export default function BottomNav({ active, onTab }: Props) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around px-8"
      style={{ height: 72, background: '#f7f5f6', borderTop: '1px solid #e8e8e8' }}
    >
      <button onClick={() => onTab('notifications')} className="flex flex-col items-center gap-1 transition-opacity hover:opacity-60">
        <BellIcon filled={active === 'notifications'} />
        <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: active === 'notifications' ? '#FE0155' : '#2c2c2c' }}>Alerts</span>
      </button>

      <button onClick={() => onTab('moves')} className="flex flex-col items-center gap-1 transition-opacity hover:opacity-60">
        <MoveIcon filled={active === 'moves'} />
        <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: active === 'moves' ? '#FE0155' : '#2c2c2c' }}>Moves</span>
      </button>

      <button onClick={() => onTab('settings')} className="flex flex-col items-center gap-1 transition-opacity hover:opacity-60">
        <GearIcon filled={active === 'settings'} />
        <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: active === 'settings' ? '#FE0155' : '#2c2c2c' }}>Settings</span>
      </button>
    </div>
  )
}
