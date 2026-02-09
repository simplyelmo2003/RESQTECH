# Backend Deployment Guide

## Option 1: Railway (Recommended for Node.js)

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the monorepo root, then point to the `server` folder
5. Add environment variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `NODE_ENV`: `production`
6. Deploy

Your backend will be available at: `https://your-railway-project.up.railway.app`

## Option 2: Render

1. Go to [render.com](https://render.com)  
2. New > Web Service
3. Connect GitHub
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add environment variable: `DATABASE_URL`
7. Deploy

## After Deployment

Update your frontend environment:

```bash
VITE_API_BASE_URL=https://your-backend-url
```

Then redeploy frontend to Vercel.
