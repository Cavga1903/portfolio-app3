# 📊 Google Analytics Data API Setup Guide

This guide explains how to set up the Google Analytics Data API to fetch real-time analytics data for the dashboard.

## 🎯 Overview

The dashboard now fetches real country data from Google Analytics 4 (GA4) instead of using mock data. This requires:

1. A Google Cloud Project with Analytics Data API enabled
2. A Service Account with proper permissions
3. Environment variables configured in your backend

## 📋 Prerequisites

- A Google Analytics 4 property
- A Google Cloud Project
- Access to Google Cloud Console
- Vercel account (or your deployment platform)

## 🚀 Step-by-Step Setup

### Step 1: Enable Google Analytics Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Library**
4. Search for "Google Analytics Data API"
5. Click **Enable**

### Step 2: Create a Service Account

1. In Google Cloud Console, go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Fill in the details:
   - **Name**: `portfolio-analytics-service`
   - **Description**: `Service account for portfolio analytics API`
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**

### Step 3: Grant Analytics Access to Service Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GA4 property
3. Click **Admin** (gear icon) in the bottom left
4. Under **Property**, click **Property access management**
5. Click **+** to add a new user
6. Enter the service account email (from Step 2)
7. Select role: **Viewer** (minimum required)
8. Click **Add**

### Step 4: Create and Download Service Account Key

1. Go back to Google Cloud Console → **Service Accounts**
2. Click on your service account
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Select **JSON** format
6. Click **Create** (this downloads the JSON key file)

### Step 5: Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GA4 property
3. Click **Admin** (gear icon)
4. Under **Property**, click **Property Settings**
5. Copy the **Property ID** (it's a number like `123456789`)

### Step 6: Configure Environment Variables

You have two options for configuring credentials:

#### Option A: Use Service Account JSON (Recommended)

1. Encode the JSON key file to base64:
   ```bash
   cat path/to/service-account-key.json | base64
   ```

2. Copy the base64 string

3. Add to your Vercel environment variables:
   - **Key**: `GA4_SERVICE_ACCOUNT_KEY`
   - **Value**: The base64 encoded JSON string

#### Option B: Use Individual Credentials

Add these environment variables to Vercel:

- **GA4_PROPERTY_ID**: Your GA4 Property ID (e.g., `123456789`)
- **GA4_CLIENT_EMAIL**: Service account email (from the JSON key)
- **GA4_PRIVATE_KEY**: Service account private key (from the JSON key, keep the `\n` characters)
- **GA4_PROJECT_ID**: Your Google Cloud Project ID (optional, defaults to `portfolio-analytics`)

### Step 7: Configure Backend Environment Variables

In your Vercel project settings, add these environment variables:

**Required:**
- `GA4_PROPERTY_ID` - Your GA4 Property ID

**One of the following authentication methods:**

**Method 1 (Recommended):**
- `GA4_SERVICE_ACCOUNT_KEY` - Base64 encoded service account JSON

**Method 2:**
- `GA4_CLIENT_EMAIL` - Service account email
- `GA4_PRIVATE_KEY` - Service account private key
- `GA4_PROJECT_ID` - Google Cloud Project ID (optional)

**Optional:**
- `ALLOWED_ORIGIN` - CORS origin (defaults to `*`)

### Step 8: Deploy Backend

1. Make sure `backend/api/analytics/countries.js` is in your repository
2. Push to your main branch
3. Vercel will automatically deploy the new serverless function

### Step 9: Configure Frontend API Endpoint

Add to your frontend `.env` file (or Vercel environment variables):

```env
VITE_ANALYTICS_API_ENDPOINT=/api/analytics/countries
```

Or if your backend is on a different domain:

```env
VITE_ANALYTICS_API_ENDPOINT=https://your-backend.vercel.app/api/analytics/countries
```

## 🧪 Testing

### Test the API Endpoint

```bash
curl https://your-project.vercel.app/api/analytics/countries
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "country": "Turkey",
      "countryCode": "TR",
      "visitors": 1250,
      "pageViews": 3420,
      "percentage": 45
    },
    ...
  ],
  "totalVisitors": 5000,
  "totalPageViews": 12000,
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "lastUpdated": "2024-01-31T12:00:00.000Z"
}
```

### Test in Dashboard

1. Navigate to your admin dashboard
2. Go to the **Overview** tab
3. Check the **Country Distribution** section
4. Data should load automatically
5. Click the refresh button to manually update

## 🔒 Security Notes

1. **Never commit service account keys to Git**
   - Always use environment variables
   - Use base64 encoding for JSON keys in environment variables

2. **Limit CORS origins in production**
   - Set `ALLOWED_ORIGIN` to your specific domain
   - Example: `https://www.tolgacavga.com`

3. **Service Account Permissions**
   - Only grant **Viewer** role in Google Analytics
   - This is the minimum required permission

4. **Rate Limiting**
   - Google Analytics Data API has rate limits
   - The dashboard refreshes every 5 minutes automatically
   - Manual refresh is also available

## 🐛 Troubleshooting

### Error: "GA4_PROPERTY_ID environment variable is not set"

- Make sure you've added `GA4_PROPERTY_ID` to your Vercel environment variables
- Redeploy after adding environment variables

### Error: "Failed to authenticate"

- Check that your service account key is correctly formatted
- If using base64, make sure it's properly encoded
- Verify the service account has access to your GA4 property

### Error: "Permission denied"

- Verify the service account email has been added to GA4 property access
- Check that the service account has at least **Viewer** role

### Error: "API not enabled"

- Make sure Google Analytics Data API is enabled in Google Cloud Console
- Wait a few minutes after enabling for the API to propagate

### No data showing

- Check that your GA4 property has data
- Verify the date range (last 30 days)
- Check browser console for API errors

## 📚 Additional Resources

- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Service Account Setup Guide](https://cloud.google.com/iam/docs/service-accounts)
- [GA4 Property ID Guide](https://support.google.com/analytics/answer/9304153)

## 🔄 Updating Data

The dashboard automatically refreshes data every 5 minutes. You can also:

- Click the refresh button (🔄) in the Country Distribution section
- The data shows the last 30 days of analytics

## 📝 Notes

- The API fetches data for the last 30 days
- Data is sorted by number of visitors (descending)
- Top 50 countries are shown
- Percentages are calculated based on total visitors

