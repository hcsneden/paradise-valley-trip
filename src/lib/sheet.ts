export const SHEET_ENDPOINT = ''

export type PointCategory = 'hike' | 'fishing' | 'food' | 'view' | 'kids' | 'other'

export interface MapPoint {
  id: string
  name: string
  category: PointCategory
  lat: number
  lng: number
  notes: string
  addedBy: string
  createdAt: string
}

export const categoryLabels: Record<PointCategory, string> = {
  hike: 'Hike',
  fishing: 'Fishing',
  food: 'Food & drink',
  view: 'Viewpoint',
  kids: 'Good with kids',
  other: 'Other',
}

const LOCAL_KEY = 'pv-trip-points'

const readLocal = (): MapPoint[] => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')
  } catch {
    return []
  }
}

const writeLocal = (points: MapPoint[]) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(points))
  } catch {
    return
  }
}

export const isSheetConfigured = () => SHEET_ENDPOINT.length > 0

export const fetchPoints = async (): Promise<MapPoint[]> => {
  if (!isSheetConfigured()) return readLocal()
  const res = await fetch(SHEET_ENDPOINT)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error ?? 'Could not load points')
  return data.points as MapPoint[]
}

export const addPoint = async (point: Omit<MapPoint, 'id' | 'createdAt'>): Promise<MapPoint[]> => {
  if (!isSheetConfigured()) {
    const next = [
      ...readLocal(),
      { ...point, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ]
    writeLocal(next)
    return next
  }
  const res = await fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(point),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error ?? 'Could not save point')
  return data.points as MapPoint[]
}
