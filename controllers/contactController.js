const nodemailer = require('nodemailer');
const config = require('../config/config');
const { exportContactsToExcel } = require('../utils/excelExport');
const { contactStorage } = require('../utils/excelStorage');

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
const sendAdminNotification = async (contactData) => {
  try {
    if (!config.email.enabled) {
      console.log('📧 Email notifications disabled');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.email.user,
      to: config.email.adminEmail,
      subject: `📧 New Contact Form Submission - ${contactData.subjectDisplay}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff00; text-align: center;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">👤 Contact Information</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${contactData.subjectDisplay}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">💬 Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2d5a2d;">📞 Quick Actions</h3>
            <p><strong>Reply to:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            ${contactData.phone ? `<p><strong>Call:</strong> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>` : ''}
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Contact form submitted on: ${new Date().toLocaleString()}</p>
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
const sendUserConfirmation = async (contactData) => {
  try {
    if (!config.email.enabled) {
      console.log('📧 Email notifications disabled');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.email.user,
      to: contactData.email,
      subject: '✅ Message Received - Yash Fitness & Gym',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff00; text-align: center;">Message Received!</h2>
          
          <p>Dear ${contactData.name},</p>
          
          <p>Thank you for contacting <strong>Yash Fitness & Gym</strong>! We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333;">📋 Message Summary</h3>
            <p><strong>Subject:</strong> ${contactData.subjectDisplay}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2d5a2d;">📞 What's Next?</h3>
            <p>Our team will review your inquiry and respond within 24-48 hours. For urgent matters, you can also reach us directly:</p>
            <ul>
              <li><strong>Phone:</strong> +91 98765 43210</li>
              <li><strong>WhatsApp:</strong> +91 98765 43210</li>
              <li><strong>Email:</strong> info@yashfitness.com</li>
            </ul>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #856404;">📍 Visit Us</h3>
            <p><strong>Yash Fitness & Gym</strong></p>
            <p>First Floor, Calpurnia Towers</p>
            <p>Shanmuga Nagar, Tiruchirappalli</p>
            <p>Sholanganallur, Tamil Nadu 620102</p>
          </div>

          <p>We look forward to helping you with your fitness goals!</p>
          
          <p>Best regards,<br>
          <strong>Team Yash Fitness & Gym</strong></p>
          
          <div style="text-align: center; margin-top: 30px; color: #666;">
            <p>Message submitted on: ${new Date().toLocaleString()}</p>
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

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const contactData = req.body;
    
    // Add IP address and user agent for tracking
    contactData.ipAddress = req.ip || req.connection.remoteAddress;
    contactData.userAgent = req.get('User-Agent');

    // Save to Excel file
    const contact = contactStorage.add(contactData);

    // Send email notifications
    await sendAdminNotification(contactData);
    await sendUserConfirmation(contactData);

    console.log('✅ New contact submission saved to Excel:', contact.id);

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subjectDisplay || contact.subject
      }
    });

  } catch (error) {
    console.error('❌ Contact submission error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get all contact submissions (admin only)
const getAllContacts = async (req, res) => {
  try {
    const contacts = contactStorage.getAll()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
};

// Get contact by ID
const getContactById = async (req, res) => {
  try {
    const contact = contactStorage.getById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact'
    });
  }
};

// Update contact status
const updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const contact = contactStorage.update(req.params.id, { status, adminNotes });

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('❌ Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact'
    });
  }
};

// Get contact statistics
const getContactStats = async (req, res) => {
  try {
    const stats = contactStorage.getStats();
    const contacts = contactStorage.getAll();
    const newContacts = contacts.filter(contact => contact.status === 'new').length;

    res.status(200).json({
      success: true,
      data: {
        total: stats.total,
        new: newContacts,
        byStatus: Object.entries(stats.byStatus).map(([status, count]) => ({ _id: status, count }))
      }
    });
  } catch (error) {
    console.error('❌ Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics'
    });
  }
};

// Export contacts to Excel
const exportContactsToExcelController = async (req, res) => {
  try {
    const contacts = contactStorage.getAll()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const result = await exportContactsToExcel(contacts);

    res.status(200).json({
      success: true,
      message: 'Contacts exported successfully',
      data: {
        fileName: result.fileName,
        count: result.count,
        downloadUrl: `/api/contact/export/download/${result.fileName}`
      }
    });
  } catch (error) {
    console.error('❌ Error exporting contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting contacts to Excel'
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  getContactStats,
  exportContactsToExcel: exportContactsToExcelController
}; 