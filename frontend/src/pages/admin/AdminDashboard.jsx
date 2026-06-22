import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FaUsers, FaCalendarCheck, FaMoneyBillWave, FaFutbol } from 'react-icons/fa';

const COLORS = ['#6D28D9', '#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const mockStats = {
  total_users: 42,
  total_bookings: 128,
  total_revenue: 14500000,
  most_popular_field: 'Lapangan A',
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
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: <FaUsers />, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Bookings', value: stats.total_bookings, icon: <FaCalendarCheck />, color: 'from-brand-600 to-indigo-600' },
    { label: 'Total Revenue', value: `Rp ${parseInt(stats.total_revenue || 0).toLocaleString()}`, icon: <FaMoneyBillWave />, color: 'from-green-500 to-emerald-600' },
    { label: 'Top Field', value: stats.most_popular_field || 'N/A', icon: <FaFutbol />, color: 'from-amber-500 to-orange-600' },
  ];

  const chartData = stats.monthly_bookings.map(m => ({
    name: monthNames[m.month - 1],
    bookings: m.count
  }));

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of POLISOCCER operations and statistics.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-sm">{card.label}</p>
                <p className="text-2xl font-extrabold mt-1 break-words">{card.value}</p>
              </div>
              <div className="text-3xl opacity-30">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-6">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#6D28D9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-6">Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.status_distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                {stats.status_distribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}