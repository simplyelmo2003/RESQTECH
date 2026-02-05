# PostgreSQL Docker Setup Guide

## Quick Start

Your application is now configured to use PostgreSQL with Docker. Follow these steps:

### 1. Start PostgreSQL Container

```powershell
Set-Location 'C:\Users\auren\OneDrive\Pictures\brgy'
docker-compose up -d
```

This will start:
- **PostgreSQL** on `localhost:5432` (user: `postgres`, password: `postgres`, db: `resqtech_db`)
- **pgAdmin** on `localhost:8080` (email: `pgadmin@example.com`, password: `admin`)

### 2. Initialize the Database

```powershell
Set-Location 'C:\Users\auren\OneDrive\Pictures\brgy\server'
npm install
npx prisma migrate dev --name init
```

This creates all tables in PostgreSQL based on your schema.

### 3. Start the Backend Server

```powershell
Set-Location 'C:\Users\auren\OneDrive\Pictures\brgy\server'
npm run build
npm start
# or for development with auto-reload:
npm run dev
```

The backend will be available at `http://localhost:4000`.

### 4. Start the Frontend

In a new terminal:

```powershell
Set-Location 'C:\Users\auren\OneDrive\Pictures\brgy'
npm run dev
```

The frontend will be available at `http://localhost:5174` (or the next available port).

## Database Management

### View Database in pgAdmin

1. Open `http://localhost:8080` in your browser
2. Login with email: `pgadmin@example.com` and password: `admin`
3. Add a new server:
   - Name: `ResqTech`
   - Host: `db` (or `localhost`)
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
   - Database: `resqtech_db`

### Run Prisma Migrations

If you modify the schema.prisma file:

```powershell
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy

# Reset database (caution: deletes all data)
npx prisma migrate reset
```

### Generate Prisma Client

```powershell
npx prisma generate
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resqtech_db"
PORT=4000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
```

## Common Commands

```powershell
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Remove containers and volumes (WARNING: deletes data)
docker-compose down -v

# Restart a specific service
docker-compose restart db
```

## Troubleshooting

### Backend can't connect to database
- Ensure Docker is running: `docker ps`
- Check PostgreSQL container is running: `docker-compose ps`
- Verify DATABASE_URL is correct in `.env`
- Restart containers: `docker-compose restart db`

### Port already in use
- Change port in docker-compose.yml (e.g., `5433:5432` to use port 5433 on host)
- Or kill the process using the port:
  ```powershell
  # Find process on port 5432
  netstat -ano | findstr :5432
  # Kill it (replace PID with the actual process ID)
  taskkill /PID <PID> /F
  ```

### Reset Everything
```powershell
# Stop containers and remove volumes
docker-compose down -v

# Restart fresh
docker-compose up -d

# Reinitialize database
cd server
npx prisma migrate dev --name init
```

## Notes

- PostgreSQL is more robust than MySQL for production use
- Data persists in the `db-data` Docker volume even if containers are stopped
- Use pgAdmin for GUI database management
- Prisma provides type-safe database access
