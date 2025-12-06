# GitHub Setup Guide

## Step 1: Create a New Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `calm-commute` (or your preferred name)
4. Description: "A stress-aware navigation app that helps you find the calmest route"
5. Choose **Public** (so judges can see it)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

## Step 2: Initialize Git and Push

Open terminal in your project directory:

```bash
cd /Users/liz/calm-comute/Calm-Comute

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: CalmCommute - Stress-aware navigation app"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/calm-commute.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Add Repository Topics (Optional but Recommended)

On your GitHub repository page:
1. Click the gear icon next to "About"
2. Add topics: `hackathon`, `navigation`, `mental-health`, `react`, `google-maps`, `stress-management`

## Step 4: Update README

Edit the README.md to:
- Replace `yourusername` with your actual GitHub username
- Add screenshots of your app
- Add a demo video link (if you have one)

## Important Notes

⚠️ **API Key Security**: 
- Your API key is currently in the code (for demo purposes)
- For production, use environment variables
- Consider adding a note in README about setting up your own API key

⚠️ **Don't commit sensitive data**:
- The `.gitignore` file will prevent committing `node_modules` and `.env` files
- Make sure your API key restrictions are set up properly in Google Cloud Console

