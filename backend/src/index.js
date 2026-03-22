require('dotenv').config();
const dns = require('dns');
const https = require('https');
dns.setDefaultResultOrder('ipv4first');
https.globalAgent = new https.Agent({ family: 4 });
const express = require('express');

const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.set('trust proxy', 1); // Trust first proxy for rate limiters backing onto Render/Nginx
app.use(morgan('dev')); // HTTP request logger

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ];

app.use(cors({
    origin: (origin, callback) => {
        // In development, we can be more permissive to unblock the user immediately
        if (process.env.NODE_ENV === 'development') {
            console.log(`CORS (Dev Mode) - Allowing origin: ${origin || 'no-origin'}`);
            return callback(null, true);
        }

        // Log origin for debugging in production
        console.log(`Incoming request from origin: ${origin || 'no-origin'}`);

        // Allow requests with no origin
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true
}));

app.use(express.json());

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const newsRoutes = require('./routes/newsRoutes');
const toolRoutes = require('./routes/toolRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const searchRoutes = require('./routes/searchRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { optimizeSEO } = require('./controllers/seoController');


// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/logs', activityLogRoutes);
app.post('/api/seo/optimize', optimizeSEO);

// Initialize Prisma Connection
const prisma = require('./config/prisma');
prisma.$connect()
    .then(() => console.log('Prisma disconnected nicely... just kidding, Prisma PostgreSQL Connected!'))
    .catch(err => console.log('Prisma Connection Error:', err));

const errorHandler = require('./middleware/errorHandler');

// Fallback for 404 Routes
app.use((req, res, next) => {
    next(new (require('./utils/AppError'))(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});