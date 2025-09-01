const XLSX = require('xlsx');
const path = require('path');

// Function to view registrations
const viewRegistrations = () => {
  try {
    const filePath = path.join(__dirname, 'data', 'registrations.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    console.log('\n📊 REGISTRATIONS DATA');
    console.log('='.repeat(50));
    console.log(`Total Registrations: ${data.length}\n`);
    
    data.forEach((registration, index) => {
      console.log(`📋 Registration #${index + 1}`);
      console.log(`   Member ID: ${registration.memberId || 'NO ID'}`);
      console.log(`   Internal ID: ${registration.id}`);
      console.log(`   Name: ${registration.firstName} ${registration.lastName}`);
      console.log(`   Email: ${registration.email}`);
      console.log(`   Phone: ${registration.phone}`);
      console.log(`   Membership Plan: ${registration.membershipPlan}`);
      console.log(`   Status: ${registration.status}`);
      console.log(`   Created: ${registration.createdAt}`);
      console.log(`   Address: ${registration.address}, ${registration.city}, ${registration.state} - ${registration.pincode}`);
      console.log(`   Emergency Contact: ${registration.emergencyName} (${registration.emergencyPhone})`);
      console.log(`   Fitness Goals: ${registration.fitnessGoals}`);
      console.log(`   Experience Level: ${registration.experienceLevel}`);
      console.log(`   Preferred Time: ${registration.preferredTime}`);
      console.log(`   Height: ${registration.height} cm, Weight: ${registration.weight} kg`);
      if (registration.bloodGroup) console.log(`   Blood Group: ${registration.bloodGroup}`);
      if (registration.medicalConditions) console.log(`   Medical Conditions: ${registration.medicalConditions}`);
      if (registration.medications) console.log(`   Medications: ${registration.medications}`);
      if (registration.allergies) console.log(`   Allergies: ${registration.allergies}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error reading registrations:', error.message);
  }
};

// Function to view contacts
const viewContacts = () => {
  try {
    const filePath = path.join(__dirname, 'data', 'contacts.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    console.log('\n📧 CONTACTS DATA');
    console.log('='.repeat(50));
    console.log(`Total Contacts: ${data.length}\n`);
    
    data.forEach((contact, index) => {
      console.log(`📋 Contact #${index + 1}`);
      console.log(`   ID: ${contact.id}`);
      console.log(`   Name: ${contact.name}`);
      console.log(`   Email: ${contact.email}`);
      console.log(`   Phone: ${contact.phone || 'Not provided'}`);
      console.log(`   Subject: ${contact.subjectDisplay || contact.subject}`);
      console.log(`   Status: ${contact.status}`);
      console.log(`   Created: ${contact.createdAt}`);
      console.log(`   Message: ${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error reading contacts:', error.message);
  }
};

// Main function
const main = () => {
  const args = process.argv.slice(2);
  
  if (args.includes('--contacts') || args.includes('-c')) {
    viewContacts();
  } else if (args.includes('--all') || args.includes('-a')) {
    viewRegistrations();
    viewContacts();
  } else {
    viewRegistrations();
  }
};

main();
