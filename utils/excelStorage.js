const XLSX = require('xlsx');
const fs = require('fs-extra');
const path = require('path');

// Data storage directory
const DATA_DIR = path.join(__dirname, '../data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.xlsx');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.xlsx');

// Ensure data directory exists
const ensureDataDirectory = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Initialize Excel files if they don't exist
const initializeExcelFiles = () => {
  ensureDataDirectory();

  // Initialize registrations file
  if (!fs.existsSync(REGISTRATIONS_FILE)) {
    const registrationsWorkbook = XLSX.utils.book_new();
    const registrationsWorksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(registrationsWorkbook, registrationsWorksheet, 'Registrations');
    XLSX.writeFile(registrationsWorkbook, REGISTRATIONS_FILE);
  }

  // Initialize contacts file
  if (!fs.existsSync(CONTACTS_FILE)) {
    const contactsWorkbook = XLSX.utils.book_new();
    const contactsWorksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(contactsWorkbook, contactsWorksheet, 'Contacts');
    XLSX.writeFile(contactsWorkbook, CONTACTS_FILE);
  }
};

// Read data from Excel file
const readExcelData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data || [];
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
};

// Write data to Excel file
const writeExcelData = (filePath, data) => {
  try {
    console.log(`💾 Writing ${data.length} records to Excel file: ${filePath}`);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    console.log('📊 Excel workbook created, writing to file...');
    XLSX.writeFile(workbook, filePath);
    
    console.log('✅ Excel file written successfully');
    return true;
  } catch (error) {
    console.error('❌ Error writing Excel file:', error);
    console.error('❌ File path:', filePath);
    console.error('❌ Data length:', data.length);
    return false;
  }
};

// Generate sequential member ID
const generateMemberId = (existingRegistrations) => {
  // Find the highest existing member ID
  let maxId = 0;
  
  existingRegistrations.forEach(reg => {
    if (reg.memberId) {
      const idNumber = parseInt(reg.memberId.replace('YF', ''));
      if (!isNaN(idNumber) && idNumber > maxId) {
        maxId = idNumber;
      }
    }
  });
  
  // Generate next sequential ID
  const nextId = maxId + 1;
  
  // Format: YF00001, YF00002, etc.
  return `YF${nextId.toString().padStart(5, '0')}`;
};

