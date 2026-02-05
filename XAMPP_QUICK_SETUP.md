# XAMPP Quick Start - 5 Minutes to Running

## What You Need
- ✅ XAMPP installed with MySQL
- ✅ Node.js installed
- ✅ ResQTech project

---

## 5-Minute Setup

### 1️⃣ Start XAMPP MySQL (30 seconds)
```
Open XAMPP Control Panel → Click START next to MySQL → Wait for green indicator
```

### 2️⃣ Create Database (1 minute)
```
Go to: http://localhost/phpmyadmin
Click SQL tab → Paste below → Click Go:
```
```sql
CREATE DATABASE resqtech_db;
```

### 3️⃣ Create Backend .env (30 seconds)
```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy\server"
@"
DATABASE_URL="mysql://root:@localhost:3306/resqtech_db"
PORT=4000
"@ | Out-File -Encoding UTF8 .env
```

### 4️⃣ Setup Backend (2 minutes)
```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 5️⃣ Start Servers

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
# Should show: Server running on port 4000
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\auren\OneDrive\Pictures\brgy"
npm run dev
# Should show: Local: http://localhost:5173
```

### 6️⃣ Open Browser
```
http://localhost:5173
```

---

## Done! 🎉

**Your app is running with:**
- ✅ Frontend: React (Port 5173)
- ✅ Backend: Express (Port 4000)
- ✅ Database: MySQL (Port 3306)

---

## Access Points

| What | URL |
|------|-----|
| App | http://localhost:5173 |
| Backend Health | http://localhost:4000/api/health |
| Database Manager | http://localhost/phpmyadmin |
| MySQL CLI | `"C:\xampp\mysql\bin\mysql.exe" -u root -D resqtech_db` |

---

## Daily Startup (After Today)

```powershell
# 1. Start XAMPP (GUI - one click on MySQL Start)

# 2. Terminal 1 - Backend
cd server && npm run dev

# 3. Terminal 2 - Frontend  
npm run dev

# 4. Open http://localhost:5173
```

Done!

---

## Help

**See full guide:** `XAMPP_MYSQL_SETUP.md`

**Issues?** Check `XAMPP_MYSQL_SETUP.md` troubleshooting section
