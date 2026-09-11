import { seedExpenses, seedPins, type SeedPin } from '../data/trip'

export const SHEET_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwGVEHui87PM0uCe7EF1d5-A6WCKCj61y0r06CcuoxeJjeOud2DoX6XjQoLemoM00B3yw/exec'

export interface Pin extends SeedPin {
  addedBy: string
  seed?: boolean
}

export interface Suggestion {
  id: string
  dayId: number
  text: string
  by: string
  time: string
  votes: number
}

/** A free-text comment on one fixed itinerary row, keyed by its id in `data/trip.ts`. */
export interface Note {
  id: string
  itemId: string
  text: string
  by: string
}

export interface Expense {
  id: string
  what: string
  by: string
  amount: number
  seed?: boolean
}

export interface TripState {
  pins: Pin[]
  suggestions: Suggestion[]
  notes: Note[]
  expenses: Expense[]
  planVotes: Record<string, number>
}

/** A person is up (+1), down (-1) or neutral (0) on any one item. */
export type VoteDir = 1 | -1 | 0

/** What the Apps Script returns: plan votes arrive as sheet rows, not a keyed map. */
interface RemoteSnapshot {
  pins?: Pin[]
  suggestions?: Suggestion[]
  notes?: Note[]
  expenses?: Expense[]
  planVotes?: { id: string; votes: number }[]
}

const LOCAL_KEY = 'pv-trip-state-v3'

export const isSheetConfigured = () => SHEET_ENDPOINT.length > 0

export const seedState = (): TripState => ({
  pins: seedPins.map((pin) => ({ ...pin, addedBy: '', seed: true })),
  suggestions: [],
  notes: [],
  expenses: seedExpenses.map((expense) => ({ ...expense, seed: true })),
  planVotes: {},
})

const readLocal = (): TripState => {
  const seeded = seedState()
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? 'null')
    if (!saved) return seeded
    return {
      pins: [...seeded.pins, ...(saved.pins ?? [])],
      suggestions: saved.suggestions ?? [],
      notes: saved.notes ?? [],
      expenses: [...seeded.expenses, ...(saved.expenses ?? [])],
      planVotes: saved.planVotes ?? {},
    }
  } catch {
    return seeded
  }
}

const writeLocal = (state: TripState) => {
  try {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({
        pins: state.pins.filter((pin) => !pin.seed),
        suggestions: state.suggestions,
        notes: state.notes,
        expenses: state.expenses.filter((expense) => !expense.seed),
        planVotes: state.planVotes,
      })
    )
  } catch {
    // A blocked localStorage costs this browser its offline copy, nothing more.
  }
}

const merge = (remote: RemoteSnapshot): TripState => {
  const seeded = seedState()
  return {
    pins: [...seeded.pins, ...(remote.pins ?? [])],
    suggestions: remote.suggestions ?? [],
    notes: remote.notes ?? [],
    // Seeds are prepended, never swapped out: the Airbnb shares are real money that
    // stays on the books once somebody logs their first coffee.
    expenses: [...seeded.expenses, ...(remote.expenses ?? [])],
    planVotes: Object.fromEntries(
      (remote.planVotes ?? []).map((row) => [row.id, Number(row.votes) || 0])
    ),
  }
}

/**
 * Apps Script answers a failure with an HTML error page, not JSON, so the status has to
 * be checked before parsing or the user is shown a JSON syntax error instead of a reason.
 */
const readJson = async (res: Response, fallback: string): Promise<RemoteSnapshot> => {
  if (!res.ok) throw new Error(`${fallback} (${res.status})`)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error ?? fallback)
  return data
}

export const loadState = async (): Promise<TripState> => {
  if (!isSheetConfigured()) return readLocal()
  const res = await fetch(SHEET_ENDPOINT)
  return merge(await readJson(res, 'Could not load the trip'))
}

const post = async (body: unknown): Promise<TripState> => {
  const res = await fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  })
  return merge(await readJson(res, 'Could not save'))
}

const localMutate = (state: TripState, change: Partial<TripState>): TripState => {
  const next = { ...state, ...change }
  writeLocal(next)
  return next
}

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())

export const addPin = async (state: TripState, pin: Omit<Pin, 'id'>): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'pin', action: 'add', ...pin })
  return localMutate(state, { pins: [...state.pins, { ...pin, id: newId() }] })
}

export const removePin = async (state: TripState, id: string): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'pin', action: 'delete', id })
  return localMutate(state, { pins: state.pins.filter((pin) => pin.id !== id) })
}

export const addSuggestion = async (
  state: TripState,
  suggestion: Omit<Suggestion, 'id' | 'votes'>
): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'suggestion', action: 'add', ...suggestion })
  return localMutate(state, {
    suggestions: [...state.suggestions, { ...suggestion, id: newId(), votes: 1 }],
  })
}

/**
 * `delta` is the swing between the voter's old and new position (+1 to -1 is -2), so the
 * sheet only ever adds to a running total. Callers skip the call when the swing is zero.
 */
export const voteSuggestion = async (
  state: TripState,
  id: string,
  delta: number
): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'suggestion', action: 'vote', id, delta })
  return localMutate(state, {
    suggestions: state.suggestions.map((suggestion) =>
      suggestion.id === id ? { ...suggestion, votes: suggestion.votes + delta } : suggestion
    ),
  })
}

export const votePlan = async (
  state: TripState,
  id: string,
  delta: number
): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'planVote', action: 'vote', id, delta })
  return localMutate(state, {
    planVotes: { ...state.planVotes, [id]: (state.planVotes[id] ?? 0) + delta },
  })
}

export const addNote = async (
  state: TripState,
  note: Omit<Note, 'id'>
): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'note', action: 'add', ...note })
  return localMutate(state, { notes: [...state.notes, { ...note, id: newId() }] })
}

export const removeNote = async (state: TripState, id: string): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'note', action: 'delete', id })
  return localMutate(state, { notes: state.notes.filter((note) => note.id !== id) })
}

export const addExpense = async (
  state: TripState,
  expense: Omit<Expense, 'id'>
): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'expense', action: 'add', ...expense })
  return localMutate(state, { expenses: [...state.expenses, { ...expense, id: newId() }] })
}

export const removeExpense = async (state: TripState, id: string): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'expense', action: 'delete', id })
  return localMutate(state, { expenses: state.expenses.filter((expense) => expense.id !== id) })
}
