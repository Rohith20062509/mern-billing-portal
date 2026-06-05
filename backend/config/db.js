const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/billing-portal');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Please ensure MongoDB is running on your machine or update MONGO_URI in backend/.env');
    // Don't exit process, allow backend to start so developer can see UI and troubleshoot
  }
};

module.exports = connectDB;
