export interface Venue {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

export interface Note {
  id: string
  text: string
  venue: Venue
  datetime: Date
  submittedAt: Date
}

export interface MomentData {
  venue?: Venue
  datetime?: Date
  text?: string
  submittedAt?: Date
  noteId?: string
}

export type Screen =
  | 'landing'
  | 'choice'
  | 'onboarding-leave'
  | 'onboarding-find'
  | 'venue'
  | 'datetime'
  | 'write'
  | 'auth'
  | 'live'
  | 'posted'
  | 'expiry'
  | 'browse-venue'
  | 'look'
  | 'browse-notes'
  | 'browse-respond'
  | 'browse-auth'