// Generate unique ID for internal use
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Registration functions
const registrationStorage = {
  // Get all registrations
  getAll: () => {
    initializeExcelFiles();
    return readExcelData(REGISTRATIONS_FILE);
  },

  // Get registration by ID
  getById: (id) => {
    const registrations = registrationStorage.getAll();
    return registrations.find(reg => reg.id === id);
  },

  // Add new registration
  add: (registrationData) => {
    console.log('📝 Adding new registration to Excel...');
    
    try {
      const registrations = registrationStorage.getAll();
      console.log(`📊 Current registrations count: ${registrations.length}`);
      
      // Check if email already exists
      const existingRegistration = registrations.find(reg => reg.email === registrationData.email);
      if (existingRegistration) {
        console.log('❌ Email already exists:', registrationData.email);
        throw new Error('An registration with this email already exists');
      }

      // Generate sequential member ID
      const memberId = generateMemberId(registrations);
      console.log(`🆔 Generated Member ID: ${memberId}`);

      const newRegistration = {
        id: generateId(),
        memberId: memberId,
        ...registrationData,
        status: 'pending',
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📋 New registration data:', newRegistration);
      registrations.push(newRegistration);
      
      console.log('💾 Writing to Excel file...');
      if (writeExcelData(REGISTRATIONS_FILE, registrations)) {
        console.log('✅ Registration saved successfully to Excel');
        return newRegistration;
      } else {
        console.error('❌ Failed to write Excel file');
        throw new Error('Failed to save registration');
      }
    } catch (error) {
      console.error('❌ Error in add registration:', error);
      throw error;
    }
  },

  // Update registration
  update: (id, updateData) => {
    const registrations = registrationStorage.getAll();
    const index = registrations.findIndex(reg => reg.id === id);
    
    if (index === -1) {
      throw new Error('Registration not found');
    }

    registrations[index] = {
      ...registrations[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (writeExcelData(REGISTRATIONS_FILE, registrations)) {
      return registrations[index];
    } else {
      throw new Error('Failed to update registration');
    }
  },

  // Delete registration
  delete: (id) => {
    const registrations = registrationStorage.getAll();
    const filteredRegistrations = registrations.filter(reg => reg.id !== id);
    
    if (writeExcelData(REGISTRATIONS_FILE, filteredRegistrations)) {
      return true;
    } else {
      throw new Error('Failed to delete registration');
    }
  },

  // Search registrations
  search: (query, status = '') => {
    const registrations = registrationStorage.getAll();
    let filtered = registrations;

    // Filter by status
    if (status) {
      filtered = filtered.filter(reg => reg.status === status);
    }

    // Search by query
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(reg => 
        reg.firstName?.toLowerCase().includes(searchTerm) ||
        reg.lastName?.toLowerCase().includes(searchTerm) ||
        reg.email?.toLowerCase().includes(searchTerm) ||
        reg.phone?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  },

  // Get statistics
  getStats: () => {
    const registrations = registrationStorage.getAll();
    const stats = {};
    
    registrations.forEach(reg => {
      stats[reg.status] = (stats[reg.status] || 0) + 1;
    });

    return {
      total: registrations.length,
      byStatus: stats
    };
  }
};

// Contact functions
const contactStorage = {
  // Get all contacts
  getAll: () => {
    initializeExcelFiles();
    return readExcelData(CONTACTS_FILE);
  },

  // Get contact by ID
  getById: (id) => {
    const contacts = contactStorage.getAll();
    return contacts.find(contact => contact.id === id);
  },

  // Add new contact
  add: (contactData) => {
    const contacts = contactStorage.getAll();
    
    const newContact = {
      id: generateId(),
      ...contactData,
      status: 'new',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    contacts.push(newContact);
    
    if (writeExcelData(CONTACTS_FILE, contacts)) {
      return newContact;
    } else {
      throw new Error('Failed to save contact');
    }
  },

  // Update contact
  update: (id, updateData) => {
    const contacts = contactStorage.getAll();
    const index = contacts.findIndex(contact => contact.id === id);
    
    if (index === -1) {
      throw new Error('Contact not found');
    }

    contacts[index] = {
      ...contacts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (writeExcelData(CONTACTS_FILE, contacts)) {
      return contacts[index];
    } else {
      throw new Error('Failed to update contact');
    }
  },

  // Delete contact
  delete: (id) => {
    const contacts = contactStorage.getAll();
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    
    if (writeExcelData(CONTACTS_FILE, filteredContacts)) {
      return true;
    } else {
      throw new Error('Failed to delete contact');
    }
  },

  // Search contacts
  search: (query, status = '') => {
    const contacts = contactStorage.getAll();
    let filtered = contacts;

    // Filter by status
    if (status) {
      filtered = filtered.filter(contact => contact.status === status);
    }

    // Search by query
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name?.toLowerCase().includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm) ||
        contact.subject?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  },

  // Get statistics
  getStats: () => {
    const contacts = contactStorage.getAll();
    const stats = {};
    
    contacts.forEach(contact => {
      stats[contact.status] = (stats[contact.status] || 0) + 1;
    });

    return {
      total: contacts.length,
      byStatus: stats
    };
  }
};

// Export backup
const exportBackup = () => {
  const backupDir = path.join(DATA_DIR, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const backupPath = path.join(backupDir, `backup_${timestamp}.xlsx`);

  const workbook = XLSX.utils.book_new();
  
  // Add registrations sheet
  const registrations = registrationStorage.getAll();
  const registrationsSheet = XLSX.utils.json_to_sheet(registrations);
  XLSX.utils.book_append_sheet(workbook, registrationsSheet, 'Registrations');
  
  // Add contacts sheet
  const contacts = contactStorage.getAll();
  const contactsSheet = XLSX.utils.json_to_sheet(contacts);
  XLSX.utils.book_append_sheet(workbook, contactsSheet, 'Contacts');
  
  // Add summary sheet
  const summary = [
    { 'Data Type': 'Registrations', 'Count': registrations.length, 'Date': new Date().toISOString() },
    { 'Data Type': 'Contacts', 'Count': contacts.length, 'Date': new Date().toISOString() },
    { 'Data Type': 'Total Records', 'Count': registrations.length + contacts.length, 'Date': new Date().toISOString() }
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  XLSX.writeFile(workbook, backupPath);
  return backupPath;
};

module.exports = {
  registrationStorage,
  contactStorage,
  exportBackup,
  initializeExcelFiles
};
