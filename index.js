const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const { initializeExcelFiles } = require('./utils/excelStorage');

const app = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Excel storage
initializeExcelFiles();
console.log('✅ Excel storage initialized');

// Import routes
const registrationRoutes = require('./routes/registration');
const contactRoutes = require('./routes/contact');
const exportRoutes = require('./routes/export');
const adminRoutes = require('./routes/admin');

// Routes
app.use('/api/registration', registrationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Yash Fitness Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'The requested endpoint does not exist' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Yash Fitness Server running on port ${PORT}`);
  console.log(`📊 Excel storage: Initialized`);
  console.log(`📧 Email notifications: ${config.email.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`🌐 CORS Origin: ${config.cors.origin}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
}); 