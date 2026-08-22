import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  trend?: {
    value: string;
    isUp: boolean;
  };
}

const colorMap = {
  indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  amber: 'text-amber-600 bg-amber-50 border-amber-100',
  rose: 'text-rose-600 bg-rose-50 border-rose-100',
  slate: 'text-slate-600 bg-slate-50 border-slate-100',
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, colorScheme, trend }) => {
  return (
    <div className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer overflow-hidden relative">
      {/* Subtle background glow effect on hover */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-${colorScheme}-500`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">{value}</h3>
          
          {trend && (
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <span className={`flex items-center ${trend.isUp ? 'text-emerald-600' : 'text-rose-600'} font-medium`}>
                <i className={`fas ${trend.isUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
                {trend.value}
              </span>
              <span className="text-slate-400">vs bulan lalu</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${colorMap[colorScheme]}`}>
          <i className={`fas ${icon} text-lg w-5 h-5 flex items-center justify-center`}></i>
        </div>
      </div>
    </div>
  );
};

export const MetricsSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      <MetricCard 
        title="Total Laporan" 
        value="1,245" 
        icon="fa-file-alt" 
        colorScheme="indigo" 
        trend={{ value: '12%', isUp: true }}
      />
      <MetricCard 
        title="Menunggu Persetujuan" 
        value="18" 
        icon="fa-user-clock" 
        colorScheme="amber" 
        trend={{ value: '3', isUp: false }}
      />
      <MetricCard 
        title="Tenaga Ahli Aktif" 
        value="11" 
        icon="fa-users-cog" 
        colorScheme="emerald" 
      />
      <MetricCard 
        title="Kapasitas Server" 
        value="64%" 
        icon="fa-server" 
        colorScheme="rose" 
        trend={{ value: '2.5 GB', isUp: true }}
      />
    </div>
  );
};
