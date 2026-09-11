const TABS = {
  pin: { name: 'Map Points', headers: ['id', 'name', 'category', 'lat', 'lng', 'note', 'addedBy', 'createdAt'] },
  // 'time' is last on purpose: new columns go on the end so existing rows keep their positions.
  suggestion: { name: 'Ideas', headers: ['id', 'dayId', 'text', 'by', 'votes', 'createdAt', 'time'] },
  expense: { name: 'Trip Expenses', headers: ['id', 'what', 'by', 'amount', 'createdAt'] },
  // Free-text comments on a fixed itinerary row. 'itemId' is the stable id in src/data/trip.ts.
  note: { name: 'Item Notes', headers: ['id', 'itemId', 'text', 'by', 'createdAt'] },
  // One row per itinerary item id, holding the running net score. Rows appear on first vote.
  planVote: { name: 'Plan Votes', headers: ['id', 'votes', 'createdAt'] },
}

const NUMERIC = ['lat', 'lng', 'dayId', 'votes', 'amount']

const getSheet = (kind) => {
  const spec = TABS[kind]
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(spec.name)
  if (!sheet) {
    sheet = ss.insertSheet(spec.name)
    sheet.appendRow(spec.headers)
    sheet.setFrozenRows(1)
    return sheet
  }
  syncHeaders(sheet, spec)
  return sheet
}

// A tab created by an older version of this script is missing any column added since.
// Fill the gap on the end so readAll and appendRow stay aligned with the spec.
const syncHeaders = (sheet, spec) => {
  const width = sheet.getLastColumn()
  const current = width ? sheet.getRange(1, 1, 1, width).getValues()[0] : []
  if (current.length >= spec.headers.length) return
  const missing = spec.headers.slice(current.length)
  sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing])
  sheet.setFrozenRows(1)
}

const readAll = (kind) => {
  const spec = TABS[kind]
  const rows = getSheet(kind).getDataRange().getValues()
  if (rows.length < 2) return []
  return rows.slice(1).map((row) => {
    const record = {}
    spec.headers.forEach((header, i) => {
      record[header] = NUMERIC.indexOf(header) >= 0 ? Number(row[i]) : row[i]
    })
    return record
  })
}

const snapshot = () => ({
  ok: true,
  pins: readAll('pin'),
  suggestions: readAll('suggestion'),
  notes: readAll('note'),
  expenses: readAll('expense'),
  planVotes: readAll('planVote'),
})

const json = (payload) =>
  ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)

const doGet = () => json(snapshot())

const findRow = (sheet, id) => {
  const rows = sheet.getDataRange().getValues()
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) return i + 1
  }
  return 0
}

const clamp = (value, max) => String(value == null ? '' : value).slice(0, max)

const buildRecord = (kind, body) => {
  const now = new Date().toISOString()
  if (kind === 'pin') {
    return {
      id: body.id || Utilities.getUuid(),
      name: clamp(body.name, 120),
      category: clamp(body.category || 'other', 40),
      lat: Number(body.lat),
      lng: Number(body.lng),
      note: clamp(body.note, 600),
      addedBy: clamp(body.addedBy || 'anonymous', 60),
      createdAt: now,
    }
  }
  if (kind === 'suggestion') {
    return {
      id: body.id || Utilities.getUuid(),
      dayId: Number(body.dayId),
      text: clamp(body.text, 400),
      by: clamp(body.by || 'anonymous', 60),
      votes: 1,
      createdAt: now,
      time: clamp(body.time, 10),
    }
  }
  if (kind === 'note') {
    return {
      id: body.id || Utilities.getUuid(),
      itemId: clamp(body.itemId, 60),
      text: clamp(body.text, 500),
      by: clamp(body.by || 'anonymous', 60),
      createdAt: now,
    }
  }
  if (kind === 'planVote') {
    return { id: clamp(body.id, 60), votes: 0, createdAt: now }
  }
  return {
    id: body.id || Utilities.getUuid(),
    what: clamp(body.what, 160),
    by: clamp(body.by || 'anonymous', 60),
    amount: Number(body.amount),
    createdAt: now,
  }
}

/**
 * Sheets can parse strings it is handed the way it parses typed input, so '14:30' can
 * come back as a Date and '=1+1' as a formula, neither of which the site can show.
 * Formatting the text cells as plain text before the write keeps them literal.
 * The numeric columns keep their format so amounts and scores still add up in the sheet.
 */
const appendRecord = (kind, sheet, record) => {
  const headers = TABS[kind].headers
  const row = sheet.getLastRow() + 1
  headers.forEach((header, i) => {
    if (NUMERIC.indexOf(header) < 0) sheet.getRange(row, i + 1).setNumberFormat('@')
  })
  sheet.getRange(row, 1, 1, headers.length).setValues([headers.map((header) => record[header])])
}

const isValid = (kind, record) => {
  if (kind === 'pin') return record.name && isFinite(record.lat) && isFinite(record.lng)
  if (kind === 'suggestion') return record.text && isFinite(record.dayId)
  if (kind === 'note') return record.itemId && record.text
  if (kind === 'planVote') return Boolean(record.id)
  return record.what && isFinite(record.amount) && record.amount > 0
}

const doPost = (e) => {
  const lock = LockService.getScriptLock()
  let held = false
  try {
    // Inside the try: a lock timeout throws, and outside it that escapes doPost as an HTML
    // error page, which the client tries to parse as JSON and reports as a syntax error.
    lock.waitLock(20000)
    held = true
    const body = JSON.parse(e.postData.contents)
    const kind = body.kind
    if (!TABS[kind]) return json({ ok: false, error: 'unknown kind: ' + kind })

    const sheet = getSheet(kind)

    if (body.action === 'delete') {
      const row = findRow(sheet, body.id)
      if (row) sheet.deleteRow(row)
      return json(snapshot())
    }

    if (body.action === 'vote') {
      // Clients send the swing, not the new position, so switching sides arrives as -2 or +2.
      const delta = Math.max(-2, Math.min(2, Math.round(Number(body.delta))))
      if (!delta) return json(snapshot())

      const column = TABS[kind].headers.indexOf('votes') + 1
      let row = findRow(sheet, body.id)

      if (!row) {
        // Itinerary rows have no sheet row until someone votes on one.
        if (kind !== 'planVote') return json({ ok: false, error: 'not found' })
        const record = buildRecord(kind, body)
        if (!isValid(kind, record)) return json({ ok: false, error: 'missing required fields' })
        appendRecord(kind, sheet, record)
        row = sheet.getLastRow()
      }

      const cell = sheet.getRange(row, column)
      cell.setValue(Number(cell.getValue() || 0) + delta)
      return json(snapshot())
    }

    const record = buildRecord(kind, body)
    if (!isValid(kind, record)) return json({ ok: false, error: 'missing required fields' })
    appendRecord(kind, sheet, record)
    return json(snapshot())
  } catch (err) {
    return json({ ok: false, error: String(err) })
  } finally {
    if (held) lock.releaseLock()
  }
}
