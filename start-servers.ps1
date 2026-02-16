#!/usr/bin/env powershell
# Bellcorp Event Management - Quick Start Script for Windows
# This script automatically starts both the backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Bellcorp Event Management - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist in server
if (!(Test-Path "server/node_modules")) {
    Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
    cd server
    npm install
    cd ..
}

# Check if node_modules exist in client
if (!(Test-Path "client/bellcorp-client/node_modules")) {
    Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
    cd client/bellcorp-client
    npm install
    cd ../..
}

Write-Host ""
Write-Host "✅ Dependencies ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Starting servers..." -ForegroundColor Cyan
Write-Host ""

# Change to server directory and start backend
Write-Host "🚀 Backend server starting on http://localhost:5000" -ForegroundColor Green
Write-Host ""

# Start backend in new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend in new terminal
Write-Host "🚀 Frontend server starting on http://localhost:3000" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client\bellcorp-client'; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "  - README.md - Setup and usage guide" -ForegroundColor Gray
Write-Host "  - API_TESTING.md - Complete API testing guide" -ForegroundColor Gray
Write-Host "  - IMPLEMENTATION.md - Implementation details" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tip: Both servers will open in separate terminal windows." -ForegroundColor Cyan
Write-Host ""
