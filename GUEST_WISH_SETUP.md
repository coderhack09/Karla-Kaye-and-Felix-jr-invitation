# Guest Wish Setup - Request to Join Feature

## Overview

The Guest Wish feature allows people who aren't on the guest list to request permission to join the wedding celebration. These requests are sent to a separate Google Sheet for the couple to review.

## Google Apps Script Implementation

Your Google Apps Script should have a sheet named `WishGuest` with the following structure:

### Sheet Structure

| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Name     | Email    | Phone    | RSVP     | Guest    | Message  |

### Header Row (Row 1)
```
Name | Email | Phone | RSVP | Guest | Message
```

## Complete Code Snippet

```javascript
function doPost(e) {
  // Guard against running without event data (e.g., from editor test runs)
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid request. This function must be called via web app deployment.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WishGuest');

  // Parse the request body
  const body = JSON.parse(e.postData.contents);

  try {
    if (body.action === 'update') {
      // Find and update row by name
      const lastRow = sheet.getLastRow();
      let found = false;
      const searchName = (body.Name || '').toString().trim();

      // Get values with proper defaults and safe string conversion
      const emailValue = (body.Email && body.Email.toString().trim() !== '') ? body.Email.toString().trim() : 'Pending';
      const phoneValue = (body.Phone && body.Phone.toString().trim() !== '') ? body.Phone.toString().trim() : '';
      const rsvpValue = (body.RSVP && body.RSVP.toString().trim() !== '') ? body.RSVP.toString().trim() : '';
      const guestValue = (body.Guest && body.Guest.toString().trim() !== '') ? body.Guest.toString().trim() : '';
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
          sheet.getRange(i, 1).setValue(searchName); // Column 1: Name
          sheet.getRange(i, 2).setValue(emailValue); // Column 2: Email
          sheet.getRange(i, 3).setValue(phoneValue); // Column 3: Phone
          sheet.getRange(i, 4).setValue(rsvpValue); // Column 4: RSVP
          sheet.getRange(i, 5).setValue(guestValue); // Column 5: Guest
          sheet.getRange(i, 6).setValue(messageValue); // Column 6: Message
          found = true;
          break;
        }
      }

      if (!found) {
        // If not found, add as new guest instead
        sheet.appendRow([
          searchName,
          emailValue,
          phoneValue,
          rsvpValue,
          guestValue,
          messageValue
        ]);
      }

    } else if (body.action === 'delete') {
      // Find and delete row by name
      const lastRow = sheet.getLastRow();
      const searchName = (body.Name || '').toString().trim();

      if (!searchName) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'Name is required for delete' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      for (let i = 2; i <= lastRow; i++) {
        const cellValue = sheet.getRange(i, 1).getValue().toString().trim();

        if (cellValue === searchName) {
          sheet.deleteRow(i);
          break;
        }
      }

    } else {
      // Add new guest (default action - when no action specified)
      const nameValue = (body.Name || '').toString().trim();
      const emailValue = (body.Email && body.Email.toString().trim() !== '') ? body.Email.toString().trim() : 'Pending';
      const phoneValue = (body.Phone && body.Phone.toString().trim() !== '') ? body.Phone.toString().trim() : '';
      const rsvpValue = (body.RSVP && body.RSVP.toString().trim() !== '') ? body.RSVP.toString().trim() : '';
      const guestValue = (body.Guest && body.Guest.toString().trim() !== '') ? body.Guest.toString().trim() : '';
      const messageValue = (body.Message && body.Message.toString().trim() !== '') ? body.Message.toString().trim() : '';

      if (!nameValue) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'Name is required' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      sheet.appendRow([
        nameValue,
        emailValue,
        phoneValue,
        rsvpValue,
        guestValue,
        messageValue
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
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WishGuest');

    // Get all data from the sheet
    const range = sheet.getDataRange();
    const values = range.getValues();

    // Skip header row
    const guests = [];
    for (let i = 1; i < values.length; i++) {
      guests.push({
        Name: values[i][0] || '',
        Email: values[i][1] || '',
        Phone: values[i][2] || '',
        RSVP: values[i][3] || '',
        Guest: values[i][4] || '',
        Message: values[i][5] || ''
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify(guests)
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this from the Apps Script editor to verify setup
function testSetup() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WishGuest');
    const lastRow = sheet.getLastRow();
    Logger.log('Sheet found. Last row: ' + lastRow);
    Logger.log('Headers: ' + sheet.getRange(1, 1, 1, 6).getValues());
    return 'Setup looks good! Sheet has ' + (lastRow - 1) + ' request(s).';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// Debug function - run this to test if update logic works
function testUpdateLogic() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WishGuest');
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
        Logger.log('Would update: Email, Phone, RSVP, Guest, Message');
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

## Deployment Steps

1. Open your Google Sheet with the `WishGuest` tab
2. Go to **Extensions → Apps Script**
3. Paste the code above into the editor
4. Save the script (Ctrl+S or Cmd+S)
5. Click **Deploy → New deployment**
6. Click the gear icon (⚙️) next to "Select type" and choose **Web app**
7. Fill in the deployment settings:
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
8. Click **Deploy**
9. **Copy the new Web App URL** that appears
10. **Update** the `GUEST_WISH_SCRIPT_URL` constant in `app/api/guest-requests/route.ts` with the new URL

## After Deployment

1. Open `app/api/guest-requests/route.ts`
2. Find line 4: `const GUEST_WISH_SCRIPT_URL = 'YOUR_GUEST_WISH_SCRIPT_URL_HERE'`
3. Replace with your new deployment URL
4. Save the file
5. Restart your development server

## Features

### Request to Join
- When a name is not found in the guest list, users can click "Request to Join"
- Modal opens with a form for:
  - Full Name (required)
  - Email (required)
  - Phone Number (optional)
  - Number of Guests (required, including themselves)
  - Message (optional)
- Requests are saved to the `WishGuest` Google Sheet
- Users receive a confirmation message

### Dashboard View
- View all guest requests in the dashboard
- Review and approve/reject requests
- Contact information available for follow-up

## IMPORTANT: Deploying Updated Script

**You must redeploy the Google Apps Script after making changes!**

### Deployment Steps:

1. Open your Google Sheet with the `WishGuest` tab
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
10. **Update** the `GUEST_WISH_SCRIPT_URL` constant in `app/api/guest-requests/route.ts` with the new URL

**Note:** The old deployment URL will continue to use the old code. You must create a new deployment to use the updated script!

### Testing Your Setup Before Deployment

After pasting the code into the Apps Script editor:

1. **Don't test `doPost` or `doGet`** - They'll show errors when run manually
2. **Instead, select and run `testSetup`** from the function dropdown
3. This will verify that:
   - Your sheet is named correctly (`WishGuest`)
   - The sheet has headers in the right order
   - The sheet has some request data

**Important:** `doPost` and `doGet` are only meant to be called by the web app deployment, not from the editor!

## Notes

- Keep this separate from the main guest list for better organization
- Review requests periodically and add approved guests to the main list
- The RSVP field in the request form is typically left empty - it's for your internal tracking

## Troubleshooting

### Issue: Error "An unknown error has occurred"

**Problem:** This usually happens due to:
- Missing or incorrect column structure
- Type conversion issues with cell values
- Missing error handling

**Solution:**
1. Make sure you've copied the **complete updated code** from above
2. The updated script includes `.toString().trim()` to handle different data types safely
3. All values are now checked for null/undefined before being used
4. **Most importantly**: You MUST create a **new deployment** after updating the script
5. Old deployments continue to use the old code even if you update the script editor
6. Follow the "Deployment Steps" above to create a fresh deployment
7. **Run `testSetup()` function** to verify your sheet structure
8. **Run `testUpdateLogic()` function** - Change the test name to an actual request name in your sheet and run it to see if the matching logic works

**IMPORTANT:** After deploying, check that you're using the NEW deployment URL in your Next.js app. The old URL will keep using the old code!

### Issue: Error "Cannot read properties of undefined (reading 'postData')"

**Problem:** You're trying to run `doPost` or `doGet` from the Apps Script editor.

**Solution:**
1. **This is normal!** Don't test `doPost` or `doGet` from the editor
2. These functions only work when called from the deployed web app
3. Instead, **select `testSetup` from the function dropdown and run that**
4. After deploying, test the actual functionality from your Next.js app or by calling the deployment URL directly

### Issue: Updates not working at all

**Possible causes:**
1. **Check Google Apps Script permissions**: Ensure the web app is deployed with "Anyone can access" and "Execute as me"
2. **Verify sheet name**: The sheet must be named exactly `WishGuest` (case-sensitive)
3. **Check column order**: Ensure columns are in the correct order (Name, Email, Phone, RSVP, Guest, Message)
4. **Test the URL**: Try accessing the Google Apps Script URL directly in a browser (should return JSON)
5. **Check console logs**: Look for any errors in the browser console

### Issue: Data types mismatch

The updated script now explicitly converts cell values to strings with `.toString()` to prevent type mismatches between numbers, dates, or other formats that Google Sheets might store. All values are also trimmed to remove leading/trailing whitespace.

