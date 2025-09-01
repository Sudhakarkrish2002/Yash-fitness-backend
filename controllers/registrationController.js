const nodemailer = require('nodemailer');
const config = require('../config/config');
const { exportRegistrationsToExcel } = require('../utils/excelExport');
const { registrationStorage } = require('../utils/excelStorage');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: config.email.service,
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });
};

// Send email notification to admin
const sendAdminNotification = async (registrationData) => {
  try {
    if (!config.email.enabled) {
      console.log('📧 Email notifications disabled');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.email.user,
      to: config.email.adminEmail,
      subject: '🎯 New Gym Membership Registration - Yash Fitness',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff00; text-align: center;">New Membership Registration</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">👤 Personal Information</h3>
            <p><strong>Name:</strong> ${registrationData.firstName} ${registrationData.lastName}</p>
            <p><strong>Email:</strong> ${registrationData.email}</p>
            <p><strong>Phone:</strong> ${registrationData.phone}</p>
            <p><strong>Date of Birth:</strong> ${new Date(registrationData.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> ${registrationData.gender}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">📍 Address</h3>
            <p><strong>Address:</strong> ${registrationData.address}</p>
            <p><strong>City:</strong> ${registrationData.city}</p>
            <p><strong>State:</strong> ${registrationData.state}</p>
            <p><strong>Pincode:</strong> ${registrationData.pincode}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">🚨 Emergency Contact</h3>
            <p><strong>Name:</strong> ${registrationData.emergencyName}</p>
            <p><strong>Phone:</strong> ${registrationData.emergencyPhone}</p>
            <p><strong>Relationship:</strong> ${registrationData.emergencyRelation}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">💪 Fitness Information</h3>
            <p><strong>Height:</strong> ${registrationData.height} cm</p>
            <p><strong>Weight:</strong> ${registrationData.weight} kg</p>
            <p><strong>Blood Group:</strong> ${registrationData.bloodGroup || 'Not specified'}</p>
            <p><strong>Fitness Goals:</strong> ${registrationData.fitnessGoals}</p>
            <p><strong>Experience Level:</strong> ${registrationData.experienceLevel}</p>
            <p><strong>Preferred Time:</strong> ${registrationData.preferredTime}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">💳 Membership Details</h3>
            <p><strong>Plan:</strong> ${registrationData.membershipPlan}</p>
            <p><strong>Start Date:</strong> ${new Date(registrationData.startDate).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${registrationData.paymentMethod}</p>
          </div>

          ${registrationData.medicalConditions ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #856404;">⚠️ Medical Information</h3>
            <p><strong>Medical Conditions:</strong> ${registrationData.medicalConditions}</p>
            <p><strong>Medications:</strong> ${registrationData.medications || 'None'}</p>
            <p><strong>Allergies:</strong> ${registrationData.allergies || 'None'}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Registration submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Admin notification email sent successfully');
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
  }
};

// Send confirmation email to user
const sendUserConfirmation = async (registrationData) => {
  try {
    if (!config.email.enabled) {
      console.log('📧 Email notifications disabled');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.email.user,
      to: registrationData.email,
      subject: '✅ Registration Confirmation - Yash Fitness & Gym',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff00; text-align: center;">Registration Confirmed!</h2>
          
          <p>Dear ${registrationData.firstName},</p>
          
          <p>Thank you for registering with <strong>Yash Fitness & Gym</strong>! We have received your membership application and are excited to have you join our fitness community.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">📋 Registration Summary</h3>
            <p><strong>Name:</strong> ${registrationData.firstName} ${registrationData.lastName}</p>
            <p><strong>Membership Plan:</strong> ${registrationData.membershipPlan}</p>
            <p><strong>Start Date:</strong> ${new Date(registrationData.startDate).toLocaleDateString()}</p>
            <p><strong>Fitness Goals:</strong> ${registrationData.fitnessGoals}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2d5a2d;">📞 Next Steps</h3>
            <p>Our team will review your application and contact you within 24-48 hours to:</p>
            <ul>
              <li>Confirm your membership details</li>
              <li>Schedule your orientation session</li>
              <li>Complete the payment process</li>
              <li>Provide your membership card</li>
            </ul>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #856404;">📍 Gym Location</h3>
            <p><strong>Yash Fitness & Gym</strong></p>
            <p>Trichy, Tamil Nadu</p>
            <p>Contact: +91 XXXXXXXXXX</p>
          </div>

          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          <strong>Team Yash Fitness & Gym</strong></p>
          
          <div style="text-align: center; margin-top: 30px; color: #666;">
            <p>Registration submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 User confirmation email sent successfully');
  } catch (error) {
    console.error('❌ Error sending user confirmation email:', error);
  }
};

// Submit registration
const submitRegistration = async (req, res) => {
  try {
    const registrationData = req.body;

    // Save to Excel file
    const registration = registrationStorage.add(registrationData);

    // Send email notifications
    await sendAdminNotification(registrationData);
    await sendUserConfirmation(registrationData);

    console.log('✅ New registration saved to Excel:', registration.id);

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully! We will contact you soon.',
      data: {
        id: registration.id,
        memberId: registration.memberId,
        fullName: `${registration.firstName} ${registration.lastName}`,
        email: registration.email,
        membershipPlan: registration.membershipPlan
      }
    });

  } catch (error) {
    console.error('❌ Registration submission error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get all registrations (admin only)
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = registrationStorage.getAll()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('❌ Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations'
    });
  }
};

// Get registration by ID
const getRegistrationById = async (req, res) => {
  try {
    const registration = registrationStorage.getById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('❌ Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration'
    });
  }
};

// Update registration status
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const registration = registrationStorage.update(req.params.id, { status, notes });

    res.status(200).json({
      success: true,
      message: 'Registration status updated successfully',
      data: registration
    });
  } catch (error) {
    console.error('❌ Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating registration'
    });
  }
};

// Export registrations to Excel
const exportRegistrationsToExcelController = async (req, res) => {
  try {
    const registrations = registrationStorage.getAll()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const result = await exportRegistrationsToExcel(registrations);

    res.status(200).json({
      success: true,
      message: 'Registrations exported successfully',
      data: {
        fileName: result.fileName,
        count: result.count,
        downloadUrl: `/api/registration/export/download/${result.fileName}`
      }
    });
  } catch (error) {
    console.error('❌ Error exporting registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting registrations to Excel'
    });
  }
};

module.exports = {
  submitRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  exportRegistrationsToExcel: exportRegistrationsToExcelController
}; 