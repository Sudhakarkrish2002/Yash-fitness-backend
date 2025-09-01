const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  getContactStats,
  exportContactsToExcel
} = require('../controllers/contactController');

// Submit new contact form (public route)
router.post('/submit', submitContact);

// Get all contact submissions (admin route)
router.get('/all', getAllContacts);

// Get contact statistics (admin route)
router.get('/stats', getContactStats);

// Get contact by ID (admin route) - must come after specific routes
router.get('/:id', getContactById);

// Update contact status (admin route)
router.patch('/:id/status', updateContactStatus);

// Export contacts to Excel
router.get('/export/excel', exportContactsToExcel);

module.exports = router; 