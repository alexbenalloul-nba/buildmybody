# BuildMyBody - Complete Deployment Checklist

**Goal**: Get all new features deployed and working on Railway in ~30 minutes

---

## ✅ Phase 1: Deploy Code Changes (5 min)

All code changes have been made to your project. Now deploy them:

### Option A: Git Push (Recommended)
```bash
cd /path/to/buildmybody
git add .
git commit -m "feat: add location tracking, admin dashboard, and database persistence"
git push origin main
```

Railway will auto-deploy when you push to main.

### Option B: Manual Upload via Railway
1. Go to Railway Dashboard
2. Backend service → Deployments → Deploy new
3. Select your git branch or upload files

**Wait for deployment to complete** ✅

---

## ✅ Phase 2: Set Up Persistent Database (5 min)

**This is critical** - without it, your data gets deleted on every redeploy!

### Step 1: Create Volume in Railway
1. Go to Railway Dashboard
2. Click **Backend** service
3. Go to **Volumes** tab
4. Click **+ NEW VOLUME**
5. Fill in:
   - **Mount path**: `/data`
   - **Name**: `db-volume` (or any name)
6. Click **CREATE**

### Step 2: Set Environment Variable
1. Still in Backend service, go to **Variables** tab
2. Click **+ NEW VARIABLE**
3. Add:
   ```
   DB_PATH = /data/buildmybody.db
   ```
4. Click **Deploy** button that appears

**Wait for redeployment** ✅

### Step 3: Verify It Works
1. In your app, create a test user
2. Go to Admin → User Signups (while logged in as coach)
3. You should see the user
4. Redeploy again (no code changes needed)
5. Check Admin → User Signups again
6. **If your test user is still there after redeploy** ✅ - it's working!

---

## ✅ Phase 3: Set Up Google OAuth (10 min)

### Step 1: Get Google Credentials

#### Option A: Using Google Cloud Console (Easiest)

1. **Create Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click project selector at top
   - Click **+ NEW PROJECT**
   - Name: `BuildMyBody`
   - Click **CREATE**
   - Wait for creation to complete

2. **Enable API**
   - Click on your project to make sure it's selected
   - Go to **APIs & Services** → **Library**
   - Search: `Google+ API`
   - Click on it
   - Click **ENABLE**

3. **Create OAuth Credentials**
   - Go to **APIs & Services** → **Credentials**
   - See "Configure OAuth consent screen" warning?
     - Click **CONFIGURE CONSENT SCREEN**
     - Choose **External**
     - Fill in:
       - **App name**: BuildMyBody
       - **User support email**: your email
       - **Developer contact**: your email
     - Click **SAVE AND CONTINUE**
     - Skip through "Scopes" page → **SAVE AND CONTINUE**
     - Add yourself as test user
     - Click **SAVE AND CONTINUE**
     - Click **BACK TO DASHBOARD**
   
   - Now create OAuth credentials:
     - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
     - **Application type**: Web application
     - **Name**: BuildMyBody Backend
     - Scroll to **Authorized redirect URIs**
     - Click **+ ADD URI** and add BOTH:
       - `http://localhost:3001/api/auth/google/callback`
       - `https://buildmybody-production.up.railway.app/api/auth/google/callback`
       - *(Replace with your actual Railway URL)*
     - Click **CREATE**
     - **COPY your Client ID and Client Secret** somewhere safe

#### Option B: Using `setup-google-oauth.sh`
```bash
chmod +x setup-google-oauth.sh
./setup-google-oauth.sh
```
Then follow the prompts.

### Step 2: Add to Railway

1. Go to Railway Dashboard
2. Click **Backend** service
3. Go to **Variables** tab
4. Add these 3 variables:
   ```
   GOOGLE_CLIENT_ID = (your client ID from Google)
   GOOGLE_CLIENT_SECRET = (your client secret from Google)
   GOOGLE_REDIRECT_URI = https://buildmybody-production.up.railway.app/api/auth/google/callback
   ```
   *(Replace URL with your actual Railway backend URL)*

5. Click **Deploy** button

**Wait for redeployment** ✅

### Step 3: Test It
1. Go to your app (refresh the page)
2. Click login or sign up
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be logged in! ✅

---

## ✅ Phase 4: Test All Features (5 min)

### Admin Dashboard
1. Log in as coach (your COACH_EMAIL)
2. Click **Admin** in navigation
3. **User Signups tab**:
   - See all users with location data ✓
   - See IP addresses ✓
   - See signup dates ✓
4. **Database Stats tab**:
   - See total users, workouts, exercises ✓
   - See bar chart of users by country ✓
5. **Export Database**:
   - Click "📥 Export Database" button
   - JSON file downloads ✓

### Location Tracking
1. Create a new test user (email/password)
2. Go to Admin → User Signups
3. New user appears with location data ✓

### Google OAuth
1. Log out
2. Click sign up
3. Click "Continue with Google"
4. Sign in with a test Google account
5. Redirected back to app ✓
6. Your info is saved with location data ✓

### Database Persistence
1. Create a test user
2. Redeploy backend (no code changes)
3. User data still exists after redeploy ✓

---

## ✅ Final Checklist

- [ ] Code deployed to Railway
- [ ] `/data` volume created for backend
- [ ] `DB_PATH=/data/buildmybody.db` environment variable set
- [ ] Google OAuth credentials created and added to Railway
- [ ] Can see user signups in Admin Dashboard
- [ ] Can see location data for users
- [ ] Can export database as JSON
- [ ] Database persists after redeploy
- [ ] Google OAuth login works

---

## 🆘 Troubleshooting

### "Google OAuth not configured" error
- ✓ Check GOOGLE_CLIENT_ID is set in Railway
- ✓ Check GOOGLE_CLIENT_SECRET is set in Railway
- ✓ Redeploy backend after setting variables
- ✓ Clear browser cache (Cmd+Shift+Delete)

### Database getting wiped on redeploy
- ✓ Volume created? (Backend → Volumes tab)
- ✓ DB_PATH=/data/buildmybody.db set?
- ✓ Redeployed after setting DB_PATH?

### Location showing as "Unknown"
- Normal! Geolocation service may be rate-limited
- Try signing up again in a few minutes
- Not critical - app still works fine

### Admin Dashboard showing "Failed to load"
- ✓ Logged in as coach?
- ✓ COACH_EMAIL matches your email?
- ✓ Backend deployed successfully?

---

## 📞 Need Help?

1. Check Railway logs: Backend service → Logs tab
2. Check browser console: F12 → Console tab
3. Review SETUP_GUIDE.md for detailed info
4. Review NEW_FEATURES.md for feature overview

---

**You're all set!** 🎉 Enjoy your fully automated user tracking and admin dashboard.
