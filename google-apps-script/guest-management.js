/**
 * Google Apps Script for Advanced Guest Management
 * Deploy this as a Web App to create API endpoints for managing wedding guests
 * 
 * Sheet Structure: Each guest is a row with the following columns:
 * A: ID (auto-generated)
 * B: Name (primary guest name)
 * C: Role (relationship to couple)
 * D: Email
 * E: Contact (phone number)
 * F: Message
 * G: AllowedGuests (number including primary guest)
 * H: Companions (JSON string of companions array)
 * I: TableNumber
 * J: IsVip (TRUE/FALSE)
 * K: Status (pending/confirmed/declined/request)
 * L: AddedBy (who added this guest)
 * M: CreatedAt (timestamp)
 * N: UpdatedAt (timestamp)
 */

/**
 * Handle POST requests (Create, Update, Delete)
 */
function doPost(e) {
  // Guard against running without event data
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid request. This function must be called via web app deployment.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Guests sheet not found. Please run initializeGuestSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Parse the request body
  const body = JSON.parse(e.postData.contents);
  const action = body.action || 'create'; // Default to create if no action specified

  try {
    let result;
    
    switch (action) {
      case 'create':
        result = createGuest(sheet, body);
        break;
      case 'update':
        result = updateGuest(sheet, body);
        break;
      case 'delete':
        result = deleteGuest(sheet, body);
        break;
      case 'bulk_import':
        result = bulkImportGuests(sheet, body);
        break;
      default:
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'Invalid action. Use "create", "update", "delete", or "bulk_import".' })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (Read)
 */
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Guests sheet not found. Please run initializeGuestSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Check if data exists
    if (sheet.getLastRow() < 2) {
      return ContentService.createTextOutput(
        JSON.stringify([])
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data (skip header row)
    const lastRow = sheet.getLastRow();
    const lastCol = 14; // N columns
    const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    const values = dataRange.getValues();
    
    // Convert to array of guest objects
    const guests = values
      .filter(row => row[0]) // Filter out empty rows (no ID)
      .map(row => {
        // Parse companions JSON
        let companions = [];
        try {
          companions = row[7] ? JSON.parse(row[7]) : [];
        } catch (e) {
          companions = [];
        }
        
        return {
          id: row[0],
          name: row[1],
          role: row[2],
          email: row[3] || '',
          contact: row[4] || '',
          message: row[5] || '',
          allowedGuests: parseInt(row[6]) || 1,
          companions: companions,
          tableNumber: row[8] || '',
          isVip: row[9] === true || row[9] === 'TRUE',
          status: row[10] || 'pending',
          addedBy: row[11] || '',
          createdAt: row[12] || '',
          updatedAt: row[13] || ''
        };
      });

    return ContentService.createTextOutput(
      JSON.stringify(guests)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Create a new guest
 */
function createGuest(sheet, data) {
  // Validate required fields
  if (!data.name || !data.role) {
    throw new Error('Name and role are required fields');
  }

  // Generate unique ID
  const id = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  // Parse companions
  const companions = data.companions || [];
  const companionsJson = JSON.stringify(companions);
  
  // Prepare row data
  const rowData = [
    id,                                     // A: ID
    data.name.trim(),                       // B: Name
    data.role.trim(),                       // C: Role
    (data.email || '').trim(),              // D: Email
    (data.contact || '').trim(),            // E: Contact
    (data.message || '').trim(),            // F: Message
    parseInt(data.allowedGuests) || 1,      // G: AllowedGuests
    companionsJson,                         // H: Companions (JSON)
    (data.tableNumber || '').trim(),        // I: TableNumber
    data.isVip === true,                    // J: IsVip
    data.status || 'pending',               // K: Status
    (data.addedBy || '').trim(),            // L: AddedBy
    timestamp,                              // M: CreatedAt
    timestamp                               // N: UpdatedAt
  ];
  
  // Append to sheet
  sheet.appendRow(rowData);
  
  return {
    status: 'ok',
    message: 'Guest created successfully',
    guest: {
      id: id,
      name: data.name,
      role: data.role,
      email: data.email || '',
      contact: data.contact || '',
      message: data.message || '',
      allowedGuests: parseInt(data.allowedGuests) || 1,
      companions: companions,
      tableNumber: data.tableNumber || '',
      isVip: data.isVip === true,
      status: data.status || 'pending',
      addedBy: data.addedBy || '',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };
}

/**
 * Update an existing guest
 */
function updateGuest(sheet, data) {
  // Validate required fields
  if (!data.id) {
    throw new Error('Guest ID is required for update');
  }

  // Find the guest row
  const lastRow = sheet.getLastRow();
  const idColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  
  let rowIndex = -1;
  for (let i = 0; i < idColumn.length; i++) {
    // Convert both to strings for comparison to handle numeric IDs
    if (String(idColumn[i][0]) === String(data.id)) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Guest not found with ID: ' + data.id);
  }
  
  const timestamp = new Date().toISOString();
  
  // Update fields (only update provided fields)
  if (data.name !== undefined) {
    sheet.getRange(rowIndex, 2).setValue(data.name.trim());
  }
  if (data.role !== undefined) {
    sheet.getRange(rowIndex, 3).setValue(data.role.trim());
  }
  if (data.email !== undefined) {
    sheet.getRange(rowIndex, 4).setValue(data.email.trim());
  }
  if (data.contact !== undefined) {
    sheet.getRange(rowIndex, 5).setValue(data.contact.trim());
  }
  if (data.message !== undefined) {
    sheet.getRange(rowIndex, 6).setValue(data.message.trim());
  }
  if (data.allowedGuests !== undefined) {
    sheet.getRange(rowIndex, 7).setValue(parseInt(data.allowedGuests) || 1);
  }
  if (data.companions !== undefined) {
    const companionsJson = JSON.stringify(data.companions);
    sheet.getRange(rowIndex, 8).setValue(companionsJson);
  }
  if (data.tableNumber !== undefined) {
    sheet.getRange(rowIndex, 9).setValue(data.tableNumber.trim());
  }
  if (data.isVip !== undefined) {
    sheet.getRange(rowIndex, 10).setValue(data.isVip === true);
  }
  if (data.status !== undefined) {
    sheet.getRange(rowIndex, 11).setValue(data.status);
  }
  if (data.addedBy !== undefined) {
    sheet.getRange(rowIndex, 12).setValue(data.addedBy.trim());
  }
  
  // Always update the UpdatedAt timestamp
  sheet.getRange(rowIndex, 14).setValue(timestamp);
  
  return {
    status: 'ok',
    message: 'Guest updated successfully',
    id: data.id
  };
}

/**
 * Delete a guest
 */
function deleteGuest(sheet, data) {
  // Validate required fields
  if (!data.id) {
    throw new Error('Guest ID is required for deletion');
  }

  // Find the guest row
  const lastRow = sheet.getLastRow();
  const idColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  
  let rowIndex = -1;
  for (let i = 0; i < idColumn.length; i++) {
    // Convert both to strings for comparison to handle numeric IDs
    if (String(idColumn[i][0]) === String(data.id)) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Guest not found with ID: ' + data.id);
  }
  
  // Delete the row
  sheet.deleteRow(rowIndex);
  
  return {
    status: 'ok',
    message: 'Guest deleted successfully',
    id: data.id
  };
}

/**
 * Bulk import guests
 */
function bulkImportGuests(sheet, data) {
  if (!data.guests || !Array.isArray(data.guests)) {
    throw new Error('guests array is required for bulk import');
  }

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  data.guests.forEach((guestData, index) => {
    try {
      createGuest(sheet, guestData);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        index: index,
        guest: guestData.name || 'Unknown',
        error: error.toString()
      });
    }
  });

  return {
    status: 'ok',
    message: `Bulk import completed. Success: ${results.success}, Failed: ${results.failed}`,
    results: results
  };
}

/**
 * Initialize the Guests sheet with headers
 */
function initializeGuestSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Guests');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Guests');
  }
  
  // Set up headers in row 1
  const headers = [
    'ID',              // A
    'Name',            // B
    'Role',            // C
    'Email',           // D
    'Contact',         // E
    'Message',         // F
    'AllowedGuests',   // G
    'Companions',      // H (JSON)
    'TableNumber',     // I
    'IsVip',           // J
    'Status',          // K
    'AddedBy',         // L
    'CreatedAt',       // M
    'UpdatedAt'        // N
  ];
  
  // Only set headers if row 1 is empty
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#8C6B4F');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    
    // Set column widths for better readability
    sheet.setColumnWidth(1, 200);  // ID
    sheet.setColumnWidth(2, 200);  // Name
    sheet.setColumnWidth(3, 150);  // Role
    sheet.setColumnWidth(4, 200);  // Email
    sheet.setColumnWidth(5, 120);  // Contact
    sheet.setColumnWidth(6, 250);  // Message
    sheet.setColumnWidth(7, 80);   // AllowedGuests
    sheet.setColumnWidth(8, 300);  // Companions
    sheet.setColumnWidth(9, 100);  // TableNumber
    sheet.setColumnWidth(10, 60);  // IsVip
    sheet.setColumnWidth(11, 100); // Status
    sheet.setColumnWidth(12, 120); // AddedBy
    sheet.setColumnWidth(13, 180); // CreatedAt
    sheet.setColumnWidth(14, 180); // UpdatedAt
  }
  
  return { status: 'ok', message: 'Guest sheet initialized successfully' };
}

