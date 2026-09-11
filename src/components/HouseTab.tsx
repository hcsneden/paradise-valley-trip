import { useState } from 'react'
import { driveTimes, listing, roster, stay, trip } from '../data/trip'

export const HouseTab = () => {
  const [photo, setPhoto] = useState(0)
  const count = listing.images.length

  return (
    <div className="section-pad">
      <div className="intro">
        <h2>The house</h2>
        <p>Everything you will look up halfway through the trip.</p>
      </div>

      <div className="card card-wide">
        <div className="shot">
          <img src={listing.images[photo]} alt={`${listing.title}, photo ${photo + 1}`} />
          <button
            className="x-btn shot-nav left"
            onClick={() => setPhoto((current) => (current + count - 1) % count)}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="x-btn shot-nav right"
            onClick={() => setPhoto((current) => (current + 1) % count)}
            aria-label="Next photo"
          >
            ›
          </button>
          <span className="mono shot-count">
            {photo + 1} / {count}
          </span>
        </div>

        <div className="card-wide-body">
          <span className="badge-booked">BOOKED &amp; PAID</span>
          <h3>{listing.title}</h3>
          <p className="card-meta">
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
        <span className="eyebrow">From the front door</span>
        <div className="card-list">
          {driveTimes.map((drive) => (
            <div key={drive.label} className="kv">
              <span className="k">{drive.label}</span>
              <span className="v">{drive.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <span className="eyebrow">Who lands when</span>
        <div className="card-list">
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
        <span className="eyebrow">Mid-October reality check</span>
        <p className="card-text">{trip.weatherNote}</p>
      </div>

      <div className="card dark">
        <span className="eyebrow">Before you leave town</span>
        <p className="card-text">{trip.hostNote}</p>
        <a className="cta cta-light" href={trip.guidebook} target="_blank" rel="noreferrer">
          Host guidebook
        </a>
      </div>
    </div>
  )
}
