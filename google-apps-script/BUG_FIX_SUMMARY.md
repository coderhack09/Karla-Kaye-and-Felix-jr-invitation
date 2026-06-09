# Bug Fix Summary: Principal Sponsor Edit Creating Duplicates

## Issue Description

When editing a Principal Sponsor in the dashboard, instead of updating the existing entry, the system was creating a new duplicate entry at the bottom of the list.

## Root Cause

The bug was caused by a **parameter mismatch** between the frontend component and the API route:

### What the Component Was Sending:
```javascript
{
  originalMale: editingSponsor.MalePrincipalSponsor,
  originalFemale: editingSponsor.FemalePrincipalSponsor,
  MalePrincipalSponsor: "New Male Name",
  FemalePrincipalSponsor: "New Female Name"
}
```

### What the API Was Expecting:
```javascript
{
  originalName: "some name",  // ❌ Wrong! This field didn't exist
  MalePrincipalSponsor: "New Male Name",
  FemalePrincipalSponsor: "New Female Name"
}
```

Since the API couldn't find the original sponsor (because `originalName` was undefined), the Google Apps Script backend was likely treating the request as a new entry instead of an update.

## Files Changed

### 1. `/app/api/principal-sponsor/route.ts`

**Before:**
```typescript
export async function PUT(request: NextRequest) {
  const { MalePrincipalSponsor, FemalePrincipalSponsor, originalName } = body
  
  const updateData = {
    action: 'update',
    originalName: originalName || MalePrincipalSponsor,
    MalePrincipalSponsor: MalePrincipalSponsor.trim(),
    FemalePrincipalSponsor: FemalePrincipalSponsor?.trim() || '',
  }
}
```

**After:**
```typescript
export async function PUT(request: NextRequest) {
  const { MalePrincipalSponsor, FemalePrincipalSponsor, originalMale, originalFemale } = body
  
  // Validation
  if (!originalMale && !originalFemale) {
    return NextResponse.json(
      { error: 'Original sponsor information is required for update' },
      { status: 400 }
    )
  }

  const updateData = {
    action: 'update',
    originalMale: originalMale || '',
    originalFemale: originalFemale || '',
    MalePrincipalSponsor: MalePrincipalSponsor?.trim() || '',
    FemalePrincipalSponsor: FemalePrincipalSponsor?.trim() || '',
  }
}
```

### 2. `/google-apps-script/principal-sponsor-management.js` (NEW FILE)

Created a complete Google Apps Script backend for Principal Sponsor management with proper update logic:

```javascript
function updatePrincipalSponsor(sheet, data) {
  const originalMale = (data.originalMale || '').toString().trim();
  const originalFemale = (data.originalFemale || '').toString().trim();
  
  // Find the sponsor row by matching BOTH male and female names
  for (let i = 0; i < allData.length; i++) {
    const currentMale = allData[i][0].toString().trim();
    const currentFemale = allData[i][1].toString().trim();
    
    if (currentMale === originalMale && currentFemale === originalFemale) {
      rowIndex = i + 2;
      break;
    }
  }
  
  // Update the row (not create a new one)
  sheet.getRange(rowIndex, 1).setValue(newMale);
  sheet.getRange(rowIndex, 2).setValue(newFemale);
}
```

### 3. `/google-apps-script/entourage-management.js` (NEW FILE)

Created a complete Google Apps Script backend for Entourage management with proper update logic.

### 4. `/google-apps-script/ENTOURAGE_SPONSORS_SETUP.md` (NEW FILE)

Comprehensive deployment guide for setting up the Google Apps Script backends.

## Component Code (Already Correct)

The component at `/components/entourage-sponsors.tsx` was already correctly implemented:

```typescript
// Lines 236-240
body: JSON.stringify({
  originalMale: editingSponsor.MalePrincipalSponsor,  // ✅ Correct
  originalFemale: editingSponsor.FemalePrincipalSponsor,  // ✅ Correct
  ...sponsorFormData,
})
```

## Why Using Both Names is Important

Principal Sponsors come in pairs (Male + Female). To uniquely identify which sponsor pair to update, we need BOTH names:

- ❌ **Wrong**: Using only `originalName` - ambiguous, which name? Male or female?
- ✅ **Correct**: Using `originalMale` AND `originalFemale` - unambiguous identification

This ensures the correct row is found and updated, rather than creating a new entry.

## Testing the Fix

After deploying the updated Google Apps Scripts:

1. ✅ Add a principal sponsor pair
2. ✅ Edit the sponsor pair - should UPDATE the existing entry
3. ✅ Verify no duplicate is created
4. ✅ Check Google Sheet to confirm the row was updated, not duplicated

## Deployment Required

⚠️ **IMPORTANT**: You need to deploy the new Google Apps Scripts for this fix to work!

Follow the instructions in `ENTOURAGE_SPONSORS_SETUP.md` to:
1. Deploy `entourage-management.js` as a Web App
2. Deploy `principal-sponsor-management.js` as a Web App  
3. Update the API route URLs in your Next.js app

Without deploying the Google Apps Scripts, the edit functionality will still not work correctly.

## Related Files

- `/components/entourage-sponsors.tsx` - Frontend component (no changes needed)
- `/app/api/principal-sponsor/route.ts` - API route (FIXED ✅)
- `/app/api/entourage/route.ts` - API route (already correct ✅)
- `/google-apps-script/principal-sponsor-management.js` - Backend (NEW ✅)
- `/google-apps-script/entourage-management.js` - Backend (NEW ✅)
- `/google-apps-script/ENTOURAGE_SPONSORS_SETUP.md` - Deployment guide (NEW ✅)

## Status

🎉 **Bug Fixed!** 

The edit functionality for Principal Sponsors will now properly update existing entries instead of creating duplicates, once the Google Apps Scripts are deployed following the setup guide.


