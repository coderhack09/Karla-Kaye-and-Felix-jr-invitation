# Wedding Details - Quick Start Guide 🚀

## What Was Created

A complete content management system for wedding details that connects your dashboard to Google Sheets, just like your GuestList system!

### 📁 Files Created:

1. **`google-apps-script/wedding-details-single-row.js`** - Google Apps Script for Sheet communication
2. **`app/api/wedding-details/route.ts`** - Next.js API endpoint
3. **`components/wedding-details-editor.tsx`** - Dashboard editor component
4. **`WEDDING_DETAILS_API_SETUP.md`** - Complete setup documentation

## ⚡ Quick Setup (5 minutes)

### 1. Setup Google Sheet (2 min)

```
1. Open your Google Spreadsheet
2. Create new tab: "WeddingDetails"
3. Add 26 column headers in row 1 (see full guide for headers)
```

### 2. Deploy Apps Script (2 min)

```
1. Extensions → Apps Script
2. Create new file "WeddingDetailsAPI"
3. Copy code from: google-apps-script/wedding-details-single-row.js
4. Deploy → New deployment → Web app
5. Execute as: Me | Access: Anyone
6. Copy the Web App URL!
```

### 3. Configure Next.js (1 min)

```typescript
// In app/api/wedding-details/route.ts, line 4:
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE'
```

### 4. Test It! ✅

```bash
1. Go to: http://localhost:3000/dashboard
2. Click "Wedding Details" in sidebar
3. Edit any field
4. Click "Save Changes"
5. Check your Google Sheet - it updated!
```

## 📊 Data Structure

Your Google Sheet stores **one row** (row 2) with **26 columns**:

```
┌─────────────────┬──────────────┬─────────────────┬──────────────┐
│ Bride Full Name │ Bride Nickname│ Groom Full Name │ Groom Nickname│
├─────────────────┼──────────────┼─────────────────┼──────────────┤
│ Wedding Date    │ Wedding Venue│ Tagline         │ Theme        │
├─────────────────┼──────────────┼─────────────────┼──────────────┤
│ Hashtag         │ Ceremony Info│ Reception Info  │ Stories      │
├─────────────────┼──────────────┼─────────────────┼──────────────┤
│ Dress Code      │ RSVP Deadline│ Contact Info    │              │
└─────────────────┴──────────────┴─────────────────┴──────────────┘
```

## 🎨 Dashboard Features

The editor has **6 tabs** for organized editing:

1. **Couple** - Names and nicknames
2. **Wedding** - Date, venue, theme, hashtag
3. **Venues** - Ceremony & reception details with Google Maps links
4. **Stories** - Bride, groom, and shared narratives
5. **Details** - Dress code and RSVP deadline
6. **Contact** - Phone numbers and email

## 🔄 How It Works

```
Dashboard Editor ←→ Next.js API ←→ Google Apps Script ←→ Google Sheets
   (React)           (route.ts)      (doGet/doPost)        (WeddingDetails)
```

### When you click "Save":
1. Dashboard sends data to `/api/wedding-details` (PUT)
2. API forwards to Google Apps Script
3. Script updates row 2 in WeddingDetails sheet
4. Success message appears

### When you load the page:
1. Dashboard calls `/api/wedding-details` (GET)
2. API queries Google Apps Script
3. Script reads row 2 from sheet
4. Data populates the editor

## 🐛 Common Issues

### "Failed to fetch wedding details"
→ Check if GOOGLE_SCRIPT_URL is set in `route.ts`

### "WeddingDetails sheet not found"
→ Create a sheet tab named exactly "WeddingDetails"

### "Permission denied"
→ Run `testInitialize()` in Apps Script to grant permissions

### Changes not saving
→ Check Apps Script **Executions** log for errors

## 📚 Full Documentation

See **WEDDING_DETAILS_API_SETUP.md** for:
- Complete column list
- API endpoint details
- Troubleshooting guide
- Security notes
- Maintenance tips

## ✨ Benefits

✅ **Same pattern as GuestList** - familiar and consistent  
✅ **Google Sheets backup** - your data is safe  
✅ **Real-time sync** - changes reflect immediately  
✅ **Easy collaboration** - share the sheet with your team  
✅ **Organized interface** - tabbed editor for better UX  
✅ **No database needed** - Google Sheets is your database  

## 🎉 You're Ready!

Once set up, you can manage all wedding information from your dashboard. The data lives in Google Sheets for easy backup, sharing, and editing.

Need help? Check the full guide: **WEDDING_DETAILS_API_SETUP.md**

---

**Happy Editing! 💍**


