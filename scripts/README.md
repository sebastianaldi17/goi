# scripts
A collection of scripts for goi

## Initial setup
- Get a `service-account.json` & put it to the root of this folder.
  - Create a google cloud project (should be free) & go to this [link](https://console.cloud.google.com/iam-admin/serviceaccounts)
  - Press `create service account` & fill in the details
  - Go to the service account > `Keys` > `Add key` with key type `JSON`
- Create a google sheet spreadsheet, the script will read the list of words from there, hit jisho, and populate the DB based on the sheet.
  - The sheet should consist of 4 columns: `Kanji`, `Kana`, `Level`, `Tag` (separated by `;`).
- Copy `env.example` to `.env` & update the values to your actual DB (whether it is from local docker or remote DB) & spreadsheet location.
  - `SPREADSHEET_ID` can be seen at the URL (docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit).
  - `SHEET_NAMES` should be a `;` separated list of sheet names. You don't have to make more than 1 sheet, I just support it for better organization in my end.

## Populate DB
Run the following command
```
npm run initial-populate
```
