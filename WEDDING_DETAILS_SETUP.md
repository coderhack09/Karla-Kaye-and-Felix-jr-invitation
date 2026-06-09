# Wedding Details Management Setup Guide

This guide covers the complete setup of the Wedding Details Management system for your dashboard.

## 📦 What Was Created

### 1. Google Apps Script (`/google-apps-script/wedding-details.js`)
A complete backend API that:
- Stores wedding details in Google Sheets
- Provides REST API endpoints for CRUD operations
- Automatically creates and manages the WeddingDetails sheet
- Includes data validation and timestamps

### 2. Wedding Details Editor Component (`/components/wedding-details-editor.tsx`)
A beautiful, full-featured editor that allows you to:
- Edit all wedding information in one place
- Toggle between view and edit modes
- Save changes with validation
- See success/error messages
- Manage:
  - Couple information (names and nicknames)
  - Wedding logistics (date, venue, tagline, theme, hashtag)
  - Ceremony details (venue, address, time, Google Maps URL)
  - Reception details (venue, address, time, Google Maps URL)
  - Contact information (phones and email)
  - Dress code (theme and notes)
  - Narratives (bride, groom, and shared stories)
  - RSVP settings (deadline)

### 3. API Client Library (`/lib/wedding-api.ts`)
TypeScript utilities for easy API integration:
- `getWeddingDetails()` - Fetch all wedding details
- `getWeddingDetail(key)` - Fetch a specific detail
- `updateWeddingDetails(updates)` - Update wedding details
- `initializeWeddingDetails()` - Initialize with default values
- Type-safe interfaces for all data structures

### 4. Documentation (`/google-apps-script/README.md`)
Complete setup and usage instructions

## 🚀 Quick Start

### Step 1: Set Up Google Apps Script

1. **Open your Google Sheet**
   - Go to your wedding data spreadsheet
   - Click **Extensions** > **Apps Script**

2. **Add the script**
   - Copy all content from `/google-apps-script/wedding-details.js`
   - Paste into the Apps Script editor
   - Update `SPREADSHEET_ID` with your sheet ID

3. **Test the script**
   - Run the `testSetup()` function
   - Authorize when prompted
   - Check logs to verify success

4. **Deploy as Web App**
   - Click **Deploy** > **New deployment**
   - Choose **Web app** type
   - Set "Execute as: Me"
   - Set "Who has access: Anyone" (or restrict as needed)
   - Click **Deploy** and copy the URL

### Step 2: Configure Your Next.js App

1. **Create `.env.local` file** in your project root:
   ```env
   NEXT_PUBLIC_WEDDING_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   Replace with your actual Web App URL from Step 1.4

2. **Restart your development server**
   ```bash
   pnpm run dev
   ```

### Step 3: Initialize Your Data

1. **Navigate to your dashboard**
   - Go to http://localhost:3001/dashboard
   - Log in
   - Click on "Wedding Details" tab

2. **Click "Edit Details"**
   - Update all fields with your actual wedding information
   - Click "Save All Changes"

## 🎨 Component Features

### View Mode
- Clean, organized display of all wedding information
- Color-coded sections for easy scanning
- Icons for visual clarity
- Read-only fields

### Edit Mode
- Inline editing of all fields
- Form validation
- Loading states during saves
- Success/error notifications
- Cancel button to discard changes
- Sticky save button for convenience

### Sections Included

1. **The Couple**
   - Bride's full name and nickname
   - Groom's full name and nickname

2. **Main Logistics**
   - Wedding date
   - Main venue
   - Wedding tagline
   - Theme
   - Hashtag

3. **Ceremony**
   - Venue name
   - Address
   - Time
   - Google Maps URL

4. **Reception**
   - Venue name
   - Address
   - Time
   - Google Maps URL

5. **Contact Information**
   - Bride's phone
   - Groom's phone
   - Shared email

6. **Dress Code**
   - Theme
   - Notes to guests

7. **Our Narratives**
   - About the bride
   - About the groom
   - Our shared story

8. **RSVP Settings**
   - RSVP deadline

## 📊 Data Flow

```
Dashboard Editor
      ↓
   API Client (wedding-api.ts)
      ↓
