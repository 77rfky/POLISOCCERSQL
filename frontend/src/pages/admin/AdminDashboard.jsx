import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FaUsers, FaCalendarCheck, FaMoneyBillWave, FaFutbol } from 'react-icons/fa';

const COLORS = ['#8B5CF6', '#6366F1', '#EC4899', '#14B8A6', '#F59E0B'];

const mockStats = {
  total_users: 42,
  total_bookings: 128,
  total_revenue: 14500000,
  most_popular_field: 'Field A',
  monthly_bookings: [
    { month: 1, count: 12 }, { month: 2, count: 9 }, { month: 3, count: 15 },
    { month: 4, count: 20 }, { month: 5, count: 18 }, { month: 6, count: 28 },
  ],
  status_distribution: [
    { name: 'Confirmed', value: 55 },
    { name: 'Pending Payment', value: 30 },
    { name: 'Completed', value: 28 },
    { name: 'Cancelled', value: 10 },
    { name: 'Pending Verification', value: 5 },
  ]
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStats(data);
      } catch {
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
    </div>
  );

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: <FaUsers />, color: 'from-brand-500 to-indigo-600', shadow: 'shadow-[0_0_30px_rgba(99,102,241,0.3)]' },
    { label: 'Total Bookings', value: stats.total_bookings, icon: <FaCalendarCheck />, color: 'from-pink-500 to-rose-600', shadow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]' },
    { label: 'Total Revenue', value: `Rp ${parseInt(stats.total_revenue || 0).toLocaleString()}`, icon: <FaMoneyBillWave />, color: 'from-teal-400 to-emerald-600', shadow: 'shadow-[0_0_30px_rgba(20,184,166,0.3)]' },
    { label: 'Top Field', value: stats.most_popular_field || 'N/A', icon: <FaFutbol />, color: 'from-amber-400 to-orange-500', shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' },
  ];

  const chartData = stats.monthly_bookings.map(m => ({
    name: monthNames[m.month - 1],
    bookings: m.count
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-premium px-4 py-3 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-brand-300 font-bold mb-1">{label}</p>
          <p className="text-white font-black text-lg">{payload[0].value} <span className="text-text-muted text-sm font-medium">Bookings</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">System Overview</h1>
        <p className="text-brand-300 font-medium mt-2">Real-time metrics and analytics for your platform.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-gradient-to-br ${card.color} rounded-[2rem] p-6 text-white ${card.shadow} relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-white/80 font-medium text-sm tracking-wide uppercase mb-2">{card.label}</p>
                <p className="text-3xl font-black tracking-tighter break-words">{card.value}</p>
              </div>
              <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity drop-shadow-lg">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.3 }} 
          className="lg:col-span-2 glass-premium rounded-[2rem] border border-white/10 p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white text-xl">Booking Growth</h3>
            <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30">Last 6 Months</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="bookings" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorBookings)" activeDot={{ r: 8, fill: '#C084FC', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }} 
          className="glass-premium rounded-[2rem] border border-white/10 p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col"
        >
          <h3 className="font-bold text-white text-xl mb-6">Status Distribution</h3>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={stats.status_distribution} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  dataKey="value" 
                  paddingAngle={5}
                  stroke="none"
                >
                  {stats.status_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-3">
            {stats.status_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-text-secondary text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}