import { useState } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';

export const Frontpage = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { currentData, historicalData, loading } = useMonitoring(timeRange, 'frontpage-monitoring');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://us-central1-edcdk-dashboard.cloudfunctions.net/testFrontpageMonitoring');
      const data = await response.json();
      console.log('Frontpage refresh triggered:', data);
    } catch (error) {
      console.error('Failed to trigger frontpage refresh:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 2000);
    }
  };

  const frontpageData = currentData[0];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Frontpage Monitoring</h1>
          <p className="text-gray-400">Real-time status monitoring for EDC.dk main page</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Time Range Toggle */}
          <div className="flex bg-dark-purple-700 rounded-lg p-1">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                timeRange === 'day'
                  ? 'bg-vibrant-cyan text-dark-purple-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                timeRange === 'week'
                  ? 'bg-vibrant-cyan text-dark-purple-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                timeRange === 'month'
                  ? 'bg-vibrant-cyan text-dark-purple-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Month
            </button>
          </div>

          {/* Last Updated */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Last updated</p>
              <p className="text-sm text-gray-300">
                {frontpageData
                  ? new Date(frontpageData.timestamp).toLocaleTimeString()
                  : '--:--:--'}
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 rounded-lg bg-dark-purple-700 text-vibrant-cyan hover:bg-dark-purple-600 transition disabled:opacity-50"
              title="Refresh monitoring data"
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">
          <div className="inline-block w-12 h-12 border-4 border-vibrant-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading monitoring data...</p>
        </div>
      ) : frontpageData ? (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="card-gradient rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Status</p>
              <p className={`text-4xl font-bold ${frontpageData.success ? 'text-green-400' : 'text-red-400'}`}>
                {frontpageData.status}
              </p>
              <p className={`text-sm mt-2 ${frontpageData.success ? 'text-green-400' : 'text-red-400'}`}>
                {frontpageData.success ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="card-gradient rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Response Time</p>
              <p className="text-4xl font-bold text-vibrant-pink">{frontpageData.responseTime}ms</p>
            </div>
            <div className="card-gradient rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">URL</p>
              <p className="text-lg font-medium text-white break-all">{frontpageData.url}</p>
            </div>
          </div>

          {/* Response Time Chart */}
          <div className="card-gradient rounded-xl p-6">
            <h2 className="text-vibrant-cyan text-xl font-bold mb-6">Response Time History</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Chart visualization coming soon...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-400 py-20">
          <p>No monitoring data available yet.</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-6 py-3 bg-vibrant-cyan text-dark-purple-900 rounded-lg font-semibold hover:bg-vibrant-cyan/90 transition"
          >
            Run First Test
          </button>
        </div>
      )}
    </div>
  );
};
