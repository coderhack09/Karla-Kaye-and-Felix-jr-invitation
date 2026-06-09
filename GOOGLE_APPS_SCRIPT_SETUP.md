# Google Apps Script Setup for Guest List CRUD

## Overview

The guest list feature integrates with Google Sheets through Google Apps Script to provide full CRUD (Create, Read, Update, Delete) operations for managing wedding guests.

## 🚨 Quick Fix: Duplicate Guest Issues

**If you're experiencing duplicate guests being added instead of updates:**

1. Copy the updated script code from the "Complete Code Snippet" section below
2. Open your Google Sheet → **Extensions → Apps Script**
3. Paste the new code and **Save**
4. **Deploy → New deployment → Web app** (this is critical!)
5. **Copy the NEW deployment URL**
6. Open `app/api/guests/route.ts` in your code editor
7. **Replace the old URL** on line 3 with the new deployment URL
8. Save the file
9. Test again

**Why this happens:** Old deployments use old code. You MUST create a new deployment AND update the URL in your code!

## Current Google Apps Script URL

```
https://script.google.com/macros/s/AKfycbyJyhNmmTRm9R9VuHywNDM_yW9SmcDaGLog6fwV3lQgz0_ukK-e36updU94uMRFktdO/exec
```

## Google Apps Script Implementation

Your Google Apps Script `doPost` function should handle three actions: `add`, `update`, and `delete`.

### Complete Code Snippet

```javascript
function doPost(e) {
  // Guard against running without event data (e.g., from editor test runs)
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid request. This function must be called via web app deployment.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GuestList');
  
  // Parse the request body
  const body = JSON.parse(e.postData.contents);
  
  try {
    if (body.action === 'update') {
      // Find and update row by name (supports originalName for lookup if name changed)
      const lastRow = sheet.getLastRow();
      let found = false;
      const searchName = (body.originalName || body.Name || '').toString().trim();
      const newName = (body.Name || searchName || '').toString().trim();
      
      // Get values with proper defaults
      const emailValue = (body.Email && body.Email.toString().trim() !== '') ? body.Email.toString().trim() : 'Pending';
      const rsvpValue = (body.RSVP && body.RSVP.toString().trim() !== '') ? body.RSVP.toString().trim() : '';
      const guestValue = (body.Guest && body.Guest.toString().trim() !== '') ? body.Guest.toString().trim() : '1';
      const messageValue = (body.Message && body.Message.toString().trim() !== '') ? body.Message.toString().trim() : '';
      
      if (!searchName) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'Name is required for update' })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      
      for (let i = 2; i <= lastRow; i++) {
        const cellValue = sheet.getRange(i, 1).getValue().toString().trim();
        
        if (cellValue === searchName) {
          // Update the existing row - update all columns
          sheet.getRange(i, 1).setValue(newName); // Column 1: Name
          sheet.getRange(i, 2).setValue(emailValue); // Column 2: Email
          sheet.getRange(i, 3).setValue(rsvpValue); // Column 3: RSVP
          sheet.getRange(i, 4).setValue(guestValue); // Column 4: Guest
          sheet.getRange(i, 5).setValue(messageValue); // Column 5: Message
          found = true;
          break;
        }
      }
      
      if (!found) {
        // If not found, add as new guest instead
        sheet.appendRow([
          newName,
          emailValue,
          rsvpValue,
          guestValue,
          messageValue
        ]);
      }
      
    } else if (body.action === 'delete') {
      // Find and delete row by name
      const lastRow = sheet.getLastRow();
      
      for (let i = 2; i <= lastRow; i++) {
        const cellValue = sheet.getRange(i, 1).getValue().toString().trim();
        const searchName = body.Name.trim();
        
        if (cellValue === searchName) {
          sheet.deleteRow(i);
          break;
        }
      }
      
    } else {
      // Add new guest (default action - when no action specified)
      sheet.appendRow([
        body.Name,
        body.Email || 'Pending',
        body.RSVP || '',
        body.Guest || '',
        body.Message || ''
      ]);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GuestList');
  
  // Get all data from the sheet
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  // Skip header row
  const guests = [];
  for (let i = 1; i < values.length; i++) {
    guests.push({
      Name: values[i][0],
      Email: values[i][1],
      RSVP: values[i][2],
      Guest: values[i][3],
      Message: values[i][4]
    });
  }
  
  return ContentService.createTextOutput(
    JSON.stringify(guests)
  ).setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this from the Apps Script editor to verify setup
function testSetup() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GuestList');
    const lastRow = sheet.getLastRow();
    Logger.log('Sheet found. Last row: ' + lastRow);
    Logger.log('Headers: ' + sheet.getRange(1, 1, 1, 5).getValues());
    return 'Setup looks good! Sheet has ' + (lastRow - 1) + ' guest(s).';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// Debug function - run this to test if update logic works
function testUpdateLogic() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GuestList');
    const lastRow = sheet.getLastRow();
    const testName = 'Test User'; // Change to an actual name in your sheet
    let found = false;
    
    Logger.log('Testing update logic for name: ' + testName);
    
    for (let i = 2; i <= lastRow; i++) {
      const cellValue = sheet.getRange(i, 1).getValue().toString().trim();
      Logger.log('Row ' + i + ': "' + cellValue + '"');
      
      if (cellValue === testName.trim()) {
        Logger.log('Match found at row ' + i + '!');
        found = true;
        Logger.log('Would update: Email, RSVP, Guest, Message');
        break;
      }
    }
    
    if (!found) {
      Logger.log('Name not found - would add new row');
    }
    
    return 'Test complete. Check logs.';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}
```

