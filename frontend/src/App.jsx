import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Pricing from './pages/public/Pricing';
import Gallery from './pages/public/Gallery';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import Booking from './pages/user/Booking';
import Payment from './pages/user/Payment';
import History from './pages/user/History';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserMgmt from './pages/admin/UserMgmt';
import FieldMgmt from './pages/admin/FieldMgmt';
import PricingMgmt from './pages/admin/PricingMgmt';
import BookingMgmt from './pages/admin/BookingMgmt';
import PaymentVerification from './pages/admin/PaymentVerification';
import GalleryMgmt from './pages/admin/GalleryMgmt';
import CancellationMgmt from './pages/admin/CancellationMgmt';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
        </Route>

        {/* User Routes (Protected) */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="payment" element={<Payment />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserMgmt />} />
          <Route path="fields" element={<FieldMgmt />} />
          <Route path="pricing" element={<PricingMgmt />} />
          <Route path="bookings" element={<BookingMgmt />} />
          <Route path="payments" element={<PaymentVerification />} />
          <Route path="gallery" element={<GalleryMgmt />} />
          <Route path="cancellations" element={<CancellationMgmt />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
