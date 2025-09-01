const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },

  // Address Information
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
    match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
  },

  // Emergency Contact
  emergencyName: {
    type: String,
    required: [true, 'Emergency contact name is required'],
    trim: true,
    maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
  },
  emergencyPhone: {
    type: String,
    required: [true, 'Emergency contact phone is required'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  emergencyRelation: {
    type: String,
    required: [true, 'Emergency contact relationship is required'],
    enum: ['spouse', 'parent', 'sibling', 'friend', 'other']
  },

  // Health Information
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [100, 'Height must be at least 100 cm'],
    max: [250, 'Height cannot exceed 250 cm']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [30, 'Weight must be at least 30 kg'],
    max: [300, 'Weight cannot exceed 300 kg']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
    default: ''
  },
  medicalConditions: {
    type: String,
    trim: true,
    maxlength: [500, 'Medical conditions cannot exceed 500 characters']
  },
  medications: {
    type: String,
    trim: true,
    maxlength: [500, 'Medications cannot exceed 500 characters']
  },
  allergies: {
    type: String,
    trim: true,
    maxlength: [500, 'Allergies cannot exceed 500 characters']
  },

  // Fitness Information
  fitnessGoals: {
    type: String,
    required: [true, 'Fitness goals are required'],
    enum: ['weight-loss', 'muscle-gain', 'strength-training', 'cardio-fitness', 'flexibility', 'general-fitness']
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required'],
    enum: ['morning', 'afternoon', 'evening', 'night']
  },

  // Membership Details
  membershipPlan: {
    type: String,
    required: [true, 'Membership plan is required'],
    enum: ['1-month', '3-months', '1-year']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['cash', 'card', 'upi', 'bank-transfer']
  },

  // Additional Information
  howDidYouHear: {
    type: String,
    enum: ['social-media', 'friend-recommendation', 'online-search', 'walk-in', 'advertisement', 'other', '']
  },
  specialRequirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Special requirements cannot exceed 1000 characters']
  },

  // System Fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
registrationSchema.index({ email: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ registrationDate: -1 });

// Virtual for full name
registrationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
registrationSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for BMI calculation
registrationSchema.virtual('bmi').get(function() {
  if (!this.height || !this.weight) return null;
  const heightInMeters = this.height / 100;
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Ensure virtual fields are serialized
registrationSchema.set('toJSON', { virtuals: true });
registrationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Registration', registrationSchema); 