const mongoose = require('mongoose');

// Connect to the database
const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then(conn => {
    console.log(`Database connectid ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