/**
 * Add sample data for testing
 */
function addSampleGuests() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
  
  if (!sheet) {
    initializeGuestSheet();
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
  }
  
  const sampleGuests = [
    {
      name: 'John Smith',
      role: 'Friend',
      email: 'john.smith@example.com',
      contact: '+1234567890',
      message: 'So excited to celebrate with you!',
      allowedGuests: 3,
      companions: [
        { name: 'Jane Smith', relationship: 'Spouse' },
        { name: 'Little Smith', relationship: 'Child' }
      ],
      tableNumber: 'T1',
      isVip: true,
      status: 'confirmed',
      addedBy: 'Groom'
    },
    {
      name: 'Mary Johnson',
      role: 'Cousin',
      email: 'mary.j@example.com',
      contact: '+0987654321',
      message: 'Can\'t wait to see you both!',
      allowedGuests: 2,
      companions: [
        { name: 'Bob Johnson', relationship: 'Partner' }
      ],
      tableNumber: 'T2',
      isVip: false,
      status: 'confirmed',
      addedBy: 'Bride'
    },
    {
      name: 'Robert Williams',
      role: 'Colleague',
      email: 'robert.w@example.com',
      contact: '',
      message: '',
      allowedGuests: 1,
      companions: [],
      tableNumber: '',
      isVip: false,
      status: 'pending',
      addedBy: 'Groom'
    }
  ];
  
  sampleGuests.forEach(guest => {
    createGuest(sheet, guest);
  });
  
  return { status: 'ok', message: 'Sample guests added successfully' };
}

