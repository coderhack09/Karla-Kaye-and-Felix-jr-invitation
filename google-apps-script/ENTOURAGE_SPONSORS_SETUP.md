# Entourage & Principal Sponsors Setup Guide

This guide will help you deploy the Google Apps Script backend for managing Entourage and Principal Sponsors.

## Overview

You need to deploy two separate Google Apps Script web apps:
1. **Entourage Management** - for managing wedding entourage members
2. **Principal Sponsor Management** - for managing principal sponsors

## Prerequisites

- Google account with access to Google Sheets and Google Apps Script
- A Google Spreadsheet to store your wedding data

## Step 1: Prepare Your Google Spreadsheet

1. Open your Google Spreadsheet (or create a new one)
2. You'll create two sheets (tabs) in this spreadsheet:
   - `Entourage` - for storing entourage members
   - `PrincipalSponsors` - for storing principal sponsors

## Step 2: Deploy Entourage Management Script

### A. Create the Script

1. In your Google Spreadsheet, go to **Extensions** > **Apps Script**
2. Delete any default code in the editor
3. Copy the entire contents of `entourage-management.js` and paste it into the script editor
4. Click **File** > **Save** or press `Ctrl+S` (or `Cmd+S` on Mac)
5. Name your project: "Entourage Management"

### B. Initialize the Sheet

1. In the Apps Script editor, select the function `initializeEntourageSheet` from the dropdown menu at the top
2. Click the **Run** button (play icon)
3. When prompted, grant the necessary permissions:
   - Click **Review permissions**
   - Select your Google account
   - Click **Advanced** > **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
4. Go back to your spreadsheet - you should now see an "Entourage" sheet with headers

### C. Deploy as Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Entourage Management API"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (or "Anyone with Google account" for more security)
4. Click **Deploy**
5. **IMPORTANT**: Copy the **Web app URL** - you'll need this!
   - It should look like: `https://script.google.com/macros/s/ABC123.../exec`
6. Save this URL somewhere safe

### D. Update Your Next.js App

1. Open `/app/api/entourage/route.ts` in your Next.js project
2. Replace the `ENTOURAGE_SCRIPT_URL` value with the URL you just copied:

```typescript
const ENTOURAGE_SCRIPT_URL = 'YOUR_COPIED_WEB_APP_URL_HERE'
```

## Step 3: Deploy Principal Sponsor Management Script

### A. Create a Second Script Project

⚠️ **Important**: Principal Sponsors needs its own separate Apps Script project!

1. In your Google Spreadsheet, go to **Extensions** > **Apps Script**
2. This will open the Entourage script we created earlier
3. Open a new browser tab and go directly to: https://script.google.com
4. Click **New project**
5. Copy the entire contents of `principal-sponsor-management.js` and paste it
6. Click **File** > **Save**
7. Name your project: "Principal Sponsor Management"

### B. Connect to Your Spreadsheet

1. In the new script editor, click the **Project Settings** gear icon on the left
2. Scroll down to **Script Properties**
3. Add a property:
   - **Property**: `SPREADSHEET_ID`
   - **Value**: Your Google Spreadsheet ID (found in the URL of your spreadsheet)

4. Go back to the code editor (click the `<>` icon on the left)
5. At the top of the file, modify the `SpreadsheetApp.getActiveSpreadsheet()` calls:

Replace:
```javascript
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PrincipalSponsors');
```

With:
```javascript
const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('PrincipalSponsors');
```

Do this for ALL instances in the file (there should be 3-4).

### C. Initialize the Sheet

1. Select the function `initializePrincipalSponsorSheet` from the dropdown
2. Click **Run**
3. Grant permissions when prompted (same process as before)
4. Go back to your spreadsheet - you should now see a "PrincipalSponsors" sheet

### D. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Choose **Web app**
3. Configure:
   - **Description**: "Principal Sponsor Management API"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web app URL**

### E. Update Your Next.js App

1. Open `/app/api/principal-sponsor/route.ts`
2. Replace the `PRINCIPAL_SPONSOR_SCRIPT_URL` value:

```typescript
const PRINCIPAL_SPONSOR_SCRIPT_URL = 'YOUR_COPIED_WEB_APP_URL_HERE'
```

## Step 4: Test Your Setup

### Test Entourage

1. Start your Next.js development server: `pnpm dev`
2. Navigate to your dashboard
3. Go to the "Entourage & Principal Sponsors" tab
4. Click on "Entourage" sub-tab
5. Try adding a test entourage member
6. Verify it appears in your Google Sheet
7. Try editing the member - it should UPDATE the existing entry, not create a new one
8. Try deleting the member

### Test Principal Sponsors

1. Click on "Principal Sponsors" sub-tab
2. Try adding a test sponsor pair
3. Verify it appears in your Google Sheet
4. **Try editing the sponsor** - it should UPDATE the existing entry, not create a new one ✅
5. Try deleting the sponsor

## Troubleshooting

### Error: "Sheet not found"
- Make sure you ran the `initialize...Sheet()` function
- Check that the sheet names match exactly: "Entourage" and "PrincipalSponsors"

### Error: "Failed to update" or creates duplicate entries
- Make sure you updated the API route URLs in your Next.js app
- Make sure you deployed the scripts as "Execute as: Me"
- Check the Apps Script execution logs: **Executions** tab in the Apps Script editor

### Permission Issues
- Make sure "Who has access" is set correctly in the deployment
- If you changed deployment settings, you may need to redeploy

### Updates Not Showing
- Check your Google Sheet to see if the data was actually updated
- Clear your browser cache and refresh
- Check the browser console for errors (F12 > Console)

## Updating the Scripts

If you need to make changes to the scripts:

1. Open the Apps Script editor
2. Make your changes
3. Click **Deploy** > **Manage deployments**
4. Click the pencil icon next to your deployment
5. Change the version to "New version"
6. Add a description of your changes
7. Click **Deploy**

The URL will stay the same, so you don't need to update your Next.js app.

## Security Notes

- The scripts are deployed with "Execute as: Me", meaning they run with your permissions
- Consider using "Anyone with Google account" instead of "Anyone" for better security
- Keep your Web App URLs private - anyone with the URL can access your data
- For production, consider implementing authentication tokens

## Verified Fix

The bug where editing Principal Sponsors created new entries instead of updating has been fixed by:

1. ✅ Updated the API route to properly accept `originalMale` and `originalFemale` parameters
2. ✅ Created a new Google Apps Script that correctly identifies and updates sponsor rows using both male and female names
3. ✅ The component was already sending the correct data

After following this guide, editing should work correctly!