Google Apps Script (Web App)
      ↓
  Google Sheets (WeddingDetails)
```

## 🔧 Advanced Usage

### Fetching Data in Other Components

```typescript
import { getWeddingDetails } from '@/lib/wedding-api'

export default function MyComponent() {
  const [weddingData, setWeddingData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const data = await getWeddingDetails()
      setWeddingData(data)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>{weddingData?.couple.bride} & {weddingData?.couple.groom}</h1>
      <p>{weddingData?.wedding.date}</p>
    </div>
  )
}
```

### Updating Specific Fields

```typescript
import { updateWeddingDetails } from '@/lib/wedding-api'

const updateDate = async () => {
  await updateWeddingDetails({
    wedding: {
      date: 'New Date'
    }
  })
}
```

### Handling API Errors

```typescript
try {
  const result = await updateWeddingDetails(data)
  console.log(result.message)
} catch (error) {
  console.error('Failed to update:', error)
  // Show error to user
}
```

## 🔒 Security Best Practices

1. **Restrict Access**: In Google Apps Script deployment, set "Who has access" appropriately
2. **Validate Input**: Add validation in the Apps Script for critical fields
3. **Backup Data**: Regularly backup your Google Sheet
4. **Monitor Usage**: Check Apps Script execution logs periodically
5. **Rate Limiting**: Be aware of Google's quotas (20,000 URL fetches/day)

## 🐛 Troubleshooting

### "API URL not configured"
- Make sure `.env.local` exists with the correct URL
- Restart your dev server after creating/updating `.env.local`

### "Failed to fetch wedding details"
- Verify the Google Apps Script is deployed as a Web App
- Check "Who has access" settings in deployment
- Make sure the Spreadsheet ID is correct in the script

### Changes not saving
- Check browser console for errors
- Verify you have edit permissions on the Google Sheet
- Check Apps Script execution logs (View > Executions)

### CORS errors
- Ensure the script is deployed as a Web App (not just saved)
- Check deployment settings

## 📝 Example Data Structure

```typescript
{
  couple: {
    bride: "Jhessa May Acupan Flores",
    brideNickname: "Jhe",
    groom: "Al Josef Balida Tapayan",
    groomNickname: "Ai"
  },
  wedding: {
    date: "December 28, 2025",
    venue: "Minglanilla Church",
    tagline: "Two hearts, one love, forever united"
  },
  ceremony: {
    venue: "Minglanilla Church",
    address: "Minglanilla, Cebu",
    time: "2:00 PM",
    googleMapsUrl: ""
  },
  reception: {
    venue: "Minglanilla Sports Complex",
    address: "Minglanilla, Cebu",
    time: "5:00 PM",
    googleMapsUrl: ""
  },
  narratives: {
    bride: "A beautiful story...",
    groom: "A wonderful story...",
    shared: "Our love story..."
  },
  dressCode: {
    theme: "Formal Attire",
    note: "Please wear formal attire..."
  },
  contact: {
    bridePhone: "",
    groomPhone: "",
    email: ""
  },
  details: {
    rsvp: {
      deadline: "December 15, 2025"
    }
  },
  theme: "Classic Elegance",
  hashtag: "#AiAndJhe2025"
}
```

## 🎯 Next Steps

1. ✅ Set up Google Apps Script
2. ✅ Configure environment variable
3. ✅ Initialize your wedding data
4. 📝 Update all fields with your actual information
5. 🎨 Customize the component styling if needed
6. 🧪 Test the save functionality
7. 🚀 Deploy to production

## 📚 Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [React Hook Form](https://react-hook-form.com/) - For advanced form handling

## 🙏 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Google Apps Script execution logs
3. Verify all configuration steps were completed
4. Check browser console for error messages

---

**Created**: December 19, 2025  
**Component**: Wedding Details Editor  
**Files Modified**: 5 files created/updated

