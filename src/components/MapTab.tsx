import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { categories, type PinCategory } from '../data/trip'
import { WhoPicker } from './WhoPicker'
import type { Pin, TripState } from '../lib/store'

const TOPO = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
const OSM_FALLBACK = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png'
const ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, NPS'
const INITIAL_CENTER: L.LatLngExpression = [45.34, -110.7]
const INITIAL_ZOOM = 10

const categoryKeys = Object.keys(categories) as PinCategory[]

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (char) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot' }[char]};`)

const markerIcon = (color: string) =>
  L.divIcon({
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -9],
    html: `<span style="display:block;width:16px;height:16px;border-radius:999px;background:${color};border:2.5px solid #FBF7E3;box-shadow:0 1px 4px rgba(22,39,14,.45)"></span>`,
  })

const popupHtml = (pin: Pin) => {
  const meta = categories[pin.category]
  return `<span class="pop-name">${escapeHtml(pin.name)}</span>
    <span class="pop-cat" style="color:${meta.color}">${escapeHtml(meta.label)}</span>
    ${pin.note ? `<div class="pop-note">${escapeHtml(pin.note)}</div>` : ''}
    ${pin.addedBy ? `<div class="pin-by">added by ${escapeHtml(pin.addedBy)}</div>` : ''}`
}

const emptyDraft = { name: '', category: 'hiking' as PinCategory, note: '' }

interface MapTabProps {
  state: TripState
  who: string
  onWho: (name: string) => void
  onAdd: (pin: Omit<Pin, 'id'>) => void
  onRemove: (id: string) => void
}

export const MapTab = ({ state, who, onWho, onAdd, onRemove }: MapTabProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const pendingRef = useRef<L.Marker | null>(null)

  const [filters, setFilters] = useState<Record<PinCategory, boolean>>(
    () => Object.fromEntries(categoryKeys.map((key) => [key, true])) as Record<PinCategory, boolean>
  )
  const [adding, setAdding] = useState(false)
  const [spot, setSpot] = useState<{ lat: number; lng: number } | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(INITIAL_CENTER, INITIAL_ZOOM)
    const tiles = L.tileLayer(TOPO, { maxZoom: 17, attribution: ATTRIBUTION }).addTo(map)

    let switched = false
    tiles.on('tileerror', () => {
      if (switched) return
      switched = true
      tiles.setUrl(OSM_FALLBACK)
    })

    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    // The Map pane is display:none until its tab is picked, so Leaflet lays the map out
    // against a 0x0 box and renders blank. One ResizeObserver covers it: it fires when the
    // pane is revealed and on every resize after, and invalidateSize keeps the centre.
    const resizeObserver = new ResizeObserver(() => map.invalidateSize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
      markersRef.current = {}
      pendingRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !adding) return
    const handler = (event: L.LeafletMouseEvent) =>
      setSpot({ lat: event.latlng.lat, lng: event.latlng.lng })
    map.on('click', handler)
    return () => {
      map.off('click', handler)
    }
  }, [adding])

  // The markers and the side list are the same set, drawn twice. Deriving it once keeps a
  // filter change from ever showing a pin in one place and not the other.
  const shown = useMemo(
    () => state.pins.filter((pin) => filters[pin.category]),
    [state.pins, filters]
  )

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    layer.clearLayers()
    markersRef.current = {}
    shown.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], { icon: markerIcon(categories[pin.category].color) })
        .bindPopup(popupHtml(pin))
        .addTo(layer)
      markersRef.current[pin.id] = marker
    })
  }, [shown])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    pendingRef.current?.remove()
    pendingRef.current = null
    if (!spot) return
    pendingRef.current = L.marker([spot.lat, spot.lng], { icon: markerIcon('#9A6B14') }).addTo(map)
  }, [spot])

  const cancel = () => {
    setAdding(false)
    setSpot(null)
    setDraft(emptyDraft)
    setInvalid(false)
  }

  const save = () => {
    if (!spot) return
    if (!draft.name.trim()) {
      setInvalid(true)
      return
    }
    onAdd({
      name: draft.name.trim(),
      category: draft.category,
      note: draft.note.trim(),
      lat: spot.lat,
      lng: spot.lng,
      addedBy: who,
    })
    cancel()
  }

  const flyTo = (pin: Pin) => {
    mapRef.current?.flyTo([pin.lat, pin.lng], 12, { duration: 0.6 })
    markersRef.current[pin.id]?.openPopup()
  }

  return (
    <div className="section-pad">
      <div className="intro">
        <h2>Where the good stuff is</h2>
        <p>Tap a spot to fly to it. Add your own trailheads, fishing holes and anything else worth knowing.</p>
      </div>

      <div className="map-card">
        <div ref={containerRef} className="map-canvas" style={{ cursor: adding ? 'crosshair' : undefined }} />

        {adding && !spot && <div className="hint">Tap the map where your spot goes</div>}

        {spot && (
          <div className="map-form">
            <input
              className={invalid ? 'pill-input invalid' : 'pill-input'}
              value={draft.name}
              onChange={(event) => {
                setDraft({ ...draft, name: event.target.value })
                setInvalid(false)
              }}
              placeholder="What is it called?"
              aria-label="Spot name"
            />
            <select
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value as PinCategory })}
              aria-label="Category"
            >
              {categoryKeys.map((key) => (
                <option key={key} value={key}>
                  {categories[key].label}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              value={draft.note}
              onChange={(event) => setDraft({ ...draft, note: event.target.value })}
              placeholder="Why should we go?"
              aria-label="Note"
            />
            <WhoPicker value={who} onChange={onWho} label="Added by" />
            <div className="map-form-actions">
              <button className="btn-forest" onClick={save}>
                Drop it
              </button>
              <button className="btn-ghost" onClick={cancel}>
                Nope
              </button>
            </div>
          </div>
        )}

        <div className="map-side">
          <div className="map-side-head">
            <span className="eyebrow" style={{ color: 'var(--slate)' }}>
              Spots · {shown.length}
            </span>
            <button className="btn-forest small" onClick={() => (adding ? cancel() : setAdding(true))}>
              {adding ? 'Cancel' : '+ Add a spot'}
            </button>
          </div>

          <div className="chips">
            {categoryKeys.map((key) => (
              <button
                key={key}
                className={filters[key] ? 'chip on' : 'chip'}
                onClick={() => setFilters((current) => ({ ...current, [key]: !current[key] }))}
                aria-pressed={filters[key]}
              >
                <span className="sq" style={{ background: categories[key].color }} />
                {categories[key].label}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="empty">No spots in these categories yet.</p>
          ) : (
            shown.map((pin) => (
              <div key={pin.id} className="pin-line">
                <button className="pin-row" onClick={() => flyTo(pin)}>
                  <span className="pin-dot" style={{ background: categories[pin.category].color }} />
                  <span className="grow">
                    <span className="pin-name">{pin.name}</span>
                    {pin.note && (
                      <span className="pin-note" style={{ display: 'block' }}>
                        {pin.note.length > 78 ? `${pin.note.slice(0, 78)}…` : pin.note}
                      </span>
                    )}
                    {pin.addedBy && <span className="pin-by">added by {pin.addedBy}</span>}
                  </span>
                </button>
                {!pin.seed && (
                  <button
                    className="x-btn"
                    onClick={() => onRemove(pin.id)}
                    aria-label={`Remove ${pin.name}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <p className="footnote">
        House pin is the address from the planning sheet. Check NPS and Custer Gallatin conditions before
        you drive anywhere in October.
      </p>
    </div>
  )
}
