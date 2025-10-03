# EDC.dk Monitoring Dashboard

A real-time monitoring dashboard for EDC.dk website endpoints with Firebase integration.

## Features

- 🎨 **Modern Dark Theme** - Inspired by professional monitoring dashboards with purple gradients
- 📊 **Real-time Monitoring** - Live status updates via Firebase Firestore
- 📈 **Historical Charts** - Week/Month view of response times
- ⚡ **Automated Testing** - Scheduled checks every 10 minutes
- 🎯 **10 Endpoints Monitored** - All major EDC.dk pages across languages

## Monitored URLs

- Danish, English, Polish, and Romanian home pages
- Course pages in all languages
- About pages

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Backend**: Firebase Cloud Functions
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Cloud Functions
4. Update `.firebaserc` with your project ID
5. Update `src/lib/firebase.ts` with your Firebase config (found in Project Settings > General)

### 3. Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore
```

### 4. Deploy Cloud Functions

```bash
cd functions
npm run build
npm run deploy
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```

## Cloud Function Schedule

The `monitorUrls` function runs every 10 minutes and:
1. Tests all 10 URLs
2. Records status code and response time
3. Saves results to Firestore
4. Dashboard updates automatically via real-time listeners

## Manual Testing

You can manually trigger a monitoring check:

```bash
# After deploying functions, get the testMonitoring URL
firebase functions:list

# Visit the URL in browser or use curl
curl https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/testMonitoring
```

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── StatusCard.tsx      # Individual URL status display
│   │   ├── ResponseChart.tsx   # Historical response time chart
│   │   └── Sidebar.tsx         # Navigation sidebar
│   ├── hooks/
│   │   └── useMonitoring.ts    # Firestore data hook
│   ├── lib/
│   │   └── firebase.ts         # Firebase configuration
│   ├── types.ts                # TypeScript types
│   ├── App.tsx                 # Main app component
│   └── index.css               # Global styles
├── functions/
│   └── src/
│       └── index.ts            # Monitoring Cloud Function
├── firebase.json               # Firebase config
├── firestore.rules             # Security rules
└── firestore.indexes.json      # Database indexes
```

## Design Theme

- **Dark Purple Background**: Deep purple gradient (#0f0529 to #1a0a2e)
- **Vibrant Accents**: Cyan, pink, orange gradients for visual appeal
- **Card-based Layout**: Clean, organized metric cards
- **Circular Gauges**: Visual status indicators
- **Area Charts**: Smooth gradient charts for historical data

## Future Enhancements

- Test suite integration
- Alert notifications
- Performance metrics
- SSL certificate monitoring
- Custom alert thresholds
- Export reports

## License

MIT
