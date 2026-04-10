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
  mine?: boolean
  moves?: number
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
  | 'register-auth'
  | 'register-name'
  | 'register-dob'
  | 'choice'
  | 'onboarding-leave'
  | 'onboarding-find'
  | 'venue'
  | 'datetime'
  | 'write'
  | 'posted'
  | 'expiry'
  | 'browse-venue'
  | 'look'
  | 'browse-notes'
  | 'browse-respond'
  | 'response-sent'
  | 'my-notes'
  | 'my-note-detail'
  | 'view-response'
  | 'notifications'
  | 'settings'
