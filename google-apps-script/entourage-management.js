/**
 * Google Apps Script for Entourage Management
 * Deploy this as a Web App to create API endpoints for managing entourage
 * 
 * Sheet Structure: Each entourage member is a row with the following columns:
 * A: Name
 * B: RoleCategory
 * C: RoleTitle
 * D: Email
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

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entourage');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Entourage sheet not found. Please run initializeEntourageSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Parse the request body
  const body = JSON.parse(e.postData.contents);
  const action = body.action || 'create'; // Default to create if no action specified

  try {
    let result;
    
    switch (action) {
      case 'create':
        result = createEntourageMember(sheet, body);
        break;
      case 'update':
        result = updateEntourageMember(sheet, body);
        break;
      case 'delete':
        result = deleteEntourageMember(sheet, body);
        break;
      default:
        return ContentService.createTextOutput(
          JSON.stringify({ error: 'Invalid action. Use "create", "update", or "delete".' })
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entourage');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Entourage sheet not found. Please run initializeEntourageSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const entourage = getAllEntourageMembers(sheet);
    
    return ContentService.createTextOutput(
      JSON.stringify(entourage)
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all entourage members
 */
function getAllEntourageMembers(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  
  return data
    .filter(row => row[0]) // Filter out rows with no name
    .map(row => ({
      Name: row[0] || '',
      RoleCategory: row[1] || '',
      RoleTitle: row[2] || '',
      Email: row[3] || ''
    }));
}

/**
 * Create a new entourage member
 */
function createEntourageMember(sheet, data) {
  // Validate required fields
  if (!data.Name) {
    throw new Error('Name is required');
  }

  const name = data.Name.toString().trim();
  const roleCategory = (data.RoleCategory || '').toString().trim();
  const roleTitle = (data.RoleTitle || '').toString().trim();
  const email = (data.Email || '').toString().trim();

  // Check for duplicates
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const existingNames = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < existingNames.length; i++) {
      if (existingNames[i][0].toString().trim() === name) {
        throw new Error('Entourage member with this name already exists');
      }
    }
  }

  // Add new member
  const newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, 1).setValue(name);
  sheet.getRange(newRow, 2).setValue(roleCategory);
  sheet.getRange(newRow, 3).setValue(roleTitle);
  sheet.getRange(newRow, 4).setValue(email);

  return {
    status: 'ok',
    message: 'Entourage member added successfully',
    data: {
      Name: name,
      RoleCategory: roleCategory,
      RoleTitle: roleTitle,
      Email: email
    }
  };
}

/**
 * Update an existing entourage member
 */
function updateEntourageMember(sheet, data) {
  // Validate required fields
  if (!data.originalName) {
    throw new Error('Original name is required for update');
  }
  if (!data.Name) {
    throw new Error('Name is required');
  }

  const originalName = data.originalName.toString().trim();
  const newName = data.Name.toString().trim();
  const roleCategory = (data.RoleCategory || '').toString().trim();
  const roleTitle = (data.RoleTitle || '').toString().trim();
  const email = (data.Email || '').toString().trim();

  // Find the member row
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    throw new Error('No entourage members found');
  }

  const allNames = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < allNames.length; i++) {
    if (allNames[i][0].toString().trim() === originalName) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Entourage member not found: ' + originalName);
  }

  // Check if new name already exists (and it's not the same row)
  if (originalName !== newName) {
    for (let i = 0; i < allNames.length; i++) {
      const currentRow = i + 2;
      if (currentRow !== rowIndex && allNames[i][0].toString().trim() === newName) {
        throw new Error('Another entourage member with this name already exists');
      }
    }
  }

  // Update the member
  sheet.getRange(rowIndex, 1).setValue(newName);
  sheet.getRange(rowIndex, 2).setValue(roleCategory);
  sheet.getRange(rowIndex, 3).setValue(roleTitle);
  sheet.getRange(rowIndex, 4).setValue(email);

  return {
    status: 'ok',
    message: 'Entourage member updated successfully',
    data: {
      Name: newName,
      RoleCategory: roleCategory,
      RoleTitle: roleTitle,
      Email: email
    }
  };
}

/**
 * Delete an entourage member
 */
function deleteEntourageMember(sheet, data) {
  // Validate required fields
  if (!data.Name) {
    throw new Error('Name is required for deletion');
  }

  const name = data.Name.toString().trim();

  // Find the member row
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    throw new Error('No entourage members found');
  }

  const allNames = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < allNames.length; i++) {
    if (allNames[i][0].toString().trim() === name) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Entourage member not found: ' + name);
  }

  // Delete the row
  sheet.deleteRow(rowIndex);

  return {
    status: 'ok',
    message: 'Entourage member deleted successfully'
  };
}

/**
 * Initialize the Entourage sheet with headers
 * Run this function once from the Script Editor before deploying
 */
function initializeEntourageSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Entourage');
  
  if (!sheet) {
    sheet = ss.insertSheet('Entourage');
  }
  
  // Set headers
  sheet.getRange(1, 1).setValue('Name');
  sheet.getRange(1, 2).setValue('RoleCategory');
  sheet.getRange(1, 3).setValue('RoleTitle');
  sheet.getRange(1, 4).setValue('Email');
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 4);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');
  
  // Set column widths
  sheet.setColumnWidth(1, 200); // Name
  sheet.setColumnWidth(2, 150); // RoleCategory
  sheet.setColumnWidth(3, 150); // RoleTitle
  sheet.setColumnWidth(4, 250); // Email
  
  Logger.log('Entourage sheet initialized successfully');
}


