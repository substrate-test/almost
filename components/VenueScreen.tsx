'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import type { Venue } from '@/types'
import { VENUES } from '@/lib/data'

const MAP_CENTER = { lat: 51.5194, lng: -0.0863 }
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

interface Props {
  onBack: () => void
  onNext: (venue: Venue) => void
}

export default function VenueScreen({ onBack, onNext }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Venue | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [view, setView] = useState<'list' | 'map'>('list')
  const mapRef = useRef<google.maps.Map | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey })
  const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return VENUES.filter(
      (v) => v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query])

  const handleSelect = (venue: Venue) => {
    setSelected(venue)
    setQuery(venue.name)
    setShowResults(false)
  }

  const handleDeselect = () => {
    setSelected(null)
    setQuery('')
  }

  return (
    <div className="flex flex-col h-full animate-screen-in bg-almost-bg">
      <div className="flex flex-col h-full px-6">
      {/* Header */}
      <div className="flex items-center gap-4 pt-[48px] pb-[60px]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white font-sans text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-70"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <span className="font-sans text-almost-muted text-xs font-medium tracking-widest uppercase ml-auto">
          1 of 3
        </span>
      </div>

      <h2 className="font-mono text-almost-text leading-tight mb-2" style={{ fontSize: 'clamp(26px, 7vw, 32px)' }}>
        Where did it happen?
      </h2>
      <p className="font-mono text-almost-secondary text-sm mb-6">
        London bars, clubs and restaurants. Start typing to find yours.
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
            onChange={(e) => { setQuery(e.target.value); setSelected(null); setShowResults(true) }}
            onFocus={() => setShowResults(true)}
            placeholder="Search venues..."
            className="w-full bg-almost-surface border border-almost-border pl-10 pr-5 py-4 font-mono text-sm text-almost-text placeholder:text-almost-secondary focus:border-almost-pink/40 transition-colors duration-200"
          />
        </div>

        {apiKey && (
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
        )}
      </div>

      {/* List view */}
      {view === 'list' && (
        <>
          {/* Popular hints */}
          {!query.trim() && !selected && (
            <div className="flex flex-col gap-2">
              <p className="font-mono text-almost-muted text-[11px] tracking-widest uppercase px-1 mb-1">Popular right now</p>
              {['7', '1', '25'].map(id => {
                const venue = VENUES.find(v => v.id === id)
                if (!venue) return null
                return (
                  <button
                    key={venue.id}
                    onMouseDown={() => handleSelect(venue)}
                    className="w-full text-left px-5 py-4 border border-almost-border bg-almost-surface hover:border-almost-border/80 hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <p className="font-mono text-sm text-almost-text">{venue.name}</p>
                    <p className="font-mono text-sm text-almost-secondary mt-0.5">{venue.address}</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* Search results */}
          {showResults && results.length > 0 && (
            <div className="flex flex-col gap-2 animate-fade-in">
              {results.map((venue) => {
                const isSelected = selected?.id === venue.id
                return isSelected ? (
                  <div
                    key={venue.id}
                    className="relative px-5 py-4 border border-almost-pink/40 bg-[rgba(254,1,85,0.08)] transition-all duration-200"
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
                    <p className="font-mono text-sm text-almost-pink pr-5">{venue.name}</p>
                    <p className="font-mono text-sm text-almost-secondary mt-0.5">{venue.address}</p>
                  </div>
                ) : (
                  <button
                    key={venue.id}
                    onMouseDown={() => handleSelect(venue)}
                    className="w-full text-left px-5 py-4 border border-almost-border bg-almost-surface hover:border-almost-border/80 hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <p className="font-mono text-sm text-almost-text">{venue.name}</p>
                    <p className="font-mono text-sm text-almost-secondary mt-0.5">{venue.address}</p>
                  </button>
                )
              })}
            </div>
          )}

          {showResults && query.trim() && results.length === 0 && (
            <p className="mt-4 font-mono text-almost-muted text-sm px-1">No venues found — try a different name.</p>
          )}

          {/* Selected confirmation */}
          {selected && !showResults && (
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
              <p className="font-mono text-sm text-almost-pink truncate pr-5">{selected.name}</p>
              <p className="font-mono text-sm text-almost-secondary mt-0.5 truncate">{selected.address}</p>
            </div>
          )}
        </>
      )}

      {/* Map view */}
      {view === 'map' && (
        <div className="flex flex-col gap-3">
          <div className="relative h-[300px] border border-almost-border overflow-hidden">
            {isLoaded ? (
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
                        fillColor: selected?.id === venue.id ? '#FE0155' : '#888888',
                        fillOpacity: 1,
                        strokeColor: selected?.id === venue.id ? '#ffffff' : '#0b0b0b',
                        strokeWeight: selected?.id === venue.id ? 2 : 1,
                        scale: selected?.id === venue.id ? 1.6 : 1,
                      }}
                    />
                  ))}
                </GoogleMap>
                <div className="absolute top-3 right-3 flex flex-col gap-px z-10">
                  <button
                    onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 13) + 1)}
                    className="w-8 h-8 bg-[#141414] border border-[#2a2a2a] text-white font-mono text-lg flex items-center justify-center hover:bg-[#1e1e1e] active:opacity-70"
                  >+</button>
                  <button
                    onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 13) - 1)}
                    className="w-8 h-8 bg-[#141414] border border-[#2a2a2a] text-white font-mono text-lg flex items-center justify-center hover:bg-[#1e1e1e] active:opacity-70"
                  >−</button>
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
              <p className="font-mono text-sm text-almost-pink truncate pr-5">{selected.name}</p>
              <p className="font-mono text-sm text-almost-secondary mt-0.5 truncate">{selected.address}</p>
            </div>
          ) : (
            <p className="font-mono text-almost-muted text-xs text-center py-2">Tap a pin to select a venue</p>
          )}
        </div>
      )}

      <div className="flex-1" />

      {/* Continue */}
      <div className="pb-8">
        <button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="w-full py-[15px] font-mono text-[15px] text-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:opacity-80"
          style={{ background: selected ? '#FE0155' : 'rgba(254,1,85,0.2)', color: '#ffffff' }}
        >
          Continue
        </button>
      </div>
      </div>
    </div>
  )
}
