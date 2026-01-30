// Quick MongoDB Atlas Connection Test
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔌 Testing MongoDB Atlas Connection...');
console.log('Connection String:', MONGODB_URI.replace(/:.*@/, ':****@')); // Hide password

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ MongoDB Atlas Connection Successful!');
    console.log('✅ Database: live-polling-system');
    console.log('✅ You can now run: npm run dev');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection Failed:', error.message);
    console.log('\n⚠️  Troubleshooting:');
    console.log('1. Check if MongoDB Atlas password is correct');
    console.log('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('   → Go to Security → Network Access → Add IP Address');
    console.log('3. Check internet connection');
    process.exit(1);
  });
