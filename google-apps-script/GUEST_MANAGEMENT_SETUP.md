# Guest Management System Setup Guide

This guide will help you set up the advanced guest management system with companion tracking, VIP status, and detailed RSVP management.

## Features

- ✨ **Advanced Guest Tracking**: Store detailed information about each guest
- 👥 **Companion Management**: Track additional guests (spouse, children, +1s)
- ⭐ **VIP Status**: Mark important guests as VIP
- 📊 **RSVP Status**: Track confirmations, pending responses, and declined invitations
- 🪑 **Table Assignment**: Assign guests to specific tables
- 📝 **Personal Messages**: Store guest messages and well-wishes
- 🏷️ **Added By Tracking**: Know who added each guest (bride, groom, family)
- 📤 **Bulk Import**: Import multiple guests at once
- 📊 **Statistics API**: Get real-time stats about your guest list

## Prerequisites

- Google Account
- Google Sheets spreadsheet for your wedding data
- Basic understanding of Google Apps Script

---

## Step 1: Create/Open Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Open your existing wedding spreadsheet or create a new one
3. Note the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

---

## Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. This will open the Apps Script editor in a new tab

---

## Step 3: Add the Script

1. Delete any existing code in the editor
2. Copy the entire contents of `guest-management.js`
3. Paste it into the Apps Script editor

---

## Step 4: Initialize the Sheet

1. Click the **Save** icon (💾) or press `Ctrl+S`
2. Name your project (e.g., "Wedding Guest Management API")
3. Run the `initializeGuestSheet()` function to set up the sheet:
   - Select `initializeGuestSheet` from the function dropdown
   - Click the **Run** button (▶️)
   - You may need to authorize the script (first time only)
     - Click "Review permissions"
     - Choose your Google account
     - Click "Advanced" if you see a warning
     - Click "Go to [Project Name] (unsafe)" - it's your own script, so it's safe
     - Click "Allow"

4. Go back to your spreadsheet - you should now see a new "Guests" sheet with column headers

---

## Step 5: (Optional) Add Sample Data

To test the system with sample data:

1. In the Apps Script editor, select `addSampleGuests` from the function dropdown
2. Click the **Run** button (▶️)
3. Check your "Guests" sheet - you should see 3 sample guests

---

## Step 6: Deploy as Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: Guest Management API
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (for public access)
     - ⚠️ **Security Note**: "Anyone" means anyone with the URL can access it. For better security, choose "Anyone with Google account" and implement authentication in your Next.js app
5. Click **Deploy**
6. **Important**: Copy the **Web app URL** - you'll need this for your Next.js app
   - It will look like: `https://script.google.com/macros/s/AKfyc.../exec`

---

## Step 7: Update Your Next.js App

### Option A: Update the Existing API Route

Open `/app/api/guests/route.ts` and replace the `GOOGLE_SCRIPT_URL` with your new deployment URL:

```typescript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec'
```

### Option B: Create a New API Route

Create a new file `/app/api/guests-advanced/route.ts`:

```typescript
import { type NextRequest, NextResponse } from "next/server"

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

export interface Guest {
  id: string
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

// GET: Fetch all guests
export async function GET() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch guests')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    )
  }
}

// POST: Add a new guest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!body.role || typeof body.role !== 'string') {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    const guestData = {
      action: 'create',
      name: body.name.trim(),
      role: body.role.trim(),
      email: body.email?.trim() || '',
      contact: body.contact?.trim() || '',
      message: body.message?.trim() || '',
      allowedGuests: parseInt(body.allowedGuests) || 1,
      companions: body.companions || [],
      tableNumber: body.tableNumber?.trim() || '',
      isVip: body.isVip === true,
      status: body.status || 'pending',
      addedBy: body.addedBy?.trim() || '',
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestData),
    })

    if (!response.ok) {
      throw new Error('Failed to add guest')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding guest:', error)
    return NextResponse.json(
      { error: 'Failed to add guest' },
      { status: 500 }
    )
  }
}

// PUT: Update an existing guest
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.id || typeof body.id !== 'string') {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }

    const updateData = {
      action: 'update',
      id: body.id,
      ...body
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error('Failed to update guest')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Error updating guest:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update guest' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a guest
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.id || typeof body.id !== 'string') {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }

    const deleteData = {
      action: 'delete',
      id: body.id,
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteData),
    })

    if (!response.ok) {
      throw new Error('Failed to delete guest')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    )
  }
}
```

