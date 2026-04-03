const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to:', uri.split('@')[1]); // Log only host part

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            family: 4
        });
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    } catch (err) {
        console.log('FAILURE: ' + err.message);
        if (err.reason) {
            console.log('REASON: ' + JSON.stringify(err.reason, null, 2));
        }
        process.exit(1);
    }
};

testConnection();

