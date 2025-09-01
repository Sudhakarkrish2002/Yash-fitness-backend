const XLSX = require('xlsx');
const fs = require('fs-extra');
const path = require('path');

// Data storage directory
const DATA_DIR = path.join(__dirname, '../data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.xlsx');

// Generate sequential member ID
const generateMemberId = (index) => {
  // Format: YF00001, YF00002, etc.
  return `YF${(index + 1).toString().padStart(5, '0')}`;
};

// Update existing registrations with member IDs
const updateMemberIds = () => {
  try {
    console.log('🔄 Updating existing registrations with member IDs...');
    
    // Read existing data
    const workbook = XLSX.readFile(REGISTRATIONS_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 Found ${data.length} existing registrations`);
    
    // Update each registration with a member ID
    const updatedData = data.map((registration, index) => {
      const memberId = generateMemberId(index);
      console.log(`🆔 Registration ${index + 1}: ${registration.firstName} ${registration.lastName} -> ${memberId}`);
      
      return {
        ...registration,
        memberId: memberId
      };
    });
    
    // Write updated data back to Excel
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Data');
    XLSX.writeFile(newWorkbook, REGISTRATIONS_FILE);
    
    console.log('✅ Successfully updated all registrations with member IDs');
    console.log('📋 Updated registrations:');
    
    updatedData.forEach((registration, index) => {
      console.log(`   ${registration.memberId}: ${registration.firstName} ${registration.lastName} (${registration.email})`);
    });
    
    return updatedData;
    
  } catch (error) {
    console.error('❌ Error updating member IDs:', error);
    throw error;
  }
};

// View current member IDs
const viewMemberIds = () => {
  try {
    const workbook = XLSX.readFile(REGISTRATIONS_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('\n📊 CURRENT MEMBER IDs');
    console.log('='.repeat(50));
    
    data.forEach((registration, index) => {
      console.log(`${index + 1}. ${registration.memberId || 'NO ID'} - ${registration.firstName} ${registration.lastName} (${registration.email})`);
    });
    
  } catch (error) {
    console.error('❌ Error reading member IDs:', error);
  }
};

// Main function
const main = () => {
  const args = process.argv.slice(2);
  
  if (args.includes('--view') || args.includes('-v')) {
    viewMemberIds();
  } else if (args.includes('--update') || args.includes('-u')) {
    updateMemberIds();
  } else {
    console.log('Usage:');
    console.log('  node updateMemberIds.js --view    # View current member IDs');
    console.log('  node updateMemberIds.js --update  # Update existing registrations with member IDs');
  }
};

main();
