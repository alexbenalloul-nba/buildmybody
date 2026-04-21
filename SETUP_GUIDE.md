# BuildMyBody Setup Guide

This guide covers setting up Google OAuth authentication and fixing the persistent database storage issue on Railway.

## 📋 What's New

### ✅ Recent Additions
- **User Location Tracking**: User signups now capture IP address and geolocation (country, city)
- **Admin Dashboard**: Access to view all user signups with location data, database statistics, and data export
- **Database Export**: Download your entire database as JSON for backup purposes
- **Location-based Analytics**: See which countries your users are signing up from

---

## 🔐 Google OAuth Setup

Google OAuth is already implemented in the code but requires credentials to work.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project:
   - Click the project selector at the top
   - Click "NEW PROJECT"
   - Name it "BuildMyBody" or similar
   - Click "CREATE"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **ENABLE**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **CREATE CREDENTIALS** → **OAuth client ID**
3. If you see a warning about configuring the OAuth consent screen, click **Configure OAuth consent screen**
   - Choose **External** user type
   - Fill in the required fields:
     - App name: "BuildMyBody"
     - User support email: your email
     - Developer contact: your email
   - Click **SAVE AND CONTINUE**
   - On "Scopes" page, click **SAVE AND CONTINUE**
   - Add yourself as a test user and **SAVE AND CONTINUE**
   - Click **BACK TO DASHBOARD**

4. Now create the OAuth client ID again:
   - Click **CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "BuildMyBody Backend"
   - Under "Authorized redirect URIs", add:
     - `http://localhost:3001/api/auth/google/callback` (for local development)
     - `https://buildmybody-production.up.railway.app/api/auth/google/callback` (replace with your actual Railway URL)
   - Click **CREATE**
   - Copy the **Client ID** and **Client Secret** (you'll need these)

### Step 4: Add Credentials to Railway

1. Go to your Railway project dashboard
2. For your **backend** service:
   - Go to **Variables**
   - Add the following environment variables:
     ```
     GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-client-secret
     GOOGLE_REDIRECT_URI=https://buildmybody-production.up.railway.app/api/auth/google/callback
     ```
   - Replace the URLs with your actual Railway domain

3. For your **frontend** service:
   - No additional variables needed (frontend URLs are in the backend)

4. Redeploy both services for changes to take effect

### Step 5: Test Google OAuth

1. Go to your app's login page
2. Click "Continue with Google"
3. You should be redirected to Google's login
4. After signing in, you should be logged into BuildMyBody
5. Check the Admin Dashboard → User Signups to see your account with location data captured

---

## 🗄️ Fix Persistent Database Storage (Railway)

**Important**: Your SQLite database is currently being wiped every time you redeploy because it's stored on Railway's ephemeral filesystem. This guide fixes that.

### The Problem

```
backend/buildmybody.db is on ephemeral storage
↓
Every Railway redeploy = new container = database file deleted
↓
All user data lost on every deploy
```

### The Solution: Use Railway Volumes

A **Volume** is persistent storage that survives redeploys.

### Step 1: Create a Volume in Railway

1. Go to your Railway project
2. Click on your **backend** service
3. Go to the **Volumes** tab
4. Click **+ NEW VOLUME**
5. Name it: `db-volume` (or anything you prefer)
6. Mount path: `/data`
7. Click **CREATE**

### Step 2: Update Backend Environment Variable

1. In the backend service, go to **Variables**
2. Add this environment variable:
   ```
   DB_PATH=/data/buildmybody.db
   ```
3. Click **Deploy** to redeploy with the new volume mounted

### Step 3: Verify It Works

1. Deploy your backend (Railway should automatically restart it)
2. Create a test user account through the app
3. Check Admin Dashboard → User Signups to confirm the user was created
4. Redeploy again (without any code changes)
5. Check Admin Dashboard again — your test user should still be there
6. If the user persists, you're all set! ✅

### Step 4: Optional - Migrate Existing Data

If you have existing data in your current SQLite database:

1. Stop your current deployment (don't delete the Railway service)
2. Copy the database file from your local or current deployment
3. Once the new volume is created and mounted, upload the backup through Railway's file explorer or via `railway run` command

---

## 🔍 Admin Dashboard Features

Once you're logged in as a coach, you can access the Admin Dashboard:

### User Signups Tab
- View all users who have signed up
- See their email, name, location (city/country), IP address
- See exact signup date and time
- **Export Database** button to download all data as JSON

### Database Stats Tab
- **Total Users**: Count of all registered users
- **Total Clients**: Count of users with "client" role
- **Total Workouts**: Count of all workouts logged
- **Total Exercises**: Count of all exercises across workouts
- **Users by Country**: Bar chart showing geographic distribution

### Export/Backup
- Click **Export Database** to download a JSON file containing:
  - All users
  - All workouts
  - All exercises
  - All measurements
  - All messages
- Use this for backups or data analysis

---

## 📝 Environment Variables Reference

### Backend (.env in Railway)
```
# Coach
COACH_EMAIL=your-email@example.com

# JWT
JWT_SECRET=your-long-random-secret-here

# Database (IMPORTANT!)
DB_PATH=/data/buildmybody.db

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://buildmybody-production.up.railway.app/api/auth/google/callback

# URLs
FRONTEND_URL=https://buildmybody.up.railway.app
BACKEND_URL=https://buildmybody-production.up.railway.app
NODE_ENV=production
PORT=3001
```

### Frontend (.env in Railway)
```
VITE_API_URL=https://buildmybody-production.up.railway.app/api
VITE_BACKEND_URL=https://buildmybody-production.up.railway.app
```

---

## 🆘 Troubleshooting

### "Google OAuth not configured" error
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in Railway backend variables
- Ensure you've deployed after adding the variables
- Check that the redirect URI in your Google Cloud credentials matches exactly (including https/http)

### Database still getting wiped on redeploy
- Verify the **Volume** is created and mounted at `/data`
- Check that `DB_PATH=/data/buildmybody.db` is set in backend variables
- Restart your Railway service to apply the volume mount

### Location data showing as "Unknown"
- The geolocation service (ipapi.co) may be rate-limited or unavailable
- This is non-critical and the app will still work normally
- Try signing up again in a few moments

### Can't access Admin Dashboard
- Make sure you're logged in as the coach (COACH_EMAIL)
- The Admin Dashboard is only visible to users with the "coach" role
- Check that your email matches the COACH_EMAIL environment variable

---

## 🚀 Next Steps

1. ✅ Set up Google OAuth (follow steps above)
2. ✅ Create Railway Volume for persistent storage
3. ✅ Test by creating user accounts
4. ✅ Check Admin Dashboard to verify data is being captured
5. 📊 Monitor user signups and engagement from the admin panel
6. 💾 Regularly export your database for backups

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Railway logs: Railway Dashboard → Backend Service → Logs
3. Check browser console for frontend errors (F12 → Console tab)
4. Review backend server logs for API errors

Good luck! 🎉
