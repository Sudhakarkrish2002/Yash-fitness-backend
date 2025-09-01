const express = require('express');
const router = express.Router();
const { registrationStorage, contactStorage } = require('../utils/excelStorage');

// Dashboard - Get overview statistics
router.get('/dashboard', async (req, res) => {
  try {
    const registrations = registrationStorage.getAll();
    const contacts = contactStorage.getAll();
    
    const totalRegistrations = registrations.length;
    const totalContacts = contacts.length;
    const pendingRegistrations = registrations.filter(reg => reg.status === 'pending').length;
    const newContacts = contacts.filter(contact => contact.status === 'new').length;
    
    const recentRegistrations = registrations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    const recentContacts = contacts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalRegistrations,
          totalContacts,
          pendingRegistrations,
          newContacts
        },
        recent: {
          registrations: recentRegistrations,
          contacts: recentContacts
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// Get all registrations with pagination and filters
router.get('/registrations', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Get filtered registrations
    const filteredRegistrations = registrationStorage.search(search, status);
    const total = filteredRegistrations.length;
    
    // Apply pagination
    const registrations = filteredRegistrations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        registrations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations'
    });
  }
});

// Get all contacts with pagination and filters
router.get('/contacts', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Get filtered contacts
    const filteredContacts = contactStorage.search(search, status);
    const total = filteredContacts.length;
    
    // Apply pagination
    const contacts = filteredContacts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

// Get detailed statistics
router.get('/stats', async (req, res) => {
  try {
    const registrations = registrationStorage.getAll();
    const contacts = contactStorage.getAll();
    
    // Registration stats by status
    const registrationStats = [];
    const registrationStatusCounts = {};
    registrations.forEach(reg => {
      registrationStatusCounts[reg.status] = (registrationStatusCounts[reg.status] || 0) + 1;
    });
    Object.entries(registrationStatusCounts).forEach(([status, count]) => {
      registrationStats.push({ _id: status, count });
    });
    
    // Contact stats by status
    const contactStats = [];
    const contactStatusCounts = {};
    contacts.forEach(contact => {
      contactStatusCounts[contact.status] = (contactStatusCounts[contact.status] || 0) + 1;
    });
    Object.entries(contactStatusCounts).forEach(([status, count]) => {
      contactStats.push({ _id: status, count });
    });
    
    // Monthly statistics (simplified)
    const monthlyRegistrations = [];
    const monthlyContacts = [];
    
    // Group by month for registrations
    const regByMonth = {};
    registrations.forEach(reg => {
      const date = new Date(reg.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      regByMonth[monthKey] = (regByMonth[monthKey] || 0) + 1;
    });
    Object.entries(regByMonth).slice(-12).forEach(([month, count]) => {
      const [year, monthNum] = month.split('-');
      monthlyRegistrations.push({ _id: { year: parseInt(year), month: parseInt(monthNum) }, count });
    });
    
    // Group by month for contacts
    const contactByMonth = {};
    contacts.forEach(contact => {
      const date = new Date(contact.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      contactByMonth[monthKey] = (contactByMonth[monthKey] || 0) + 1;
    });
    Object.entries(contactByMonth).slice(-12).forEach(([month, count]) => {
      const [year, monthNum] = month.split('-');
      monthlyContacts.push({ _id: { year: parseInt(year), month: parseInt(monthNum) }, count });
    });

    res.status(200).json({
      success: true,
      data: {
        registrationStats,
        contactStats,
        monthlyRegistrations,
        monthlyContacts
      }
    });
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

module.exports = router;
