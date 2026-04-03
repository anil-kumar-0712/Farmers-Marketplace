const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: [true, 'Please add a crop name'],
        trim: true
    },
    pricePerKg: {
        type: Number,
        required: [true, 'Please add a price']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity']
    },
    farmer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Crop', cropSchema);
