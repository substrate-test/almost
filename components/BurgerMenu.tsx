'use client'

import { useState } from 'react'

interface Props {
  onHome: () => void
  onLeave: () => void
  onFind: () => void
  onLook: () => void
  onNotifications: () => void
  onMyNotes: () => void
  onSettings: () => void
  notificationCount?: number
}

function NavItem({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between group transition-opacity hover:opacity-60 active:opacity-40"
    >
      <span className="font-mono text-[#2c2c2c] leading-tight" style={{ fontSize: 32, fontWeight: 400 }}>
        {title}
      </span>
      <svg width="20" height="11" viewBox="0 0 20 11" fill="none" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1">
        <path d="M0 5.5h18M13 1l5.5 4.5L13 10" stroke="#FE0155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

function HexagonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 20.8,7 20.8,17 12,22 3.2,17 3.2,7" stroke="rgba(44,44,44,0.5)" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
}

export default function BurgerMenu({ onHome, onLeave, onFind, onLook, onNotifications, onMyNotes, onSettings, notificationCount = 0 }: Props) {
  const [open, setOpen] = useState(false)

  const handle = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  return (
    <>
      {/* Burger — top right, with pink dot if notifications */}
      <button
        onClick={() => setOpen(o => !o)}
        className="absolute top-[37px] right-6 z-50 transition-opacity hover:opacity-60"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? (
          <img src="/Close.svg" alt="Close" width={12} height={12} />
        ) : (
          <img
            src={notificationCount > 0 ? '/Burger Notification Thin.svg' : '/Burger Thin.svg'}
            alt=""
            width={notificationCount > 0 ? 24 : 21}
            height={notificationCount > 0 ? 11 : 9}
          />
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="absolute inset-0 z-40 flex flex-col px-6 pb-10 pt-8 animate-fade-in"
          style={{ background: '#E8E5E1' }}
        >
          {/* Primary nav */}
          <div className="flex-1 flex flex-col justify-center gap-6">
            <NavItem title="Home" onClick={() => handle(onHome)} />
            <NavItem title="Leave a note" onClick={() => handle(onLeave)} />
            <NavItem title="Make a move" onClick={() => handle(onFind)} />
            <NavItem title="Just looking" onClick={() => handle(onLook)} />
            <NavItem title="My notes" onClick={() => handle(onMyNotes)} />
          </div>

          {/* Utility — stacked vertically, icons share a fixed-width cell so they centre-align */}
          <div className="flex flex-col gap-4">
            {/* Notifications */}
            <button
              onClick={() => handle(onNotifications)}
              className="flex items-center gap-3 transition-opacity hover:opacity-60 active:opacity-40"
            >
              <div className="w-[20px] flex items-center justify-center shrink-0">
                <div
                  className="w-[15px] h-[15px] rounded-full"
                  style={{ background: notificationCount > 0 ? '#FE0155' : '#2c2c2c' }}
                />
              </div>
              <span className="font-sans text-[#2c2c2c]/60 text-[15px] uppercase tracking-wide relative top-[1px]">
                Notifications
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handle(onSettings)}
              className="flex items-center gap-3 transition-opacity hover:opacity-60 active:opacity-40"
            >
              <div className="w-[20px] flex items-center justify-center shrink-0">
                <HexagonIcon />
              </div>
              <span className="font-sans text-[#2c2c2c]/60 text-[15px] uppercase tracking-wide relative top-[2px]">
                Settings
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
