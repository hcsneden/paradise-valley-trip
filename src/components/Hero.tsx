import { Badge, Typography } from '@hcsneden/design-library'
import { trip } from '../data/trip'

const links = [
  { href: '#itinerary', label: 'Itinerary' },
  { href: '#stay', label: 'The house' },
  { href: '#map', label: 'Map' },
  { href: '#eat', label: 'Eat' },
  { href: '#do', label: 'Do' },
  { href: '#logistics', label: 'Logistics' },
]

export const Hero = () => (
  <header style={{ paddingTop: 72, paddingBottom: 56 }}>
    <div className="shell">
      <div className="row" style={{ marginBottom: 20 }}>
        <span
          style={{
            width: 10,
            height: 10,
            background: 'var(--dl-color-accent)',
            borderRadius: 2,
          }}
        />
        <span className="eyebrow">Paradise Valley · Montana</span>
      </div>

      <Typography variant="display" className="mb-md">
        Four days on the Yellowstone
      </Typography>

      <Typography variant="body" className="measure-tight mb-xl">
        {trip.hostNote}
      </Typography>

      <div className="row" style={{ marginBottom: 36 }}>
        <Badge>{trip.arrive.replace(', 2026', '')} → Oct 18</Badge>
        <Badge variant="outline">{trip.address}</Badge>
        <Badge variant="subtle">4 families</Badge>
        <Badge variant="subtle">Oktoberfest Saturday</Badge>
      </div>

      <nav className="row" style={{ gap: 24 }}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{ fontSize: 15, fontWeight: 500, textDecoration: 'none' }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  </header>
)