---

## Step 8: Integrate the Improved Guest List Component

1. Use the improved guest list component in your dashboard:

```typescript
import { ImprovedGuestList, Guest } from '@/components/improved-guest-list'

// In your dashboard component
const [guests, setGuests] = useState<Guest[]>([])

// Fetch guests
const fetchGuests = async () => {
  const response = await fetch('/api/guests-advanced')
  const data = await response.json()
  setGuests(data)
}

// Add guest
const handleAddGuest = async (guestData: Omit<Guest, 'id'>) => {
  await fetch('/api/guests-advanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(guestData),
  })
  fetchGuests()
}

// Update guest
const handleUpdateGuest = async (guest: Guest) => {
  await fetch('/api/guests-advanced', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(guest),
  })
  fetchGuests()
}

// Delete guest
const handleDeleteGuest = async (id: string) => {
  await fetch('/api/guests-advanced', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  fetchGuests()
}

// Render
<ImprovedGuestList
  guests={guests}
  onAddGuest={handleAddGuest}
  onUpdateGuest={handleUpdateGuest}
  onDeleteGuest={handleDeleteGuest}
/>
```

---

## API Endpoints

### GET - Fetch All Guests

```javascript
fetch('YOUR_WEB_APP_URL')
  .then(response => response.json())
  .then(guests => console.log(guests))
```

**Response:**
```json
[
  {
    "id": "uuid-here",
    "name": "John Smith",
    "role": "Friend",
    "email": "john@example.com",
    "contact": "+1234567890",
    "message": "So excited!",
    "allowedGuests": 3,
    "companions": [
      { "name": "Jane Smith", "relationship": "Spouse" },
      { "name": "Baby Smith", "relationship": "Child" }
    ],
    "tableNumber": "T1",
    "isVip": true,
    "status": "confirmed",
    "addedBy": "Groom",
    "createdAt": "2025-12-19T...",
    "updatedAt": "2025-12-19T..."
  }
]
```

### POST - Create Guest

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  body: JSON.stringify({
    action: 'create',
    name: 'John Smith',
    role: 'Friend',
    email: 'john@example.com',
    contact: '+1234567890',
    allowedGuests: 3,
    companions: [
      { name: 'Jane Smith', relationship: 'Spouse' }
    ],
    tableNumber: 'T1',
    isVip: true,
    status: 'pending',
    addedBy: 'Groom'
  })
})
```

### POST - Update Guest

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  body: JSON.stringify({
    action: 'update',
    id: 'uuid-here',
    name: 'John Smith Updated',
    status: 'confirmed'
  })
})
```

### POST - Delete Guest

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  body: JSON.stringify({
    action: 'delete',
    id: 'uuid-here'
  })
})
```

### POST - Bulk Import

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  body: JSON.stringify({
    action: 'bulk_import',
    guests: [
      { name: 'Guest 1', role: 'Friend', allowedGuests: 1 },
      { name: 'Guest 2', role: 'Family', allowedGuests: 2 }
    ]
  })
})
```

---

## Google Sheet Structure

After initialization, your "Guests" sheet will have the following columns:

| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | ID | UUID | Unique identifier (auto-generated) |
| B | Name | String | Primary guest name |
| C | Role | String | Relationship to couple (Friend, Family, Colleague) |
| D | Email | String | Guest email address |
| E | Contact | String | Phone number |
| F | Message | String | Personal message from guest |
| G | AllowedGuests | Number | Total people allowed (including primary) |
| H | Companions | JSON | Array of companions `[{name, relationship}]` |
| I | TableNumber | String | Assigned table number |
| J | IsVip | Boolean | VIP status |
| K | Status | String | RSVP status (pending/confirmed/declined/request) |
| L | AddedBy | String | Who added this guest (Bride/Groom/Family) |
| M | CreatedAt | ISO Date | When guest was added |
| N | UpdatedAt | ISO Date | Last update timestamp |

