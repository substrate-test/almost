'use client'

import { useState } from 'react'
import LandingScreen from '@/components/LandingScreen'
import RegisterAuthScreen from '@/components/RegisterAuthScreen'
import RegisterNameScreen from '@/components/RegisterNameScreen'
import RegisterDOBScreen from '@/components/RegisterDOBScreen'
import ChoiceScreen from '@/components/ChoiceScreen'
import OnboardingScreen from '@/components/OnboardingScreen'
import VenueScreen from '@/components/VenueScreen'
import DateTimeScreen from '@/components/DateTimeScreen'
import WriteScreen from '@/components/WriteScreen'
import PostedScreen from '@/components/PostedScreen'
import ExpiryScreen from '@/components/ExpiryScreen'
import BrowseVenueScreen from '@/components/BrowseVenueScreen'
import BrowseNotesScreen from '@/components/BrowseNotesScreen'
import BrowseRespondScreen from '@/components/BrowseRespondScreen'
import LookScreen from '@/components/LookScreen'
import NotificationsScreen from '@/components/NotificationsScreen'
import MyNotesScreen from '@/components/MyNotesScreen'
import MyNoteDetailScreen from '@/components/MyNoteDetailScreen'
import ViewResponseScreen from '@/components/ViewResponseScreen'
import ResponseSentScreen from '@/components/ResponseSentScreen'
import SettingsScreen from '@/components/SettingsScreen'
import BurgerMenu from '@/components/BurgerMenu'
import type { MomentData, Screen, Venue, Note } from '@/types'
import { myLiveNotes, myPastNotes, DEMO_RESPONSES } from '@/lib/data'

