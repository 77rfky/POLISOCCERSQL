const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Add CORS headers manually since CORS library was removed
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/authRoutes');
const fieldsRoutes = require('./routes/fieldsRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const cancellationsRoutes = require('./routes/cancellationsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const testRoutes = require('./routes/testRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/cancellations', cancellationsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/test', testRoutes);

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "POLISOCCER Backend Running"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
