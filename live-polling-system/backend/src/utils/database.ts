export const connectDB = async () => {
  const mongoose = require('mongoose');

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/live-polling-system';

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  const mongoose = require('mongoose');

  try {
    await mongoose.connection.close();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ Failed to disconnect from MongoDB:', error);
  }
};
