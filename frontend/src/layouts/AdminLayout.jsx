import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/ui/DashboardSidebar';
import {
  FaTachometerAlt, FaUsers, FaFootballBall,
  FaTags, FaCalendarCheck, FaCreditCard, FaImages,
  FaBan
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AdminLayout() {
  const navItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'User Management' },
    { path: '/admin/fields', icon: FaFootballBall, label: 'Field Management' },
    { path: '/admin/pricing', icon: FaTags, label: 'Pricing Management' },
    { path: '/admin/bookings', icon: FaCalendarCheck, label: 'Bookings' },
    { path: '/admin/payments', icon: FaCreditCard, label: 'Payments' },
    { path: '/admin/gallery', icon: FaImages, label: 'Gallery' },
    { path: '/admin/cancellations', icon: FaBan, label: 'Cancellations' },
  ];

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden text-text-primary font-sans">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-brand-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50rem] h-[50rem] bg-indigo-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <DashboardSidebar menuItems={navItems} role="ADMIN" />

      {/* Main Content Area */}
      <main className="flex-1 ml-[320px] p-8 lg:p-10 relative z-10 min-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}