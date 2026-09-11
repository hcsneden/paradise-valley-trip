import { useState } from 'react'
import { days } from '../data/trip'
import type { Suggestion, TripState, VoteDir } from '../lib/store'
import { VoteControl } from './VoteControl'
import { WhoPicker } from './WhoPicker'

interface DaysTabProps {
  state: TripState
  who: string
  onWho: (name: string) => void
  votes: Record<string, VoteDir>
  onAdd: (dayId: number, text: string, time: string) => void
  onVote: (id: string, next: VoteDir) => void
  onPlanVote: (id: string, next: VoteDir) => void
  onAddNote: (itemId: string, text: string) => void
  onRemoveNote: (id: string) => void
}

/** '14:30' off the time input, '2:30 pm' on the page. */
const formatTime = (value: string) => {
  const [rawHour, minute] = value.split(':')
  const hour = Number(rawHour)
  if (!Number.isFinite(hour) || !minute) return value
  const suffix = hour < 12 ? 'am' : 'pm'
  return `${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${suffix}`
}

export const DaysTab = ({
  state,
  who,
  onWho,
  votes,
  onAdd,
  onVote,
  onPlanVote,
  onAddNote,
  onRemoveNote,
}: DaysTabProps) => {
  const [dayId, setDayId] = useState(1)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [draft, setDraft] = useState('')
  const [draftTime, setDraftTime] = useState('')
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})

  const day = days.find((entry) => entry.id === dayId)!
  const suggestions = state.suggestions
    .filter((suggestion) => suggestion.dayId === dayId)
    .sort((a, b) => b.votes - a.votes)

  const submit = () => {
    if (!draft.trim()) return
    onAdd(dayId, draft.trim(), draftTime)
    setDraft('')
    setDraftTime('')
  }

  const submitNote = (itemId: string) => {
    const text = (noteDrafts[itemId] ?? '').trim()
    if (!text) return
    onAddNote(itemId, text)
    setNoteDrafts((current) => ({ ...current, [itemId]: '' }))
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

      <div className="day-body">
      <div className="rows">
        {day.items.map((item) => {
          const expanded = Boolean(open[item.id])
          const notes = state.notes.filter((note) => note.itemId === item.id)
          const noteDraft = noteDrafts[item.id] ?? ''
          return (
            <div key={item.id} className="item-row">
              <div className="item-head">
                <button
                  className="item-toggle"
                  onClick={() => setOpen((current) => ({ ...current, [item.id]: !expanded }))}
                  aria-expanded={expanded}
                  aria-controls={expanded ? `${item.id}-detail` : undefined}
                >
                  <span className="item-time">{item.time}</span>
                  <span className="item-body">
                    <span className="item-title">{item.title}</span>
                  </span>
                  {!expanded && notes.length > 0 && (
                    <span
                      className="note-count"
                      aria-label={`${notes.length} note${notes.length === 1 ? '' : 's'}`}
                    >
                      {notes.length}
                    </span>
                  )}
                  <span className="chev">{expanded ? '▲' : '▼'}</span>
                </button>
                <VoteControl
                  score={state.planVotes[item.id] ?? 0}
                  mine={votes[item.id] ?? 0}
                  label={item.title}
                  onVote={(next) => onPlanVote(item.id, next)}
                />
              </div>

              {/* Outside the toggle button, which cannot legally hold the note input. */}
              {expanded && (
                <div className="item-expand" id={`${item.id}-detail`}>
                  <span className="item-detail">{item.detail}</span>
                  {item.tag && <span className={`tag ${item.tagTone ?? 'trail'}`}>{item.tag}</span>}

                  {notes.length > 0 && (
                    <div className="notes">
                      {notes.map((note) => (
                        <div key={note.id} className="note">
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span className="note-text">{note.text}</span>
                            <span className="note-by">{note.by}</span>
                          </span>
                          <button
                            className="x-btn"
                            onClick={() => onRemoveNote(note.id)}
                            aria-label={`Remove note from ${note.by}`}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="note-add">
                    <input
                      className="pill-input"
                      value={noteDraft}
                      onChange={(event) =>
                        setNoteDrafts((current) => ({ ...current, [item.id]: event.target.value }))
                      }
                      onKeyDown={(event) => event.key === 'Enter' && submitNote(item.id)}
                      placeholder="Add a note…"
                      aria-label={`Add a note to ${item.title}`}
                    />
                    <button
                      className="btn-forest"
                      onClick={() => submitNote(item.id)}
                      disabled={!noteDraft.trim()}
                    >
                      Add
                    </button>
                  </div>
                  <p className="note-as">as {who}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="ideas-pad">
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
                <VoteControl
                  score={suggestion.votes}
                  mine={votes[suggestion.id] ?? 0}
                  label={suggestion.text}
                  onVote={(next) => onVote(suggestion.id, next)}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="sug-text">{suggestion.text}</span>
                  <span className="sug-by">
                    {suggestion.time && <span className="sug-time">{formatTime(suggestion.time)}</span>}
                    {suggestion.by}
                  </span>
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
            <input
              className="pill-input time-input"
              type="time"
              value={draftTime}
              onChange={(event) => setDraftTime(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
              aria-label="Time for this idea"
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
      </div>
    </>
  )
}
