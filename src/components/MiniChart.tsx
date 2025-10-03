import React from 'react';

interface MiniChartProps {
  data?: number[];
  color: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, color }) => {
  // Generate smooth random sparkline data for visual effect if no data provided
  const points = 7;
  const chartData = data || Array.from({ length: points }, () => Math.random() * 40 + 50);

  const width = 400;
  const height = 80;
  const padding = 5;
  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = max - min || 1;

  // Create smooth curve using quadratic bezier curves
  const createSmoothPath = () => {
    const points = chartData.map((value, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (value - min) / range) * (height - padding * 2);
      return { x, y };
    });

    if (points.length === 0) return '';

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;

      path += ` Q ${controlX},${current.y} ${controlX},${(current.y + next.y) / 2}`;
      path += ` Q ${controlX},${next.y} ${next.x},${next.y}`;
    }

    return path;
  };

  const smoothPath = createSmoothPath();
  const dataPoints = chartData.map((value, index) => {
    const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  // Create area path (same as line but closes at bottom)
  const areaPath = smoothPath + ` L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  const gradientId = `gradient-${color.replace('#', '')}`;

  return (
    <svg width="100%" height="80" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
      />

      {/* Line */}
      <path
        d={smoothPath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Draw dots on each data point */}
      {dataPoints.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="3.5"
          fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      ))}
    </svg>
  );
};
