# ResQTech Backend Setup - XAMPP + MySQL Edition

Your backend is now **fully configured for MySQL with XAMPP**. Follow this guide to get everything running in under 10 minutes.

---

## Prerequisites
- ✅ XAMPP installed with MySQL
- ✅ Node.js installed
- ✅ ResQTech project

---

## Step 1: Start XAMPP MySQL

1. Open **XAMPP Control Panel** from your Start Menu
2. Find **MySQL** in the list
3. Click the **Start** button next to it
4. Wait for it to show as **Running** (green indicator)

That's it! MySQL is now running on port 3306.

---

## Step 2: Create Database

### Method A: Via phpMyAdmin (Easiest)

1. In XAMPP Control Panel, click **Admin** next to Apache (or start Apache first)
2. Go to: http://localhost/phpmyadmin
3. Click the **SQL** tab at the top
4. Copy and paste this:
   ```sql
   CREATE DATABASE resqtech_db;
   ```
5. Click the blue **Go** button

Done! Database created.

### Method B: Via Command Line

```powershell
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE resqtech_db;"
```

---

## Step 3: Create Backend Configuration

### Create `.env` File

Open PowerShell in the `server` directory:

```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy\server"

# Create .env file with database connection
@"
DATABASE_URL="mysql://root:@localhost:3306/resqtech_db"
PORT=4000
NODE_ENV=development
"@ | Out-File -Encoding UTF8 .env
```

**That's it!** The `.env` file is now ready with the MySQL connection string.

---

## Step 4: Setup Database Tables

### Install Dependencies
```powershell
npm install
```

### Generate Prisma Client
```powershell
npm run prisma:generate
```

### Create Database Tables (Migrations)
```powershell
npm run prisma:migrate -- --name "init"
```

You'll see output like:
```
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

### Add Sample Data (Optional)
```powershell
npm run seed
```

---

## Step 5: Start Backend Server

```powershell
npm run dev
```

You should see:
```
Server running on port 4000
✅ Database connected successfully
```

If you see this, **the backend is ready!** ✅

---

## Step 6: Start Frontend

Open a **new PowerShell terminal** (keep backend running in first one):

```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy"
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

---

## Step 7: Open Your App

Go to your browser and open:
```
http://localhost:5173
```

**You're done!** 🎉 Your app is now running with XAMPP + MySQL backend!

---

## 📊 Access Your Database

### phpMyAdmin (Web UI)
- **URL:** http://localhost/phpmyadmin
- **Username:** `root`
- **Password:** (leave blank)
- Browse tables, view data, run SQL queries

### Command Line
```powershell
"C:\xampp\mysql\bin\mysql.exe" -u root -D resqtech_db

# List tables
SHOW TABLES;

# View specific table
SELECT * FROM User;
SELECT * FROM EvacCenter;
SELECT * FROM Message;

# Exit
EXIT;
```

### DBeaver (Recommended - Professional UI)
Better than phpMyAdmin for complex work:

1. Download: https://dbeaver.io/
2. Install
3. File → New Database Connection → MySQL
4. Configure:
   - Server: `localhost`
   - Port: `3306`
   - Database: `resqtech_db`
   - Username: `root`
   - Leave password blank
5. Test Connection → OK

---

## 🔧 Daily Startup (Next Time You Develop)

### Quick & Easy (3 clicks + 3 commands)

1. **Start MySQL:**
   - Open XAMPP Control Panel
   - Click **Start** next to MySQL
   - Done!

2. **Terminal 1 - Backend:**
   ```powershell
   cd server
   npm run dev
   ```

3. **Terminal 2 - Frontend:**
   ```powershell
   npm run dev
   ```

4. **Open browser:** http://localhost:5173

Total time: < 30 seconds after MySQL starts!

---

## ⚠️ Troubleshooting

### "Port 3306 already in use"
Another MySQL is running.

```powershell
# Find what's using it
netstat -ano | findstr :3306

# Kill it (replace PID with the number shown)
taskkill /PID 1234 /F
```

Or just restart your computer.

### "Can't connect to MySQL"
MySQL isn't running. Open XAMPP Control Panel and click **Start** next to MySQL.

### "Unknown database 'resqtech_db'"
Database wasn't created. Go back to **Step 2** and create it via phpMyAdmin.

### "Prisma migration failed"
1. Make sure MySQL is running
2. Make sure database `resqtech_db` exists
3. Try running migration again:
   ```powershell
   npm run prisma:migrate
   ```

### "Backend says 'Database connection failed'"
1. Check `.env` file exists in `server/` directory
2. Check MySQL is running (XAMPP Control Panel)
3. Check DATABASE_URL in `.env`:
   ```
   DATABASE_URL="mysql://root:@localhost:3306/resqtech_db"
   ```
4. Restart backend: `npm run dev`

### "npm command not found"
Make sure Node.js is installed: `node --version`

### "Port 4000 already in use"
Another app is using it. Kill it:
```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

Or change PORT in `server/.env` to something else like `4001`.

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Database connection config (you created this) |
| `server/prisma/schema.prisma` | Database table definitions |
| `server/src/index.ts` | Express server code |
| `http://localhost/phpmyadmin` | Database manager |

---

## 🎯 What's Running

- **Frontend:** React app on http://localhost:5173
- **Backend:** Express server on http://localhost:4000
- **Database:** MySQL on port 3306 (inside XAMPP)
- **Database UI:** phpMyAdmin on http://localhost/phpmyadmin

All three are now working together! ✅

---

## ✨ Key Points

✅ **No localhost hassles** - Everything works locally  
✅ **Easy database access** - phpMyAdmin is built-in  
✅ **Familiar tools** - XAMPP is industry standard  
✅ **Same functionality** - Full backend-authoritative architecture  
✅ **Easy to backup** - XAMPP stores all data locally  

---

## Next Steps

1. ✅ XAMPP + MySQL running
2. ✅ Backend connected to database
3. ✅ Frontend accessing backend
4. Next: Implement JWT authentication (Task #7)

---

**Status:** ✅ Ready for development with XAMPP!  
**Time to complete:** ~10 minutes  
**Last Updated:** 2025-11-17
