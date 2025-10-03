import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

admin.initializeApp();

const MONITORED_URLS = [
  'https://www.edc.dk/bolig/',
  'https://www.edc.dk/bolig/villa/',
  'https://www.edc.dk/bolig/villalejlighed/',
  'https://www.edc.dk/bolig/raekkehus/',
  'https://www.edc.dk/bolig/ejerlejlighed/',
  'https://www.edc.dk/bolig/sommerhus/',
  'https://www.edc.dk/bolig/fritidsgrund/',
  'https://www.edc.dk/bolig/helaarsgrund/',
  'https://www.edc.dk/bolig/andelsbolig/',
  'https://www.edc.dk/bolig/landejendom/',
];

const FRONTPAGE_URL = 'https://www.edc.dk';

interface UrlCheck {
  url: string;
  status: number;
  responseTime: number;
  timestamp: number;
  success: boolean;
}

async function checkUrl(url: string): Promise<UrlCheck> {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'EDC-Monitoring-Bot/1.0'
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    const responseTime = Date.now() - startTime;

    return {
      url,
      status: response.status,
      responseTime,
      timestamp: Date.now(),
      success: response.status === 200
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`Error checking ${url}:`, error);

    return {
      url,
      status: 0,
      responseTime,
      timestamp: Date.now(),
      success: false
    };
  }
}

// Scheduled function that runs every 10 minutes
export const monitorUrls = functions.scheduler.onSchedule('*/10 * * * *', async () => {
  console.log('Starting URL monitoring...');

  try {
    // Check all URLs in parallel
    const checkPromises = MONITORED_URLS.map(url => checkUrl(url));
    const checks = await Promise.all(checkPromises);

    // Save to Firestore
    const db = admin.firestore();
    const timestamp = Date.now();

    await db.collection('monitoring').doc(timestamp.toString()).set({
      timestamp,
      checks,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Successfully monitored ${checks.length} URLs`);

    // Log results
    checks.forEach(check => {
      console.log(`${check.url}: ${check.status} (${check.responseTime}ms)`);
    });
  } catch (error) {
    console.error('Error in monitoring function:', error);
    throw error;
  }
});

// HTTP function for manual testing
export const testMonitoring = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const checkPromises = MONITORED_URLS.map(url => checkUrl(url));
    const checks = await Promise.all(checkPromises);

    const db = admin.firestore();
    const timestamp = Date.now();

    await db.collection('monitoring').doc(timestamp.toString()).set({
      timestamp,
      checks,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      timestamp,
      checks
    });
  } catch (error) {
    console.error('Error in test function:', error);
    res.status(500).json({ error: 'Monitoring failed' });
  }
});

// Frontpage Monitoring - Scheduled function that runs every 10 minutes
export const monitorFrontpage = functions.scheduler.onSchedule('*/10 * * * *', async () => {
  console.log('Starting frontpage monitoring...');

  try {
    const check = await checkUrl(FRONTPAGE_URL);

    // Save to Firestore
    const db = admin.firestore();
    const timestamp = Date.now();

    await db.collection('frontpage-monitoring').doc(timestamp.toString()).set({
      timestamp,
      checks: [check],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Frontpage monitored: ${check.url} - ${check.status} (${check.responseTime}ms)`);
  } catch (error) {
    console.error('Error in frontpage monitoring function:', error);
    throw error;
  }
});

// HTTP function for manual frontpage testing
export const testFrontpageMonitoring = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const check = await checkUrl(FRONTPAGE_URL);

    const db = admin.firestore();
    const timestamp = Date.now();

    await db.collection('frontpage-monitoring').doc(timestamp.toString()).set({
      timestamp,
      checks: [check],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      timestamp,
      check
    });
  } catch (error) {
    console.error('Error in frontpage test function:', error);
    res.status(500).json({ error: 'Frontpage monitoring failed' });
  }
});
