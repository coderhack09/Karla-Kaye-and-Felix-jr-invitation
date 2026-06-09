# Wedding Details API Setup Guide

This guide will help you set up the Wedding Details management system that connects your dashboard to Google Sheets.

## Overview

The Wedding Details system allows you to manage all wedding information from your admin dashboard, with data stored in a Google Sheet for easy backup and sharing.

## Files Created

1. **Google Apps Script**: `google-apps-script/wedding-details-single-row.js`
2. **Next.js API Route**: `app/api/wedding-details/route.ts`
3. **React Component**: `components/wedding-details-editor.tsx`

## Step 1: Set Up Google Sheet

### 1.1 Create the Sheet

1. Open your existing Google Spreadsheet (the one with your GuestList)
2. Create a new sheet tab called **`WeddingDetails`**

### 1.2 Add Headers (Row 1)

Add these column headers in row 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Bride Full Name | Bride Nickname | Groom Full Name | Groom Nickname | Wedding Date | Wedding Venue | Wedding Tagline | Theme |

| I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|
| Hashtag | Ceremony Venue | Ceremony Address | Ceremony Time | Ceremony Google Maps URL | Reception Venue | Reception Address | Reception Time |

| Q | R | S | T | U | V | W | X | Y | Z |
|---|---|---|---|---|---|---|---|---|---|
| Reception Google Maps URL | About the Bride | About the Groom | Shared Love Story | Dress Code Theme | Dress Code Note | RSVP Deadline | Bride Phone | Groom Phone | Contact Email |

**Total: 26 columns (A-Z)**

### 1.3 Add Initial Data (Row 2)

You can manually add your wedding data in row 2, or use the script to initialize with default values.

## Step 2: Deploy Google Apps Script

### 2.1 Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. If you already have a script for GuestList, you'll see it

### 2.2 Add Wedding Details Script

1. Click the **+** icon next to "Files" → **Script**
2. Name it **`WeddingDetailsAPI`**
3. Copy the contents from `google-apps-script/wedding-details-single-row.js`
4. Paste it into the new script file
5. Click **Save** (💾 icon)

### 2.3 Test the Script

Before deploying, test that everything works:

1. In the Apps Script editor, select the function **`testInitialize`** from the dropdown
2. Click **Run** (▶️ icon)
3. Grant permissions when prompted:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
4. Check the **Execution log** at the bottom - you should see "Initialization complete!"
5. Go back to your Google Sheet and verify that row 2 now has default data

### 2.4 Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Wedding Details API"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **IMPORTANT**: Copy the **Web app URL** - you'll need this for Step 3!
   - It looks like: `https://script.google.com/macros/s/AKfycby.../exec`

### 2.5 Test the Web App

1. In Apps Script, select **`testDoGet`** from the dropdown
2. Click **Run**
3. Check the logs - you should see your wedding details as JSON

## Step 3: Configure Next.js API

### 3.1 Update the API Route

1. Open `app/api/wedding-details/route.ts`
2. Find this line near the top:
   ```typescript
   const GOOGLE_SCRIPT_URL = 'YOUR_WEDDING_DETAILS_SCRIPT_URL_HERE'
   ```
3. Replace `YOUR_WEDDING_DETAILS_SCRIPT_URL_HERE` with your Web App URL from Step 2.4
4. Save the file

**Example:**
```typescript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec'
```

## Step 4: Test the System

### 4.1 Test from Dashboard

1. Start your Next.js dev server if not already running:
   ```bash
   pnpm dev
   ```
2. Go to your dashboard: `http://localhost:3000/dashboard` (or your port)
3. Log in with your password
4. Click on **"Wedding Details"** in the sidebar
5. You should see the editor with your wedding information

### 4.2 Test Editing

1. Update any field (e.g., change the tagline)
2. Click **"Save Changes"**
3. You should see a success message
4. Click **"Refresh"** to reload data from Google Sheets
5. Verify your changes persisted

### 4.3 Verify in Google Sheets

1. Go back to your Google Sheet
2. Check the **WeddingDetails** tab
3. Verify that row 2 has your updated data

## Data Structure

The system stores data in a **single row** (row 2) with 26 columns:

### Couple Information (Columns 1-4)
- **A**: Bride Full Name
- **B**: Bride Nickname
- **C**: Groom Full Name
- **D**: Groom Nickname

