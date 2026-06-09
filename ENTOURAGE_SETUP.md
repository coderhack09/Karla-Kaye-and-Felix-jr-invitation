# Entourage Setup - Wedding Party Management

## Quick Fix
**CRITICAL**: If you already deployed the script, you **MUST** redeploy it as a **NEW deployment** after updating the code. The URL will change - update `app/api/entourage/route.ts` with the new URL. Old deployments retain old code, which causes duplicate entries when editing.

## Overview

The Entourage feature allows you to manage your wedding party members (Best Man, Matron of Honor, Bridesmaids, Groomsmen, etc.) through the dashboard.

## Google Apps Script Implementation

Your Google Apps Script should have a sheet named `Entourage` with the following structure:

### Sheet Structure

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Name     | RoleCategory | RoleTitle | Email |

### Header Row (Row 1)
```
Name | RoleCategory | RoleTitle | Email
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
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entourage');
  
  // Parse the request body
  const body = JSON.parse(e.postData.contents);
  
  try {
    if (body.action === 'update') {
      // Find and update row by originalName (or Name as fallback)
      const lastRow = sheet.getLastRow();
      let found = false;
      const searchName = (body.originalName || body.Name).trim();
      
      for (let i = 2; i <= lastRow; i++) {
        const cellValue = sheet.getRange(i, 1).getValue().toString().trim();
        
        if (cellValue === searchName) {
          // Update the existing row with new values
          sheet.getRange(i, 1).setValue(body.Name || '');
          sheet.getRange(i, 2).setValue(body.RoleCategory || '');
          sheet.getRange(i, 3).setValue(body.RoleTitle || '');
          sheet.getRange(i, 4).setValue(body.Email || '');
          found = true;
          break;
        }
      }
      
      if (!found) {
        // If not found, add as new member instead
        sheet.appendRow([
          body.Name,
          body.RoleCategory || '',
          body.RoleTitle || '',
          body.Email || ''
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
        body.RoleCategory || '',
        body.RoleTitle || '',
        body.Email || ''
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entourage');
  
  // Get all data from the sheet
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  // Skip header row
  const guests = [];
  for (let i = 1; i < values.length; i++) {
    guests.push({
      Name: values[i][0],
      RoleCategory: values[i][1],
      RoleTitle: values[i][2],
      Email: values[i][3]
    });
  }
  
  return ContentService.createTextOutput(
    JSON.stringify(guests)
  ).setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this from the Apps Script editor to verify setup
function testSetup() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entourage');
    const lastRow = sheet.getLastRow();
    Logger.log('Sheet found. Last row: ' + lastRow);
    Logger.log('Headers: ' + sheet.getRange(1, 1, 1, 4).getValues());
    return 'Setup looks good! Sheet has ' + (lastRow - 1) + ' member(s).';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// Debug function - run this to test if update logic works
function testUpdateLogic() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entourage');
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
        Logger.log('Would update: RoleCategory, RoleTitle, Email');
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

## Deployment Instructions

1. **Open Google Sheets**
   - Create a new Google Sheet or open your existing wedding planning spreadsheet
   - Create a new sheet tab named `Entourage`
   - Add headers in Row 1: `Name`, `RoleCategory`, `RoleTitle`, `Email`

2. **Open Google Apps Script Editor**
   - Click `Extensions` → `Apps Script`
   - Delete any default code

3. **Paste the Code**
   - Copy and paste the `doPost`, `doGet`, `testSetup`, and `testUpdateLogic` functions above
   - Save the project (Ctrl+S or Cmd+S)

4. **Test Your Setup**
   - In the Apps Script editor, select `testSetup` from the function dropdown
   - Click the Run ▶ button
   - Check the Execution log (View → Execution log) to see the result
   - Should return: "Setup looks good! Sheet has X member(s)."

5. **Deploy as Web App**
   - Click `Deploy` → `New deployment`
   - Click the gear icon ⚙️ next to "Select type" and choose "Web app"
   - Set:
     - **Description**: "Entourage Management API"
     - **Execute as**: "Me"
     - **Who has access**: "Anyone"
   - Click `Deploy`
   - Copy the Web App URL

6. **Update Your Next.js Code**
   - Open `app/api/entourage/route.ts`
   - Replace `YOUR_ENTOURAGE_SCRIPT_URL_HERE` with your Web App URL

## Testing Your Setup

### Quick Test in Apps Script Editor
1. Run `testSetup()` to verify the sheet structure
2. Run `testUpdateLogic()` with an actual name from your sheet to test update logic

### Important Notes
- **DO NOT run `doPost` or `doGet` directly** from the editor - they require web app deployment context
- Always create a **NEW deployment** after making code changes - old deployments retain old code
- The URL changes with each new deployment

## Troubleshooting

### Error: "Sheet not found"
- Make sure the sheet tab is named exactly `Entourage` (case-sensitive)

### Duplicate entries when updating
- Redeploy the Apps Script as a new web app
- Update the URL in your Next.js code
- Old deployments serve old code

### TypeError: Cannot read properties of undefined (reading 'postData')
- This is expected when running `doPost` from the editor
- The guard prevents errors during manual testing
- Deploy as web app and test through the dashboard instead

## Example Data Structure

| Name | RoleCategory | RoleTitle | Email |
|------|--------------|-----------|-------|
| John Smith | Wedding Party | Best Man | john@example.com |
| Jane Doe | Wedding Party | Matron of Honor | jane@example.com |
| Michael Johnson | Wedding Party | Groomsman | michael@example.com |
| Sarah Williams | Wedding Party | Bridesmaid | sarah@example.com |

## Field Descriptions

- **Name** (Required): Full name of the entourage member
- **RoleCategory** (Optional): Category grouping (e.g., "Wedding Party", "Family", "Officiant")
- **RoleTitle** (Optional): Specific role (e.g., "Best Man", "Matron of Honor", "Flower Girl")
- **Email** (Optional): Contact email for the member

## Dashboard Features

Once set up, you'll be able to:
- ✅ View all entourage members in the Entourage tab
- ✅ Add new members with their roles
- ✅ Edit existing member details
- ✅ Delete members
- ✅ Search by name, role, or email
- ✅ See total count in the dashboard stats

