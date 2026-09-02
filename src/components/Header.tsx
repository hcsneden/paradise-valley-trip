import { trip } from '../data/trip'

const daysOut = () => {
  const start = new Date(`${trip.startsOn}T00:00:00`)
  const diff = Math.ceil((start.getTime() - Date.now()) / 86400000)
  return Math.max(diff, 0)
}

interface HeaderProps {
  user: string
  onUser: (value: string) => void
}

export const Header = ({ user, onUser }: HeaderProps) => (
  <header className="header">
    <div className="header-top">
      <span className="header-eyebrow">{trip.eyebrow}</span>
      <span className="sticker">{daysOut()} DAYS OUT</span>
    </div>

    <h1>{trip.title}</h1>
    <p className="header-sub">{trip.subline}</p>

    <div className="identity">
      <label htmlFor="who">You are</label>
      <input
        id="who"
        value={user}
        onChange={(event) => onUser(event.target.value)}
        placeholder="type your name"
        autoComplete="name"
      />
    </div>
  </header>
)
