# 🚀 Quick Deployment Checklist

## Bug Fix: Principal Sponsor Edit Creating Duplicates

### What Was Fixed?
- ✅ Updated API route to accept correct parameters
- ✅ Created proper Google Apps Script backends
- ✅ Component was already correct

### What You Need to Do:

## Option 1: Quick Fix (If scripts already deployed)
If you already have the scripts deployed, just need to update them:

1. **Update Entourage Script**
   - Open your Entourage Google Apps Script
   - Replace all code with content from: `google-apps-script/entourage-management.js`
   - Save and redeploy (Deploy > Manage deployments > Edit > New version > Deploy)

2. **Update Principal Sponsor Script**
   - Open your Principal Sponsor Google Apps Script
   - Replace all code with content from: `google-apps-script/principal-sponsor-management.js`
   - Save and redeploy

3. **Restart your dev server**
   ```bash
   # Stop the server (Ctrl+C)
   pnpm dev
   ```

4. **Test it works!**

---

## Option 2: First Time Setup (New deployment)

### Step 1: Deploy Entourage Management
```
1. Open Google Spreadsheet
2. Extensions > Apps Script
3. Paste code from: entourage-management.js
4. Save as "Entourage Management"
5. Run: initializeEntourageSheet()
6. Deploy > New deployment > Web app
7. Copy the Web App URL
```

### Step 2: Update Next.js - Entourage
Edit: `app/api/entourage/route.ts`
```typescript
const ENTOURAGE_SCRIPT_URL = 'PASTE_YOUR_URL_HERE'
```

### Step 3: Deploy Principal Sponsor Management
```
1. Go to https://script.google.com
2. New project
3. Paste code from: principal-sponsor-management.js
4. Save as "Principal Sponsor Management"
5. Add Script Property:
   - SPREADSHEET_ID = your_spreadsheet_id
6. Update code to use openById() instead of getActiveSpreadsheet()
7. Run: initializePrincipalSponsorSheet()
8. Deploy > New deployment > Web app
9. Copy the Web App URL
```

### Step 4: Update Next.js - Principal Sponsors
Edit: `app/api/principal-sponsor/route.ts`
```typescript
const PRINCIPAL_SPONSOR_SCRIPT_URL = 'PASTE_YOUR_URL_HERE'
```

### Step 5: Test Everything
```bash
pnpm dev
```

Navigate to dashboard → Entourage & Principal Sponsors → Test editing!

---

## Quick Test Checklist

### Test Entourage
- [ ] Add new entourage member ✓
- [ ] Edit existing member (should UPDATE, not duplicate) ✓
- [ ] Delete member ✓
- [ ] Check Google Sheet - verify correct behavior ✓

### Test Principal Sponsors
- [ ] Add new sponsor pair ✓
- [ ] Edit existing pair (should UPDATE, not duplicate) ✓
- [ ] Delete sponsor pair ✓
- [ ] Check Google Sheet - verify correct behavior ✓

---

## Troubleshooting

### "Sheet not found"
→ Run the initialize functions in the Apps Script editor

### Still creating duplicates
→ Check if you deployed the correct script version
→ Verify the Web App URLs in your API routes
→ Check Apps Script execution logs

### Permission errors
→ Re-grant permissions when prompted
→ Check deployment settings (Execute as: Me, Who has access: Anyone)

---

## Files Changed in This Fix

- ✅ `app/api/principal-sponsor/route.ts` - Parameter fix
- ✅ `google-apps-script/principal-sponsor-management.js` - New backend
- ✅ `google-apps-script/entourage-management.js` - New backend
- ✅ `google-apps-script/ENTOURAGE_SPONSORS_SETUP.md` - Full setup guide
- ✅ `google-apps-script/BUG_FIX_SUMMARY.md` - Technical details

---

## Need More Help?

See the full setup guide: `google-apps-script/ENTOURAGE_SPONSORS_SETUP.md`

See technical details: `google-apps-script/BUG_FIX_SUMMARY.md`


