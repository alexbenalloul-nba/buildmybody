#!/bin/bash

# BuildMyBody - Railway Setup Automation Script
# This script automates Railway configuration
# Prerequisites: railway CLI installed (https://docs.railway.app/guides/cli)

set -e

echo "🚀 BuildMyBody Railway Setup"
echo "=============================="
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it first:"
    echo "   npm install -g @railway/cli"
    echo "   Then run: railway login"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Verify we're in a Railway project
echo "Checking Railway project..."
if ! railway status &> /dev/null; then
    echo "❌ Not in a Railway project or not logged in"
    echo "   Run: railway login"
    echo "   Then: railway init"
    exit 1
fi

PROJECT_ID=$(railway status --json 2>/dev/null | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
SERVICE_ID=$(railway status --json 2>/dev/null | grep -o '"serviceId":"[^"]*"' | cut -d'"' -f4)

echo "✅ Found Railway Project: $PROJECT_ID"
echo "✅ Current Service: $SERVICE_ID"
echo ""

# Step 1: Create Volume for persistent storage
echo "📦 Setting up persistent database volume..."
echo "   Create a new volume at /data for database persistence"
echo "   ACTION NEEDED: Go to Railway Dashboard → Backend Service → Volumes"
echo "   Click '+ NEW VOLUME'"
echo "   Name: db-volume"
echo "   Mount path: /data"
echo "   Click CREATE"
echo ""
read -p "Press ENTER once you've created the volume in Railway..."
echo ""

# Step 2: Set environment variables
echo "Setting environment variables..."

# Generate strong JWT secret if not set
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Set backend variables
echo "Setting BACKEND environment variables:"

railway service -s backend 2>/dev/null && {
    railway variables set DB_PATH=/data/buildmybody.db
    railway variables set JWT_SECRET="$JWT_SECRET"
    echo "✅ DB_PATH and JWT_SECRET set"
} || echo "⚠️  Backend service not found, skipping..."

echo ""
echo "✅ Environment setup complete!"
echo ""

# Step 3: Deploy
echo "🚀 Deploying to Railway..."
read -p "Ready to deploy? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    railway up
    echo "✅ Deployment started!"
else
    echo "Skipped deployment"
fi

echo ""
echo "=============================="
echo "✅ Railway setup complete!"
echo ""
echo "Next steps:"
echo "1. Add Google OAuth credentials (see setup-google-oauth.sh)"
echo "2. Test by creating a user account"
echo "3. Check Admin Dashboard for user data"
