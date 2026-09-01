import { Badge, Card, CardContent, CardHeader, Divider, Typography } from '@hcsneden/design-library'
import { Hero } from './components/Hero'
import { Section } from './components/Section'
import { StaySection } from './components/StaySection'
import { TripMap } from './components/TripMap'
import { expenses, itinerary, openThreads, parties, places } from './data/trip'

const money = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const restaurants = places.filter((place) => place.kind === 'food')
const supplies = places.filter((place) => place.kind === 'supplies')
const activities = places.filter((place) => place.kind === 'activity')
const nearby = activities.filter((place) => !place.inPark)
const yellowstone = activities.filter((place) => place.inPark)

const airbnbTotal = expenses[0].total ?? 0

export const App = () => (
  <>
    <Hero />

    <Section
      id="itinerary"
      index="01"
      title="The plan"
      intro="A loose shape for the four days, not a schedule. The open questions under each day are the ones still worth settling before we fly."
    >
      <div className="grid cols-2">
        {itinerary.map((day) => (
          <Card key={day.day} shadow>
            <CardHeader title={`${day.day}, ${day.date}`} subtitle={day.anchor} />
            <CardContent>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
                {day.items.map((item) => (
                  <li key={item} style={{ fontSize: 15, lineHeight: 1.6 }}>
                    {item}
                  </li>
                ))}
              </ul>
              {day.openQuestions?.map((question) => (
                <div key={question} style={{ marginTop: 16 }}>
                  <Divider />
                  <div style={{ marginTop: 14 }}>
                    <span className="eyebrow" style={{ color: 'var(--dl-color-warning)' }}>
                      Open question
                    </span>
                    <Typography variant="body" className="fs-sm mt-xs">
                      {question}
                    </Typography>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>

    <StaySection />

    <Section
      id="map"
      index="03"
      title="The map"
      intro="Everything from the planning sheet, pinned. Click anywhere to add your own hike, fishing hole or anything else you find."
    >
      <TripMap />
    </Section>

    <Section
      id="eat"
      index="04"
      title="Eat and supply"
      intro="Everything here is within about 15 minutes of the house. Anything bigger than the Emigrant general store means a drive to Livingston or Bozeman."
    >
      <div className="grid cols-3">
        {[...restaurants, ...supplies].map((place) => (
          <Card key={place.id} shadow>
            <CardHeader title={place.name} subtitle={place.meals ?? 'Gas & groceries'} />
            <CardContent>
              <div className="row" style={{ marginBottom: 12 }}>
                {place.price && <Badge variant="subtle">{place.price}</Badge>}
                {place.driveFromHouse && <Badge variant="outline">{place.driveFromHouse}</Badge>}
              </div>
              {place.notes && (
                <Typography variant="body" className="fs-sm mb-sm">
                  {place.notes}
                </Typography>
              )}
              {(place.link || place.mapsLink) && (
                <a
                  href={place.link ?? place.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  Look it up →
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>

    <Section
      id="do"
      index="05"
      title="Things to do"
      intro="Split by drive time, because that is the real decision. The close list is a lazy morning. The Yellowstone list is a whole day in the car."
    >
      <span className="eyebrow">Close to the house</span>
      <div className="grid cols-3" style={{ marginTop: 16, marginBottom: 44 }}>
        {nearby.map((place) => (
          <Card key={place.id} shadow>
            <CardHeader title={place.name} subtitle={place.driveFromHouse} />
            <CardContent>
              {place.price && (
                <Badge variant="subtle" >{place.price}</Badge>
              )}
              {place.notes && (
                <Typography variant="body" className="fs-sm mt-sm">
                  {place.notes}
                </Typography>
              )}
              {place.link && (
                <div style={{ marginTop: 12 }}>
                  <a href={place.link} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 500 }}>
                    Look it up →
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <span className="eyebrow">Yellowstone, if we commit the day</span>
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr>
                <th>Stop</th>
                <th>Drive from house</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {yellowstone.map((place) => (
                <tr key={place.id}>
                  <td style={{ fontWeight: 600 }}>{place.name}</td>
                  <td className="mono">{place.driveFromHouse}</td>
                  <td style={{ color: 'var(--dl-color-muted)' }}>{place.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>

    <Section id="logistics" index="06" title="Logistics">
      <div className="grid cols-2">
        <div className="panel">
          <Typography variant="h4" className="mb-md">
            Arrivals and departures
          </Typography>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th>Party</th>
                  <th>Boots on the ground, BZN</th>
                  <th>Depart</th>
                </tr>
              </thead>
              <tbody>
                {parties.map((party) => (
                  <tr key={party.name}>
                    <td style={{ fontWeight: 600 }}>{party.name}</td>
                    <td>{party.arrive}</td>
                    <td>{party.depart}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <Typography variant="h4" className="mb-md">
            Money
          </Typography>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'right' }}>Per party</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.label}>
                    <td style={{ fontWeight: 600 }}>{expense.label}</td>
                    <td className="num">{expense.perParty ? money(expense.perParty) : 'TBD'}</td>
                    <td className="num">{expense.total ? money(expense.total) : 'TBD'}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ fontWeight: 600 }}>Settled so far</td>
                  <td className="num" style={{ fontWeight: 600 }}>{money(airbnbTotal / 4)}</td>
                  <td className="num" style={{ fontWeight: 600 }}>{money(airbnbTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Typography variant="caption" muted className="block mt-sm">
            Split four ways. Van, groceries and booze are still unpriced.
          </Typography>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <Typography variant="h4" className="mb-xs">
          Open questions
        </Typography>
        <Typography variant="body" muted className="fs-sm mb-lg">
          Pulled straight out of the comments in the planning sheet.
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 10 }}>
          {openThreads.map((thread) => (
            <li key={thread} style={{ fontSize: 15, lineHeight: 1.6 }}>
              {thread}
            </li>
          ))}
        </ul>
      </div>

    </Section>

    <footer className="shell" style={{ padding: '40px 24px 64px' }}>
      <Divider />
      <Typography variant="caption" muted className="block mt-md">
        Built from the group planning spreadsheet. Coordinates verified against OpenStreetMap.
        Anything that changes in the sheet needs to be updated here too.
      </Typography>
    </footer>
  </>
)
