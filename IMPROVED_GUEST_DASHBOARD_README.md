# Improved Guest Dashboard - Quick Start Guide

This document provides a quick overview of the improved guest management system and how to integrate it into your wedding website.

## 🎯 What's New?

### Enhanced Features

1. **👥 Companion Tracking**
   - Track additional guests (spouse, children, +1s, etc.)
   - Store names and relationships for each companion
   - Automatically sync companion slots with allowed guest count

2. **⭐ VIP Status**
   - Mark important guests as VIP
   - Visual indicators with star icons
   - Filter guests by VIP status

3. **📊 Advanced Filtering**
   - Filter by RSVP status (confirmed, pending, declined)
   - Filter by VIP status
   - Search across names, roles, and companion names

4. **🏷️ Guest Tracking**
   - "Added By" field to track who invited each guest
   - Timestamps for when guests were added/updated
   - Detailed contact information

5. **📈 Statistics Dashboard**
   - Real-time statistics cards
   - Total invitations, confirmed, pending, declined
   - VIP count and total pax count

6. **📤 Export Functionality**
   - Export filtered guest list to CSV
   - Includes all guest information and companions

7. **🎨 Improved UI/UX**
   - Mobile-responsive design
   - Better visual hierarchy
   - Smooth animations and transitions
   - Color-coded status badges

## 📦 Files Included

1. **`components/improved-guest-list.tsx`**
   - Main React component for the guest list
   - Includes all UI and business logic

2. **`google-apps-script/guest-management.js`**
   - Google Apps Script for backend data management
   - Handles CRUD operations and data storage

3. **`google-apps-script/GUEST_MANAGEMENT_SETUP.md`**
   - Comprehensive setup guide
   - Step-by-step deployment instructions
   - API documentation

## 🚀 Quick Integration

### Step 1: Set Up Google Apps Script

1. Follow the instructions in `google-apps-script/GUEST_MANAGEMENT_SETUP.md`
2. Deploy the script and get your Web App URL
3. Initialize the Google Sheet with `initializeGuestSheet()`

### Step 2: Create API Route (Optional)

If you want to use a Next.js API route as a proxy:

```typescript
// app/api/guests-advanced/route.ts
import { type NextRequest, NextResponse } from "next/server"

const GOOGLE_SCRIPT_URL = process.env.GUEST_MANAGEMENT_API_URL || ''

// ... (see GUEST_MANAGEMENT_SETUP.md for full code)
```

### Step 3: Use the Component in Your Dashboard

```typescript
// app/dashboard/page.tsx
import { ImprovedGuestList, Guest } from '@/components/improved-guest-list'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [guests, setGuests] = useState<Guest[]>([])

  // Fetch guests
  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/guests-advanced')
      const data = await response.json()
      setGuests(data)
    } catch (error) {
      console.error('Error fetching guests:', error)
    }
  }

  const handleAddGuest = async (guestData: Omit<Guest, 'id'>) => {
    try {
      await fetch('/api/guests-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData),
      })
      fetchGuests() // Refresh the list
    } catch (error) {
      console.error('Error adding guest:', error)
    }
  }

  const handleUpdateGuest = async (guest: Guest) => {
    try {
      await fetch('/api/guests-advanced', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guest),
      })
      fetchGuests() // Refresh the list
    } catch (error) {
      console.error('Error updating guest:', error)
    }
  }

  const handleDeleteGuest = async (id: string) => {
    try {
      await fetch('/api/guests-advanced', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchGuests() // Refresh the list
    } catch (error) {
      console.error('Error deleting guest:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#6E4C3A]">
          Guest Management
        </h1>
        
        <ImprovedGuestList
          guests={guests}
          onAddGuest={handleAddGuest}
          onUpdateGuest={handleUpdateGuest}
          onDeleteGuest={handleDeleteGuest}
        />
      </div>
    </div>
  )
}
```

## 📋 Data Structure

### Guest Object

```typescript
interface Guest {
  id: string                    // Auto-generated UUID
  name: string                  // Primary guest name
  role: string                  // Relationship (Friend, Family, etc.)
  email?: string                // Email address
  contact?: string              // Phone number
  message?: string              // Personal message
  allowedGuests: number         // Total pax (including primary)
  companions: Companion[]       // Additional guests
  tableNumber: string           // Assigned table
  isVip: boolean                // VIP status
  status: GuestStatus           // RSVP status
  addedBy?: string              // Who added this guest
  createdAt?: string            // Created timestamp
  updatedAt?: string            // Last update timestamp
}

interface Companion {
  name: string                  // Companion name
  relationship: string          // Relationship to primary guest
}

type GuestStatus = 'pending' | 'confirmed' | 'declined' | 'request'
```

## 🎨 Customization

### Colors

The component uses these main colors (easily customizable):

```css
Primary: #8C6B4F (warm brown)
Secondary: #6E4C3A (darker brown)
Accent: #BFA27C (light brown/gold)
Background: #F3E5CF (cream)
Border: #E5DACE (light beige)
```

