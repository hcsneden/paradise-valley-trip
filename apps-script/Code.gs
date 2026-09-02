const TABS = {
  pin: { name: 'Map Points', headers: ['id', 'name', 'category', 'lat', 'lng', 'note', 'addedBy', 'createdAt'] },
  suggestion: { name: 'Ideas', headers: ['id', 'dayId', 'text', 'by', 'votes', 'createdAt'] },
  expense: { name: 'Expenses', headers: ['id', 'what', 'by', 'amount', 'createdAt'] },
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
  }
  return sheet
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
  expenses: readAll('expense'),
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
    }
  }
  return {
    id: body.id || Utilities.getUuid(),
    what: clamp(body.what, 160),
    by: clamp(body.by || 'anonymous', 60),
    amount: Number(body.amount),
    createdAt: now,
  }
}

const isValid = (kind, record) => {
  if (kind === 'pin') return record.name && isFinite(record.lat) && isFinite(record.lng)
  if (kind === 'suggestion') return record.text && isFinite(record.dayId)
  return record.what && isFinite(record.amount) && record.amount > 0
}

const doPost = (e) => {
  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
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
      const row = findRow(sheet, body.id)
      if (!row) return json({ ok: false, error: 'not found' })
      const column = TABS.suggestion.headers.indexOf('votes') + 1
      const cell = sheet.getRange(row, column)
      cell.setValue(Number(cell.getValue()) + 1)
      return json(snapshot())
    }

    const record = buildRecord(kind, body)
    if (!isValid(kind, record)) return json({ ok: false, error: 'missing required fields' })
    sheet.appendRow(TABS[kind].headers.map((header) => record[header]))
    return json(snapshot())
  } catch (err) {
    return json({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}
