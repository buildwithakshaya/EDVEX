import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  highlight?: boolean;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlight = false,
  color = 'indigo',
  onClick
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 transition-all duration-200 shadow-xs ${
        highlight ? 'border-indigo-300 ring-2 ring-indigo-50' : 'border-slate-200'
      } ${onClick ? 'cursor-pointer hover:border-indigo-300 hover:shadow-sm' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {trend && (
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded-sm ${
                  trend.positive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                }`}
              >
                {trend.positive ? '+' : ''}{trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
