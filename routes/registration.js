const express = require('express');
const router = express.Router();
const {
  submitRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  exportRegistrationsToExcel
} = require('../controllers/registrationController');

// Submit new registration
router.post('/submit', submitRegistration);

// Get all registrations (admin only) - must come before parameterized routes
router.get('/all', getAllRegistrations);

// Get registration by ID
router.get('/:id', getRegistrationById);

// Update registration status
router.patch('/:id/status', updateRegistrationStatus);

// Export registrations to Excel
router.get('/export/excel', exportRegistrationsToExcel);

module.exports = router;
