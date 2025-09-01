const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Create exports directory if it doesn't exist
const createExportsDirectory = () => {
  const exportsDir = path.join(__dirname, '../exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  return exportsDir;
};

// Export registrations to Excel
const exportRegistrationsToExcel = async (registrations) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');

    // Define columns
    worksheet.columns = [
      { header: 'Member ID', key: 'memberId', width: 12 },
      { header: 'Internal ID', key: 'id', width: 10 },
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Pincode', key: 'pincode', width: 10 },
      { header: 'Emergency Contact', key: 'emergencyName', width: 20 },
      { header: 'Emergency Phone', key: 'emergencyPhone', width: 15 },
      { header: 'Relationship', key: 'emergencyRelation', width: 15 },
      { header: 'Height (cm)', key: 'height', width: 12 },
      { header: 'Weight (kg)', key: 'weight', width: 12 },
      { header: 'Blood Group', key: 'bloodGroup', width: 12 },
      { header: 'Fitness Goals', key: 'fitnessGoals', width: 20 },
      { header: 'Experience Level', key: 'experienceLevel', width: 15 },
      { header: 'Preferred Time', key: 'preferredTime', width: 20 },
      { header: 'Membership Plan', key: 'membershipPlan', width: 20 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'Payment Method', key: 'paymentMethod', width: 15 },
      { header: 'Medical Conditions', key: 'medicalConditions', width: 30 },
      { header: 'Medications', key: 'medications', width: 30 },
      { header: 'Allergies', key: 'allergies', width: 30 },
      { header: 'How Did You Hear', key: 'howDidYouHear', width: 20 },
      { header: 'Special Requirements', key: 'specialRequirements', width: 30 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registration Date', key: 'registrationDate', width: 20 },
      { header: 'Notes', key: 'notes', width: 30 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };

    // Add data rows
    registrations.forEach((registration, index) => {
      const row = worksheet.addRow({
        memberId: registration.memberId || 'NO ID',
        id: registration._id ? registration._id.toString() : registration.id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        phone: registration.phone,
        dateOfBirth: registration.dateOfBirth ? new Date(registration.dateOfBirth).toLocaleDateString() : '',
        gender: registration.gender,
        address: registration.address,
        city: registration.city,
        state: registration.state,
        pincode: registration.pincode,
        emergencyName: registration.emergencyName,
        emergencyPhone: registration.emergencyPhone,
        emergencyRelation: registration.emergencyRelation,
        height: registration.height,
        weight: registration.weight,
        bloodGroup: registration.bloodGroup || '',
        fitnessGoals: registration.fitnessGoals,
        experienceLevel: registration.experienceLevel,
        preferredTime: registration.preferredTime,
        membershipPlan: registration.membershipPlan,
        startDate: registration.startDate ? new Date(registration.startDate).toLocaleDateString() : '',
        paymentMethod: registration.paymentMethod,
        medicalConditions: registration.medicalConditions || '',
        medications: registration.medications || '',
        allergies: registration.allergies || '',
        howDidYouHear: registration.howDidYouHear || '',
        specialRequirements: registration.specialRequirements || '',
        status: registration.status,
        registrationDate: registration.registrationDate ? new Date(registration.registrationDate).toLocaleDateString() : '',
        notes: registration.notes || ''
      });

      // Alternate row colors for better readability
      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        };
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    // Add summary information
    const summaryRow = worksheet.addRow([]);
    const summaryRow2 = worksheet.addRow([]);
    const summaryRow3 = worksheet.addRow(['Total Registrations:', registrations.length]);
    const summaryRow4 = worksheet.addRow(['Export Date:', new Date().toLocaleString()]);

    // Style summary rows
    [summaryRow3, summaryRow4].forEach(row => {
      row.font = { bold: true };
      row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };
    });

    // Save the file
    const exportsDir = createExportsDirectory();
    const fileName = `registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = path.join(exportsDir, fileName);
    
    await workbook.xlsx.writeFile(filePath);
    
    return {
      success: true,
      fileName,
      filePath,
      count: registrations.length
    };
  } catch (error) {
    console.error('Error exporting registrations to Excel:', error);
    throw error;
  }
};

// Export contacts to Excel
const exportContactsToExcel = async (contacts) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contacts');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Subject', key: 'subject', width: 20 },
      { header: 'Message', key: 'message', width: 50 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'IP Address', key: 'ipAddress', width: 15 },
      { header: 'Submitted Date', key: 'createdAt', width: 20 },
      { header: 'Admin Notes', key: 'adminNotes', width: 30 }
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };

    // Add data rows
    contacts.forEach((contact, index) => {
      const row = worksheet.addRow({
        id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        subject: contact.subjectDisplay || contact.subject,
        message: contact.message,
        status: contact.status,
        priority: contact.priority,
        ipAddress: contact.ipAddress || '',
        createdAt: contact.createdAt ? new Date(contact.createdAt).toLocaleString() : '',
        adminNotes: contact.adminNotes || ''
      });

      // Alternate row colors for better readability
      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        };
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    // Add summary information
    const summaryRow = worksheet.addRow([]);
    const summaryRow2 = worksheet.addRow([]);
    const summaryRow3 = worksheet.addRow(['Total Contacts:', contacts.length]);
    const summaryRow4 = worksheet.addRow(['Export Date:', new Date().toLocaleString()]);

    // Style summary rows
    [summaryRow3, summaryRow4].forEach(row => {
      row.font = { bold: true };
      row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };
    });

    // Save the file
    const exportsDir = createExportsDirectory();
    const fileName = `contacts_${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = path.join(exportsDir, fileName);
    
    await workbook.xlsx.writeFile(filePath);
    
    return {
      success: true,
      fileName,
      filePath,
      count: contacts.length
    };
  } catch (error) {
    console.error('Error exporting contacts to Excel:', error);
    throw error;
  }
};

// Export all data to Excel (both registrations and contacts)
const exportAllDataToExcel = async (registrations, contacts) => {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Add registrations worksheet
    const registrationsWorksheet = workbook.addWorksheet('Registrations');
    const contactsWorksheet = workbook.addWorksheet('Contacts');

    // Define registrations columns
    registrationsWorksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Membership Plan', key: 'membershipPlan', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registration Date', key: 'registrationDate', width: 20 }
    ];

    // Define contacts columns
    contactsWorksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Subject', key: 'subject', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Submitted Date', key: 'createdAt', width: 20 }
    ];

    // Style headers
    [registrationsWorksheet, contactsWorksheet].forEach(worksheet => {
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      };
    });

    // Add registrations data
    registrations.forEach((registration, index) => {
      const row = registrationsWorksheet.addRow({
        id: registration._id.toString(),
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        phone: registration.phone,
        membershipPlan: registration.membershipPlan,
        status: registration.status,
        registrationDate: registration.registrationDate ? new Date(registration.registrationDate).toLocaleDateString() : ''
      });

      if (index % 2 === 1) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      }
    });

    // Add contacts data
    contacts.forEach((contact, index) => {
      const row = contactsWorksheet.addRow({
        id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        subject: contact.subjectDisplay || contact.subject,
        status: contact.status,
        createdAt: contact.createdAt ? new Date(contact.createdAt).toLocaleString() : ''
      });

      if (index % 2 === 1) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      }
    });

    // Add summary worksheet
    const summaryWorksheet = workbook.addWorksheet('Summary');
    summaryWorksheet.columns = [
      { header: 'Data Type', key: 'type', width: 20 },
      { header: 'Count', key: 'count', width: 15 },
      { header: 'Last Updated', key: 'lastUpdated', width: 25 }
    ];

    const summaryHeaderRow = summaryWorksheet.getRow(1);
    summaryHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    summaryHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };

    summaryWorksheet.addRow(['Registrations', registrations.length, new Date().toLocaleString()]);
    summaryWorksheet.addRow(['Contacts', contacts.length, new Date().toLocaleString()]);
    summaryWorksheet.addRow(['Total Records', registrations.length + contacts.length, new Date().toLocaleString()]);

    // Save the file
    const exportsDir = createExportsDirectory();
    const fileName = `yash_fitness_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = path.join(exportsDir, fileName);
    
    await workbook.xlsx.writeFile(filePath);
    
    return {
      success: true,
      fileName,
      filePath,
      registrationsCount: registrations.length,
      contactsCount: contacts.length,
      totalCount: registrations.length + contacts.length
    };
  } catch (error) {
    console.error('Error exporting all data to Excel:', error);
    throw error;
  }
};

module.exports = {
  exportRegistrationsToExcel,
  exportContactsToExcel,
  exportAllDataToExcel
};
