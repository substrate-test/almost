'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import type { Note, Venue } from '@/types'
import { allLiveNotes, formatCountdown, msLeft, liveNoteCounts, notesForVenue, VENUES } from '@/lib/data'

type View = 'list' | 'map'

const MAP_CENTER = { lat: 51.5194, lng: -0.0863 }
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f7f5f6' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5d5d5d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f7f5f6' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e0dede' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d0cece' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div className="w-[25px] h-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center shrink-0">
      {selected && <div className="w-[11px] h-[11px] rounded-full bg-almost-pink" />}
    </div>
  )
}

interface Props {
  onBack: () => void
  onSelect: (note: Note, context?: Note[]) => void
}

export default function LookScreen({ onBack, onSelect }: Props) {
  const [view, setView] = useState<View>('list')
  const [query, setQuery] = useState('')
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [, setTick] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const touchStartY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current
    const atTop = (listRef.current?.scrollTop ?? 0) === 0
    if (delta > 60 && atTop) {
      setRefreshing(true)
      setTimeout(() => {
        setRefreshKey(k => k + 1)
        setRefreshing(false)
      }, 800)
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey })
  const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map }, [])

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { setSelectedVenue(null) }, [view])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const notes = useMemo(() => allLiveNotes(), [refreshKey])
  const counts = liveNoteCounts()

  const venuesWithNotes = useMemo(() => VENUES.filter(v => (counts[v.id] ?? 0) > 0), [counts])

  const sorted = useMemo(() =>
    [...notes].sort((a, b) => sortAsc
      ? a.submittedAt.getTime() - b.submittedAt.getTime()
      : b.submittedAt.getTime() - a.submittedAt.getTime()
    ),
    [notes, sortAsc]
  )

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter(n =>
      n.text.toLowerCase().includes(q) || n.venue.name.toLowerCase().includes(q)
    )
  }, [query, sorted])

  const filteredVenues = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return venuesWithNotes
    return venuesWithNotes.filter(v =>
      v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q)
    )
  }, [query, venuesWithNotes])

  const handleVenueContinue = (venue: Venue) => {
    const venueNotes = notesForVenue(venue.id)
    if (venueNotes.length > 0) onSelect(venueNotes[0])
  }

  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      {/* Header */}
      <div className="px-6 pt-8 flex items-center">
        <button onClick={onBack} className="flex items-center gap-3 transition-opacity hover:opacity-70">
          <img src="/Back icon.svg" alt="" width={20} height={11} />
          
        </button>
      </div>

      {/* Title */}
      <div className="px-6 mt-14 mb-5">
        <h1 className="font-mono text-[#2c2c2c] leading-tight" style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}>
          What&apos;s out there
        </h1>
      </div>

      {/* List / Map toggle */}
      <div className="px-6 mb-4 flex items-center gap-6">
        <button onClick={() => setView('list')} className="flex items-center gap-2">
          <RadioDot selected={view === 'list'} />
          <span className="font-sans text-[#2c2c2c] text-[16px]">List</span>
        </button>
        {apiKey && (
          <button onClick={() => setView('map')} className="flex items-center gap-2">
            <RadioDot selected={view === 'map'} />
            <span className="font-sans text-[#2c2c2c] text-[16px]">Map</span>
          </button>
        )}
      </div>

      {/* Search + sort — list only */}
      {view === 'list' && (
        <div className="px-6 mb-4 flex items-center gap-3">
          <div className="flex-1 bg-white rounded-xl px-4 py-[15px] flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7.5" cy="7.5" r="6" stroke="#7b7b7b" strokeWidth="1.4" />
              <path d="M13 13L16 16" stroke="#7b7b7b" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes or venues"
              className="flex-1 bg-transparent font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#7b7b7b]"
            />
          </div>
          <button
            onClick={() => setSortAsc(a => !a)}
            className="bg-white rounded-xl px-3 py-[15px] flex items-center gap-1.5 shrink-0 transition-opacity hover:opacity-70"
          >
            <span className="font-sans text-[#2c2c2c] text-[14px]">{sortAsc ? 'Ancient' : 'Recent'}</span>
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={`transition-transform duration-200 ${sortAsc ? 'rotate-180' : ''}`}
            >
              <path d="M2 4l4 4 4-4" stroke="#2c2c2c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div
          ref={listRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 overflow-y-auto px-6 flex flex-col gap-3 pb-8"
        >
          {refreshing && (
            <div className="flex justify-center py-2">
              <div className="w-4 h-4 rounded-full border-2 border-almost-pink/30 border-t-almost-pink animate-spin" />
            </div>
          )}
          {!refreshing && filteredNotes.length === 0 && (
            <p className="font-sans text-[#5d5d5d] text-[16px]">Nothing found.</p>
          )}
          {filteredNotes.map(note => {
            const remaining = msLeft(note)
            const isExpiringSoon = remaining < 2 * 3600 * 1000
            return (
              <button
                key={note.id}
                onClick={() => onSelect(note, filteredNotes)}
                className="w-full text-left bg-white rounded-xl p-4 flex flex-col justify-between transition-all duration-200 active:opacity-80"
              >
                <p className="font-sans text-[20px] text-[#2c2c2c] leading-[1.6] line-clamp-3 mb-3">
                  {note.text}
                </p>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#2c2c2c] truncate min-w-0">
                    {note.venue.name}
                  </span>
                  <span className={`font-sans text-[12px] tabular-nums shrink-0 ml-auto ${isExpiringSoon ? 'text-almost-pink' : 'text-[#FE0155]'}`}>
                    {formatCountdown(remaining)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Map view */}
      {view === 'map' && (
        <div className="flex-1 px-6 pb-8 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 rounded-xl overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={MAP_CENTER}
                zoom={13}
                options={{ styles: MAP_STYLES, disableDefaultUI: true, keyboardShortcuts: false }}
                onLoad={onMapLoad}
              >
                {venuesWithNotes.map(venue => (
                  <Marker
                    key={venue.id}
                    position={{ lat: venue.lat, lng: venue.lng }}
                    onClick={() => setSelectedVenue(v => v?.id === venue.id ? null : venue)}
                    icon={{
                      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                      fillColor: selectedVenue?.id === venue.id ? '#cc0044' : '#FE0155',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 1.5,
                      scale: selectedVenue?.id === venue.id ? 1.6 : 1,
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-xl">
                <div className="w-5 h-5 rounded-full border-2 border-almost-pink/30 border-t-almost-pink animate-spin" />
              </div>
            )}
          </div>

          {selectedVenue && (
            <div className="bg-white p-4 rounded-xl flex items-center gap-4 animate-fade-in shrink-0">
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <span className="font-sans text-[#2c2c2c] text-[20px] leading-tight truncate">{selectedVenue.name}</span>
                <span className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] truncate">{selectedVenue.address}</span>
              </div>
              <span className="font-sans text-[#9d9d9d] text-[13px] shrink-0">
                {counts[selectedVenue.id]} {counts[selectedVenue.id] === 1 ? 'note' : 'notes'}
              </span>
            </div>
          )}

          <button
            onClick={() => selectedVenue && handleVenueContinue(selectedVenue)}
            disabled={!selectedVenue}
            className="w-full py-[15px] font-sans text-[16px] text-white text-center transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full shrink-0"
            style={{ background: selectedVenue ? '#FE0155' : '#a0a0a0' }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
