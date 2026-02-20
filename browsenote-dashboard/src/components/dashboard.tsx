import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number }>;
  trend: 'up' | 'down';
  trendValue: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
        <Icon size={24} />
      </div>
      <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-lg ${
        trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">{title}</h3>
    <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
  </div>
);

const AppDashboard = () => {
  return (
    <div className="w-full space-y-8">
      {/* Header Section - Spans Full Width */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 mt-1">Real-time performance and user engagement metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-sm font-semibold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            Export PDF
          </button>
          <button className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid - Auto-scaling columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$42,500" icon={DollarSign} trend="up" trendValue="12.5%" />
        <StatCard title="New Customers" value="+2,450" icon={Users} trend="up" trendValue="8.2%" />
        <StatCard title="Orders" value="156" icon={ShoppingCart} trend="down" trendValue="3.1%" />
        <StatCard title="Active Now" value="42" icon={Activity} trend="up" trendValue="14%" />
      </div>

      {/* Content Section - Balanced 2/3 and 1/3 split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Analytics Chart Box */}
        <div className="xl:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Performance Metrics</h4>
              <p className="text-sm text-gray-400">Net profit vs Expense</p>
            </div>
            <select className="text-sm font-medium border-gray-200 rounded-lg bg-gray-50 p-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 w-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
             <span className="text-gray-400 font-medium">Chart visualization engine loading...</span>
          </div>
        </div>

        {/* Activity Feed Box */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h4 className="text-lg font-bold text-gray-900">Recent Activity</h4>
             <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">LIVE</span>
          </div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 before:to-transparent">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative flex items-center gap-4 group">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white shrink-0 group-hover:scale-125 transition-transform" />
                <div>
                  <p className="text-sm text-gray-800 font-semibold">New order processed #892{i}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{i * 3} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-10 w-full py-3 text-sm text-gray-600 font-bold bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDashboard;