import { useState } from 'react'
import { days } from '../data/trip'
import type { Suggestion, TripState } from '../lib/store'
import { WhoPicker } from './WhoPicker'

interface DaysTabProps {
  state: TripState
  who: string
  onWho: (name: string) => void
  voted: Record<string, boolean>
  onAdd: (dayId: number, text: string) => void
  onVote: (id: string) => void
}

export const DaysTab = ({ state, who, onWho, voted, onAdd, onVote }: DaysTabProps) => {
  const [dayId, setDayId] = useState(1)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [draft, setDraft] = useState('')

  const day = days.find((entry) => entry.id === dayId)!
  const suggestions = state.suggestions
    .filter((suggestion) => suggestion.dayId === dayId)
    .sort((a, b) => b.votes - a.votes)

  const submit = () => {
    if (!draft.trim()) return
    onAdd(dayId, draft.trim())
    setDraft('')
  }

  return (
    <>
      <div className="day-strip">
        {days.map((entry) => (
          <button
            key={entry.id}
            className={entry.id === dayId ? 'day-pill active' : 'day-pill'}
            onClick={() => setDayId(entry.id)}
            aria-current={entry.id === dayId}
          >
            <span className="dow">{entry.dow}</span>
            <span className="num">{entry.num}</span>
          </button>
        ))}
      </div>

      <div className="day-head">
        <h2>{day.title}</h2>
        <p>{day.note}</p>
      </div>

      <div className="rows">
        {day.items.map((item, index) => {
          const key = `${dayId}-${index}`
          const expanded = Boolean(open[key])
          return (
            <button
              key={key}
              className="item-row"
              onClick={() => setOpen({ ...open, [key]: !expanded })}
              aria-expanded={expanded}
            >
              <span className="item-time">{item.time}</span>
              <span className="item-body">
                <span className="item-title">{item.title}</span>
                {expanded && (
                  <>
                    <span className="item-detail" style={{ display: 'block' }}>
                      {item.detail}
                    </span>
                    {item.tag && <span className={`tag ${item.tagTone ?? 'trail'}`}>{item.tag}</span>}
                  </>
                )}
              </span>
              <span className="chev">{expanded ? '▲' : '▼'}</span>
            </button>
          )
        })}
      </div>

      <div style={{ padding: '18px 20px 0' }}>
        <div className="dashed">
          <div className="dashed-head">
            <span className="eyebrow">Ideas for this day</span>
            <span className="count">
              {suggestions.length === 0
                ? 'none yet'
                : `${suggestions.length} idea${suggestions.length === 1 ? '' : 's'}`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {suggestions.length === 0 && (
              <p className="footnote" style={{ margin: 0 }}>
                Nothing yet. Be the first to throw one in.
              </p>
            )}
            {suggestions.map((suggestion: Suggestion) => (
              <div key={suggestion.id} className="sug">
                <button
                  className={voted[suggestion.id] ? 'vote voted' : 'vote'}
                  onClick={() => onVote(suggestion.id)}
                  disabled={Boolean(voted[suggestion.id])}
                  aria-label={`Upvote: ${suggestion.text}`}
                >
                  <span className="caret">▲</span>
                  {suggestion.votes}
                </button>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="sug-text">{suggestion.text}</span>
                  <span className="sug-by">{suggestion.by}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="add-row">
            <input
              className="pill-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
              placeholder="Throw one in…"
              aria-label="Add an idea for this day"
            />
            <button className="btn-forest" onClick={submit} disabled={!draft.trim()}>
              Post
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            <WhoPicker value={who} onChange={onWho} label="Posting as" />
          </div>
        </div>
      </div>
    </>
  )
}
