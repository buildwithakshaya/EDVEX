import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'auto' | 'indigo' | 'emerald' | 'amber' | 'blue';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  showLabel = false,
  color = 'auto',
  className = ''
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  let barColor = 'bg-indigo-600';
  if (color === 'auto') {
    if (clampedValue >= 75) barColor = 'bg-emerald-600';
    else if (clampedValue >= 50) barColor = 'bg-indigo-600';
    else if (clampedValue >= 30) barColor = 'bg-amber-500';
    else barColor = 'bg-rose-500';
  } else if (color === 'emerald') {
    barColor = 'bg-emerald-600';
  } else if (color === 'amber') {
    barColor = 'bg-amber-500';
  } else if (color === 'blue') {
    barColor = 'bg-blue-600';
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-medium text-slate-700">Progress</span>
          <span className="font-bold text-slate-900">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightMap[size]}`}>
        <div
          className={`${heightMap[size]} ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
