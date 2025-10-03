import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MonitoringData, UrlCheck } from '../types';

export const useMonitoring = (timeRange: 'day' | 'week' | 'month' = 'week', collectionName: string = 'monitoring') => {
  const [currentData, setCurrentData] = useState<UrlCheck[]>([]);
  const [historicalData, setHistoricalData] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 10min intervals: 1 day = 144, 7 days = 1008, 30 days = 4320
    const limitCount = timeRange === 'day' ? 144 : timeRange === 'week' ? 1008 : 4320;

    const q = query(
      collection(db, collectionName),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: MonitoringData[] = [];

      snapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          timestamp: docData.timestamp instanceof Timestamp
            ? docData.timestamp.toMillis()
            : docData.timestamp,
          checks: docData.checks || []
        });
      });

      data.sort((a, b) => a.timestamp - b.timestamp);

      setHistoricalData(data);
      if (data.length > 0) {
        setCurrentData(data[data.length - 1].checks);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [timeRange, collectionName]);

  return { currentData, historicalData, loading };
};
