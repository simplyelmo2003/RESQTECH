# Docker & PostgreSQL Setup Guide for ResQTech Backend

## Prerequisites

Your backend is now fully backend-authoritative and requires a running PostgreSQL database with Prisma migrations. This guide will help you set up the database environment.

### Step 1: Install Docker Desktop for Windows

Docker is not currently installed on your system. Follow these steps:

1. **Download Docker Desktop for Windows:**
   - Visit: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - Choose the appropriate version for your system (Intel/AMD or ARM64)

2. **Install Docker Desktop:**
   - Run the installer
   - Follow the installation wizard
   - Enable "Use WSL 2 based engine" (recommended for Windows)
   - Complete the installation and restart your computer if prompted

3. **Verify Installation:**
   ```powershell
   docker --version
   docker compose version
   ```

### Step 2: Start PostgreSQL Container

Once Docker is installed, navigate to your project directory and start the database:

```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy"

# Start PostgreSQL and pgAdmin containers in background
docker compose up -d
```

This will:
- Start PostgreSQL on port 5432 with credentials: `postgres:postgres`
- Start pgAdmin on port 8080 for database management
- Create persistent storage in `db-data` volume

### Step 3: Create `.env` File for Backend

Create a `.env` file in the `server/` directory:

```powershell
# Navigate to server directory
cd server

# Create .env file with database URL
@"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resqtech_db"
PORT=4000
NODE_ENV=development
"@ | Out-File -Encoding UTF8 .env
```

### Step 4: Install Backend Dependencies

```powershell
# From server/ directory
npm install
```

### Step 5: Run Prisma Migrations

Generate Prisma client and run migrations:

```powershell
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database schema
npm run prisma:migrate
```

You'll be prompted to name the migration. Press Enter to accept the default "init" name.

### Step 6: Seed Database (Optional)

Populate initial data:

```powershell
npm run seed
```

### Step 7: Start Backend Server

```powershell
# From server/ directory
npm run dev
```

Expected output:
```
Server running on port 4000
✅ Database connected successfully
Health check endpoint: GET http://localhost:4000/api/health
```

### Step 8: Start Frontend Dev Server

In a new terminal:

```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy"
npm run dev
```

## Accessing the System

- **Frontend:** http://localhost:5173
- **Backend Health:** http://localhost:4000/api/health
- **pgAdmin:** http://localhost:8080 (admin@example.com / admin)
  - Add server connection:
    - Host: `db`
    - Username: `postgres`
    - Password: `postgres`
    - Database: `resqtech_db`

## Troubleshooting

### Port Already in Use

If port 5432 or 4000 is already in use:

```powershell
# Check what's using port 5432
netstat -ano | findstr :5432

# Check what's using port 4000
netstat -ano | findstr :4000

# Kill process by PID
taskkill /PID <PID> /F
```

### Docker Container Issues

```powershell
# View running containers
docker ps

# View logs
docker logs <container-id>

# Stop all containers
docker compose down

# Remove all containers and volumes
docker compose down -v

# Restart containers
docker compose up -d
```

### Database Connection Errors

Ensure the database is running:

```powershell
# Check if containers are running
docker ps

# Start containers if stopped
docker compose up -d

# Test connection from server directory
npx prisma db push
```

### Clear and Reset Database

```powershell
# From server/ directory
# Stop containers
docker compose down -v

# Start fresh
docker compose up -d

# Re-run migrations
npm run prisma:migrate

# Seed if needed
npm run seed
```

## Next Steps

Once Docker and PostgreSQL are running:

1. ✅ Backend-authoritative stores are ready to sync with the database
2. Frontend will call API endpoints (`/api/evac-centers`, `/api/messages`, `/api/news`, etc.)
3. Implement JWT authentication (task #7)
4. Test end-to-end data persistence and backend sync

## Environment Architecture

```
Frontend (React + TypeScript)
    ↓
API Layer (async store functions + apiPost/Get/Put/Delete)
    ↓
Backend (Express + Prisma)
    ↓
PostgreSQL Database (Docker)
```

All data now flows through the backend—no localStorage fallbacks!
