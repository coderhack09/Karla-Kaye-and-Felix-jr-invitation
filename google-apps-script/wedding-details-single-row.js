/**
 * Google Apps Script for Wedding Details Management (Single Row Structure)
 * Deploy this as a Web App to create API endpoints
 * 
 * Sheet Structure: One row of data (row 2) with 24 columns for all wedding details
 */

function doPost(e) {
  // Guard against running without event data
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Invalid request. This function must be called via web app deployment.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WeddingDetails');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'WeddingDetails sheet not found' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Parse the request body
  const body = JSON.parse(e.postData.contents);

  try {
    if (body.action === 'update') {
      // Ensure headers exist before updating data
      if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
        initializeHeaders(sheet);
      }
      
      // Always update row 2 (the data row, row 1 is headers)
      const i = 2;
      
      // Extract nested values from the body (matching your React component structure)
      const coupleBride = (body.couple?.bride || '').toString().trim();
      const coupleBrideNickname = (body.couple?.brideNickname || '').toString().trim();
      const coupleGroom = (body.couple?.groom || '').toString().trim();
      const coupleGroomNickname = (body.couple?.groomNickname || '').toString().trim();
      
      const weddingDate = (body.wedding?.date || '').toString().trim();
      const weddingVenue = (body.wedding?.venue || '').toString().trim();
      const weddingTagline = (body.wedding?.tagline || '').toString().trim();
      
      const theme = (body.theme || '').toString().trim();
      const hashtag = (body.hashtag || '').toString().trim();
      
      const ceremonyVenue = (body.ceremony?.venue || '').toString().trim();
      const ceremonyAddress = (body.ceremony?.address || '').toString().trim();
      const ceremonyTime = (body.ceremony?.time || '').toString().trim();
      const ceremonyGoogleMapsUrl = (body.ceremony?.googleMapsUrl || '').toString().trim();
      
      const receptionVenue = (body.reception?.venue || '').toString().trim();
      const receptionAddress = (body.reception?.address || '').toString().trim();
      const receptionTime = (body.reception?.time || '').toString().trim();
      const receptionGoogleMapsUrl = (body.reception?.googleMapsUrl || '').toString().trim();
      
      const narrativesBride = (body.narratives?.bride || '').toString().trim();
      const narrativesGroom = (body.narratives?.groom || '').toString().trim();
      const narrativesShared = (body.narratives?.shared || '').toString().trim();
      
      const dressCodeTheme = (body.dressCode?.theme || '').toString().trim();
      const dressCodeNote = (body.dressCode?.note || '').toString().trim();
      
      const rsvpDeadline = (body.details?.rsvp?.deadline || '').toString().trim();
      
      const contactBridePhone = (body.contact?.bridePhone || '').toString().trim();
      const contactGroomPhone = (body.contact?.groomPhone || '').toString().trim();
      const contactEmail = (body.contact?.email || '').toString().trim();
      
      // Update all columns in row 2 using batch update for better performance
      const values = [[
        coupleBride,                 // 1: Bride full name
        coupleBrideNickname,         // 2: Bride nickname
        coupleGroom,                 // 3: Groom full name
        coupleGroomNickname,         // 4: Groom nickname
        weddingDate,                 // 5: Wedding date
        weddingVenue,                // 6: Wedding venue
        weddingTagline,              // 7: Wedding tagline
        theme,                       // 8: Theme / motif color
        hashtag,                     // 9: Wedding hashtag
        ceremonyVenue,               // 10: Ceremony venue name
        ceremonyAddress,             // 11: Ceremony address
        ceremonyTime,                // 12: Ceremony time
        ceremonyGoogleMapsUrl,       // 13: Ceremony Google Maps URL
        receptionVenue,              // 14: Reception venue name
        receptionAddress,            // 15: Reception address
        receptionTime,               // 16: Reception time
        receptionGoogleMapsUrl,      // 17: Reception Google Maps URL
        narrativesBride,             // 18: About the bride
        narrativesGroom,             // 19: About the groom
        narrativesShared,            // 20: Shared love story
        dressCodeTheme,              // 21: Dress code theme
        dressCodeNote,               // 22: Dress code note to guests
        rsvpDeadline,                // 23: RSVP deadline
        contactBridePhone,           // 24: Bride phone
        contactGroomPhone,           // 25: Groom phone
        contactEmail                 // 26: Contact email
      ]];
      
      sheet.getRange(i, 1, 1, 26).setValues(values);

      return ContentService.createTextOutput(
        JSON.stringify({ status: 'ok', message: 'Wedding details updated successfully' })
      ).setMimeType(ContentService.MimeType.JSON);

    } else if (body.action === 'delete') {
      // Clear all data (keep headers, clear row 2)
      if (sheet.getLastRow() >= 2) {
        sheet.getRange(2, 1, 1, 26).clearContent();
      }
      
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'ok', message: 'Wedding details cleared successfully' })
      ).setMimeType(ContentService.MimeType.JSON);

    } else if (body.action === 'initialize') {
      // Initialize with default values (legacy support)
      initializeWeddingDetails();
      
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'ok', message: 'Wedding details initialized' })
      ).setMimeType(ContentService.MimeType.JSON);

    } else {
      return ContentService.createTextOutput(
        JSON.stringify({ error: 'Invalid action. Use "update", "delete", or "initialize".' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WeddingDetails');
  
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'WeddingDetails sheet not found' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Initialize headers if they don't exist
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
      initializeHeaders(sheet);
    }
    
    // Get data from row 2 (row 1 is headers)
    const row = 2;
    const lastColumn = 26; // We have 26 columns
    
    // Initialize values array with empty strings
    let values = new Array(lastColumn).fill('');
    
    // Only get values if row 2 exists
    if (sheet.getLastRow() >= 2) {
      values = sheet.getRange(row, 1, 1, lastColumn).getValues()[0];
    }
    
    // Build nested object structure to match your React component
    // Return empty strings, not default values
    const weddingDetails = {
      couple: {
        bride: values[0] || '',
        brideNickname: values[1] || '',
        groom: values[2] || '',
        groomNickname: values[3] || ''
      },
      wedding: {
        date: values[4] || '',
        venue: values[5] || '',
        tagline: values[6] || ''
      },
      theme: values[7] || '',
      hashtag: values[8] || '',
      ceremony: {
        venue: values[9] || '',
        address: values[10] || '',
        time: values[11] || '',
        googleMapsUrl: values[12] || ''
      },
      reception: {
        venue: values[13] || '',
        address: values[14] || '',
        time: values[15] || '',
        googleMapsUrl: values[16] || ''
      },
      narratives: {
        bride: values[17] || '',
        groom: values[18] || '',
        shared: values[19] || ''
      },
      dressCode: {
        theme: values[20] || '',
        note: values[21] || ''
      },
      details: {
        rsvp: {
          deadline: values[22] || ''
        }
      },
      contact: {
        bridePhone: values[23] || '',
        groomPhone: values[24] || '',
        email: values[25] || ''
      }
    };

    return ContentService.createTextOutput(
      JSON.stringify(weddingDetails)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Initialize only the headers (without default data)
 */
function initializeHeaders(sheet) {
  const headers = [
    'Bride Full Name',           // 1
    'Bride Nickname',            // 2
    'Groom Full Name',           // 3
    'Groom Nickname',            // 4
    'Wedding Date',              // 5
    'Wedding Venue',             // 6
    'Wedding Tagline',           // 7
    'Theme',                     // 8
    'Hashtag',                   // 9
    'Ceremony Venue',            // 10
    'Ceremony Address',          // 11
    'Ceremony Time',             // 12
    'Ceremony Google Maps URL',  // 13
    'Reception Venue',           // 14
    'Reception Address',         // 15
    'Reception Time',            // 16
    'Reception Google Maps URL', // 17
    'About the Bride',           // 18
    'About the Groom',           // 19
    'Shared Love Story',         // 20
    'Dress Code Theme',          // 21
    'Dress Code Note',           // 22
    'RSVP Deadline',             // 23
    'Bride Phone',               // 24
    'Groom Phone',               // 25
    'Contact Email'              // 26
  ];
  
  // Set headers in row 1
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#8C6B4F');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
  
  return { status: 'ok', message: 'Headers initialized' };
}

/**
 * Initialize the WeddingDetails sheet with headers and default data (legacy support)
 */
function initializeWeddingDetails() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('WeddingDetails');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('WeddingDetails');
  }
  
  // Initialize headers if they don't exist
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
    initializeHeaders(sheet);
  }
  
  // Add default data in row 2 if it doesn't exist (only for legacy initialize action)
  if (sheet.getLastRow() < 2) {
    const defaultData = [
      '',                                        // 1: Bride full name
      '',                                                             // 2: Bride nickname
      '',                                         // 3: Groom full name
      '',                                                              // 4: Groom nickname
      '',                                               // 5: Wedding date
      '',                                              // 6: Wedding venue
      '',                            // 7: Wedding tagline
      '',                                                // 8: Theme
      '',                                                   // 9: Hashtag
      '',                                              // 10: Ceremony venue
      '',                                               // 11: Ceremony address
      '',                                                         // 12: Ceremony time
      '',                                                                // 13: Ceremony Google Maps URL
      '',                                      // 14: Reception venue
      '',                                               // 15: Reception address
      '',                                                         // 16: Reception time
      '',                                                                // 17: Reception Google Maps URL
      '',                            // 18: About the bride
      '',                            // 19: About the groom
      '',                                         // 20: Shared love story
      '',                                                   // 21: Dress code theme
      '', // 22: Dress code note
      '',                                               // 23: RSVP deadline
      '',                                                                // 24: Bride phone
      '',                                                                // 25: Groom phone
      ''                                                                 // 26: Contact email
    ];
    
    sheet.getRange(2, 1, 1, defaultData.length).setValues([defaultData]);
  }
  
  return { status: 'ok', message: 'Wedding details initialized' };
}

/**
 * Test function - run this from the Apps Script editor to verify setup
 */
function testSetup() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WeddingDetails');
    
    if (!sheet) {
      Logger.log('WeddingDetails sheet not found. Creating...');
      initializeWeddingDetails();
      return 'Sheet created and initialized!';
    }
    
    const lastRow = sheet.getLastRow();
    Logger.log('Sheet found: WeddingDetails');
    Logger.log('Last row: ' + lastRow);
    Logger.log('Headers: ' + sheet.getRange(1, 1, 1, 5).getValues());
    
    if (lastRow > 1) {
      Logger.log('Sample data (first 5 columns): ' + sheet.getRange(2, 1, 1, 5).getValues());
    } else {
      Logger.log('No data yet. Run testInitialize() to add default data.');
    }
    
    return 'Setup looks good!';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

/**
 * Test function - run this to initialize with default wedding details
 */
function testInitialize() {
  try {
    Logger.log('Initializing wedding details with defaults...');
    const result = initializeWeddingDetails();
    Logger.log(result);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WeddingDetails');
    Logger.log('Sheet now has ' + sheet.getLastRow() + ' row(s) (including header).');
    
    return 'Initialization complete!';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

/**
 * Debug function - run this to see current wedding details
 */
function debugViewAllDetails() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WeddingDetails');
    
    if (!sheet) {
      return 'WeddingDetails sheet not found!';
    }
    
    const lastRow = sheet.getLastRow();
    const lastColumn = 26;
    
    Logger.log('=== Wedding Details ===');
    Logger.log('Total rows: ' + lastRow);
    
    if (lastRow >= 1) {
      const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
      Logger.log('Headers: ' + JSON.stringify(headers));
    }
    
    if (lastRow >= 2) {
      const data = sheet.getRange(2, 1, 1, lastColumn).getValues()[0];
      Logger.log('Data Row 2: ' + JSON.stringify(data));
    }
    
    return 'Debug complete. Check logs.';
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

