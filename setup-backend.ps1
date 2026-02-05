#!/usr/bin/env pwsh
# ResQTech Docker & Database Setup Script for Windows
# This script automates the setup of PostgreSQL via Docker and Prisma migrations

param(
    [ValidateSet('check', 'start', 'migrate', 'seed', 'full', 'stop', 'restart')]
    [string]$Action = 'check'
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ServerDir = Join-Path $ProjectRoot 'server'
$EnvFile = Join-Path $ServerDir '.env'

Write-Host "🚀 ResQTech Backend Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if Docker is installed
function Test-Docker {
    try {
        $version = docker --version 2>$null
        Write-Host "✅ Docker found: $version" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Docker not found. Please install Docker Desktop for Windows:" -ForegroundColor Red
        Write-Host "   https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        return $false
    }
}

# Function to check if Docker daemon is running
function Test-DockerRunning {
    try {
        docker ps >$null 2>&1
        return $true
    } catch {
        Write-Host "❌ Docker daemon is not running. Please start Docker Desktop." -ForegroundColor Red
        return $false
    }
}

# Function to create .env file
function Create-EnvFile {
    if (-not (Test-Path $EnvFile)) {
        Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
        $EnvContent = @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resqtech_db"
PORT=4000
NODE_ENV=development
"@
        $EnvContent | Out-File -Encoding UTF8 $EnvFile
        Write-Host "✅ .env file created at $EnvFile" -ForegroundColor Green
    } else {
        Write-Host "✅ .env file already exists" -ForegroundColor Green
    }
}

# Function to start Docker containers
function Start-Containers {
    Write-Host "🐳 Starting Docker containers..." -ForegroundColor Yellow
    
    Push-Location $ProjectRoot
    try {
        docker compose up -d
        
        # Wait for PostgreSQL to be ready
        Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
        $attempts = 0
        $maxAttempts = 30
        
        while ($attempts -lt $maxAttempts) {
            try {
                docker exec $(docker compose ps -q db) pg_isready -U postgres >$null 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green
                    break
                }
            } catch { }
            
            $attempts++
            Start-Sleep -Seconds 1
            Write-Host "  Attempt $attempts/$maxAttempts..." -ForegroundColor Gray
        }
        
        if ($attempts -ge $maxAttempts) {
            Write-Host "⚠️  PostgreSQL may not be fully ready. Continuing anyway..." -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "📊 Running containers:" -ForegroundColor Yellow
        docker compose ps
        
        Write-Host ""
        Write-Host "Access points:" -ForegroundColor Cyan
        Write-Host "  PostgreSQL: localhost:5432 (postgres:postgres)" -ForegroundColor Gray
        Write-Host "  pgAdmin:    http://localhost:8080 (admin@example.com:admin)" -ForegroundColor Gray
        
    } finally {
        Pop-Location
    }
}

# Function to run Prisma migrations
function Run-Migrations {
    Write-Host "📦 Running Prisma migrations..." -ForegroundColor Yellow
    
    Push-Location $ServerDir
    try {
        npm run prisma:generate
        Write-Host ""
        npm run prisma:migrate -- --name "init"
        Write-Host "✅ Migrations completed!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Migration failed: $_" -ForegroundColor Red
        return $false
    } finally {
        Pop-Location
    }
    return $true
}

# Function to seed database
function Seed-Database {
    Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
    
    Push-Location $ServerDir
    try {
        npm run seed
        Write-Host "✅ Database seeded!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Seeding failed: $_" -ForegroundColor Yellow
    } finally {
        Pop-Location
    }
}

# Function to stop containers
function Stop-Containers {
    Write-Host "🛑 Stopping Docker containers..." -ForegroundColor Yellow
    
    Push-Location $ProjectRoot
    try {
        docker compose down
        Write-Host "✅ Containers stopped" -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

# Function to restart containers
function Restart-Containers {
    Write-Host "🔄 Restarting Docker containers..." -ForegroundColor Yellow
    Stop-Containers
    Write-Host ""
    Start-Containers
}

# Main action dispatcher
switch ($Action) {
    'check' {
        Write-Host "🔍 Checking prerequisites..." -ForegroundColor Cyan
        Write-Host ""
        
        $dockerOk = Test-Docker
        Write-Host ""
        
        if ($dockerOk) {
            if (Test-DockerRunning) {
                Write-Host "✅ All prerequisites met!" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Docker daemon needs to be started" -ForegroundColor Yellow
            }
        }
    }
    
    'start' {
        Write-Host "▶️  Starting backend environment..." -ForegroundColor Cyan
        Write-Host ""
        
        if (-not (Test-Docker)) { exit 1 }
        if (-not (Test-DockerRunning)) {
            Write-Host "Please start Docker Desktop" -ForegroundColor Red
            exit 1
        }
        
        Create-EnvFile
        Write-Host ""
        Start-Containers
    }
    
    'migrate' {
        Write-Host "🔄 Running migrations..." -ForegroundColor Cyan
        Write-Host ""
        
        Run-Migrations
    }
    
    'seed' {
        Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
        Write-Host ""
        
        Seed-Database
    }
    
    'full' {
        Write-Host "⚡ Full setup (start + migrate + seed)..." -ForegroundColor Cyan
        Write-Host ""
        
        if (-not (Test-Docker)) { exit 1 }
        if (-not (Test-DockerRunning)) {
            Write-Host "Please start Docker Desktop" -ForegroundColor Red
            exit 1
        }
        
        Create-EnvFile
        Write-Host ""
        Start-Containers
        Write-Host ""
        
        if (Run-Migrations) {
            Write-Host ""
            Seed-Database
            
            Write-Host ""
            Write-Host "🎉 Full setup complete!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "  1. Start backend server:  cd server && npm run dev" -ForegroundColor Gray
            Write-Host "  2. Start frontend:       npm run dev" -ForegroundColor Gray
            Write-Host "  3. Open browser:         http://localhost:5173" -ForegroundColor Gray
        }
    }
    
    'stop' {
        Write-Host "🛑 Stopping backend environment..." -ForegroundColor Cyan
        Write-Host ""
        Stop-Containers
    }
    
    'restart' {
        Write-Host "🔄 Restarting backend environment..." -ForegroundColor Cyan
        Write-Host ""
        Restart-Containers
    }
}

Write-Host ""
