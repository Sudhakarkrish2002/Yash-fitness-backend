require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Email Configuration
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    service: 'gmail'
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  },
  
  // JWT Configuration (for future use)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h'
  },
  
  // Validation
  validation: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif']
  }
};

// Validate required environment variables
const validateConfig = () => {
  const required = ['EMAIL_USER', 'EMAIL_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '));
    console.warn('📧 Email notifications will be disabled');
    config.email.enabled = false;
  }
  
  return config;
};

module.exports = validateConfig();
