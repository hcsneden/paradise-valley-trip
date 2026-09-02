# Sheets backend

Everything the group adds — map pins, ideas, votes and expenses — lives on the trip
spreadsheet. A static site cannot write to Google Sheets directly, so `Code.gs` is deployed
as a Google Apps Script Web App that sits in front of the sheet.

It creates and manages three tabs, so nothing you already have on the sheet is touched:

| Tab | Holds |
| --- | --- |
| `Map Points` | pins people drop on the map |
| `Ideas` | per-day suggestions and their vote counts |
| `Expenses` | the receipt log behind the settle-up math |

## Setup

1. Open the trip spreadsheet.
2. **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` and paste in the contents of this folder's `Code.gs`. Save.
4. **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
5. Set **Execute as** to *Me*, and **Who has access** to *Anyone*.
6. Click **Deploy** and authorize when prompted.
7. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`.
8. Paste that URL into `src/lib/store.ts` as `SHEET_ENDPOINT`, then commit, push and redeploy.

"Who has access: Anyone" means anyone holding the URL can post. It does not expose the rest
of the spreadsheet, only the three tabs above, and only through the operations in `Code.gs`.

## Redeployment

**Deploy → Manage deployments → pencil icon → Version: New version → Deploy.**
The URL stays the same.

## Known limits

- **No realtime push.** The site loads the sheet once on open. Someone else's idea or pin
  shows up on your next refresh, not the moment they add it. Polling or a websocket layer
  would be the fix if that ever matters.
- **Votes are one per browser**, tracked in `localStorage` under `pv-trip-voted`. Clearing
  site data lets the same person vote again. Enforcing it properly needs real accounts.
- **Sheets is slow** compared to a database. Expect a beat before a write comes back.
