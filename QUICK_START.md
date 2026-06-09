# 🚀 Quick Start - Improved Guest Dashboard

## ⚡ 5-Minute Setup

### 1. Google Apps Script Setup (3 minutes)

```javascript
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Copy content from: google-apps-script/guest-management.js
// 3. Save (Ctrl+S)
// 4. Run: initializeGuestSheet()
// 5. Deploy → New deployment → Web app
// 6. Copy Web App URL ✅
```

### 2. Next.js Integration (2 minutes)

```typescript
// Open: app/dashboard-improved/page.tsx

// Line 23: Replace with your URL
const API_URL = 'https://script.google.com/macros/s/YOUR_ID/exec'

// Line 27: Change password
const DASHBOARD_PASSWORD = "your-password"

// Save and visit: http://localhost:3000/dashboard-improved
```

---

## 📋 What You Get

### ✨ Features
- 👥 Track companions (spouse, kids, +1s)
- ⭐ Mark VIP guests
- 📊 Real-time statistics (6 cards)
- 🔍 Advanced filtering & search
- 📤 Export to CSV
- 🪑 Table assignments
- 🏷️ Track who added each guest
- 📱 Mobile responsive

### 📦 Files Created
1. **`components/improved-guest-list.tsx`** - Main component
2. **`google-apps-script/guest-management.js`** - Backend API
3. **`app/dashboard-improved/page.tsx`** - Example dashboard
4. **`google-apps-script/migration-helper.js`** - Migration tools
5. **Documentation** - Complete guides

---

## 🎯 Quick Actions

### Add a Guest
```typescript
{
  name: "John Smith",
  role: "Friend",
  email: "john@example.com",
  allowedGuests: 3,
  companions: [
    { name: "Jane Smith", relationship: "Spouse" },
    { name: "Baby Smith", relationship: "Child" }
  ],
  tableNumber: "T1",
  isVip: true,
  status: "confirmed",
  addedBy: "Groom"
}
```

### Update Status
```typescript
// Change status: pending → confirmed
handleUpdateGuest({ ...guest, status: 'confirmed' })
```

### Filter Guests
```typescript
// Show only VIP guests who confirmed
Filter: Status = Confirmed, VIP = VIP Only
```

---

## 📊 Data Structure

```
Guest {
  id: UUID (auto)
  name: "John Smith"
  role: "Friend"
  email: "john@example.com"
  contact: "+1234567890"
  allowedGuests: 3
  companions: [
    { name: "Jane", relationship: "Spouse" }
  ]
  tableNumber: "T1"
  isVip: true
  status: "confirmed" // pending, confirmed, declined, request
  addedBy: "Groom"
  createdAt: "2025-12-19T..."
  updatedAt: "2025-12-19T..."
}
```

---

## 🔄 Migration from Old System

```javascript
// In Apps Script:

1. prepareForMigration()     // Backup & prepare
2. previewMigration()         // See what will migrate
3. migrateGuestsToNewSystem() // Do the migration
4. verifyMigration()          // Check results
```

---

## 🎨 Quick Customization

### Change Colors
```typescript
// In improved-guest-list.tsx, replace:
#8C6B4F → Your primary color
#6E4C3A → Your secondary color
#BFA27C → Your accent color
```

### Add Custom Field
```typescript
// 1. Update interface
interface Guest {
  // ... existing ...
  dietaryRestrictions?: string
}

// 2. Add form input
// 3. Add table column
// 4. Update Google Sheet
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Guests sheet not found" | Run `initializeGuestSheet()` |
| API not working | Check Web App URL, redeploy if needed |
| Companions not showing | Check JSON format in sheet |
| Can't save changes | Check Apps Script execution logs |

---

## 📱 Test Checklist

- [ ] Login with password
- [ ] View existing guests
- [ ] Add new guest
- [ ] Add guest with companions
- [ ] Mark guest as VIP
- [ ] Update guest status
- [ ] Assign table number
- [ ] Filter by status
- [ ] Search for guest
- [ ] Export to CSV
- [ ] Delete guest
- [ ] Test on mobile

---

## 🔐 Security

```typescript
// Change dashboard password
const DASHBOARD_PASSWORD = "your-secure-password"

// Use environment variables (recommended)
// .env.local
GUEST_MANAGEMENT_API_URL=https://script.google.com/.../exec
NEXT_PUBLIC_DASHBOARD_PASSWORD=your-password
```

---

## 📚 Full Documentation

- **Complete Setup**: `GUEST_MANAGEMENT_SETUP.md`
- **Feature Guide**: `IMPROVED_GUEST_DASHBOARD_README.md`
- **Full Details**: `IMPLEMENTATION_SUMMARY.md`
- **This Guide**: `QUICK_START.md`

---

## 💡 Pro Tips

1. **Use descriptive "Added By" values**
   ```
   "Bride's Family", "Groom's Friends", "Colleagues"
   ```

2. **Table naming convention**
   ```
   Regular: T1, T2, T3
   VIP: VIP-A, VIP-B
   Family: FAM-1, FAM-2
   ```

3. **Export backups regularly**
   ```
   Click "Export" button → Save CSV
   ```

4. **Companion relationships**
   ```
   Spouse, Partner, Child, Parent, Sibling, Friend
   ```

---

## 🎊 You're Ready!

Visit `http://localhost:3000/dashboard-improved` and start managing your guests!

**Need Help?**
- Check `IMPLEMENTATION_SUMMARY.md` for detailed info
- Review code comments (everything is documented)
- Check Apps Script execution logs for errors

---

**Happy Planning!** 💒 ✨

*Created: December 19, 2025*


