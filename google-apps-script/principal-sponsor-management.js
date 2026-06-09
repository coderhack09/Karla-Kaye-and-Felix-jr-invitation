/**
 * Google Apps Script for Principal Sponsor Management
 * Deploy this as a Web App to create API endpoints for managing principal sponsors
 * 
 * Sheet Structure: Each principal sponsor pair is a row with the following columns:
 * A: MalePrincipalSponsor
 * B: FemalePrincipalSponsor
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

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PrincipalSponsors');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'PrincipalSponsors sheet not found. Please run initializePrincipalSponsorSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Parse the request body
  const body = JSON.parse(e.postData.contents);
  const action = body.action || 'create'; // Default to create if no action specified

  try {
    let result;
    
    switch (action) {
      case 'create':
        result = createPrincipalSponsor(sheet, body);
        break;
      case 'update':
        result = updatePrincipalSponsor(sheet, body);
        break;
      case 'delete':
        result = deletePrincipalSponsor(sheet, body);
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PrincipalSponsors');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'PrincipalSponsors sheet not found. Please run initializePrincipalSponsorSheet() first.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const sponsors = getAllPrincipalSponsors(sheet);
    
    return ContentService.createTextOutput(
      JSON.stringify(sponsors)
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all principal sponsors
 */
function getAllPrincipalSponsors(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  
  return data
    .filter(row => row[0] || row[1]) // Filter out completely empty rows
    .map(row => ({
      MalePrincipalSponsor: row[0] || '',
      FemalePrincipalSponsor: row[1] || ''
    }));
}

/**
 * Create a new principal sponsor
 */
function createPrincipalSponsor(sheet, data) {
  // Validate required fields
  if (!data.MalePrincipalSponsor && !data.FemalePrincipalSponsor) {
    throw new Error('At least one sponsor name is required');
  }

  const maleSponsor = (data.MalePrincipalSponsor || '').toString().trim();
  const femaleSponsor = (data.FemalePrincipalSponsor || '').toString().trim();

  // Check for duplicates
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const existingData = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (let i = 0; i < existingData.length; i++) {
      const existingMale = existingData[i][0].toString().trim();
      const existingFemale = existingData[i][1].toString().trim();
      
      if (existingMale === maleSponsor && existingFemale === femaleSponsor) {
        throw new Error('Principal sponsor pair already exists');
      }
    }
  }

  // Add new sponsor
  const newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, 1).setValue(maleSponsor);
  sheet.getRange(newRow, 2).setValue(femaleSponsor);

  return {
    status: 'ok',
    message: 'Principal sponsor added successfully',
    data: {
      MalePrincipalSponsor: maleSponsor,
      FemalePrincipalSponsor: femaleSponsor
    }
  };
}

/**
 * Update an existing principal sponsor
 */
function updatePrincipalSponsor(sheet, data) {
  // Validate required fields
  if (!data.originalMale && !data.originalFemale) {
    throw new Error('Original sponsor information is required for update');
  }

  const originalMale = (data.originalMale || '').toString().trim();
  const originalFemale = (data.originalFemale || '').toString().trim();
  const newMale = (data.MalePrincipalSponsor || '').toString().trim();
  const newFemale = (data.FemalePrincipalSponsor || '').toString().trim();

  // Find the sponsor row by matching both male and female names
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    throw new Error('No principal sponsors found');
  }

  const allData = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < allData.length; i++) {
    const currentMale = allData[i][0].toString().trim();
    const currentFemale = allData[i][1].toString().trim();
    
    // Match both names to identify the correct row
    if (currentMale === originalMale && currentFemale === originalFemale) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Principal sponsor not found: ' + originalMale + ' & ' + originalFemale);
  }

  // Update the sponsor
  sheet.getRange(rowIndex, 1).setValue(newMale);
  sheet.getRange(rowIndex, 2).setValue(newFemale);

  return {
    status: 'ok',
    message: 'Principal sponsor updated successfully',
    data: {
      MalePrincipalSponsor: newMale,
      FemalePrincipalSponsor: newFemale
    }
  };
}

/**
 * Delete a principal sponsor
 */
function deletePrincipalSponsor(sheet, data) {
  // Validate required fields
  if (!data.MalePrincipalSponsor && !data.FemalePrincipalSponsor) {
    throw new Error('Sponsor information is required for deletion');
  }

  const maleSponsor = (data.MalePrincipalSponsor || '').toString().trim();
  const femaleSponsor = (data.FemalePrincipalSponsor || '').toString().trim();

  // Find the sponsor row
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    throw new Error('No principal sponsors found');
  }

  const allData = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  let rowIndex = -1;
  
  for (let i = 0; i < allData.length; i++) {
    const currentMale = allData[i][0].toString().trim();
    const currentFemale = allData[i][1].toString().trim();
    
    // Match both names to identify the correct row
    if (currentMale === maleSponsor && currentFemale === femaleSponsor) {
      rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error('Principal sponsor not found: ' + maleSponsor + ' & ' + femaleSponsor);
  }

  // Delete the row
  sheet.deleteRow(rowIndex);

  return {
    status: 'ok',
    message: 'Principal sponsor deleted successfully'
  };
}

/**
 * Initialize the PrincipalSponsors sheet with headers
 * Run this function once from the Script Editor before deploying
 */
function initializePrincipalSponsorSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('PrincipalSponsors');
  
  if (!sheet) {
    sheet = ss.insertSheet('PrincipalSponsors');
  }
  
  // Set headers
  sheet.getRange(1, 1).setValue('MalePrincipalSponsor');
  sheet.getRange(1, 2).setValue('FemalePrincipalSponsor');
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, 2);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');
  
  // Set column widths
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 250);
  
  Logger.log('PrincipalSponsors sheet initialized successfully');
}


