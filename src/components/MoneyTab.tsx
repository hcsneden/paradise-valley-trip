import { useState } from 'react'
import { partyFor, roster } from '../data/trip'
import { WhoPicker } from './WhoPicker'
import type { Expense, TripState } from '../lib/store'

const money = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const money2 = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const parseAmount = (raw: string) => {
  const cleaned = raw.replace(/[^\d.]/g, '')
  const value = Number.parseFloat(cleaned)
  return Number.isFinite(value) && value > 0 ? value : null
}

interface MoneyTabProps {
  state: TripState
  who: string
  onWho: (name: string) => void
  onAdd: (expense: Omit<Expense, 'id'>) => void
  onRemove: (id: string) => void
}

export const MoneyTab = ({ state, who, onWho, onAdd, onRemove }: MoneyTabProps) => {
  const [view, setView] = useState<'bal' | 'exp'>('bal')
  const [what, setWhat] = useState('')
  const [amount, setAmount] = useState('')

  const total = state.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const share = total / roster.length

  const balances = roster
    .map((party) => {
      const paid = state.expenses
        .filter((expense) => expense.by === party.name)
        .reduce((sum, expense) => sum + expense.amount, 0)
      return { name: party.name, balance: paid - share }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const submit = () => {
    const value = parseAmount(amount)
    if (!what.trim() || value === null) return
    onAdd({ what: what.trim(), by: partyFor(who), amount: value })
    setWhat('')
    setAmount('')
  }

  return (
    <div className="section-pad">
      <div className="total-card">
        <div>
          <span className="lab">Trip total</span>
          <span className="big">{money(total)}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="lab">Each</span>
          <span className="small">{money(share)}</span>
        </div>
      </div>

      <div className="segmented">
        <button className={view === 'bal' ? 'active' : undefined} onClick={() => setView('bal')}>
          Balances
        </button>
        <button className={view === 'exp' ? 'active' : undefined} onClick={() => setView('exp')}>
          Receipts
        </button>
      </div>

      {view === 'bal' ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {balances.map((entry) => {
              const even = Math.abs(entry.balance) < 1
              const tone = even ? 'even' : entry.balance > 0 ? 'gets' : 'owes'
              const text = even
                ? 'even'
                : entry.balance > 0
                  ? `gets ${money2(entry.balance)}`
                  : `owes ${money2(Math.abs(entry.balance))}`
              return (
                <div key={entry.name} className="list-row">
                  <span className="name">{entry.name}</span>
                  <span className={`status ${tone}`}>{text}</span>
                </div>
              )
            })}
          </div>
          <p className="footnote">
            Green gets paid back, rust owes. Split {roster.length} ways across the parties on the trip,
            not per head.
          </p>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.expenses.length === 0 && <p className="empty">Nothing logged yet.</p>}
          {state.expenses.map((expense) => (
            <div key={expense.id} className="list-row">
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="name" style={{ display: 'block' }}>
                  {expense.what}
                </span>
                <span className="sug-by">{expense.by}</span>
              </span>
              <span className="tnum" style={{ font: '800 15px var(--sans)' }}>
                {money2(expense.amount)}
              </span>
              <button className="x-btn" onClick={() => onRemove(expense.id)} aria-label={`Remove ${expense.what}`}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="dashed">
        <input
          className="pill-input"
          style={{ width: '100%' }}
          value={what}
          onChange={(event) => setWhat(event.target.value)}
          placeholder="What was it?"
          aria-label="Expense description"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            className="pill-input"
            style={{ flex: 'none', width: 96, textAlign: 'right' }}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submit()}
            placeholder="$0"
            inputMode="decimal"
            aria-label="Amount"
          />
          <button
            className="btn-forest"
            style={{ flex: 1 }}
            onClick={submit}
            disabled={!what.trim() || parseAmount(amount) === null}
          >
            Log it
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          <WhoPicker value={who} onChange={onWho} label="Paid by" />
        </div>
        <p className="footnote" style={{ margin: '10px 0 0' }}>
          Logged against {partyFor(who)}. Everything splits {roster.length} ways between the parties,
          so the cost lands on whoever you are travelling with.
        </p>
      </div>
    </div>
  )
}
