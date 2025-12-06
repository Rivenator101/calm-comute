# Google Maps API Key Setup Guide

## Step 1: Enable Required APIs

Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Library

Enable these APIs:
- ✅ **Directions API** (or Routes API for newer version)
- ✅ **Places API** (for autocomplete)
- ✅ **Maps JavaScript API** (for map display)
- ✅ **Geocoding API** (optional, for address conversion)

## Step 2: Set Application Restrictions

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **"Application restrictions"**, select **"HTTP referrers (websites)"**
4. Add these referrers:

### For Development (localhost):
```
http://localhost:3000/*
http://127.0.0.1:3000/*
```

### For Production (when deployed):
```
https://yourdomain.com/*
https://*.yourdomain.com/*
```

## Step 3: Set API Restrictions

1. Under **"API restrictions"**, select **"Restrict key"**
2. Click **"Select APIs"**
3. Choose ONLY these APIs:
   - Directions API
   - Places API
   - Maps JavaScript API
   - Geocoding API (if needed)

## Step 4: Save

Click **"Save"** at the bottom of the page.

## Important Notes

⚠️ **Wait 5 minutes** after saving for changes to take effect.

⚠️ If you're testing on localhost, make sure to add both `localhost:3000` and `127.0.0.1:3000`.

⚠️ For production, replace `yourdomain.com` with your actual domain.

## Testing

After setting up restrictions, test your app:
1. Make sure backend is running: `cd backend && npm start`
2. Make sure frontend is running: `cd frontend && npm start`
3. Open `http://localhost:3000` in your browser
4. Try getting a route

## Troubleshooting

If you get "REQUEST_DENIED" errors:
- Check that all required APIs are enabled
- Verify API restrictions include the correct APIs
- Wait 5 minutes for changes to propagate
- Check browser console for specific error messages

