# XAMPP + MySQL Setup Guide for ResQTech Backend

Your backend is now configured to use **MySQL** instead of PostgreSQL. This guide walks you through setting up XAMPP with the ResQTech backend.

## Prerequisites

- XAMPP installed (with MySQL)
- Node.js installed
- Backend code ready (already converted to MySQL)

---

## Step-by-Step Setup

### Step 1: Install XAMPP (If Not Already Installed)

1. Download XAMPP: https://www.apachefriends.org/
2. Choose a version with **MySQL** included
3. Run the installer
4. Install to: `C:\xampp` (recommended)
5. Complete the installation

### Step 2: Start XAMPP Services

1. Open **XAMPP Control Panel** (from Start Menu or `C:\xampp\xampp-control.exe`)
2. Click **Start** for:
   - ✅ MySQL
   - ✅ Apache (optional - for phpmyadmin)

Wait for both services to show as **Running** (green indicator)

### Step 3: Create ResQTech Database

Open **phpMyAdmin** (comes with XAMPP):

**Option A: Via Web Browser**
1. Start Apache in XAMPP Control Panel
2. Go to: http://localhost/phpmyadmin
3. Click on **SQL** tab
4. Run this query:
   ```sql
   CREATE DATABASE resqtech_db;
   ```
5. Click **Go**

**Option B: Via Command Line**
```powershell
# Open MySQL command line
"C:\xampp\mysql\bin\mysql.exe" -u root

# Then run:
CREATE DATABASE resqtech_db;
EXIT;
```

### Step 4: Configure Backend `.env` File

Create or edit `server/.env`:

```powershell
# Navigate to server directory
cd "C:\Users\auren\OneDrive\Pictures\brgy\server"

# Create .env file
@"
DATABASE_URL="mysql://root:@localhost:3306/resqtech_db"
PORT=4000
NODE_ENV=development
"@ | Out-File -Encoding UTF8 .env
```

**If your MySQL has a password**, use:
```
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/resqtech_db"
```

### Step 5: Install Backend Dependencies

```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy\server"
npm install
```

### Step 6: Generate Prisma Client

```powershell
npm run prisma:generate
```

### Step 7: Create Database Tables (Migrations)

```powershell
npm run prisma:migrate
```

You'll be prompted:
```
Enter a name for the new migration: init
```

Press **Enter** to accept `init` as the name.

This creates all the tables in your MySQL database.

### Step 8: Seed Database (Optional - Adds Sample Data)

```powershell
npm run seed
```

This adds initial data for testing.

### Step 9: Start Backend Server

```powershell
npm run dev
```

Expected output:
```
Server running on port 4000
✅ Database connected successfully
```

### Step 10: Start Frontend (New Terminal)

```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy"
npm run dev
```

Open: http://localhost:5173

---

## 🎯 Accessing Your Database

### phpMyAdmin (Web Interface)
- URL: http://localhost/phpmyadmin
- Username: `root`
- Password: (leave blank if no password set)
- Database: `resqtech_db`

Browse tables, edit data, run queries visually.

### Command Line (MySQL CLI)
```powershell
"C:\xampp\mysql\bin\mysql.exe" -u root -D resqtech_db

# View all tables
SHOW TABLES;

# View users
SELECT * FROM User;

# View evacuation centers
SELECT * FROM EvacCenter;

# View messages
SELECT * FROM Message;

# Exit
EXIT;
```

### DBeaver (Recommended - Free Desktop App)
Better than phpMyAdmin for complex queries:

1. Download: https://dbeaver.io/
2. Install it
3. File → New Database Connection
4. Choose **MySQL**
5. Configure:
   - Server: `localhost`
   - Port: `3306`
   - Database: `resqtech_db`
   - Username: `root`
   - Password: (leave blank)
6. Click **Test Connection** → **OK**

Now you can browse/query your database in a professional UI.

---

## Daily Startup Routine

**Morning:** Start XAMPP
1. Open XAMPP Control Panel
2. Click **Start** next to MySQL
3. Wait for green indicator

**Start Backend**
```powershell
cd server
npm run dev
```

**Start Frontend** (new terminal)
```powershell
npm run dev
```

**Access Application**
- Frontend: http://localhost:5173
- Backend Health: http://localhost:4000/api/health
- Database Manager: http://localhost/phpmyadmin

---

## Troubleshooting

### "Port 3306 already in use"
MySQL is already running or another app is using the port.

```powershell
# Check what's using port 3306
netstat -ano | findstr :3306

# Kill the process
taskkill /PID <PID> /F
```

### "Can't connect to MySQL server"
MySQL service isn't running.

```powershell
# Start MySQL from XAMPP Control Panel or:
"C:\xampp\mysql\bin\mysqld.exe"
```

### "Unknown database 'resqtech_db'"
Database wasn't created. Go back to **Step 3** and create it.

### "Connection refused" on backend
Backend can't reach MySQL. Check:
1. Is MySQL running? (XAMPP Control Panel)
2. Is `.env` file in `server/` directory?
3. Is DATABASE_URL correct?

```powershell
# From server directory, test connection:
npx prisma db push
```

### Migrations failed
Database might be corrupted. Reset it:

```powershell
# From server directory
# Drop and recreate the database in phpMyAdmin first, then:
npm run prisma:migrate -- --force
npm run seed
```

---

## File Locations

**XAMPP:**
- Control Panel: `C:\xampp\xampp-control.exe`
- MySQL: `C:\xampp\mysql\bin\`
- phpMyAdmin: `C:\xampp\htdocs\phpmyadmin`

**ResQTech Backend:**
- Config: `server/.env`
- Database Schema: `server/prisma/schema.prisma`
- Migrations: `server/prisma/migrations/`

**Backend Database URLs:**
- No password: `mysql://root:@localhost:3306/resqtech_db`
- With password: `mysql://root:PASSWORD@localhost:3306/resqtech_db`

---

## Database Tables

Your MySQL database includes these tables:

| Table | Purpose |
|-------|---------|
| User | System users (admin, barangay officials) |
| Barangay | Barangay information |
| EvacCenter | Evacuation center data |
| Message | Chat messages |
| IncidentReport | Disaster incident reports |
| Alert | Emergency alerts |
| LogEntry | System audit logs |
| News | News and videos |
| Contact | Emergency contacts |

---

## Next Steps

1. ✅ XAMPP + MySQL running
2. ✅ Backend connected to database
3. ✅ Frontend accessing backend
4. Next: Implement JWT authentication (Task #7)

---

## Quick Commands Reference

```powershell
# Start backend
cd server && npm run dev

# Start frontend
npm run dev

# Generate Prisma client
npm run prisma:generate

# Create/update database tables
npm run prisma:migrate

# Add sample data
npm run seed

# Reset database (caution!)
npm run prisma:migrate -- --force

# View database via command line
"C:\xampp\mysql\bin\mysql.exe" -u root -D resqtech_db
```

---

**Status:** ✅ Ready for XAMPP + MySQL setup  
**Last Updated:** 2025-11-17  
**Database Provider:** MySQL (XAMPP compatible)