To customize, search and replace these values in `improved-guest-list.tsx`.

### Table Columns

To add/remove columns, modify the `<thead>` and `<tbody>` sections:

```typescript
<thead className="bg-[#F3E5CF] text-[#6E4C3A]">
  <tr>
    <th>Your New Column</th>
    {/* ... other columns */}
  </tr>
</thead>
```

### Statistics Cards

Modify the stats calculation in the component:

```typescript
const stats = {
  total: filteredGuests.length,
  confirmed: filteredGuests.filter(g => g.status === 'confirmed').length,
  // Add your custom stats here
}
```

## 🔧 Advanced Features

### Bulk Import

Import multiple guests at once:

```typescript
const importGuests = async (guestsArray: any[]) => {
  await fetch('/api/guests-advanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'bulk_import',
      guests: guestsArray
    }),
  })
}
```

### Export to CSV

The component includes a built-in export function:

```typescript
// Click the "Export" button in the UI
// Or programmatically:
handleExportCSV() // Already implemented in the component
```

### Get Statistics

Fetch guest statistics from the Google Apps Script:

```javascript
// Call getGuestStatistics() in your Apps Script
// Returns: { total, confirmed, pending, declined, vip, totalPax, byAddedBy }
```

## 📱 Mobile Responsive

The component is fully responsive and works on:

- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## ✅ Best Practices

1. **Always Validate Input**
   - Name and role are required fields
   - Companion names required if allowedGuests > 1

2. **Handle Errors Gracefully**
   - Show user-friendly error messages
   - Log errors for debugging

3. **Optimize Performance**
   - Use pagination for large guest lists (>100 guests)
   - Implement debouncing for search input

4. **Security**
   - Validate data on both client and server
   - Use environment variables for API URLs
   - Implement authentication for dashboard access

5. **UX Considerations**
   - Show loading states during API calls
   - Confirm before deleting guests
   - Auto-refresh after data changes

## 🐛 Common Issues & Solutions

### Issue: Companions not syncing

**Solution**: The component automatically syncs companions with allowedGuests count. If issues persist, check that the `useEffect` hook is running properly.

### Issue: Guest not updating in Google Sheets

**Solution**: 
1. Check the Apps Script execution logs
2. Verify the guest ID is being passed correctly
3. Ensure the sheet hasn't been renamed

### Issue: VIP filter not working

**Solution**: Check that `isVip` is stored as a boolean in the sheet, not a string.

### Issue: Export CSV not downloading

**Solution**: Check browser permissions for downloads. Some browsers block automatic downloads.

## 📞 Support

For issues or questions:

1. Check the setup guide: `GUEST_MANAGEMENT_SETUP.md`
2. Review Google Apps Script logs: View > Executions
3. Check browser console for errors (F12)
4. Verify API endpoint connectivity

## 🎓 Example Use Cases

### Use Case 1: VIP Table Management

```typescript
// Get all VIP guests
const vipGuests = guests.filter(g => g.isVip && g.status === 'confirmed')

// Assign to VIP tables
vipGuests.forEach((guest, index) => {
  handleUpdateGuest({
    ...guest,
    tableNumber: `VIP-${index + 1}`
  })
})
```

### Use Case 2: Family Group Management

```typescript
// Find family members added by "Bride's Family"
const brideFamily = guests.filter(g => g.addedBy === "Bride's Family")

// Calculate total pax for this group
const totalBrideFamilyPax = brideFamily.reduce(
  (sum, g) => sum + g.allowedGuests, 
  0
)
```

### Use Case 3: RSVP Reminder List

```typescript
// Get pending guests who haven't responded
const pendingGuests = guests.filter(g => g.status === 'pending')

// Export email list for reminder
const emailList = pendingGuests
  .filter(g => g.email)
  .map(g => g.email)
  .join(', ')
```

## 🎉 Tips for Success

1. **Start Simple**: Begin with basic guest information, add complexity later
2. **Test Thoroughly**: Add sample guests to test all features
3. **Backup Regularly**: Export CSV backups of your guest list
4. **Plan Table Assignments Early**: Use the table number field from the start
5. **Track Everything**: Use the "Added By" field to know who invited whom
6. **Communicate**: Share VIP status with your vendors/coordinators

---

## 📝 Quick Checklist

- [ ] Set up Google Apps Script
- [ ] Deploy as Web App
- [ ] Initialize Guest sheet
- [ ] Add sample guests for testing
- [ ] Create Next.js API route (optional)
- [ ] Integrate ImprovedGuestList component
- [ ] Test CRUD operations
- [ ] Test filtering and search
- [ ] Test export functionality
- [ ] Customize colors/styling
- [ ] Add error handling
- [ ] Test on mobile devices
- [ ] Set up regular backups

---

**Version**: 1.0.0  
**Last Updated**: December 19, 2025  
**Compatibility**: Next.js 14+, React 18+, Google Apps Script

Happy wedding planning! 💒✨


