import { google } from "googleapis";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    console.warn("Google Sheets credentials not configured. Using mock data.");
    return null;
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function getSheetData(
  range: string
): Promise<string[][] | null> {
  const auth = getAuth();
  if (!auth) return null;

  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    console.warn("GOOGLE_SHEET_ID not configured.");
    return null;
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  return response.data.values as string[][] | null;
}
