import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFutbol, FaTachometerAlt, FaUsers, FaFootballBall,
  FaTags, FaCalendarCheck, FaCreditCard, FaImages,
  FaBan, FaSignOutAlt, FaShieldAlt
} from 'react-icons/fa';

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"nama_lengkap":"Admin"}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/admin/users', icon: <FaUsers />, label: 'User Management' },
    { to: '/admin/fields', icon: <FaFootballBall />, label: 'Field Management' },
    { to: '/admin/pricing', icon: <FaTags />, label: 'Pricing Management' },
    { to: '/admin/bookings', icon: <FaCalendarCheck />, label: 'Booking Management' },
    { to: '/admin/payments', icon: <FaCreditCard />, label: 'Payment Verification' },
    { to: '/admin/gallery', icon: <FaImages />, label: 'Gallery Management' },
    { to: '/admin/cancellations', icon: <FaBan />, label: 'Cancellations' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40"
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaFutbol className="text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight">POLISOCCER</h1>
              <p className="text-xs text-brand-400 flex items-center gap-1"><FaShieldAlt className="text-xs" /> Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
              {user.nama_lengkap?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{user.nama_lengkap}</p>
              <p className="text-xs text-brand-400 font-medium">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all text-sm font-medium"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}