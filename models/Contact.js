const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['membership', 'personal-training', 'group-classes', 'nutrition', 'general']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  
  // System Fields
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });

// Virtual for subject display
contactSchema.virtual('subjectDisplay').get(function() {
  const subjects = {
    'membership': 'Membership Inquiry',
    'personal-training': 'Personal Training',
    'group-classes': 'Group Classes',
    'nutrition': 'Nutrition Consultation',
    'general': 'General Inquiry'
  };
  return subjects[this.subject] || this.subject;
});

// Ensure virtual fields are serialized
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Contact', contactSchema); 