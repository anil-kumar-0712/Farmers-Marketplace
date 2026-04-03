const mongoose = require('mongoose');

// 1. Disable buffering globally. 
// This prevents Mongoose from queueing operations if the connection drops.
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('❌ FATAL: MONGO_URI is missing from .env');
        process.exit(1);
    }

    // 2. Specialized options
    const options = {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        // directConnection: true,         // Removed because it conflicts with mongodb+srv
        tlsAllowInvalidCertificates: true // Hotspot stability
    };

    console.log('⏳ Connecting to MongoDB Atlas...');

    try {
        // 3. Establish connection
        const conn = await mongoose.connect(uri, options);

        // 4. CRITICAL: Run a ping command to verify the connection is actually usable.
        await conn.connection.db.admin().command({ ping: 1 });

        console.log(`✅ DATABASE READY: ${conn.connection.host}`);
        console.log(`📂 Connected to: ${conn.connection.name}`);

        return conn;
    } catch (err) {
        console.error(`\n❌ DATABASE CONNECTION FAILED:`);
        console.error(`Message: ${err.message}`);

        // 5. Context-aware error reporting
        if (err.name === 'MongooseServerSelectionError' || err.message.includes('ReplicaSetNoPrimary') || err.message.includes('querySrv')) {
            console.error('\n--- FINAL TROUBLESHOOTING ---');
            console.error('1. You are on a hotspot: If this fails, even the hotspot carrier might be blocking port 27017.');
            console.error('2. Try a VPN: This often works when hotspots fail.');
            console.error('3. Check Atlas dashboard: Ensure cluster is NOT paused and IP 0.0.0.0/0 is Active.');
            console.error('----------------------\n');
        }

        // Throw error so server.js knows to fail
        throw err;
    }
};

module.exports = connectDB;
