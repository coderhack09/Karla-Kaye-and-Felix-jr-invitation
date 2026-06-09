/**
 * Migration Helper for Moving from Old Guest System to New Guest Management System
 * 
 * This script helps migrate data from the old guest format (Name, Email, RSVP, Guest, Message)
 * to the new advanced format with companions, VIP status, etc.
 * 
 * Run this script AFTER deploying the new guest-management.js script
 */

/**
 * Main migration function
 * Migrates all guests from old format to new format
 */
function migrateGuestsToNewSystem() {
  try {
    Logger.log('=== Starting Guest Migration ===');
    
    // Get the old and new sheets
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const oldSheet = ss.getSheetByName('OldGuests'); // Change this to your old sheet name
    const newSheet = ss.getSheetByName('Guests');
    
    // Validation
    if (!oldSheet) {
      throw new Error('Old guests sheet not found. Please rename your existing guest sheet to "OldGuests"');
    }
    
    if (!newSheet) {
      Logger.log('New Guests sheet not found. Initializing...');
      initializeGuestSheet();
    }
    
    // Get old data
    const lastRow = oldSheet.getLastRow();
    if (lastRow < 2) {
      Logger.log('No data to migrate.');
      return { status: 'ok', message: 'No guests to migrate', migrated: 0 };
    }
    
    // Assuming old format: A=Name, B=Email, C=RSVP, D=Guest, E=Message
    const oldData = oldSheet.getRange(2, 1, lastRow - 1, 5).getValues();
    
    Logger.log(`Found ${oldData.length} guests to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Migrate each guest
    oldData.forEach((row, index) => {
      const [name, email, rsvp, guestCount, message] = row;
      
      // Skip empty rows
      if (!name || name.toString().trim() === '') {
        Logger.log(`Skipping empty row ${index + 2}`);
        return;
      }
      
      try {
        // Convert RSVP to new status format
        let status = 'pending';
        if (rsvp === 'Yes' || rsvp === 'yes' || rsvp === 'YES') {
          status = 'confirmed';
        } else if (rsvp === 'No' || rsvp === 'no' || rsvp === 'NO') {
          status = 'declined';
        }
        
        // Parse guest count
        const allowedGuests = parseInt(guestCount) || 1;
        
        // Create companion placeholders (will need to be filled in manually)
        const companions = [];
        for (let i = 1; i < allowedGuests; i++) {
          companions.push({
            name: '', // To be filled in manually
            relationship: 'Companion'
          });
        }
        
        // Create new guest data
        const guestData = {
          name: name.toString().trim(),
          role: 'Guest', // Default role - needs manual update
          email: email ? email.toString().trim() : '',
          contact: '', // Not available in old format
          message: message ? message.toString().trim() : '',
          allowedGuests: allowedGuests,
          companions: companions,
          tableNumber: '', // Not available in old format
          isVip: false, // Default to false - needs manual update
          status: status,
          addedBy: 'Migration'
        };
        
        // Create the guest in the new system
        createGuest(newSheet, guestData);
        
        successCount++;
        Logger.log(`✓ Migrated: ${name}`);
        
      } catch (error) {
        errorCount++;
        errors.push({
          row: index + 2,
          name: name,
          error: error.toString()
        });
        Logger.log(`✗ Error migrating ${name}: ${error.toString()}`);
      }
    });
    
    Logger.log('=== Migration Complete ===');
    Logger.log(`Success: ${successCount}`);
    Logger.log(`Errors: ${errorCount}`);
    
    if (errors.length > 0) {
      Logger.log('Errors:');
      errors.forEach(err => {
        Logger.log(`  Row ${err.row}: ${err.name} - ${err.error}`);
      });
    }
    
    return {
      status: 'ok',
      message: 'Migration completed',
      migrated: successCount,
      errors: errorCount,
      errorDetails: errors
    };
    
  } catch (error) {
    Logger.log('Migration failed: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * Preview migration without actually migrating
 * Shows what will be migrated
 */
function previewMigration() {
  try {
    Logger.log('=== Migration Preview ===');
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const oldSheet = ss.getSheetByName('OldGuests'); // Change this to your old sheet name
    
    if (!oldSheet) {
      throw new Error('Old guests sheet not found. Please rename your existing guest sheet to "OldGuests"');
    }
    
    const lastRow = oldSheet.getLastRow();
    if (lastRow < 2) {
      Logger.log('No data to preview.');
      return;
    }
    
    const oldData = oldSheet.getRange(2, 1, lastRow - 1, 5).getValues();
    
    Logger.log(`Will migrate ${oldData.length} guests:\n`);
    
    oldData.forEach((row, index) => {
      const [name, email, rsvp, guestCount, message] = row;
      
      if (!name || name.toString().trim() === '') {
        return;
      }
      
      const status = rsvp === 'Yes' ? 'confirmed' : rsvp === 'No' ? 'declined' : 'pending';
      const allowedGuests = parseInt(guestCount) || 1;
      
      Logger.log(`${index + 1}. ${name}`);
      Logger.log(`   Email: ${email || 'none'}`);
      Logger.log(`   Status: ${status}`);
      Logger.log(`   Allowed Guests: ${allowedGuests}`);
      Logger.log(`   Companions: ${allowedGuests - 1} (will be empty - need manual entry)`);
      Logger.log('');
    });
    
    Logger.log('=== End Preview ===');
    Logger.log('\nNOTE: After migration, you will need to:');
    Logger.log('1. Fill in companion names and relationships');
    Logger.log('2. Update guest roles from default "Guest"');
    Logger.log('3. Mark VIP guests');
    Logger.log('4. Assign table numbers');
    Logger.log('5. Add phone numbers if available');
    
  } catch (error) {
    Logger.log('Preview failed: ' + error.toString());
  }
}

/**
 * Create a backup of the old sheet before migration
 */
function backupOldSheet() {
  try {
    Logger.log('Creating backup...');
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const oldSheet = ss.getSheetByName('OldGuests');
    
    if (!oldSheet) {
      throw new Error('Old guests sheet not found.');
    }
    
    const backupName = 'OldGuests_Backup_' + new Date().toISOString().split('T')[0];
    const backup = oldSheet.copyTo(ss);
    backup.setName(backupName);
    
    Logger.log(`Backup created: ${backupName}`);
    
    return {
      status: 'ok',
      message: 'Backup created successfully',
      backupSheetName: backupName
    };
    
  } catch (error) {
    Logger.log('Backup failed: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * Rename your current guest sheet to prepare for migration
 */
function prepareForMigration() {
  try {
    Logger.log('Preparing for migration...');
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Find existing guest sheet (adjust name as needed)
    const possibleNames = ['Guests', 'GuestList', 'RSVP', 'Wedding Guests'];
    let oldSheet = null;
    
    for (const name of possibleNames) {
      oldSheet = ss.getSheetByName(name);
      if (oldSheet) {
        Logger.log(`Found existing sheet: ${name}`);
        break;
      }
    }
    
    if (!oldSheet) {
      Logger.log('No existing guest sheet found. Please manually rename your sheet to "OldGuests"');
      return {
        status: 'error',
        message: 'No existing guest sheet found'
      };
    }
    
    // Rename to OldGuests
    oldSheet.setName('OldGuests');
    Logger.log('Renamed to: OldGuests');
    
    // Create backup
    backupOldSheet();
    
    Logger.log('Preparation complete!');
    Logger.log('Next steps:');
    Logger.log('1. Run previewMigration() to see what will be migrated');
    Logger.log('2. Run migrateGuestsToNewSystem() to perform the migration');
    
    return {
      status: 'ok',
      message: 'Preparation complete. Ready for migration.'
    };
    
  } catch (error) {
    Logger.log('Preparation failed: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * Post-migration cleanup and verification
 */
function verifyMigration() {
  try {
    Logger.log('=== Verifying Migration ===');
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const oldSheet = ss.getSheetByName('OldGuests');
    const newSheet = ss.getSheetByName('Guests');
    
    if (!oldSheet || !newSheet) {
      throw new Error('Could not find required sheets');
    }
    
    const oldCount = oldSheet.getLastRow() - 1; // Minus header
    const newCount = newSheet.getLastRow() - 1; // Minus header
    
    Logger.log(`Old sheet: ${oldCount} guests`);
    Logger.log(`New sheet: ${newCount} guests`);
    
    if (oldCount === newCount) {
      Logger.log('✓ All guests migrated successfully!');
    } else if (newCount > oldCount) {
      Logger.log(`⚠ Warning: New sheet has more guests (${newCount - oldCount} extra)`);
    } else {
      Logger.log(`✗ Error: Not all guests migrated (${oldCount - newCount} missing)`);
    }
    
    // Check for empty companion names
    const newData = newSheet.getRange(2, 1, newCount, 8).getValues();
    let emptyCompanionCount = 0;
    
    newData.forEach(row => {
      const companionsJson = row[7]; // Companions column
      if (companionsJson) {
        try {
          const companions = JSON.parse(companionsJson);
          companions.forEach(comp => {
            if (!comp.name || comp.name.trim() === '') {
              emptyCompanionCount++;
            }
          });
        } catch (e) {
          // Ignore parse errors
        }
      }
    });
    
    if (emptyCompanionCount > 0) {
      Logger.log(`\n⚠ ${emptyCompanionCount} companion slots need names filled in`);
    }
    
    Logger.log('\n=== Post-Migration TODO ===');
    Logger.log('1. Review all migrated guests');
    Logger.log('2. Fill in companion names and relationships');
    Logger.log('3. Update guest roles from default "Guest"');
    Logger.log('4. Mark VIP guests');
    Logger.log('5. Assign table numbers');
    Logger.log('6. Add contact phone numbers');
    Logger.log('7. Test the new dashboard');
    
    return {
      status: 'ok',
      oldCount: oldCount,
      newCount: newCount,
      emptyCompanions: emptyCompanionCount
    };
    
  } catch (error) {
    Logger.log('Verification failed: ' + error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * Complete migration workflow
 * Run this to do everything in order
 */
function runCompleteMigration() {
  Logger.log('========================================');
  Logger.log('COMPLETE MIGRATION WORKFLOW');
  Logger.log('========================================\n');
  
  // Step 1: Prepare
  Logger.log('Step 1: Preparing...');
  const prepResult = prepareForMigration();
  if (prepResult.status === 'error') {
    Logger.log('Migration aborted. Please fix errors and try again.');
    return;
  }
  Logger.log('');
  
  // Step 2: Preview
  Logger.log('Step 2: Preview...');
  previewMigration();
  Logger.log('');
  
  // Step 3: Confirm
  Logger.log('Step 3: Waiting for confirmation...');
  Logger.log('⚠ IMPORTANT: Review the preview above carefully!');
  Logger.log('If everything looks good, run: migrateGuestsToNewSystem()');
  Logger.log('');
  Logger.log('Migration workflow paused. Continue manually after review.');
}

/**
 * Fix common migration issues
 */
function fixMigrationIssues() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const newSheet = ss.getSheetByName('Guests');
  
  if (!newSheet) {
    Logger.log('Guests sheet not found');
    return;
  }
  
  const lastRow = newSheet.getLastRow();
  if (lastRow < 2) {
    Logger.log('No guests to fix');
    return;
  }
  
  Logger.log('Fixing common issues...');
  
  let fixedCount = 0;
  
  // Get all data
  const data = newSheet.getRange(2, 1, lastRow - 1, 14).getValues();
  
  data.forEach((row, index) => {
    const rowIndex = index + 2;
    let needsUpdate = false;
    
    // Fix: Empty role
    if (!row[2] || row[2].toString().trim() === '') {
      newSheet.getRange(rowIndex, 3).setValue('Guest');
      needsUpdate = true;
    }
    
    // Fix: Invalid status
    const validStatuses = ['pending', 'confirmed', 'declined', 'request'];
    if (!validStatuses.includes(row[10])) {
      newSheet.getRange(rowIndex, 11).setValue('pending');
      needsUpdate = true;
    }
    
    // Fix: Invalid allowedGuests
    if (!row[6] || parseInt(row[6]) < 1) {
      newSheet.getRange(rowIndex, 7).setValue(1);
      needsUpdate = true;
    }
    
    // Fix: Invalid JSON in companions
    try {
      if (row[7]) {
        JSON.parse(row[7]);
      }
    } catch (e) {
      newSheet.getRange(rowIndex, 8).setValue('[]');
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      fixedCount++;
    }
  });
  
  Logger.log(`Fixed ${fixedCount} issues`);
}

// ============================================================
// INSTRUCTIONS FOR USE:
// ============================================================
//
// 1. First, run: prepareForMigration()
//    This will rename your current guest sheet and create a backup
//
// 2. Then, run: previewMigration()
//    This shows you what will be migrated (doesn't change anything)
//
// 3. Review the preview carefully!
//
// 4. If everything looks good, run: migrateGuestsToNewSystem()
//    This performs the actual migration
//
// 5. Finally, run: verifyMigration()
//    This checks that everything migrated correctly
//
// 6. If there are issues, run: fixMigrationIssues()
//
// OR run everything at once with: runCompleteMigration()
// (This will pause after preview for manual confirmation)
//
// ============================================================


