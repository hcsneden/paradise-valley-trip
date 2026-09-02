import { seedExpenses, seedPins, type PinCategory } from '../data/trip'

export const SHEET_ENDPOINT = ''

export interface Pin {
  id: string
  name: string
  category: PinCategory
  lat: number
  lng: number
  note: string
  addedBy: string
  seed?: boolean
}

export interface Suggestion {
  id: string
  dayId: number
  text: string
  by: string
  votes: number
}

export interface Expense {
  id: string
  what: string
  by: string
  amount: number
}

export interface TripState {
  pins: Pin[]
  suggestions: Suggestion[]
  expenses: Expense[]
}

const LOCAL_KEY = 'pv-trip-state-v2'
export const USER_KEY = 'pv-trip-user'

export const isSheetConfigured = () => SHEET_ENDPOINT.length > 0

export const seedState = (): TripState => ({
  pins: seedPins.map((pin) => ({ ...pin, addedBy: '', seed: true })),
  suggestions: [],
  expenses: seedExpenses.map((expense) => ({ ...expense })),
})

const readLocal = (): TripState => {
  const seeded = seedState()
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? 'null')
    if (!saved) return seeded
    return {
      pins: [...seeded.pins, ...(saved.pins ?? [])],
      suggestions: saved.suggestions ?? [],
      expenses: saved.expenses ?? seeded.expenses,
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
        expenses: state.expenses,
      })
    )
  } catch {
    return
  }
}

const merge = (remote: Partial<TripState>): TripState => {
  const seeded = seedState()
  return {
    pins: [...seeded.pins, ...(remote.pins ?? [])],
    suggestions: remote.suggestions ?? [],
    expenses: remote.expenses?.length ? remote.expenses : seeded.expenses,
  }
}

export const loadState = async (): Promise<TripState> => {
  if (!isSheetConfigured()) return readLocal()
  const res = await fetch(SHEET_ENDPOINT)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error ?? 'Could not load the trip')
  return merge(data)
}

const post = async (body: unknown): Promise<TripState> => {
  const res = await fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error ?? 'Could not save')
  return merge(data)
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

export const voteSuggestion = async (state: TripState, id: string): Promise<TripState> => {
  if (isSheetConfigured()) return post({ kind: 'suggestion', action: 'vote', id })
  return localMutate(state, {
    suggestions: state.suggestions.map((suggestion) =>
      suggestion.id === id ? { ...suggestion, votes: suggestion.votes + 1 } : suggestion
    ),
  })
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
