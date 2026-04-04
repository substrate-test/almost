'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import type { Venue } from '@/types'
import { VENUES, liveNoteCounts, expiringVenueIds, minMsLeftForVenue, formatShortCountdown } from '@/lib/data'

interface Props {
  onBack: () => void
  onNext: (venue: Venue) => void
}

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

const POPULAR_IDS = ['7', '1', '25']

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div className="w-[25px] h-[25px] rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center shrink-0">
      {selected && <div className="w-[11px] h-[11px] rounded-full bg-almost-pink" />}
    </div>
  )
}

function ToggleRadio({ selected }: { selected: boolean }) {
  return (
    <img
      src={selected ? '/Radio Button – selected.svg' : '/Radio Button – deselected.svg'}
      alt=""
      width={25}
      height={25}
    />
  )
}

function ExpiryChip({ venueId }: { venueId: string }) {
  const [ms, setMs] = useState(() => minMsLeftForVenue(venueId))
  const underHour = ms < 3600000

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = minMsLeftForVenue(venueId)
      setMs(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, underHour ? 1000 : 30000)
    return () => clearInterval(interval)
  }, [venueId, underHour])

  const label = underHour
    ? (() => {
        const m = Math.floor((ms % 3600000) / 60000)
        const s = Math.floor((ms % 60000) / 1000)
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      })()
    : formatShortCountdown(ms)

  return (
    <span className="bg-[#efefef] rounded px-2 py-1 font-sans text-[12px] text-[#5d5d5d] tabular-nums shrink-0">
      {label}
    </span>
  )
}

function VenueBadge({ venueId, count, expiring }: { venueId: string; count: number; expiring: boolean }) {
  if (!count) return null
  return (
    <div className="flex items-center gap-1 shrink-0">
      {expiring && <ExpiryChip venueId={venueId} />}
      <span className="bg-almost-pink/10 rounded px-2 py-1 font-sans text-[12px] text-almost-pink shrink-0">
        {count} live
      </span>
    </div>
  )
}

export default function BrowseVenueScreen({ onBack, onNext }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Venue | null>(null)
  const [view, setView] = useState<'list' | 'map'>('list')
  const mapRef = useRef<google.maps.Map | null>(null)

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(id)
  }, [])
  const noteCounts = useMemo(() => liveNoteCounts(), [tick])
  const expiringIds = useMemo(() => expiringVenueIds(), [tick])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey })
  const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return VENUES.filter(
      v => v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query])

  const popularVenues = POPULAR_IDS.map(id => VENUES.find(v => v.id === id)).filter(Boolean) as Venue[]
  const listVenues = query.trim() ? results : popularVenues
  const listLabel = query.trim() ? 'Search results' : 'Popular right now'

  const handleSelect = (venue: Venue) => {
    setSelected(v => v?.id === venue.id ? null : venue)
  }

  return (
    <div className="flex flex-col h-full animate-screen-in" style={{ background: '#f7f5f6' }}>
      <div className="flex flex-col h-full px-[calc(8.33%+2px)]">

        {/* Header */}
        <div className="pt-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-3 transition-opacity hover:opacity-60 active:opacity-40"
          >
            <img src="/Back icon.svg" alt="" width={20} height={11} />
            <span className="font-sans text-[#2c2c2c] text-[15px] uppercase tracking-wide">Back</span>
          </button>
        </div>

        {/* Heading */}
        <h1
          className="font-mono text-[#2c2c2c] mt-14 mb-3"
          style={{ fontSize: 'clamp(30px, 8vw, 36px)', lineHeight: 1.15 }}
        >
          Where were you?
        </h1>
        <p className="font-sans text-[#2c2c2c] text-[16px] leading-[1.2] mb-5">
          Pick the venue. Notes are pinned to where it happened.
        </p>

        {/* List / Map toggle */}
        <div className="flex items-center gap-6 mb-4">
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2"
          >
            <ToggleRadio selected={view === 'list'} />
            <span className="font-sans text-[#2c2c2c] text-[16px]">List</span>
          </button>
          {apiKey && (
            <button
              onClick={() => setView('map')}
              className="flex items-center gap-2"
            >
              <ToggleRadio selected={view === 'map'} />
              <span className="font-sans text-[#2c2c2c] text-[16px]">Map</span>
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-xl px-4 py-[15px] flex items-center gap-3 mb-5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="#7b7b7b" strokeWidth="1.4" />
            <path d="M13 13L16 16" stroke="#7b7b7b" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(null) }}
            placeholder="Search venues"
            className="flex-1 bg-transparent font-sans text-[16px] text-[#2c2c2c] placeholder:text-[#7b7b7b]"
          />
        </div>

        {/* List view */}
        {view === 'list' && (
          <div className="flex-1 overflow-y-auto">
            <p className="font-sans text-[#7b7b7b] text-[16px] leading-[1.2] mb-3">{listLabel}</p>
            <div className="flex flex-col gap-3 pb-4">
              {listVenues.length === 0 && query.trim() && (
                <p className="font-sans text-[#7b7b7b] text-[16px]">No venues found.</p>
              )}
              {listVenues.map(venue => (
                <button
                  key={venue.id}
                  onClick={() => handleSelect(venue)}
                  className={`w-full text-left bg-white p-4 rounded-xl flex items-center gap-4 transition-all duration-150 ${
                    selected?.id === venue.id ? 'border-2 border-[#E6E6E6]' : 'border-2 border-transparent'
                  }`}
                >
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <span className="font-sans text-[#2c2c2c] text-[20px] leading-tight truncate">{venue.name}</span>
                    <span className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] truncate">{venue.address}</span>
                    {noteCounts[venue.id] > 0 && (
                      <VenueBadge venueId={venue.id} count={noteCounts[venue.id]} expiring={expiringIds.has(venue.id)} />
                    )}
                  </div>
                  <RadioDot selected={selected?.id === venue.id} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Map view */}
        {view === 'map' && (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <div className="flex-1 rounded-xl overflow-hidden">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={MAP_CENTER}
                  zoom={13}
                  options={{ styles: MAP_STYLES, disableDefaultUI: true, keyboardShortcuts: false }}
                  onLoad={onMapLoad}
                >
                  {VENUES.map(venue => (
                    <Marker
                      key={venue.id}
                      position={{ lat: venue.lat, lng: venue.lng }}
                      onClick={() => handleSelect(venue)}
                      icon={{
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                        fillColor: selected?.id === venue.id ? '#FE0155' : '#888888',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 1.5,
                        scale: selected?.id === venue.id ? 1.6 : 1,
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
            {selected && (
              <div className="bg-white p-4 rounded-xl flex items-center gap-4 animate-fade-in">
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <span className="font-sans text-[#2c2c2c] text-[20px] leading-tight truncate">{selected.name}</span>
                  <span className="font-sans text-[#5d5d5d] text-[16px] leading-[1.2] truncate">{selected.address}</span>
                </div>
                <RadioDot selected />
              </div>
            )}
          </div>
        )}

        {/* Continue */}
        <div className="pb-8 pt-4 shrink-0">
          <button
            onClick={() => selected && onNext(selected)}
            disabled={!selected}
            className="w-full py-[15px] font-sans text-[16px] text-white text-center transition-all duration-200 disabled:cursor-not-allowed active:opacity-80 rounded-full"
            style={{ background: selected ? '#FE0155' : '#a0a0a0' }}
          >
            Peek inside
          </button>
        </div>

      </div>
    </div>
  )
}
