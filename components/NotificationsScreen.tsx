'use client'

const EXAMPLES = [
  {
    id: '1',
    type: 'move_received' as const,
    noteId: 'my1',
    venue: 'Happiness Forgets',
    timeAgo: '2 hours ago',
    preview: 'Someone responded to your note.',
    read: false,
  },
  {
    id: '2',
    type: 'expiring' as const,
    noteId: null,
    venue: 'Netil Market',
    timeAgo: '5 hours ago',
    preview: 'Your note expires in 2 hours.',
    read: false,
  },
  {
    id: '3',
    type: 'move_received' as const,
    noteId: null,
    venue: 'Fabric',
    timeAgo: '2 days ago',
    preview: 'Someone responded to your note.',
    read: true,
  },
  {
    id: '4',
    type: 'expiring' as const,
    noteId: null,
    venue: 'Nightjar',
    timeAgo: '3 days ago',
    preview: 'Your note expired.',
    read: true,
  },
]


function NotificationItem({ item, onViewResponse }: { item: typeof EXAMPLES[number]; onViewResponse: (noteId: string) => void }) {
  const isMove = item.type === 'move_received'
  const clickable = !item.read && isMove && !!item.noteId

  const content = (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <p className="font-sans text-[16px] leading-[1.3] text-[#2c2c2c] flex-1">
          {item.preview}
        </p>
        <svg width="20" height="11" viewBox="0 0 20 11" fill="none" className="shrink-0 mt-1">
          <path d="M0 5.5h18M13 1l5.5 4.5L13 10" stroke={item.read ? '#c8c8c8' : '#FE0155'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c]">{item.venue}</span>
        <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c]">{item.timeAgo}</span>
      </div>
    </div>
  )

  if (clickable) {
    return (
      <button onClick={() => onViewResponse(item.noteId!)} className="w-full text-left transition-opacity hover:opacity-80 active:opacity-60">
        {content}
      </button>
    )
  }

  return content
}

export default function NotificationsScreen({ onClose, onViewResponse }: { onClose: () => void; onViewResponse: (noteId: string) => void }) {
  const unread = EXAMPLES.filter(i => !i.read)
  const read = EXAMPLES.filter(i => i.read)

  return (
    <div className="flex flex-col h-full" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-6">
        <div className="pt-8 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide relative top-[1px]">Back</span>
          </button>
          <button onClick={onClose} className="transition-opacity hover:opacity-60">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="#2c2c2c" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <h1 className="font-mono text-[#2c2c2c] mt-14 mb-8" style={{ fontSize: 36, lineHeight: 1.15 }}>
          Notifications
        </h1>
        <div className="flex flex-col overflow-y-auto">
          {unread.length === 0 && read.length === 0 && (
            <p className="font-sans text-[#9d9d9d] text-[16px]">Nothing to see here. As you were.</p>
          )}
          {unread.length > 0 && (
            <>
              <p className="font-sans text-[#9d9d9d] text-[15px] uppercase tracking-wide mb-1">Unread</p>
              <div className="flex flex-col gap-3 mb-8">
                {unread.map(item => (
                  <NotificationItem key={item.id} item={item} onViewResponse={onViewResponse} />
                ))}
              </div>
            </>
          )}
          {read.length > 0 && (
            <>
              <p className="font-sans text-[#9d9d9d] text-[15px] uppercase tracking-wide mb-1">Read</p>
              <div className="flex flex-col gap-3">
                {read.map(item => (
                  <NotificationItem key={item.id} item={item} onViewResponse={onViewResponse} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
