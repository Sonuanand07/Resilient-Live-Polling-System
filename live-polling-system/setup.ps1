#!/usr/bin/env pwsh
<#
  Complete Setup and Testing Script
  Run this to set up and test the entire project
#>

Write-Host "🚀 Live Polling System - Complete Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Colors for output
$Success = "Green"
$Error = "Red"
$Info = "Cyan"
$Warning = "Yellow"

# Test 1: Check Node.js installation
Write-Host "1️⃣  Checking Node.js installation..." -ForegroundColor $Info
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor $Success
Write-Host "   ✅ npm: $npmVersion" -ForegroundColor $Success
Write-Host ""

# Test 2: Check backend dependencies
Write-Host "2️⃣  Checking Backend Setup..." -ForegroundColor $Info
cd "D:\Intervue.io Project\live-polling-system\backend"
Write-Host "   📍 Location: $(Get-Location)" -ForegroundColor $Info

if (Test-Path "node_modules") {
  Write-Host "   ✅ Backend dependencies installed" -ForegroundColor $Success
} else {
  Write-Host "   ❌ Backend dependencies NOT installed" -ForegroundColor $Error
  Write-Host "   Running: npm install" -ForegroundColor $Warning
  npm install
}

Write-Host ""

# Test 3: Check .env file
Write-Host "3️⃣  Checking .env Configuration..." -ForegroundColor $Info
if (Test-Path ".env") {
  Write-Host "   ✅ .env file exists" -ForegroundColor $Success
  $mongoUri = (Get-Content .env | Select-String "MONGODB_URI")
  if ($mongoUri) {
    Write-Host "   ✅ MONGODB_URI configured" -ForegroundColor $Success
    Write-Host "      Connection: mongodb+srv://sonuanand148_db_user:***@cluster0.l4ogxhm.mongodb.net" -ForegroundColor $Info
  }
} else {
  Write-Host "   ❌ .env file NOT found" -ForegroundColor $Error
}
Write-Host ""

# Test 4: Check TypeScript compilation
Write-Host "4️⃣  Testing Backend TypeScript Compilation..." -ForegroundColor $Info
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
  Write-Host "   ✅ Backend compiles without errors" -ForegroundColor $Success
} else {
  Write-Host "   ❌ Backend has compilation errors" -ForegroundColor $Error
}
Write-Host ""

# Test 5: Check frontend
Write-Host "5️⃣  Checking Frontend Setup..." -ForegroundColor $Info
cd "D:\Intervue.io Project\live-polling-system\frontend"
Write-Host "   📍 Location: $(Get-Location)" -ForegroundColor $Info

if (Test-Path "node_modules") {
  Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor $Success
} else {
  Write-Host "   ❌ Frontend dependencies NOT installed" -ForegroundColor $Error
  Write-Host "   Running: npm install" -ForegroundColor $Warning
  npm install
}

if (Test-Path ".env.local") {
  Write-Host "   ✅ .env.local configured" -ForegroundColor $Success
}
Write-Host ""

# Test 6: Check frontend files
Write-Host "6️⃣  Checking Frontend Files..." -ForegroundColor $Info
$requiredFiles = @(
  "src/App.tsx",
  "src/index.tsx",
  "src/components/RoleSelection.tsx",
  "src/components/TeacherView.tsx",
  "src/components/StudentView.tsx",
  "src/hooks/useSocket.ts",
  "src/hooks/usePollTimer.ts",
  "src/hooks/usePoll.ts"
)

foreach ($file in $requiredFiles) {
  if (Test-Path $file) {
    Write-Host "   ✅ $file" -ForegroundColor $Success
  } else {
    Write-Host "   ❌ $file NOT FOUND" -ForegroundColor $Error
  }
}
Write-Host ""

# Test 7: Summary and next steps
Write-Host "=" -ForegroundColor Cyan
Write-Host "📋 SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ What to do next:" -ForegroundColor $Success
Write-Host ""
Write-Host "1. Open TWO PowerShell terminals" -ForegroundColor $Info
Write-Host ""
Write-Host "   Terminal 1 - Start Backend:" -ForegroundColor $Warning
Write-Host "   cd 'D:\Intervue.io Project\live-polling-system\backend'" -ForegroundColor $Info
Write-Host "   npm run dev" -ForegroundColor $Info
Write-Host ""
Write-Host "   Expected output:" -ForegroundColor $Info
Write-Host "   🚀 Server running on http://localhost:5000" -ForegroundColor $Success
Write-Host "   ✅ MongoDB connected to live-polling-system" -ForegroundColor $Success
Write-Host ""
Write-Host "   Terminal 2 - Start Frontend:" -ForegroundColor $Warning
Write-Host "   cd 'D:\Intervue.io Project\live-polling-system\frontend'" -ForegroundColor $Info
Write-Host "   npm start" -ForegroundColor $Info
Write-Host ""
Write-Host "   Expected output:" -ForegroundColor $Info
Write-Host "   webpack compiled" -ForegroundColor $Success
Write-Host "   Compiled successfully!" -ForegroundColor $Success
Write-Host ""
Write-Host "2. Open your browser and go to: http://localhost:3000" -ForegroundColor $Info
Write-Host ""
Write-Host "3. Test the application:" -ForegroundColor $Info
Write-Host "   - Click 'I'm a Teacher' or 'I'm a Student'" -ForegroundColor $Info
Write-Host "   - Create/answer a poll" -ForegroundColor $Info
Write-Host "   - Verify real-time updates" -ForegroundColor $Info
Write-Host ""
Write-Host "⚠️  If Backend Connection Fails:" -ForegroundColor $Warning
Write-Host ""
Write-Host "   MongoDB Atlas Network Access Issue!" -ForegroundColor $Error
Write-Host ""
Write-Host "   FIX:" -ForegroundColor $Warning
Write-Host "   1. Go to: https://cloud.mongodb.com" -ForegroundColor $Info
Write-Host "   2. Click: Security → Network Access" -ForegroundColor $Info
Write-Host "   3. Click: Add IP Address" -ForegroundColor $Info
Write-Host "   4. Choose: Allow Access from Anywhere (0.0.0.0/0)" -ForegroundColor $Info
Write-Host "   5. Click: Confirm" -ForegroundColor $Info
Write-Host "   6. Try again: npm run dev" -ForegroundColor $Info
Write-Host ""
Write-Host "🎉 You're ready to go!" -ForegroundColor Cyan
Write-Host ""
