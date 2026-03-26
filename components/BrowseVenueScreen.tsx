'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import type { Venue } from '@/types'
import { VENUES, liveNoteCounts, expiringVenueIds, minMsLeftForVenue, formatShortCountdown } from '@/lib/data'

interface Props {
  onBack: () => void
  onNext: (venue: Venue) => void
}

const MAP_CENTER = { lat: 51.5194, lng: -0.0863 } // East London centre
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0b0b0b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#888888' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b0b0b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#141414' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060606' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

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
    <span className="px-1.5 py-0.5 font-mono text-[10px] bg-white/[0.06] text-almost-secondary tabular-nums">
      {label}
    </span>
  )
}

function VenueBadges({ venueId, count, expiring }: { venueId: string; count: number; expiring: boolean }) {
  if (!count) return null
  return (
    <div className="flex items-center gap-1 shrink-0">
      {expiring && <ExpiryChip venueId={venueId} />}
      <span className="px-1.5 py-0.5 font-mono text-[10px] bg-almost-pink/20 text-almost-pink">
        {count} live
      </span>
    </div>
  )
}

export default function BrowseVenueScreen({ onBack, onNext }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Venue | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [view, setView] = useState<'list' | 'map'>('list')
  const mapRef = useRef<google.maps.Map | null>(null)

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000) // refresh every 30s
    return () => clearInterval(id)
  }, [])
  const noteCounts = useMemo(() => liveNoteCounts(), [tick])
  const expiringIds = useMemo(() => expiringVenueIds(), [tick])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey })

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return VENUES.filter(
      v => v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query])

  // Venues sorted by note count for the map/suggested list
  const activeVenues = useMemo(() =>
    VENUES
      .filter(v => noteCounts[v.id])
      .sort((a, b) => (noteCounts[b.id] || 0) - (noteCounts[a.id] || 0)),
    [noteCounts]
  )

  const handleSelect = (venue: Venue) => {
    setSelected(venue)
    setQuery(venue.name)
    setShowResults(false)
  }

  const handleDeselect = () => {
    setSelected(null)
    setQuery('')
  }

  const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map }, [])

  return (
    <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
      <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6">
        <div className="flex items-center gap-4 pt-[48px] pb-[60px]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>

        <h2 className="font-mono text-almost-text leading-tight mb-2" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
          Where were you?
        </h2>
        <p className="font-mono text-almost-secondary text-sm mb-6">
          Pick the venue. Notes are pinned to where it happened.
        </p>

        {/* Search + toggle row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-almost-muted pointer-events-none">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              placeholder="Search venues..."
              className="w-full bg-almost-surface border border-almost-border pl-10 pr-4 py-4 font-mono text-sm text-almost-text placeholder:text-almost-secondary focus:border-almost-pink/40 transition-colors duration-200"
            />
          </div>

          {/* Map / List toggle */}
          <div className="flex border border-almost-border bg-almost-surface shrink-0">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-4 transition-colors duration-150 ${view === 'list' ? 'text-almost-pink' : 'text-almost-muted hover:text-almost-secondary'}`}
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-3 py-4 transition-colors duration-150 border-l border-almost-border ${view === 'map' ? 'text-almost-pink' : 'text-almost-muted hover:text-almost-secondary'}`}
              aria-label="Map view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-6 pb-0">

        {/* Search results */}
        {showResults && results.length > 0 && (
          <div className="flex flex-col gap-2 mb-4 animate-fade-in">
            {results.map(venue => {
              const isSelected = selected?.id === venue.id
              return isSelected ? (
                <div
                  key={venue.id}
                  className="relative w-full text-left px-5 py-4 border border-almost-pink/40 bg-[rgba(254,1,85,0.08)] transition-all duration-200"
                >
                  <button
                    onMouseDown={handleDeselect}
                    className="absolute top-3 right-3 text-almost-muted hover:text-almost-secondary transition-colors"
                    aria-label="Deselect venue"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="flex items-center justify-between gap-3 pr-5">
                    <div className="min-w-0">
                      <p className="font-mono text-sm truncate text-almost-pink">{venue.name}</p>
                      <p className="font-mono text-sm text-almost-secondary mt-0.5 truncate">{venue.address}</p>
                    </div>
                    <VenueBadges venueId={venue.id} count={noteCounts[venue.id] || 0} expiring={expiringIds.has(venue.id)} />
                  </div>
                </div>
              ) : (
                <button
                  key={venue.id}
                  onMouseDown={() => handleSelect(venue)}
                  className="w-full text-left px-5 py-4 border border-almost-border bg-almost-surface hover:bg-white/[0.02] transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-sm truncate text-almost-text">{venue.name}</p>
                      <p className="font-mono text-sm text-almost-secondary mt-0.5 truncate">{venue.address}</p>
                    </div>
                    <VenueBadges venueId={venue.id} count={noteCounts[venue.id] || 0} expiring={expiringIds.has(venue.id)} />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* List view — active venues */}
        {view === 'list' && !showResults && (
          <div className="flex flex-col gap-2">
            {activeVenues.length > 0 && (
              <>
                <p className="font-mono text-almost-muted text-[11px] tracking-widest uppercase mb-1">
                  Notes live now
                </p>
                {activeVenues.map(venue => {
                  const isSelected = selected?.id === venue.id
                  return isSelected ? (
                    <div
                      key={venue.id}
                      className="relative w-full text-left px-5 py-4 border border-almost-pink/40 bg-[rgba(254,1,85,0.08)] transition-all duration-200"
                    >
                      <button
                        onClick={handleDeselect}
                        className="absolute top-3 right-3 text-almost-muted hover:text-almost-secondary transition-colors"
                        aria-label="Deselect venue"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </button>
                      <div className="flex items-center justify-between gap-3 pr-5">
                        <div className="min-w-0">
                          <p className="font-mono text-sm truncate text-almost-pink">{venue.name}</p>
                          <p className="font-mono text-sm text-almost-secondary mt-0.5 truncate">{venue.address}</p>
                        </div>
                        <VenueBadges venueId={venue.id} count={noteCounts[venue.id] || 0} expiring={expiringIds.has(venue.id)} />
                      </div>
                    </div>
                  ) : (
                    <button
                      key={venue.id}
                      onClick={() => handleSelect(venue)}
                      className="w-full text-left px-5 py-4 border border-almost-border bg-almost-surface hover:bg-white/[0.02] transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-sm truncate text-almost-text">{venue.name}</p>
                          <p className="font-mono text-sm text-almost-secondary mt-0.5 truncate">{venue.address}</p>
                        </div>
                        <VenueBadges venueId={venue.id} count={noteCounts[venue.id] || 0} expiring={expiringIds.has(venue.id)} />
                      </div>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        )}

        {/* Map view */}
        {view === 'map' && (
          <div className="flex flex-col gap-3">
            <div className="h-[300px] w-full border border-almost-border overflow-hidden relative">
              {!apiKey ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 bg-almost-surface">
                  <p className="font-mono text-almost-muted text-xs text-center px-4">
                    Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable map view
                  </p>
                </div>
              ) : isLoaded ? (
                <>
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
                          fillColor: noteCounts[venue.id] ? '#FE0155' : '#555555',
                          fillOpacity: 1,
                          strokeColor: selected?.id === venue.id ? '#ffffff' : '#0b0b0b',
                          strokeWeight: selected?.id === venue.id ? 2 : 1,
                          scale: selected?.id === venue.id ? 1.6 : noteCounts[venue.id] ? 1.4 : 1,
                        }}
                      />
                    ))}
                  </GoogleMap>
                  <div className="absolute top-3 right-3 flex flex-col gap-px z-10">
                    <button onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 13) + 1)} className="w-8 h-8 bg-[#141414] border border-[#2a2a2a] text-white font-mono text-lg flex items-center justify-center hover:bg-[#1e1e1e] active:opacity-70">+</button>
                    <button onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 13) - 1)} className="w-8 h-8 bg-[#141414] border border-[#2a2a2a] text-white font-mono text-lg flex items-center justify-center hover:bg-[#1e1e1e] active:opacity-70">−</button>
                  </div>
                  <style>{`.gm-style-cc { opacity: 0.4; transform: scale(0.75); transform-origin: bottom right; } .gm-style a { display: none !important; }`}</style>
                </>
              ) : (
                <div className="h-full flex items-center justify-center bg-almost-surface">
                  <div className="w-5 h-5 rounded-full border-2 border-almost-pink/30 border-t-almost-pink animate-spin" />
                </div>
              )}
            </div>

            {/* Selected venue card below map */}
            {selected ? (
              <div className="relative px-5 py-4 border border-almost-pink/40 bg-[rgba(254,1,85,0.08)] animate-fade-in">
                <button
                  onClick={handleDeselect}
                  className="absolute top-3 right-3 text-almost-muted hover:text-almost-secondary transition-colors"
                  aria-label="Deselect venue"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="flex items-center justify-between gap-3 pr-5">
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-almost-pink truncate">{selected.name}</p>
                    <p className="font-mono text-sm text-almost-secondary mt-0.5 truncate">{selected.address}</p>
                  </div>
                  <VenueBadges venueId={selected.id} count={noteCounts[selected.id] || 0} expiring={expiringIds.has(selected.id)} />
                </div>
              </div>
            ) : (
              <p className="font-mono text-almost-muted text-xs text-center py-2">Tap a pin to select a venue</p>
            )}
          </div>
        )}
      </div>

      {/* Continue */}
      <div className="px-6 pb-8 pt-4 shrink-0">
        <button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="w-full py-[15px] font-mono text-[15px] text-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:opacity-80"
          style={{ background: selected ? '#FE0155' : 'rgba(254,1,85,0.2)', color: '#ffffff' }}
        >
          {selected && (noteCounts[selected.id] > 0)
            ? `Browse ${noteCounts[selected.id]} note${noteCounts[selected.id] !== 1 ? 's' : ''}`
            : 'Browse notes'}
        </button>
      </div>
      </div>
    </div>
  )
}
