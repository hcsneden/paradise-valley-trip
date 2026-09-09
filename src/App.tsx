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
  voteDelta,
  votePlan,
  voteSuggestion,
  type Expense,
  type Pin,
  type TripState,
  type VoteDir,
} from './lib/store'

// v2: the old key held booleans from the upvote-only days, which cannot express a downvote.
const VOTED_KEY = 'pv-trip-votes-v2'

const readStored = (key: string, fallback: string) => {
  try {
    // An empty string is a missing value here, not a real one: `??` would let it
    // through and the who-picker would show a name while posting without one.
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export const App = () => {
  const [tab, setTab] = useState<Tab>('days')
  const [state, setState] = useState<TripState>(seedState)
  const [who, setWho] = useState(() => readStored(USER_KEY, members[0].name))
  const [votes, setVotes] = useState<Record<string, VoteDir>>(() => {
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
      .catch(() => setError('Could not reach the trip sheet. Showing the fixed plan only, without anything the group has added.'))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(USER_KEY, who)
    } catch {
      // A blocked localStorage means the picker resets next visit, nothing worse.
    }
  }, [who])

  const run = (work: Promise<TripState>) => {
    work.then(setState).catch((err: Error) => setError(err.message))
  }

  /**
   * Sends the swing between where this browser stood and where it now stands, and
   * records the new position only once the write lands. Committing first would leave a
   * failed vote remembered locally but missing from the sheet, and every later swing on
   * that item would then be measured from a position the sheet never saw.
   */
  const castVote = (
    id: string,
    next: VoteDir,
    send: (delta: number) => Promise<TripState>
  ) => {
    const previous = votes[id] ?? 0
    const delta = voteDelta(previous, next)
    if (!delta) return
    send(delta)
      .then((updated) => {
        setState(updated)
        setVotes((current) => {
          const recorded = { ...current, [id]: next }
          try {
            localStorage.setItem(VOTED_KEY, JSON.stringify(recorded))
          } catch {
            // A blocked localStorage costs this browser its vote memory, not the vote itself.
          }
          return recorded
        })
      })
      .catch((err: Error) => setError(err.message))
  }

  return (
    <div className="app">
      <div className="layout">
        <div className="sidebar">
          <Header />
          <TabBar tab={tab} onTab={setTab} />
        </div>

        <div className="main">
          {error && (
            <div className="section-pad" style={{ paddingBottom: 0 }}>
              <p className="sync-note">{error}</p>
            </div>
          )}

          {!isSheetConfigured() && !error && (
            <div className="section-pad" style={{ paddingBottom: 0 }}>
              <p className="sync-note">
                Not connected to the trip sheet yet, so ideas, votes, pins and expenses save on this
                device only. Nobody else sees them until it is hooked up.
              </p>
            </div>
          )}

          <div className="pane pane-days" style={{ display: tab === 'days' ? 'block' : 'none' }}>
            <DaysTab
              state={state}
              who={who}
              onWho={setWho}
              votes={votes}
              onAdd={(dayId, text, time) => run(addSuggestion(state, { dayId, text, time, by: who }))}
              onVote={(id, next) =>
                castVote(id, next, (delta) => voteSuggestion(state, id, delta))
              }
              onPlanVote={(id, next) => castVote(id, next, (delta) => votePlan(state, id, delta))}
            />
          </div>

          <div className="pane pane-map" style={{ display: tab === 'map' ? 'block' : 'none' }}>
            <MapTab
              state={state}
              who={who}
              onWho={setWho}
              onAdd={(pin: Omit<Pin, 'id'>) => run(addPin(state, pin))}
              onRemove={(id) => run(removePin(state, id))}
            />
          </div>

          <div className="pane pane-house" style={{ display: tab === 'house' ? 'block' : 'none' }}>
            <HouseTab />
          </div>

          <div className="pane pane-money" style={{ display: tab === 'money' ? 'block' : 'none' }}>
            <MoneyTab
              state={state}
              who={who}
              onWho={setWho}
              onAdd={(expense: Omit<Expense, 'id'>) => run(addExpense(state, expense))}
              onRemove={(id) => run(removeExpense(state, id))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