---

## Testing the Setup

### 1. Test in Apps Script Editor

Run `testSetup()` to verify the sheet is properly initialized:

```
Sheet found: Guests
Last row: 1
Headers: [ID, Name, Role, Email, Contact]
Setup looks good!
```

### 2. Test doGet

Run `testDoGet()` to test fetching guests:

```
Testing doGet...
Result: []
doGet test complete. Check logs.
```

### 3. Test in Browser

Visit your Web App URL in a browser - you should see a JSON response with your guests (or an empty array if no guests yet).

---

## Advanced Features

### Get Statistics

Add this function to your Apps Script to get guest statistics:

```javascript
// Already included in guest-management.js
getGuestStatistics()
```

Returns:
```json
{
  "total": 50,
  "confirmed": 35,
  "pending": 10,
  "declined": 5,
  "vip": 8,
  "totalPax": 120,
  "byAddedBy": {
    "Bride": 25,
    "Groom": 20,
    "Family": 5
  }
}
```

### Export to CSV

Use the `exportGuestsToCSV()` function to get a CSV export of all guests.

---

## Security Considerations

1. **Authentication**: Consider adding authentication to your API route
2. **Authorization**: Verify user permissions before allowing edits
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Always validate and sanitize input data
5. **HTTPS**: Ensure your Next.js app uses HTTPS in production
6. **Environment Variables**: Store the script URL in `.env.local`, not in code

Example `.env.local`:
```
NEXT_PUBLIC_GUEST_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## Troubleshooting

### "Guests sheet not found" error
- Run `initializeGuestSheet()` from the Apps Script editor
- Check that the sheet name is exactly "Guests"

### "Authorization required" error
- Run the script manually once to authorize
- Check permissions in your Google account

### Changes not saving
- Check the execution logs: View > Executions
- Verify you have edit permissions on the sheet
- Check for JSON parsing errors in the Companions field

### CORS errors
- Make sure you deployed as a Web App
- Check "Who has access" settings in deployment config

### Companions not showing
- Verify the Companions column contains valid JSON
- Check that the JSON structure is: `[{"name":"...", "relationship":"..."}]`

---

## Migration from Old System

If you have existing guests in the old format (Name, Email, RSVP, Guest, Message), you can migrate them:

1. **Manual Migration**: Copy data from old sheet to new sheet, converting as needed
2. **Script Migration**: Create a migration function:

```javascript
function migrateOldGuests() {
  const oldSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OldGuests');
  const newSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
  
  const lastRow = oldSheet.getLastRow();
  const oldData = oldSheet.getRange(2, 1, lastRow - 1, 5).getValues();
  
  oldData.forEach(row => {
    createGuest(newSheet, {
      name: row[0],
      role: 'Guest', // Default role
      email: row[1],
      contact: '',
      message: row[4],
      allowedGuests: parseInt(row[3]) || 1,
      companions: [],
      tableNumber: '',
      isVip: false,
      status: row[2] === 'Yes' ? 'confirmed' : row[2] === 'No' ? 'declined' : 'pending',
      addedBy: 'Migration'
    });
  });
}
```

---

## Support

For issues or questions:
1. Check the execution logs in Apps Script (View > Executions)
2. Review Google Apps Script documentation
3. Verify sheet permissions
4. Check the console logs in your browser's developer tools

---

## License

This script is provided as-is for your wedding website project.

---

## Changelog

### Version 1.0.0 (2025-12-19)
- Initial release
- Full CRUD operations for guests
- Companion tracking
- VIP status
- Table assignments
- RSVP status tracking
- Bulk import functionality
- Statistics API
- Export to CSV

---

Happy planning! 💒💍✨