/**
 * Test function - run this from the Apps Script editor to verify setup
 */
function testSetup() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
    
    if (!sheet) {
      Logger.log('Guests sheet not found. Creating...');
      initializeGuestSheet();
      return 'Sheet created and initialized!';
    }
    
    const lastRow = sheet.getLastRow();
    Logger.log('Sheet found: Guests');
    Logger.log('Last row: ' + lastRow);
    Logger.log('Headers: ' + sheet.getRange(1, 1, 1, 5).getValues());
    
    if (lastRow > 1) {
      Logger.log('Sample data (first 5 columns): ' + sheet.getRange(2, 1, 1, 5).getValues());
    } else {
      Logger.log('No data yet. Run addSampleGuests() to add sample data.');
    }
    
    return 'Setup looks good!';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

/**
 * Test function - simulate a doGet request
 */
function testDoGet() {
  try {
    Logger.log('Testing doGet...');
    const result = doGet({});
    Logger.log('Result: ' + result.getContent());
    return 'doGet test complete. Check logs.';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

/**
 * Export guests to CSV format
 */
function exportGuestsToCSV() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
  
  if (!sheet) {
    return { error: 'Guests sheet not found' };
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { error: 'No guests to export' };
  }
  
  const data = sheet.getRange(1, 1, lastRow, 14).getValues();
  
  let csv = '';
  data.forEach(row => {
    csv += row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return '"' + cellStr.replace(/"/g, '""') + '"';
      }
      return cellStr;
    }).join(',') + '\n';
  });
  
  return {
    status: 'ok',
    csv: csv,
    rowCount: lastRow - 1
  };
}

/**
 * Get statistics about guests
 */
function getGuestStatistics() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guests');
  
  if (!sheet) {
    return { error: 'Guests sheet not found' };
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {
      total: 0,
      confirmed: 0,
      pending: 0,
      declined: 0,
      vip: 0,
      totalPax: 0
    };
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
  
  const stats = {
    total: 0,
    confirmed: 0,
    pending: 0,
    declined: 0,
    request: 0,
    vip: 0,
    totalPax: 0,
    byAddedBy: {}
  };
  
  data.forEach(row => {
    if (row[0]) { // Has ID
      stats.total++;
      
      // Count by status
      const status = row[10] || 'pending';
      if (status === 'confirmed') stats.confirmed++;
      else if (status === 'pending') stats.pending++;
      else if (status === 'declined') stats.declined++;
      else if (status === 'request') stats.request++;
      
      // Count VIP
      if (row[9] === true || row[9] === 'TRUE') stats.vip++;
      
      // Total pax
      stats.totalPax += parseInt(row[6]) || 1;
      
      // By added by
      const addedBy = row[11] || 'Unknown';
      stats.byAddedBy[addedBy] = (stats.byAddedBy[addedBy] || 0) + 1;
    }
  });
  
  return stats;
}

