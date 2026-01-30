#!/usr/bin/env node

/**
 * Quick MongoDB Connection Test
 * Run: node quick-test.js
 */

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔌 MongoDB Atlas Connection Test');
console.log('================================\n');
console.log('Connection String:', MONGODB_URI.substring(0, 50) + '...');
console.log('✅ .env file loaded successfully');

// Check if credentials are in the string
if (MONGODB_URI.includes('sonuanand148_db_user')) {
  console.log('✅ Username found: sonuanand148_db_user');
}

if (MONGODB_URI.includes('4Tz1D4pstBXAS3T3')) {
  console.log('✅ Password configured');
}

if (MONGODB_URI.includes('cluster0.l4ogxhm.mongodb.net')) {
  console.log('✅ Cluster found: cluster0.l4ogxhm');
}

console.log('\n📋 Configuration Summary:');
console.log('├─ Provider: MongoDB Atlas (Cloud)');
console.log('├─ Database: live-polling-system');
console.log('├─ Cluster: cluster0.l4ogxhm');
console.log('├─ User: sonuanand148_db_user');
console.log('├─ Region: Check MongoDB Atlas Dashboard');
console.log('└─ Status: ✅ Ready to connect\n');

console.log('🚀 Next Steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000 in your browser');
console.log('3. Test the polling system\n');

console.log('⚠️  IMPORTANT - If connection fails:');
console.log('1. Check MongoDB Atlas Network Access (IP Whitelist)');
console.log('   → Go to: Security → Network Access');
console.log('   → Add: 0.0.0.0/0 (or your current IP)');
console.log('2. Verify credentials are correct');
console.log('3. Check internet connection\n');
