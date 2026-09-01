const SHEET_NAME = 'Map Points'
const HEADERS = ['id', 'name', 'category', 'lat', 'lng', 'notes', 'addedBy', 'createdAt']

const getSheet = () => {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

const json = (payload) =>
  ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)

const readPoints = () => {
  const rows = getSheet().getDataRange().getValues()
  if (rows.length < 2) return []
  return rows.slice(1).map((row) => {
    const point = {}
    HEADERS.forEach((header, i) => {
      point[header] = row[i]
    })
    point.lat = Number(point.lat)
    point.lng = Number(point.lng)
    return point
  })
}

const doGet = () => json({ ok: true, points: readPoints() })

const doPost = (e) => {
  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    const body = JSON.parse(e.postData.contents)
    const sheet = getSheet()

    if (body.action === 'delete') {
      const rows = sheet.getDataRange().getValues()
      for (let i = rows.length - 1; i >= 1; i--) {
        if (String(rows[i][0]) === String(body.id)) sheet.deleteRow(i + 1)
      }
      return json({ ok: true, points: readPoints() })
    }

    const point = {
      id: body.id || Utilities.getUuid(),
      name: String(body.name || '').slice(0, 120),
      category: String(body.category || 'other').slice(0, 40),
      lat: Number(body.lat),
      lng: Number(body.lng),
      notes: String(body.notes || '').slice(0, 600),
      addedBy: String(body.addedBy || 'Anonymous').slice(0, 60),
      createdAt: new Date().toISOString(),
    }

    if (!point.name || !isFinite(point.lat) || !isFinite(point.lng)) {
      return json({ ok: false, error: 'name, lat and lng are required' })
    }

    sheet.appendRow(HEADERS.map((header) => point[header]))
    return json({ ok: true, points: readPoints() })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}
