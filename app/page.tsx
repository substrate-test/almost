'use client'

import { useState } from 'react'
import LandingScreen from '@/components/LandingScreen'
import ChoiceScreen from '@/components/ChoiceScreen'
import OnboardingScreen from '@/components/OnboardingScreen'
import VenueScreen from '@/components/VenueScreen'
import DateTimeScreen from '@/components/DateTimeScreen'
import WriteScreen from '@/components/WriteScreen'
import AuthScreen from '@/components/AuthScreen'
import PostedScreen from '@/components/PostedScreen'
import ExpiryScreen from '@/components/ExpiryScreen'
import BrowseVenueScreen from '@/components/BrowseVenueScreen'
import BrowseNotesScreen from '@/components/BrowseNotesScreen'
import BrowseRespondScreen from '@/components/BrowseRespondScreen'
import type { MomentData, Screen, Venue, Note } from '@/types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [screenKey, setScreenKey] = useState(0)
  const [data, setData] = useState<MomentData>({})
  const [browseVenue, setBrowseVenue] = useState<Venue | null>(null)
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  const navigate = (next: Screen) => {
    setScreenKey(k => k + 1)
    setScreen(next)
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-almost-bg">
      <div className="relative w-full max-w-[430px] h-full overflow-hidden">

        {/* Stars — global home shortcut */}
        {screen !== 'landing' && (
          <button
            onClick={() => { setData({}); setBrowseVenue(null); setActiveNote(null); navigate('landing') }}
            className="absolute top-[56px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-2 transition-opacity hover:opacity-70 active:opacity-50"
            aria-label="Back to start"
          >
            <img src="/Stars New.svg" alt="" className="h-5 w-auto" />
          </button>
        )}

        {screen === 'landing' && (
          <LandingScreen key={screenKey} onNext={() => navigate('choice')} />
        )}

        {screen === 'choice' && (
          <ChoiceScreen
            key={screenKey}
            onBack={() => navigate('landing')}
            onLeave={() => navigate('onboarding-leave')}
            onFind={() => navigate('onboarding-find')}
          />
        )}

        {screen === 'onboarding-leave' && (
          <OnboardingScreen key={screenKey} mode="leave" onBack={() => navigate('choice')} onDone={() => navigate('venue')} />
        )}

        {screen === 'onboarding-find' && (
          <OnboardingScreen key={screenKey} mode="find" onBack={() => navigate('choice')} onDone={() => navigate('browse-venue')} />
        )}

        {/* — Leave a note flow — */}

        {screen === 'venue' && (
          <VenueScreen
            key={screenKey}
            onBack={() => navigate('choice')}
            onNext={(venue: Venue) => {
              setData(d => ({ ...d, venue }))
              navigate('datetime')
            }}
          />
        )}

        {screen === 'datetime' && (
          <DateTimeScreen
            key={screenKey}
            onBack={() => navigate('venue')}
            onNext={(datetime: Date) => {
              setData(d => ({ ...d, datetime }))
              navigate('write')
            }}
          />
        )}

        {screen === 'write' && (
          <WriteScreen
            key={screenKey}
            venue={data.venue}
            datetime={data.datetime}
            onBack={() => navigate('datetime')}
            onNext={(text: string) => {
              const submittedAt = new Date()
              setData(d => ({ ...d, text, submittedAt }))
              navigate('auth')
            }}
          />
        )}

        {screen === 'auth' && (
          <AuthScreen
            key={screenKey}
            onBack={() => navigate('write')}
            onDone={() => navigate('posted')}
          />
        )}

        {screen === 'posted' && (
          <PostedScreen
            key={screenKey}
            data={data}
            onViewNote={() => {
              // View own note in the browse flow using poster's venue
              if (data.venue) setBrowseVenue(data.venue)
              navigate('browse-notes')
            }}
            onRestart={() => { setData({}); navigate('landing') }}
          />
        )}

        {screen === 'expiry' && (
          <ExpiryScreen
            key={screenKey}
            onRestart={() => { setData({}); navigate('landing') }}
          />
        )}

        {/* — Make a move flow — */}

        {screen === 'browse-venue' && (
          <BrowseVenueScreen
            key={screenKey}
            onBack={() => navigate('onboarding-find')}
            onNext={(venue: Venue) => {
              setBrowseVenue(venue)
              navigate('browse-notes')
            }}
          />
        )}

        {screen === 'browse-notes' && browseVenue && (
          <BrowseNotesScreen
            key={screenKey}
            venue={browseVenue}
            onBack={() => navigate('browse-venue')}
            onRespond={(note: Note) => {
              setActiveNote(note)
              navigate('browse-respond')
            }}
          />
        )}

        {screen === 'browse-respond' && activeNote && (
          <BrowseRespondScreen
            key={screenKey}
            note={activeNote}
            onBack={() => navigate('browse-notes')}
            onSent={() => navigate('browse-auth')}
          />
        )}

        {screen === 'browse-auth' && (
          <AuthScreen
            key={screenKey}
            onBack={() => navigate('browse-respond')}
            onDone={() => navigate('landing')}
            title="Almost there."
            description="We'll let the poster know someone's made a move. Your details won't be shared with them or published anywhere — this is just so we can connect you if they respond."
            cta="Send my move"
          />
        )}

      </div>
    </main>
  )
}
