// Load configuration
const dotenv = require('dotenv');
// Ensure dotenv is called before any other imports that might use env vars
dotenv.config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const cropRoutes = require('./routes/cropRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// 1. Basic Middleware
app.use(express.json()); // Body parser
app.use(cors());         // Enable CORS

// Request Logger
app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
        if (res.statusCode >= 400) {
            console.log(`  > Headers: ${JSON.stringify(req.headers)}`);
            console.log(`  > Body Keys: ${Object.keys(req.body || {})}`);
        }
    });
    next();
});

const axios = require('axios');

// 2. Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// News Proxy
app.get('/api/news/agri', async (req, res) => {
    try {
        const rssUrl = 'https://news.google.com/rss/search?q=agriculture+india+news&hl=en-IN&gl=IN&ceid=IN:en';
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        res.json(response.data);
    } catch (error) {
        console.error('News Proxy Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// 3. Frontend Static Assets
app.use(express.static(path.join(__dirname, '../frontend/react_app/dist')));

// SPA Catch-all
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/react_app/dist/index.html'), (err) => {
        if (err) {
            console.error('File Send Error:', err);
            res.status(500).send(err);
        }
    });
});

// 4. Error Handling (Must be last)
app.use(errorHandler);

// 5. SERVER STARTUP
const DEFAULT_PORT = process.env.PORT || 5000;


const startServer = async () => {
    try {
        console.log('🚀 Finalizing Application Initialization...');

        // Ensure DB is connected BEFORE we start listening for requests
        await connectDB();

        // HTTPS Options
        const httpsOptions = {
            pfx: fs.readFileSync(path.join(__dirname, 'certs/server.pfx')),
            passphrase: 'password'
        };

        const server = app.listen(Number(DEFAULT_PORT), () => {
            console.log('\n' + '⭐'.repeat(30));
            console.log(`🚀 SERVER RUNNING (HTTP)`);
            console.log(`📡 PORT: ${DEFAULT_PORT}`);
            console.log(`🌐 URL: http://localhost:${DEFAULT_PORT}`);
            console.log('⭐'.repeat(30) + '\n');
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`⚠️  Port ${DEFAULT_PORT} is in use, trying ${Number(DEFAULT_PORT) + 1}...`);
                // Note: Recursive listen for HTTP server (simplified)
                app.listen(Number(DEFAULT_PORT) + 1);
            } else {
                console.error('\n❌ SERVER ERROR:', err.message);
                process.exit(1);
            }
        });

    } catch (err) {
        console.error('\n❌ CRITICAL STARTUP ERROR:', err.message);
        process.exit(1);
    }
};

startServer();
