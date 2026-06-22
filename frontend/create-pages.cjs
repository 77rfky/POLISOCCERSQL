const fs = require('fs');
const path = require('path');

const files = {
  'src/layouts/PublicLayout.jsx': `import { Outlet } from 'react-router-dom';\nexport default function PublicLayout() { return <div><nav>Public Nav</nav><Outlet /></div>; }`,
  'src/layouts/UserLayout.jsx': `import { Outlet } from 'react-router-dom';\nexport default function UserLayout() { return <div><nav>User Nav</nav><Outlet /></div>; }`,
  'src/layouts/AdminLayout.jsx': `import { Outlet } from 'react-router-dom';\nexport default function AdminLayout() { return <div><nav>Admin Sidebar</nav><Outlet /></div>; }`,
  'src/pages/public/Home.jsx': `export default function Home() { return <div>Home</div>; }`,
  'src/pages/public/About.jsx': `export default function About() { return <div>About</div>; }`,
  'src/pages/public/Pricing.jsx': `export default function Pricing() { return <div>Pricing</div>; }`,
  'src/pages/public/Gallery.jsx': `export default function Gallery() { return <div>Gallery</div>; }`,
  'src/pages/public/Login.jsx': `export default function Login() { return <div>Login</div>; }`,
  'src/pages/public/Register.jsx': `export default function Register() { return <div>Register</div>; }`,
  'src/pages/user/Dashboard.jsx': `export default function UserDashboard() { return <div>User Dashboard</div>; }`,
  'src/pages/user/Booking.jsx': `export default function Booking() { return <div>Booking</div>; }`,
  'src/pages/user/Payment.jsx': `export default function Payment() { return <div>Payment</div>; }`,
  'src/pages/user/History.jsx': `export default function History() { return <div>History</div>; }`,
  'src/pages/user/Profile.jsx': `export default function Profile() { return <div>Profile</div>; }`,
  'src/pages/admin/AdminDashboard.jsx': `export default function AdminDashboard() { return <div>Admin Dashboard</div>; }`,
  'src/pages/admin/UserMgmt.jsx': `export default function UserMgmt() { return <div>UserMgmt</div>; }`,
  'src/pages/admin/FieldMgmt.jsx': `export default function FieldMgmt() { return <div>FieldMgmt</div>; }`,
  'src/pages/admin/PricingMgmt.jsx': `export default function PricingMgmt() { return <div>PricingMgmt</div>; }`,
  'src/pages/admin/BookingMgmt.jsx': `export default function BookingMgmt() { return <div>BookingMgmt</div>; }`,
  'src/pages/admin/PaymentVerification.jsx': `export default function PaymentVerification() { return <div>PaymentVerification</div>; }`,
  'src/pages/admin/GalleryMgmt.jsx': `export default function GalleryMgmt() { return <div>GalleryMgmt</div>; }`,
  'src/pages/admin/CancellationMgmt.jsx': `export default function CancellationMgmt() { return <div>CancellationMgmt</div>; }`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content);
}
console.log('Pages generated');
