import type { VoteDir } from '../lib/store'

interface VoteControlProps {
  score: number
  mine: VoteDir
  label: string
  onVote: (next: VoteDir) => void
}

/** Up, down or neither. Pressing the arrow you already chose clears back to neutral. */
export const VoteControl = ({ score, mine, label, onVote }: VoteControlProps) => (
  <div className="voteset">
    <button
      className={mine === 1 ? 'vote-arrow on up' : 'vote-arrow up'}
      onClick={() => onVote(mine === 1 ? 0 : 1)}
      aria-pressed={mine === 1}
      aria-label={`Vote up: ${label}`}
    >
      ▲
    </button>
    <span className={score > 0 ? 'vote-score up' : score < 0 ? 'vote-score down' : 'vote-score'}>
      {score > 0 ? `+${score}` : score}
    </span>
    <button
      className={mine === -1 ? 'vote-arrow on down' : 'vote-arrow down'}
      onClick={() => onVote(mine === -1 ? 0 : -1)}
      aria-pressed={mine === -1}
      aria-label={`Vote down: ${label}`}
    >
      ▼
    </button>
  </div>
)
