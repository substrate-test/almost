import type { Venue, Note } from '@/types'

export const VENUES: Venue[] = [
  // Bars
  { id: '1',  name: 'Nightjar',              address: '129 City Road, Shoreditch',                    lat: 51.5235, lng: -0.0858 },
  { id: '2',  name: 'Lyaness',               address: 'Sea Containers, 20 Upper Ground, South Bank',  lat: 51.5069, lng: -0.1111 },
  { id: '3',  name: 'Oriole',                address: 'East Poultry Avenue, Smithfield',              lat: 51.5198, lng: -0.1008 },
  { id: '4',  name: 'Three Sheets',          address: '510b Kingsland Road, Dalston',                 lat: 51.5494, lng: -0.0726 },
  { id: '5',  name: "Satan's Whiskers",      address: '343 Cambridge Heath Road, Bethnal Green',      lat: 51.5283, lng: -0.0594 },
  { id: '6',  name: 'Callooh Callay',        address: '65 Rivington Street, Shoreditch',              lat: 51.5253, lng: -0.0790 },
  { id: '7',  name: 'Happiness Forgets',     address: '8–9 Hoxton Square, Hoxton',                   lat: 51.5285, lng: -0.0793 },
  { id: '8',  name: 'The Connaught Bar',     address: 'Carlos Place, Mayfair',                        lat: 51.5115, lng: -0.1472 },
  { id: '9',  name: 'Dukes Bar',             address: "35 St James's Place, St James's",              lat: 51.5057, lng: -0.1393 },
  { id: '10', name: 'American Bar',          address: 'The Savoy, Strand',                            lat: 51.5104, lng: -0.1205 },
  // Clubs
  { id: '11', name: 'Fabric',                address: '77a Charterhouse Street, Farringdon',          lat: 51.5203, lng: -0.1018 },
  { id: '12', name: 'XOYO',                  address: '32–37 Cowper Street, Shoreditch',              lat: 51.5249, lng: -0.0854 },
  { id: '13', name: 'Egg London',            address: "200 York Way, King's Cross",                   lat: 51.5446, lng: -0.1183 },
  { id: '14', name: 'Village Underground',   address: '54 Holywell Lane, Shoreditch',                 lat: 51.5255, lng: -0.0784 },
  { id: '15', name: 'Corsica Studios',       address: '4–5 Elephant Road, Elephant & Castle',        lat: 51.4940, lng: -0.0997 },
  { id: '25', name: 'Fold',                  address: '7 Bream Street, Canning Town',                 lat: 51.5165, lng:  0.0077 },
  { id: '26', name: 'The Cause',             address: 'Reindeer Court, Tottenham Hale',               lat: 51.5882, lng: -0.0595 },
  { id: '27', name: 'MOT',                   address: '17 Bermondsey Wall West, Bermondsey',          lat: 51.4985, lng: -0.0618 },
  { id: '28', name: 'Phonox',                address: '418 Brixton Road, Brixton',                    lat: 51.4624, lng: -0.1140 },
  { id: '29', name: 'Electric Brixton',      address: 'Town Hall Parade, Brixton',                    lat: 51.4625, lng: -0.1148 },
  { id: '30', name: 'Oval Space',            address: '29–32 The Oval, Bethnal Green',                lat: 51.5283, lng: -0.0640 },
  { id: '31', name: 'EartH',                 address: '11–17 Stoke Newington Road, Hackney',          lat: 51.5493, lng: -0.0713 },
  { id: '32', name: 'Tobacco Dock',          address: 'Tobacco Quay, Wapping Lane, Wapping',         lat: 51.5082, lng: -0.0580 },
  { id: '33', name: 'Scala',                 address: "275 Pentonville Road, King's Cross",           lat: 51.5302, lng: -0.1202 },
  { id: '34', name: 'Studio 338',            address: '338 Boord Street, Greenwich',                  lat: 51.4998, lng:  0.0088 },
  { id: '35', name: 'Lost',                  address: 'London',                                       lat: 51.5344, lng: -0.0678 },
  { id: '36', name: 'Palais',                address: '1a Rye Lane, Peckham, SE15',                   lat: 51.4696, lng: -0.0693 },
  { id: '37', name: 'The Pickle Factory',    address: '13 Arches Lane, Bethnal Green',                lat: 51.5275, lng: -0.0590 },
  { id: '38', name: 'Oslo',                  address: '1a Amhurst Road, Hackney Central',             lat: 51.5483, lng: -0.0548 },
  { id: '39', name: 'Brilliant Corners',     address: '470 Kingsland Road, Dalston',                  lat: 51.5494, lng: -0.0726 },
  { id: '40', name: 'E1',                    address: '1 Whitechapel High Street, Whitechapel',       lat: 51.5162, lng: -0.0714 },
  { id: '41', name: 'Total Refreshment Centre', address: '74 Stoke Newington Road, Hackney',         lat: 51.5474, lng: -0.0730 },
  // Restaurants
  { id: '16', name: 'Dishoom',               address: '7 Boundary Street, Shoreditch',                lat: 51.5253, lng: -0.0790 },
  { id: '17', name: 'Brat',                  address: '4 Redchurch Street, Shoreditch',               lat: 51.5253, lng: -0.0771 },
  { id: '18', name: 'Kiln',                  address: '58 Brewer Street, Soho',                       lat: 51.5138, lng: -0.1347 },
  { id: '19', name: 'Padella',               address: '6 Southwark Street, Borough Market',           lat: 51.5054, lng: -0.0902 },
  { id: '20', name: 'Smoking Goat',          address: '64 Shoreditch High Street, Shoreditch',        lat: 51.5235, lng: -0.0769 },
  { id: '21', name: 'Quo Vadis',             address: '26–29 Dean Street, Soho',                     lat: 51.5130, lng: -0.1333 },
  { id: '22', name: 'BAO Soho',              address: '53 Lexington Street, Soho',                    lat: 51.5133, lng: -0.1355 },
  { id: '23', name: 'St. JOHN',              address: '26 St John Street, Smithfield',                lat: 51.5202, lng: -0.1013 },
  { id: '24', name: 'Gymkhana',              address: '42 Albemarle Street, Mayfair',                 lat: 51.5096, lng: -0.1449 },
  { id: '42', name: 'Star Lane Pizza',       address: 'Star Lane, Canning Town',                      lat: 51.5163, lng:  0.0077 },
  { id: '43', name: 'Brawn',                 address: '49 Columbia Road, Bethnal Green',              lat: 51.5290, lng: -0.0572 },
  { id: '44', name: 'Lore of the Land',      address: '4 Conway Street, Fitzrovia',                   lat: 51.5228, lng: -0.1358 },
  { id: '45', name: 'The Marksman',          address: '254 Hackney Road, Hackney',                    lat: 51.5344, lng: -0.0678 },
  { id: '46', name: 'Bao Fitzrovia',         address: '31 Windmill Street, Fitzrovia',                lat: 51.5197, lng: -0.1382 },
]

