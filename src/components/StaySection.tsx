import { useState } from 'react'
import { Badge, Button, Typography } from '@hcsneden/design-library'
import { Section } from './Section'
import { expenses, listing, parties, trip } from '../data/trip'

const perParty = expenses[0].perParty

const Chevron = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
)

const Carousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [index, setIndex] = useState(0)
  const step = (delta: number) => setIndex((prev) => (prev + delta + images.length) % images.length)

  return (
    <div className="carousel">
      <div className="carousel-frame">
        <img src={images[index]} alt={`${alt}, photo ${index + 1} of ${images.length}`} />
        <button className="carousel-nav prev" onClick={() => step(-1)} aria-label="Previous photo">
          <Chevron direction="left" />
        </button>
        <button className="carousel-nav next" onClick={() => step(1)} aria-label="Next photo">
          <Chevron direction="right" />
        </button>
        <span className="carousel-count mono">
          {index + 1} / {images.length}
        </span>
      </div>
      <div className="carousel-dots">
        {images.map((image, i) => (
          <button
            key={image}
            className={i === index ? 'carousel-dot active' : 'carousel-dot'}
            onClick={() => setIndex(i)}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  )
}

const stats = [
  { value: listing.guests, label: 'Guests' },
  { value: listing.bedrooms, label: 'Bedrooms' },
  { value: listing.beds, label: 'Beds' },
  { value: listing.bathrooms, label: 'Baths' },
].filter((stat) => stat.value !== null)

export const StaySection = () => (
  <Section id="stay" index="02" title="The house">
    <div className="stay">
      {listing.images.length > 0 ? (
        <Carousel images={listing.images} alt={listing.title} />
      ) : (
        <div className="stay-placeholder">
          <Typography variant="body" muted className="fs-sm">
            Photos to come.
          </Typography>
        </div>
      )}

      <div className="stay-details">
        <Typography variant="h3" className="mb-xs">
          {listing.title}
        </Typography>
        <Typography variant="body" muted className="mb-xs">
          {listing.location}
        </Typography>
        <Typography variant="body" muted className="fs-sm mb-md">
          {trip.address}
        </Typography>

        {stats.length > 0 && (
          <div className="stay-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="stay-stat">
                <span className="stay-stat-value mono">{stat.value}</span>
                <span className="eyebrow">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="row mb-md">
          <Badge>{trip.checkIn}</Badge>
          <Badge variant="outline">{trip.checkOut}</Badge>
        </div>

        {perParty && (
          <Typography variant="body" className="fs-sm mb-md">
            {perParty.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} per party,
            split {parties.length} ways.
          </Typography>
        )}

        <div className="row">
          {listing.url && (
            <Button onClick={() => window.open(listing.url, '_blank', 'noreferrer')}>
              View on Airbnb
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.open(trip.guidebook, '_blank', 'noreferrer')}
          >
            Host guidebook
          </Button>
        </div>
      </div>
    </div>
  </Section>
)
