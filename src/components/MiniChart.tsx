import React from 'react';

interface MiniChartProps {
  data?: number[];
  timestamps?: number[];
  color: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, timestamps, color }) => {
  // Generate smooth random sparkline data for visual effect if no data provided
  const points = 6;
  const chartData = data || Array.from({ length: points }, () => Math.random() * 40 + 50);

  // Generate x-axis labels from timestamps (showing minutes)
  const generateXAxisLabels = () => {
    if (!timestamps || timestamps.length === 0) {
      return ['-60m', '-50m', '-40m', '-30m', '-20m', '-10m'];
    }

    const now = Date.now();
    return timestamps.map(ts => {
      const minutesAgo = Math.round((now - ts) / (60 * 1000));
      return `-${minutesAgo}m`;
    });
  };

  const width = 200;
  const height = 100;
  const paddingTop = 10;
  const paddingBottom = 20;
  const paddingLeft = 30;
  const paddingRight = 15;
  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = max - min || 1;

  // Create smooth curve using quadratic bezier curves
  const createSmoothPath = () => {
    const points = chartData.map((value, index) => {
      const x = paddingLeft + (index / (chartData.length - 1)) * (width - paddingLeft - paddingRight);
      const y = paddingTop + (1 - (value - min) / range) * (height - paddingTop - paddingBottom);
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
    const x = paddingLeft + (index / (chartData.length - 1)) * (width - paddingLeft - paddingRight);
    const y = paddingTop + (1 - (value - min) / range) * (height - paddingTop - paddingBottom);
    return { x, y };
  });

  // Create area path (same as line but closes at bottom)
  const chartBottom = height - paddingBottom;
  const areaPath = smoothPath + ` L ${width - paddingRight},${chartBottom} L ${paddingLeft},${chartBottom} Z`;

  // Y-axis labels
  const yAxisValues = [Math.round(max), Math.round((max + min) / 2), Math.round(min)];
  const yAxisPositions = [paddingTop, (paddingTop + chartBottom) / 2, chartBottom];

  // X-axis labels (time points)
  const xAxisLabels = generateXAxisLabels();

  const gradientId = `gradient-${color.replace('#', '')}`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Y-axis grid lines and labels */}
      {yAxisValues.map((value, index) => (
        <g key={index} opacity="0.5">
          <line
            x1={paddingLeft}
            y1={yAxisPositions[index]}
            x2={width - paddingRight}
            y2={yAxisPositions[index]}
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
          <text
            x={paddingLeft - 4}
            y={yAxisPositions[index]}
            fontSize="6"
            fill="#aaaaaa"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {value}
          </text>
        </g>
      ))}

      {/* X-axis */}
      <line
        x1={paddingLeft}
        y1={chartBottom}
        x2={width - paddingRight}
        y2={chartBottom}
        stroke="#ffffff"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* X-axis labels */}
      {dataPoints.map((point, index) => (
        <text
          key={index}
          x={point.x}
          y={chartBottom + 12}
          fontSize="6"
          fill="#aaaaaa"
          textAnchor="middle"
          opacity="0.9"
        >
          {xAxisLabels[index]}
        </text>
      ))}

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
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Draw dots on each data point */}
      {dataPoints.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="1.2"
          fill={color}
          style={{ filter: `drop-shadow(0 0 2px ${color})` }}
        />
      ))}
    </svg>
  );
};