## IMPORTANT: Deploying Updated Script

**You must redeploy the Google Apps Script after making changes!**

### Deployment Steps:

1. Open your Google Sheet with the `GuestList` tab
2. Go to **Extensions → Apps Script**
3. Paste the updated code (shown above) into the editor
4. Save the script (Ctrl+S or Cmd+S)
5. Click **Deploy → New deployment**
6. Click the gear icon (⚙️) next to "Select type" and choose **Web app**
7. Fill in the deployment settings:
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
8. Click **Deploy**
9. **Copy the new Web App URL** that appears
10. **Update** the `GOOGLE_SCRIPT_URL` constant in `app/api/guests/route.ts` with the new URL

**Note:** The old deployment URL will continue to use the old code. You must create a new deployment to use the updated script!

### Testing Your Setup Before Deployment

After pasting the code into the Apps Script editor:

1. **Don't test `doPost` or `doGet`** - They'll show errors when run manually
2. **Instead, select and run `testSetup`** from the function dropdown
3. This will verify that:
   - Your sheet is named correctly (`GuestList`)
   - The sheet has headers in the right order
   - The sheet has some guest data

**Important:** `doPost` and `doGet` are only meant to be called by the web app deployment, not from the editor!

## Google Sheets Structure

Your sheet should be named `GuestList` with the following columns:

| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| Name     | Email    | RSVP     | Guest    | Message  |

### Header Row (Row 1)
```
Name | Email | RSVP | Guest | Message
```

## Features Implemented

### 1. Search with Autosuggest
- Real-time search by guest name
- Dropdown suggestions as you type
- Shows email and RSVP status in suggestions

### 2. View Guest Details
- Displays guest information card
- Shows RSVP status with visual indicators
- Displays custom messages if provided

### 3. Add Guest
- Form to add new guests to the list
- Validates required fields (Name, RSVP)
- Email, Guest count, and Message are optional

### 4. Update Guest (Edit)
- Edit button to modify guest information
- Update RSVP status (Yes/No/Maybe)
- Update email, guest count, and message
- Save changes back to Google Sheets

### 5. Delete Guest
- Remove guests from the list
- Confirmation dialog before deletion
- Permanently removes from Google Sheets

## API Endpoints

All endpoints are located at `/api/guests`:

- **GET** - Fetch all guests
- **POST** - Add new guest
- **PUT** - Update existing guest (with `action: 'update'`)
- **DELETE** - Delete guest (with `action: 'delete'`)

## Testing

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to the Guest List section on your wedding invitation page

3. Test each feature:
   - Search for existing guests
   - Add a new guest
   - Edit a guest's RSVP
   - Delete a guest

## Notes

- The current implementation uses the provided Google Apps Script URL
- All operations are performed client-side with server-side validation
- Error messages display for failed operations
- Success messages confirm successful operations
- The UI follows the same design pattern as your existing RSVP section

## Troubleshooting

### Issue: Error "Cannot read properties of undefined (reading 'postData')"

**Problem:** You're trying to run `doPost` or `doGet` from the Apps Script editor.

**Solution:**
1. **This is normal!** Don't test `doPost` or `doGet` from the editor
2. These functions only work when called from the deployed web app
3. Instead, **select `testSetup` from the function dropdown and run that**
4. After deploying, test the actual functionality from your Next.js app or by calling the deployment URL directly

### Issue: Duplicate entries appear when updating RSVP

**Problem:** The script is adding new rows instead of updating existing ones.

**Solution:**
1. Make sure you've copied the **complete updated code** from above (lines 35-182)
2. The updated script includes `.toString().trim()` to handle different data types
3. **Most importantly**: You MUST create a **new deployment** after updating the script
4. Old deployments continue to use the old code even if you update the script editor
5. Follow the "Deployment Steps" above to create a fresh deployment
6. **Run `testUpdateLogic()` function** - Change the test name to an actual guest name in your sheet and run it to see if the matching logic works

**IMPORTANT:** After deploying, check that you're using the NEW deployment URL in your Next.js app. The old URL will keep using the old code!

### Issue: Updates not working at all

**Possible causes:**
1. **Check Google Apps Script permissions**: Ensure the web app is deployed with "Anyone can access" and "Execute as me"
2. **Verify sheet name**: The sheet must be named exactly `GuestList` (case-sensitive)
3. **Check column order**: Ensure columns are in the correct order (Name, Email, RSVP, Guest, Message)
4. **Test the URL**: Try accessing the Google Apps Script URL directly in a browser (should return JSON)
5. **Check console logs**: Look for any errors in the browser console

### Issue: Name not found when searching

**Possible causes:**
1. Check for extra spaces in names
2. Check for spelling variations
3. The autocomplete uses case-insensitive partial matching
4. If a name truly isn't found, it will display "Name not found" message

### Issue: Data types mismatch

The updated script now explicitly converts cell values to strings with `.toString()` to prevent type mismatches between numbers, dates, or other formats that Google Sheets might store.