const ONBOARDING: Screen[] = ['landing', 'register-auth', 'register-name', 'register-dob']

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [screenKey, setScreenKey] = useState(0)
  const [history, setHistory] = useState<Screen[]>([])
  const [data, setData] = useState<MomentData>({})
  const [browseVenue, setBrowseVenue] = useState<Venue | null>(null)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [browseNotesBack, setBrowseNotesBack] = useState<Screen>('browse-venue')
  const [initialNoteId, setInitialNoteId] = useState<string | undefined>(undefined)
  const [browseNotes, setBrowseNotes] = useState<Note[] | undefined>(undefined)
  const [myNoteId, setMyNoteId] = useState<string | undefined>(undefined)

  const navigate = (next: Screen) => {
    setHistory(h => [...h, screen])
    setScreenKey(k => k + 1)
    setScreen(next)
  }

  const goBack = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setScreenKey(k => k + 1)
    // Side effects when leaving certain screens
    if (screen === 'browse-notes') setBrowseNotes(undefined)
    if (screen === 'posted') setData({})
    setScreen(prev)
  }

  const showMenu = !ONBOARDING.includes(screen) && screen !== 'notifications' && screen !== 'settings'

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-almost-bg">
      <div className="relative w-full max-w-[430px] h-full overflow-hidden">

        {screen === 'landing' && (
          <LandingScreen key={screenKey} onNext={() => navigate('register-auth')} onSkip={() => navigate('choice')} />
        )}

        {screen === 'register-auth' && (
          <RegisterAuthScreen key={screenKey} onDone={() => navigate('register-name')} onSkip={() => navigate('choice')} />
        )}

        {screen === 'register-name' && (
          <RegisterNameScreen
            key={screenKey}
            onBack={goBack}
            onNext={() => navigate('register-dob')}
            onSkip={() => navigate('choice')}
          />
        )}

        {screen === 'register-dob' && (
          <RegisterDOBScreen
            key={screenKey}
            onBack={goBack}
            onNext={() => navigate('choice')}
            onSkip={() => navigate('choice')}
          />
        )}

        {screen === 'choice' && (
          <ChoiceScreen
            key={screenKey}
            onBack={goBack}
            onLeave={() => navigate('onboarding-leave')}
            onFind={() => navigate('onboarding-find')}
            onLook={() => navigate('look')}
          />
        )}

        {screen === 'look' && (
          <LookScreen
            key={screenKey}
            onBack={goBack}
            onSelect={(note: Note, context?: Note[]) => {
              setBrowseVenue(note.venue)
              setInitialNoteId(note.id)
              setBrowseNotesBack('look')
              setBrowseNotes(context)
              navigate('browse-notes')
            }}
          />
        )}

        {screen === 'onboarding-leave' && (
          <OnboardingScreen key={screenKey} mode="leave" onBack={goBack} onDone={() => navigate('venue')} />
        )}

        {screen === 'onboarding-find' && (
          <OnboardingScreen key={screenKey} mode="find" onBack={goBack} onDone={() => navigate('browse-venue')} />
        )}

        {screen === 'venue' && (
          <VenueScreen
            key={screenKey}
            onBack={goBack}
            onNext={(venue: Venue) => {
              setData(d => ({ ...d, venue }))
              navigate('datetime')
            }}
          />
        )}

        {screen === 'datetime' && (
          <DateTimeScreen
            key={screenKey}
            onBack={goBack}
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
            onBack={goBack}
            onNext={(text: string) => {
              const submittedAt = new Date()
              setData(d => ({ ...d, text, submittedAt }))
              navigate('posted')
            }}
          />
        )}

        {screen === 'posted' && (
          <PostedScreen
            key={screenKey}
            data={data}
            onViewNote={() => {
              const mine = myLiveNotes()[0]
              if (mine) setMyNoteId(mine.id)
              navigate('my-note-detail')
            }}
            onBack={goBack}
          />
        )}

        {screen === 'expiry' && (
          <ExpiryScreen
            key={screenKey}
            onRestart={() => { setData({}); navigate('choice') }}
          />
        )}

        {screen === 'browse-venue' && (
          <BrowseVenueScreen
            key={screenKey}
            onBack={goBack}
            onNext={(venue: Venue) => {
              setBrowseVenue(venue)
              setInitialNoteId(undefined)
              setBrowseNotesBack('browse-venue')
              navigate('browse-notes')
            }}
          />
        )}

        {screen === 'browse-notes' && browseVenue && (
          <BrowseNotesScreen
            key={screenKey}
            venue={browseVenue}
            initialNoteId={initialNoteId}
            notes={browseNotes}
            context={browseNotesBack === 'look' ? 'look' : 'browse'}
            onBack={goBack}
            onRespond={(note: Note) => {
              setActiveNote(note)
              navigate('browse-respond')
            }}
            onViewMyNote={(note: Note) => {
              setMyNoteId(note.id)
              navigate('my-note-detail')
            }}
          />
        )}

        {screen === 'browse-respond' && activeNote && (
          <BrowseRespondScreen
            key={screenKey}
            note={activeNote}
            onBack={goBack}
            onSent={() => navigate('response-sent')}
          />
        )}

        {screen === 'response-sent' && (
          <ResponseSentScreen
            key={screenKey}
            onDone={() => navigate('choice')}
          />
        )}

        {screen === 'notifications' && (
          <NotificationsScreen
            key={screenKey}
            onClose={goBack}
            onViewResponse={(noteId: string) => {
              setMyNoteId(noteId)
              navigate('view-response')
            }}
          />
        )}

        {screen === 'my-notes' && (
          <MyNotesScreen
            key={screenKey}
            onBack={goBack}
            onSelect={(note: Note) => {
              setMyNoteId(note.id)
              navigate('my-note-detail')
            }}
          />
        )}

        {screen === 'my-note-detail' && (
          <MyNoteDetailScreen
            key={screenKey}
            notes={[...myLiveNotes(), ...myPastNotes()]}
            initialNoteId={myNoteId}
            onBack={goBack}
            onViewResponse={() => navigate('view-response')}
          />
        )}

        {screen === 'view-response' && myNoteId && DEMO_RESPONSES[myNoteId] && (() => {
          const note = [...myLiveNotes(), ...myPastNotes()].find(n => n.id === myNoteId)
          return note ? (
            <ViewResponseScreen
              key={screenKey}
              note={note}
              responses={DEMO_RESPONSES[myNoteId]}
              onBack={goBack}
              onOpenChat={() => navigate('choice')}
              onDecline={() => navigate('my-notes')}
            />
          ) : null
        })()}

        {screen === 'settings' && <SettingsScreen key={screenKey} onClose={goBack} />}

        {showMenu && (
          <BurgerMenu
            onHome={() => navigate('choice')}
            onLeave={() => { setData({}); navigate('onboarding-leave') }}
            onFind={() => { setData({}); navigate('onboarding-find') }}
            onLook={() => navigate('look')}
            onNotifications={() => navigate('notifications')}
            onMyNotes={() => navigate('my-notes')}
            onSettings={() => navigate('settings')}
            notificationCount={2}
          />
        )}

      </div>
    </main>
  )
}
