import { useState } from 'react'
import { driveTimes, listing, roster, stay, trip } from '../data/trip'

export const HouseTab = () => {
  const [photo, setPhoto] = useState(0)

  return (
    <div className="section-pad">
      <div className="intro">
        <h2>The house</h2>
        <p>Everything you will look up halfway through the trip.</p>
      </div>

      <div className="card card-wide" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="shot">
          <img src={listing.images[photo]} alt={`${listing.title}, photo ${photo + 1}`} />
          <button
            className="x-btn"
            onClick={() => setPhoto((photo + listing.images.length - 1) % listing.images.length)}
            aria-label="Previous photo"
            style={navStyle('left')}
          >
            ‹
          </button>
          <button
            className="x-btn"
            onClick={() => setPhoto((photo + 1) % listing.images.length)}
            aria-label="Next photo"
            style={navStyle('right')}
          >
            ›
          </button>
          <span
            className="mono"
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              background: 'rgba(22,39,14,.72)',
              color: '#fff',
              fontSize: 11,
              padding: '4px 9px',
              borderRadius: 999,
            }}
          >
            {photo + 1} / {listing.images.length}
          </span>
        </div>

        <div style={{ padding: 18 }}>
          <span className="badge-booked">BOOKED &amp; PAID</span>
          <h3>{listing.title}</h3>
          <p style={{ margin: '6px 0 0', font: '400 13.5px/1.5 var(--sans)', color: 'var(--slate)' }}>
            {trip.address} · {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds ·{' '}
            {listing.bathrooms} baths
          </p>

          <div className="tiles">
            <div className="tile">
              <span className="k">Check in</span>
              <span className="v">{stay.checkIn}</span>
            </div>
            <div className="tile">
              <span className="k">Check out</span>
              <span className="v">{stay.checkOut}</span>
            </div>
          </div>

          <a className="cta" href={listing.url} target="_blank" rel="noreferrer">
            Open the listing
          </a>
        </div>
      </div>

      <div className="card">
        <span className="eyebrow" style={{ color: 'var(--muted)' }}>
          From the front door
        </span>
        <div style={{ marginTop: 10 }}>
          {driveTimes.map((drive) => (
            <div key={drive.label} className="kv">
              <span className="k">{drive.label}</span>
              <span className="v">{drive.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <span className="eyebrow" style={{ color: 'var(--muted)' }}>
          Who lands when
        </span>
        <div style={{ marginTop: 10 }}>
          {roster.map((party) => (
            <div key={party.name} className="kv">
              <span className="k">{party.name}</span>
              <span className="v">
                {party.arrive} → {party.depart}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card dark">
        <span className="eyebrow" style={{ color: 'var(--on-dark-label)' }}>
          Mid-October reality check
        </span>
        <p style={{ margin: '10px 0 0', font: '400 14px/1.6 var(--sans)', color: 'var(--on-dark-body)' }}>
          {trip.weatherNote}
        </p>
      </div>

      <div className="card dark">
        <span className="eyebrow" style={{ color: 'var(--on-dark-label)' }}>
          Before you leave town
        </span>
        <p style={{ margin: '10px 0 0', font: '400 14px/1.6 var(--sans)', color: 'var(--on-dark-body)' }}>
          {trip.hostNote}
        </p>
        <a
          className="cta"
          href={trip.guidebook}
          target="_blank"
          rel="noreferrer"
          style={{ marginTop: 14, background: 'var(--field)', color: 'var(--forest)' }}
        >
          Host guidebook
        </a>
      </div>
    </div>
  )
}

const navStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  [side]: 10,
  transform: 'translateY(-50%)',
  width: 34,
  height: 34,
  borderRadius: 999,
  background: 'rgba(255,255,255,.92)',
  color: 'var(--ink)',
  font: '700 20px var(--sans)',
  lineHeight: 1,
  padding: 0,
})
