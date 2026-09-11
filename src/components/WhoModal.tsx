import { useEffect, useRef } from 'react'
import { members } from '../data/trip'

interface WhoModalProps {
  onPick: (name: string) => void
}

/**
 * First visit only: nothing is stored under the user key yet, so everything posted would
 * otherwise be attributed to whoever happened to be first in `members`. Picking a name here
 * writes it to localStorage, and every picker in the app reads the same value afterwards.
 */
export const WhoModal = ({ onPick }: WhoModalProps) => {
  const firstRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    firstRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="who-modal-title">
      <div className="modal">
        <span className="eyebrow">Before you start</span>
        <h2 id="who-modal-title">Who are you?</h2>
        <p>
          So your notes, ideas, pins and expenses land under your name, and the settle-up bills the
          right family. You can change it later from any picker.
        </p>

        <div className="who-grid">
          {members.map((member, index) => (
            <button
              key={member.name}
              ref={index === 0 ? firstRef : undefined}
              className="who-choice"
              onClick={() => onPick(member.name)}
            >
              <span className="who-name">{member.name}</span>
              <span className="who-party">{member.party}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
