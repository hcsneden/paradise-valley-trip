import { useCallback, useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Badge, Button, Input, Typography } from '@hcsneden/design-library'
import { places } from '../data/trip'
import {
  addPoint,
  categoryLabels,
  fetchPoints,
  isSheetConfigured,
  type MapPoint,
  type PointCategory,
} from '../lib/sheet'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const HOUSE = places.find((place) => place.id === 'house')!

const kindColors: Record<string, string> = {
  lodging: '#103606',
  food: '#9A6B14',
  activity: '#3C6B2A',
  supplies: '#5E6750',
  travel: '#5E6750',
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (char) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot' }[char]};`)

const makeMarker = (color: string, ring: boolean) => {
  const el = document.createElement('div')
  el.style.cssText = `width:${ring ? 18 : 14}px;height:${ring ? 18 : 14}px;border-radius:50%;background:${color};border:${ring ? 3 : 2}px solid #fff;box-shadow:0 1px 4px rgba(22,39,14,.4);cursor:pointer`
  return el
}

const emptyDraft = { name: '', category: 'hike' as PointCategory, notes: '', addedBy: '' }

export const TripMap = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const addedMarkersRef = useRef<maplibregl.Marker[]>([])
  const pendingMarkerRef = useRef<maplibregl.Marker | null>(null)

  const [points, setPoints] = useState<MapPoint[]>([])
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [HOUSE.lng, HOUSE.lat],
      zoom: 9,
    })

    const bounds = places.reduce(
      (acc, place) => acc.extend([place.lng, place.lat]),
      new maplibregl.LngLatBounds([HOUSE.lng, HOUSE.lat], [HOUSE.lng, HOUSE.lat])
    )
    map.fitBounds(bounds, { padding: 60, animate: false })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left')
    mapRef.current = map

    places.forEach((place) => {
      const detail = [place.driveFromHouse && `${place.driveFromHouse} from house`, place.price]
        .filter(Boolean)
        .join(' · ')
      const html = `<strong style="font-size:14px">${escapeHtml(place.name)}</strong>${
        detail ? `<div style="color:#5E6750;font-size:12px;margin-top:4px">${escapeHtml(detail)}</div>` : ''
      }${place.notes ? `<div style="font-size:13px;margin-top:8px">${escapeHtml(place.notes)}</div>` : ''}`

      new maplibregl.Marker({ element: makeMarker(kindColors[place.kind], place.id === 'house') })
        .setLngLat([place.lng, place.lat])
        .setPopup(new maplibregl.Popup({ offset: 14, maxWidth: '260px' }).setHTML(html))
        .addTo(map)
    })

    map.on('click', (event) => {
      setPending({ lat: event.lngLat.lat, lng: event.lngLat.lng })
      setStatus(null)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    fetchPoints().then(setPoints).catch(() => setStatus('Could not load saved spots.'))
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    addedMarkersRef.current.forEach((marker) => marker.remove())
    addedMarkersRef.current = points.map((point) =>
      new maplibregl.Marker({ element: makeMarker('#A8432B', false) })
        .setLngLat([point.lng, point.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 12, maxWidth: '260px' }).setHTML(
            `<strong style="font-size:14px">${escapeHtml(point.name)}</strong>
             <div style="color:#5E6750;font-size:12px;margin-top:4px">${escapeHtml(
               categoryLabels[point.category] ?? 'Other'
             )} · added by ${escapeHtml(point.addedBy || 'someone')}</div>
             ${point.notes ? `<div style="font-size:13px;margin-top:8px">${escapeHtml(point.notes)}</div>` : ''}`
          )
        )
        .addTo(map)
    )
  }, [points])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    pendingMarkerRef.current?.remove()
    pendingMarkerRef.current = null
    if (!pending) return
    const el = makeMarker('#9A6B14', true)
    el.style.animation = 'none'
    pendingMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([pending.lng, pending.lat])
      .addTo(map)
  }, [pending])

  const save = useCallback(async () => {
    if (!pending || !draft.name.trim()) return
    setSaving(true)
    setStatus(null)
    try {
      const next = await addPoint({
        name: draft.name.trim(),
        category: draft.category,
        notes: draft.notes.trim(),
        addedBy: draft.addedBy.trim() || 'Anonymous',
        lat: pending.lat,
        lng: pending.lng,
      })
      setPoints(next)
      setPending(null)
      setDraft(emptyDraft)
      setStatus(isSheetConfigured() ? 'Saved to the trip sheet.' : 'Saved in this browser only.')
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Could not save that spot.')
    } finally {
      setSaving(false)
    }
  }, [pending, draft])

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 320px', alignItems: 'start' }}>
      <div
        style={{
          border: '1px solid var(--dl-color-border)',
          borderRadius: 'var(--dl-radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div ref={containerRef} style={{ height: 560, width: '100%' }} />
      </div>

      <div className="stack" style={{ gap: 16 }}>
        <div className="inset">
          <Typography variant="h4" className="mb-sm">
            {pending ? 'Describe this spot' : 'Add a spot'}
          </Typography>
          <Typography variant="body" muted className={pending ? 'fs-sm mb-md' : 'fs-sm'}>
            {pending
              ? 'Click the map again to move the pin.'
              : 'Click anywhere on the map to drop a pin for a hike, a fishing hole, or anything else worth remembering.'}
          </Typography>

          {pending && (
            <div className="stack" style={{ gap: 14 }}>
              <Input
                label="Name"
                placeholder="Pine Creek trailhead"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />

              <div className="stack" style={{ gap: 6 }}>
                <label className="eyebrow" htmlFor="pv-category">
                  Category
                </label>
                <select
                  id="pv-category"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as PointCategory })}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--dl-radius-md)',
                    border: '1px solid var(--dl-color-border)',
                    background: 'var(--dl-color-bg)',
                    font: 'inherit',
                    fontSize: 15,
                    color: 'var(--dl-color-fg)',
                  }}
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Notes"
                placeholder="Easy 1.5 mi, good for the kids"
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
              <Input
                label="Your name"
                placeholder="Han"
                value={draft.addedBy}
                onChange={(e) => setDraft({ ...draft, addedBy: e.target.value })}
              />

              <div className="row">
                <Button size="sm" onClick={save} disabled={saving || !draft.name.trim()}>
                  {saving ? 'Saving…' : 'Save spot'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPending(null)} disabled={saving}>
                  Cancel
                </Button>
              </div>

              <span className="mono" style={{ fontSize: 11, color: 'var(--dl-color-muted)' }}>
                {pending.lat.toFixed(5)}, {pending.lng.toFixed(5)}
              </span>
            </div>
          )}

          {status && (
            <Typography variant="body" className="fs-xs mt-sm">
              {status}
            </Typography>
          )}
        </div>

        {!isSheetConfigured() && (
          <div className="inset" style={{ borderColor: 'var(--dl-color-warning)' }}>
            <Typography variant="body" className="fs-xs">
              The trip spreadsheet is not connected yet, so spots you add are saved in this browser
              only and nobody else will see them. See <code>apps-script/README.md</code> to connect it.
            </Typography>
          </div>
        )}

        <div className="inset">
          <Typography variant="h4" className="mb-sm">
            Spots we added
          </Typography>
          {points.length === 0 ? (
            <Typography variant="body" muted className="fs-sm">
              Nothing yet.
            </Typography>
          ) : (
            <div className="stack" style={{ gap: 12 }}>
              {points.map((point) => (
                <button
                  key={point.id}
                  onClick={() => mapRef.current?.flyTo({ center: [point.lng, point.lat], zoom: 13 })}
                  style={{
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    font: 'inherit',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--dl-color-fg)' }}>
                    {point.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--dl-color-muted)' }}>
                    {categoryLabels[point.category] ?? 'Other'} · {point.addedBy || 'Anonymous'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Badge variant="subtle">Green: booked & known</Badge>
          <Badge variant="subtle">Red: added by us</Badge>
        </div>
      </div>
    </div>
  )
}
