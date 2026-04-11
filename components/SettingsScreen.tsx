'use client'

export default function SettingsScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
        <div className="pt-[37px] flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            
          </button>
          <button onClick={onClose} className="transition-opacity hover:opacity-60">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="#2c2c2c" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <h1 className="font-mono text-[#2c2c2c] mt-14 mb-8" style={{ fontSize: 36, lineHeight: 1.15 }}>
          Settings
        </h1>
        <div className="flex-1 flex flex-col">
          {['Account', 'Notifications', 'Privacy', 'About'].map((label, i, arr) => (
            <div key={label}>
              <button className="w-full flex items-center justify-between py-4 transition-opacity hover:opacity-60">
                <span className="font-sans text-[#2c2c2c] text-[16px]">{label}</span>
                <img src="/Arrow icon.svg" alt="" width={20} height={11} />
              </button>
              {i < arr.length - 1 && <div className="h-px bg-[#e8e8e8]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
