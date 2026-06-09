# Google Apps Script Setup for Wedding Details Management

This guide will help you set up the Google Apps Script to manage your wedding details from your dashboard.

## Prerequisites

- Google Account
- Google Sheets spreadsheet for your wedding data

## Step 1: Create/Open Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Open your existing wedding spreadsheet or create a new one
3. Note the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. This will open the Apps Script editor in a new tab

## Step 3: Add the Script

1. Delete any existing code in the editor
2. Copy the entire contents of `wedding-details.js`
3. Paste it into the Apps Script editor
4. Replace `YOUR_SPREADSHEET_ID` with your actual Spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'your-actual-spreadsheet-id-here';
   ```

## Step 4: Save and Test

1. Click the **Save** icon (💾) or press `Ctrl+S`
2. Name your project (e.g., "Wedding Details API")
3. Run the `testSetup()` function to verify everything works:
   - Select `testSetup` from the function dropdown
   - Click the **Run** button (▶️)
   - You may need to authorize the script (first time only)
   - Check the logs (View > Logs) to see if it ran successfully

## Step 5: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: Wedding Details API
   - **Execute as**: Me
   - **Who has access**: Anyone (for public access) or Anyone with Google account
5. Click **Deploy**
6. Copy the **Web app URL** (you'll need this for your Next.js app)

## Step 6: Configure Your Next.js App

Create a `.env.local` file in your Next.js project root:

```env
NEXT_PUBLIC_WEDDING_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## API Endpoints

### GET Requests

#### Get All Wedding Details
```
GET {API_URL}?action=get
```

Response:
```json
{
  "couple": {
    "bride": "Jhessa May Acupan Flores",
    "brideNickname": "Jhe",
    "groom": "Al Josef Balida Tapayan",
    "groomNickname": "Ai"
  },
  "wedding": {
    "date": "December 28, 2025",
    "venue": "Minglanilla Church",
    "tagline": "Two hearts, one love, forever united"
  },
  ...
}
```

#### Get Specific Detail
```
GET {API_URL}?action=getDetail&key=couple.bride
```

#### Initialize Default Data
```
GET {API_URL}?action=initialize
```

### POST Requests

#### Update Wedding Details
```javascript
fetch(API_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'update',
    updates: {
      couple: {
        bride: 'New Bride Name'
      },
      wedding: {
        date: 'New Date'
      }
    }
  })
})
```

## Using in Your Next.js App

Create a utility file `lib/wedding-api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_WEDDING_API_URL

export async function getWeddingDetails() {
  const response = await fetch(`${API_URL}?action=get`)
  return response.json()
}

export async function updateWeddingDetails(updates: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'update',
      updates
    })
  })
  return response.json()
}

export async function initializeWeddingDetails() {
  const response = await fetch(`${API_URL}?action=initialize`)
  return response.json()
}
```

Then use it in your components:

```typescript
import { updateWeddingDetails } from '@/lib/wedding-api'

const handleSubmit = async (formData) => {
  const result = await updateWeddingDetails(formData)
  console.log(result) // { success: true, message: '...' }
}
```

## Sheet Structure

The script will create a "WeddingDetails" sheet with the following structure:

| Key | Value | LastUpdated |
|-----|-------|-------------|
| couple.bride | Jhessa May Acupan Flores | 2025-12-19T... |
| couple.brideNickname | Jhe | 2025-12-19T... |
| wedding.date | December 28, 2025 | 2025-12-19T... |
| ... | ... | ... |

## Security Considerations

1. **Authentication**: The script runs as you, so make sure you trust who you give access to
2. **CORS**: The Web App URL supports CORS by default
3. **Rate Limiting**: Google Apps Script has quotas:
   - URL Fetch calls: 20,000/day (free accounts)
   - Execution time: 6 minutes/execution
4. **Data Validation**: Add validation in the script if needed

## Troubleshooting

### "Authorization required" error
- Run the script manually once to authorize
- Check permissions in your Google account

### "Script not found" error
- Verify the Spreadsheet ID is correct
- Make sure the sheet hasn't been deleted

### Changes not saving
- Check the execution logs: View > Executions
- Verify you have edit permissions on the sheet

### CORS errors
- Make sure you deployed as a Web App
- Check "Who has access" settings

## Advanced Features

### Add Email Notifications

```javascript
function updateWeddingDetails(updates) {
  // ... existing code ...
  
  // Send notification email
  MailApp.sendEmail({
    to: 'your-email@example.com',
    subject: 'Wedding Details Updated',
    body: 'Wedding details have been updated: ' + JSON.stringify(updates)
  })
  
  return { success: true, message: 'Wedding details updated successfully' }
}
```

### Add Backup Functionality

```javascript
function backupWeddingDetails() {
  const sheet = getWeddingDetailsSheet()
  const backupSheet = getSpreadsheet().insertSheet('Backup_' + new Date().toISOString())
  
  sheet.getDataRange().copyTo(backupSheet.getRange(1, 1))
  
  return { success: true, message: 'Backup created' }
}
```

## Support

For issues or questions:
1. Check the execution logs in Apps Script
2. Review Google Apps Script documentation
3. Check the sheet permissions

## License

This script is provided as-is for your wedding website project.


