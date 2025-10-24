import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from "../service-account.json"

export function loadSpreadsheet(
    spreadsheetId: string,
): GoogleSpreadsheet {
    const auth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const spreadsheet = new GoogleSpreadsheet(spreadsheetId, auth);
    return spreadsheet;
}