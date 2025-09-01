const express = require('express');
const router = express.Router();
const { exportAllDataToExcel } = require('../utils/excelExport');
const { registrationStorage, contactStorage } = require('../utils/excelStorage');

// Export all data to Excel (registrations + contacts)
router.get('/all/excel', async (req, res) => {
  try {
    // Fetch all registrations and contacts from Excel files
    const registrations = registrationStorage.getAll()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const contacts = contactStorage.getAll()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Export to Excel
    const result = await exportAllDataToExcel(registrations, contacts);

    res.status(200).json({
      success: true,
      message: 'Data exported successfully',
      data: {
        fileName: result.fileName,
        registrationsCount: result.registrationsCount,
        contactsCount: result.contactsCount,
        totalCount: result.totalCount,
        downloadUrl: `/api/export/download/${result.fileName}`
      }
    });

  } catch (error) {
    console.error('❌ Error exporting all data:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data to Excel'
    });
  }
});

// Download exported file
router.get('/download/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = require('path').join(__dirname, '../exports', fileName);
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('❌ Error downloading file:', err);
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
    });
  } catch (error) {
    console.error('❌ Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving file'
    });
  }
});

module.exports = router;
