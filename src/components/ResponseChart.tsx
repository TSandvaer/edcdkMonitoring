import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonitoringData } from '../types';

interface ResponseChartProps {
  data: MonitoringData[];
  timeRange: 'day' | 'week' | 'month';
}

const COLORS = [
  '#00f5ff', '#00d4ff', '#00b3ff', '#0092ff', '#ff00ff',
  '#ff3399', '#ff6b00', '#ff9500', '#ffeb3b', '#d4ff00'
];

export const ResponseChart: React.FC<ResponseChartProps> = ({ data, timeRange }) => {
  const chartData = data.map(entry => {
    const date = new Date(entry.timestamp);
    const dataPoint: any = {
      time: timeRange === 'day'
        ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleTimeString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit'
          })
    };

    entry.checks.forEach((check, index) => {
      const urlKey = `url${index}`;
      dataPoint[urlKey] = check.responseTime;
    });

    return dataPoint;
  });

  // Sample every nth point to avoid overcrowding
  const sampleRate = timeRange === 'day' ? 3 : timeRange === 'week' ? 6 : 12;
  const sampledData = chartData.filter((_, index) => index % sampleRate === 0);

  return (
    <div className="card-gradient rounded-xl p-6">
      <h2 className="text-vibrant-cyan text-xl font-bold mb-6">Response Time History</h2>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={sampledData}>
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="time"
            stroke="#888"
            tick={{ fill: '#888', fontSize: 11 }}
          />
          <YAxis
            stroke="#888"
            tick={{ fill: '#888', fontSize: 11 }}
            label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', fill: '#888' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 10, 46, 0.95)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px' }}
            iconType="line"
          />
          {[...Array(10)].map((_, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={`url${index}`}
              stroke={COLORS[index]}
              fillOpacity={1}
              fill={`url(#gradient${index})`}
              strokeWidth={2}
              name={`URL ${index + 1}`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