### Wedding Information (Columns 5-9)
- **E**: Wedding Date
- **F**: Wedding Venue
- **G**: Wedding Tagline
- **H**: Theme
- **I**: Hashtag

### Ceremony Details (Columns 10-13)
- **J**: Ceremony Venue
- **K**: Ceremony Address
- **L**: Ceremony Time
- **M**: Ceremony Google Maps URL

### Reception Details (Columns 14-17)
- **N**: Reception Venue
- **O**: Reception Address
- **P**: Reception Time
- **Q**: Reception Google Maps URL

### Narratives (Columns 18-20)
- **R**: About the Bride
- **S**: About the Groom
- **T**: Shared Love Story

### Additional Details (Columns 21-23)
- **U**: Dress Code Theme
- **V**: Dress Code Note
- **W**: RSVP Deadline

### Contact Information (Columns 24-26)
- **X**: Bride Phone
- **Y**: Groom Phone
- **Z**: Contact Email

## API Endpoints

### GET `/api/wedding-details`
Retrieves all wedding details from Google Sheets as a nested JSON object.

**Example Response:**
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
  "theme": "Classic Elegance",
  "hashtag": "#AiAndJhe2025",
  // ... more fields
}
```

### PUT `/api/wedding-details`
Updates wedding details in Google Sheets.

**Request Body:**
```json
{
  "couple": {
    "bride": "Updated Name"
  },
  "wedding": {
    "date": "New Date"
  }
  // ... any fields you want to update
}
```

### POST `/api/wedding-details`
Initialize with default values.

**Request Body:**
```json
{
  "action": "initialize"
}
```

## Troubleshooting

### Error: "Failed to fetch wedding details"

**Possible Causes:**
1. Google Apps Script URL not configured in `route.ts`
2. Google Apps Script not deployed as Web App
3. Deployment permissions incorrect

**Solution:**
- Verify the GOOGLE_SCRIPT_URL in `app/api/wedding-details/route.ts`
- Redeploy the Google Apps Script as a Web App
- Ensure "Who has access" is set to "Anyone"

### Error: "WeddingDetails sheet not found"

**Solution:**
1. Go to your Google Sheet
2. Create a new tab named exactly **`WeddingDetails`** (case-sensitive)
3. Run `testInitialize()` from Apps Script to set up the sheet

### Changes Not Saving

**Solution:**
1. Open Google Apps Script editor
2. Check the **Executions** log (left sidebar, clock icon)
3. Look for errors in recent executions
4. Common issue: The script might not have permission to modify the sheet
5. Try running `testInitialize()` again to verify permissions

### Data Structure Mismatch

If you modified the column structure:
1. Update the Google Apps Script to match your columns
2. Update the `WeddingDetails` interface in `route.ts`
3. Update the `WeddingDetailsEditor` component form fields
4. Redeploy the Google Apps Script

## Security Notes

- The Google Apps Script is deployed with "Anyone" access, but it doesn't expose sensitive operations
- Only GET (read) and POST (update) operations are allowed
- No delete operations are supported
- The dashboard requires password authentication
- Consider using environment variables for the GOOGLE_SCRIPT_URL in production

## Maintenance

### Updating the Script

If you need to modify the Google Apps Script:
1. Make changes in the Apps Script editor
2. Click **Save**
3. Click **Deploy** → **Manage deployments**
4. Click the edit icon (✏️) next to your deployment
5. Change version to **New version**
6. Add a description of changes
7. Click **Deploy**

The URL remains the same, so no need to update `route.ts`.

### Backup

Your data is automatically backed up in Google Sheets. To create additional backups:
1. Go to **File** → **Download** → **Microsoft Excel** or **CSV**
2. Or use **File** → **Make a copy**

## Next Steps

Once your Wedding Details API is set up:
1. ✅ Your dashboard can now manage all wedding information
2. ✅ Data syncs automatically with Google Sheets
3. ✅ You can share the Google Sheet with other team members
4. ✅ The wedding website can pull data from the same source

Consider creating similar APIs for other data types if needed!

## Support

If you encounter issues:
1. Check the Google Apps Script **Executions** log
2. Check the Next.js dev server console
3. Check the browser console for client-side errors
4. Verify the Google Sheet structure matches the documentation

---

**Happy Wedding Planning! 💒💍**


