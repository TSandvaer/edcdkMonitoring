import { useState } from 'react';
import { StatusCard } from '../components/StatusCard';
import { ResponseChart } from '../components/ResponseChart';
import { useMonitoring } from '../hooks/useMonitoring';

export const IndexPages = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { currentData, historicalData, loading } = useMonitoring(timeRange);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Trigger the test monitoring function
      const response = await fetch('https://testmonitoring-5n7udgcbea-uc.a.run.app');
      const data = await response.json();
      console.log('Refresh triggered:', data);
    } catch (error) {
      console.error('Failed to trigger refresh:', error);
    } finally {
      // Keep spinning for a bit to show it's working
      setTimeout(() => setIsRefreshing(false), 2000);
    }
  };

  const calculateAverageResponseTime = () => {
    if (currentData.length === 0) return 0;
    const total = currentData.reduce((sum, check) => sum + check.responseTime, 0);
    return Math.round(total / currentData.length);
  };

  const calculateUptime = () => {
    if (currentData.length === 0) return 100;
    const successful = currentData.filter(check => check.success).length;
    return Math.round((successful / currentData.length) * 100);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Index Pages Monitoring</h1>
          <p className="text-gray-400">Real-time status monitoring for EDC.dk housing pages</p>
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
                {currentData.length > 0
                  ? new Date(currentData[0].timestamp).toLocaleTimeString()
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

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card-gradient rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Overall Uptime</p>
          <p className="text-4xl font-bold text-vibrant-cyan">{calculateUptime()}%</p>
        </div>
        <div className="card-gradient rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Avg Response Time</p>
          <p className="text-4xl font-bold text-vibrant-pink">{calculateAverageResponseTime()}ms</p>
        </div>
        <div className="card-gradient rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Endpoints</p>
          <p className="text-4xl font-bold text-vibrant-orange">{currentData.length}</p>
        </div>
      </div>

      {/* Status Cards Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-20">
          <div className="inline-block w-12 h-12 border-4 border-vibrant-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading monitoring data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {currentData.map((check, index) => (
              <StatusCard key={index} check={check} />
            ))}
          </div>

          {/* Response Time Chart */}
          <ResponseChart data={historicalData} timeRange={timeRange} />
        </>
      )}
    </div>
  );
};
