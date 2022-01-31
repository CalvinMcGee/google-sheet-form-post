// Heavily inspired by https://github.com/jamiewilson/form-to-google-sheets

const scriptProp = PropertiesService.getScriptProperties()

// Run this function to set necessary permissions
function intialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

// Convert object to array to write data
function formatWrite (keys, data) {
  let output = []
  keys.forEach((key) => {
    if (data[key]) {
      output.push(data[key])
    } else {
      output.push("")
    }
  })
  return output
}

// Handle GET request
function doGet (e) {
  return ContentService
    .createTextOutput(JSON.stringify({"status": "ok", "message": "Use POST request instead"}))
    .setMimeType(ContentService.MimeType.JSON)
}

// Handle POST request
function doPost (e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    const sheet = doc.getActiveSheet()

    // Get sheet headers
    let headers;
    if (sheet.getLastColumn() < 1) {
      headers = [];
    } else {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    }

    // Post data
    const rawData = e?.postData?.contents;
    let data;
    if (rawData) {
      data = JSON.parse(rawData);
    }

    // Checking if post data contains different headers than the spreadsheet
    if (Object.keys(data).filter((item) => !headers.includes(item)).length > 0) {
      const newHeaders = []

      // Always make sure we have timestamp column
      if (!headers.includes('timestamp')) {
        newHeaders.push('timestamp')
      }

      newHeaders.push(...Object.keys(data).filter((item) => !headers.includes(item)))

      // Make sure all headers are unique
      const uniqueHeaders = [...new Set(newHeaders)]
      // Write header columns
      sheet.getRange(1, (1 + headers.length), 1, uniqueHeaders.length).setValues([uniqueHeaders])
    }

    headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    // Format the data we will write
    const newRow = formatWrite(headers, {...data, timestamp: new Date()})
    const nextRow = sheet.getLastRow() + 1

    // Write post data to sheet
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({newRow}))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e, 'test': 'test error' }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