const now = Date.now()
const h = (n: number) => new Date(now - n * 60 * 60 * 1000)

export const DEMO_NOTES: Note[] = [
  {
    id: 'n1',
    text: `You were quietly crying in the queue, hiding it behind your hair. I handed you my drink and you laughed. We talked for almost an hour.\n\nI loved the way you touched your collarbone when you were thinking. You smelled like something floral I still can't place. 🌸 I've been thinking about you ever since.`,
    venue: VENUES.find(v => v.id === '7')!,
    datetime: h(3),
    submittedAt: h(3),
  },
  {
    id: 'n2',
    text: `Black leather jacket, reading on your phone in the corner. You looked up and we locked eyes for a second too long. I nearly came over four times. 🖤\n\nYou left before I could. If you were there last night — was that you?`,
    venue: VENUES.find(v => v.id === '1')!,
    datetime: h(6),
    submittedAt: h(6),
  },
  {
    id: 'n3',
    text: `We argued about the DJ for twenty minutes then danced together for an hour anyway. You knew every word to something I'd never heard before.\n\nI still don't know your name. 🎶 I know you felt it too.`,
    venue: VENUES.find(v => v.id === '11')!,
    datetime: h(10),
    submittedAt: h(10),
  },
  {
    id: 'n4',
    text: `You spilled my drink and apologised three times. Bought me another and stayed to make sure I wasn't annoyed.\n\nI wasn't annoyed. I was completely gone. ✨ The way you smiled when you realised I wasn't — I keep seeing it. Where did you go?`,
    venue: VENUES.find(v => v.id === '25')!,
    datetime: h(14),
    submittedAt: h(14),
  },
  {
    id: 'n5',
    text: `You were with your friends but kept drifting away from them, toward me. We never actually spoke. Just kept orbiting each other all night.\n\nYou had paint on your trainers and a ring on every finger. 💫 I think about that every time I hear that song now.`,
    venue: VENUES.find(v => v.id === '7')!,
    datetime: h(22),
    submittedAt: h(22),
  },
  {
    id: 'n6',
    text: `We shared the last table outside. You were reading, I pretended to be on my phone. We talked for two hours and I never got your number.\n\nYou had the most specific opinions about everything and I loved it. 🥂 Please find this.`,
    venue: VENUES.find(v => v.id === '18')!,
    datetime: h(5),
    submittedAt: h(5),
  },
]

export const WINDOW_HOURS = 24

export function msLeft(note: Note): number {
  return note.submittedAt.getTime() + WINDOW_HOURS * 3600 * 1000 - Date.now()
}

export function isLive(note: Note): boolean {
  return msLeft(note) > 0
}

export function notesForVenue(venueId: string): Note[] {
  return DEMO_NOTES.filter(n => n.venue.id === venueId && isLive(n))
}

export function liveNoteCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  DEMO_NOTES.filter(isLive).forEach(n => {
    counts[n.venue.id] = (counts[n.venue.id] || 0) + 1
  })
  return counts
}

// Returns venue IDs where at least one note expires within 3 hours
export function expiringVenueIds(): Set<string> {
  const ids = new Set<string>()
  DEMO_NOTES.filter(isLive).forEach(n => {
    if (msLeft(n) < 3 * 3600 * 1000) ids.add(n.venue.id)
  })
  return ids
}

// Returns the minimum ms remaining across all live notes for a venue
export function minMsLeftForVenue(venueId: string): number {
  const notes = DEMO_NOTES.filter(n => n.venue.id === venueId && isLive(n))
  if (!notes.length) return 0
  return Math.min(...notes.map(msLeft))
}

export function formatShortCountdown(ms: number): string {
  if (ms <= 0) return '0m'
  const hours = Math.floor(ms / 3600000)
  const mins = Math.floor((ms % 3600000) / 60000)
  if (hours > 0) return `${hours}h`
  return `${mins}m`
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '0:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
