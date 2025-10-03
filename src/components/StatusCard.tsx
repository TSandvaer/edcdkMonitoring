import React from 'react';
import { UrlCheck } from '../types';

interface StatusCardProps {
  check: UrlCheck;
}

export const StatusCard: React.FC<StatusCardProps> = ({ check }) => {
  const uptime = check.success ? 100 : 0;
  const statusColor = check.success ? '#00f5ff' : '#ff00ff';

  return (
    <div className="card-gradient rounded-xl p-6 flex flex-col items-center">
      {/* Circular Progress Gauge */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={statusColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - uptime / 100)}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease',
              filter: `brightness(1.2)`
            }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center flex-col"
          style={{
            filter: `drop-shadow(0 0 10px ${statusColor})`
          }}
        >
          <span className="text-3xl font-bold" style={{ color: statusColor }}>
            {check.status}
          </span>
        </div>
      </div>

      {/* URL Label */}
      <h3 className="text-vibrant-cyan text-xs font-semibold mb-2 text-center break-all px-2">
        {check.url}
      </h3>

      {/* Response Time */}
      <p className="text-gray-400 text-xs mb-1">Response Time</p>
      <p className="text-white text-lg font-medium">{check.responseTime}ms</p>

      {/* Status */}
      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
        check.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {check.success ? 'Online' : 'Offline'}
      </div>
    </div>
  );
};
