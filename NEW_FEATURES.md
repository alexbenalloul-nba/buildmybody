# BuildMyBody - New Features & Improvements

This document summarizes the recent updates to BuildMyBody.

---

## 🌍 User Location Tracking

### What It Does
When users sign up (either with email/password or Google OAuth), the system captures:
- **IP Address**: Where the request came from
- **Country**: Derived from IP geolocation
- **City**: Specific city location derived from IP

### Where To See It
- **Admin Dashboard** → **User Signups** tab
- Shows location for every user signup in a table format
- Helps you understand geographic reach of your user base

### Technical Details
- Uses free [ipapi.co](https://ipapi.co/) service for IP geolocation
- Gracefully handles failures (shows "Unknown" if geolocation unavailable)
- Captures IP from proper headers for proxy/load-balancer scenarios

---

## 📊 Admin Dashboard

### What It Is
A new admin panel (only accessible by coaches) with two main tabs:

#### 1. User Signups Tab
Shows a table of all user registrations with:
- Email address
- User name
- Location (City, Country)
- IP address
- Signup date and time
- **Export Database** button

#### 2. Database Stats Tab
Key metrics:
- Total Users
- Total Clients
- Total Workouts
- Total Exercises
- Users by Country (bar chart showing distribution)

### How To Access
1. Log in as the coach (using COACH_EMAIL)
2. Click **Admin** in the navigation bar
3. View signups and statistics

### Permissions
- Only users with "coach" role can access Admin Dashboard
- Regular client accounts cannot see admin features

---

## 💾 Database Export/Backup

### What It Does
One-click export of your entire database as a JSON file containing:
- All users (with passwords hashed for security)
- All workouts
- All exercises
- All measurements
- All messages

### How To Use
1. Go to Admin Dashboard
2. Click **📥 Export Database** button
3. JSON file downloads automatically named with today's date
4. Use for:
   - Regular backups
   - Data analysis
   - Migrating to another system
   - Compliance/auditing

### File Format
```json
{
  "exportedAt": "2026-04-20T12:34:56.789Z",
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "client",
      "country": "United States",
      "city": "New York",
      "ip_address": "192.168.1.1",
      "created_at": "2026-04-20T10:00:00Z"
    }
    // ... more users
  ],
  "workouts": [ /* ... */ ],
  "exercises": [ /* ... */ ],
  "measurements": [ /* ... */ ],
  "messages": [ /* ... */ ]
}
```

---

## 🔒 Google OAuth Implementation

### What It Does
Allows users to sign in using their Google account instead of email/password.

### How It Works
1. User clicks "Continue with Google" button on login page
2. Redirected to Google's OAuth flow
3. After authentication, user is logged into BuildMyBody
4. User data (email, name) imported from Google account
5. Location data captured on signup

### Current Status
✅ Code is implemented and ready
❌ Needs Google Cloud credentials to activate

### To Enable
See **SETUP_GUIDE.md** for complete Google OAuth setup instructions.

---

## 🗄️ Persistent Database Storage (Railway)

### What Was The Problem
Previously, your SQLite database was stored in Railway's **ephemeral filesystem**, meaning:
- Database gets deleted on every redeploy
- All user data lost when you update your app
- Not suitable for production

### What We Fixed
Updated database configuration to use Railway **Volumes** for persistent storage:
- Database now survives redeploys
- Data is permanently stored
- Production-ready

### How To Set It Up
See **SETUP_GUIDE.md** for complete Railway Volume setup instructions.

### The Key Change
```javascript
// Before: Stored on ephemeral filesystem
const DB_PATH = process.env.DB_PATH || join(__dirname, 'buildmybody.db');

// After: Uses persistent volume when DB_PATH is set
// Set DB_PATH=/data/buildmybody.db in Railway environment
```

---

## 🔄 Changes Summary

### Database Schema Updates
New columns added to `users` table:
- `ip_address TEXT` - IP address at signup
- `country TEXT` - Country derived from IP
- `city TEXT` - City derived from IP

All existing data is preserved (migration-safe).

### New API Endpoints
```
GET  /api/admin/signups      - Get all user signups with location
GET  /api/admin/stats        - Get database statistics
GET  /api/admin/export       - Download database as JSON
```

All endpoints require authentication and coach role.

### New React Component
- `AdminDashboard.jsx` - Admin panel with tabs for signups and stats
- Integrated into main app with new route `/admin`

### Configuration Files
- Updated `.env.example` with DB_PATH documentation
- New `SETUP_GUIDE.md` with detailed instructions
- New `NEW_FEATURES.md` (this file)

---

## 🚀 Getting Started

### For Google OAuth:
1. Follow the step-by-step guide in `SETUP_GUIDE.md`
2. Get credentials from Google Cloud Console
3. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Railway
4. Redeploy

### For Persistent Database:
1. Create a new Volume in Railway at `/data`
2. Set `DB_PATH=/data/buildmybody.db` environment variable
3. Redeploy
4. Your database will now persist across redeploys

### To Use Admin Dashboard:
1. Make sure you're logged in as coach (COACH_EMAIL)
2. Click "Admin" in navigation
3. View signups and statistics

---

## ✅ Testing Checklist

- [ ] Create test user with email/password
- [ ] User appears in Admin → User Signups with location data
- [ ] Create another user to verify location tracking works
- [ ] Test "Export Database" button - file downloads
- [ ] Check database stats in Admin → Database Stats tab
- [ ] Test Google OAuth (if credentials configured)
- [ ] Verify database persists after redeploy (if using Railway volumes)

---

## 📞 Questions?

- See `SETUP_GUIDE.md` for setup and troubleshooting
- Check Railway logs for deployment issues
- Review the API endpoints in `backend/server.js` for admin routes

Enjoy your enhanced BuildMyBody app! 🎉
