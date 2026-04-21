#!/bin/bash

# BuildMyBody - Google OAuth Setup Automation Script
# This script helps you set up Google OAuth credentials
# Prerequisites: gcloud CLI installed (https://cloud.google.com/sdk/docs/install)

set -e

echo "🔐 BuildMyBody Google OAuth Setup"
echo "=================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "ℹ️  gcloud CLI not found. Google Cloud Console access recommended."
    echo "   Visit: https://console.cloud.google.com"
    echo "   Or install gcloud: https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "This script provides manual steps for web console setup."
    MANUAL_ONLY=true
else
    MANUAL_ONLY=false
fi

# Get Railway URL from user
echo "📋 Configuration:"
read -p "What is your Railway backend URL? (e.g., https://buildmybody-production.up.railway.app): " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
    echo "❌ Railway URL is required"
    exit 1
fi

REDIRECT_URI="${RAILWAY_URL}/api/auth/google/callback"

echo ""
echo "Your OAuth Redirect URI will be:"
echo "  $REDIRECT_URI"
echo ""

if [ "$MANUAL_ONLY" = true ]; then
    echo "📝 MANUAL SETUP (Web Console):"
    echo "===================================="
    echo ""
    echo "Step 1: Create Google Cloud Project"
    echo "  1. Go to https://console.cloud.google.com"
    echo "  2. Click project selector at top"
    echo "  3. Click '+ NEW PROJECT'"
    echo "  4. Name: BuildMyBody"
    echo "  5. Click CREATE"
    echo ""
    echo "Step 2: Enable Google+ API"
    echo "  1. Go to APIs & Services → Library"
    echo "  2. Search 'Google+ API'"
    echo "  3. Click it"
    echo "  4. Click ENABLE"
    echo ""
    echo "Step 3: Create OAuth Credentials"
    echo "  1. Go to APIs & Services → Credentials"
    echo "  2. If needed, configure OAuth consent screen:"
    echo "     - User type: External"
    echo "     - App name: BuildMyBody"
    echo "     - Fill required fields and save"
    echo "  3. Click CREATE CREDENTIALS → OAuth client ID"
    echo "  4. Application type: Web application"
    echo "  5. Name: BuildMyBody Backend"
    echo "  6. Under 'Authorized redirect URIs', add BOTH:"
    echo "     • http://localhost:3001/api/auth/google/callback (for local dev)"
    echo "     • $REDIRECT_URI (for production)"
    echo "  7. Click CREATE"
    echo "  8. Copy your Client ID and Client Secret"
    echo ""
else
    echo "🔧 Using gcloud CLI..."
    # Check if logged in
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &>/dev/null; then
        echo "Please log in to Google Cloud:"
        gcloud auth login
    fi

    # Get or create project
    echo "Getting Google Cloud project..."
    PROJECT_ID=$(gcloud config get-value project)
    if [ -z "$PROJECT_ID" ]; then
        read -p "Create new project? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            gcloud projects create buildmybody --name="BuildMyBody"
            gcloud config set project buildmybody
            PROJECT_ID="buildmybody"
        fi
    fi

    echo "✅ Using project: $PROJECT_ID"

    # Enable APIs
    echo "Enabling Google+ API..."
    gcloud services enable oauth2.googleapis.com --project=$PROJECT_ID 2>/dev/null || true
    gcloud services enable plus.googleapis.com --project=$PROJECT_ID 2>/dev/null || true

    echo "✅ APIs enabled"
fi

echo ""
echo "Step 4: Add Credentials to Railway"
echo "===================================="
echo ""
echo "Once you have your Client ID and Secret:"
echo ""
echo "1. Go to Railway Dashboard"
echo "2. Select your backend service"
echo "3. Go to Variables"
echo "4. Add these variables (copy & paste):"
echo ""
echo "   GOOGLE_CLIENT_ID=<paste-your-client-id>"
echo "   GOOGLE_CLIENT_SECRET=<paste-your-client-secret>"
echo "   GOOGLE_REDIRECT_URI=$REDIRECT_URI"
echo ""
echo "5. Click Deploy"
echo ""
echo "Done! Users can now 'Continue with Google' to sign up."
