/**
 * Google Analytics Data API - Countries Endpoint
 * Fetches real-time country data from Google Analytics 4
 * 
 * Environment Variables Required:
 * - GA4_PROPERTY_ID: Your GA4 Property ID (e.g., 123456789)
 * - GA4_SERVICE_ACCOUNT_EMAIL: Service account email from Google Cloud Console
 * - GA4_PRIVATE_KEY: Service account private key (base64 encoded or raw)
 * - GA4_CLIENT_EMAIL: Service account client email (same as above, for clarity)
 * 
 * OR use a service account JSON file:
 * - GA4_SERVICE_ACCOUNT_KEY: Full JSON key as a string (base64 encoded)
 */

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const cors = require('cors');

// CORS middleware
const corsMiddleware = cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  credentials: true
});

// Initialize Analytics Data client
let analyticsDataClient = null;

const initializeClient = () => {
  if (analyticsDataClient) {
    return analyticsDataClient;
  }

  try {
    // Option 1: Use service account JSON from environment variable
    if (process.env.GA4_SERVICE_ACCOUNT_KEY) {
      const serviceAccountKey = JSON.parse(
        Buffer.from(process.env.GA4_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
      );
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: serviceAccountKey
      });
    }
    // Option 2: Use individual credentials from environment variables
    else if (process.env.GA4_PRIVATE_KEY && process.env.GA4_CLIENT_EMAIL) {
      const privateKey = process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n');
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: process.env.GA4_CLIENT_EMAIL,
          private_key: privateKey,
          project_id: process.env.GA4_PROJECT_ID || 'portfolio-analytics'
        }
      });
    }
    // Option 3: Use default credentials (for local development with gcloud auth)
    else {
      analyticsDataClient = new BetaAnalyticsDataClient();
    }

    return analyticsDataClient;
  } catch (error) {
    console.error('Error initializing Analytics Data client:', error);
    throw error;
  }
};

// Country code to country name mapping
const countryCodeMap = {
  'TR': 'Turkey',
  'US': 'United States',
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'CA': 'Canada',
  'AU': 'Australia',
  'JP': 'Japan',
  'CN': 'China',
  'BR': 'Brazil',
  'IN': 'India',
  'RU': 'Russia',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'PL': 'Poland',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'PT': 'Portugal',
  'GR': 'Greece',
  'IE': 'Ireland',
  'NZ': 'New Zealand',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'PH': 'Philippines',
  'ID': 'Indonesia',
  'KR': 'South Korea',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',
};

// Main handler function
const handler = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return corsMiddleware(req, res, () => res.status(200).end());
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return corsMiddleware(req, res, () => {
      res.status(405).json({ error: 'Method not allowed' });
    });
  }

  try {
    // Initialize client
    const client = initializeClient();
    
    // Get property ID from environment
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      throw new Error('GA4_PROPERTY_ID environment variable is not set');
    }

    // Calculate date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Fetch country data from GA4
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      ],
      dimensions: [
        {
          name: 'country',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViews',
        },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'activeUsers',
          },
          desc: true,
        },
      ],
      limit: 50, // Top 50 countries
    });

    // Process the response
    const countryData = [];
    let totalVisitors = 0;
    let totalPageViews = 0;

    if (response.rows) {
      response.rows.forEach((row) => {
        const countryCode = row.dimensionValues[0].value;
        const visitors = parseInt(row.metricValues[0].value) || 0;
        const pageViews = parseInt(row.metricValues[1].value) || 0;

        totalVisitors += visitors;
        totalPageViews += pageViews;

        // Get country name from code
        const countryName = countryCodeMap[countryCode] || countryCode;

        countryData.push({
          country: countryName,
          countryCode: countryCode,
          visitors: visitors,
          pageViews: pageViews,
        });
      });
    }

    // Calculate percentages
    const countryDataWithPercentage = countryData.map((country) => ({
      ...country,
      percentage: totalVisitors > 0 
        ? Math.round((country.visitors / totalVisitors) * 100) 
        : 0,
    }));

    // Sort by visitors (descending)
    countryDataWithPercentage.sort((a, b) => b.visitors - a.visitors);

    // Return the data
    return corsMiddleware(req, res, () => {
      res.status(200).json({
        success: true,
        data: countryDataWithPercentage,
        totalVisitors,
        totalPageViews,
        dateRange: {
          start: thirtyDaysAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        },
        lastUpdated: new Date().toISOString(),
      });
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    return corsMiddleware(req, res, () => {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch analytics data',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    });
  }
};

// Export handler for Vercel
module.exports = handler;

// For local development with Express
if (require.main === module) {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.get('/api/analytics/countries', handler);
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Analytics API server running on port ${PORT}`);
  });
}

