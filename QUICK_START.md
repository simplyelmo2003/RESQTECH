# Quick Start Guide - Backend-Authoritative Setup

## For Immediate Use (Today)

### 1️⃣ Install Docker Desktop (One-time)
- Download: https://www.docker.com/products/docker-desktop
- Install and start it
- Verify in PowerShell: `docker --version`

### 2️⃣ Run Full Setup (One-time)
```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy"
.\setup-backend.ps1 -Action full
```

This will:
- ✅ Start PostgreSQL container
- ✅ Create backend .env file
- ✅ Run Prisma migrations
- ✅ Seed initial data

**Time:** ~2-3 minutes first run

### 3️⃣ Daily Startup (Every Development Session)

**Terminal 1 - Start Backend:**
```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy\server"
npm run dev
# Output: Server running on port 4000
```

**Terminal 2 - Start Frontend:**
```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy"
npm run dev
# Output: Local: http://localhost:5173
```

Open browser → http://localhost:5173

## Helpful Commands

```powershell
# Check if everything is running
docker ps

# View backend logs
docker logs $(docker compose ps -q db)

# Stop everything
.\setup-backend.ps1 -Action stop

# Restart everything
.\setup-backend.ps1 -Action restart

# Reset database (careful!)
docker compose down -v
.\setup-backend.ps1 -Action start

# Run migrations manually
cd server
npm run prisma:migrate

# Seed database manually
cd server
npm run seed
```

## Access Points

| Component | URL/Command | Credentials |
|-----------|-------------|-------------|
| Frontend | http://localhost:5173 | None |
| Backend Health | http://localhost:4000/api/health | None |
| pgAdmin | http://localhost:8080 | admin@example.com / admin |
| PostgreSQL | localhost:5432 | postgres / postgres |

## Current State

✅ **Frontend:**
- All 8 shared stores are async + backend-authoritative
- No localStorage at all
- TypeScript: 0 errors

✅ **Backend:**
- Express server ready
- Prisma ORM configured
- Database schema defined
- Auto-retry connection logic
- Health check endpoint

✅ **Documentation:**
- `DOCKER_SETUP_GUIDE.md` - Detailed setup guide
- `BACKEND_SETUP_STATUS.md` - Full status + architecture
- `setup-backend.ps1` - Automated setup script

⏳ **Next:** JWT Authentication (task #7)

## Important Notes

### Data Flow
```
Frontend Component
    ↓
async store function (throws on error)
    ↓
apiPost/Get/Put/Delete (checks backend health)
    ↓
Express API endpoint
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

### Key Changes
- ❌ **No localStorage** - removed completely
- ❌ **No offline mode** - backend required for all operations
- ✅ **Async everywhere** - all store operations async
- ✅ **Fail loudly** - errors bubble up to components
- ✅ **Type safe** - full TypeScript support

### Files to Monitor
- Frontend stores: `src/api/shared-*.ts` (all async)
- Backend: `server/src/index.ts` (Express routes)
- Database: `server/prisma/schema.prisma` (models)
- Config: `server/.env` (database connection)

## First Time Checklist

- [ ] Docker Desktop installed and running
- [ ] `.\setup-backend.ps1 -Action full` completed successfully
- [ ] Backend terminal shows "Server running on port 4000"
- [ ] Frontend terminal shows "Local: http://localhost:5173"
- [ ] Browser opens to frontend at http://localhost:5173
- [ ] Test health endpoint: http://localhost:4000/api/health → `{"status":"ok","db":"ok"}`

## Troubleshooting

**"Port 5432 already in use"**
```powershell
# Kill PostgreSQL if running elsewhere
taskkill /IM postgres.exe /F
# Or change port in docker-compose.yml
```

**"Cannot connect to Docker daemon"**
- Start Docker Desktop application
- Wait 30 seconds for it to initialize

**"npm ERR! missing script"**
- Ensure you're in the correct directory
- `cd server` for backend commands
- `cd "C:\Users\auren\OneDrive\Pictures\brgy"` for frontend

**Components showing "Backend unavailable"**
- Check: `docker ps` (is db running?)
- Check: `docker logs <db-container-id>`
- Restart: `.\setup-backend.ps1 -Action restart`

## Performance Notes

- First migration: ~30 seconds
- Subsequent startups: ~5 seconds
- No cache warmup needed (all backend-driven)
- Health check timeout: 2 seconds

---

**Status:** ✅ Ready for development  
**Last Updated:** 2025-11-17  
**Next Phase:** JWT Authentication
