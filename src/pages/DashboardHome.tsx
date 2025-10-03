import React from 'react';
import { Link } from 'react-router-dom';
import { useMonitoring } from '../hooks/useMonitoring';
import { MiniChart } from '../components/MiniChart';

export const DashboardHome: React.FC = () => {
  const { currentData, historicalData, loading } = useMonitoring('week');
  const { currentData: frontpageData, historicalData: frontpageHistoricalData, loading: frontpageLoading } = useMonitoring('week', 'frontpage-monitoring');

  const calculateStats = () => {
    if (currentData.length === 0) {
      return {
        total: 0,
        succeeded: 0,
        failed: 0,
        avgLoadTime: 0,
        uptime: 0,
        lastUpdated: null
      };
    }

    const succeeded = currentData.filter(check => check.success).length;
    const failed = currentData.length - succeeded;
    const totalResponseTime = currentData.reduce((sum, check) => sum + check.responseTime, 0);
    const avgLoadTime = Math.round(totalResponseTime / currentData.length);
    const lastUpdated = currentData[0]?.timestamp;
    const uptime = Math.round((succeeded / currentData.length) * 100);

    return {
      total: currentData.length,
      succeeded,
      failed,
      avgLoadTime,
      uptime,
      lastUpdated
    };
  };

  const stats = calculateStats();
  const frontpage = frontpageData[0];

  // Get last 1 hour of data for charts (6 data points, one every 10 minutes)
  const sampleChartData = (data: typeof historicalData) => {
    if (data.length === 0) return { values: [], timestamps: [] };

    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    // Filter data from last hour
    const recentData = data.filter(item => item.timestamp >= oneHourAgo);

    if (recentData.length === 0) return { values: [], timestamps: [] };

    // Take up to 6 most recent data points (last hour at 10-min intervals)
    const sampledData = [];
    const sampledTimestamps = [];
    const maxPoints = 6;
    const startIndex = Math.max(0, recentData.length - maxPoints);

    for (let i = startIndex; i < recentData.length; i++) {
      const item = recentData[i];

      // Calculate average response time for this data point
      const avgResponseTime = item.checks.reduce((sum, check) => sum + check.responseTime, 0) / item.checks.length;
      sampledData.push(Math.round(avgResponseTime));
      sampledTimestamps.push(item.timestamp);
    }

    return { values: sampledData, timestamps: sampledTimestamps };
  };

  const indexPagesChartData = sampleChartData(historicalData);
  const frontpageChartData = sampleChartData(frontpageHistoricalData);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your website's health and performance</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">
          <div className="inline-block w-12 h-12 border-4 border-vibrant-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading monitoring data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Index Pages Card */}
          <Link to="/index-pages" className="block">
            <div className="card-gradient rounded-2xl p-8 hover:border-vibrant-cyan transition-all cursor-pointer border border-transparent relative overflow-hidden group">
              {/* Green indicator for OK status */}
              <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>

              {/* Background Chart */}
              <div className="absolute inset-0 opacity-30">
                <MiniChart color="#ff00ff" data={indexPagesChartData.values} timestamps={indexPagesChartData.timestamps} />
              </div>

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-sm text-gray-300 font-medium">Index Pages</h3>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">{stats.uptime}%</p>
                  <p className="text-sm text-gray-500">{stats.succeeded} of {stats.total} pages online</p>
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Avg load time</span>
                  <span className="text-white font-semibold">{stats.avgLoadTime}ms</span>
                </div>

                <div className="text-xs text-gray-500">
                  Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
                </div>
              </div>
            </div>
          </Link>

          {/* Frontpage Card */}
          {frontpageLoading ? (
            <div className="card-gradient rounded-2xl p-8 border border-gray-700 relative overflow-hidden opacity-60">
              <div className="text-center text-gray-400 py-8">
                <div className="inline-block w-8 h-8 border-4 border-vibrant-cyan border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : frontpage ? (
            <Link to="/frontpage" className="block">
              <div className="card-gradient rounded-2xl p-8 hover:border-vibrant-cyan transition-all cursor-pointer border border-transparent relative overflow-hidden group">
                {/* Status indicator */}
                <div className={`absolute top-0 left-0 w-2 h-full ${frontpage.success ? 'bg-green-500' : 'bg-red-500'}`}></div>

                {/* Background Chart */}
                <div className="absolute inset-0 opacity-30">
                  <MiniChart color="#00f5ff" data={frontpageChartData.values} timestamps={frontpageChartData.timestamps} />
                </div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {frontpage.success ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <h3 className="text-sm text-gray-300 font-medium">Frontpage</h3>
                    </div>
                    <p className={`text-4xl font-bold mb-1 ${frontpage.success ? 'text-white' : 'text-red-400'}`}>
                      {frontpage.success ? '100%' : '0%'}
                    </p>
                    <p className="text-sm text-gray-500">{frontpage.success ? 'Online' : 'Offline'}</p>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Avg load time</span>
                    <span className="text-white font-semibold">{frontpage.responseTime}ms</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(frontpage.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/frontpage" className="block">
              <div className="card-gradient rounded-2xl p-8 border border-gray-700 relative overflow-hidden opacity-60 hover:opacity-80 transition">
                <div className="absolute top-0 left-0 w-2 h-full bg-gray-600"></div>
                <div className="text-center text-gray-400 py-8">
                  <p>No data yet - Click to configure</p>
                </div>
              </div>
            </Link>
          )}

          {/* Case View - Dummy Card */}
          <div className="card-gradient rounded-2xl p-8 border border-gray-700 relative overflow-hidden opacity-60">
            <div className="absolute top-0 left-0 w-2 h-full bg-gray-600"></div>

            {/* Background Chart */}
            <div className="absolute inset-0 opacity-30">
              <MiniChart color="#ffeb3b" />
            </div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm text-gray-400 font-medium">Case View</h3>
                </div>
                <p className="text-4xl font-bold text-gray-600 mb-1">--</p>
                <p className="text-sm text-gray-600">Not configured</p>
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Avg load time</span>
                <span className="text-gray-600 font-semibold">-- ms</span>
              </div>

              <div className="text-xs text-gray-600">
                Last updated: Never
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
