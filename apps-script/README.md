# Sheets backend

The map points people add are stored on a `Map Points` tab in the trip spreadsheet.
A static site cannot write to Google Sheets directly, so `Code.gs` is deployed as a
Google Apps Script Web App that sits in front of the sheet and handles reads and writes.

## Setup

1. Open the trip spreadsheet.
2. **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` and paste in the contents of this folder's `Code.gs`. Save.
4. **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
5. Set **Execute as** to *Me*, and **Who has access** to *Anyone*.
6. Click **Deploy** and authorize when prompted.
7. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`.
8. Paste that URL into `src/lib/sheet.ts` as `SHEET_ENDPOINT`, then commit and push.

"Who has access: Anyone" means anyone holding the URL can add points. It does not expose
the rest of the spreadsheet, only the `Map Points` tab, and only through the two operations
in `Code.gs`.

## Redeployment

**Deploy → Manage deployments → pencil icon → Version: New version → Deploy.**
The URL stays the same.
