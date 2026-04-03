const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cropType: {
        type: String,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    previousSales: {
        type: Number,
        default: 0
    },
    predictedDemand: {
        type: Number,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    aiAnalysis: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    autoIndex: true,
    bufferCommands: false
});

module.exports = mongoose.model('Prediction', predictionSchema);
