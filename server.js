/* eslint-disable no-undef */
const path = require('path');
// 1. Import external libraries
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

// 2. Configure environment variables
dotenv.config({ path: 'config.env' });

// 3. Import internal project files
const dbConnection = require('./config/database');
const ApiError = require('./utils/ApiError');
const globalMiddleware = require('./middlewares/globalMiddleware');

// 4. Import routes
const mountRoute = require('./routes');

//  Create Express application
const app = express();
// compress all responses
app.use(compression());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.options('*', cors());

// Additional code for setting up routes and middleware can be added here...

// Connect to MongoDB
dbConnection();
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(process.env.NODE_ENV);
}

// Mount routes
mountRoute(app);

app.use('*', (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

// Error Handling Middleware
app.use(globalMiddleware);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

// Error Handling Middleware
process.on('uncaughtException', err => {
  console.error(`uncaughtException Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error('shiting down...');
    process.exit(1);
  });
});
