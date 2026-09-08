import { useEffect, useState } from 'react'
import { members } from './data/trip'
import { Header } from './components/Header'
import { TabBar, type Tab } from './components/TabBar'
import { DaysTab } from './components/DaysTab'
import { MapTab } from './components/MapTab'
import { HouseTab } from './components/HouseTab'
import { MoneyTab } from './components/MoneyTab'
import {
  addExpense,
  addPin,
  addSuggestion,
  isSheetConfigured,
  loadState,
  removeExpense,
  removePin,
  seedState,
  USER_KEY,
  voteSuggestion,
  type Expense,
  type Pin,
  type TripState,
} from './lib/store'

const VOTED_KEY = 'pv-trip-voted'

const readStored = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export const App = () => {
  const [tab, setTab] = useState<Tab>('days')
  const [state, setState] = useState<TripState>(seedState)
  const [who, setWho] = useState(() => readStored(USER_KEY, members[0].name))
  const [voted, setVoted] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(readStored(VOTED_KEY, '{}'))
    } catch {
      return {}
    }
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadState()
      .then(setState)
      .catch(() => setError('Could not reach the trip sheet. Showing what is saved on this device.'))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(USER_KEY, who)
    } catch {
      return
    }
  }, [who])

  const run = (work: Promise<TripState>) => {
    work.then(setState).catch((err: Error) => setError(err.message))
  }

  const markVoted = (id: string) => {
    const next = { ...voted, [id]: true }
    setVoted(next)
    try {
      localStorage.setItem(VOTED_KEY, JSON.stringify(next))
    } catch {
      return
    }
  }

  return (
    <div className="app">
      <Header />

      {error && (
        <div className="section-pad" style={{ paddingBottom: 0 }}>
          <p className="sync-note">{error}</p>
        </div>
      )}

      {!isSheetConfigured() && !error && (
        <div className="section-pad" style={{ paddingBottom: 0 }}>
          <p className="sync-note">
            Not connected to the trip sheet yet, so ideas, votes, pins and expenses save on this device
            only. Nobody else sees them until it is hooked up.
          </p>
        </div>
      )}

      <div style={{ display: tab === 'days' ? 'block' : 'none' }}>
        <DaysTab
          state={state}
          who={who}
          onWho={setWho}
          voted={voted}
          onAdd={(dayId, text) =>
            run(addSuggestion(state, { dayId, text, by: who }))
          }
          onVote={(id) => {
            if (voted[id]) return
            markVoted(id)
            run(voteSuggestion(state, id))
          }}
        />
      </div>

      <div style={{ display: tab === 'map' ? 'block' : 'none' }}>
        <MapTab
          state={state}
          who={who}
          onWho={setWho}
          visible={tab === 'map'}
          onAdd={(pin: Omit<Pin, 'id'>) => run(addPin(state, pin))}
          onRemove={(id) => run(removePin(state, id))}
        />
      </div>

      <div style={{ display: tab === 'house' ? 'block' : 'none' }}>
        <HouseTab />
      </div>

      <div style={{ display: tab === 'money' ? 'block' : 'none' }}>
        <MoneyTab
          state={state}
          who={who}
          onWho={setWho}
          onAdd={(expense: Omit<Expense, 'id'>) => run(addExpense(state, expense))}
          onRemove={(id) => run(removeExpense(state, id))}
        />
      </div>

      <TabBar tab={tab} onTab={setTab} />
    </div>
  )
}
