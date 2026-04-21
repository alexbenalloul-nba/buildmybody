# BuildMyBody - Quick Start (Copy & Paste)

**Complete automation in 3 steps**

---

## Step 1️⃣: Deploy Code to Railway (2 min)

Run this in your terminal:

```bash
cd /path/to/buildmybody
git add .
git commit -m "feat: add location tracking, admin dashboard, and database"
git push origin main
```

**Wait for Railway to auto-deploy** ✅

---

## Step 2️⃣: Set Up Persistent Database (3 min)

Go to Railway web dashboard:

1. **Backend Service** → **Volumes** → **+ NEW VOLUME**
   - Mount path: `/data`
   - Click CREATE

2. **Backend Service** → **Variables** → **+ NEW VARIABLE**
   ```
   DB_PATH = /data/buildmybody.db
   ```
   - Click Deploy

**Wait for redeployment** ✅

---

## Step 3️⃣: Set Up Google OAuth (5 min)

### Get Credentials (choose one):

**Option A: Automated Script**
```bash
chmod +x setup-google-oauth.sh
./setup-google-oauth.sh
```

**Option B: Manual (Step by step)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Project selector → **+ NEW PROJECT** → Name: `BuildMyBody` → CREATE
3. APIs & Services → **Library** → Search `Google+ API` → ENABLE
4. APIs & Services → **Credentials**
   - If prompted, Configure OAuth consent screen (External user type, fill email)
   - **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `BuildMyBody Backend`
   - Authorized redirect URIs - add BOTH:
     - `http://localhost:3001/api/auth/google/callback`
     - `https://buildmybody-production.up.railway.app/api/auth/google/callback`
       *(replace with your actual Railway backend URL)*
   - CREATE
   - Copy Client ID and Client Secret

### Add to Railway:

Go to Railway web dashboard:

1. **Backend Service** → **Variables** → Add 3 variables:

```
GOOGLE_CLIENT_ID = (paste your Client ID)
GOOGLE_CLIENT_SECRET = (paste your Client Secret)  
GOOGLE_REDIRECT_URI = https://buildmybody-production.up.railway.app/api/auth/google/callback
```
*(replace URL with your actual Railway backend URL)*

2. Click **Deploy**

**Wait for redeployment** ✅

---

## ✅ Done! Now Test:

### Test Admin Dashboard:
1. Log in as coach (your COACH_EMAIL)
2. Click **Admin** in top navigation
3. See all user signups with location data!

### Test Google OAuth:
1. Log out
2. Click Sign Up
3. Click "Continue with Google"
4. Sign in with Google → logged into app! ✅

### Test Database Persistence:
1. Create a test user
2. Go to Admin → User Signups
3. Note the user is there
4. Redeploy backend (no code changes)
5. Check Admin → User Signups again
6. User data still exists! ✅

---

## 📋 Full Environment Variables for Reference

**Backend (.env in Railway):**
```
# Coach
COACH_EMAIL = your-email@example.com

# Database
DB_PATH = /data/buildmybody.db

# JWT Secret (generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET = (long random string)

# Google OAuth
GOOGLE_CLIENT_ID = (from Google Cloud)
GOOGLE_CLIENT_SECRET = (from Google Cloud)
GOOGLE_REDIRECT_URI = https://buildmybody-production.up.railway.app/api/auth/google/callback

# URLs
FRONTEND_URL = https://buildmybody.up.railway.app
BACKEND_URL = https://buildmybody-production.up.railway.app
NODE_ENV = production
PORT = 3001
```

---

## 🎯 What You Get:

✅ **User Location Tracking** - See where users sign up from  
✅ **Admin Dashboard** - View signups, stats, geographic distribution  
✅ **Database Export** - Download JSON backup anytime  
✅ **Google OAuth** - "Continue with Google" login button  
✅ **Persistent Database** - Data survives redeploys  

---

## 🆘 Quick Troubleshooting:

**"Google OAuth not configured"**
→ Check variables set, redeploy, clear browser cache

**Database still wiped?**  
→ Verify volume exists at `/data` and `DB_PATH` is set

**Can't access Admin?**
→ Make sure logged in as coach (COACH_EMAIL)

**Location showing "Unknown"?**
→ Normal - geolocation service rate-limited. Try again later.

---

**You're done! 🎉**

For details, see:
- `SETUP_GUIDE.md` - Full setup instructions
- `NEW_FEATURES.md` - Feature overview
- `DEPLOYMENT_CHECKLIST.md` - Detailed checklist

